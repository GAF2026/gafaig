import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sfQueryResult } from "@/lib/snowflake";
import { requireAdmin } from "@/lib/auth/require";

type ActorRow = {
  ACTOR: string;
};

type ColumnRow = {
  TABLE_NAME: string;
  COLUMN_NAME: string;
};

type GenericRow = Record<string, any>;

// IMPORTANT:
// V_PUBLIC_REGISTRY is intentionally excluded because it is currently broken
// in Snowflake and references invalid identifier ENTITY_TYPE.
const CORE_OBJECTS = [
  "V_REGISTRY_PUBLIC",
  "V_REGISTRY_EXPORT_V1",
  "REGISTRY_SNAPSHOTS",
  "VERIFICATION_CASES",
  "REGISTRY_AI_SYSTEMS",
] as const;

function upperSet(values: string[]) {
  return new Set(values.map((v) => String(v || "").toUpperCase()));
}

function hasAll(set: Set<string>, cols: string[]) {
  return cols.every((c) => set.has(c.toUpperCase()));
}

function firstPresent(set: Set<string>, candidates: string[]) {
  return candidates.find((c) => set.has(c.toUpperCase())) || null;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return null;
}

async function getObjectColumns(objectName: string) {
  const res = await sfQueryResult<ColumnRow>(
    `
    SELECT TABLE_NAME, COLUMN_NAME
    FROM GAFAIG_DB.INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'CORE'
      AND TABLE_NAME = ?
    ORDER BY ORDINAL_POSITION
    `,
    [objectName]
  );

  if (!res.ok) {
    return {
      ok: false as const,
      objectName,
      error: res.error || "Unknown Snowflake error",
      columns: [] as string[],
      set: new Set<string>(),
    };
  }

  const columns = (res.rows || []).map((r) => r.COLUMN_NAME);
  return {
    ok: true as const,
    objectName,
    columns,
    set: upperSet(columns),
  };
}

async function tryResolveRegistryIdByCaseId(
  objectName: string,
  columnSet: Set<string>,
  caseId: string
) {
  if (!hasAll(columnSet, ["CASE_ID", "REGISTRY_ID"])) {
    return {
      ok: true as const,
      matched: false,
      row: null as GenericRow | null,
      reason: "Missing CASE_ID and/or REGISTRY_ID",
    };
  }

  const orderCol =
    firstPresent(columnSet, ["CERTIFIED_AT", "CREATED_AT", "UPDATED_AT"]) ||
    "CASE_ID";

  const res = await sfQueryResult<GenericRow>(
    `
    SELECT CASE_ID, REGISTRY_ID
    FROM GAFAIG_DB.CORE.${objectName}
    WHERE CASE_ID = ?
    ORDER BY ${orderCol} DESC NULLS LAST
    LIMIT 1
    `,
    [caseId]
  );

  if (!res.ok) {
    return {
      ok: false as const,
      matched: true,
      error: res.error || "Unknown Snowflake error",
      row: null as GenericRow | null,
    };
  }

  return {
    ok: true as const,
    matched: true,
    row: res.rows?.[0] || null,
  };
}

async function tryResolveApplicationIdByCaseId(
  objectName: string,
  columnSet: Set<string>,
  caseId: string
) {
  if (!hasAll(columnSet, ["CASE_ID", "APPLICATION_ID"])) {
    return {
      ok: true as const,
      matched: false,
      row: null as GenericRow | null,
      reason: "Missing CASE_ID and/or APPLICATION_ID",
    };
  }

  const orderCol =
    firstPresent(columnSet, ["CERTIFIED_AT", "CREATED_AT", "UPDATED_AT"]) ||
    "CASE_ID";

  const res = await sfQueryResult<GenericRow>(
    `
    SELECT CASE_ID, APPLICATION_ID
    FROM GAFAIG_DB.CORE.${objectName}
    WHERE CASE_ID = ?
    ORDER BY ${orderCol} DESC NULLS LAST
    LIMIT 1
    `,
    [caseId]
  );

  if (!res.ok) {
    return {
      ok: false as const,
      matched: true,
      error: res.error || "Unknown Snowflake error",
      row: null as GenericRow | null,
    };
  }

  return {
    ok: true as const,
    matched: true,
    row: res.rows?.[0] || null,
  };
}

async function tryResolveRegistryIdByApplicationId(
  objectName: string,
  columnSet: Set<string>,
  applicationId: string
) {
  if (!hasAll(columnSet, ["APPLICATION_ID", "REGISTRY_ID"])) {
    return {
      ok: true as const,
      matched: false,
      row: null as GenericRow | null,
      reason: "Missing APPLICATION_ID and/or REGISTRY_ID",
    };
  }

  const orderCol =
    firstPresent(columnSet, ["CERTIFIED_AT", "CREATED_AT", "UPDATED_AT"]) ||
    "APPLICATION_ID";

  const res = await sfQueryResult<GenericRow>(
    `
    SELECT APPLICATION_ID, REGISTRY_ID
    FROM GAFAIG_DB.CORE.${objectName}
    WHERE APPLICATION_ID = ?
    ORDER BY ${orderCol} DESC NULLS LAST
    LIMIT 1
    `,
    [applicationId]
  );

  if (!res.ok) {
    return {
      ok: false as const,
      matched: true,
      error: res.error || "Unknown Snowflake error",
      row: null as GenericRow | null,
    };
  }

  return {
    ok: true as const,
    matched: true,
    row: res.rows?.[0] || null,
  };
}

function extractProcedureResultRow(rows: GenericRow[] | undefined) {
  const row = rows?.[0];
  if (!row) return null;

  const direct =
    row.RESULT ??
    row.result ??
    row.SP_PUBLISH_CASE_TO_REGISTRY_V4 ??
    row.SP_PUBLISH_CASE_TO_REGISTRY_V3 ??
    null;

  if (direct) return direct;

  const firstKey = Object.keys(row)[0];
  return firstKey ? row[firstKey] : null;
}

function extractRegistryIdFromProcedureResult(result: any): string | null {
  if (!result) return null;

  if (typeof result === "string") {
    return firstString(result);
  }

  if (typeof result === "object") {
    return (
      firstString(
        result.REGISTRY_ID,
        result.registryId,
        result.registry_id,
        result.PUBLIC_REGISTRY_ID
      ) || null
    );
  }

  return null;
}

export async function POST(
  req: NextRequest,
  ctx: { params: { caseId: string } }
) {
  try {
    await requireAdmin(req);

    const caseId = (ctx?.params?.caseId || "").trim();
    if (!caseId) {
      return NextResponse.json(
        { ok: false, error: "Missing caseId" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const notes =
      typeof body?.notes === "string" && body.notes.trim()
        ? body.notes.trim()
        : "Initial public registry publish";

    const actorRes = await sfQueryResult<ActorRow>(
      `SELECT CURRENT_USER() AS ACTOR`
    );
    const actor =
      actorRes.ok && actorRes.rows?.[0]?.ACTOR
        ? actorRes.rows[0].ACTOR
        : "admin";

    const callRes = await sfQueryResult<any>(
      `CALL GAFAIG_DB.CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4(?, ?)`,
      [caseId, actor]
    );

    if (!callRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Publish failed",
          details: callRes.error || "Unknown Snowflake error",
          hint:
            "Ensure GAFAIG_APP_ROLE has USAGE on GAFAIG_DB.CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4(VARCHAR, VARCHAR).",
        },
        { status: 500 }
      );
    }

    let registryId =
      extractRegistryIdFromProcedureResult(
        extractProcedureResultRow(callRes.rows)
      ) || null;

    let applicationId: string | null = null;

    const debug: Record<string, any> = {
      caseId,
      actor,
      notes,
      inspectedObjects: [],
      resolutionPath: [],
      procedureResult: callRes.rows?.[0] ?? null,
    };

    const objectMeta: Record<string, { columns: string[]; set: Set<string> }> =
      {};

    for (const objectName of CORE_OBJECTS) {
      const meta = await getObjectColumns(objectName);

      if (!meta.ok) {
        debug.inspectedObjects.push({
          objectName,
          ok: false,
          error: meta.error,
        });
        continue;
      }

      objectMeta[objectName] = {
        columns: meta.columns,
        set: meta.set,
      };

      debug.inspectedObjects.push({
        objectName,
        ok: true,
        columns: meta.columns,
      });
    }

    if (!registryId) {
      for (const objectName of CORE_OBJECTS) {
        if (registryId) break;
        const meta = objectMeta[objectName];
        if (!meta) continue;

        const res = await tryResolveRegistryIdByCaseId(
          objectName,
          meta.set,
          caseId
        );

        if (!res.ok) {
          debug.resolutionPath.push({
            step: `${objectName}:CASE_ID->REGISTRY_ID`,
            ok: false,
            error: res.error,
          });
          continue;
        }

        if (!res.matched) {
          debug.resolutionPath.push({
            step: `${objectName}:CASE_ID->REGISTRY_ID`,
            ok: true,
            skipped: true,
            reason: res.reason,
          });
          continue;
        }

        registryId = res.row?.REGISTRY_ID || null;

        debug.resolutionPath.push({
          step: `${objectName}:CASE_ID->REGISTRY_ID`,
          ok: true,
          rowCount: res.row ? 1 : 0,
          registryId,
        });
      }
    }

    if (!registryId && !applicationId) {
      for (const objectName of CORE_OBJECTS) {
        if (applicationId) break;
        const meta = objectMeta[objectName];
        if (!meta) continue;

        const res = await tryResolveApplicationIdByCaseId(
          objectName,
          meta.set,
          caseId
        );

        if (!res.ok) {
          debug.resolutionPath.push({
            step: `${objectName}:CASE_ID->APPLICATION_ID`,
            ok: false,
            error: res.error,
          });
          continue;
        }

        if (!res.matched) {
          debug.resolutionPath.push({
            step: `${objectName}:CASE_ID->APPLICATION_ID`,
            ok: true,
            skipped: true,
            reason: res.reason,
          });
          continue;
        }

        applicationId = res.row?.APPLICATION_ID || null;

        debug.resolutionPath.push({
          step: `${objectName}:CASE_ID->APPLICATION_ID`,
          ok: true,
          rowCount: res.row ? 1 : 0,
          applicationId,
        });
      }
    }

    if (!registryId && applicationId) {
      for (const objectName of CORE_OBJECTS) {
        if (registryId) break;
        const meta = objectMeta[objectName];
        if (!meta) continue;

        const res = await tryResolveRegistryIdByApplicationId(
          objectName,
          meta.set,
          applicationId
        );

        if (!res.ok) {
          debug.resolutionPath.push({
            step: `${objectName}:APPLICATION_ID->REGISTRY_ID`,
            ok: false,
            error: res.error,
          });
          continue;
        }

        if (!res.matched) {
          debug.resolutionPath.push({
            step: `${objectName}:APPLICATION_ID->REGISTRY_ID`,
            ok: true,
            skipped: true,
            reason: res.reason,
          });
          continue;
        }

        registryId = res.row?.REGISTRY_ID || null;

        debug.resolutionPath.push({
          step: `${objectName}:APPLICATION_ID->REGISTRY_ID`,
          ok: true,
          rowCount: res.row ? 1 : 0,
          registryId,
        });
      }
    }

    if (!registryId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Publish succeeded, but failed to resolve registry/application",
          applicationId,
          registryId,
          debug,
        },
        { status: 500 }
      );
    }

    const linkRes = await sfQueryResult<any>(
      `
      UPDATE GAFAIG_DB.CORE.REGISTRY_AI_SYSTEMS
      SET REGISTRY_ID = ?
      WHERE CASE_ID = ?
        AND (REGISTRY_ID IS NULL OR REGISTRY_ID <> ?)
      `,
      [registryId, caseId, registryId]
    );

    if (!linkRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Publish succeeded, but AI systems linkage failed",
          details: linkRes.error || "Unknown Snowflake error",
          registryId,
          applicationId,
          debug,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      caseId,
      actor,
      notes,
      applicationId,
      registryId,
      result: callRes.rows?.[0] ?? null,
      aiSystemsLinked: true,
      debug,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
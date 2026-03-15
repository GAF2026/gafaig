import { NextRequest, NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PublishRequestBody = {
  caseId?: string;
  approvedBy?: string;
};

type StoredProcResult = {
  ok?: boolean;
  caseId?: string;
  snapshotId?: string;
  finalScore?: number | string | null;
  tier?: string | null;
  band?: string | null;
};

type RegistryRow = {
  REGISTRY_ID: string | null;
  CASE_ID: string | null;
  APPLICATION_ID: string | null;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFIED_SCORE: number | string | null;
  DECISION_STATUS: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
  LAST_ACTIVITY_AT: string | null;
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const out = String(value).trim();
  return out.length ? out : null;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function firstColumnValue(row: Record<string, unknown> | undefined) {
  if (!row) return null;
  const firstKey = Object.keys(row)[0];
  return firstKey ? row[firstKey] : null;
}

function parseStoredProcPayload(
  row: Record<string, unknown> | undefined
): StoredProcResult | null {
  const raw = firstColumnValue(row);

  if (!raw) return null;

  if (typeof raw === "object") {
    return raw as StoredProcResult;
  }

  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as StoredProcResult;
    } catch {
      return null;
    }
  }

  return null;
}

function buildVerifyEndpoint(registryId: string) {
  return `/api/verify/${registryId}`;
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as PublishRequestBody;

    const caseId = asString(body.caseId)?.toUpperCase();
    const approvedBy = asString(body.approvedBy) ?? "demo-admin";

    if (!caseId) {
      return NextResponse.json(
        { ok: false, error: "Missing caseId" },
        { status: 400 }
      );
    }

    const procRows = await sfQuery<Record<string, unknown>>(
      `CALL GAFAIG_DB.CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(?, ?)`,
      [caseId, approvedBy]
    );

    const procPayload = parseStoredProcPayload(procRows[0]);

    const registryRows = await sfQuery<RegistryRow>(
      `
      SELECT
        REGISTRY_ID,
        CASE_ID,
        APPLICATION_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        CERTIFIED_SCORE,
        DECISION_STATUS,
        VALID_FROM,
        VALID_TO,
        CERTIFIED_AT,
        LAST_ACTIVITY_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE CASE_ID = ?
      ORDER BY CERTIFIED_AT DESC NULLS LAST, LAST_ACTIVITY_AT DESC NULLS LAST
      LIMIT 1
      `,
      [caseId]
    );

    const row = registryRows[0];

    const registryId = asString(row?.REGISTRY_ID);
    const snapshotId = asString(procPayload?.snapshotId);
    const certifiedTier = asString(row?.CERTIFIED_TIER) ?? asString(procPayload?.tier);
    const certifiedBand = asString(row?.CERTIFIED_BAND) ?? asString(procPayload?.band);
    const finalScore =
      asNumber(row?.CERTIFIED_SCORE) ?? asNumber(procPayload?.finalScore);

    if (!registryId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Publish completed but no public registry record was found.",
          caseId,
          snapshotId,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      status: "published",
      caseId,
      snapshotId,
      registryId,
      verifyEndpoint: buildVerifyEndpoint(registryId),
      certifiedTier,
      certifiedBand,
      finalScore,
      record: row
        ? {
            registryId,
            caseId: asString(row.CASE_ID),
            applicationId: asString(row.APPLICATION_ID),
            entityName: asString(row.ENTITY_NAME),
            entityType: asString(row.ENTITY_TYPE),
            country: asString(row.COUNTRY),
            certifiedTier,
            certifiedBand,
            finalScore,
            decisionStatus: asString(row.DECISION_STATUS),
            validFrom: asString(row.VALID_FROM),
            validTo: asString(row.VALID_TO),
            certifiedAt: asString(row.CERTIFIED_AT),
            lastActivityAt: asString(row.LAST_ACTIVITY_AT),
          }
        : null,
      proc: procPayload,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Registry publish failed.",
      },
      { status: 500 }
    );
  }
}
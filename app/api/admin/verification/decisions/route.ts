import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery, snowflakeCtx } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function getParam(req: NextRequest, key: string) {
  return (req.nextUrl?.searchParams?.get(key) || "").trim();
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return null;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

const DECISIONS_TABLE = "GAFAIG_DB.CORE.VERIFICATION_DECISIONS";
const CASES_TABLE = "GAFAIG_DB.CORE.VERIFICATION_CASES";
const EVENTS_TABLE = "GAFAIG_DB.CORE.VERIFICATION_EVENTS";

async function getLatestDecision(caseId: string) {
  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      DECISION_ID,
      CASE_ID,
      DECISION,
      DECIDED_BY,
      TO_VARCHAR(DECIDED_AT, 'YYYY-MM-DD HH24:MI:SS') AS DECIDED_AT,
      SUMMARY,
      CONDITIONS
    FROM ${DECISIONS_TABLE}
    WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
    ORDER BY DECIDED_AT DESC, DECISION_ID DESC
    LIMIT 1
    `,
    [caseId],
  );

  const row = rows?.[0] ?? null;

  return row
    ? {
        decisionId: firstString(row.DECISION_ID),
        caseId: firstString(row.CASE_ID),
        decision: firstString(row.DECISION),
        decidedBy: firstString(row.DECIDED_BY),
        decidedAt: firstString(row.DECIDED_AT),
        summary: firstString(row.SUMMARY),
        conditions: firstString(row.CONDITIONS),
      }
    : null;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401,
      );
    }

    const caseId = getParam(req, "caseId");
    if (!caseId) {
      return json({ ok: false, error: "Missing query param: caseId" }, 400);
    }

    const row = await getLatestDecision(caseId);

    return json({
      ok: true,
      row,
    });
  } catch (e) {
    return json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Failed to load decision",
        ctx: snowflakeCtx(),
      },
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401,
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      caseId?: string;
      decision?: string;
      summary?: string;
      conditions?: string;
      actor?: string;
    };

    const caseId = String(body.caseId || "").trim();
    const decision = String(body.decision || "").trim().toLowerCase();
    const summary = String(body.summary || "").trim();
    const conditions = String(body.conditions || "").trim();
    const actor = String(body.actor || "admin").trim();

    if (!caseId || !decision) {
      return json({ ok: false, error: "Missing fields" }, 400);
    }

    if (!["approved", "rejected", "suspended"].includes(decision)) {
      return json({ ok: false, error: "Invalid decision" }, 400);
    }

    const caseRows = await sfQuery<Record<string, unknown>>(
      `
      SELECT CASE_ID
      FROM ${CASES_TABLE}
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      LIMIT 1
      `,
      [caseId],
    );

    if (!caseRows?.length) {
      return json({ ok: false, error: "Case not found" }, 404);
    }

    const decisionId = makeId("DEC");
    const eventId = makeId("EVT");

    await sfQuery(
      `
      INSERT INTO ${DECISIONS_TABLE} (
        DECISION_ID,
        CASE_ID,
        DECISION,
        DECIDED_BY,
        DECIDED_AT,
        SUMMARY,
        CONDITIONS
      )
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?)
      `,
      [
        decisionId,
        caseId,
        decision,
        actor,
        summary || null,
        conditions || null,
      ],
    );

    await sfQuery(
      `
      INSERT INTO ${EVENTS_TABLE} (
        EVENT_ID,
        CASE_ID,
        EVENT_TYPE,
        ACTOR,
        DETAILS,
        CREATED_AT
      )
      SELECT ?, ?, ?, ?, PARSE_JSON(?), CURRENT_TIMESTAMP()
      `,
      [
        eventId,
        caseId,
        `case_${decision}`,
        actor,
        JSON.stringify({
          decisionId,
          decision,
          summary: summary || null,
          conditions: conditions || null,
        }),
      ],
    );

    await sfQuery(
      `
      UPDATE ${CASES_TABLE}
      SET STATUS = ?, UPDATED_AT = CURRENT_TIMESTAMP()
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      `,
      [decision, caseId],
    );

    if (decision === "approved") {
      await sfQuery(
        `CALL GAFAIG_DB.CORE.APPROVE_CASE_V1(?, ?, ?)`,
        [caseId, actor, summary || null],
      );
    }

    const row = await getLatestDecision(caseId);

    return json({
      ok: true,
      caseId,
      decision,
      row,
      ctx: snowflakeCtx(),
    });
  } catch (e) {
    return json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Failed to save decision",
        ctx: snowflakeCtx(),
      },
      500,
    );
  }
}
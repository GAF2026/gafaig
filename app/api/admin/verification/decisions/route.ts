import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery, snowflakeCtx } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DECISIONS_TABLE = "GAFAIG_DB.CORE.VERIFICATION_DECISIONS";
const CASES_TABLE = "GAFAIG_DB.CORE.VERIFICATION_CASES";
const EVENTS_TABLE = "GAFAIG_DB.CORE.VERIFICATION_EVENTS";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function normalizeCaseId(id: string) {
  return id.trim().toUpperCase();
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return null;
}

function getParam(req: NextRequest, key: string) {
  return (req.nextUrl?.searchParams?.get(key) || "").trim();
}

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
      CONDITIONS,
      ORG_ID
    FROM ${DECISIONS_TABLE}
    WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
    ORDER BY DECIDED_AT DESC, DECISION_ID DESC
    LIMIT 1
    `,
    [caseId]
  );

  const row = rows?.[0];

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
      return json({ ok: false, error: auth.error }, auth.status ?? 401);
    }

    const rawCaseId = getParam(req, "caseId");
    if (!rawCaseId) {
      return json({ ok: false, error: "Missing caseId" }, 400);
    }

    const caseId = normalizeCaseId(rawCaseId);
    const row = await getLatestDecision(caseId);

    return json({ ok: true, row });
  } catch (e) {
    return json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "GET failed",
        ctx: snowflakeCtx,
      },
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json({ ok: false, error: auth.error }, auth.status ?? 401);
    }

    const body = await req.json();

    const rawCaseId = String(body.caseId || "").trim();
    const decision = String(body.decision || "").trim().toLowerCase();
    const summary = String(body.summary || "").trim();
    const conditions = String(body.conditions || "").trim();

    if (!rawCaseId || !decision) {
      return json({ ok: false, error: "Missing fields" }, 400);
    }

    if (!["approved", "rejected", "suspended"].includes(decision)) {
      return json({ ok: false, error: "Invalid decision" }, 400);
    }

    const caseId = normalizeCaseId(rawCaseId);
    const actor = "admin";
    const decisionId = makeId("DEC");
    const eventId = makeId("EVT");

    // Pull ORG_ID from the canonical case row so the row access policy can see the decision row.
    const caseRows = await sfQuery<Record<string, unknown>>(
      `
      SELECT
        CASE_ID,
        ORG_ID
      FROM ${CASES_TABLE}
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      LIMIT 1
      `,
      [caseId]
    );

    const caseRow = caseRows?.[0];
    if (!caseRow) {
      return json({ ok: false, error: "Case not found" }, 404);
    }

    const orgId = firstString(caseRow.ORG_ID);
    if (!orgId) {
      return json(
        {
          ok: false,
          error: "Case ORG_ID is missing; cannot write decision row under row access policy.",
        },
        500
      );
    }

    await sfQuery(
      `
      INSERT INTO ${DECISIONS_TABLE} (
        DECISION_ID,
        CASE_ID,
        DECISION,
        DECIDED_BY,
        DECIDED_AT,
        SUMMARY,
        CONDITIONS,
        CREATED_AT,
        ORG_ID
      )
      SELECT ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, CURRENT_TIMESTAMP(), ?
      `,
      [
        decisionId,
        caseId,
        decision,
        actor,
        summary || null,
        conditions || null,
        orgId,
      ]
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
        "decision_recorded",
        actor,
        JSON.stringify({
          decisionId,
          decision,
          summary: summary || null,
          conditions: conditions || null,
          orgId,
        }),
      ]
    );

    if (decision === "approved") {
      await sfQuery(
        `CALL GAFAIG_DB.CORE.APPROVE_CASE_V1(?, ?, ?)`,
        [caseId, actor, summary || null]
      );
    }

    const row = await getLatestDecision(caseId);

    if (!row) {
      return json(
        {
          ok: false,
          error: "Decision row was inserted but is still not readable after save.",
          ctx: snowflakeCtx,
        },
        500
      );
    }

    return json({
      ok: true,
      caseId,
      decision,
      decisionId,
      row,
    });
  } catch (e) {
    return json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "POST failed",
        snowflakeCtx,
      },
      500
    );
  }
}
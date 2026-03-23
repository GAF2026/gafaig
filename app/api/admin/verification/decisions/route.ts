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

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json({ ok: false, error: auth.error ?? "Unauthorized" }, auth.status ?? 401);
    }

    const caseId = getParam(req, "caseId");
    if (!caseId) {
      return json({ ok: false, error: "Missing query param: caseId" }, 400);
    }

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
      ORDER BY DECIDED_AT DESC
      LIMIT 1
      `,
      [caseId]
    );

    const row = rows?.[0] ?? null;

    return json({
      ok: true,
      row: row
        ? {
            decisionId: firstString(row.DECISION_ID),
            caseId: firstString(row.CASE_ID),
            decision: firstString(row.DECISION),
            decidedBy: firstString(row.DECIDED_BY),
            decidedAt: firstString(row.DECIDED_AT),
            summary: firstString(row.SUMMARY),
            conditions: firstString(row.CONDITIONS),
          }
        : null,
    });
  } catch (e) {
    return json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Failed to load decision",
        ctx: snowflakeCtx(),
      },
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json({ ok: false, error: auth.error ?? "Unauthorized" }, auth.status ?? 401);
    }

    const body = await req.json();

    const caseId = String(body.caseId || "").trim();
    const decision = String(body.decision || "").trim().toLowerCase();
    const summary = String(body.summary || "").trim();
    const conditions = String(body.conditions || "").trim();
    const actor = "admin";

    if (!caseId || !decision) {
      return json({ ok: false, error: "Missing fields" }, 400);
    }

    if (!["approved", "rejected", "suspended"].includes(decision)) {
      return json({ ok: false, error: "Invalid decision" }, 400);
    }

    // ✅ ALWAYS INSERT DECISION RECORD (CRITICAL FIX)
    const decisionId = makeId("DEC");

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
      SELECT ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?
      `,
      [
        decisionId,
        caseId,
        decision,
        actor,
        summary || null,
        conditions || null,
      ]
    );

    // ✅ THEN call procedure (optional but preserved)
    if (decision === "approved") {
      await sfQuery(
        `CALL GAFAIG_DB.CORE.APPROVE_CASE_V1(?, ?, ?)`,
        [caseId, actor, summary || null]
      );
    }

    return json({
      ok: true,
      caseId,
      decision,
    });
  } catch (e) {
    return json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Failed to save decision",
        ctx: snowflakeCtx(),
      },
      500
    );
  }
}
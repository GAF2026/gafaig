import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DecisionRow = {
  decisionId: string | null;
  caseId: string | null;
  decision: string | null;
  decidedBy: string | null;
  decidedAt: string | null;
  summary: string | null;
  conditions: string | null;
};

const ALLOWED_DECISIONS = new Set(["approved", "rejected", "suspended"]);

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeId(value: unknown): string {
  return String(value ?? "").trim().toUpperCase();
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return null;
}

function parseProcedureResult(rows: any[]) {
  const first = rows?.[0];
  if (!first) return null;

  const raw =
    first["APPROVE_CASE_V1"] ??
    first["UNAPPROVE_CASE_V1"] ??
    first["approve_case_v1"] ??
    first["unapprove_case_v1"] ??
    Object.values(first)[0];

  if (!raw) return null;

  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  return raw;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401
      );
    }

    const url = new URL(req.url);
    const caseId = normalizeId(url.searchParams.get("caseId"));

    if (!caseId) {
      return json({ ok: false, error: "Missing caseId" }, 400);
    }

    const sql = `
      SELECT
        DECISION_ID,
        CASE_ID,
        DECISION,
        DECIDED_BY,
        TO_VARCHAR(DECIDED_AT, 'YYYY-MM-DD HH24:MI:SS') AS DECIDED_AT,
        SUMMARY,
        CONDITIONS
      FROM GAFAIG_DB.CORE.VERIFICATION_DECISIONS
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      ORDER BY DECIDED_AT DESC NULLS LAST, CREATED_AT DESC NULLS LAST
      LIMIT 1
    `;

    const raw = await sfQuery<any>(sql, [caseId]);
    const row = raw?.[0];

    if (!row) {
      return json({ ok: true, row: null });
    }

    const decision: DecisionRow = {
      decisionId: firstString(row.DECISION_ID),
      caseId: firstString(row.CASE_ID),
      decision: firstString(row.DECISION),
      decidedBy: firstString(row.DECIDED_BY),
      decidedAt: firstString(row.DECIDED_AT),
      summary: firstString(row.SUMMARY),
      conditions: firstString(row.CONDITIONS),
    };

    return json({ ok: true, row: decision });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to load decision",
      },
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401
      );
    }

    const body = await req.json();

    const caseId = normalizeId(body?.caseId);
    const decision = clean(body?.decision).toLowerCase();
    const decidedBy = clean(body?.decidedBy) || "admin";
    const summary = clean(body?.summary);
    const conditions = clean(body?.conditions);

    if (!caseId) {
      return json({ ok: false, error: "Missing caseId" }, 400);
    }

    if (!ALLOWED_DECISIONS.has(decision)) {
      return json(
        {
          ok: false,
          error: `Invalid decision. Allowed values: ${Array.from(
            ALLOWED_DECISIONS
          ).join(", ")}`,
        },
        400
      );
    }

    let procRows: any[];

    if (decision === "approved") {
      procRows = await sfQuery(
        `CALL GAFAIG_DB.CORE.APPROVE_CASE_V1(?, ?, ?)`,
        [caseId, decidedBy, summary || "Approved through admin verification workflow"]
      );
    } else {
      procRows = await sfQuery(
        `CALL GAFAIG_DB.CORE.UNAPPROVE_CASE_V1(?, ?, ?)`,
        [
          caseId,
          decidedBy,
          summary || conditions || `${decision} through admin verification workflow`,
        ]
      );
    }

    const proc = parseProcedureResult(procRows);

    const insertSql = `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_DECISIONS (
        DECISION_ID,
        CASE_ID,
        DECISION,
        DECIDED_BY,
        DECIDED_AT,
        SUMMARY,
        CONDITIONS,
        CREATED_AT
      )
      VALUES (
        UUID_STRING(),
        ?,
        ?,
        ?,
        CURRENT_TIMESTAMP(),
        ?,
        ?,
        CURRENT_TIMESTAMP()
      )
    `;

    await sfQuery(insertSql, [
      caseId,
      decision,
      decidedBy,
      summary || null,
      conditions || null,
    ]);

    return json({
      ok: true,
      caseId,
      decision,
      proc,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to save decision",
      },
      500
    );
  }
}
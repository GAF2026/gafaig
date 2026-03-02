import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { executeQuery, snowflakeCtx } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function getParam(req: NextRequest, key: string) {
  return (req.nextUrl?.searchParams?.get(key) || "").trim();
}

const FINDINGS_TABLE =
  process.env.GAFAIG_FINDINGS_TABLE ||
  "GAFAIG_DB.CORE.VERIFICATION_FINDINGS"; // change via env if your table/view name differs

function makeFindingId() {
  return `FND-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const caseId = getParam(req, "caseId");
    if (!caseId) return json({ ok: false, error: "Missing query param: caseId" }, 400);

    // Expect columns similar to: FINDING_ID, CASE_ID, CONTROL_ID, TITLE/CONTROL_TITLE, RESULT/DECISION, SEVERITY, RATIONALE, CREATED_AT, UPDATED_AT
    // We select * to be resilient across schema variations.
    const sql = `
      SELECT *
      FROM ${FINDINGS_TABLE}
      WHERE CASE_ID = ?
      ORDER BY COALESCE(UPDATED_AT, CREATED_AT) DESC, CREATED_AT DESC
      LIMIT 500
    `;

    const rows = await executeQuery<any>(sql, [caseId]);

    return json({
      ok: true,
      caseId,
      rows,
      total: rows.length,
      ctx: snowflakeCtx(),
      table: FINDINGS_TABLE,
    });
  } catch (e: any) {
    // Always return JSON (prevents “Non-JSON response” in UI)
    return json(
      {
        ok: false,
        error: e?.message || "Failed to load findings",
        ctx: snowflakeCtx(),
        table: FINDINGS_TABLE,
      },
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);

    const body = await req.json().catch(() => ({}));
    const caseId = String(body?.caseId || "").trim();
    if (!caseId) return json({ ok: false, error: "Missing body field: caseId" }, 400);

    // Support your UI fields (it uses Control ID / Control title / Result / Severity / Rationale)
    const controlId = String(body?.controlId || body?.control_id || "").trim();
    const title = String(body?.title || body?.controlTitle || body?.control_title || "").trim();
    const result = String(body?.result || body?.decision || "").trim(); // pass/fail/na etc
    const severity = String(body?.severity || "").trim();
    const rationale = String(body?.rationale || "").trim();

    const findingId = String(body?.findingId || "").trim() || makeFindingId();

    if (!controlId || !title) {
      return json(
        { ok: false, error: "Missing required fields: controlId and controlTitle/title" },
        400
      );
    }

    // Insert tries to match common GAFAIG columns.
    // If your table/view is read-only, this will error — but GET will still work.
    const insert = `
      INSERT INTO ${FINDINGS_TABLE} (
        FINDING_ID,
        CASE_ID,
        CONTROL_ID,
        CONTROL_TITLE,
        RESULT,
        SEVERITY,
        RATIONALE,
        CREATED_AT,
        UPDATED_AT
      )
      SELECT
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        CURRENT_TIMESTAMP(),
        CURRENT_TIMESTAMP()
    `;

    await executeQuery(insert, [
      findingId,
      caseId,
      controlId,
      title,
      result || null,
      severity || null,
      rationale || null,
    ]);

    return json({ ok: true, findingId, caseId, ctx: snowflakeCtx() });
  } catch (e: any) {
    return json(
      {
        ok: false,
        error: e?.message || "Failed to create finding",
        ctx: snowflakeCtx(),
        table: FINDINGS_TABLE,
      },
      500
    );
  }
}
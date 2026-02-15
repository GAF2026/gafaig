import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function reqStr(v: any, name: string) {
  const s = String(v ?? "").trim();
  if (!s) throw new Error(`Missing required field: ${name}`);
  return s;
}

function optStr(v: any) {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

function makeId(prefix: string) {
  // deterministic-enough ID for demo purposes
  const rand = Math.random().toString(16).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

export async function GET(_: Request, { params }: { params: { caseId: string } }) {
  try {
    const caseId = params.caseId;

    const rows = await executeQuery(
      `
      SELECT
        FINDING_ID    AS "findingId",
        CASE_ID       AS "caseId",
        CONTROL_ID    AS "controlId",
        CONTROL_TITLE AS "controlTitle",
        RESULT        AS "result",
        SEVERITY      AS "severity",
        RATIONALE     AS "rationale",
        CREATED_AT    AS "createdAt",
        UPDATED_AT    AS "updatedAt"
      FROM CORE.VERIFICATION_FINDINGS
      WHERE CASE_ID = ?
      ORDER BY UPDATED_AT DESC
      `,
      [caseId]
    );

    return NextResponse.json({
      ok: true,
      rows: rows || [],
      total: (rows || []).length,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: { params: { caseId: string } }) {
  try {
    const caseId = params.caseId;
    const body = await req.json();

    const findingId = makeId("FND");

    const controlId = reqStr(body.controlId, "controlId");
    const controlTitle = reqStr(body.controlTitle, "controlTitle");
    const result = reqStr(body.result, "result"); // pass|partial|fail|needs_more_info
    const severity = optStr(body.severity) || "medium"; // low|medium|high
    const rationale = optStr(body.rationale);

    // NOTE:
    // - We are NOT writing EVIDENCE_IDS here (ARRAY) to avoid Snowflake ARRAY/JSON binding issues.
    // - We'll add evidence linking later via a separate endpoint/table or a simple string list.
    await executeQuery(
      `
      INSERT INTO CORE.VERIFICATION_FINDINGS
        (FINDING_ID, CASE_ID, CONTROL_ID, CONTROL_TITLE, RESULT, RATIONALE, SEVERITY, CREATED_AT, UPDATED_AT)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())
      `,
      [findingId, caseId, controlId, controlTitle, result, rationale, severity]
    );

    return NextResponse.json({ ok: true, findingId });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
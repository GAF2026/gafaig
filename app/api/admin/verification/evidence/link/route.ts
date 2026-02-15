import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";

function ok(payload: any) {
  return NextResponse.json({ ok: true, ...payload });
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const caseId = String(body?.caseId ?? "").trim();
  const evidenceId = String(body?.evidenceId ?? "").trim();
  const findingId = String(body?.findingId ?? "").trim();

  if (!caseId) return bad("caseId is required");
  if (!evidenceId) return bad("evidenceId is required");
  if (!findingId) return bad("findingId is required");

  try {
    // Validate that finding belongs to this case
    const findings = await executeQuery(
      `
      SELECT FINDING_ID
      FROM GAFAIG_DB.CORE.VERIFICATION_FINDINGS
      WHERE CASE_ID = ?
        AND FINDING_ID = ?
      `,
      [caseId, findingId]
    );

    if (findings.length === 0) {
      return bad("Finding does not belong to this case");
    }

    // Insert junction record
    await executeQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_FINDING_EVIDENCE
        (FINDING_ID, EVIDENCE_ID)
      VALUES
        (?, ?)
      `,
      [findingId, evidenceId]
    );

    return ok({ linked: true });
  } catch (e: any) {
    return bad(e?.message ?? "Failed to link evidence", 500);
  }
}
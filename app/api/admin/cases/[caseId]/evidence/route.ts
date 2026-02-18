import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";
import crypto from "crypto";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

// GET: list evidence for a case
export async function GET(_req: Request, { params }: { params: { caseId: string } }) {
  const caseId = params.caseId;
  if (!caseId) return jsonError("Missing caseId", 400);

  try {
    const rows = await sfQuery(
      `
      SELECT *
      FROM GAFAIG_DB.CORE.V_EVIDENCE_UI
      WHERE CASE_ID = ?
      ORDER BY COALESCE(SUBMITTED_AT, CREATED_AT) DESC
      `,
      [caseId]
    );
    return NextResponse.json({ ok: true, rows });
  } catch (e: any) {
    return jsonError(e?.message ?? "Snowflake query failed", 500);
  }
}

// POST: create evidence record (metadata-first)
export async function POST(req: Request, { params }: { params: { caseId: string } }) {
  const caseId = params.caseId;
  if (!caseId) return jsonError("Missing caseId", 400);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const title = String(body.title ?? "").trim();
  if (!title) return jsonError("title is required", 400);

  const evidenceType = body.evidenceType ? String(body.evidenceType) : "link";
  const description = body.description ? String(body.description) : null;

  const sourceUrl = body.sourceUrl ? String(body.sourceUrl).trim() : null;
  const storageRef = body.storageRef ? String(body.storageRef).trim() : null;

  if (!sourceUrl && !storageRef) {
    return jsonError("Provide either sourceUrl or storageRef", 400);
  }

  const submittedBy = body.submittedBy ? String(body.submittedBy) : "admin@gafaig.com";

  // Match your existing pattern (your seeded IDs are like EVD-1001-POLICY)
  // For new ones we’ll do a deterministic prefix + UUID.
  const evidenceId = `EVD-${crypto.randomUUID()}`;

  try {
    await sfQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
        (EVIDENCE_ID, CASE_ID, EVIDENCE_TYPE, TITLE, DESCRIPTION, SOURCE_URL, STORAGE_REF, SUBMITTED_BY)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [evidenceId, caseId, evidenceType, title, description, sourceUrl, storageRef, submittedBy]
    );

    // Return the created row from the view (will include participant + finding title if linked later)
    const rows = await sfQuery(
      `
      SELECT *
      FROM GAFAIG_DB.CORE.V_EVIDENCE_UI
      WHERE EVIDENCE_ID = ?
      LIMIT 1
      `,
      [evidenceId]
    );

    const firstRow =
  (Array.isArray(rows) ? rows[0] : (rows as any)?.rows?.[0]) ?? null;

return NextResponse.json({ ok: true, evidenceId, row: firstRow });
  } catch (e: any) {
    return jsonError(e?.message ?? "Insert failed", 500);
  }
}
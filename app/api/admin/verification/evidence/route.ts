import { NextResponse } from "next/server";
import crypto from "crypto";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";

type EvidenceRow = {
  evidenceId: string;
  caseId: string;
  evidenceType: string;
  title: string;
  description: string | null;
  sourceUrl: string | null;
  storageRef: string | null;
  submittedBy: string | null;
  submittedAt: string | null;
};

function ok(payload: any) {
  return NextResponse.json({ ok: true, ...payload });
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

// Map Snowflake uppercase → camelCase for UI
function mapRow(r: any): EvidenceRow {
  return {
    evidenceId: r.EVIDENCE_ID,
    caseId: r.CASE_ID,
    evidenceType: r.EVIDENCE_TYPE ?? "",
    title: r.EVIDENCE_TITLE ?? r.TITLE ?? "",
    description: r.DESCRIPTION ?? null,
    sourceUrl: r.SOURCE_URL ?? null,
    storageRef: r.STORAGE_REF ?? null,
    submittedBy: r.SUBMITTED_BY ?? null,
    submittedAt: r.SUBMITTED_AT ?? r.CREATED_AT ?? null,
  };
}

/**
 * GET /api/admin/verification/evidence?caseId=CASE-0001
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const caseId = (searchParams.get("caseId") ?? "").trim();
  if (!caseId) return bad("Missing caseId");

  try {
    // Single statement only
    const rows = await executeQuery(
      `
      SELECT *
      FROM GAFAIG_DB.CORE.V_EVIDENCE_UI
      WHERE CASE_ID = ?
      ORDER BY COALESCE(SUBMITTED_AT, CREATED_AT) DESC
      `,
      [caseId]
    );

    return ok({ rows: rows.map(mapRow), total: rows.length });
  } catch (e: any) {
    return bad(e?.message ?? "Failed to load evidence", 500);
  }
}

/**
 * POST /api/admin/verification/evidence
 */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const caseId = String(body?.caseId ?? "").trim();
  if (!caseId) return bad("caseId is required");

  const evidenceType = String(body?.evidenceType ?? "link").trim();
  const title = String(body?.title ?? "").trim();
  if (!title) return bad("title is required");

  const description = body?.description ? String(body.description) : null;
  const sourceUrl = body?.sourceUrl ? String(body.sourceUrl).trim() : null;
  const storageRef = body?.storageRef ? String(body.storageRef).trim() : null;

  if (!sourceUrl && !storageRef) {
    return bad("Provide either sourceUrl or storageRef");
  }

  const submittedBy = body?.submittedBy ? String(body.submittedBy) : "admin@gafaig.com";
  const evidenceId = `EVD-${crypto.randomUUID()}`;

  try {
    // Single statement only
    await executeQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
        (EVIDENCE_ID, CASE_ID, EVIDENCE_TYPE, TITLE, DESCRIPTION, SOURCE_URL, STORAGE_REF, SUBMITTED_BY)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [evidenceId, caseId, evidenceType, title, description, sourceUrl, storageRef, submittedBy]
    );

    return ok({ evidenceId });
  } catch (e: any) {
    return bad(e?.message ?? "Failed to add evidence", 500);
  }
}
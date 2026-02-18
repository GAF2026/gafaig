import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.rows)) return result.rows;
  return [];
}

export async function GET(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    const caseId = String(params?.caseId || "").trim();
    if (!caseId) return jsonError("Missing caseId", 400);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)));
    const offset = (page - 1) * pageSize;

    // Total count
    const countSql = `
      SELECT COUNT(*)::INTEGER AS TOTAL
      FROM GAFAIG_DB.CORE.EVIDENCE
      WHERE case_id = ?
    `;
    const totalResult = await executeQuery(countSql, [caseId]);
    const totalRows = normalizeRows<any>(totalResult);
    const total = Number(totalRows?.[0]?.TOTAL ?? 0);

    // List
    const listSql = `
      SELECT
        evidence_id   AS "evidenceId",
        case_id       AS "caseId",
        evidence_type AS "evidenceType",
        title         AS "title",
        description   AS "description",
        source_url    AS "sourceUrl",
        storage_ref   AS "storageRef",
        submitted_by  AS "submittedBy",
        submitted_at  AS "submittedAt",
        created_at    AS "createdAt"
      FROM GAFAIG_DB.CORE.EVIDENCE
      WHERE case_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const listResult = await executeQuery(listSql, [caseId, pageSize, offset]);
    const rows = normalizeRows<any>(listResult);

    return NextResponse.json({
      ok: true,
      rows,
      total,
      page,
      pageSize,
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load case evidence");
  }
}

export async function POST(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    const caseId = String(params?.caseId || "").trim();
    if (!caseId) return jsonError("Missing caseId", 400);

    const body = await req.json().catch(() => null);

    const evidenceType = String(body?.evidenceType || "link").trim();
    const title = String(body?.title || "").trim();
    const description = body?.description == null ? null : String(body.description);
    const sourceUrl = body?.sourceUrl == null ? null : String(body.sourceUrl);
    const storageRef = body?.storageRef == null ? null : String(body.storageRef);
    const submittedBy = body?.submittedBy == null ? null : String(body.submittedBy);

    if (!title) return jsonError("Missing title", 400);

    const insertSql = `
      INSERT INTO GAFAIG_DB.CORE.EVIDENCE
        (case_id, evidence_type, title, description, source_url, storage_ref, submitted_by, submitted_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())
    `;

    await executeQuery(insertSql, [
      caseId,
      evidenceType,
      title,
      description,
      sourceUrl,
      storageRef,
      submittedBy,
    ]);

    // Return refreshed page 1 data for convenience
    const listSql = `
      SELECT
        evidence_id   AS "evidenceId",
        case_id       AS "caseId",
        evidence_type AS "evidenceType",
        title         AS "title",
        description   AS "description",
        source_url    AS "sourceUrl",
        storage_ref   AS "storageRef",
        submitted_by  AS "submittedBy",
        submitted_at  AS "submittedAt",
        created_at    AS "createdAt"
      FROM GAFAIG_DB.CORE.EVIDENCE
      WHERE case_id = ?
      ORDER BY created_at DESC
      LIMIT 20 OFFSET 0
    `;

    const listResult = await executeQuery(listSql, [caseId]);
    const rows = normalizeRows<any>(listResult);

    return NextResponse.json({ ok: true, rows });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to add evidence");
  }
}
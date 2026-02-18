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
  _req: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    const caseId = String(params?.caseId || "").trim();
    if (!caseId) return jsonError("Missing caseId", 400);

    const sql = `
      SELECT
        finding_id   AS "findingId",
        case_id      AS "caseId",
        title        AS "title",
        severity     AS "severity",
        status       AS "status",
        category     AS "category",
        created_at   AS "createdAt",
        updated_at   AS "updatedAt"
      FROM GAFAIG_DB.CORE.FINDINGS
      WHERE case_id = ?
      ORDER BY created_at DESC
    `;

    const result = await executeQuery(sql, [caseId]);
    const rows = normalizeRows<any>(result);

    return NextResponse.json({
      ok: true,
      rows,
      total: rows.length,
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load findings");
  }
}
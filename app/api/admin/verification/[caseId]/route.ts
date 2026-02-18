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
        case_id            AS "caseId",
        entity_name        AS "entityName",
        verification_type  AS "verificationType",
        status             AS "status",
        priority           AS "priority",
        created_at         AS "createdAt",
        updated_at         AS "updatedAt"
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES
      WHERE case_id = ?
      LIMIT 1
    `;

    const result = await executeQuery(sql, [caseId]);
    const rows = normalizeRows<any>(result);
    const row = rows[0] ?? null;

    if (!row) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, row });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load case");
  }
}
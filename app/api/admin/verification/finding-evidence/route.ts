import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result as T[];
  if (Array.isArray((result as any).rows)) return (result as any).rows as T[];
  return [];
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req, true)) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get("caseId")?.trim();
    const findingId = searchParams.get("findingId")?.trim();

    if (!caseId && !findingId) {
      return jsonError("Missing caseId or findingId", 400);
    }

    const sql = findingId
      ? `
        SELECT
          FINDING_ID  AS "findingId",
          EVIDENCE_ID AS "evidenceId",
          CREATED_AT  AS "createdAt"
        FROM GAFAIG_DB.CORE.VERIFICATION_FINDING_EVIDENCE
        WHERE FINDING_ID = ?
        ORDER BY CREATED_AT DESC
      `
      : `
        SELECT
          L.FINDING_ID  AS "findingId",
          L.EVIDENCE_ID AS "evidenceId",
          L.CREATED_AT  AS "createdAt"
        FROM GAFAIG_DB.CORE.VERIFICATION_FINDING_EVIDENCE L
        JOIN GAFAIG_DB.CORE.VERIFICATION_FINDINGS F
          ON L.FINDING_ID = F.FINDING_ID
        WHERE F.CASE_ID = ?
        ORDER BY L.CREATED_AT DESC
      `;

    const bindValue = findingId || caseId || "";
    const result = await executeQuery(sql, [bindValue]);
    const rows = normalizeRows(result);

    return NextResponse.json({
      ok: true,
      rows,
      total: rows.length,
      source: "snowflake",
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load links");
  }
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req, true)) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(req.url);

    const caseId = searchParams.get("caseId")?.trim();
    const findingId = searchParams.get("findingId")?.trim();
    const evidenceId = searchParams.get("evidenceId")?.trim();

    if (!caseId || !findingId || !evidenceId) {
      return jsonError("Missing required params: caseId, findingId, evidenceId", 400);
    }

    await executeQuery(
      `CALL GAFAIG_DB.CORE.SP_UNLINK_FINDING_EVIDENCE(?, ?, ?)`,
      [caseId, findingId, evidenceId]
    );

    return NextResponse.json({
      ok: true,
      source: "snowflake",
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to unlink evidence");
  }
}
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";
import { requireAdmin } from "@/lib/auth/admin";

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

function pickStr(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function extractProcedurePayload(result: any): any | null {
  const rows = normalizeRows<any>(result);
  const row = rows?.[0];

  if (!row) return null;

  const values = Object.values(row);
  return values.length > 0 ? values[0] : null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { caseId: string } }
) {
  if (!requireAdmin(req, true)) {
    return jsonError("Unauthorized", 401);
  }

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
      FROM GAFAIG_DB.CORE.VERIFICATION_FINDINGS
      WHERE case_id = ?
      ORDER BY created_at DESC
    `;

    const result = await executeQuery(sql, [caseId]);
    const rows = normalizeRows<any>(result);

    return NextResponse.json({
      ok: true,
      rows,
      total: rows.length,
      source: "snowflake",
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load findings");
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { caseId: string } }
) {
  if (!requireAdmin(req, true)) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const caseId = String(params?.caseId || "").trim();
    if (!caseId) return jsonError("Missing caseId", 400);

    const body = await req.json().catch(() => ({}));

    const title = pickStr(body?.title).trim();
    const severity = pickStr(body?.severity).trim() || null;
    const status = pickStr(body?.status).trim() || "open";
    const category = pickStr(body?.category).trim() || null;

    if (!title) return jsonError("Missing required field: title", 400);

    const result = await executeQuery(
      `
      CALL GAFAIG_DB.CORE.SP_CREATE_FINDING(
        ?, ?, ?, ?, ?
      )
      `,
      [caseId, title, severity, status, category]
    );

    const payload = extractProcedurePayload(result);

    if (!payload?.findingId) {
      return jsonError("Invalid finding procedure response", 500);
    }

    return NextResponse.json({
      ok: true,
      row: {
        findingId: payload.findingId,
        caseId: payload.caseId ?? caseId,
        title,
        severity,
        status,
        category,
      },
      source: "snowflake",
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to create finding");
  }
}
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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const requestId = String(body?.requestId || "").trim();
    const status = String(body?.status || "").trim();

    if (!requestId) return jsonError("Missing requestId", 400);
    if (!status) return jsonError("Missing status", 400);

    // Update status + updated_at
    const updateResult = await executeQuery(
      `UPDATE GAFAIG_DB.CORE.SUBMISSIONS
       SET status = ?, updated_at = CURRENT_TIMESTAMP()
       WHERE request_id = ?`,
      [status, requestId]
    );

    const rows = normalizeRows<any>(updateResult);

    // Some Snowflake drivers return empty rows for UPDATE; treat as OK if no exception.
    return NextResponse.json({
      ok: true,
      requestId,
      status,
      rows,
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to update submission status");
  }
}
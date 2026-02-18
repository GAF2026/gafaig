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

export async function GET(_req: Request, ctx: { params: { requestId: string } }) {
  try {
    const requestId = String(ctx?.params?.requestId || "").trim();
    if (!requestId) return jsonError("Missing requestId", 400);

    // NOTE: adjust table/columns if your schema differs
    const sql = `
      SELECT
        REQUEST_ID as "requestId",
        SUBMISSION_TYPE as "type",
        STATUS as "status",
        ORG_NAME as "orgName",
        CONTACT_EMAIL as "contactEmail",
        CREATED_AT as "createdAt",
        UPDATED_AT as "updatedAt",
        PAYLOAD as "payload"
      FROM CORE.SUBMISSIONS
      WHERE REQUEST_ID = ?
      LIMIT 1
    `;

    const result = await executeQuery(sql, [requestId]);
    const rows = normalizeRows<any>(result);

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, row: rows[0] });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load submission");
  }
}
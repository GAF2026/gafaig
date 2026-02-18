import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Normalize Snowflake results into a plain array so .length / [0] work safely.
 */
function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.rows)) return result.rows;
  return [];
}

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(
  _req: Request,
  ctx: { params: { participantId: string } }
) {
  try {
    const participantId = ctx?.params?.participantId;
    if (!participantId) return jsonError("Missing participantId", 400);

    // Adjust table/column names ONLY if your schema differs.
    const sql = `
      SELECT
        PARTICIPANT_ID as "participantId",
        NAME as "name",
        TYPE as "type",
        STATUS as "status",
        WEBSITE as "website",
        COUNTRY as "country",
        CREATED_AT as "createdAt",
        UPDATED_AT as "updatedAt"
      FROM CORE.PARTICIPANTS
      WHERE PARTICIPANT_ID = ?
      LIMIT 1
    `;

    const result = await executeQuery(sql, [participantId]);
    const rows = normalizeRows<any>(result);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, row: rows[0] });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load participant");
  }
}
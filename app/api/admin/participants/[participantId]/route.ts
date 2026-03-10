import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const participantId = String(ctx?.params?.participantId || "").trim();
    if (!participantId) return jsonError("Missing participantId", 400);

    const sql = `
      SELECT
        PARTICIPANT_ID AS ID,
        NAME,
        PARTICIPANT_TYPE,
        JURISDICTION_LEVEL,
        COUNTRY,
        WEBSITE,
        DESIGNATION_LEVEL,
        VERIFICATION_STATUS,
        CREATED_AT,
        UPDATED_AT
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      WHERE PARTICIPANT_ID = ?
      LIMIT 1
    `;

    const result = await executeQuery(sql, [participantId]);
    const rows = normalizeRows<any>(result);

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, row: rows[0] });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load participant");
  }
}
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Normalizes different Snowflake return shapes into a plain array.
 * Supports:
 *  - T[]
 *  - { rows: T[] }
 *  - SnowflakeQueryResult-like objects
 */
function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.rows)) return result.rows;
  return [];
}

function toNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET() {
  try {
    // NOTE: If your table/view names differ, adjust ONLY the SQL strings below.
    const totalCasesSql = `
      SELECT COUNT(*) AS TOTAL
      FROM CORE.VERIFICATION_CASES
    `;

    const byStatusSql = `
      SELECT STATUS, COUNT(*) AS COUNT
      FROM CORE.VERIFICATION_CASES
      GROUP BY STATUS
    `;

    const verifiedParticipantsSql = `
      SELECT COUNT(*) AS TOTAL
      FROM CORE.PARTICIPANTS
      WHERE LOWER(COALESCE(STATUS, '')) IN ('verified','approved')
    `;

    const totalResult = await executeQuery(totalCasesSql);
    const totalRows = normalizeRows<any>(totalResult);
    const total = toNumber(totalRows[0]?.TOTAL ?? totalRows[0]?.total ?? 0);

    const statusResult = await executeQuery(byStatusSql);
    const statusRows = normalizeRows<any>(statusResult);

    const byStatus: Record<string, number> = {
      received: 0,
      in_review: 0,
      needs_more_info: 0,
      approved: 0,
      rejected: 0,
      suspended: 0,
    };

    for (const r of statusRows) {
      const key = String(r.STATUS ?? r.status ?? "").toLowerCase();
      const count = toNumber(r.COUNT ?? r.count ?? 0);
      if (key) byStatus[key] = (byStatus[key] ?? 0) + count;
    }

    const verifiedResult = await executeQuery(verifiedParticipantsSql);
    const verifiedRows = normalizeRows<any>(verifiedResult);
    const verifiedParticipants = toNumber(
      verifiedRows[0]?.TOTAL ?? verifiedRows[0]?.total ?? 0
    );

    return NextResponse.json({
      ok: true,
      total,
      byStatus,
      verifiedParticipants,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to load metrics" },
      { status: 500 }
    );
  }
}
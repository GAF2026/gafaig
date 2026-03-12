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

function toNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

const SUBMISSIONS_VIEW = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";

export async function GET() {
  try {
    const totalSql = `
      SELECT COUNT(*) AS TOTAL
      FROM ${SUBMISSIONS_VIEW}
      WHERE TYPE = 'application'
    `;

    const byStatusSql = `
      SELECT STATUS, COUNT(*) AS COUNT
      FROM ${SUBMISSIONS_VIEW}
      WHERE TYPE = 'application'
      GROUP BY STATUS
    `;

    const thisMonthSql = `
      SELECT COUNT(*) AS TOTAL
      FROM ${SUBMISSIONS_VIEW}
      WHERE TYPE = 'application'
        AND DATE_TRUNC('MONTH', UPDATED_AT) = DATE_TRUNC('MONTH', CURRENT_DATE())
    `;

    const verifiedParticipantsSql = `
      SELECT COUNT(*) AS TOTAL
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      WHERE LOWER(COALESCE(STATUS, '')) IN ('verified','approved')
    `;

    const totalResult = await executeQuery(totalSql);
    const totalRows = normalizeRows<any>(totalResult);
    const total = toNumber(totalRows[0]?.TOTAL ?? 0);

    const statusResult = await executeQuery(byStatusSql);
    const statusRows = normalizeRows<any>(statusResult);

    const byStatus: Record<string, number> = {
      received: 0,
      in_review: 0,
      approved: 0,
      rejected: 0,
      suspended: 0,
    };

    for (const r of statusRows) {
      const key = String(r.STATUS ?? "").toLowerCase();
      const count = toNumber(r.COUNT ?? 0);
      if (key) {
        byStatus[key] = (byStatus[key] ?? 0) + count;
      }
    }

    const monthResult = await executeQuery(thisMonthSql);
    const monthRows = normalizeRows<any>(monthResult);
    const thisMonth = toNumber(monthRows[0]?.TOTAL ?? 0);

    const verifiedResult = await executeQuery(verifiedParticipantsSql);
    const verifiedRows = normalizeRows<any>(verifiedResult);
    const verifiedParticipants = toNumber(verifiedRows[0]?.TOTAL ?? 0);

    return NextResponse.json({
      ok: true,
      metrics: {
        total,
        byStatus,
        thisMonth,
        verifiedParticipants,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to load metrics" },
      { status: 500 }
    );
  }
}
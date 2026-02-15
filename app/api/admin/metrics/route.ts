import { NextResponse } from "next/server";
import { querySnowflake } from "@/lib/snowflake";

const COOKIE_NAME = "gafaig_admin";

function isAdminAuthed(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

export async function GET(req: Request) {
  try {
    if (!isAdminAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // Submissions metrics
    const totalSql = `
      SELECT COUNT(*)::NUMBER AS "total"
      FROM GAFAIG_DB.CORE.SUBMISSIONS
    `;

    const byStatusSql = `
      SELECT
        STATUS as "status",
        COUNT(*)::NUMBER as "count"
      FROM GAFAIG_DB.CORE.SUBMISSIONS
      GROUP BY STATUS
    `;

    // This month submissions
    const thisMonthSql = `
      SELECT COUNT(*)::NUMBER AS "count"
      FROM GAFAIG_DB.CORE.SUBMISSIONS
      WHERE DATE_TRUNC('month', CREATED_AT) = DATE_TRUNC('month', CURRENT_TIMESTAMP())
    `;

    // Participants metric (verified only)
    const verifiedParticipantsSql = `
      SELECT COUNT(*)::NUMBER AS "count"
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      WHERE VERIFICATION_STATUS = 'verified'
    `;

    const totalRows = await querySnowflake(totalSql);
    const byStatusRows = await querySnowflake(byStatusSql);
    const thisMonthRows = await querySnowflake(thisMonthSql);
    const verifiedRows = await querySnowflake(verifiedParticipantsSql);

    const total = Number(totalRows?.[0]?.total ?? 0);

    const byStatus: Record<string, number> = {
      received: 0,
      in_review: 0,
      approved: 0,
      rejected: 0,
    };

    for (const r of byStatusRows ?? []) {
      const key = String((r as any).status ?? "");
      const val = Number((r as any).count ?? 0);
      if (key in byStatus) byStatus[key] = val;
    }

    const thisMonth = Number(thisMonthRows?.[0]?.count ?? 0);
    const verifiedParticipants = Number(verifiedRows?.[0]?.count ?? 0);

    return NextResponse.json({
      ok: true,
      metrics: {
        // submissions
        total,
        byStatus,
        thisMonth,
        // participants
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
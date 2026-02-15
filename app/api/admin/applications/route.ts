import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function asInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = asInt(searchParams.get("page"), 1);
    const pageSize = Math.min(asInt(searchParams.get("pageSize"), 20), 100);

    const status = (searchParams.get("status") || "all").toLowerCase();
    const search = (searchParams.get("search") || "").trim();

    const where: string[] = [];
    const binds: any[] = [];

    if (status !== "all") {
      where.push(`STATUS = ?`);
      binds.push(status);
    }

    if (search.length > 0) {
      where.push(`(REQUEST_ID ILIKE ? OR ORG_NAME ILIKE ? OR EMAIL ILIKE ?)`);
      const like = `%${search}%`;
      binds.push(like, like, like);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const countSql = `
      SELECT COUNT(*) AS TOTAL
      FROM CORE.APPLICATIONS
      ${whereSql}
    `;

    const totalRows = await executeQuery(countSql, binds);
    const total = Number(totalRows?.[0]?.TOTAL || 0);

    const offset = (page - 1) * pageSize;

    const listSql = `
      SELECT
        REQUEST_ID AS "requestId",
        TYPE       AS "type",
        STATUS     AS "status",
        ORG_NAME   AS "orgName",
        EMAIL      AS "email",
        UPDATED_AT AS "updatedAt"
      FROM CORE.APPLICATIONS
      ${whereSql}
      ORDER BY UPDATED_AT DESC
      LIMIT ?
      OFFSET ?
    `;

    const rows = await executeQuery(listSql, [...binds, pageSize, offset]);

    return NextResponse.json({
      ok: true,
      rows: rows || [],
      total,
      page,
      pageSize,
      filters: { status, search },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
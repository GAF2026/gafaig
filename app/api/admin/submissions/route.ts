import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

function toInt(v: string | null, fallback: number) {
  const n = Number(v ?? "");
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function safeStr(v: string | null) {
  return (v ?? "").trim();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const search = safeStr(url.searchParams.get("search")).toLowerCase();
    const status = safeStr(url.searchParams.get("status")).toLowerCase(); // "all" or a status value
    const type = safeStr(url.searchParams.get("type")).toLowerCase(); // optional: "application", "renewal", etc.

    const page = toInt(url.searchParams.get("page"), 1);
    const pageSize = toInt(url.searchParams.get("pageSize"), 10);

    const where: string[] = [];
    const binds: any[] = [];

    if (status && status !== "all") {
      where.push("LOWER(status) = ?");
      binds.push(status);
    }

    if (type && type !== "all") {
      where.push("LOWER(type) = ?");
      binds.push(type);
    }

    if (search) {
      where.push(
        "(LOWER(request_id) LIKE ? OR LOWER(org_name) LIKE ? OR LOWER(contact_email) LIKE ?)"
      );
      const like = `%${search}%`;
      binds.push(like, like, like);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // total count
    const totalRows: any[] = (await executeQuery(
      `SELECT COUNT(*)::INTEGER AS TOTAL
       FROM GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
       ${whereSql}`,
      binds
    )) as any[];

    const total = Number(totalRows?.[0]?.TOTAL ?? 0);
    const offset = (page - 1) * pageSize;

    // paged rows
    const rows: any[] = (await executeQuery(
      `SELECT
         request_id     AS "requestId",
         type           AS "type",
         status         AS "status",
         org_name       AS "orgName",
         contact_email  AS "contactEmail",
         updated_at     AS "updatedAt",
         source_table   AS "sourceTable"
       FROM GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
       ${whereSql}
       ORDER BY updated_at DESC
       LIMIT ? OFFSET ?`,
      [...binds, pageSize, offset]
    )) as any[];

    return NextResponse.json({
      ok: true,
      rows,
      total,
      page,
      pageSize,
      filters: { search, status: status || "all", type: type || "all" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to load submissions from Snowflake" },
      { status: 500 }
    );
  }
}
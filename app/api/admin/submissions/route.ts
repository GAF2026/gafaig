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

function qp(url: string, key: string, fallback = "") {
  try {
    const u = new URL(url);
    return (u.searchParams.get(key) ?? fallback).trim();
  } catch {
    return fallback;
  }
}

export async function GET(req: Request) {
  try {
    const search = qp(req.url, "search", "");
    const status = qp(req.url, "status", "all");
    const type = qp(req.url, "type", "all");

    const page = Math.max(1, Number(qp(req.url, "page", "1")) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(qp(req.url, "pageSize", "20")) || 20));
    const offset = (page - 1) * pageSize;

    const binds: any[] = [];
    const where: string[] = [];

    if (search) {
      where.push(`(
        LOWER(REQUEST_ID) LIKE ? OR
        LOWER(ORG_NAME) LIKE ? OR
        LOWER(CONTACT_EMAIL) LIKE ?
      )`);
      const like = `%${search.toLowerCase()}%`;
      binds.push(like, like, like);
    }

    if (status && status !== "all") {
      where.push(`LOWER(STATUS) = ?`);
      binds.push(status.toLowerCase());
    }

    if (type && type !== "all") {
      where.push(`LOWER(SUBMISSION_TYPE) = ?`);
      binds.push(type.toLowerCase());
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // ✅ total count
    const totalResult = await executeQuery(
      `
      SELECT COUNT(*)::INTEGER AS TOTAL
      FROM GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
      ${whereSql}
      `,
      binds
    );
    const totalRows = normalizeRows<{ TOTAL?: number }>(totalResult);
    const total = Number(totalRows?.[0]?.TOTAL ?? 0);

    // ✅ paginated rows
    const listResult = await executeQuery(
      `
      SELECT
        REQUEST_ID as "requestId",
        SUBMISSION_TYPE as "type",
        STATUS as "status",
        ORG_NAME as "orgName",
        CONTACT_EMAIL as "contactEmail",
        CREATED_AT as "createdAt",
        UPDATED_AT as "updatedAt"
      FROM GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
      ${whereSql}
      ORDER BY COALESCE(UPDATED_AT, CREATED_AT) DESC
      LIMIT ? OFFSET ?
      `,
      [...binds, pageSize, offset]
    );
    const rows = normalizeRows<any>(listResult);

    return NextResponse.json({
      ok: true,
      rows,
      total,
      page,
      pageSize,
      filters: { search, status, type },
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load submissions");
  }
}
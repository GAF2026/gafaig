import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/**
 * Snowflake helper normalization:
 * Some wrappers return { rows: [...] } while others return [...].
 * We normalize so .length and [0] are safe.
 */
function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.rows)) return result.rows;
  return [];
}

/**
 * GET /api/admin/participants
 * Supports: search, status, type, page, pageSize
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = String(searchParams.get("search") || "").trim();
    const status = String(searchParams.get("status") || "all").trim();
    const type = String(searchParams.get("type") || "all").trim();

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)));
    const offset = (page - 1) * pageSize;

    const where: string[] = [];
    const binds: any[] = [];

    if (search) {
      const q = `%${search}%`;
      where.push(`(
        COALESCE(PARTICIPANT_ID::string, '') ILIKE ?
        OR COALESCE(NAME::string, '') ILIKE ?
        OR COALESCE(WEBSITE::string, '') ILIKE ?
        OR COALESCE(COUNTRY::string, '') ILIKE ?
        OR COALESCE(SLUG::string, '') ILIKE ?
      )`);
      binds.push(q, q, q, q, q);
    }

    if (status && status !== "all") {
      where.push(`UPPER(COALESCE(VERIFICATION_STATUS::string, '')) = UPPER(?)`);
      binds.push(status);
    }

    if (type && type !== "all") {
      where.push(`UPPER(COALESCE(PARTICIPANT_TYPE::string, '')) = UPPER(?)`);
      binds.push(type);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const countSql = `
      SELECT COUNT(*)::NUMBER AS "total"
      FROM CORE.PARTICIPANTS
      ${whereSql}
    `;

    const listSql = `
      SELECT
        PARTICIPANT_ID AS "participantId",
        NAME AS "name",
        PARTICIPANT_TYPE AS "type",
        VERIFICATION_STATUS AS "status",
        WEBSITE AS "website",
        COUNTRY AS "country",
        CREATED_AT AS "createdAt",
        UPDATED_AT AS "updatedAt"
      FROM CORE.PARTICIPANTS
      ${whereSql}
      ORDER BY UPDATED_AT DESC NULLS LAST, CREATED_AT DESC NULLS LAST
      LIMIT ? OFFSET ?
    `;

    const countResult = await executeQuery(countSql, binds);
    const countRows = normalizeRows<any>(countResult);
    const total = Number(countRows?.[0]?.total ?? 0);

    const listResult = await executeQuery(listSql, [...binds, pageSize, offset]);
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
    return jsonError(e?.message ?? "Failed to load participants");
  }
}
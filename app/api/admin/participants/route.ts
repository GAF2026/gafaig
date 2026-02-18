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
      // Match on id/name/website loosely (adjust columns if needed)
      where.push(`(
        ILIKE(PARTICIPANT_ID, ?) OR
        ILIKE(NAME, ?) OR
        ILIKE(WEBSITE, ?)
      )`);
      const q = `%${search}%`;
      binds.push(q, q, q);
    }

    if (status && status !== "all") {
      where.push(`STATUS = ?`);
      binds.push(status);
    }

    if (type && type !== "all") {
      where.push(`TYPE = ?`);
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
        PARTICIPANT_ID as "participantId",
        NAME as "name",
        TYPE as "type",
        STATUS as "status",
        WEBSITE as "website",
        COUNTRY as "country",
        CREATED_AT as "createdAt",
        UPDATED_AT as "updatedAt"
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
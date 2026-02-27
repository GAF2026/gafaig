import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function asInt(v: string | null, def: number, min: number, max: number) {
  const n = Number(v ?? "");
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

// This is the view you confirmed is working
const VIEW_NAME = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json({ ok: false, error: auth.error ?? "Unauthorized" }, auth.status ?? 401);
    }

    const url = new URL(req.url);
    const page = asInt(url.searchParams.get("page"), 1, 1, 5000);
    const pageSize = asInt(url.searchParams.get("pageSize"), 10, 1, 100);
    const status = String(url.searchParams.get("status") ?? "all").trim();
    const q = String(url.searchParams.get("q") ?? "").trim();

    const where: string[] = [];
    const binds: any[] = [];

    // Only applications on this page
    where.push(`TYPE = 'application'`);

    if (status && status.toLowerCase() !== "all") {
      where.push(`UPPER(COALESCE(STATUS, '')) = UPPER(?)`);
      binds.push(status);
    }

    if (q) {
      where.push(
        `(
          ILIKE(COALESCE(REQUEST_ID::string, ''), '%' || ? || '%')
          OR ILIKE(COALESCE(ORG_NAME::string, ''), '%' || ? || '%')
          OR ILIKE(COALESCE(CONTACT_EMAIL::string, ''), '%' || ? || '%')
          OR ILIKE(COALESCE(SOURCE_TABLE::string, ''), '%' || ? || '%')
        )`
      );
      binds.push(q, q, q, q);
    }

    const whereSql = `WHERE ${where.join(" AND ")}`;
    const offset = (page - 1) * pageSize;

    // Count
    const countSql = `
      SELECT COUNT(*)::NUMBER AS TOTAL
      FROM ${VIEW_NAME}
      ${whereSql}
    `;
    const countRows = await sfQuery<{ TOTAL: number }>(countSql, binds);
    const total = Number((countRows?.[0] as any)?.TOTAL ?? 0);

    // Rows (IMPORTANT: alias columns to the UI-friendly names)
    const rowsSql = `
      SELECT
        REQUEST_ID      AS "requestId",
        ORG_NAME        AS "org",
        CONTACT_EMAIL   AS "email",
        STATUS          AS "status",
        SOURCE_TABLE    AS "source",
        UPDATED_AT      AS "updatedAt"
      FROM ${VIEW_NAME}
      ${whereSql}
      ORDER BY UPDATED_AT DESC NULLS LAST
      LIMIT ? OFFSET ?
    `;

    const rows = await sfQuery<any>(rowsSql, [...binds, pageSize, offset]);

    return json({
      ok: true,
      page,
      pageSize,
      total,
      rows: rows ?? [],
      view: VIEW_NAME,
    });
  } catch (e: any) {
    const msg = String(e?.message ?? e ?? "Unknown error");
    return json({ ok: false, error: msg }, 500);
  }
}
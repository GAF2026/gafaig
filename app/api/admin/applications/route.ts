import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { snowflakeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AdminApplicationRow = {
  requestId: string;
  org: string | null;
  email: string | null;
  status: string | null;
  source: string | null;
  updatedAt: string | null;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function asInt(value: string | null, fallback: number, min: number, max: number) {
  const n = Number(value ?? "");
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function clean(value: string | null): string {
  return String(value ?? "").trim();
}

const VIEW_NAME = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401
      );
    }

    const url = new URL(req.url);

    const page = asInt(url.searchParams.get("page"), 1, 1, 5000);
    const pageSize = asInt(url.searchParams.get("pageSize"), 10, 1, 100);
    const status = clean(url.searchParams.get("status"));
    const q = clean(url.searchParams.get("q"));
    const offset = (page - 1) * pageSize;

    const where: string[] = [];
    const binds: Array<string | number> = [];

    if (status && status.toLowerCase() !== "all") {
      where.push(`TRIM(UPPER(COALESCE(STATUS, ''))) = TRIM(UPPER(?))`);
      binds.push(status);
    }

    if (q) {
      where.push(`
        (
          COALESCE(REQUEST_ID::STRING, '') ILIKE '%' || ? || '%'
          OR COALESCE(ORG_NAME::STRING, COALESCE(ORGANIZATION_NAME::STRING, '')) ILIKE '%' || ? || '%'
          OR COALESCE(CONTACT_EMAIL::STRING, COALESCE(EMAIL::STRING, '')) ILIKE '%' || ? || '%'
          OR COALESCE(SOURCE_TABLE::STRING, COALESCE(SOURCE::STRING, '')) ILIKE '%' || ? || '%'
        )
      `);
      binds.push(q, q, q, q);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const countSql = `
      SELECT COUNT(*)::NUMBER AS TOTAL
      FROM ${VIEW_NAME}
      ${whereSql}
    `;

    const countRows = await snowflakeQuery<{ TOTAL: number }>(countSql, binds);
    const total = Number(countRows?.[0]?.TOTAL ?? 0);

    const rowsSql = `
      SELECT
        REQUEST_ID AS REQUEST_ID,
        COALESCE(ORG_NAME, ORGANIZATION_NAME) AS ORG,
        COALESCE(CONTACT_EMAIL, EMAIL) AS EMAIL,
        STATUS AS STATUS,
        COALESCE(SOURCE_TABLE, SOURCE) AS SOURCE,
        TO_VARCHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM ${VIEW_NAME}
      ${whereSql}
      ORDER BY UPDATED_AT DESC NULLS LAST, REQUEST_ID DESC
      LIMIT ? OFFSET ?
    `;

    const rawRows = await snowflakeQuery<Record<string, unknown>>(rowsSql, [
      ...binds,
      pageSize,
      offset,
    ]);

    const rows: AdminApplicationRow[] = rawRows.map((row) => ({
      requestId: String(row.REQUEST_ID ?? ""),
      org:
        row.ORG === null || row.ORG === undefined || String(row.ORG).trim() === ""
          ? null
          : String(row.ORG).trim(),
      email:
        row.EMAIL === null || row.EMAIL === undefined || String(row.EMAIL).trim() === ""
          ? null
          : String(row.EMAIL).trim(),
      status:
        row.STATUS === null || row.STATUS === undefined || String(row.STATUS).trim() === ""
          ? null
          : String(row.STATUS).trim(),
      source:
        row.SOURCE === null || row.SOURCE === undefined || String(row.SOURCE).trim() === ""
          ? null
          : String(row.SOURCE).trim(),
      updatedAt:
        row.UPDATED_AT === null ||
        row.UPDATED_AT === undefined ||
        String(row.UPDATED_AT).trim() === ""
          ? null
          : String(row.UPDATED_AT).trim(),
    }));

    return json({
      ok: true,
      page,
      pageSize,
      total,
      rows,
      filters: {
        status: status || "all",
        q,
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Admin applications query failed.",
      },
      500
    );
  }
}
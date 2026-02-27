import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

async function getColumnsSet(tableName: string): Promise<Set<string>> {
  const sql = `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = ?
    ORDER BY ORDINAL_POSITION
  `;
  // sfQuery returns rows[] (NOT {rows})
  const rows = await sfQuery<{ COLUMN_NAME: string }>(sql, [tableName]);

  return new Set(
    (rows ?? [])
      .map((r) => String(r.COLUMN_NAME ?? "").toUpperCase())
      .filter(Boolean)
  );
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "20") || 20));
  const offset = (page - 1) * pageSize;

  const viewName = "V_ADMIN_APPLICATIONS_UNIFIED";

  const cols = await getColumnsSet(viewName);
  const pick = (name: string) => (cols.has(name.toUpperCase()) ? name : null);

  const selectCols = [
    pick("REQUEST_ID"),
    pick("CREATED_AT"),
    pick("STATUS"),
    pick("ORG_NAME"),
    pick("EMAIL"),
    pick("TYPE"),
    pick("CASE_ID"),
    pick("PARTICIPANT_ID"),
  ].filter(Boolean) as string[];

  const selectList = selectCols.length ? selectCols.join(", ") : "*";

  const sql = `
    SELECT ${selectList}
    FROM CORE.${viewName}
    ORDER BY CREATED_AT DESC
    LIMIT ? OFFSET ?
  `;

  const rows = await sfQuery<Record<string, any>>(sql, [pageSize, offset]);

  const countSql = `
    SELECT COUNT(*) AS N
    FROM CORE.${viewName}
  `;
  const countRows = await sfQuery<{ N: number }>(countSql, []);
  const total = Number(countRows?.[0]?.N ?? 0);

  return NextResponse.json({
    ok: true,
    rows,
    total,
    page,
    pageSize,
  });
}
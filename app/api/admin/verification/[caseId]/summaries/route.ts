import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery, snowflakeCtx } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type SubmissionRow = Record<string, any>;

function normalizeRows(rows: any): any[] {
  if (!rows) return [];
  if (Array.isArray(rows)) return rows;
  return [rows];
}

export async function GET(req: NextRequest, ctx: { params: { caseId: string } }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const caseId = String(ctx?.params?.caseId ?? "").trim();
  if (!caseId) {
    return NextResponse.json({ ok: false, error: "Missing route param: caseId" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "20") || 20));
  const offset = (page - 1) * pageSize;

  // Example filters (optional)
  const q = String(searchParams.get("q") ?? "").trim();

  // Common binds array
  const binds: any[] = [caseId];
  let where = "WHERE CASE_ID = ?";

  if (q) {
    // Conservative free-text filter across common fields (adjust if needed)
    where += " AND (TITLE ILIKE ? OR DESCRIPTION ILIKE ? OR EVIDENCE_ID ILIKE ?)";
    const like = `%${q}%`;
    binds.push(like, like, like);
  }

  // 1) total count
  const countSql = `
    SELECT COUNT(*) AS TOTAL
    FROM CORE.V_EVIDENCE_SUMMARIES
    ${where}
  `;
  const countRowsRaw = await sfQuery<{ TOTAL: number }>(countSql, binds);
  const countRows = normalizeRows(countRowsRaw);
  const total = Number(countRows?.[0]?.TOTAL ?? 0);

  // 2) page rows
  const rowsSql = `
    SELECT *
    FROM CORE.V_EVIDENCE_SUMMARIES
    ${where}
    ORDER BY CREATED_AT DESC
    LIMIT ? OFFSET ?
  `;

  const rowsRaw = await sfQuery<SubmissionRow>(rowsSql, [...binds, pageSize, offset]);
  const rows = normalizeRows(rowsRaw) as SubmissionRow[];

  // Add a safe placeholder field so UI code that expects it won’t crash.
  const rowsWithType = rows.map((r) => ({
    ...r,
    TYPE: r.TYPE ?? r.EVIDENCE_TYPE ?? null,
  }));

  return NextResponse.json({
    ok: true,
    caseId,
    page,
    pageSize,
    total,
    snowflake: snowflakeCtx(),
    rows: rowsWithType,
  });
}
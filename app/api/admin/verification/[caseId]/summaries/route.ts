// app/api/admin/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sfQuery, snowflakeCtx } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function asInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function getParam(req: NextRequest, key: string) {
  return req.nextUrl.searchParams.get(key);
}

// IMPORTANT:
// This endpoint must match whatever Snowflake object you’re currently using for admin submissions.
// Your previous version referenced SUBMISSION_TYPE (which does not exist).
//
// If you later want a type column, add it to the underlying object OR derive it from SOURCE/PAYLOAD.
const SUBMISSIONS_OBJECT = "GAFAIG_DB.CORE.SUBMISSIONS";

type SubmissionRow = {
  REQUEST_ID?: string;
  ORG_ID?: string;
  EMAIL?: string;
  STATUS?: string;
  SOURCE?: string;
  UPDATED_AT?: string;
  CREATED_AT?: string;

  // optional, safe defaults (UI may ignore)
  SUBMISSION_TYPE?: string | null;
};

function normalizeRows(rows: any): any[] {
  if (Array.isArray(rows)) return rows;
  if (rows && Array.isArray((rows as any).rows)) return (rows as any).rows;
  return [];
}

function buildWhere(status: string, q: string) {
  const clauses: string[] = [];
  const binds: any[] = [];

  // status filter
  if (status && status !== "all") {
    clauses.push(`STATUS = ?`);
    binds.push(status);
  }

  // simple search across a few common fields
  if (q) {
    clauses.push(`(
      REQUEST_ID ILIKE ?
      OR ORG_ID ILIKE ?
      OR EMAIL ILIKE ?
      OR SOURCE ILIKE ?
    )`);
    const like = `%${q}%`;
    binds.push(like, like, like, like);
  }

  const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return { whereSql, binds };
}

export async function GET(req: NextRequest) {
  try {
    const page = asInt(getParam(req, "page"), 1);
    const pageSize = asInt(getParam(req, "pageSize"), 10);
    const status = (getParam(req, "status") || "all").toLowerCase();
    const q = (getParam(req, "q") || "").trim();

    const offset = (page - 1) * pageSize;

    const { whereSql, binds } = buildWhere(status, q);

    // 1) total count
    const countSql = `
      SELECT COUNT(*)::INT AS TOTAL
      FROM ${SUBMISSIONS_OBJECT}
      ${whereSql}
    `;
    const countRes = await sfQuery<{ TOTAL: number }>(countSql, binds);
    const countRows = normalizeRows(countRes.rows);
    const total = countRows?.[0]?.TOTAL ?? 0;

    // 2) page rows
    // NOTE: We intentionally do NOT select SUBMISSION_TYPE because it does not exist in your object.
    // If you need it later, add it to the object, or derive it.
    const rowsSql = `
      SELECT
        REQUEST_ID,
        ORG_ID,
        EMAIL,
        STATUS,
        SOURCE,
        CREATED_AT,
        UPDATED_AT
      FROM ${SUBMISSIONS_OBJECT}
      ${whereSql}
      ORDER BY COALESCE(UPDATED_AT, CREATED_AT) DESC
      LIMIT ? OFFSET ?
    `;

    const rowsRes = await sfQuery<SubmissionRow>(rowsSql, [...binds, pageSize, offset]);
    const rows = normalizeRows(rowsRes.rows) as SubmissionRow[];

    // Add a safe placeholder field so UI code that expects it won’t crash.
    const rowsWithType = rows.map((r) => ({
      ...r,
      SUBMISSION_TYPE: (r as any).SUBMISSION_TYPE ?? null,
    }));

    return json({
      ok: true,
      page,
      pageSize,
      total,
      rows: rowsWithType,
      object: SUBMISSIONS_OBJECT,
      ctx: await snowflakeCtx(),
    });
  } catch (e: any) {
    return json(
      {
        ok: false,
        error: e?.message ?? String(e),
        hint:
          "If this says the object does not exist, set SUBMISSIONS_OBJECT in this route to the correct table/view name in GAFAIG_DB.CORE.",
      },
      500
    );
  }
}
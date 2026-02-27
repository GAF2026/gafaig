// app/api/admin/submissions/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type SubmissionRow = Record<string, any>;

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function asInt(v: string | null, def: number, min: number, max: number) {
  const n = Number(v ?? "");
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

// Hardcoded safe candidates (NO user input) to avoid SQL injection.
// Hardcoded safe candidates (NO user input) to avoid SQL injection.
const VIEW_CANDIDATES = [
  // ✅ confirmed in Snowflake (per SHOW VIEWS)
  "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS",

  // backups (keep if you want)
  "GAFAIG_DB.CORE.V_ADMIN_SUBMISSION", // common typo variant
  "GAFAIG_DB.CORE.V_ADMIN_APPLICATIONS", // if you ever map submissions here
];

async function pickWorkingView(): Promise<string> {
  // Optional override if you ever want it
const candidates = VIEW_CANDIDATES;

  for (const v of candidates) {
    try {
      // If this succeeds, the view exists and is readable by current role.
      await sfQuery<any>(`SELECT 1 AS OK FROM ${v} LIMIT 1`);
      return v;
    } catch {
      // try next candidate
    }
  }

  // If none worked, return the first for error messaging.
  return candidates[0] ?? "GAFAIG_DB.CORE.ADMIN_SUBMISSIONS_V";
}

export async function GET(req: NextRequest) {
  // Always return JSON (even on errors) so the UI never sees “Unexpected end of JSON input”.
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

    const viewName = await pickWorkingView();

    // Build WHERE clause with binds
    const where: string[] = [];
    const binds: any[] = [];

    // status filter (only if not "all")
    if (status && status.toLowerCase() !== "all") {
      where.push(`UPPER(COALESCE(status, '')) = UPPER(?)`);
      binds.push(status);
    }

    // q filter across common fields if they exist on the view
    // (We do "try" SQL patterns that won't crash if a column is missing by only referencing
    //  widely used column names; if your view uses different names, set GAFAIG_SUBMISSIONS_VIEW
    //  to the right one or rename columns in the view.)
    if (q) {
      where.push(
        `(
          ILIKE(COALESCE(request_id::string, ''), '%' || ? || '%')
          OR ILIKE(COALESCE(org::string, ''), '%' || ? || '%')
          OR ILIKE(COALESCE(email::string, ''), '%' || ? || '%')
          OR ILIKE(COALESCE(source::string, ''), '%' || ? || '%')
        )`
      );
      binds.push(q, q, q, q);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const offset = (page - 1) * pageSize;

    // Count
    const countSql = `
      SELECT COUNT(*)::NUMBER AS TOTAL
      FROM ${viewName}
      ${whereSql}
    `;
    const countRows = await sfQuery<{ TOTAL: number }>(countSql, binds);
    const total = Number((countRows?.[0] as any)?.TOTAL ?? 0);

    // Page rows
    const rowsSql = `
  SELECT *
  FROM ${viewName}
  ${whereSql}
  ORDER BY UPDATED_AT DESC NULLS LAST
  LIMIT ? OFFSET ?
`;
    const rows = await sfQuery<SubmissionRow>(rowsSql, [...binds, pageSize, offset]);

    return json({
      ok: true,
      page,
      pageSize,
      total,
      rows: rows ?? [],
      view: viewName,
    });
  } catch (e: any) {
    // Return JSON body with error details (safe string)
    const msg = String(e?.message ?? e ?? "Unknown error");
    return json({ ok: false, error: msg }, 500);
  }
}
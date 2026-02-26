// app/api/admin/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function qp(url: string, key: string, fallback = "") {
  try {
    const u = new URL(url);
    return (u.searchParams.get(key) ?? fallback).trim();
  } catch {
    return fallback;
  }
}

/**
 * Read columns from the Snowflake view so we never reference non-existent identifiers.
 * This prevents errors like: invalid identifier 'SUBMISSION_TYPE'
 */
async function getViewColumns(): Promise<Set<string>> {
  const sql = `
    SELECT COLUMN_NAME
    FROM GAFAIG_DB.INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_CATALOG = 'GAFAIG_DB'
      AND TABLE_SCHEMA = 'CORE'
      AND TABLE_NAME = 'V_ADMIN_SUBMISSIONS'
    ORDER BY ORDINAL_POSITION
  `;
  const { rows } = await sfQuery<{ COLUMN_NAME: string }>(sql, []);
  return new Set((rows ?? []).map((r) => String(r.COLUMN_NAME || "").toUpperCase()).filter(Boolean));
}

function pickFirst(columns: Set<string>, candidates: string[]): string | null {
  for (const c of candidates) {
    const up = c.toUpperCase();
    if (columns.has(up)) return up;
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const search = qp(req.url, "search", "");
    const status = qp(req.url, "status", "all");
    const type = qp(req.url, "type", "all");

    const page = Math.max(1, Number(qp(req.url, "page", "1")) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(qp(req.url, "pageSize", "20")) || 20));
    const offset = (page - 1) * pageSize;

    const cols = await getViewColumns();

    // Required-ish columns (we pick alternates if your view uses different names)
    const COL_REQUEST_ID = pickFirst(cols, ["REQUEST_ID", "REQUESTID", "ID"]);
    const COL_STATUS = pickFirst(cols, ["STATUS"]);
    const COL_ORG_NAME = pickFirst(cols, ["ORG_NAME", "ORG", "ORGANIZATION", "ORGNAME"]);
    const COL_CONTACT_EMAIL = pickFirst(cols, ["CONTACT_EMAIL", "EMAIL", "CONTACTEMAIL"]);
    const COL_CREATED_AT = pickFirst(cols, ["CREATED_AT", "CREATED"]);
    const COL_UPDATED_AT = pickFirst(cols, ["UPDATED_AT", "UPDATED", "LAST_UPDATED_AT", "LAST_UPDATED"]);
    const COL_SOURCE = pickFirst(cols, ["SOURCE", "SUBMISSION_SOURCE"]);
    const COL_TYPE = pickFirst(cols, ["SUBMISSION_TYPE", "TYPE", "REQUEST_TYPE", "TRACK", "KIND"]);

    // Build WHERE safely (only for columns that exist)
    const binds: any[] = [];
    const where: string[] = [];

    // Search filter (only include fields that exist)
    if (search) {
      const like = `%${search.toLowerCase()}%`;
      const parts: string[] = [];

      if (COL_REQUEST_ID) parts.push(`LOWER(${COL_REQUEST_ID}) LIKE ?`);
      if (COL_ORG_NAME) parts.push(`LOWER(${COL_ORG_NAME}) LIKE ?`);
      if (COL_CONTACT_EMAIL) parts.push(`LOWER(${COL_CONTACT_EMAIL}) LIKE ?`);

      if (parts.length) {
        where.push(`(${parts.join(" OR ")})`);
        // push like for each part we included
        for (let i = 0; i < parts.length; i++) binds.push(like);
      }
    }

    if (status && status !== "all" && COL_STATUS) {
      where.push(`LOWER(${COL_STATUS}) = ?`);
      binds.push(status.toLowerCase());
    }

    // If the view does not have a type column, we silently ignore the type filter
    if (type && type !== "all" && COL_TYPE) {
      where.push(`LOWER(${COL_TYPE}) = ?`);
      binds.push(type.toLowerCase());
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // Total count
    const totalSql = `
      SELECT COUNT(*)::INTEGER AS TOTAL
      FROM GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
      ${whereSql}
    `;
    const { rows: totalRows } = await sfQuery<{ TOTAL: number }>(totalSql, binds);
    const total = Number(totalRows?.[0]?.TOTAL ?? 0);

    // SELECT list (never reference missing columns)
    // We always return the JSON keys the UI expects.
    const selectParts: string[] = [];
    selectParts.push(COL_REQUEST_ID ? `${COL_REQUEST_ID} as "requestId"` : `NULL as "requestId"`);
    selectParts.push(COL_TYPE ? `${COL_TYPE} as "type"` : `NULL as "type"`);
    selectParts.push(COL_STATUS ? `${COL_STATUS} as "status"` : `NULL as "status"`);
    selectParts.push(COL_ORG_NAME ? `${COL_ORG_NAME} as "orgName"` : `NULL as "orgName"`);
    selectParts.push(COL_CONTACT_EMAIL ? `${COL_CONTACT_EMAIL} as "contactEmail"` : `NULL as "contactEmail"`);
    selectParts.push(COL_SOURCE ? `${COL_SOURCE} as "source"` : `NULL as "source"`);
    selectParts.push(COL_CREATED_AT ? `${COL_CREATED_AT} as "createdAt"` : `NULL as "createdAt"`);
    selectParts.push(COL_UPDATED_AT ? `${COL_UPDATED_AT} as "updatedAt"` : `NULL as "updatedAt"`);

    const orderBy = COL_UPDATED_AT
      ? `ORDER BY COALESCE(${COL_UPDATED_AT}, ${COL_CREATED_AT ?? COL_UPDATED_AT}) DESC`
      : COL_CREATED_AT
      ? `ORDER BY ${COL_CREATED_AT} DESC`
      : `ORDER BY 1`;

    const listSql = `
      SELECT
        ${selectParts.join(",\n        ")}
      FROM GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
      ${whereSql}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const { rows } = await sfQuery<any>(listSql, [...binds, pageSize, offset]);

    return NextResponse.json({
      ok: true,
      rows: rows ?? [],
      total,
      page,
      pageSize,
      filters: { search, status, type },
      debug: {
        view: "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS",
        detectedColumns: Array.from(cols),
        used: {
          requestId: COL_REQUEST_ID,
          type: COL_TYPE,
          status: COL_STATUS,
          orgName: COL_ORG_NAME,
          contactEmail: COL_CONTACT_EMAIL,
          source: COL_SOURCE,
          createdAt: COL_CREATED_AT,
          updatedAt: COL_UPDATED_AT,
        },
      },
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load submissions");
  }
}
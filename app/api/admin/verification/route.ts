import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function asInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function getColName(row: any): string | null {
  // Handles different shapes returned by different Snowflake helpers/drivers
  const v =
    row?.name ??
    row?.NAME ??
    row?.column_name ??
    row?.COLUMN_NAME ??
    row?.Column_name ??
    row?.["column_name"] ??
    row?.["COLUMN_NAME"];
  if (!v) return null;
  return String(v).trim();
}

function pickRequired(existing: Set<string>, candidates: string[], label: string) {
  for (const c of candidates) {
    if (existing.has(c.toUpperCase())) return c.toUpperCase();
  }
  throw new Error(
    `VERIFICATION_CASES is missing a required column for "${label}". Tried: ${candidates.join(", ")}.`
  );
}

function pickOptional(existing: Set<string>, candidates: string[]) {
  for (const c of candidates) {
    if (existing.has(c.toUpperCase())) return c.toUpperCase();
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = asInt(searchParams.get("page"), 1);
    const pageSize = Math.min(asInt(searchParams.get("pageSize"), 25), 100);

    const status = (searchParams.get("status") || "all").toLowerCase();
    const verificationType = (searchParams.get("verificationType") || "all").toLowerCase();
    const search = (searchParams.get("search") || "").trim();

    // ✅ More reliable than INFORMATION_SCHEMA and avoids key-name mismatch
    const desc = await executeQuery(`DESC TABLE GAFAIG_DB.CORE.VERIFICATION_CASES`, []);

    const existing = new Set<string>(
      (desc || [])
        .map((r: any) => getColName(r))
        .filter(Boolean)
        .map((c: string) => c.toUpperCase())
    );

    // Required mappings
    const COL_CASE_ID = pickRequired(existing, ["CASE_ID", "VERIFICATION_CASE_ID", "ID"], "case id");
    const COL_STATUS = pickRequired(existing, ["STATUS", "CASE_STATUS"], "status");

    // Entity ID is required (your table uses PARTICIPANT_ID)
    const COL_ENTITY_ID = pickRequired(
      existing,
      ["PARTICIPANT_ID", "ENTITY_ID", "SUBMISSION_ID", "TARGET_ID"],
      "entity id"
    );

    // Entity name + verification type are optional (we'll fall back safely)
    const COL_ENTITY_NAME = pickOptional(existing, ["ENTITY_NAME", "ORG_NAME", "NAME"]);
    const COL_VERIF_TYPE = pickOptional(existing, [
      "VERIFICATION_TYPE",
      "TYPE",
      "CASE_TYPE",
      "VERIF_TYPE",
      "VERIFICATION_KIND",
      "KIND",
    ]);

    const COL_PRIORITY = pickOptional(existing, ["PRIORITY"]);
    const COL_UPDATED_AT = pickOptional(existing, ["UPDATED_AT", "MODIFIED_AT", "UPDATEDON"]);
    const COL_CREATED_AT = pickOptional(existing, ["CREATED_AT", "CREATEDON", "CREATED_DATE"]);

    const where: string[] = [];
    const binds: any[] = [];

    if (status !== "all") {
      where.push(`${COL_STATUS} = ?`);
      binds.push(status);
    }

    if (verificationType !== "all" && COL_VERIF_TYPE) {
      where.push(`${COL_VERIF_TYPE} = ?`);
      binds.push(verificationType);
    }

    if (search.length > 0) {
      const like = `%${search}%`;
      // If entity name doesn't exist, only search by caseId/entityId
      if (COL_ENTITY_NAME) {
        where.push(`(${COL_CASE_ID} ILIKE ? OR ${COL_ENTITY_NAME} ILIKE ? OR ${COL_ENTITY_ID} ILIKE ?)`);
        binds.push(like, like, like);
      } else {
        where.push(`(${COL_CASE_ID} ILIKE ? OR ${COL_ENTITY_ID} ILIKE ?)`);
        binds.push(like, like);
      }
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const countSql = `
      SELECT COUNT(*) AS TOTAL
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES
      ${whereSql}
    `;
    const totalRows = await executeQuery(countSql, binds);
    const total = Number(totalRows?.[0]?.TOTAL || totalRows?.[0]?.total || 0);

    const offset = (page - 1) * pageSize;

    // ✅ Safe fallbacks if columns don't exist
    const selectEntityName = COL_ENTITY_NAME
      ? `${COL_ENTITY_NAME} AS "entityName"`
      : `${COL_ENTITY_ID} AS "entityName"`;

    const selectVerifType = COL_VERIF_TYPE
      ? `${COL_VERIF_TYPE} AS "verificationType"`
      : `'unknown' AS "verificationType"`;

    const selectPriority = COL_PRIORITY ? `${COL_PRIORITY} AS "priority"` : `'normal' AS "priority"`;

    const selectUpdated = COL_UPDATED_AT
      ? `${COL_UPDATED_AT} AS "updatedAt"`
      : `CURRENT_TIMESTAMP() AS "updatedAt"`;

    const selectCreated = COL_CREATED_AT
      ? `${COL_CREATED_AT} AS "createdAt"`
      : `CURRENT_TIMESTAMP() AS "createdAt"`;

    const orderBy = COL_UPDATED_AT ? `${COL_UPDATED_AT}` : `${COL_CASE_ID}`;

    const listSql = `
      SELECT
        ${COL_CASE_ID} AS "caseId",
        ${selectEntityName},
        ${selectVerifType},
        ${COL_STATUS} AS "status",
        ${selectPriority},
        ${selectUpdated},
        ${selectCreated}
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES
      ${whereSql}
      ORDER BY ${orderBy} DESC
      LIMIT ?
      OFFSET ?
    `;

    const rows = await executeQuery(listSql, [...binds, pageSize, offset]);

    return NextResponse.json({
      ok: true,
      rows: rows || [],
      total,
      page,
      pageSize,
      filters: { status, verificationType, search },
      detectedColumns: Array.from(existing).sort(),
      verificationTypeColumnDetected: COL_VERIF_TYPE,
      entityNameColumnDetected: COL_ENTITY_NAME,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
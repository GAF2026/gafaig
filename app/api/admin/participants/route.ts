import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.rows)) return result.rows;
  return [];
}

function asString(v: unknown) {
  return String(v ?? "").trim();
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = asString(searchParams.get("search"));
    const verificationStatus = asString(
      searchParams.get("verificationStatus") || "all"
    );
    const participantType = asString(
      searchParams.get("participantType") || "all"
    );

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get("pageSize") || 10))
    );
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
        OR COALESCE(PROFILE_SLUG::string, '') ILIKE ?
        OR COALESCE(DESIGNATION_LEVEL::string, '') ILIKE ?
        OR COALESCE(PUBLIC_SUMMARY::string, '') ILIKE ?
      )`);
      binds.push(q, q, q, q, q, q, q);
    }

    if (verificationStatus && verificationStatus !== "all") {
      where.push(
        `UPPER(COALESCE(VERIFICATION_STATUS::string, '')) = UPPER(?)`
      );
      binds.push(verificationStatus);
    }

    if (participantType && participantType !== "all") {
      where.push(`UPPER(COALESCE(PARTICIPANT_TYPE::string, '')) = UPPER(?)`);
      binds.push(participantType);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const countSql = `
      SELECT COUNT(*)::NUMBER AS "total"
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      ${whereSql}
    `;

    const listSql = `
      SELECT
        PARTICIPANT_ID      AS "participantId",
        PARTICIPANT_TYPE    AS "participantType",
        JURISDICTION_LEVEL  AS "jurisdictionLevel",
        NAME                AS "name",
        COUNTRY             AS "country",
        WEBSITE             AS "website",
        PROFILE_SLUG        AS "profileSlug",
        DESIGNATION_LEVEL   AS "designationLevel",
        VERIFICATION_STATUS AS "verificationStatus",
        CONTACT_EMAIL       AS "contactEmail",
        PUBLIC_SUMMARY      AS "publicSummary",
        LOGO_URL            AS "logoUrl",
        CREATED_AT          AS "createdAt",
        UPDATED_AT          AS "updatedAt"
      FROM GAFAIG_DB.CORE.PARTICIPANTS
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
      filters: { search, verificationStatus, participantType },
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load participants");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const participantType = asString(body?.participantType);
    const jurisdictionLevel = asString(body?.jurisdictionLevel) || null;
    const name = asString(body?.name);
    const country = asString(body?.country) || null;
    const website = asString(body?.website) || null;
    const designationLevel = asString(body?.designationLevel) || null;
    const verificationStatus =
      asString(body?.verificationStatus) || "unverified";

    if (!name) {
      return jsonError("Missing required field: name", 400);
    }

    if (!participantType) {
      return jsonError("Missing required field: participantType", 400);
    }

    const participantId = `PART-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2, 8)}`;

    const profileSlug = slugify(name);

    const insertSql = `
      INSERT INTO GAFAIG_DB.CORE.PARTICIPANTS (
        PARTICIPANT_ID,
        PARTICIPANT_TYPE,
        JURISDICTION_LEVEL,
        NAME,
        COUNTRY,
        WEBSITE,
        PROFILE_SLUG,
        DESIGNATION_LEVEL,
        VERIFICATION_STATUS,
        CREATED_AT,
        UPDATED_AT
      )
      SELECT
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        CURRENT_TIMESTAMP(),
        CURRENT_TIMESTAMP()
    `;

    await executeQuery(insertSql, [
      participantId,
      participantType,
      jurisdictionLevel,
      name,
      country,
      website,
      profileSlug,
      designationLevel,
      verificationStatus,
    ]);

    return NextResponse.json({
      ok: true,
      participantId,
      profileSlug,
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to create participant");
  }
}
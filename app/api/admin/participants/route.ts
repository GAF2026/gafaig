import { NextResponse } from "next/server";
import { querySnowflake } from "@/lib/snowflake";

const COOKIE_NAME = "gafaig_admin";

function isAdminAuthed(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

function normalizeString(v: any) {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(req: Request) {
  try {
    if (!isAdminAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const search = (searchParams.get("search") || "").trim();
    const verificationStatus = (searchParams.get("verificationStatus") || "all").trim();
    const participantType = (searchParams.get("participantType") || "all").trim();

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") || 10)));
    const offset = (page - 1) * pageSize;

    const where: string[] = [];
    const binds: any[] = [];

    if (search) {
      where.push(`(
        LOWER(NAME) LIKE LOWER(?) OR
        LOWER(COUNTRY) LIKE LOWER(?) OR
        LOWER(WEBSITE) LIKE LOWER(?) OR
        LOWER(PROFILE_SLUG) LIKE LOWER(?) OR
        LOWER(DESIGNATION_LEVEL) LIKE LOWER(?)
      )`);
      const like = `%${search}%`;
      binds.push(like, like, like, like, like);
    }

    if (verificationStatus !== "all") {
      where.push(`VERIFICATION_STATUS = ?`);
      binds.push(verificationStatus);
    }

    if (participantType !== "all") {
      where.push(`PARTICIPANT_TYPE = ?`);
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
        PARTICIPANT_ID as "participantId",
        PARTICIPANT_TYPE as "participantType",
        JURISDICTION_LEVEL as "jurisdictionLevel",
        NAME as "name",
        COUNTRY as "country",
        WEBSITE as "website",
        PROFILE_SLUG as "profileSlug",
        DESIGNATION_LEVEL as "designationLevel",
        VERIFICATION_STATUS as "verificationStatus",
        CONTACT_EMAIL as "contactEmail",
        PUBLIC_SUMMARY as "publicSummary",
        LOGO_URL as "logoUrl",
        CREATED_AT as "createdAt",
        UPDATED_AT as "updatedAt"
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      ${whereSql}
      ORDER BY UPDATED_AT DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const countRows = await querySnowflake(countSql, binds);
    const total = Number(countRows?.[0]?.total ?? 0);

    const rows = await querySnowflake(listSql, binds);

    return NextResponse.json({
      ok: true,
      rows: rows ?? [],
      total,
      page,
      pageSize,
      filters: { search, verificationStatus, participantType },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to load participants" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!isAdminAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const participantType = normalizeString(body?.participantType);
    const jurisdictionLevel = normalizeString(body?.jurisdictionLevel);
    const name = normalizeString(body?.name);
    const country = normalizeString(body?.country);
    const website = normalizeString(body?.website);
    const designationLevel = normalizeString(body?.designationLevel);
    const verificationStatus = normalizeString(body?.verificationStatus) ?? "unverified";
    const contactEmail = normalizeString(body?.contactEmail);
    const publicSummary = normalizeString(body?.publicSummary);
    const logoUrl = normalizeString(body?.logoUrl);

    if (!participantType || !name) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: participantType, name" },
        { status: 400 }
      );
    }

    // slug logic: allow custom slug, otherwise generate from name
    let profileSlug = normalizeString(body?.profileSlug);
    if (!profileSlug) profileSlug = slugify(name);

    // Ensure slug unique by appending a short suffix if needed
    const existsSql = `
      SELECT COUNT(*)::NUMBER AS "cnt"
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      WHERE PROFILE_SLUG = ?
    `;
    const exists = await querySnowflake(existsSql, [profileSlug]);
    const cnt = Number(exists?.[0]?.cnt ?? 0);
    if (cnt > 0) {
      profileSlug = `${profileSlug}-${Math.random().toString(16).slice(2, 6)}`;
    }

    const insertSql = `
      INSERT INTO GAFAIG_DB.CORE.PARTICIPANTS (
        PARTICIPANT_TYPE,
        JURISDICTION_LEVEL,
        NAME,
        COUNTRY,
        WEBSITE,
        PROFILE_SLUG,
        DESIGNATION_LEVEL,
        VERIFICATION_STATUS,
        CONTACT_EMAIL,
        PUBLIC_SUMMARY,
        LOGO_URL,
        UPDATED_AT
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())
    `;

    await querySnowflake(insertSql, [
      participantType,
      jurisdictionLevel,
      name,
      country,
      website,
      profileSlug,
      designationLevel,
      verificationStatus,
      contactEmail,
      publicSummary,
      logoUrl,
    ]);

    // Return the inserted row (by slug)
    const readSql = `
      SELECT
        PARTICIPANT_ID as "participantId",
        PARTICIPANT_TYPE as "participantType",
        JURISDICTION_LEVEL as "jurisdictionLevel",
        NAME as "name",
        COUNTRY as "country",
        WEBSITE as "website",
        PROFILE_SLUG as "profileSlug",
        DESIGNATION_LEVEL as "designationLevel",
        VERIFICATION_STATUS as "verificationStatus",
        CONTACT_EMAIL as "contactEmail",
        PUBLIC_SUMMARY as "publicSummary",
        LOGO_URL as "logoUrl",
        CREATED_AT as "createdAt",
        UPDATED_AT as "updatedAt"
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      WHERE PROFILE_SLUG = ?
      ORDER BY CREATED_AT DESC
      LIMIT 1
    `;
    const rows = await querySnowflake(readSql, [profileSlug]);

    return NextResponse.json({ ok: true, row: rows?.[0] ?? null });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to create participant" },
      { status: 500 }
    );
  }
}
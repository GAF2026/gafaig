import { NextResponse } from "next/server";
import { querySnowflake } from "@/lib/snowflake";

const COOKIE_NAME = "gafaig_admin";

function isAdminAuthed(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

export async function GET(
  req: Request,
  { params }: { params: { participantId: string } }
) {
  try {
    if (!isAdminAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const participantId = params?.participantId;
    if (!participantId) {
      return NextResponse.json({ ok: false, error: "Missing participantId" }, { status: 400 });
    }

    const sql = `
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
      WHERE PARTICIPANT_ID = ?
      LIMIT 1
    `;

    const rows = await querySnowflake(sql, [participantId]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, row: rows[0] });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to load participant" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { participantId: string } }
) {
  try {
    if (!isAdminAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const participantId = params?.participantId;
    if (!participantId) {
      return NextResponse.json({ ok: false, error: "Missing participantId" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));

    const country = body?.country ?? null;
    const website = body?.website ?? null;
    const designationLevel = body?.designationLevel ?? null;

    const verificationStatus = String(body?.verificationStatus ?? "").trim();
    const allowedVerification = ["unverified", "pending", "verified", "suspended"];
    if (!allowedVerification.includes(verificationStatus)) {
      return NextResponse.json(
        { ok: false, error: `Invalid verificationStatus. Allowed: ${allowedVerification.join(", ")}` },
        { status: 400 }
      );
    }

    const publicSummary = body?.publicSummary ?? null;

    const updateSql = `
      UPDATE GAFAIG_DB.CORE.PARTICIPANTS
      SET
        COUNTRY = ?,
        WEBSITE = ?,
        DESIGNATION_LEVEL = ?,
        VERIFICATION_STATUS = ?,
        PUBLIC_SUMMARY = ?,
        UPDATED_AT = CURRENT_TIMESTAMP()
      WHERE PARTICIPANT_ID = ?
    `;

    await querySnowflake(updateSql, [
      country,
      website,
      designationLevel,
      verificationStatus,
      publicSummary,
      participantId,
    ]);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to update participant" },
      { status: 500 }
    );
  }
}
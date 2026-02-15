import { NextResponse } from "next/server";
import { querySnowflake } from "@/lib/snowflake";

const COOKIE_NAME = "gafaig_admin";

export async function GET(
  req: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    // Admin auth check (cookie must be "1")
    const cookieHeader = req.headers.get("cookie") || "";
    const isAuthed = cookieHeader.includes(`${COOKIE_NAME}=1`);
    if (!isAuthed) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const requestId = params?.requestId;
    if (!requestId) {
      return NextResponse.json({ ok: false, error: "Missing requestId" }, { status: 400 });
    }

    const sql = `
      SELECT
        REQUEST_ID as "requestId",
        SUBMISSION_TYPE as "submissionType",
        ORG_NAME as "orgName",
        CONTACT_EMAIL as "contactEmail",
        STATUS as "status",
        REQUESTED_TIER as "requestedTier",
        RENEWAL_PERIOD as "renewalPeriod",
        CREATED_AT as "createdAt",
        UPDATED_AT as "updatedAt"
      FROM GAFAIG_DB.CORE.SUBMISSIONS
      WHERE REQUEST_ID = ?
      LIMIT 1
    `;

    const rows = await querySnowflake(sql, [requestId]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, row: rows[0] });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
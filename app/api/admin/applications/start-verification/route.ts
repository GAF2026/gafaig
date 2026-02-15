import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin";
function isAdmin(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const requestId = String(body?.requestId || "").trim();

    if (!requestId) {
      return NextResponse.json({ ok: false, error: "Missing requestId" }, { status: 400 });
    }

    const appRows = await executeQuery(
      `
      SELECT REQUEST_ID, ORG_NAME
      FROM GAFAIG_DB.CORE.APPLICATIONS
      WHERE REQUEST_ID = ?
      LIMIT 1
      `,
      [requestId]
    );

    const app = appRows?.[0];
    if (!app) {
      return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
    }

    const caseId = makeId("CASE");

    await executeQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_CASES
        (CASE_ID, PARTICIPANT_ID, ENTITY_NAME, VERIFICATION_TYPE, STANDARD_CODE, STANDARD_VERSION, STATUS, PRIORITY, SUBMITTED_AT, CREATED_AT, UPDATED_AT)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())
      `,
      [
        caseId,
        requestId,
        app.ORG_NAME,
        "submission",
        "HG",
        "v1.0",
        "received",
        "normal"
      ]
    );

    return NextResponse.json({ ok: true, caseId });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
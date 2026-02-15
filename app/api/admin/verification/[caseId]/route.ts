import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin";

function isAuthed(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

export async function GET(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const caseId = params?.caseId;
    if (!caseId) {
      return NextResponse.json({ ok: false, error: "Missing caseId" }, { status: 400 });
    }

    const sql = `
      SELECT
        CASE_ID            AS "caseId",
        PARTICIPANT_ID     AS "participantId",
        ENTITY_NAME        AS "entityName",
        VERIFICATION_TYPE  AS "verificationType",
        STANDARD_CODE      AS "standardCode",
        STANDARD_VERSION   AS "standardVersion",
        STATUS             AS "status",
        PRIORITY           AS "priority",
        SUBMITTED_AT       AS "submittedAt",
        CREATED_AT         AS "createdAt",
        UPDATED_AT         AS "updatedAt"
      FROM CORE.VERIFICATION_CASES
      WHERE CASE_ID = ?
      LIMIT 1
    `;

    const rows = await executeQuery(sql, [caseId]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, row: rows[0] });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin as requireAdminCookie } from "@/lib/auth/admin";
import { requireAdmin as requireAdminSession } from "@/lib/auth/require";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: NextRequest) {
  const sessionAuth = requireAdminSession(req);
  const cookieAuth = requireAdminCookie(req, true);

  if (!sessionAuth.ok && !cookieAuth) {
    return jsonError(sessionAuth.error ?? "Unauthorized", sessionAuth.status ?? 401);
  }

  try {
    const body = await req.json().catch(() => ({}));

    const caseId = String(body?.caseId || "").trim();
    const status = String(body?.status || "").trim();
    const actor = String(body?.actor || "admin").trim();
    const note = String(body?.note || "").trim();

    if (!caseId) return jsonError("Missing caseId", 400);
    if (!status) return jsonError("Missing status", 400);

    const beforeRows = await executeQuery<Record<string, unknown>>(
      `
      SELECT STATUS AS "status"
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES
      WHERE CASE_ID = ?
      LIMIT 1
      `,
      [caseId]
    );

    const from = String(beforeRows?.[0]?.status || "");

    await executeQuery(
      `
      UPDATE GAFAIG_DB.CORE.VERIFICATION_CASES
      SET
        STATUS = ?,
        UPDATED_AT = CURRENT_TIMESTAMP()
      WHERE CASE_ID = ?
      `,
      [status, caseId]
    );

    return NextResponse.json({
      ok: true,
      caseId,
      from,
      to: status,
      actor,
      note,
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to update status");
  }
}
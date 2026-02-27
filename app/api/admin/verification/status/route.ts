import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/verification/status?caseId=CASE-0001
 * Returns a compact status payload for a case.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const caseId = String(searchParams.get("caseId") ?? "").trim();
  if (!caseId) {
    return NextResponse.json({ ok: false, error: "Missing query param: caseId" }, { status: 400 });
  }

  // sfQuery returns rows[] (NOT SfQueryResponse)
  const currentRows = await sfQuery<any>(
    `
    SELECT
      CASE_ID,
      CASE_STATUS,
      TIER,
      BAND,
      FINAL_SCORE,
      LAST_ACTIVITY_AT
    FROM CORE.V_GOVERNANCE_SCORE_CASE
    WHERE CASE_ID = ?
    `,
    [caseId]
  );

  if (!currentRows || currentRows.length === 0) {
    return NextResponse.json({ ok: false, error: `Case not found: ${caseId}` }, { status: 404 });
  }

  const row = currentRows[0];

  return NextResponse.json({
    ok: true,
    caseId: row.CASE_ID ?? caseId,
    caseStatus: row.CASE_STATUS ?? null,
    tier: row.TIER ?? null,
    band: row.BAND ?? null,
    score: row.FINAL_SCORE ?? null,
    lastActivityAt: row.LAST_ACTIVITY_AT ?? null,
  });
}
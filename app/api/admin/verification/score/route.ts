import { NextRequest, NextResponse } from "next/server";
import { requireAdmin as requireAdminCookie } from "@/lib/auth/admin";
import { requireAdmin as requireAdminSession } from "@/lib/auth/require";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function firstNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: NextRequest) {
  const sessionAuth = requireAdminSession(req);
const cookieAuth = requireAdminCookie(req, true);

if (!sessionAuth.ok && !cookieAuth) {
  return jsonError(sessionAuth.error ?? "Unauthorized", sessionAuth.status ?? 401);
}

  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get("caseId")?.trim();

    if (!caseId) {
      return jsonError("Missing caseId", 400);
    }

    const scoreRows = await executeQuery<Record<string, unknown>>(
      `
      SELECT
        CASE_ID AS "caseId",
        ORG_ID AS "orgId",
        FINAL_SCORE AS "finalScore",
        TIER AS "tier",
        BAND AS "band"
      FROM GAFAIG_DB.CORE.V_GOVERNANCE_SCORE_CASE
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      LIMIT 1
      `,
      [caseId]
    );

    const countsRows = await executeQuery<Record<string, unknown>>(
      `
      SELECT
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.VERIFICATION_EVIDENCE WHERE CASE_ID = ?) AS "evidenceCount",
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.VERIFICATION_FINDINGS WHERE CASE_ID = ?) AS "findingCount",
        (
          SELECT COUNT(*)
          FROM GAFAIG_DB.CORE.VERIFICATION_FINDING_EVIDENCE L
          JOIN GAFAIG_DB.CORE.VERIFICATION_FINDINGS F
            ON L.FINDING_ID = F.FINDING_ID
          WHERE F.CASE_ID = ?
        ) AS "linkCount"
      `,
      [caseId, caseId, caseId]
    );

    const score = scoreRows?.[0] ?? null;
    const counts = countsRows?.[0] ?? {};

    return NextResponse.json({
      ok: true,
      caseId,
      scoreFound: Boolean(score),
      orgId: score?.orgId ?? null,
      finalScore: firstNumber(score?.finalScore),
      tier: score?.tier ?? null,
      band: score?.band ?? null,
      evidenceCount: firstNumber(counts.evidenceCount) ?? 0,
      findingCount: firstNumber(counts.findingCount) ?? 0,
      linkCount: firstNumber(counts.linkCount) ?? 0,
      publishEligible: String(score?.tier ?? "").toUpperCase() !== "NOT VERIFIED",
      source: "snowflake",
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load score readiness");
  }
}
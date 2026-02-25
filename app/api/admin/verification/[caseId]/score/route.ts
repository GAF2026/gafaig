import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sfQueryResult } from "@/lib/snowflake";
import { requireAdmin } from "@/lib/auth/require";

type Row = {
  CASE_ID: string;
  PARTICIPANT_ID: string | null;
  STANDARD_CODE: string | null;
  STANDARD_VERSION: string | null;
  CASE_STATUS: string | null;

  CONTROLS_SCORE: number | null;
  COVERAGE_SCORE: number | null;
  FRESHNESS_SCORE: number | null;
  SUMMARIES_SCORE: number | null;
  LAST_ACTIVITY_AT: string | null;

  FINDINGS_TOTAL: number | null;
  FINDINGS_SCORED: number | null;
  FINDINGS_NA: number | null;
  FINDINGS_WITH_EVIDENCE: number | null;

  EVIDENCE_TOTAL: number | null;
  EVIDENCE_WITH_SUMMARY: number | null;

  GOVERNANCE_SCORE: number | null;
};

function toNum(v: any, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function scoreTier(score: number): {
  tier: "High Assurance" | "Standard Assurance" | "Conditional" | "Not Verified";
  band: "A" | "B" | "C" | "D";
} {
  if (score >= 90) return { tier: "High Assurance", band: "A" };
  if (score >= 75) return { tier: "Standard Assurance", band: "B" };
  if (score >= 60) return { tier: "Conditional", band: "C" };
  return { tier: "Not Verified", band: "D" };
}

export async function GET(req: NextRequest, ctx: { params: { caseId: string } }) {
  try {
    await requireAdmin(req);

    const caseId = (ctx?.params?.caseId || "").trim();
    if (!caseId) {
      return NextResponse.json({ ok: false, error: "Missing caseId" }, { status: 400 });
    }

    // 1) Prove Snowflake connectivity + show env
    const envRes = await sfQueryResult<{
      CURRENT_ACCOUNT: string;
      CURRENT_REGION: string;
      CURRENT_DATABASE: string;
      CURRENT_SCHEMA: string;
      CURRENT_ROLE: string;
      CURRENT_WAREHOUSE: string;
    }>(`
      SELECT
        CURRENT_ACCOUNT()   AS CURRENT_ACCOUNT,
        CURRENT_REGION()    AS CURRENT_REGION,
        CURRENT_DATABASE()  AS CURRENT_DATABASE,
        CURRENT_SCHEMA()    AS CURRENT_SCHEMA,
        CURRENT_ROLE()      AS CURRENT_ROLE,
        CURRENT_WAREHOUSE() AS CURRENT_WAREHOUSE
    `);

    // If Snowflake is not reachable/configured, return the REAL reason
    if (!envRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Snowflake not reachable from app",
          details: envRes.error || "Unknown Snowflake error",
          hint:
            "Check .env.local for SNOWFLAKE_QUERY_ENDPOINT, then restart `npm run dev`. If this is Vercel, ensure the env var exists there too.",
        },
        { status: 500 }
      );
    }

    // 2) Try to fetch the score row (case-insensitive + trimmed)
    const scoreRes = await sfQueryResult<Row>(
      `
      SELECT
        CASE_ID,
        PARTICIPANT_ID,
        STANDARD_CODE,
        STANDARD_VERSION,
        CASE_STATUS,
        CONTROLS_SCORE,
        COVERAGE_SCORE,
        FRESHNESS_SCORE,
        SUMMARIES_SCORE,
        LAST_ACTIVITY_AT,
        FINDINGS_TOTAL,
        FINDINGS_SCORED,
        FINDINGS_NA,
        FINDINGS_WITH_EVIDENCE,
        EVIDENCE_TOTAL,
        EVIDENCE_WITH_SUMMARY,
        GOVERNANCE_SCORE
      FROM GAFAIG_DB.CORE.V_GOVERNANCE_SCORE_CASE
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      `,
      [caseId]
    );

    if (!scoreRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Snowflake query failed",
          details: scoreRes.error || "Unknown query error",
          snowflakeEnv: envRes.rows?.[0] ?? null,
        },
        { status: 500 }
      );
    }

    const r = scoreRes.rows?.[0];

    // 3) If not found, return the top case IDs the app can actually see
    if (!r) {
      const suggRes = await sfQueryResult<{ CASE_ID: string }>(`
        SELECT CASE_ID
        FROM GAFAIG_DB.CORE.V_GOVERNANCE_SCORE_CASE
        ORDER BY LAST_ACTIVITY_AT DESC NULLS LAST, CASE_ID
        LIMIT 20
      `);

      return NextResponse.json(
        {
          ok: false,
          error: `No score found for caseId=${caseId}`,
          hint:
            "This CASE_ID does not exist in GAFAIG_DB.CORE.V_GOVERNANCE_SCORE_CASE for the Snowflake environment your app is using.",
          suggestions: (suggRes.ok ? suggRes.rows : []).map((x) => x.CASE_ID),
          snowflakeEnv: envRes.rows?.[0] ?? null,
        },
        { status: 404 }
      );
    }

    const score = toNum(r.GOVERNANCE_SCORE, 0);
    const { tier, band } = scoreTier(score);

    return NextResponse.json({
      ok: true,
      caseId: r.CASE_ID,
      participantId: r.PARTICIPANT_ID,
      standard: { code: r.STANDARD_CODE, version: r.STANDARD_VERSION },
      caseStatus: r.CASE_STATUS,
      tier,
      band,
      score,
      subscores: {
        controls: toNum(r.CONTROLS_SCORE, 0),
        coverage: toNum(r.COVERAGE_SCORE, 0),
        freshness: toNum(r.FRESHNESS_SCORE, 0),
        summaries: toNum(r.SUMMARIES_SCORE, 0),
      },
      lastActivityAt: r.LAST_ACTIVITY_AT,
      counts: {
        findingsTotal: toNum(r.FINDINGS_TOTAL, 0),
        findingsScored: toNum(r.FINDINGS_SCORED, 0),
        findingsNA: toNum(r.FINDINGS_NA, 0),
        findingsWithEvidence: toNum(r.FINDINGS_WITH_EVIDENCE, 0),
        evidenceTotal: toNum(r.EVIDENCE_TOTAL, 0),
        evidenceWithSummary: toNum(r.EVIDENCE_WITH_SUMMARY, 0),
      },
      snowflakeEnv: envRes.rows?.[0] ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}
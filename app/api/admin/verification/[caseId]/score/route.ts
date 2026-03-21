import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sfQueryResult } from "@/lib/snowflake";
import { requireAdmin } from "@/lib/auth/require";
import { normalizeId } from "@/lib/ids";

type ScoreRow = {
  CASE_ID: string;
  PARTICIPANT_ID: string | null;
  STANDARD_CODE: string | null;
  STANDARD_VERSION: string | null;
  CASE_STATUS: string | null;

  SCORE: number | null;
  SUBSCORE_CONTROLS: number | null;
  SUBSCORE_COVERAGE: number | null;
  SUBSCORE_FRESHNESS: number | null;
  SUBSCORE_OPERATIONAL: number | null;

  TIER: string | null;
  BAND: string | null;
  RENEWAL_STATUS: string | null;
  EVENTS_90D: number | null;
  SCORED_AT: string | null;
};

type CountsRow = {
  FINDINGS_TOTAL: number | null;
  FINDINGS_SCORED: number | null;
  FINDINGS_NA: number | null;
  FINDINGS_WITH_EVIDENCE: number | null;
  EVIDENCE_TOTAL: number | null;
};

type EnvRow = {
  CURRENT_ACCOUNT: string;
  CURRENT_REGION: string;
  CURRENT_DATABASE: string;
  CURRENT_SCHEMA: string;
  CURRENT_ROLE: string;
  CURRENT_WAREHOUSE: string;
};

function toNum(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function mapTier(
  tier: string | null | undefined,
  band: string | null | undefined
): {
  tier: "High Assurance" | "Standard Assurance" | "Conditional" | "Not Verified";
  band: "A" | "B" | "C" | "D";
} {
  const normalizedTier = String(tier ?? "").trim().toLowerCase();
  const normalizedBand = String(band ?? "").trim().toUpperCase();

  if (normalizedBand === "A" || normalizedTier.includes("enterprise")) {
    return { tier: "High Assurance", band: "A" };
  }
  if (normalizedBand === "B" || normalizedTier.includes("standard")) {
    return { tier: "Standard Assurance", band: "B" };
  }
  if (normalizedBand === "C" || normalizedTier.includes("baseline")) {
    return { tier: "Conditional", band: "C" };
  }
  return { tier: "Not Verified", band: "D" };
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ caseId: string }> }
) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        { status: auth.status ?? 401 }
      );
    }

    const { caseId: rawCaseId } = await ctx.params;
    const caseId = normalizeId(rawCaseId);

    if (!caseId) {
      return NextResponse.json(
        { ok: false, error: "Missing caseId" },
        { status: 400 }
      );
    }

    const envRes = await sfQueryResult<EnvRow>(`
      SELECT
        CURRENT_ACCOUNT()   AS CURRENT_ACCOUNT,
        CURRENT_REGION()    AS CURRENT_REGION,
        CURRENT_DATABASE()  AS CURRENT_DATABASE,
        CURRENT_SCHEMA()    AS CURRENT_SCHEMA,
        CURRENT_ROLE()      AS CURRENT_ROLE,
        CURRENT_WAREHOUSE() AS CURRENT_WAREHOUSE
    `);

    if (!envRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Snowflake not reachable from app",
          details: envRes.error || "Unknown Snowflake error",
        },
        { status: 500 }
      );
    }

    const scoreRes = await sfQueryResult<ScoreRow>(
      `
      SELECT
        vc.CASE_ID,
        vc.PARTICIPANT_ID,
        vc.STANDARD_CODE,
        vc.STANDARD_VERSION,
        vc.STATUS AS CASE_STATUS,

        cs.SCORE,
        cs.SUBSCORE_CONTROLS,
        cs.SUBSCORE_COVERAGE,
        cs.SUBSCORE_FRESHNESS,
        cs.SUBSCORE_OPERATIONAL,

        tb.TIER,
        tb.BAND,
        rs.RENEWAL_STATUS,
        cs.EVENTS_90D,
        TO_VARCHAR(cs.SCORED_AT, 'YYYY-MM-DD HH24:MI:SS') AS SCORED_AT

      FROM GAFAIG_DB.CORE.VERIFICATION_CASES vc
      LEFT JOIN GAFAIG_DB.CORE.V_CASE_SCORE_ENTERPRISE cs
        ON TRIM(UPPER(cs.CASE_ID)) = TRIM(UPPER(vc.CASE_ID))
      LEFT JOIN GAFAIG_DB.CORE.V_CASE_TIER_BAND tb
        ON TRIM(UPPER(tb.CASE_ID)) = TRIM(UPPER(vc.CASE_ID))
      LEFT JOIN GAFAIG_DB.CORE.V_CASE_RENEWAL_STATUS rs
        ON TRIM(UPPER(rs.CASE_ID)) = TRIM(UPPER(vc.CASE_ID))

      WHERE TRIM(UPPER(vc.CASE_ID)) = TRIM(UPPER(?))
      LIMIT 1
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

    const row = scoreRes.rows?.[0];

    if (!row) {
      return NextResponse.json(
        {
          ok: false,
          error: `No score found for caseId=${caseId}`,
          hint:
            "This CASE_ID does not resolve against the canonical enterprise scoring layer.",
          snowflakeEnv: envRes.rows?.[0] ?? null,
        },
        { status: 404 }
      );
    }

    const countsRes = await sfQueryResult<CountsRow>(
      `
      WITH finding_counts AS (
        SELECT
          COUNT(*) AS FINDINGS_TOTAL,
          COUNT_IF(LOWER(COALESCE(RESULT, '')) NOT IN ('na', 'n/a', 'not_applicable')) AS FINDINGS_SCORED,
          COUNT_IF(LOWER(COALESCE(RESULT, '')) IN ('na', 'n/a', 'not_applicable')) AS FINDINGS_NA,
          COUNT_IF(EVIDENCE_IDS IS NOT NULL AND ARRAY_SIZE(EVIDENCE_IDS) > 0) AS FINDINGS_WITH_EVIDENCE
        FROM GAFAIG_DB.CORE.VERIFICATION_FINDINGS
        WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      ),
      evidence_counts AS (
        SELECT
          COUNT(*) AS EVIDENCE_TOTAL
        FROM GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
        WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      )
      SELECT
        fc.FINDINGS_TOTAL,
        fc.FINDINGS_SCORED,
        fc.FINDINGS_NA,
        fc.FINDINGS_WITH_EVIDENCE,
        ec.EVIDENCE_TOTAL
      FROM finding_counts fc
      CROSS JOIN evidence_counts ec
      `,
      [caseId, caseId]
    );

    const counts = countsRes.ok && countsRes.rows?.[0] ? countsRes.rows[0] : null;

    const mapped = mapTier(row.TIER, row.BAND);

    return NextResponse.json({
      ok: true,
      source: "snowflake-canonical",
      caseId: row.CASE_ID,
      participantId: row.PARTICIPANT_ID,
      standard: {
        code: row.STANDARD_CODE,
        version: row.STANDARD_VERSION,
      },
      caseStatus: row.CASE_STATUS,
      renewalStatus: row.RENEWAL_STATUS,
      tier: mapped.tier,
      band: mapped.band,
      score: toNum(row.SCORE, 0),
      subscores: {
        controls: toNum(row.SUBSCORE_CONTROLS, 0),
        coverage: toNum(row.SUBSCORE_COVERAGE, 0),
        freshness: toNum(row.SUBSCORE_FRESHNESS, 0),
        summaries: toNum(row.SUBSCORE_OPERATIONAL, 0),
      },
      lastActivityAt: row.SCORED_AT,
      counts: {
        findingsTotal: toNum(counts?.FINDINGS_TOTAL, 0),
        findingsScored: toNum(counts?.FINDINGS_SCORED, 0),
        findingsNA: toNum(counts?.FINDINGS_NA, 0),
        findingsWithEvidence: toNum(counts?.FINDINGS_WITH_EVIDENCE, 0),
        evidenceTotal: toNum(counts?.EVIDENCE_TOTAL, 0),
        evidenceWithSummary: 0,
      },
      snowflakeEnv: envRes.rows?.[0] ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
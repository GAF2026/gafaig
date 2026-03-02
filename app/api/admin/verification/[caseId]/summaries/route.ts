// app/api/admin/verification/[caseId]/summaries/route.ts
import { NextRequest } from "next/server";
import { json } from "@/lib/http/json";
import { requireAdmin } from "@/lib/auth/require";
import { executeQuery, snowflakeCtx } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type EvidenceRow = { EVIDENCE_ID: string };

type SummaryRow = {
  EVIDENCE_ID: string;
  STYLE?: string | null;
  MODEL?: string | null;
  SUMMARY?: string | null;

  CORTEX_AVAILABLE?: boolean | null;
  CORTEX_ERROR?: string | null;

  PROMPT_VERSION?: string | null;
  INPUT_CHARS?: number | null;
  OUTPUT_CHARS?: number | null;

  CREATED_AT?: string | null;
  UPDATED_AT?: string | null;

  EFFECTIVE_TS?: string | null;
};

function pickMode(req: NextRequest): "latest" | "history" {
  const mode = (req.nextUrl.searchParams.get("mode") || "").toLowerCase();
  return mode === "history" ? "history" : "latest";
}

function asText(r: SummaryRow): string {
  const v = (r.SUMMARY ?? "") as any;
  return typeof v === "string" ? v : String(v || "");
}

function normalizeEvidenceIds(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((x) => String(x || "").trim())
    .filter(Boolean)
    .slice(0, 500);
}

function inListParams(n: number) {
  return Array.from({ length: n }, () => "?").join(", ");
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ caseId: string }> }) {
  try {
    await requireAdmin(req);

    const { caseId } = await ctx.params;
    const mode = pickMode(req);

    // Demo orgId (ok for now). Later: derive from auth/session.
    const orgId = req.nextUrl.searchParams.get("orgId") || "ORG-DEMO";

    const tables = {
      evidence: "GAFAIG_DB.CORE.VERIFICATION_EVIDENCE",
      summaries: "GAFAIG_DB.CORE.EVIDENCE_SUMMARIES",
    };

    const sfCtx = snowflakeCtx();

    // 1) Evidence IDs (case-only vs case+org for diagnostics)
    const evidenceSqlCaseOnly = `
      SELECT EVIDENCE_ID
      FROM ${tables.evidence}
      WHERE CASE_ID = ?
      ORDER BY CREATED_AT DESC
      LIMIT 500
    `;

    const evidenceSqlCaseOrg = `
      SELECT EVIDENCE_ID
      FROM ${tables.evidence}
      WHERE CASE_ID = ?
        AND ORG_ID = ?
      ORDER BY CREATED_AT DESC
      LIMIT 500
    `;

    const [caseOnlyRows, caseOrgRows] = await Promise.all([
      executeQuery<EvidenceRow>(evidenceSqlCaseOnly, [caseId]),
      executeQuery<EvidenceRow>(evidenceSqlCaseOrg, [caseId, orgId]),
    ]);

    const evidenceIdsCaseOnly = (caseOnlyRows || []).map((r) => r.EVIDENCE_ID).filter(Boolean);
    const evidenceIds = (caseOrgRows || []).map((r) => r.EVIDENCE_ID).filter(Boolean);

    const warnings: string[] = [];
    if (evidenceIds.length === 0 && evidenceIdsCaseOnly.length > 0) {
      warnings.push(
        `Evidence IDs for (caseId=${caseId}, orgId=${orgId}) returned 0, but case-only returned ${evidenceIdsCaseOnly.length}. This suggests org filtering or RAP/role context mismatch.`
      );
    }
    if (evidenceIds.length === 0) {
      warnings.push(`No evidence IDs found for (caseId=${caseId}, orgId=${orgId}).`);
    }

    // 2) Summaries for those evidence IDs
    let rows: SummaryRow[] = [];
    if (evidenceIds.length > 0) {
      const placeholders = inListParams(evidenceIds.length);

      const summariesSql = `
        SELECT
          EVIDENCE_ID,
          STYLE,
          MODEL,
          SUMMARY,
          CORTEX_AVAILABLE,
          CORTEX_ERROR,
          PROMPT_VERSION,
          INPUT_CHARS,
          OUTPUT_CHARS,
          CREATED_AT,
          UPDATED_AT,
          COALESCE(UPDATED_AT, CREATED_AT) AS EFFECTIVE_TS
        FROM ${tables.summaries}
        WHERE EVIDENCE_ID IN (${placeholders})
        ORDER BY EVIDENCE_ID ASC, EFFECTIVE_TS DESC NULLS LAST
      `;

      rows = await executeQuery<SummaryRow>(summariesSql, evidenceIds);
    }

    // 3) Shape response
    if (mode === "latest") {
      // First row per evidenceId is the latest due to ORDER BY
      const latestById: Record<string, any> = {};
      for (const r of rows || []) {
        const id = r.EVIDENCE_ID;
        if (!id) continue;
        if (latestById[id]) continue;

        latestById[id] = {
          evidenceId: id,
          summary: asText(r),
          style: r.STYLE ?? null,
          model: r.MODEL ?? null,
          promptVersion: r.PROMPT_VERSION ?? null,
          cortexAvailable: r.CORTEX_AVAILABLE ?? null,
          cortexError: r.CORTEX_ERROR ?? null,
          inputChars: r.INPUT_CHARS ?? null,
          outputChars: r.OUTPUT_CHARS ?? null,
          effectiveTs: r.EFFECTIVE_TS ?? r.UPDATED_AT ?? r.CREATED_AT ?? null,
        };
      }

      return json({
        ok: true,
        mode,
        caseId,
        orgId,
        tables,
        counts: {
          evidence_case_only: evidenceIdsCaseOnly.length,
          evidence_case_org: evidenceIds.length,
          summaries_rows: rows.length,
          summaries_latest: Object.keys(latestById).length,
        },
        warnings,
        summaries: latestById,
        ctx: sfCtx,
      });
    }

    // history mode
    const history: Record<string, any[]> = {};
    for (const r of rows || []) {
      const id = r.EVIDENCE_ID;
      if (!id) continue;
      if (!history[id]) history[id] = [];
      history[id].push({
        evidenceId: id,
        summary: asText(r),
        style: r.STYLE ?? null,
        model: r.MODEL ?? null,
        promptVersion: r.PROMPT_VERSION ?? null,
        cortexAvailable: r.CORTEX_AVAILABLE ?? null,
        cortexError: r.CORTEX_ERROR ?? null,
        inputChars: r.INPUT_CHARS ?? null,
        outputChars: r.OUTPUT_CHARS ?? null,
        effectiveTs: r.EFFECTIVE_TS ?? r.UPDATED_AT ?? r.CREATED_AT ?? null,
      });
    }

    return json({
      ok: true,
      mode,
      caseId,
      orgId,
      tables,
      counts: {
        evidence_case_only: evidenceIdsCaseOnly.length,
        evidence_case_org: evidenceIds.length,
        summaries_rows: rows.length,
        summaries_evidence_ids: Object.keys(history).length,
      },
      warnings,
      summaries: history,
      ctx: sfCtx,
    });
  } catch (e: any) {
    return json({ ok: false, error: e?.message ?? String(e) }, 500);
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ caseId: string }> }) {
  try {
    await requireAdmin(req);

    const { caseId } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const orgId = body?.orgId ? String(body.orgId) : "ORG-DEMO";
    const providedEvidenceIds = normalizeEvidenceIds(body?.evidenceIds);

    const tables = {
      evidence: "GAFAIG_DB.CORE.VERIFICATION_EVIDENCE",
    };

    const sfCtx = snowflakeCtx();
    const warnings: string[] = [];

    let allowedEvidenceIds: string[] = [];

    if (providedEvidenceIds.length > 0) {
      const placeholders = inListParams(providedEvidenceIds.length);
      const allowedSql = `
        SELECT EVIDENCE_ID
        FROM ${tables.evidence}
        WHERE CASE_ID = ?
          AND ORG_ID = ?
          AND EVIDENCE_ID IN (${placeholders})
        LIMIT 500
      `;
      const rows = await executeQuery<EvidenceRow>(allowedSql, [caseId, orgId, ...providedEvidenceIds]);
      allowedEvidenceIds = (rows || []).map((r) => r.EVIDENCE_ID).filter(Boolean);

      if (allowedEvidenceIds.length === 0) {
        warnings.push(
          `POST provided ${providedEvidenceIds.length} evidenceIds but none matched (caseId=${caseId}, orgId=${orgId}).`
        );
      }
    } else {
      const fallbackSql = `
        SELECT EVIDENCE_ID
        FROM ${tables.evidence}
        WHERE CASE_ID = ?
          AND ORG_ID = ?
        ORDER BY CREATED_AT DESC
        LIMIT 500
      `;
      const rows = await executeQuery<EvidenceRow>(fallbackSql, [caseId, orgId]);
      allowedEvidenceIds = (rows || []).map((r) => r.EVIDENCE_ID).filter(Boolean);

      if (allowedEvidenceIds.length === 0) {
        warnings.push(`POST fallback evidence lookup returned 0 for (caseId=${caseId}, orgId=${orgId}).`);
      }
    }

    // Demo-safe: POST only validates/echoes evidence IDs (generation stays separate for now)
    return json({
      ok: true,
      caseId,
      orgId,
      tables,
      counts: {
        providedEvidenceIds: providedEvidenceIds.length,
        allowedEvidenceIds: allowedEvidenceIds.length,
      },
      warnings,
      evidenceIds: allowedEvidenceIds,
      ctx: sfCtx,
    });
  } catch (e: any) {
    return json({ ok: false, error: e?.message ?? String(e) }, 500);
  }
}
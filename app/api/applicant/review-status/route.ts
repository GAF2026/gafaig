import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/require";
import { getApplicantSession } from "@/lib/applicant-auth";
import { snowflakeQuery } from "@/lib/snowflake";
import {
  APPLICANT_EVIDENCE_TABLE,
  APPLICANT_WORKFLOW_VIEW,
  applicantRepositoryActivity,
  applicantRepositoryRowBelongsToScope,
  cleanApplicantValue,
  classifyApplicantEvidenceType,
  emptyApplicantRepositoryCounts,
  firstApplicantValue,
  repositoryScopeFromSession,
  type ApplicantRepositoryCounts,
  type PersistedApplicantRepositoryRow,
} from "@/lib/applicant/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ReviewRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  EMAIL: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function deriveReviewStatus(
  status: string,
  counts?: ApplicantRepositoryCounts,
) {
  if (counts?.remediationRecords) return "AWAITING_GOVERNANCE_REVIEW";
  if (counts?.requestResponseRecords) return "AWAITING_GOVERNANCE_REVIEW";
  if (counts?.evidenceRecords || counts?.artifactRecords) {
    return "UNDER_GOVERNANCE_REVIEW";
  }

  const normalized = cleanApplicantValue(status).toUpperCase();

  if (normalized.includes("REVIEW")) return "UNDER_GOVERNANCE_REVIEW";
  if (normalized.includes("APPROVED")) return "REVIEW_COMPLETE";
  if (normalized.includes("CERTIFIED")) return "REVIEW_COMPLETE";
  if (normalized.includes("REMEDIATION")) return "AWAITING_REVIEW";
  if (normalized.includes("DEFICIENCY")) return "DEFICIENCY_IDENTIFIED";
  if (normalized.includes("RECEIVED")) return "QUEUED_FOR_REVIEW";

  return "PENDING_REVIEW";
}

function deriveReviewStage(reviewStatus: string) {
  if (reviewStatus === "UNDER_GOVERNANCE_REVIEW") {
    return "Governance Evaluation";
  }

  if (reviewStatus === "AWAITING_GOVERNANCE_REVIEW") {
    return "Awaiting Governance Review";
  }

  if (reviewStatus === "AWAITING_REVIEW") {
    return "Awaiting Governance Review";
  }

  if (reviewStatus === "DEFICIENCY_IDENTIFIED") {
    return "Applicant Remediation";
  }

  if (reviewStatus === "REVIEW_COMPLETE") {
    return "Review Complete";
  }

  if (reviewStatus === "QUEUED_FOR_REVIEW") {
    return "Review Intake";
  }

  return "Review Intake";
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);

    if (!auth.ok) {
      return json(
        {
          ok: false,
          error: auth.error ?? "Applicant authentication required.",
        },
        auth.status ?? 401,
      );
    }

    const session = await getApplicantSession();

    if (!session) {
      return json(
        {
          ok: false,
          error: "Applicant session unavailable.",
        },
        401,
      );
    }

    const rows = await snowflakeQuery<ReviewRow>(
      `
      SELECT
        REQUEST_ID::STRING AS REQUEST_ID,
        COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING AS ORG,
        COALESCE(CONTACT_EMAIL, EMAIL)::STRING AS EMAIL,
        STATUS::STRING AS STATUS,
        COALESCE(SOURCE_TABLE, SOURCE)::STRING AS SOURCE,
        TO_VARCHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM ${APPLICANT_WORKFLOW_VIEW}
      WHERE COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING ILIKE ?
      ORDER BY UPDATED_AT DESC NULLS LAST, REQUEST_ID DESC
      LIMIT 100
      `,
      [session.organizationName],
    );

    const workflowCaseIds = new Set(
      rows.map((row) => cleanApplicantValue(row.REQUEST_ID)).filter(Boolean),
    );

    const persistedRows = await snowflakeQuery<PersistedApplicantRepositoryRow>(
      `
      SELECT *
      FROM ${APPLICANT_EVIDENCE_TABLE}
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 500
      `,
      [],
    );

    const scope = repositoryScopeFromSession(session, workflowCaseIds);
    const countsByCaseId = new Map<string, ApplicantRepositoryCounts>();
    const latestRecordByCaseId = new Map<
      string,
      PersistedApplicantRepositoryRow
    >();

    for (const row of persistedRows) {
      if (!applicantRepositoryRowBelongsToScope(row, scope)) {
        continue;
      }

      const caseId = firstApplicantValue(row, [
        "CASE_ID",
        "REQUEST_ID",
        "APPLICATION_ID",
        "VERIFICATION_CASE_ID",
      ]);

      if (!caseId) {
        continue;
      }

      const counts =
        countsByCaseId.get(caseId) || emptyApplicantRepositoryCounts();

      const bucket = classifyApplicantEvidenceType(
        firstApplicantValue(row, ["EVIDENCE_TYPE", "TYPE"]),
      );

      counts[bucket] += 1;
      countsByCaseId.set(caseId, counts);

      if (!latestRecordByCaseId.has(caseId)) {
        latestRecordByCaseId.set(caseId, row);
      }
    }

    const reviews = rows.map((row) => {
      const caseId = cleanApplicantValue(row.REQUEST_ID);
      const caseStatus = cleanApplicantValue(row.STATUS) || "UNKNOWN";
      const counts =
        countsByCaseId.get(caseId) || emptyApplicantRepositoryCounts();
      const latestRecord = latestRecordByCaseId.get(caseId);
      const reviewStatus = deriveReviewStatus(caseStatus, counts);
      const repositoryActivity = applicantRepositoryActivity(counts);

      return {
        reviewId: `REV-${caseId}`,
        caseId,
        requestId: caseId,
        organizationName:
          cleanApplicantValue(row.ORG) || session.organizationName,
        email: cleanApplicantValue(row.EMAIL) || null,
        reviewStatus,
        caseStatus,
        source: cleanApplicantValue(row.SOURCE) || "Applicant Intake",
        reviewerType: "GAFAIG Governance Review",
        reviewStage: deriveReviewStage(reviewStatus),
        reviewStartedAt:
          firstApplicantValue(latestRecord || {}, [
            "REVIEW_STARTED_AT",
            "CREATED_AT",
          ]) || null,
        estimatedCompletionAt:
          firstApplicantValue(latestRecord || {}, [
            "ESTIMATED_COMPLETION_AT",
            "DUE_AT",
            "DUE_DATE",
          ]) || null,
        updatedAt:
          firstApplicantValue(latestRecord || {}, [
            "UPDATED_AT",
            "MODIFIED_AT",
            "CREATED_AT",
          ]) ||
          cleanApplicantValue(row.UPDATED_AT) ||
          null,
        evidenceRecords: counts.evidenceRecords,
        requestResponseRecords: counts.requestResponseRecords,
        remediationRecords: counts.remediationRecords,
        artifactRecords: counts.artifactRecords,
        repositoryActivity,
      };
    });

    const underReview = reviews.filter(
      (item) => item.reviewStatus === "UNDER_GOVERNANCE_REVIEW",
    ).length;

    const awaitingReview = reviews.filter((item) =>
      ["AWAITING_REVIEW", "AWAITING_GOVERNANCE_REVIEW"].includes(
        item.reviewStatus,
      ),
    ).length;

    const completed = reviews.filter(
      (item) => item.reviewStatus === "REVIEW_COMPLETE",
    ).length;

    const remediationRequired = reviews.filter(
      (item) => item.reviewStatus === "DEFICIENCY_IDENTIFIED",
    ).length;

    const repositoryActiveReviews = reviews.filter(
      (item) => item.repositoryActivity > 0,
    ).length;

    return json({
      ok: true,

      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      summary: {
        totalReviews: reviews.length,
        underReview,
        awaitingReview,
        completed,
        remediationRequired,
        repositoryActiveReviews,
      },

      reviews,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant review status query failed.",
      },
      500,
    );
  }
}
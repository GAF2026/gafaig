import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/require";
import { getApplicantSession } from "@/lib/applicant-auth";
import { snowflakeQuery } from "@/lib/snowflake";
import {
  APPLICANT_EVIDENCE_TABLE,
  APPLICANT_WORKFLOW_VIEW,
  cleanApplicantValue,
} from "@/lib/applicant/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ApplicationRemediationRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  EMAIL: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

type SubmittedRemediationRow = {
  EVIDENCE_ID: string | null;
  CASE_ID: string | null;
  EVIDENCE_TYPE: string | null;
  TITLE: string | null;
  DESCRIPTION: string | null;
  SOURCE_URL: string | null;
  STORAGE_REF: string | null;
  SUBMITTED_BY: string | null;
  CREATED_AT: string | null;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function deriveRemediationStatus(status: string) {
  const normalized = cleanApplicantValue(status).toUpperCase();

  if (normalized.includes("REMEDIATION")) {
    return "REMEDIATION_IN_PROGRESS";
  }

  if (normalized.includes("REVIEW")) {
    return "AWAITING_GOVERNANCE_REVIEW";
  }

  if (normalized.includes("APPROVED")) {
    return "REMEDIATION_ACCEPTED";
  }

  if (normalized.includes("COMPLETE")) {
    return "REMEDIATION_COMPLETED";
  }

  if (normalized.includes("DEFICIENCY")) {
    return "REMEDIATION_REQUIRED";
  }

  return "NOT_REQUIRED";
}

function deriveDeficiencyId(storageRef: string | null, caseId: string) {
  const value = cleanApplicantValue(storageRef);

  if (value.startsWith("DEF-")) {
    return value;
  }

  return `DEF-${caseId}`;
}

function submittedRemediationId(evidenceId: string) {
  const value = cleanApplicantValue(evidenceId);

  if (!value) {
    return "REM-UNKNOWN";
  }

  return value.startsWith("EVD-")
    ? value.replace(/^EVD-/, "REM-EVD-")
    : `REM-${value}`;
}

function deriveAgeDays(value: string | null) {
  const normalized = cleanApplicantValue(value);

  if (!normalized) {
    return null;
  }

  const timestamp = Date.parse(normalized);

  if (Number.isNaN(timestamp)) {
    return null;
  }

  const elapsedMilliseconds = Math.max(0, Date.now() - timestamp);

  return Math.floor(elapsedMilliseconds / 86_400_000);
}

function deriveWorkflowStage(status: string) {
  const normalized = cleanApplicantValue(status).toUpperCase();

  if (
    normalized.includes("REQUIRED") ||
    normalized.includes("DEFICIENCY")
  ) {
    return "REMEDIATION_REQUIRED";
  }

  if (normalized.includes("IN_PROGRESS")) {
    return "REMEDIATION_IN_PROGRESS";
  }

  if (normalized.includes("SUBMITTED")) {
    return "REMEDIATION_SUBMITTED";
  }

  if (normalized.includes("REVIEW")) {
    return "GOVERNANCE_REVIEW";
  }

  if (
    normalized.includes("ACCEPTED") ||
    normalized.includes("COMPLETED")
  ) {
    return "REMEDIATION_COMPLETE";
  }

  return "REMEDIATION";
}

function deriveRemediationReadiness(
  status: string,
  responseSubmitted: boolean,
  reviewPending: boolean,
) {
  const normalized = cleanApplicantValue(status).toUpperCase();

  if (!responseSubmitted && normalized === "REMEDIATION_REQUIRED") {
    return "AWAITING_APPLICANT_RESPONSE";
  }

  if (!responseSubmitted && normalized === "REMEDIATION_IN_PROGRESS") {
    return "RESPONSE_IN_PROGRESS";
  }

  if (responseSubmitted && reviewPending) {
    return "READY_FOR_REVIEW";
  }

  if (normalized === "AWAITING_GOVERNANCE_REVIEW") {
    return "UNDER_REVIEW";
  }

  if (
    normalized === "REMEDIATION_ACCEPTED" ||
    normalized === "REMEDIATION_COMPLETED"
  ) {
    return "COMPLETE";
  }

  return "NOT_REQUIRED";
}

function deriveRepositoryHealth(
  hasSubmission: boolean,
  updatedAt: string | null,
) {
  if (!hasSubmission) {
    return "PENDING_SUBMISSION";
  }

  if (!cleanApplicantValue(updatedAt)) {
    return "MISSING_TIMESTAMP";
  }

  return "AVAILABLE";
}

const AUTHORITY_BOUNDARY_TEXT =
  "Operational remediation repository visibility and applicant remediation submission only. No findings, scoring, decision, certification, registry, publication, verification, or governance authority is created.";

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

    const applicationRows = await snowflakeQuery<ApplicationRemediationRow>(
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

    const submittedRows = await snowflakeQuery<SubmittedRemediationRow>(
      `
      SELECT
        EVIDENCE_ID::STRING AS EVIDENCE_ID,
        CASE_ID::STRING AS CASE_ID,
        EVIDENCE_TYPE::STRING AS EVIDENCE_TYPE,
        TITLE::STRING AS TITLE,
        DESCRIPTION::STRING AS DESCRIPTION,
        SOURCE_URL::STRING AS SOURCE_URL,
        STORAGE_REF::STRING AS STORAGE_REF,
        SUBMITTED_BY::STRING AS SUBMITTED_BY,
        TO_VARCHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT
      FROM ${APPLICANT_EVIDENCE_TABLE}
      WHERE EVIDENCE_TYPE::STRING = 'remediation_submission'
        AND SUBMITTED_BY::STRING ILIKE ?
      ORDER BY CREATED_AT DESC NULLS LAST, EVIDENCE_ID DESC
      LIMIT 100
      `,
      [session.email],
    );

    const submittedByCaseId = new Map<string, SubmittedRemediationRow>();

    for (const row of submittedRows) {
      const caseId = cleanApplicantValue(row.CASE_ID);

      if (caseId && !submittedByCaseId.has(caseId)) {
        submittedByCaseId.set(caseId, row);
      }
    }

    const remediation = applicationRows.map((row) => {
      const caseId = cleanApplicantValue(row.REQUEST_ID);
      const caseStatus = cleanApplicantValue(row.STATUS) || "UNKNOWN";
      const submitted = submittedByCaseId.get(caseId);
      const hasSubmittedRemediation = Boolean(submitted);

      const derivedStatus = deriveRemediationStatus(caseStatus);

      const remediationStatus = hasSubmittedRemediation
        ? "SUBMITTED"
        : derivedStatus;

      const responseSubmitted =
        hasSubmittedRemediation ||
        [
          "REMEDIATION_IN_PROGRESS",
          "AWAITING_GOVERNANCE_REVIEW",
          "REMEDIATION_ACCEPTED",
          "REMEDIATION_COMPLETED",
        ].includes(remediationStatus);

      const reviewPending =
        hasSubmittedRemediation ||
        remediationStatus === "AWAITING_GOVERNANCE_REVIEW";

      const governanceDecisionPending =
        remediationStatus === "AWAITING_GOVERNANCE_REVIEW";

      const submittedAt = hasSubmittedRemediation
        ? cleanApplicantValue(submitted?.CREATED_AT) || null
        : null;

      const updatedAt = hasSubmittedRemediation
        ? cleanApplicantValue(submitted?.CREATED_AT) ||
          cleanApplicantValue(row.UPDATED_AT) ||
          null
        : cleanApplicantValue(row.UPDATED_AT) || null;

      const workflowStage = deriveWorkflowStage(remediationStatus);

      const remediationReadiness = deriveRemediationReadiness(
        remediationStatus,
        responseSubmitted,
        reviewPending,
      );

      const repositoryHealth = deriveRepositoryHealth(
        hasSubmittedRemediation,
        updatedAt,
      );

      const isOpen = [
        "REMEDIATION_REQUIRED",
        "REMEDIATION_IN_PROGRESS",
        "SUBMITTED",
        "AWAITING_GOVERNANCE_REVIEW",
      ].includes(remediationStatus);

      const isCompleted = [
        "REMEDIATION_ACCEPTED",
        "REMEDIATION_COMPLETED",
      ].includes(remediationStatus);

      const isPendingApplicant =
        !responseSubmitted &&
        [
          "REMEDIATION_REQUIRED",
          "REMEDIATION_IN_PROGRESS",
        ].includes(remediationStatus);

      return {
        remediationId: hasSubmittedRemediation
          ? submittedRemediationId(
              cleanApplicantValue(submitted?.EVIDENCE_ID),
            )
          : `REM-${caseId}`,

        evidenceId: hasSubmittedRemediation
          ? cleanApplicantValue(submitted?.EVIDENCE_ID)
          : null,

        deficiencyId: hasSubmittedRemediation
          ? deriveDeficiencyId(
              cleanApplicantValue(submitted?.STORAGE_REF),
              caseId,
            )
          : `DEF-${caseId}`,

        caseId,

        requestId: caseId,

        organizationName:
          cleanApplicantValue(row.ORG) || session.organizationName,

        email: cleanApplicantValue(row.EMAIL) || null,

        submittedBy: hasSubmittedRemediation
          ? cleanApplicantValue(submitted?.SUBMITTED_BY) || session.email
          : null,

        remediationType: hasSubmittedRemediation
          ? "Applicant Remediation Submission"
          : "Applicant Remediation Placeholder",

        remediationStatus,

        caseStatus,

        source: cleanApplicantValue(row.SOURCE) || "Applicant Intake",

        title: hasSubmittedRemediation
          ? cleanApplicantValue(submitted?.TITLE) ||
            "Applicant remediation submission"
          : null,

        description: hasSubmittedRemediation
          ? cleanApplicantValue(submitted?.DESCRIPTION)
          : null,

        sourceUrl: hasSubmittedRemediation
          ? cleanApplicantValue(submitted?.SOURCE_URL) || null
          : null,

        responseSubmitted,

        reviewPending,

        governanceDecisionPending,

        submittedAt,

        reviewedAt: null,

        updatedAt,

        repositoryCategory: "Remediation Repository",

        workflowOrigin: hasSubmittedRemediation
          ? "Applicant Remediation Submission"
          : "Applicant Workflow",

        workflowStage,

        remediationReadiness,

        repositoryHealth,

        ageDays: deriveAgeDays(updatedAt || submittedAt),

        isOpen,

        isCompleted,

        isPendingApplicant,

        isPendingReview: reviewPending,

        authorityBoundaryText: AUTHORITY_BOUNDARY_TEXT,
      };
    });

    const knownCaseIds = new Set(remediation.map((item) => item.caseId));

    for (const submitted of submittedRows) {
      const caseId = cleanApplicantValue(submitted.CASE_ID);

      if (!caseId || knownCaseIds.has(caseId)) {
        continue;
      }

      const submittedAt =
        cleanApplicantValue(submitted.CREATED_AT) || null;

      remediation.push({
        remediationId: submittedRemediationId(
          cleanApplicantValue(submitted.EVIDENCE_ID),
        ),
        evidenceId: cleanApplicantValue(submitted.EVIDENCE_ID),
        deficiencyId: deriveDeficiencyId(
          cleanApplicantValue(submitted.STORAGE_REF),
          caseId,
        ),
        caseId,
        requestId: caseId,
        organizationName: session.organizationName,
        email: session.email,
        submittedBy:
          cleanApplicantValue(submitted.SUBMITTED_BY) || session.email,
        remediationType: "Applicant Remediation Submission",
        remediationStatus: "SUBMITTED",
        caseStatus: "UNKNOWN",
        source: "Applicant Remediation Submission",
        title:
          cleanApplicantValue(submitted.TITLE) ||
          "Applicant remediation submission",
        description: cleanApplicantValue(submitted.DESCRIPTION),
        sourceUrl: cleanApplicantValue(submitted.SOURCE_URL) || null,
        responseSubmitted: true,
        reviewPending: true,
        governanceDecisionPending: false,
        submittedAt,
        reviewedAt: null,
        updatedAt: submittedAt,

        repositoryCategory: "Remediation Repository",

        workflowOrigin: "Applicant Remediation Submission",

        workflowStage: "REMEDIATION_SUBMITTED",

        remediationReadiness: "READY_FOR_REVIEW",

        repositoryHealth: submittedAt
          ? "AVAILABLE"
          : "MISSING_TIMESTAMP",

        ageDays: deriveAgeDays(submittedAt),

        isOpen: true,

        isCompleted: false,

        isPendingApplicant: false,

        isPendingReview: true,

        authorityBoundaryText: AUTHORITY_BOUNDARY_TEXT,
      });
    }

    const remediationRequired = remediation.filter(
      (item) => item.remediationStatus === "REMEDIATION_REQUIRED",
    ).length;

    const remediationInProgress = remediation.filter(
      (item) =>
        item.remediationStatus === "REMEDIATION_IN_PROGRESS" ||
        item.remediationStatus === "SUBMITTED",
    ).length;

    const awaitingReview = remediation.filter(
      (item) =>
        item.remediationStatus === "AWAITING_GOVERNANCE_REVIEW" ||
        item.reviewPending,
    ).length;

    const completed = remediation.filter(
      (item) =>
        item.remediationStatus === "REMEDIATION_COMPLETED" ||
        item.remediationStatus === "REMEDIATION_ACCEPTED",
    ).length;

    const submitted = remediation.filter(
      (item) => item.responseSubmitted,
    ).length;

    return json({
      ok: true,

      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      summary: {
        totalRemediationRecords: remediation.length,
        remediationRequired,
        remediationInProgress,
        awaitingReview,
        completed,
        submitted,
      },

      remediation,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant remediation query failed.",
      },
      500,
    );
  }
}
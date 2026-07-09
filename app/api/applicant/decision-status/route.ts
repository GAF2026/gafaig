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
  classifyApplicantEvidenceType,
  cleanApplicantValue,
  emptyApplicantRepositoryCounts,
  firstApplicantValue,
  repositoryScopeFromSession,
  type ApplicantRepositoryCounts,
  type PersistedApplicantRepositoryRow,
} from "@/lib/applicant/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type DecisionRow = {
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

function deriveDecisionStatus(
  status: string,
  counts?: ApplicantRepositoryCounts,
) {
  if (counts?.certificationRecords) {
    return "CERTIFICATION_DECISION_COMPLETE";
  }

  if (counts?.remediationRecords) {
    return "REMEDIATION_REVIEW_PENDING";
  }

  if (
    counts?.requestResponseRecords ||
    counts?.evidenceRecords ||
    counts?.artifactRecords
  ) {
    return "DECISION_PENDING";
  }

  const normalized = cleanApplicantValue(status).toUpperCase();

  if (normalized.includes("CERTIFIED")) {
    return "CERTIFICATION_DECISION_COMPLETE";
  }

  if (normalized.includes("APPROVED")) {
    return "APPROVED";
  }

  if (normalized.includes("REJECTED")) {
    return "NOT_APPROVED";
  }

  if (normalized.includes("DENIED")) {
    return "NOT_APPROVED";
  }

  if (normalized.includes("REVIEW")) {
    return "DECISION_PENDING";
  }

  if (normalized.includes("REMEDIATION")) {
    return "REMEDIATION_REQUIRED";
  }

  if (normalized.includes("DEFICIENCY")) {
    return "DEFICIENCY_PENDING";
  }

  return "NOT_READY_FOR_DECISION";
}

function deriveDecisionOutcome(status: string) {
  if (
    status === "APPROVED" ||
    status === "CERTIFICATION_DECISION_COMPLETE"
  ) {
    return "FAVORABLE";
  }

  if (status === "NOT_APPROVED") {
    return "UNFAVORABLE";
  }

  return "PENDING";
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

    const rows = await snowflakeQuery<DecisionRow>(
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
      rows
        .map((row) => cleanApplicantValue(row.REQUEST_ID))
        .filter(Boolean),
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
    const latestRecordByCaseId =
      new Map<string, PersistedApplicantRepositoryRow>();

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

    const decisions = rows.map((row) => {
      const caseId = cleanApplicantValue(row.REQUEST_ID);
      const caseStatus = cleanApplicantValue(row.STATUS) || "UNKNOWN";

      const counts =
        countsByCaseId.get(caseId) || emptyApplicantRepositoryCounts();

      const latestRecord = latestRecordByCaseId.get(caseId);

      const repositoryActivity =
        applicantRepositoryActivity(counts);

      const decisionStatus = deriveDecisionStatus(
        caseStatus,
        counts,
      );

      const decisionOutcome =
        deriveDecisionOutcome(decisionStatus);

      const decisionIssued = [
        "APPROVED",
        "NOT_APPROVED",
        "CERTIFICATION_DECISION_COMPLETE",
      ].includes(decisionStatus);

      const certificationReady = [
        "APPROVED",
        "CERTIFICATION_DECISION_COMPLETE",
      ].includes(decisionStatus);

      return {
        decisionId: `DEC-${caseId}`,
        caseId,
        requestId: caseId,
        certificationId: `CERT-${caseId}`,

        organizationName:
          cleanApplicantValue(row.ORG) ||
          session.organizationName,

        email:
          cleanApplicantValue(row.EMAIL) || null,

        decisionStatus,
        caseStatus,

        source:
          cleanApplicantValue(row.SOURCE) ||
          "Applicant Intake",

        decisionType:
          repositoryActivity > 0
            ? "GAFAIG Applicant Decision Visibility"
            : "GAFAIG Applicant Decision Visibility Slot",

        decisionOutcome,
        decisionIssued,
        certificationReady,

        issuedAt:
          firstApplicantValue(latestRecord || {}, [
            "ISSUED_AT",
            "DECISION_AT",
            "APPROVED_AT",
            "CREATED_AT",
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
        certificationRecords: counts.certificationRecords,
        repositoryActivity,
      };
    });

    const issued = decisions.filter(
      (item) => item.decisionIssued,
    ).length;

    const pending = decisions.filter(
      (item) => item.decisionStatus === "DECISION_PENDING",
    ).length;

    const favorable = decisions.filter(
      (item) => item.decisionOutcome === "FAVORABLE",
    ).length;

    const notReady = decisions.filter(
      (item) => item.decisionStatus === "NOT_READY_FOR_DECISION",
    ).length;

    const repositoryActiveDecisions = decisions.filter(
      (item) => item.repositoryActivity > 0,
    ).length;

    return json({
      ok: true,

      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      summary: {
        totalDecisions: decisions.length,
        issued,
        pending,
        favorable,
        notReady,
        repositoryActiveDecisions,
      },

      decisions,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant decision status query failed.",
      },
      500,
    );
  }
}
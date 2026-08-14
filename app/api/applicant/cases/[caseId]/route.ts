import { NextResponse } from "next/server";
import { snowflakeQuery } from "@/lib/snowflake";
import { getApplicantSession } from "@/lib/applicant-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const VIEW_NAME = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";
const EVIDENCE_TABLE = "GAFAIG_DB.CORE.VERIFICATION_EVIDENCE";

type CaseDetailRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  EMAIL: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

type EvidenceRow = {
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

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function isArtifactType(value: string) {
  const normalized = value.trim().toLowerCase();

  return [
    "artifact_upload",
    "artifact",
    "applicant_artifact",
    "applicant_artifact_upload",
  ].includes(normalized);
}

function isRequestResponseType(value: string) {
  const normalized = value.trim().toLowerCase();

  return [
    "request_response",
    "request_response_submission",
    "applicant_request_response",
    "applicant_response",
    "information_request_response",
  ].includes(normalized);
}

function isRemediationType(value: string) {
  const normalized = value.trim().toLowerCase();

  return [
    "remediation_submission",
    "remediation",
    "applicant_remediation",
    "deficiency_remediation",
  ].includes(normalized);
}

function isCertificationType(value: string) {
  const normalized = value.trim().toLowerCase();

  return [
    "certification",
    "certification_record",
    "certification_issuance",
    "applicant_certification",
    "applicant_certification_record",
  ].includes(normalized);
}

function isGeneralEvidenceType(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) return false;

  return (
    !isArtifactType(normalized) &&
    !isRequestResponseType(normalized) &&
    !isRemediationType(normalized) &&
    !isCertificationType(normalized)
  );
}

function isActiveStatus(status: string) {
  const normalized = status.trim().toUpperCase();

  return !["CLOSED", "COMPLETE", "COMPLETED", "ARCHIVED"].includes(normalized);
}

function deriveReviewStatus(
  caseStatus: string,
  repositoryActivity: number,
  requestResponseRecords: number,
  remediationRecords: number,
) {
  const normalized = caseStatus.trim().toUpperCase();

  if (normalized.includes("APPROVED") || normalized.includes("CERTIFIED")) {
    return "REVIEW_COMPLETE";
  }

  if (remediationRecords > 0) {
    return "AWAITING_GOVERNANCE_REVIEW";
  }

  if (requestResponseRecords > 0 || repositoryActivity > 0) {
    return "UNDER_GOVERNANCE_REVIEW";
  }

  if (normalized.includes("DEFICIENCY")) {
    return "DEFICIENCY_IDENTIFIED";
  }

  if (normalized.includes("REVIEW")) {
    return "UNDER_GOVERNANCE_REVIEW";
  }

  if (normalized.includes("RECEIVED")) {
    return "QUEUED_FOR_REVIEW";
  }

  return "PENDING_REVIEW";
}

function deriveDecisionStatus(
  caseStatus: string,
  repositoryActivity: number,
  remediationRecords: number,
  certificationRecords: number,
) {
  const normalized = caseStatus.trim().toUpperCase();

  if (certificationRecords > 0 || normalized.includes("CERTIFIED")) {
    return "CERTIFICATION_DECISION_COMPLETE";
  }

  if (normalized.includes("APPROVED")) {
    return "APPROVED";
  }

  if (normalized.includes("REJECTED") || normalized.includes("DENIED")) {
    return "NOT_APPROVED";
  }

  if (remediationRecords > 0) {
    return "REMEDIATION_REVIEW_PENDING";
  }

  if (repositoryActivity > 0 || normalized.includes("REVIEW")) {
    return "DECISION_PENDING";
  }

  if (normalized.includes("DEFICIENCY")) {
    return "DEFICIENCY_PENDING";
  }

  return "NOT_READY_FOR_DECISION";
}

export async function GET(
  _request: Request,
  { params }: { params: { caseId: string } },
) {
  try {
    const session = await getApplicantSession();

    if (!session) {
      return json(
        {
          ok: false,
          error: "Applicant authentication required.",
        },
        401,
      );
    }

    const caseId = clean(params.caseId);

    if (!caseId) {
      return json({ ok: false, error: "Missing caseId." }, 400);
    }

    const rows = await snowflakeQuery<CaseDetailRow>(
      `
      SELECT
        REQUEST_ID::STRING AS REQUEST_ID,
        COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING AS ORG,
        COALESCE(CONTACT_EMAIL, EMAIL)::STRING AS EMAIL,
        STATUS::STRING AS STATUS,
        COALESCE(SOURCE_TABLE, SOURCE)::STRING AS SOURCE,
        TO_VARCHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM ${VIEW_NAME}
      WHERE REQUEST_ID::STRING = ?
        AND COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING ILIKE ?
      LIMIT 1
      `,
      [caseId, session.organizationName],
    );

    const row = rows[0];

    if (!row) {
      return json(
        {
          ok: false,
          error:
            "Applicant case not found or not available for this organization.",
        },
        404,
      );
    }

    const evidenceRows = await snowflakeQuery<EvidenceRow>(
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
      FROM ${EVIDENCE_TABLE}
      WHERE CASE_ID::STRING = ?
      ORDER BY CREATED_AT DESC NULLS LAST, EVIDENCE_ID DESC
      LIMIT 250
      `,
      [caseId],
    );

    const uploadedEvidence = evidenceRows.filter((item) =>
      isGeneralEvidenceType(clean(item.EVIDENCE_TYPE)),
    ).length;

    const artifacts = evidenceRows.filter((item) =>
      isArtifactType(clean(item.EVIDENCE_TYPE)),
    ).length;

    const requestResponseRecords = evidenceRows.filter((item) =>
      isRequestResponseType(clean(item.EVIDENCE_TYPE)),
    ).length;

    const remediationRecords = evidenceRows.filter((item) =>
      isRemediationType(clean(item.EVIDENCE_TYPE)),
    ).length;

    const certifications = evidenceRows.filter((item) =>
      isCertificationType(clean(item.EVIDENCE_TYPE)),
    ).length;

    const responseSubmitted = requestResponseRecords > 0;
    const remediationSubmitted = remediationRecords > 0;

    const repositoryActivity =
      uploadedEvidence +
      artifacts +
      requestResponseRecords +
      remediationRecords +
      certifications;

    const caseStatus = clean(row.STATUS) || "UNKNOWN";
    const active = isActiveStatus(caseStatus);

    const reviewStatus = deriveReviewStatus(
      caseStatus,
      repositoryActivity,
      requestResponseRecords,
      remediationRecords,
    );

    const decisionStatus = deriveDecisionStatus(
      caseStatus,
      repositoryActivity,
      remediationRecords,
      certifications,
    );

    return json({
      ok: true,
      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },
      case: {
        caseId: clean(row.REQUEST_ID),
        organizationName: clean(row.ORG) || session.organizationName,
        email: clean(row.EMAIL) || null,
        status: caseStatus,
        stage: clean(row.SOURCE) || "Applicant Intake",
        updatedAt: clean(row.UPDATED_AT) || null,
      },
      workflow: {
        submissionReceived: true,
        informationRequest: active && !responseSubmitted,
        deficiencyNotice: remediationSubmitted,
        responseSubmitted,
        review:
          reviewStatus === "UNDER_GOVERNANCE_REVIEW" ||
          reviewStatus === "AWAITING_GOVERNANCE_REVIEW" ||
          reviewStatus === "REVIEW_COMPLETE",
        certification: certifications > 0,
        published: false,
      },
      counts: {
        openRequests: responseSubmitted || !active ? 0 : 1,
        uploadedEvidence,
        artifacts,
        certifications,
        requestResponseRecords,
        remediationRecords,
        repositoryActivity,
      },
      lifecycle: {
        reviewStatus,
        decisionStatus,
        repositoryRecord: repositoryActivity > 0,
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant case detail query failed.",
      },
      500,
    );
  }
}
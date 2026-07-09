import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/require";
import { getApplicantSession } from "@/lib/applicant-auth";
import { snowflakeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const WORKFLOW_VIEW = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";
const EVIDENCE_TABLE = "GAFAIG_DB.CORE.VERIFICATION_EVIDENCE";

type WorkflowEvidenceRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  EMAIL: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

type PersistedEvidenceRow = Record<string, unknown>;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function first(row: PersistedEvidenceRow, keys: string[]): string {
  for (const key of keys) {
    const value = clean(row[key]);
    if (value) return value;
  }

  return "";
}

function stripEvidencePrefix(evidenceId: string) {
  return evidenceId.startsWith("EV-") ? evidenceId.slice(3) : evidenceId;
}

function ageDays(value: string | null) {
  if (!value) return null;

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return null;

  return Math.max(
    0,
    Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24)),
  );
}

function workflowStage(status: string) {
  const normalized = status.toUpperCase();

  if (normalized.includes("DEFICIENCY")) return "DEFICIENCY";
  if (normalized.includes("REMEDIATION")) return "REMEDIATION";
  if (normalized.includes("REVIEW")) return "REVIEW";
  if (normalized.includes("PENDING")) return "PENDING";
  if (normalized.includes("COMPLETE")) return "COMPLETE";

  return "EVIDENCE";
}

function reviewReadiness(status: string, hasFile: boolean) {
  if (!hasFile) return "AWAITING_UPLOAD";

  const normalized = status.toUpperCase();

  if (normalized.includes("REVIEW")) return "UNDER_REVIEW";
  if (normalized.includes("ACCEPT")) return "READY";
  if (normalized.includes("VALID")) return "READY";

  return "READY_FOR_REVIEW";
}

function repositoryHealth(hasFile: boolean, updatedAt: string | null) {
  if (!hasFile) return "PENDING_UPLOAD";
  if (!updatedAt) return "MISSING_TIMESTAMP";
  return "AVAILABLE";
}

function isArtifactType(value: string) {
  return [
    "artifact_upload",
    "artifact",
    "applicant_artifact",
    "applicant_artifact_upload",
  ].includes(value.trim().toLowerCase());
}

function isRemediationType(value: string) {
  return [
    "remediation_submission",
    "remediation",
    "applicant_remediation",
    "deficiency_remediation",
  ].includes(value.trim().toLowerCase());
}

function isCertificationType(value: string) {
  return [
    "certification",
    "certification_record",
    "certification_issuance",
    "applicant_certification",
    "applicant_certification_record",
  ].includes(value.trim().toLowerCase());
}

function isRequestResponseType(value: string) {
  return [
    "request_response",
    "request_response_submission",
    "applicant_request_response",
    "applicant_response",
    "information_request_response",
  ].includes(value.trim().toLowerCase());
}

function isEvidenceRecordType(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) return true;

  return (
    !isArtifactType(normalized) &&
    !isRemediationType(normalized) &&
    !isCertificationType(normalized) &&
    !isRequestResponseType(normalized)
  );
}

function normalizeEvidenceId(evidenceId: string, requestId: string) {
  if (evidenceId.startsWith("EV-")) return evidenceId;
  if (evidenceId.startsWith("EVD-")) return evidenceId;
  return `EV-${requestId}`;
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      evidenceId: string;
    };
  },
) {
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

    const evidenceId = clean(decodeURIComponent(params.evidenceId));

    if (!evidenceId) {
      return json(
        {
          ok: false,
          error: "Missing evidenceId.",
        },
        400,
      );
    }

    const requestId = stripEvidencePrefix(evidenceId);

    const persistedRows = await snowflakeQuery<PersistedEvidenceRow>(
      `
      SELECT *
      FROM ${EVIDENCE_TABLE}
      WHERE EVIDENCE_ID::STRING = ?
         OR CASE_ID::STRING = ?
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 50
      `,
      [evidenceId, requestId],
    );

    const persisted = persistedRows.find((row) => {
      const evidenceType = first(row, ["EVIDENCE_TYPE", "TYPE"]);

      const orgName = first(row, [
        "ORG_NAME",
        "ORGANIZATION_NAME",
        "ORGANIZATION",
        "ORG",
      ]).toLowerCase();

      const orgId = first(row, [
        "ORG_ID",
        "ORGANIZATION_ID",
        "APPLICANT_ORG_ID",
      ]).toLowerCase();

      const submittedBy = first(row, [
        "SUBMITTED_BY",
        "UPLOADED_BY",
        "CREATED_BY",
        "EMAIL",
      ]).toLowerCase();

      const belongsToApplicant =
        (orgName &&
          orgName === session.organizationName.trim().toLowerCase()) ||
        (orgId && orgId === session.organizationId.trim().toLowerCase()) ||
        (submittedBy && submittedBy === session.email.trim().toLowerCase());

      return belongsToApplicant && isEvidenceRecordType(evidenceType);
    });

    if (persisted) {
      const caseId =
        first(persisted, [
          "CASE_ID",
          "APPLICATION_ID",
          "VERIFICATION_CASE_ID",
        ]) || requestId;

      const persistedEvidenceId =
        first(persisted, ["EVIDENCE_ID", "ID", "RECORD_ID"]) || evidenceId;

      const evidenceStatus =
        first(persisted, ["EVIDENCE_STATUS", "STATUS", "REVIEW_STATUS"]) ||
        "UPLOADED";

      const fileName =
        first(persisted, ["FILE_NAME", "FILENAME", "OBJECT_NAME"]) || null;

      const uploadedAt =
        first(persisted, ["UPLOADED_AT", "SUBMITTED_AT", "CREATED_AT"]) ||
        null;

      const updatedAt =
        first(persisted, ["UPDATED_AT", "MODIFIED_AT", "CREATED_AT"]) || null;

      const hasFile = Boolean(
        fileName ||
          first(persisted, [
            "STORAGE_REF",
            "STORAGE_URL",
            "FILE_URL",
            "ARTIFACT_URI",
          ]),
      );

      return json({
        ok: true,

        organization: {
          organizationId: session.organizationId,
          organizationName: session.organizationName,
        },

        evidence: {
          evidenceId: persistedEvidenceId,
          caseId,
          requestId: caseId,
          organizationName:
            first(persisted, [
              "ORG_NAME",
              "ORGANIZATION_NAME",
              "ORGANIZATION",
              "ORG",
            ]) || session.organizationName,
          email:
            first(persisted, ["EMAIL", "CONTACT_EMAIL", "SUBMITTED_BY"]) ||
            session.email ||
            null,
          evidenceType:
            first(persisted, ["EVIDENCE_TYPE", "TYPE"]) ||
            "Applicant Evidence",
          evidenceStatus,
          source:
            first(persisted, ["SOURCE", "SOURCE_TABLE"]) ||
            "Verification Evidence",
          fileName,
          fileType:
            first(persisted, ["FILE_TYPE", "MIME_TYPE", "CONTENT_TYPE"]) ||
            null,
          fileSize:
            first(persisted, ["FILE_SIZE", "SIZE_BYTES", "CONTENT_LENGTH"]) ||
            null,
          uploadedAt,
          updatedAt,
          repositoryRecord: true,
          repositoryCategory: "Evidence Repository",
          workflowOrigin: "Persisted Evidence",
          workflowStage: workflowStage(evidenceStatus),
          reviewReadiness: reviewReadiness(evidenceStatus, hasFile),
          repositoryHealth: repositoryHealth(hasFile, updatedAt || uploadedAt),
          ageDays: ageDays(updatedAt || uploadedAt),
          hasFile,
          isPending: false,
          authorityBoundaryText:
            "Operational evidence visibility only. No verification, scoring, certification, registry, publication, or governance authority is created.",
        },

        workflow: [
          {
            stage: "Evidence Record Found",
            status: "COMPLETE",
          },
          {
            stage: "Applicant Upload Received",
            status: "COMPLETE",
          },
          {
            stage: "Repository Visibility",
            status: "COMPLETE",
          },
          {
            stage: "Governance Review",
            status:
              first(persisted, ["REVIEW_STATUS", "EVIDENCE_STATUS", "STATUS"]) ||
              "PENDING",
          },
        ],

        authorityBoundary: {
          applicantMayUploadEvidence: true,
          applicantMayViewEvidence: true,
          applicantMayMutateGovernanceReview: false,
          applicantMayMutateFindings: false,
          applicantMayMutateScoring: false,
          applicantMayMutateDecision: false,
          applicantMayMutateRegistry: false,
          applicantMayMutateCertification: false,
        },
      });
    }

    const workflowRows = await snowflakeQuery<WorkflowEvidenceRow>(
      `
      SELECT
        REQUEST_ID::STRING AS REQUEST_ID,
        COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING AS ORG,
        COALESCE(CONTACT_EMAIL, EMAIL)::STRING AS EMAIL,
        STATUS::STRING AS STATUS,
        COALESCE(SOURCE_TABLE, SOURCE)::STRING AS SOURCE,
        TO_VARCHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM ${WORKFLOW_VIEW}
      WHERE REQUEST_ID::STRING = ?
      LIMIT 1
      `,
      [requestId],
    );

    if (!workflowRows.length) {
      return json(
        {
          ok: false,
          error: "Applicant evidence record not found.",
        },
        404,
      );
    }

    const row = workflowRows[0];

    const organizationName = clean(row.ORG) || session.organizationName;

    if (
      organizationName.trim().toLowerCase() !==
      session.organizationName.trim().toLowerCase()
    ) {
      return json(
        {
          ok: false,
          error: "Evidence record is outside applicant organization scope.",
        },
        403,
      );
    }

    const normalizedEvidenceId = normalizeEvidenceId(evidenceId, requestId);
    const updatedAt = clean(row.UPDATED_AT) || null;
    const status = clean(row.STATUS) || "PENDING";

    return json({
      ok: true,

      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      evidence: {
        evidenceId: normalizedEvidenceId,
        caseId: clean(row.REQUEST_ID),
        requestId: clean(row.REQUEST_ID),
        organizationName,
        email: clean(row.EMAIL) || null,
        evidenceType: "Applicant Evidence Slot",
        evidenceStatus: "NOT_UPLOADED",
        source: clean(row.SOURCE) || "Applicant Intake",
        fileName: null,
        fileType: null,
        fileSize: null,
        uploadedAt: null,
        updatedAt,
        repositoryRecord: false,
        repositoryCategory: "Evidence Repository",
        workflowOrigin: "Applicant Workflow",
        workflowStage: workflowStage(status),
        reviewReadiness: "AWAITING_UPLOAD",
        repositoryHealth: "PENDING_UPLOAD",
        ageDays: ageDays(updatedAt),
        hasFile: false,
        isPending: true,
        authorityBoundaryText:
          "Operational evidence visibility only. No verification, scoring, certification, registry, publication, or governance authority is created.",
      },

      workflow: [
        {
          stage: "Evidence Slot Created",
          status: "COMPLETE",
        },
        {
          stage: "Applicant Upload Pending",
          status: "PENDING",
        },
        {
          stage: "Repository Visibility Pending",
          status: "PENDING",
        },
        {
          stage: "Governance Review Pending",
          status: "PENDING",
        },
      ],

      authorityBoundary: {
        applicantMayUploadEvidence: true,
        applicantMayViewEvidence: true,
        applicantMayMutateGovernanceReview: false,
        applicantMayMutateFindings: false,
        applicantMayMutateScoring: false,
        applicantMayMutateDecision: false,
        applicantMayMutateRegistry: false,
        applicantMayMutateCertification: false,
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant evidence detail query failed.",
      },
      500,
    );
  }
}
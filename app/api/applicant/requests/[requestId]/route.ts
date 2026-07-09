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

type SubmissionRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  EMAIL: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

type PersistedRequestRow = Record<string, unknown>;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function first(row: PersistedRequestRow, keys: string[]): string {
  for (const key of keys) {
    const value = clean(row[key]);
    if (value) return value;
  }

  return "";
}

function deriveRequestStatus(status: string, hasResponse: boolean) {
  if (hasResponse) return "RESPONDED";

  const normalized = status.trim().toUpperCase();

  if (normalized.includes("PENDING")) return "OPEN";
  if (normalized.includes("RECEIVED")) return "OPEN";
  if (normalized.includes("IN REVIEW")) return "IN_REVIEW";
  if (normalized.includes("APPROVED")) return "CLOSED";
  if (normalized.includes("COMPLETE")) return "CLOSED";

  return normalized || "OPEN";
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

function isEvidenceAttachmentType(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) return true;

  return (
    !isArtifactType(normalized) &&
    !isCertificationType(normalized) &&
    !isRequestResponseType(normalized)
  );
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      requestId: string;
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

    const requestId = clean(decodeURIComponent(params.requestId));

    if (!requestId) {
      return json(
        {
          ok: false,
          error: "Missing requestId.",
        },
        400,
      );
    }

    const rows = await snowflakeQuery<SubmissionRow>(
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

    if (!rows.length) {
      return json(
        {
          ok: false,
          error: "Applicant request not found.",
        },
        404,
      );
    }

    const row = rows[0];

    const organizationName = clean(row.ORG) || session.organizationName;

    if (
      organizationName.trim().toLowerCase() !==
      session.organizationName.trim().toLowerCase()
    ) {
      return json(
        {
          ok: false,
          error: "Request is outside applicant organization scope.",
        },
        403,
      );
    }

    const persistedRows = await snowflakeQuery<PersistedRequestRow>(
      `
      SELECT *
      FROM ${EVIDENCE_TABLE}
      WHERE CASE_ID::STRING = ?
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 250
      `,
      [requestId],
    );

    const applicantRows = persistedRows.filter((item) => {
      const orgName = first(item, [
        "ORG_NAME",
        "ORGANIZATION_NAME",
        "ORGANIZATION",
        "ORG",
      ]).toLowerCase();

      const orgId = first(item, [
        "ORG_ID",
        "ORGANIZATION_ID",
        "APPLICANT_ORG_ID",
      ]).toLowerCase();

      const submittedBy = first(item, [
        "SUBMITTED_BY",
        "UPLOADED_BY",
        "CREATED_BY",
        "EMAIL",
      ]).toLowerCase();

      return (
        orgName === session.organizationName.trim().toLowerCase() ||
        orgId === session.organizationId.trim().toLowerCase() ||
        submittedBy === session.email.trim().toLowerCase()
      );
    });

    const responseRows = applicantRows.filter((item) =>
      isRequestResponseType(first(item, ["EVIDENCE_TYPE", "TYPE"])),
    );

    const attachmentRows = applicantRows.filter((item) =>
      isEvidenceAttachmentType(first(item, ["EVIDENCE_TYPE", "TYPE"])),
    );

    const artifactRows = applicantRows.filter((item) =>
      isArtifactType(first(item, ["EVIDENCE_TYPE", "TYPE"])),
    );

    const certificationRows = applicantRows.filter((item) =>
      isCertificationType(first(item, ["EVIDENCE_TYPE", "TYPE"])),
    );

    const caseStatus = clean(row.STATUS) || "UNKNOWN";
    const hasResponse = responseRows.length > 0;
    const latestResponse = responseRows[0];

    return json({
      ok: true,

      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      request: {
        requestId: clean(row.REQUEST_ID),
        caseId: clean(row.REQUEST_ID),
        organizationName,
        email: clean(row.EMAIL) || null,
        requestType: "Applicant Information Request",
        requestStatus: deriveRequestStatus(caseStatus, hasResponse),
        caseStatus,
        source: clean(row.SOURCE) || "Applicant Intake",
        dueDate: null,
        updatedAt:
          first(latestResponse || {}, [
            "UPDATED_AT",
            "MODIFIED_AT",
            "CREATED_AT",
          ]) ||
          clean(row.UPDATED_AT) ||
          null,
        responseId:
          first(latestResponse || {}, ["EVIDENCE_ID", "ID", "RECORD_ID"]) ||
          null,
        responseSubmittedAt:
          first(latestResponse || {}, [
            "SUBMITTED_AT",
            "UPLOADED_AT",
            "CREATED_AT",
          ]) || null,
        responseSubmittedBy:
          first(latestResponse || {}, [
            "SUBMITTED_BY",
            "UPLOADED_BY",
            "CREATED_BY",
            "EMAIL",
          ]) || null,
      },

      metrics: {
        attachments: attachmentRows.length,
        responses: responseRows.length,
        artifacts: artifactRows.length,
        certifications: certificationRows.length,
      },

      workflow: [
        {
          stage: "Request Created",
          status: "COMPLETE",
        },
        {
          stage: "Applicant Review",
          status: hasResponse ? "COMPLETE" : "PENDING",
        },
        {
          stage: "Applicant Response",
          status: hasResponse ? "COMPLETE" : "PENDING",
        },
        {
          stage: "Evidence Attachment",
          status: attachmentRows.length > 0 ? "AVAILABLE" : "PENDING",
        },
        {
          stage: "Artifact Repository",
          status: artifactRows.length > 0 ? "AVAILABLE" : "PENDING",
        },
        {
          stage: "Certification Consumption",
          status: certificationRows.length > 0 ? "AVAILABLE" : "PENDING",
        },
        {
          stage: "Governance Review",
          status: hasResponse ? "PENDING" : "WAITING_ON_APPLICANT",
        },
        {
          stage: "Request Closure",
          status:
            deriveRequestStatus(caseStatus, hasResponse) === "CLOSED"
              ? "COMPLETE"
              : "PENDING",
        },
      ],
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant request detail query failed.",
      },
      500,
    );
  }
}
import { NextResponse } from "next/server";
import { getApplicantSession } from "@/lib/applicant-auth";
import { executeQuery } from "@/lib/snowflake";

type RouteContext = {
  params: {
    requestId: string;
  };
};

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
  if (normalized.includes("APPROVED")) return "COMPLETE";

  return "INFORMATION_REQUEST";
}

function responseReadiness(requestStatus: string, hasResponse: boolean) {
  const normalized = requestStatus.toUpperCase();

  if (hasResponse) return "RESPONSE_AVAILABLE";
  if (normalized.includes("COMPLETE")) return "RESPONSE_COMPLETE";
  if (normalized.includes("REVIEW")) return "PENDING_REVIEW";
  if (normalized.includes("DEFICIENCY")) return "APPLICANT_RESPONSE_REQUIRED";
  if (normalized.includes("OPEN")) return "APPLICANT_RESPONSE_REQUIRED";

  return "NOT_CLASSIFIED";
}

function repositoryHealth(requestStatus: string, updatedAt: string | null) {
  const normalized = requestStatus.toUpperCase();

  if (!updatedAt) return "MISSING_TIMESTAMP";
  if (normalized.includes("COMPLETE")) return "COMPLETE";
  if (normalized.includes("REVIEW")) return "UNDER_REVIEW";
  if (normalized.includes("DEFICIENCY")) return "DEFICIENCY_RELATED";

  return "OPEN";
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await getApplicantSession();

    if (!session) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const requestId = decodeURIComponent(params.requestId);

    const rows = await executeQuery<{
      REQUEST_ID: string;
      CASE_ID: string;
      ORGANIZATION_NAME: string;
      CONTACT_EMAIL: string | null;
      REQUEST_TYPE: string;
      REQUEST_STATUS: string;
      CASE_STATUS: string;
      SOURCE: string;
      SOURCE_URL: string | null;
      REQUEST_TEXT: string | null;
      RESPONSE_TEXT: string | null;
      SUBMITTED_AT: string | null;
      UPDATED_AT: string | null;
    }>(
      `
      SELECT
          REQUEST_ID,
          CASE_ID,
          ORGANIZATION_NAME,
          CONTACT_EMAIL,
          REQUEST_TYPE,
          REQUEST_STATUS,
          CASE_STATUS,
          SOURCE,
          SOURCE_URL,
          REQUEST_TEXT,
          RESPONSE_TEXT,
          SUBMITTED_AT,
          UPDATED_AT
      FROM CORE_API.V_APPLICANT_INFORMATION_REQUESTS
      WHERE ORGANIZATION_ID = ?
        AND REQUEST_ID = ?
      `,
      [
        session.organizationId,
        requestId,
      ],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Information request not found.",
        },
        { status: 404 },
      );
    }

    const record = rows[0];
    const hasResponse = Boolean(record.RESPONSE_TEXT);
    const isCompleted = record.REQUEST_STATUS === "COMPLETED";
    const isPendingReview = record.REQUEST_STATUS === "UNDER_REVIEW";
    const isDeficiencyRelated =
      record.REQUEST_STATUS === "DEFICIENCY_ISSUED" ||
      record.CASE_STATUS.toUpperCase().includes("DEFICIENCY");

    const requestDetail = {
      requestId: record.REQUEST_ID,
      caseId: record.CASE_ID,
      organizationName: record.ORGANIZATION_NAME,
      contactEmail: record.CONTACT_EMAIL,
      email: record.CONTACT_EMAIL,
      requestType: record.REQUEST_TYPE,
      requestStatus: record.REQUEST_STATUS,
      caseStatus: record.CASE_STATUS,
      source: record.SOURCE,
      sourceUrl: record.SOURCE_URL,
      requestText: record.REQUEST_TEXT,
      responseText: record.RESPONSE_TEXT,
      submittedAt: record.SUBMITTED_AT,
      dueDate: null,
      updatedAt: record.UPDATED_AT,
      responseId: null,
      responseSubmittedAt: hasResponse ? record.UPDATED_AT : null,
      responseSubmittedBy: hasResponse ? record.CONTACT_EMAIL : null,
      repositoryCategory: "Information Request Repository",
      workflowOrigin: record.SOURCE || "Applicant Workflow",
      workflowStage: workflowStage(record.CASE_STATUS || record.REQUEST_STATUS),
      responseReadiness: responseReadiness(record.REQUEST_STATUS, hasResponse),
      repositoryHealth: repositoryHealth(record.REQUEST_STATUS, record.UPDATED_AT),
      ageDays: ageDays(record.UPDATED_AT || record.SUBMITTED_AT),
      isOpen: !isCompleted,
      isCompleted,
      isPendingApplicant:
        record.REQUEST_STATUS === "OPEN" ||
        record.REQUEST_STATUS === "DEFICIENCY_ISSUED",
      isPendingReview,
      isDeficiencyRelated,
      authorityBoundaryText:
        "Operational information request visibility only. No governance authority, certification authority, publication authority, registry authority, scoring authority, decision authority, findings authority, or verification authority is created.",
    };

    return NextResponse.json({
      ok: true,
      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      informationRequest: requestDetail,
      request: requestDetail,

      workflow: [
        {
          status: "COMPLETE",
          title: "Information Request Issued",
        },
        {
          status: "COMPLETE",
          title: "Applicant Notified",
        },
        {
          status:
            record.RESPONSE_TEXT
              ? "COMPLETE"
              : "PENDING",
          title: "Applicant Response",
        },
        {
          status: "PENDING",
          title: "Governance Review",
        },
        {
          status: "PENDING",
          title: "Decision Update",
        },
      ],

      authorityBoundaries: [
        {
          title: "View Request",
          description:
            "Allowed for applicant users.",
        },
        {
          title: "Submit Response",
          description:
            "Allowed for applicant users.",
        },
        {
          title: "Modify Findings",
          description:
            "Not allowed for applicant users.",
        },
        {
          title: "Modify Decision",
          description:
            "Not allowed for applicant users.",
        },
        {
          title: "Publish Registry",
          description:
            "Not allowed for applicant users.",
        },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant information request detail query failed.",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/require";
import { getApplicantSession } from "@/lib/applicant-auth";
import { snowflakeQuery } from "@/lib/snowflake";
import {
  APPLICANT_EVIDENCE_TABLE,
  APPLICANT_WORKFLOW_VIEW,
  applicantRepositoryRowBelongsToScope,
  cleanApplicantValue,
  firstApplicantValue,
  repositoryScopeFromSession,
  type PersistedApplicantRepositoryRow,
} from "@/lib/applicant/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type WorkflowRow = {
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

function deriveRequestStatus(status: string) {
  const normalized = cleanApplicantValue(status).toUpperCase();

  if (normalized.includes("PENDING")) return "OPEN";
  if (normalized.includes("RECEIVED")) return "OPEN";
  if (normalized.includes("IN REVIEW")) return "IN_REVIEW";
  if (normalized.includes("APPROVED")) return "CLOSED";
  if (normalized.includes("COMPLETE")) return "CLOSED";

  return normalized || "OPEN";
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);

    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Applicant authentication required." },
        auth.status ?? 401,
      );
    }

    const session = await getApplicantSession();

    if (!session) {
      return json({ ok: false, error: "Applicant session unavailable." }, 401);
    }

    const workflowRows = await snowflakeQuery<WorkflowRow>(
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
      workflowRows
        .map((row) => cleanApplicantValue(row.REQUEST_ID))
        .filter(Boolean),
    );

    const persistedRows = await snowflakeQuery<PersistedApplicantRepositoryRow>(
      `
      SELECT *
      FROM ${APPLICANT_EVIDENCE_TABLE}
      WHERE LOWER(EVIDENCE_TYPE::STRING) IN (
        'request_response',
        'request_response_submission',
        'applicant_request_response',
        'applicant_response',
        'information_request_response'
      )
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 250
      `,
      [],
    );

    const scope = repositoryScopeFromSession(session, workflowCaseIds);
    const responseByCaseId = new Map<string, PersistedApplicantRepositoryRow>();

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

      if (!responseByCaseId.has(caseId)) {
        responseByCaseId.set(caseId, row);
      }
    }

    const requests = workflowRows.map((row) => {
      const status = cleanApplicantValue(row.STATUS) || "UNKNOWN";
      const caseId = cleanApplicantValue(row.REQUEST_ID);
      const response = responseByCaseId.get(caseId);

      const responseId = response
        ? firstApplicantValue(response, ["EVIDENCE_ID", "ID", "RECORD_ID"])
        : "";

      const responseSubmittedAt = response
        ? firstApplicantValue(response, ["SUBMITTED_AT", "UPLOADED_AT", "CREATED_AT"])
        : "";

      const responseSubmittedBy = response
        ? firstApplicantValue(response, [
            "SUBMITTED_BY",
            "UPLOADED_BY",
            "CREATED_BY",
            "EMAIL",
          ])
        : "";

      const responseStatus = response
        ? firstApplicantValue(response, [
            "RESPONSE_STATUS",
            "EVIDENCE_STATUS",
            "STATUS",
          ]) || "SUBMITTED"
        : "NOT_SUBMITTED";

      return {
        requestId: caseId,
        caseId,
        organizationName:
          cleanApplicantValue(row.ORG) || session.organizationName,
        email: cleanApplicantValue(row.EMAIL) || null,
        requestType: "Applicant Information Request",
        requestStatus: response ? "RESPONDED" : deriveRequestStatus(status),
        caseStatus: status,
        source: cleanApplicantValue(row.SOURCE) || "Applicant Intake",
        dueDate: null,
        updatedAt: cleanApplicantValue(row.UPDATED_AT) || responseSubmittedAt || null,
        responseId: responseId || null,
        responseStatus,
        responseSubmittedAt: responseSubmittedAt || null,
        responseSubmittedBy: responseSubmittedBy || null,
        repositoryRecord: Boolean(response),
      };
    });

    const openRequests = requests.filter((item) =>
      ["OPEN", "IN_REVIEW"].includes(item.requestStatus),
    ).length;

    const respondedRequests = requests.filter(
      (item) => item.repositoryRecord,
    ).length;

    return json({
      ok: true,
      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },
      summary: {
        totalRequests: requests.length,
        openRequests,
        closedRequests: requests.length - openRequests,
        respondedRequests,
      },
      requests,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant requests query failed.",
      },
      500,
    );
  }
}
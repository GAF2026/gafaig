import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/require";
import { getApplicantSession } from "@/lib/applicant-auth";
import { snowflakeQuery } from "@/lib/snowflake";
import {
  APPLICANT_WORKFLOW_VIEW,
  cleanApplicantValue,
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
  if (normalized.includes("REVIEW")) return "UNDER_REVIEW";
  if (normalized.includes("DEFICIENCY")) return "DEFICIENCY_ISSUED";
  if (normalized.includes("APPROVED")) return "COMPLETED";
  if (normalized.includes("COMPLETE")) return "COMPLETED";

  return normalized || "OPEN";
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
  if (normalized.includes("APPROVED")) return "COMPLETE";

  return "INFORMATION_REQUEST";
}

function responseReadiness(requestStatus: string) {
  if (requestStatus === "COMPLETED") return "RESPONSE_COMPLETE";
  if (requestStatus === "UNDER_REVIEW") return "PENDING_REVIEW";
  if (requestStatus === "DEFICIENCY_ISSUED") return "APPLICANT_RESPONSE_REQUIRED";
  if (requestStatus === "OPEN") return "APPLICANT_RESPONSE_REQUIRED";

  return "NOT_CLASSIFIED";
}

function repositoryHealth(requestStatus: string, updatedAt: string | null) {
  if (!updatedAt) return "MISSING_TIMESTAMP";
  if (requestStatus === "COMPLETED") return "COMPLETE";
  if (requestStatus === "UNDER_REVIEW") return "UNDER_REVIEW";
  if (requestStatus === "DEFICIENCY_ISSUED") return "DEFICIENCY_RELATED";

  return "OPEN";
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

    const rows = await snowflakeQuery<WorkflowRow>(
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

    const informationRequests = rows.map((row) => {
      const requestStatus = deriveRequestStatus(
        cleanApplicantValue(row.STATUS),
      );
      const caseStatus = cleanApplicantValue(row.STATUS) || "UNKNOWN";
      const source = cleanApplicantValue(row.SOURCE) || "Applicant Intake";
      const updatedAt = cleanApplicantValue(row.UPDATED_AT) || null;
      const isCompleted = requestStatus === "COMPLETED";
      const isPendingReview = requestStatus === "UNDER_REVIEW";
      const isDeficiencyRelated =
        requestStatus === "DEFICIENCY_ISSUED" ||
        caseStatus.toUpperCase().includes("DEFICIENCY");

      return {
        requestId: cleanApplicantValue(row.REQUEST_ID),
        caseId: cleanApplicantValue(row.REQUEST_ID),
        organizationName:
          cleanApplicantValue(row.ORG) || session.organizationName,
        contactEmail: cleanApplicantValue(row.EMAIL) || null,
        requestType: "Applicant Information Request",
        requestStatus,
        caseStatus,
        source,
        updatedAt,
        repositoryCategory: "Information Request Repository",
        workflowOrigin: source,
        workflowStage: workflowStage(caseStatus),
        responseReadiness: responseReadiness(requestStatus),
        repositoryHealth: repositoryHealth(requestStatus, updatedAt),
        ageDays: ageDays(updatedAt),
        isOpen: !isCompleted,
        isCompleted,
        isPendingApplicant:
          requestStatus === "OPEN" || requestStatus === "DEFICIENCY_ISSUED",
        isPendingReview,
        isDeficiencyRelated,
        authorityBoundaryText:
          "Operational information request visibility only. No governance authority, certification authority, publication authority, registry authority, scoring authority, decision authority, or verification authority is created.",
      };
    });

    return json({
      ok: true,
      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },
      summary: {
        totalRequests: informationRequests.length,
        openRequests: informationRequests.filter(
          (item) => item.requestStatus === "OPEN",
        ).length,
        deficiencyIssued: informationRequests.filter(
          (item) => item.requestStatus === "DEFICIENCY_ISSUED",
        ).length,
        underReview: informationRequests.filter(
          (item) => item.requestStatus === "UNDER_REVIEW",
        ).length,
        completed: informationRequests.filter(
          (item) => item.requestStatus === "COMPLETED",
        ).length,
      },
      informationRequests,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant information requests query failed.",
      },
      500,
    );
  }
}

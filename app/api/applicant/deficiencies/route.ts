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

type DeficiencyRow = {
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

function deriveDeficiencyStatus(status: string) {
  const normalized = cleanApplicantValue(status).toUpperCase();

  if (normalized.includes("DEFICIENCY")) return "OPEN";
  if (normalized.includes("PENDING")) return "OPEN";
  if (normalized.includes("REMEDIATION")) return "REMEDIATION_PENDING";
  if (normalized.includes("REVIEW")) return "UNDER_REVIEW";
  if (normalized.includes("APPROVED")) return "RESOLVED";
  if (normalized.includes("COMPLETE")) return "RESOLVED";

  return "NO_DEFICIENCY_IDENTIFIED";
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

  return "DEFICIENCY";
}

function remediationReadiness(deficiencyStatus: string) {
  if (deficiencyStatus === "RESOLVED") return "REMEDIATION_COMPLETE";
  if (deficiencyStatus === "UNDER_REVIEW") return "PENDING_REVIEW";
  if (deficiencyStatus === "REMEDIATION_PENDING") return "REMEDIATION_PENDING";
  if (deficiencyStatus === "OPEN") return "RESPONSE_REQUIRED";

  return "NO_REMEDIATION_REQUIRED";
}

function repositoryHealth(deficiencyStatus: string, updatedAt: string | null) {
  if (!updatedAt) return "MISSING_TIMESTAMP";
  if (deficiencyStatus === "RESOLVED") return "RESOLVED";
  if (deficiencyStatus === "UNDER_REVIEW") return "UNDER_REVIEW";
  if (deficiencyStatus === "REMEDIATION_PENDING") return "REMEDIATION_PENDING";
  if (deficiencyStatus === "OPEN") return "OPEN";

  return "NO_DEFICIENCY_IDENTIFIED";
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

    const rows = await snowflakeQuery<DeficiencyRow>(
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

    const deficiencies = rows.map((row) => {
      const caseId = cleanApplicantValue(row.REQUEST_ID);
      const caseStatus = cleanApplicantValue(row.STATUS) || "UNKNOWN";
      const deficiencyStatus = deriveDeficiencyStatus(caseStatus);
      const source = cleanApplicantValue(row.SOURCE) || "Applicant Intake";
      const updatedAt = cleanApplicantValue(row.UPDATED_AT) || null;
      const isResolved = deficiencyStatus === "RESOLVED";
      const isResponseRequired = ["OPEN", "REMEDIATION_PENDING"].includes(
        deficiencyStatus,
      );

      return {
        deficiencyId: `DEF-${caseId}`,
        caseId,
        requestId: caseId,
        organizationName:
          cleanApplicantValue(row.ORG) || session.organizationName,
        email: cleanApplicantValue(row.EMAIL) || null,
        deficiencyType: "Applicant Deficiency Placeholder",
        deficiencyStatus,
        caseStatus,
        source,
        description:
          deficiencyStatus === "NO_DEFICIENCY_IDENTIFIED"
            ? "No applicant deficiency has been identified for this case in the current visibility layer."
            : "Applicant deficiency visibility placeholder derived from current workflow status.",
        responseRequired: isResponseRequired,
        dueDate: null,
        updatedAt,
        repositoryCategory: "Deficiency Repository",
        workflowOrigin: source,
        workflowStage: workflowStage(caseStatus),
        remediationReadiness: remediationReadiness(deficiencyStatus),
        repositoryHealth: repositoryHealth(deficiencyStatus, updatedAt),
        ageDays: ageDays(updatedAt),
        isOpen: !isResolved,
        isResolved,
        isResponseRequired,
        isRemediationPending: deficiencyStatus === "REMEDIATION_PENDING",
        isUnderReview: deficiencyStatus === "UNDER_REVIEW",
        authorityBoundaryText:
          "Operational deficiency repository visibility only. No governance authority, certification authority, publication authority, registry authority, scoring authority, decision authority, findings authority, evidence authority, or verification authority is created.",
      };
    });

    const openDeficiencies = deficiencies.filter((item) =>
      ["OPEN", "REMEDIATION_PENDING"].includes(item.deficiencyStatus),
    ).length;

    const resolvedDeficiencies = deficiencies.filter(
      (item) => item.deficiencyStatus === "RESOLVED",
    ).length;

    return json({
      ok: true,
      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },
      summary: {
        totalDeficiencies: deficiencies.length,
        openDeficiencies,
        resolvedDeficiencies,
        responseRequired: deficiencies.filter((item) => item.responseRequired)
          .length,
      },
      deficiencies,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant deficiencies query failed.",
      },
      500,
    );
  }
}
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

type WorkflowDeficiencyRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  EMAIL: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

type PersistedDeficiencyRow = Record<string, unknown>;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function first(row: PersistedDeficiencyRow, keys: string[]): string {
  for (const key of keys) {
    const value = clean(row[key]);
    if (value) return value;
  }

  return "";
}

function stripDeficiencyPrefix(deficiencyId: string) {
  return deficiencyId.startsWith("DEF-") ? deficiencyId.slice(4) : deficiencyId;
}

function normalizeDeficiencyId(deficiencyId: string, requestId: string) {
  if (deficiencyId.startsWith("DEF-")) return deficiencyId;
  return `DEF-${requestId}`;
}

function deriveDeficiencyStatus(status: string, hasRemediation: boolean) {
  if (hasRemediation) return "REMEDIATION_SUBMITTED";

  const normalized = status.trim().toUpperCase();

  if (normalized.includes("DEFICIENCY")) return "OPEN";
  if (normalized.includes("PENDING")) return "OPEN";
  if (normalized.includes("REMEDIATION")) return "REMEDIATION_PENDING";
  if (normalized.includes("REVIEW")) return "UNDER_REVIEW";
  if (normalized.includes("APPROVED")) return "RESOLVED";
  if (normalized.includes("COMPLETE")) return "RESOLVED";

  return "NO_DEFICIENCY_IDENTIFIED";
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

function remediationIdFromEvidenceId(evidenceId: string) {
  const value = clean(evidenceId);

  if (!value) return null;

  return value.startsWith("EVD-")
    ? value.replace(/^EVD-/, "REM-EVD-")
    : `REM-${value}`;
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      deficiencyId: string;
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

    const deficiencyId = clean(decodeURIComponent(params.deficiencyId));

    if (!deficiencyId) {
      return json(
        {
          ok: false,
          error: "Missing deficiencyId.",
        },
        400,
      );
    }

    const requestId = stripDeficiencyPrefix(deficiencyId);
    const normalizedDeficiencyId = normalizeDeficiencyId(
      deficiencyId,
      requestId,
    );

    const rows = await snowflakeQuery<WorkflowDeficiencyRow>(
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
          error: "Applicant deficiency not found.",
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
          error: "Deficiency record is outside applicant organization scope.",
        },
        403,
      );
    }

    const remediationRows = await snowflakeQuery<PersistedDeficiencyRow>(
      `
      SELECT *
      FROM ${EVIDENCE_TABLE}
      WHERE CASE_ID::STRING = ?
         OR STORAGE_REF::STRING = ?
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 100
      `,
      [requestId, normalizedDeficiencyId],
    );

    const applicantRemediationRows = remediationRows.filter((item) => {
      const evidenceType = first(item, ["EVIDENCE_TYPE", "TYPE"]);

      if (!isRemediationType(evidenceType)) {
        return false;
      }

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

    const remediation = applicantRemediationRows[0];
    const hasRemediation = Boolean(remediation);

    const caseStatus = clean(row.STATUS) || "UNKNOWN";
    const deficiencyStatus = deriveDeficiencyStatus(
      caseStatus,
      hasRemediation,
    );

    const evidenceId =
      first(remediation || {}, ["EVIDENCE_ID", "ID", "RECORD_ID"]) || null;

    return json({
      ok: true,

      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      deficiency: {
        deficiencyId: normalizedDeficiencyId,
        caseId: clean(row.REQUEST_ID),
        requestId: clean(row.REQUEST_ID),
        organizationName,
        email: clean(row.EMAIL) || null,

        deficiencyType: hasRemediation
          ? "Applicant Deficiency Remediation"
          : "Applicant Deficiency Slot",

        deficiencyStatus,
        caseStatus,

        source: hasRemediation
          ? first(remediation || {}, ["SOURCE", "SOURCE_TABLE"]) ||
            "Applicant Remediation Submission"
          : clean(row.SOURCE) || "Applicant Intake",

        description: hasRemediation
          ? first(remediation || {}, ["DESCRIPTION", "EVIDENCE_DESCRIPTION"]) ||
            first(remediation || {}, ["TITLE", "EVIDENCE_TITLE"]) ||
            "Applicant remediation has been submitted for this deficiency."
          : deficiencyStatus === "NO_DEFICIENCY_IDENTIFIED"
            ? "No applicant deficiency has been identified for this case in the current visibility layer."
            : "Applicant deficiency visibility derived from current workflow status.",

        responseRequired:
          !hasRemediation &&
          ["OPEN", "REMEDIATION_PENDING"].includes(deficiencyStatus),

        dueDate: null,

        updatedAt:
          first(remediation || {}, ["UPDATED_AT", "MODIFIED_AT", "CREATED_AT"]) ||
          clean(row.UPDATED_AT) ||
          null,

        remediationId: evidenceId
          ? remediationIdFromEvidenceId(evidenceId)
          : null,

        remediationEvidenceId: evidenceId,

        remediationSubmittedAt:
          first(remediation || {}, ["SUBMITTED_AT", "UPLOADED_AT", "CREATED_AT"]) ||
          null,

        remediationSubmittedBy:
          first(remediation || {}, [
            "SUBMITTED_BY",
            "UPLOADED_BY",
            "CREATED_BY",
            "EMAIL",
          ]) || null,
      },

      workflow: [
        {
          stage: "Deficiency Identified",
          status:
            deficiencyStatus === "NO_DEFICIENCY_IDENTIFIED"
              ? "NOT_IDENTIFIED"
              : "COMPLETE",
        },
        {
          stage: "Applicant Response",
          status: hasRemediation ? "COMPLETE" : "PENDING",
        },
        {
          stage: "Remediation Submitted",
          status: hasRemediation ? "COMPLETE" : "PENDING",
        },
        {
          stage: "Governance Review",
          status: hasRemediation ? "PENDING" : "WAITING_ON_APPLICANT",
        },
        {
          stage: "Deficiency Resolution",
          status: deficiencyStatus === "RESOLVED" ? "COMPLETE" : "PENDING",
        },
      ],

      authorityBoundary: {
        applicantMayViewDeficiency: true,
        applicantMayCreateDeficiency: false,
        applicantMayCloseDeficiency: false,
        applicantMayModifyDeficiency: false,
        applicantMayModifyFindings: false,
        applicantMayModifyScoring: false,
        applicantMayModifyDecision: false,
        applicantMayModifyCertification: false,
        applicantMayModifyRegistry: false,
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant deficiency detail query failed.",
      },
      500,
    );
  }
}
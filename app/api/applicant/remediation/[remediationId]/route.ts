import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/require";
import { getApplicantSession } from "@/lib/applicant-auth";
import { snowflakeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const APPLICATION_VIEW_NAME = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";
const EVIDENCE_TABLE_NAME = "GAFAIG_DB.CORE.VERIFICATION_EVIDENCE";

type ApplicationRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  EMAIL: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

type EvidenceRow = Record<string, unknown>;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function first(row: EvidenceRow, keys: string[]): string {
  for (const key of keys) {
    const value = clean(row[key]);
    if (value) return value;
  }

  return "";
}

function submittedRemediationId(evidenceId: string) {
  const value = clean(evidenceId);

  if (!value) return "REM-UNKNOWN";

  return value.startsWith("EVD-")
    ? value.replace(/^EVD-/, "REM-EVD-")
    : `REM-${value}`;
}

function evidenceIdFromRemediationId(remediationId: string) {
  const value = clean(remediationId);

  if (value.startsWith("REM-EVD-")) {
    return value.replace(/^REM-EVD-/, "EVD-");
  }

  if (value.startsWith("REM-")) {
    return value.replace(/^REM-/, "");
  }

  return value;
}

function caseIdFromRemediationId(remediationId: string) {
  const value = clean(remediationId);

  if (value.startsWith("REM-REQ-")) {
    return value.replace(/^REM-/, "");
  }

  return "";
}

function deriveRemediationStatus(status: string, hasSubmittedRemediation: boolean) {
  if (hasSubmittedRemediation) return "SUBMITTED";

  const normalized = status.trim().toUpperCase();

  if (normalized.includes("REMEDIATION")) return "REMEDIATION_IN_PROGRESS";
  if (normalized.includes("REVIEW")) return "AWAITING_GOVERNANCE_REVIEW";
  if (normalized.includes("APPROVED")) return "REMEDIATION_ACCEPTED";
  if (normalized.includes("COMPLETE")) return "REMEDIATION_COMPLETED";
  if (normalized.includes("DEFICIENCY")) return "REMEDIATION_REQUIRED";

  return "NOT_REQUIRED";
}

function deriveDeficiencyId(storageRef: string | null, caseId: string) {
  const value = clean(storageRef);

  if (value.startsWith("DEF-")) return value;

  return `DEF-${caseId}`;
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      remediationId: string;
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

    const remediationId = clean(decodeURIComponent(params.remediationId));

    if (!remediationId) {
      return json(
        {
          ok: false,
          error: "Missing remediationId.",
        },
        400,
      );
    }

    const requestedEvidenceId = evidenceIdFromRemediationId(remediationId);
    const requestedCaseId = caseIdFromRemediationId(remediationId);

    const evidenceRows = await snowflakeQuery<EvidenceRow>(
      `
      SELECT *
      FROM ${EVIDENCE_TABLE_NAME}
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 500
      `,
      [],
    );

    const submittedRows = evidenceRows.filter((row) => {
      const evidenceType = first(row, ["EVIDENCE_TYPE", "TYPE"]).toLowerCase();

      return [
        "remediation_submission",
        "remediation",
        "applicant_remediation",
        "deficiency_remediation",
      ].includes(evidenceType);
    });

    const matchedSubmittedRow = submittedRows.find((row) => {
      const evidenceId = first(row, ["EVIDENCE_ID", "ID", "RECORD_ID"]);
      const caseId = first(row, [
        "CASE_ID",
        "REQUEST_ID",
        "APPLICATION_ID",
        "VERIFICATION_CASE_ID",
      ]);

      return (
        evidenceId === requestedEvidenceId ||
        submittedRemediationId(evidenceId) === remediationId ||
        caseId === requestedCaseId
      );
    });

    const caseId =
      first(matchedSubmittedRow || {}, [
        "CASE_ID",
        "REQUEST_ID",
        "APPLICATION_ID",
        "VERIFICATION_CASE_ID",
      ]) ||
      requestedCaseId ||
      remediationId.replace(/^REM-/, "");

    const applicationRows = await snowflakeQuery<ApplicationRow>(
      `
      SELECT
        REQUEST_ID::STRING AS REQUEST_ID,
        COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING AS ORG,
        COALESCE(CONTACT_EMAIL, EMAIL)::STRING AS EMAIL,
        STATUS::STRING AS STATUS,
        COALESCE(SOURCE_TABLE, SOURCE)::STRING AS SOURCE,
        TO_VARCHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM ${APPLICATION_VIEW_NAME}
      WHERE REQUEST_ID::STRING = ?
      LIMIT 1
      `,
      [caseId],
    );

    const applicationRow = applicationRows[0];

    if (!applicationRow && !matchedSubmittedRow) {
      return json(
        {
          ok: false,
          error: "Applicant remediation not found.",
        },
        404,
      );
    }

    const organizationName =
      clean(applicationRow?.ORG) ||
      first(matchedSubmittedRow || {}, [
        "ORG_NAME",
        "ORGANIZATION_NAME",
        "ORGANIZATION",
        "ORG",
      ]) ||
      session.organizationName;

    const orgMatches =
      organizationName.toLowerCase() === session.organizationName.toLowerCase();

    const orgIdMatches =
      first(matchedSubmittedRow || {}, [
        "ORG_ID",
        "ORGANIZATION_ID",
        "APPLICANT_ORG_ID",
      ]).toLowerCase() === session.organizationId.toLowerCase();

    const submittedByMatches =
      first(matchedSubmittedRow || {}, [
        "SUBMITTED_BY",
        "UPLOADED_BY",
        "CREATED_BY",
        "EMAIL",
      ]).toLowerCase() === session.email.toLowerCase();

    if (!orgMatches && !orgIdMatches && !submittedByMatches) {
      return json(
        {
          ok: false,
          error: "Remediation is outside applicant organization scope.",
        },
        403,
      );
    }

    const caseStatus = clean(applicationRow?.STATUS) || "UNKNOWN";
    const hasSubmittedRemediation = Boolean(matchedSubmittedRow);
    const remediationStatus = deriveRemediationStatus(
      caseStatus,
      hasSubmittedRemediation,
    );

    const evidenceId = first(matchedSubmittedRow || {}, [
      "EVIDENCE_ID",
      "ID",
      "RECORD_ID",
    ]);

    const submittedAt = first(matchedSubmittedRow || {}, [
      "SUBMITTED_AT",
      "UPLOADED_AT",
      "CREATED_AT",
    ]);

    return json({
      ok: true,

      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      remediation: {
        remediationId: hasSubmittedRemediation
          ? submittedRemediationId(evidenceId)
          : `REM-${caseId}`,
        evidenceId: evidenceId || null,
        deficiencyId: deriveDeficiencyId(
          first(matchedSubmittedRow || {}, ["STORAGE_REF"]),
          caseId,
        ),
        caseId,
        requestId: caseId,
        organizationName,
        email: clean(applicationRow?.EMAIL) || session.email || null,
        submittedBy:
          first(matchedSubmittedRow || {}, [
            "SUBMITTED_BY",
            "UPLOADED_BY",
            "CREATED_BY",
            "EMAIL",
          ]) || null,
        remediationType: hasSubmittedRemediation
          ? "Applicant Remediation Submission"
          : "Applicant Remediation Placeholder",
        remediationStatus,
        caseStatus,
        source:
          first(matchedSubmittedRow || {}, ["SOURCE", "SOURCE_TABLE"]) ||
          clean(applicationRow?.SOURCE) ||
          "Applicant Intake",
        title:
          first(matchedSubmittedRow || {}, [
            "TITLE",
            "EVIDENCE_TITLE",
            "NAME",
          ]) || "Applicant remediation record",
        description:
          first(matchedSubmittedRow || {}, [
            "DESCRIPTION",
            "EVIDENCE_DESCRIPTION",
            "NOTES",
          ]) || null,
        sourceUrl:
          first(matchedSubmittedRow || {}, ["SOURCE_URL", "URL", "LINK"]) ||
          null,
        responseSubmitted: hasSubmittedRemediation,
        reviewPending:
          remediationStatus === "SUBMITTED" ||
          remediationStatus === "AWAITING_GOVERNANCE_REVIEW",
        governanceDecisionPending:
          remediationStatus === "AWAITING_GOVERNANCE_REVIEW",
        submittedAt: submittedAt || null,
        reviewedAt: null,
        updatedAt:
          first(matchedSubmittedRow || {}, [
            "UPDATED_AT",
            "MODIFIED_AT",
            "CREATED_AT",
          ]) ||
          clean(applicationRow?.UPDATED_AT) ||
          null,
      },

      workflow: [
        {
          stage: "Deficiency Identified",
          status: "COMPLETE",
        },
        {
          stage: "Remediation Required",
          status:
            remediationStatus === "NOT_REQUIRED" ? "NOT_REQUIRED" : "COMPLETE",
        },
        {
          stage: "Applicant Remediation Submitted",
          status: hasSubmittedRemediation ? "COMPLETE" : "PENDING",
        },
        {
          stage: "Governance Review",
          status: hasSubmittedRemediation ? "PENDING" : "WAITING_ON_APPLICANT",
        },
        {
          stage: "Remediation Decision",
          status:
            remediationStatus === "REMEDIATION_ACCEPTED" ||
            remediationStatus === "REMEDIATION_COMPLETED"
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
            : "Applicant remediation detail query failed.",
      },
      500,
    );
  }
}
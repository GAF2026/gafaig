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

type WorkflowCertificationRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  EMAIL: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

type PersistedCertificationRow = Record<string, unknown>;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function first(row: PersistedCertificationRow, keys: string[]): string {
  for (const key of keys) {
    const value = clean(row[key]);
    if (value) return value;
  }

  return "";
}

function stripCertificationPrefix(certificationId: string) {
  return certificationId.startsWith("CERT-")
    ? certificationId.slice(5)
    : certificationId;
}

function deriveCertificationStatus(status: string) {
  const normalized = status.trim().toUpperCase();

  if (normalized.includes("CERTIFIED")) return "CERTIFIED";
  if (normalized.includes("APPROVED")) return "CERTIFICATION_READY";
  if (normalized.includes("RENEWAL")) return "RENEWAL_PENDING";
  if (normalized.includes("SUSPENDED")) return "SUSPENDED";
  if (normalized.includes("REVOKED")) return "REVOKED";
  if (normalized.includes("APPEAL")) return "APPEAL_PENDING";

  return "NOT_CERTIFIED";
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

function normalizeCertificationId(certificationId: string, requestId: string) {
  if (certificationId.startsWith("CERT-")) return certificationId;
  return `CERT-${requestId}`;
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      certificationId: string;
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

    const certificationId = clean(decodeURIComponent(params.certificationId));

    if (!certificationId) {
      return json(
        {
          ok: false,
          error: "Missing certificationId.",
        },
        400,
      );
    }

    const requestId = stripCertificationPrefix(certificationId);

    const persistedRows = await snowflakeQuery<PersistedCertificationRow>(
      `
      SELECT *
      FROM ${EVIDENCE_TABLE}
      WHERE CASE_ID::STRING = ?
         OR EVIDENCE_ID::STRING = ?
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 100
      `,
      [requestId, certificationId],
    );

    const persistedCertification = persistedRows.find((row) => {
      const evidenceType = first(row, ["EVIDENCE_TYPE", "TYPE"]);

      if (!isCertificationType(evidenceType)) {
        return false;
      }

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

      return (
        orgName === session.organizationName.trim().toLowerCase() ||
        orgId === session.organizationId.trim().toLowerCase() ||
        submittedBy === session.email.trim().toLowerCase()
      );
    });

    if (persistedCertification) {
      const caseId =
        first(persistedCertification, [
          "CASE_ID",
          "APPLICATION_ID",
          "VERIFICATION_CASE_ID",
        ]) || requestId;

      const persistedCertificationId =
        first(persistedCertification, [
          "CERTIFICATION_ID",
          "EVIDENCE_ID",
          "ID",
          "RECORD_ID",
        ]) || normalizeCertificationId(certificationId, caseId);

      const certificationStatus =
        first(persistedCertification, [
          "CERTIFICATION_STATUS",
          "EVIDENCE_STATUS",
          "STATUS",
          "REVIEW_STATUS",
        ]) || "CERTIFIED";

      const renewalStatus =
        first(persistedCertification, [
          "RENEWAL_STATUS",
          "LIFECYCLE_STATUS",
        ]) || "NOT_STARTED";

      const publicationStatus =
        first(persistedCertification, [
          "PUBLICATION_STATUS",
          "REGISTRY_STATUS",
        ]) || "NOT_PUBLISHED";

      return json({
        ok: true,

        organization: {
          organizationId: session.organizationId,
          organizationName: session.organizationName,
        },

        certification: {
          certificationId: persistedCertificationId,
          caseId,
          requestId: caseId,

          organizationName:
            first(persistedCertification, [
              "ORG_NAME",
              "ORGANIZATION_NAME",
              "ORGANIZATION",
              "ORG",
            ]) || session.organizationName,

          email:
            first(persistedCertification, [
              "EMAIL",
              "CONTACT_EMAIL",
              "SUBMITTED_BY",
            ]) || session.email,

          certificationType:
            first(persistedCertification, [
              "CERTIFICATION_TYPE",
              "EVIDENCE_TYPE",
              "TYPE",
            ]) || "GAFAIG Applicant Certification",

          certificationStatus,

          caseStatus:
            first(persistedCertification, [
              "CASE_STATUS",
              "WORKFLOW_STATUS",
            ]) || certificationStatus,

          source:
            first(persistedCertification, [
              "SOURCE",
              "SOURCE_TABLE",
            ]) || "Certification Repository",

          issuedAt:
            first(persistedCertification, [
              "ISSUED_AT",
              "CREATED_AT",
              "SUBMITTED_AT",
            ]) || null,

          validFrom:
            first(persistedCertification, [
              "VALID_FROM",
              "EFFECTIVE_FROM",
              "ISSUED_AT",
              "CREATED_AT",
            ]) || null,

          validTo:
            first(persistedCertification, [
              "VALID_TO",
              "EXPIRES_AT",
              "EXPIRATION_AT",
            ]) || null,

          renewalStatus,
          publicationStatus,

          updatedAt:
            first(persistedCertification, [
              "UPDATED_AT",
              "MODIFIED_AT",
              "CREATED_AT",
            ]) || null,
        },

        workflow: [
          { stage: "Certification Record Found", status: "COMPLETE" },
          { stage: "Certification Review", status: "COMPLETE" },
          {
            stage: "Certification Issuance",
            status:
              certificationStatus === "CERTIFIED" ||
              certificationStatus === "CERTIFICATION_READY"
                ? "COMPLETE"
                : "PENDING",
          },
          { stage: "Renewal Lifecycle", status: renewalStatus },
          { stage: "Publication Lifecycle", status: publicationStatus },
        ],

        authorityBoundary: {
          applicantMayViewCertification: true,
          applicantMayIssueCertification: false,
          applicantMayRevokeCertification: false,
          applicantMayModifyCertification: false,
          applicantMayModifyFindings: false,
          applicantMayModifyScoring: false,
          applicantMayModifyDecision: false,
          applicantMayModifyRegistry: false,
        },
      });
    }

    const rows = await snowflakeQuery<WorkflowCertificationRow>(
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
          error: "Applicant certification not found.",
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
          error: "Certification record is outside applicant organization scope.",
        },
        403,
      );
    }

    const caseStatus = clean(row.STATUS) || "UNKNOWN";
    const certificationStatus = deriveCertificationStatus(caseStatus);

    return json({
      ok: true,

      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      certification: {
        certificationId: normalizeCertificationId(certificationId, requestId),
        caseId: clean(row.REQUEST_ID),
        requestId: clean(row.REQUEST_ID),
        organizationName,
        email: clean(row.EMAIL) || null,
        certificationType: "GAFAIG Applicant Certification Slot",
        certificationStatus,
        caseStatus,
        source: clean(row.SOURCE) || "Applicant Intake",
        issuedAt: null,
        validFrom: null,
        validTo: null,
        renewalStatus: "NOT_STARTED",
        publicationStatus: "NOT_PUBLISHED",
        updatedAt: clean(row.UPDATED_AT) || null,
      },

      workflow: [
        { stage: "Certification Eligibility", status: "COMPLETE" },
        {
          stage: "Certification Review",
          status:
            certificationStatus === "NOT_CERTIFIED" ? "PENDING" : "AVAILABLE",
        },
        {
          stage: "Certification Issuance",
          status:
            certificationStatus === "CERTIFIED" ||
            certificationStatus === "CERTIFICATION_READY"
              ? "AVAILABLE"
              : "PENDING",
        },
        { stage: "Renewal Lifecycle", status: "PENDING" },
        { stage: "Publication Lifecycle", status: "PENDING" },
      ],

      authorityBoundary: {
        applicantMayViewCertification: true,
        applicantMayIssueCertification: false,
        applicantMayRevokeCertification: false,
        applicantMayModifyCertification: false,
        applicantMayModifyFindings: false,
        applicantMayModifyScoring: false,
        applicantMayModifyDecision: false,
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
            : "Applicant certification detail query failed.",
      },
      500,
    );
  }
}
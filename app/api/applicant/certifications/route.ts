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

const AUTHORITY_BOUNDARY_TEXT =
  "Operational certification repository visibility only. No certification issuance, renewal, appeal, reinstatement, publication, registry, scoring, decision, verification, or governance authority is created.";

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

function deriveCertificationStatus(status: string) {
  const normalized = cleanApplicantValue(status).toUpperCase();

  if (normalized.includes("CERTIFIED")) {
    return "CERTIFIED";
  }

  if (normalized.includes("APPROVED")) {
    return "CERTIFICATION_READY";
  }

  if (normalized.includes("RENEWAL")) {
    return "RENEWAL_PENDING";
  }

  if (normalized.includes("SUSPENDED")) {
    return "SUSPENDED";
  }

  if (normalized.includes("REVOKED")) {
    return "REVOKED";
  }

  if (normalized.includes("APPEAL")) {
    return "APPEAL_PENDING";
  }

  return "NOT_CERTIFIED";
}

function deriveAgeDays(value: string | null) {
  const normalized = cleanApplicantValue(value);

  if (!normalized) {
    return null;
  }

  const timestamp = Date.parse(normalized);

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return Math.floor(Math.max(0, Date.now() - timestamp) / 86_400_000);
}

function deriveWorkflowStage(
  certificationStatus: string,
  renewalStatus: string,
) {
  const certification = cleanApplicantValue(
    certificationStatus,
  ).toUpperCase();

  const renewal = cleanApplicantValue(renewalStatus).toUpperCase();

  if (
    renewal.includes("RENEWAL") &&
    !renewal.includes("NOT_STARTED")
  ) {
    return "RENEWAL";
  }

  if (certification === "CERTIFICATION_READY") {
    return "CERTIFICATION_READY";
  }

  if (certification === "CERTIFIED") {
    return "CERTIFIED";
  }

  if (certification === "RENEWAL_PENDING") {
    return "RENEWAL";
  }

  if (certification === "SUSPENDED") {
    return "SUSPENSION";
  }

  if (certification === "REVOKED") {
    return "REVOCATION";
  }

  if (certification === "APPEAL_PENDING") {
    return "APPEAL";
  }

  return "CERTIFICATION_PENDING";
}

function deriveCertificationReadiness(
  certificationStatus: string,
  renewalStatus: string,
  repositoryRecord: boolean,
) {
  const certification = cleanApplicantValue(
    certificationStatus,
  ).toUpperCase();

  const renewal = cleanApplicantValue(renewalStatus).toUpperCase();

  if (
    repositoryRecord &&
    certification === "CERTIFIED"
  ) {
    return "CERTIFIED";
  }

  if (certification === "CERTIFICATION_READY") {
    return "READY_FOR_ISSUANCE";
  }

  if (
    certification === "RENEWAL_PENDING" ||
    (renewal.includes("RENEWAL") &&
      !renewal.includes("NOT_STARTED") &&
      !renewal.includes("COMPLETE"))
  ) {
    return "RENEWAL_REQUIRED";
  }

  if (certification === "SUSPENDED") {
    return "SUSPENDED";
  }

  if (certification === "REVOKED") {
    return "REVOKED";
  }

  if (certification === "APPEAL_PENDING") {
    return "APPEAL_PENDING";
  }

  return "NOT_READY";
}

function deriveRepositoryHealth(
  repositoryRecord: boolean,
  updatedAt: string | null,
) {
  if (!repositoryRecord) {
    return "PENDING_CERTIFICATION";
  }

  if (!cleanApplicantValue(updatedAt)) {
    return "MISSING_TIMESTAMP";
  }

  return "AVAILABLE";
}

function isPublishedStatus(value: string) {
  const normalized = cleanApplicantValue(value).toUpperCase();

  return (
    normalized === "PUBLISHED" ||
    normalized === "ACTIVE" ||
    normalized === "REGISTRY_PUBLISHED" ||
    normalized === "PUBLIC"
  );
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);

    if (!auth.ok) {
      return json(
        {
          ok: false,
          error:
            auth.error ??
            "Applicant authentication required.",
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
        .map((row) =>
          cleanApplicantValue(row.REQUEST_ID),
        )
        .filter(Boolean),
    );

    const persistedRows =
      await snowflakeQuery<PersistedApplicantRepositoryRow>(
        `
        SELECT *
        FROM ${APPLICANT_EVIDENCE_TABLE}
        WHERE LOWER(EVIDENCE_TYPE::STRING) IN (
          'certification',
          'certification_record',
          'certification_issuance',
          'applicant_certification',
          'applicant_certification_record'
        )
        ORDER BY CREATED_AT DESC NULLS LAST
        LIMIT 250
        `,
        [],
      );

    const scope = repositoryScopeFromSession(
      session,
      workflowCaseIds,
    );

    const certificationByCaseId =
      new Map<string, PersistedApplicantRepositoryRow>();

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

      if (!certificationByCaseId.has(caseId)) {
        certificationByCaseId.set(caseId, row);
      }
    }

    const certifications = workflowRows.map((row) => {
      const caseId = cleanApplicantValue(row.REQUEST_ID);
      const caseStatus =
        cleanApplicantValue(row.STATUS) || "UNKNOWN";

      const persisted =
        certificationByCaseId.get(caseId);

      const repositoryRecord = Boolean(persisted);

      const certificationId = persisted
        ? firstApplicantValue(persisted, [
            "CERTIFICATION_ID",
            "EVIDENCE_ID",
            "ID",
            "RECORD_ID",
          ]) || `CERT-${caseId}`
        : `CERT-${caseId}`;

      const certificationStatus = persisted
        ? firstApplicantValue(persisted, [
            "CERTIFICATION_STATUS",
            "EVIDENCE_STATUS",
            "STATUS",
            "REVIEW_STATUS",
          ]) || "CERTIFIED"
        : deriveCertificationStatus(caseStatus);

      const renewalStatus = persisted
        ? firstApplicantValue(persisted, [
            "RENEWAL_STATUS",
            "LIFECYCLE_STATUS",
          ]) || "NOT_STARTED"
        : certificationStatus === "RENEWAL_PENDING"
          ? "RENEWAL_PENDING"
          : "NOT_STARTED";

      const publicationStatus = persisted
        ? firstApplicantValue(persisted, [
            "PUBLICATION_STATUS",
            "REGISTRY_STATUS",
          ]) || "NOT_PUBLISHED"
        : "NOT_PUBLISHED";

      const issuedAt =
        firstApplicantValue(persisted || {}, [
          "ISSUED_AT",
          "CREATED_AT",
          "SUBMITTED_AT",
        ]) || null;

      const validFrom =
        firstApplicantValue(persisted || {}, [
          "VALID_FROM",
          "EFFECTIVE_FROM",
          "ISSUED_AT",
        ]) || null;

      const validTo =
        firstApplicantValue(persisted || {}, [
          "VALID_TO",
          "EXPIRES_AT",
          "EXPIRATION_AT",
        ]) || null;

      const updatedAt =
        firstApplicantValue(persisted || {}, [
          "UPDATED_AT",
          "MODIFIED_AT",
          "CREATED_AT",
        ]) ||
        cleanApplicantValue(row.UPDATED_AT) ||
        null;

      const workflowStage = deriveWorkflowStage(
        certificationStatus,
        renewalStatus,
      );

      const certificationReadiness =
        deriveCertificationReadiness(
          certificationStatus,
          renewalStatus,
          repositoryRecord,
        );

      const repositoryHealth = deriveRepositoryHealth(
        repositoryRecord,
        updatedAt,
      );

      const normalizedCertificationStatus =
        cleanApplicantValue(
          certificationStatus,
        ).toUpperCase();

      const normalizedRenewalStatus =
        cleanApplicantValue(renewalStatus).toUpperCase();

      const isCertified =
        normalizedCertificationStatus === "CERTIFIED";

      const isActive = [
        "CERTIFIED",
        "CERTIFICATION_READY",
      ].includes(normalizedCertificationStatus);

      const isRenewalPending =
        normalizedCertificationStatus ===
          "RENEWAL_PENDING" ||
        (normalizedRenewalStatus.includes("RENEWAL") &&
          !normalizedRenewalStatus.includes("NOT_STARTED") &&
          !normalizedRenewalStatus.includes("COMPLETE"));

      const isSuspended =
        normalizedCertificationStatus === "SUSPENDED";

      const isRevoked =
        normalizedCertificationStatus === "REVOKED";

      const isAppealPending =
        normalizedCertificationStatus ===
        "APPEAL_PENDING";

      const isPublished =
        isPublishedStatus(publicationStatus);

      return {
        certificationId,

        caseId,

        requestId:
          firstApplicantValue(persisted || {}, [
            "REQUEST_ID",
          ]) || caseId,

        organizationName:
          firstApplicantValue(persisted || {}, [
            "ORG_NAME",
            "ORGANIZATION_NAME",
            "ORGANIZATION",
            "ORG",
          ]) ||
          cleanApplicantValue(row.ORG) ||
          session.organizationName,

        email:
          firstApplicantValue(persisted || {}, [
            "EMAIL",
            "CONTACT_EMAIL",
            "SUBMITTED_BY",
          ]) ||
          cleanApplicantValue(row.EMAIL) ||
          null,

        certificationType:
          firstApplicantValue(persisted || {}, [
            "CERTIFICATION_TYPE",
            "EVIDENCE_TYPE",
            "TYPE",
          ]) || "GAFAIG Applicant Certification",

        certificationStatus,

        caseStatus,

        source:
          firstApplicantValue(persisted || {}, [
            "SOURCE",
            "SOURCE_TABLE",
          ]) ||
          cleanApplicantValue(row.SOURCE) ||
          "Applicant Intake",

        issuedAt,

        validFrom,

        validTo,

        renewalStatus,

        publicationStatus,

        updatedAt,

        repositoryRecord,

        repositoryCategory:
          "Certification Repository",

        workflowOrigin: repositoryRecord
          ? "Persisted Certification Record"
          : "Applicant Workflow",

        workflowStage,

        certificationReadiness,

        repositoryHealth,

        ageDays: deriveAgeDays(
          updatedAt || issuedAt || validFrom,
        ),

        isActive,

        isCertified,

        isRenewalPending,

        isSuspended,

        isRevoked,

        isAppealPending,

        isPublished,

        authorityBoundaryText:
          AUTHORITY_BOUNDARY_TEXT,
      };
    });

    const activeCertifications = certifications.filter(
      (item) => item.isActive,
    ).length;

    const renewalPending = certifications.filter(
      (item) => item.isRenewalPending,
    ).length;

    return json({
      ok: true,

      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },

      summary: {
        totalCertifications: certifications.length,
        activeCertifications,
        renewalPending,
        notCertified:
          certifications.length -
          activeCertifications -
          renewalPending,
      },

      certifications,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant certifications query failed.",
      },
      500,
    );
  }
}
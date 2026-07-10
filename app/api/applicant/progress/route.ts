import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/require";
import { getApplicantSession } from "@/lib/applicant-auth";
import { snowflakeQuery } from "@/lib/snowflake";
import {
  APPLICANT_EVIDENCE_TABLE,
  APPLICANT_WORKFLOW_VIEW,
  applicantRepositoryActivity,
  applicantRepositoryRowBelongsToScope,
  cleanApplicantValue,
  classifyApplicantEvidenceType,
  emptyApplicantRepositoryCounts,
  firstApplicantValue,
  isApplicantActiveStatus,
  repositoryScopeFromSession,
  type ApplicantRepositoryCounts,
  type PersistedApplicantRepositoryRow,
} from "@/lib/applicant/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const AUTHORITY_BOUNDARY_TEXT =
  "Operational progress repository visibility only. No evidence, findings, scoring, decision, certification, publication, registry, verification, or governance authority is created.";

type ProgressRow = {
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

function deriveLifecycleStage(
  status: string,
  counts?: ApplicantRepositoryCounts,
) {
  if (counts?.certificationRecords) {
    return "Certification Active";
  }

  if (counts?.remediationRecords) {
    return "Remediation Submitted";
  }

  if (counts?.requestResponseRecords) {
    return "Applicant Response Submitted";
  }

  if (counts?.artifactRecords) {
    return "Artifact Preserved";
  }

  if (counts?.evidenceRecords) {
    return "Evidence Submitted";
  }

  const normalized = cleanApplicantValue(status).toUpperCase();

  if (normalized.includes("CERTIFIED")) {
    return "Certification Active";
  }

  if (normalized.includes("APPROVED")) {
    return "Certification Ready";
  }

  if (normalized.includes("REVIEW")) {
    return "Governance Review";
  }

  if (normalized.includes("PENDING")) {
    return "Applicant Action Pending";
  }

  if (normalized.includes("RECEIVED")) {
    return "Submission Received";
  }

  return "Applicant Intake";
}

function deriveCompletionPercent(
  status: string,
  counts?: ApplicantRepositoryCounts,
) {
  if (counts?.certificationRecords) {
    return 100;
  }

  if (counts?.remediationRecords) {
    return 85;
  }

  if (counts?.requestResponseRecords) {
    return 70;
  }

  if (counts?.artifactRecords) {
    return 60;
  }

  if (counts?.evidenceRecords) {
    return 50;
  }

  const normalized = cleanApplicantValue(status).toUpperCase();

  if (normalized.includes("CERTIFIED")) {
    return 100;
  }

  if (normalized.includes("APPROVED")) {
    return 85;
  }

  if (normalized.includes("REVIEW")) {
    return 60;
  }

  if (normalized.includes("PENDING")) {
    return 40;
  }

  if (normalized.includes("RECEIVED")) {
    return 25;
  }

  return 15;
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

  return Math.floor(
    Math.max(0, Date.now() - timestamp) / 86_400_000,
  );
}

function deriveProgressReadiness(completionPercent: number) {
  if (completionPercent >= 100) {
    return "COMPLETE";
  }

  if (completionPercent >= 85) {
    return "CERTIFICATION_READY";
  }

  if (completionPercent >= 70) {
    return "REMEDIATION_COMPLETE";
  }

  if (completionPercent >= 50) {
    return "EVIDENCE_COMPLETE";
  }

  if (completionPercent >= 25) {
    return "IN_PROGRESS";
  }

  return "APPLICANT_INTAKE";
}

function deriveRepositoryHealth(
  hasRepositoryActivity: boolean,
  updatedAt: string | null,
) {
  if (!hasRepositoryActivity) {
    return "WORKFLOW_ONLY";
  }

  if (!cleanApplicantValue(updatedAt)) {
    return "MISSING_TIMESTAMP";
  }

  return "AVAILABLE";
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

    const rows = await snowflakeQuery<ProgressRow>(
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
      rows
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
        ORDER BY CREATED_AT DESC NULLS LAST
        LIMIT 500
        `,
        [],
      );

    const scope = repositoryScopeFromSession(
      session,
      workflowCaseIds,
    );

    const countsByCaseId =
      new Map<string, ApplicantRepositoryCounts>();

    const latestRecordByCaseId =
      new Map<
        string,
        PersistedApplicantRepositoryRow
      >();

    for (const row of persistedRows) {
      if (
        !applicantRepositoryRowBelongsToScope(
          row,
          scope,
        )
      ) {
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

      const counts =
        countsByCaseId.get(caseId) ||
        emptyApplicantRepositoryCounts();

      const bucket =
        classifyApplicantEvidenceType(
          firstApplicantValue(row, [
            "EVIDENCE_TYPE",
            "TYPE",
          ]),
        );

      counts[bucket] += 1;

      countsByCaseId.set(caseId, counts);

      if (!latestRecordByCaseId.has(caseId)) {
        latestRecordByCaseId.set(caseId, row);
      }
    }

    const items = rows.map((row) => {
      const caseId =
        cleanApplicantValue(row.REQUEST_ID);

      const status =
        cleanApplicantValue(row.STATUS) ||
        "UNKNOWN";

      const source =
        cleanApplicantValue(row.SOURCE) ||
        "Applicant Intake";

      const counts =
        countsByCaseId.get(caseId) ||
        emptyApplicantRepositoryCounts();

      const latestRecord =
        latestRecordByCaseId.get(caseId);

      const completionPercent =
        deriveCompletionPercent(status, counts);

      const lifecycleStage =
        deriveLifecycleStage(status, counts);

      const evidenceId =
        latestRecord &&
        counts.evidenceRecords > 0
          ? firstApplicantValue(latestRecord, [
              "EVIDENCE_ID",
              "ID",
              "RECORD_ID",
            ]) || `EV-${caseId}`
          : `EV-${caseId}`;

      const repositoryActivityCount =
        applicantRepositoryActivity(counts);

      const repositoryRecord =
        repositoryActivityCount > 0;

      const updatedAt =
        firstApplicantValue(
          latestRecord || {},
          [
            "UPDATED_AT",
            "MODIFIED_AT",
            "CREATED_AT",
          ],
        ) ||
        cleanApplicantValue(row.UPDATED_AT) ||
        null;

      const openRequests =
        counts.requestResponseRecords > 0
          ? 0
          : isApplicantActiveStatus(status)
            ? 1
            : 0;

      const pendingEvidence =
        counts.evidenceRecords > 0 ? 0 : 1;

      const pendingArtifacts =
        counts.artifactRecords > 0 ? 0 : 1;

      const certificationStatus =
        counts.certificationRecords > 0 ||
        completionPercent >= 85
          ? "CERTIFICATION_READY"
          : "NOT_CERTIFIED";

      const isActive =
        isApplicantActiveStatus(status);

      const isComplete =
        completionPercent >= 100;

      const isCertificationReady =
        certificationStatus ===
        "CERTIFICATION_READY";

      const isEvidencePending =
        pendingEvidence > 0;

      const isArtifactPending =
        pendingArtifacts > 0;

      const hasRepositoryActivity =
        repositoryActivityCount > 0;

      return {
        caseId,

        requestId: caseId,

        evidenceId,

        artifactId: `ART-${caseId}`,

        certificationId: `CERT-${caseId}`,

        organizationName:
          cleanApplicantValue(row.ORG) ||
          session.organizationName,

        email:
          cleanApplicantValue(row.EMAIL) ||
          null,

        status,

        source,

        lifecycleStage,

        completionPercent,

        openRequests,

        pendingEvidence,

        pendingArtifacts,

        certificationStatus,

        evidenceRecords:
          counts.evidenceRecords,

        artifactRecords:
          counts.artifactRecords,

        requestResponseRecords:
          counts.requestResponseRecords,

        remediationRecords:
          counts.remediationRecords,

        certificationRecords:
          counts.certificationRecords,

        updatedAt,

        repositoryRecord,

        repositoryCategory:
          "Progress Repository",

        workflowOrigin:
          repositoryRecord
            ? "Persisted Repository Activity"
            : "Applicant Workflow",

        workflowStage:
          lifecycleStage,

        progressReadiness:
          deriveProgressReadiness(
            completionPercent,
          ),

        repositoryHealth:
          deriveRepositoryHealth(
            hasRepositoryActivity,
            updatedAt,
          ),

        ageDays:
          deriveAgeDays(updatedAt),

        isActive,

        isComplete,

        isCertificationReady,

        isEvidencePending,

        isArtifactPending,

        hasRepositoryActivity,

        authorityBoundaryText:
          AUTHORITY_BOUNDARY_TEXT,
      };
    });

    const totalCases = items.length;

    const activeCases = items.filter(
      (item) => item.isActive,
    ).length;

    const openRequests = items.reduce(
      (sum, item) =>
        sum + item.openRequests,
      0,
    );

    const pendingEvidence = items.reduce(
      (sum, item) =>
        sum + item.pendingEvidence,
      0,
    );

    const pendingArtifacts = items.reduce(
      (sum, item) =>
        sum + item.pendingArtifacts,
      0,
    );

    const averageCompletion =
      totalCases === 0
        ? 0
        : Math.round(
            items.reduce(
              (sum, item) =>
                sum +
                item.completionPercent,
              0,
            ) / totalCases,
          );

    return json({
      ok: true,

      organization: {
        organizationId:
          session.organizationId,
        organizationName:
          session.organizationName,
      },

      summary: {
        totalCases,
        activeCases,
        openRequests,
        pendingEvidence,
        pendingArtifacts,
        averageCompletion,
      },

      stages: [
        {
          stage: "Applicant Intake",
          status:
            totalCases > 0
              ? "ACTIVE"
              : "PENDING",
          description:
            "Applicant case records are visible for the authenticated organization.",
        },
        {
          stage: "Information Requests",
          status:
            openRequests > 0
              ? "ACTIVE"
              : "PENDING",
          description:
            "Information Request Repository visibility reflects applicant request and response activity.",
        },
        {
          stage: "Evidence Repository",
          status:
            pendingEvidence > 0
              ? "ACTIVE"
              : "COMPLETE",
          description:
            "Evidence Repository visibility reflects persisted applicant evidence records and pending evidence state.",
        },
        {
          stage: "Artifact Repository",
          status:
            pendingArtifacts > 0
              ? "ACTIVE"
              : "COMPLETE",
          description:
            "Artifact Repository visibility reflects persisted applicant artifact records and pending artifact state.",
        },
        {
          stage: "Deficiency and Remediation",
          status: items.some(
            (item) =>
              item.remediationRecords > 0,
          )
            ? "ACTIVE"
            : "PENDING",
          description:
            "Deficiency and Remediation Repository visibility reflects applicant remediation activity without modifying governance authority.",
        },
        {
          stage: "Certification Repository",
          status: items.some(
            (item) =>
              item.isCertificationReady,
          )
            ? "ACTIVE"
            : "PENDING",
          description:
            "Certification Repository visibility reflects certification lifecycle state without creating certification or publication authority.",
        },
      ],

      progress: items,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant progress query failed.",
      },
      500,
    );
  }
}
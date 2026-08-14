import { NextResponse } from "next/server";

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

type SubmissionRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET() {
  try {
    const session = await getApplicantSession();

    if (!session) {
      return json(
        {
          ok: false,
          error: "Applicant authentication required.",
        },
        401,
      );
    }

    const rows = await snowflakeQuery<SubmissionRow>(
      `
      SELECT
        REQUEST_ID::STRING AS REQUEST_ID,
        COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING AS ORG,
        STATUS::STRING AS STATUS,
        COALESCE(SOURCE_TABLE, SOURCE)::STRING AS SOURCE,
        TO_VARCHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM ${APPLICANT_WORKFLOW_VIEW}
      WHERE COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING ILIKE ?
      ORDER BY UPDATED_AT DESC NULLS LAST, REQUEST_ID DESC
      LIMIT 5
      `,
      [session.organizationName],
    );

    const workflowCaseIds = new Set(
      rows.map((row) => cleanApplicantValue(row.REQUEST_ID)).filter(Boolean),
    );

    const persistedRows = await snowflakeQuery<PersistedApplicantRepositoryRow>(
      `
      SELECT *
      FROM ${APPLICANT_EVIDENCE_TABLE}
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 500
      `,
      [],
    );

    const scope = repositoryScopeFromSession(session, workflowCaseIds);

    const countsByCaseId = new Map<string, ApplicantRepositoryCounts>();
    const latestRecordByCaseId = new Map<
      string,
      PersistedApplicantRepositoryRow
    >();

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

      const counts =
        countsByCaseId.get(caseId) || emptyApplicantRepositoryCounts();

      const bucket = classifyApplicantEvidenceType(
        firstApplicantValue(row, ["EVIDENCE_TYPE", "TYPE"]),
      );

      counts[bucket] += 1;
      countsByCaseId.set(caseId, counts);

      if (!latestRecordByCaseId.has(caseId)) {
        latestRecordByCaseId.set(caseId, row);
      }
    }

    const recentCases = rows.map((row) => {
      const caseId = cleanApplicantValue(row.REQUEST_ID);
      const counts =
        countsByCaseId.get(caseId) || emptyApplicantRepositoryCounts();
      const latestRecord = latestRecordByCaseId.get(caseId);

      const repositoryActivity = applicantRepositoryActivity(counts);

      return {
        caseId,
        applicationId: null,
        status: cleanApplicantValue(row.STATUS) || "UNKNOWN",
        stage: cleanApplicantValue(row.SOURCE) || "Applicant Intake",
        updatedAt:
          firstApplicantValue(latestRecord || {}, [
            "UPDATED_AT",
            "MODIFIED_AT",
            "CREATED_AT",
          ]) ||
          cleanApplicantValue(row.UPDATED_AT) ||
          null,
        evidenceRecords: counts.evidenceRecords,
        artifactRecords: counts.artifactRecords,
        requestResponseRecords: counts.requestResponseRecords,
        remediationRecords: counts.remediationRecords,
        certificationRecords: counts.certificationRecords,
        repositoryActivity,
      };
    });

    const activeCases = recentCases.filter((item) =>
      isApplicantActiveStatus(item.status),
    ).length;

    const openRequests = recentCases.filter(
      (item) =>
        isApplicantActiveStatus(item.status) &&
        item.requestResponseRecords === 0,
    ).length;

    const pendingActions = recentCases.filter(
      (item) =>
        (isApplicantActiveStatus(item.status) &&
          item.requestResponseRecords === 0) ||
        item.remediationRecords > 0,
    ).length;

    const activeCertifications = recentCases.filter(
      (item) => item.certificationRecords > 0,
    ).length;

    const repositoryActivity = recentCases.reduce(
      (sum, item) => sum + item.repositoryActivity,
      0,
    );

    const evidenceRecords = recentCases.reduce(
      (sum, item) => sum + item.evidenceRecords,
      0,
    );

    const artifactRecords = recentCases.reduce(
      (sum, item) => sum + item.artifactRecords,
      0,
    );

    const requestResponseRecords = recentCases.reduce(
      (sum, item) => sum + item.requestResponseRecords,
      0,
    );

    const remediationRecords = recentCases.reduce(
      (sum, item) => sum + item.remediationRecords,
      0,
    );

    const certificationRecords = recentCases.reduce(
      (sum, item) => sum + item.certificationRecords,
      0,
    );

    return json({
      ok: true,
      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },
      metrics: {
        activeCases,
        openRequests,
        pendingActions,
        activeCertifications,
        repositoryActivity,
        evidenceRecords,
        artifactRecords,
        requestResponseRecords,
        remediationRecords,
        certificationRecords,
      },
      recentCases,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant dashboard query failed.",
      },
      500,
    );
  }
}
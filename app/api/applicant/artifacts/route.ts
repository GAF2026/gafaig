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

  return "ARTIFACT";
}

function preservationReadiness(status: string, hasFile: boolean) {
  if (!hasFile) return "AWAITING_ARTIFACT";

  const normalized = status.toUpperCase();

  if (normalized.includes("PERSIST")) return "PERSISTED";
  if (normalized.includes("UPLOAD")) return "READY_FOR_PRESERVATION";
  if (normalized.includes("REVIEW")) return "UNDER_REVIEW";

  return "AVAILABLE";
}

function repositoryHealth(hasFile: boolean, updatedAt: string | null) {
  if (!hasFile) return "PENDING_ARTIFACT";
  if (!updatedAt) return "MISSING_TIMESTAMP";
  return "AVAILABLE";
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
        'artifact_upload',
        'artifact',
        'applicant_artifact',
        'applicant_artifact_upload'
      )
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 250
      `,
      [],
    );

    const scope = repositoryScopeFromSession(session, workflowCaseIds);

    const persistedArtifacts = persistedRows
      .filter((row) => applicantRepositoryRowBelongsToScope(row, scope))
      .map((row) => {
        const caseId = firstApplicantValue(row, [
          "CASE_ID",
          "REQUEST_ID",
          "APPLICATION_ID",
          "VERIFICATION_CASE_ID",
        ]);

        const evidenceId =
          firstApplicantValue(row, ["EVIDENCE_ID", "ID", "RECORD_ID"]) ||
          `EV-${caseId || crypto.randomUUID()}`;

        const artifactId =
          firstApplicantValue(row, [
            "ARTIFACT_ID",
            "EVIDENCE_ID",
            "ID",
            "RECORD_ID",
          ]) || `ART-${caseId || crypto.randomUUID()}`;

        const artifactStatus =
          firstApplicantValue(row, [
            "ARTIFACT_STATUS",
            "EVIDENCE_STATUS",
            "STATUS",
          ]) || "PERSISTED";

        const fileName =
          firstApplicantValue(row, ["FILE_NAME", "FILENAME", "OBJECT_NAME"]) ||
          null;

        const preservedAt =
          firstApplicantValue(row, [
            "PRESERVED_AT",
            "UPLOADED_AT",
            "SUBMITTED_AT",
            "CREATED_AT",
          ]) || null;

        const updatedAt =
          firstApplicantValue(row, ["UPDATED_AT", "MODIFIED_AT", "CREATED_AT"]) ||
          null;

        const hasFile = Boolean(fileName);

        return {
          artifactId,
          evidenceId,
          caseId,
          requestId: firstApplicantValue(row, ["REQUEST_ID"]) || caseId,
          organizationName:
            firstApplicantValue(row, [
              "ORG_NAME",
              "ORGANIZATION_NAME",
              "ORGANIZATION",
              "ORG",
            ]) || session.organizationName,
          email:
            firstApplicantValue(row, ["EMAIL", "CONTACT_EMAIL", "SUBMITTED_BY"]) ||
            null,
          artifactType:
            firstApplicantValue(row, [
              "ARTIFACT_TYPE",
              "EVIDENCE_TYPE",
              "TYPE",
            ]) || "Applicant Artifact",
          artifactStatus,
          source:
            firstApplicantValue(row, ["SOURCE", "SOURCE_TABLE"]) ||
            "Verification Evidence",
          title:
            firstApplicantValue(row, [
              "TITLE",
              "ARTIFACT_TITLE",
              "EVIDENCE_TITLE",
              "NAME",
            ]) || artifactId,
          fileName,
          fileType:
            firstApplicantValue(row, ["FILE_TYPE", "MIME_TYPE", "CONTENT_TYPE"]) ||
            null,
          version:
            firstApplicantValue(row, ["VERSION", "ARTIFACT_VERSION"]) || "1",
          preservedAt,
          updatedAt,
          repositoryRecord: true,
          repositoryCategory: "Artifact Repository",
          workflowOrigin: "Persisted Artifact",
          workflowStage: workflowStage(artifactStatus),
          preservationReadiness: preservationReadiness(artifactStatus, hasFile),
          repositoryHealth: repositoryHealth(hasFile, updatedAt || preservedAt),
          ageDays: ageDays(updatedAt || preservedAt),
          hasFile,
          isPending: false,
          authorityBoundary:
            "Operational artifact repository visibility only. No evidence authority, verification authority, scoring authority, certification authority, registry authority, publication authority, or governance authority is created.",
        };
      });

    const persistedCaseIds = new Set(
      persistedArtifacts.map((item) => item.caseId).filter(Boolean),
    );

    const workflowPlaceholders = workflowRows
      .filter((row) => !persistedCaseIds.has(cleanApplicantValue(row.REQUEST_ID)))
      .map((row) => {
        const caseId = cleanApplicantValue(row.REQUEST_ID);
        const artifactId = `ART-${caseId}`;
        const updatedAt = cleanApplicantValue(row.UPDATED_AT) || null;
        const status = cleanApplicantValue(row.STATUS) || "PENDING";

        return {
          artifactId,
          evidenceId: `EV-${caseId}`,
          caseId,
          requestId: caseId,
          organizationName: cleanApplicantValue(row.ORG) || session.organizationName,
          email: cleanApplicantValue(row.EMAIL) || null,
          artifactType: "Applicant Artifact Slot",
          artifactStatus: "NOT_PERSISTED",
          source: cleanApplicantValue(row.SOURCE) || "Applicant Intake",
          title: `Artifact repository slot for ${caseId}`,
          fileName: null,
          fileType: null,
          version: "1",
          preservedAt: null,
          updatedAt,
          repositoryRecord: false,
          repositoryCategory: "Artifact Repository",
          workflowOrigin: "Applicant Workflow",
          workflowStage: workflowStage(status),
          preservationReadiness: "AWAITING_ARTIFACT",
          repositoryHealth: "PENDING_ARTIFACT",
          ageDays: ageDays(updatedAt),
          hasFile: false,
          isPending: true,
          authorityBoundary:
            "Operational artifact repository visibility only. No evidence authority, verification authority, scoring authority, certification authority, registry authority, publication authority, or governance authority is created.",
        };
      });

    const artifacts = [...persistedArtifacts, ...workflowPlaceholders];

    return json({
      ok: true,
      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },
      summary: {
        totalArtifacts: artifacts.length,
        persistedArtifacts: persistedArtifacts.length,
        pendingArtifacts: workflowPlaceholders.length,
      },
      artifacts,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant artifacts query failed.",
      },
      500,
    );
  }
}
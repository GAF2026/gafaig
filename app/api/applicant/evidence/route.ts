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
  classifyApplicantEvidenceType,
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

function isGeneralEvidenceType(value: string) {
  return classifyApplicantEvidenceType(value) === "evidenceRecords";
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

function reviewReadiness(status: string, hasFile: boolean) {
  if (!hasFile) return "AWAITING_UPLOAD";

  const normalized = status.toUpperCase();

  if (normalized.includes("REVIEW")) return "UNDER_REVIEW";
  if (normalized.includes("ACCEPT")) return "READY";
  if (normalized.includes("VALID")) return "READY";

  return "READY_FOR_REVIEW";
}

function repositoryHealth(hasFile: boolean, updatedAt: string | null) {
  if (!hasFile) return "PENDING_UPLOAD";
  if (!updatedAt) return "MISSING_TIMESTAMP";
  return "AVAILABLE";
}

function workflowStage(status: string) {
  const normalized = status.toUpperCase();

  if (normalized.includes("DEFICIENCY")) return "DEFICIENCY";
  if (normalized.includes("REMEDIATION")) return "REMEDIATION";
  if (normalized.includes("REVIEW")) return "REVIEW";
  if (normalized.includes("PENDING")) return "PENDING";
  if (normalized.includes("COMPLETE")) return "COMPLETE";

  return "EVIDENCE";
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
      workflowRows.map((row) => cleanApplicantValue(row.REQUEST_ID)).filter(Boolean),
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

    const persistedEvidence = persistedRows
      .filter((row) => {
        const evidenceType = firstApplicantValue(row, ["EVIDENCE_TYPE", "TYPE"]);

        return (
          isGeneralEvidenceType(evidenceType) &&
          applicantRepositoryRowBelongsToScope(row, scope)
        );
      })
      .map((row) => {
        const caseId = firstApplicantValue(row, [
          "CASE_ID",
          "REQUEST_ID",
          "APPLICATION_ID",
          "VERIFICATION_CASE_ID",
        ]);

        const evidenceId =
          firstApplicantValue(row, ["EVIDENCE_ID", "ID", "RECORD_ID"]) ||
          `EV-${caseId || "UNKNOWN"}`;

        const evidenceStatus =
          firstApplicantValue(row, [
            "EVIDENCE_STATUS",
            "STATUS",
            "REVIEW_STATUS",
          ]) || "UPLOADED";

        const fileName =
          firstApplicantValue(row, ["FILE_NAME", "FILENAME", "OBJECT_NAME"]) ||
          null;

        const uploadedAt =
          firstApplicantValue(row, ["UPLOADED_AT", "SUBMITTED_AT", "CREATED_AT"]) ||
          null;

        const updatedAt =
          firstApplicantValue(row, ["UPDATED_AT", "MODIFIED_AT", "CREATED_AT"]) ||
          null;

        const hasFile = Boolean(fileName);

        return {
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
          title:
            firstApplicantValue(row, ["TITLE", "EVIDENCE_TITLE", "NAME"]) ||
            evidenceId,
          description:
            firstApplicantValue(row, [
              "DESCRIPTION",
              "EVIDENCE_DESCRIPTION",
              "NOTES",
            ]) || null,
          sourceUrl: firstApplicantValue(row, ["SOURCE_URL", "URL", "LINK"]) || null,
          submittedBy:
            firstApplicantValue(row, [
              "SUBMITTED_BY",
              "UPLOADED_BY",
              "CREATED_BY",
              "EMAIL",
            ]) || null,
          evidenceType:
            firstApplicantValue(row, ["EVIDENCE_TYPE", "TYPE"]) ||
            "Applicant Evidence",
          evidenceStatus,
          source:
            firstApplicantValue(row, ["SOURCE", "SOURCE_TABLE"]) ||
            "Verification Evidence",
          fileName,
          fileType:
            firstApplicantValue(row, ["FILE_TYPE", "MIME_TYPE", "CONTENT_TYPE"]) ||
            null,
          uploadedAt,
          updatedAt,
          repositoryRecord: true,
          repositoryCategory: "Evidence Repository",
          workflowOrigin: "Persisted Evidence",
          workflowStage: workflowStage(evidenceStatus),
          reviewReadiness: reviewReadiness(evidenceStatus, hasFile),
          repositoryHealth: repositoryHealth(hasFile, updatedAt),
          ageDays: ageDays(updatedAt || uploadedAt),
          hasFile,
          isPending: false,
          authorityBoundary:
            "Operational evidence visibility only. No verification, scoring, certification, registry, publication, or governance authority is created.",
        };
      });

    const persistedCaseIds = new Set(
      persistedEvidence.map((item) => item.caseId).filter(Boolean),
    );

    const workflowPlaceholders = workflowRows
      .filter((row) => !persistedCaseIds.has(cleanApplicantValue(row.REQUEST_ID)))
      .map((row) => {
        const caseId = cleanApplicantValue(row.REQUEST_ID);
        const updatedAt = cleanApplicantValue(row.UPDATED_AT) || null;

        return {
          evidenceId: `EV-${caseId}`,
          caseId,
          requestId: caseId,
          organizationName: cleanApplicantValue(row.ORG) || session.organizationName,
          email: cleanApplicantValue(row.EMAIL) || null,
          title: `Evidence slot for ${caseId}`,
          description: null,
          sourceUrl: null,
          submittedBy: null,
          evidenceType: "Applicant Evidence Slot",
          evidenceStatus: "NOT_UPLOADED",
          source: cleanApplicantValue(row.SOURCE) || "Applicant Intake",
          fileName: null,
          fileType: null,
          uploadedAt: null,
          updatedAt,
          repositoryRecord: false,
          repositoryCategory: "Evidence Repository",
          workflowOrigin: "Applicant Workflow",
          workflowStage: workflowStage(cleanApplicantValue(row.STATUS) || "PENDING"),
          reviewReadiness: "AWAITING_UPLOAD",
          repositoryHealth: "PENDING_UPLOAD",
          ageDays: ageDays(updatedAt),
          hasFile: false,
          isPending: true,
          authorityBoundary:
            "Operational evidence visibility only. No verification, scoring, certification, registry, publication, or governance authority is created.",
        };
      });

    const evidence = [...persistedEvidence, ...workflowPlaceholders];

    return json({
      ok: true,
      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },
      summary: {
        totalEvidenceSlots: evidence.length,
        uploadedEvidence: persistedEvidence.length,
        pendingEvidence: workflowPlaceholders.length,
      },
      evidence,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant evidence query failed.",
      },
      500,
    );
  }
}
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

type WorkflowArtifactRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  EMAIL: string | null;
  STATUS: string | null;
  SOURCE: string | null;
  UPDATED_AT: string | null;
};

type PersistedArtifactRow = Record<string, unknown>;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function first(row: PersistedArtifactRow, keys: string[]): string {
  for (const key of keys) {
    const value = clean(row[key]);
    if (value) return value;
  }

  return "";
}

function stripArtifactPrefix(artifactId: string) {
  return artifactId.startsWith("ART-") ? artifactId.slice(4) : artifactId;
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

function isArtifactType(value: string) {
  const normalized = value.trim().toLowerCase();

  return (
    normalized.startsWith("artifact:") ||
    [
      "artifact_upload",
      "artifact",
      "applicant_artifact",
      "applicant_artifact_upload",
    ].includes(normalized)
  );
}

function normalizeArtifactId(artifactId: string, requestId: string) {
  if (artifactId.startsWith("ART-")) {
    return artifactId;
  }

  return `ART-${requestId}`;
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      artifactId: string;
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

    const artifactId = clean(decodeURIComponent(params.artifactId));

    if (!artifactId) {
      return json(
        {
          ok: false,
          error: "Missing artifactId.",
        },
        400,
      );
    }

    const requestId = stripArtifactPrefix(artifactId);

    const persistedRows = await snowflakeQuery<PersistedArtifactRow>(
      `
      SELECT *
      FROM ${EVIDENCE_TABLE}
      WHERE CASE_ID::STRING = ?
         OR EVIDENCE_ID::STRING = ?
         OR EVIDENCE_ID::STRING = ?
      ORDER BY CREATED_AT DESC NULLS LAST
      LIMIT 100
      `,
      [requestId, artifactId, requestId],
    );

    const persistedArtifact = persistedRows.find((row) => {
      const evidenceType = first(row, ["EVIDENCE_TYPE", "TYPE"]);

      if (!isArtifactType(evidenceType)) {
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

    if (persistedArtifact) {
      const caseId = first(persistedArtifact, ["CASE_ID"]) || requestId;
      const evidenceId =
        first(persistedArtifact, ["EVIDENCE_ID"]) || `EV-${caseId}`;

      const artifactStatus =
        first(persistedArtifact, [
          "STATUS",
          "ARTIFACT_STATUS",
          "EVIDENCE_STATUS",
        ]) || "PERSISTED";

      const fileName =
        first(persistedArtifact, ["FILE_NAME", "FILENAME", "OBJECT_NAME"]) ||
        null;

      const preservedAt =
        first(persistedArtifact, [
          "CREATED_AT",
          "PRESERVED_AT",
          "UPLOADED_AT",
        ]) || null;

      const updatedAt =
        first(persistedArtifact, ["UPDATED_AT", "MODIFIED_AT", "CREATED_AT"]) ||
        null;

      const hasFile = Boolean(
        fileName ||
          first(persistedArtifact, [
            "STORAGE_REF",
            "STORAGE_URL",
            "FILE_URL",
            "ARTIFACT_URI",
          ]),
      );

      return json({
        ok: true,
        organization: {
          organizationId: session.organizationId,
          organizationName: session.organizationName,
        },
        artifact: {
          artifactId: normalizeArtifactId(artifactId, caseId),
          evidenceId,
          caseId,
          requestId: caseId,
          organizationName:
            first(persistedArtifact, [
              "ORG_NAME",
              "ORGANIZATION_NAME",
              "ORGANIZATION",
              "ORG",
            ]) || session.organizationName,
          email:
            first(persistedArtifact, [
              "EMAIL",
              "CONTACT_EMAIL",
              "SUBMITTED_BY",
            ]) || session.email,
          artifactType:
            first(persistedArtifact, ["EVIDENCE_TYPE", "TYPE"]) ||
            "Applicant Artifact",
          artifactStatus,
          source:
            first(persistedArtifact, ["SOURCE", "SOURCE_TABLE"]) ||
            "Artifact Repository",
          title:
            first(persistedArtifact, ["TITLE", "NAME"]) || "Persisted Artifact",
          fileName,
          fileType:
            first(persistedArtifact, [
              "FILE_TYPE",
              "MIME_TYPE",
              "CONTENT_TYPE",
            ]) || null,
          fileSize:
            first(persistedArtifact, [
              "FILE_SIZE",
              "SIZE_BYTES",
              "CONTENT_LENGTH",
            ]) || null,
          version: first(persistedArtifact, ["VERSION"]) || "1",
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
          authorityBoundaryText:
            "Operational artifact repository visibility only. No evidence authority, verification authority, scoring authority, certification authority, registry authority, publication authority, or governance authority is created.",
        },
        workflow: [
          { stage: "Artifact Upload Received", status: "COMPLETE" },
          { stage: "Artifact Persisted", status: "COMPLETE" },
          { stage: "Repository Preservation", status: "COMPLETE" },
          { stage: "Certification Consumption", status: "AVAILABLE" },
        ],
        authorityBoundary: {
          applicantMayViewArtifact: true,
          applicantMayUploadArtifact: true,
          applicantMayDeleteArtifact: false,
          applicantMayMutateEvidenceReview: false,
          applicantMayMutateFindings: false,
          applicantMayMutateScoring: false,
          applicantMayMutateDecision: false,
          applicantMayMutateCertification: false,
          applicantMayMutateRegistry: false,
        },
      });
    }

    const rows = await snowflakeQuery<WorkflowArtifactRow>(
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
      return json({ ok: false, error: "Applicant artifact not found." }, 404);
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
          error: "Artifact record is outside applicant organization scope.",
        },
        403,
      );
    }

    const updatedAt = clean(row.UPDATED_AT) || null;
    const status = clean(row.STATUS) || "PENDING";

    return json({
      ok: true,
      organization: {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
      },
      artifact: {
        artifactId: normalizeArtifactId(artifactId, requestId),
        evidenceId: `EV-${requestId}`,
        caseId: clean(row.REQUEST_ID),
        requestId: clean(row.REQUEST_ID),
        organizationName,
        email: clean(row.EMAIL) || null,
        artifactType: "Applicant Artifact Slot",
        artifactStatus: "NOT_PERSISTED",
        source: clean(row.SOURCE) || "Applicant Intake",
        title: `Artifact repository slot for ${requestId}`,
        fileName: null,
        fileType: null,
        fileSize: null,
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
        authorityBoundaryText:
          "Operational artifact repository visibility only. No evidence authority, verification authority, scoring authority, certification authority, registry authority, publication authority, or governance authority is created.",
      },
      workflow: [
        { stage: "Artifact Slot Created", status: "COMPLETE" },
        { stage: "Artifact Persistence Pending", status: "PENDING" },
        { stage: "Repository Preservation Pending", status: "PENDING" },
        { stage: "Certification Consumption Pending", status: "PENDING" },
      ],
      authorityBoundary: {
        applicantMayViewArtifact: true,
        applicantMayUploadArtifact: true,
        applicantMayDeleteArtifact: false,
        applicantMayMutateEvidenceReview: false,
        applicantMayMutateFindings: false,
        applicantMayMutateScoring: false,
        applicantMayMutateDecision: false,
        applicantMayMutateCertification: false,
        applicantMayMutateRegistry: false,
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant artifact detail query failed.",
      },
      500,
    );
  }
}
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

import { requireAdmin } from "@/lib/auth/require";
import { getApplicantSession } from "@/lib/applicant-auth";
import { executeQuery, snowflakeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const CASE_VIEW_NAME = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";

type CaseScopeRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
};

function ok(payload: Record<string, unknown>) {
  return NextResponse.json({ ok: true, ...payload });
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function safeSegment(value: string) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
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

async function verifyApplicantCaseScope(
  caseId: string,
  organizationName: string,
) {
  const rows = await snowflakeQuery<CaseScopeRow>(
    `
    SELECT
      REQUEST_ID::STRING AS REQUEST_ID,
      COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING AS ORG
    FROM ${CASE_VIEW_NAME}
    WHERE REQUEST_ID::STRING = ?
    LIMIT 1
    `,
    [caseId],
  );

  const row = rows[0];

  if (!row) return false;

  return (
    clean(row.ORG).toLowerCase() === clean(organizationName).toLowerCase()
  );
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);

    if (!auth.ok) {
      return bad(auth.error ?? "Applicant authentication required.", auth.status ?? 401);
    }

    const session = await getApplicantSession();

    if (!session) {
      return bad("Applicant session unavailable.", 401);
    }

    const form = await req.formData();

    const caseId = clean(form.get("caseId"));
    if (!caseId) return bad("caseId is required");

    const inScope = await verifyApplicantCaseScope(
      caseId,
      session.organizationName,
    );

    if (!inScope) {
      return bad("Case is outside applicant organization scope.", 403);
    }

    const artifactType = clean(form.get("artifactType")) || "document";
    const titleRaw = clean(form.get("title"));
    const descriptionRaw = clean(form.get("description"));
    const sourceUrlRaw = clean(form.get("sourceUrl"));

    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return bad("file is required");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const ts = new Date().toISOString().replace(/[:.]/g, "");
    const originalName = safeSegment(file.name || "artifact.bin");
    const caseFolder = safeSegment(caseId);
    const orgFolder = safeSegment(session.organizationName);

    const relDir = path.posix.join(
      "uploads",
      "applicant",
      "artifacts",
      orgFolder,
      caseFolder,
    );

    const relPath = path.posix.join(relDir, `${ts}-${originalName}`);

    const absDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "applicant",
      "artifacts",
      orgFolder,
      caseFolder,
    );

    const absPath = path.join(absDir, `${ts}-${originalName}`);

    await fs.mkdir(absDir, { recursive: true });
    await fs.writeFile(absPath, buffer);

    const storageRef = `/${relPath}`;
    const artifactId = `ART-${crypto.randomUUID()}`;
    const evidenceId = `EVD-${crypto.randomUUID()}`;
    const title = titleRaw || file.name || "Uploaded applicant artifact";
    const uploadedAt = new Date().toISOString();
    const artifactStatus = "PERSISTED";
    const hasFile = true;

    await executeQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
        (
          EVIDENCE_ID,
          CASE_ID,
          EVIDENCE_TYPE,
          TITLE,
          DESCRIPTION,
          SOURCE_URL,
          STORAGE_REF,
          SUBMITTED_BY
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        evidenceId,
        caseId,
        `artifact:${artifactType}`,
        title,
        descriptionRaw || null,
        sourceUrlRaw || null,
        storageRef,
        session.email,
      ],
    );

    return ok({
      artifactId,
      evidenceId,
      caseId,
      requestId: caseId,
      organizationName: session.organizationName,
      submittedBy: session.email,
      artifactType: `artifact:${artifactType}`,
      artifactStatus,
      title,
      description: descriptionRaw || null,
      sourceUrl: sourceUrlRaw || null,
      storageRef,
      uploadedAt,
      preservedAt: uploadedAt,
      updatedAt: uploadedAt,
      repositoryRecord: true,
      repositoryCategory: "Artifact Repository",
      workflowOrigin: "Applicant Upload",
      workflowStage: workflowStage(artifactStatus),
      preservationReadiness: preservationReadiness(artifactStatus, hasFile),
      repositoryHealth: repositoryHealth(hasFile, uploadedAt),
      ageDays: ageDays(uploadedAt),
      hasFile,
      isPending: false,
      authorityBoundary:
        "Operational artifact upload and repository visibility only. No evidence authority, verification authority, scoring authority, certification authority, registry authority, publication authority, or governance authority is created.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant artifact upload failed.",
      },
      { status: 500 },
    );
  }
}
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";

function ok(payload: any) {
  return NextResponse.json({ ok: true, ...payload });
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function safeSegment(s: string) {
  return String(s || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const caseId = String(form.get("caseId") ?? "").trim();
    if (!caseId) return bad("caseId is required");

    const evidenceType = String(form.get("evidenceType") ?? "document").trim() || "document";
    const titleRaw = String(form.get("title") ?? "").trim();
    const description = form.get("description") ? String(form.get("description")) : null;
    const sourceUrl = form.get("sourceUrl") ? String(form.get("sourceUrl")).trim() : null;

    const file = form.get("file");
    if (!file || !(file instanceof File)) return bad("file is required");

    // Read file bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Build a safe storage path under /public so it's directly accessible
    const ts = new Date().toISOString().replace(/[:.]/g, "");
    const originalName = safeSegment(file.name || "upload.bin");
    const caseFolder = safeSegment(caseId);

    const relDir = path.posix.join("uploads", "evidence", caseFolder);
    const relPath = path.posix.join(relDir, `${ts}-${originalName}`);

    // Absolute path on disk
    const absDir = path.join(process.cwd(), "public", "uploads", "evidence", caseFolder);
    const absPath = path.join(absDir, `${ts}-${originalName}`);

    await fs.mkdir(absDir, { recursive: true });
    await fs.writeFile(absPath, buffer);

    // This is a public URL path your UI can open in a new tab
    const storageRef = `/${relPath}`;

    // Title fallback
    const title = titleRaw || file.name || "Uploaded evidence";

    // Insert into Snowflake using your real schema
    const evidenceId = `EVD-${crypto.randomUUID()}`;
    const submittedBy = "admin@gafaig.com"; // replace with auth later

    await executeQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
        (EVIDENCE_ID, CASE_ID, EVIDENCE_TYPE, TITLE, DESCRIPTION, SOURCE_URL, STORAGE_REF, SUBMITTED_BY)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [evidenceId, caseId, evidenceType, title, description, sourceUrl, storageRef, submittedBy]
    );

    return ok({ evidenceId, storageRef });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}
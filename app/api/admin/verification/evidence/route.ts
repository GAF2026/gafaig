// app/api/admin/verification/evidence/route.ts
import { NextRequest, NextResponse } from "next/server";
import "server-only";
import fs from "fs";
import path from "path";

export const runtime = "nodejs"; // needed for fs on Vercel

type EvidenceRow = {
  evidenceId: string;
  caseId: string;
  evidenceType: string;
  title: string;
  description?: string | null;
  sourceUrl?: string | null;
  storageRef?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  createdAt?: string | null;
};

function jsonOk(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function jsonErr(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

// Vercel: writable at /tmp
const DATA_DIR = process.env.GAFAIG_DATA_DIR || path.join(process.cwd(), ".data");
const TMP_DIR = process.env.VERCEL ? "/tmp" : DATA_DIR;

function evidenceFileForCase(caseId: string) {
  return path.join(TMP_DIR, `gafaig-evidence-${caseId}.json`);
}

function readEvidence(caseId: string): EvidenceRow[] {
  try {
    const file = evidenceFileForCase(caseId);
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvidence(caseId: string, rows: EvidenceRow[]) {
  fs.mkdirSync(path.dirname(evidenceFileForCase(caseId)), { recursive: true });
  fs.writeFileSync(evidenceFileForCase(caseId), JSON.stringify(rows, null, 2), "utf8");
}

async function readBodyJson(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function getCaseId(req: NextRequest, body?: any) {
  const qsCaseId = req.nextUrl.searchParams.get("caseId");
  const bodyCaseId =
    body?.caseId || body?.CASE_ID || body?.case?.caseId || body?.params?.caseId;
  const caseId = String(qsCaseId || bodyCaseId || "").trim();
  return caseId;
}

export async function GET(req: NextRequest) {
  const caseId = String(req.nextUrl.searchParams.get("caseId") || "").trim();
  if (!caseId) return jsonErr("caseId is required", 400);

  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.max(
    1,
    Math.min(100, parseInt(req.nextUrl.searchParams.get("pageSize") || "20", 10) || 20)
  );

  const all = readEvidence(caseId);
  const total = all.length;

  const start = (page - 1) * pageSize;
  const rows = all.slice(start, start + pageSize);

  return jsonOk({ ok: true, rows, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const body = await readBodyJson(req);
  const caseId = getCaseId(req, body);
  if (!caseId) return jsonErr("caseId is required", 400);

  if (!body) return jsonErr("Invalid JSON body", 400);

  const evidenceType = String(body.evidenceType || body.type || "link").trim();
  const title = String(body.title || "").trim();
  const description = body.description ? String(body.description).trim() : null;
  const sourceUrl = body.sourceUrl ? String(body.sourceUrl).trim() : null;
  const storageRef = body.storageRef ? String(body.storageRef).trim() : null;

  if (!title) return jsonErr("title is required", 400);
  if (!sourceUrl && !storageRef) return jsonErr("Provide sourceUrl or storageRef", 400);

  const row: EvidenceRow = {
    evidenceId: makeId("EVD"),
    caseId,
    evidenceType,
    title,
    description,
    sourceUrl,
    storageRef,
    submittedBy: "demo",
    submittedAt: nowIso(),
    createdAt: nowIso(),
  };

  const existing = readEvidence(caseId);
  const next = [row, ...existing];
  writeEvidence(caseId, next);

  return jsonOk({ ok: true, row });
}
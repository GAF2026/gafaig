// app/api/admin/verification/evidence/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { executeQuery } from "@/lib/snowflake";
import { promises as fs } from "fs";
import path from "path";

type EvidenceRow = {
  evidenceId: string;
  caseId: string;
  evidenceType: string; // link | document | policy | ...
  title: string;
  description?: string | null;
  sourceUrl?: string | null;
  storageRef?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  createdAt?: string | null;
};

const DATA_FILE = path.join(process.cwd(), "data", "evidence.json");

function nowIso() {
  return new Date().toISOString();
}

function rand6() {
  return Math.random().toString(16).slice(2, 8);
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, value: any) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

function getCaseId(req: NextRequest, body?: any): string | null {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("caseId");
  const b = body?.caseId;
  const caseId = String(q ?? b ?? "").trim();
  return caseId.length ? caseId : null;
}

function inferActor(req: NextRequest): string {
  const v = req.cookies.get("gafaig_admin")?.value;
  if (v === "1") return "admin";
  if (v === "demo") return "demo";
  return "unknown";
}

async function emitEvent(args: {
  caseId: string;
  eventType: string;
  actor: string;
  details?: any;
}) {
  // Best-effort audit logging (never block the main action)
  try {
    const eventId = `EVT-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const detailsJson = args.details === undefined ? null : JSON.stringify(args.details);

    const sql = `
      INSERT INTO CORE.VERIFICATION_EVENTS
        (EVENT_ID, CASE_ID, EVENT_TYPE, ACTOR, DETAILS, CREATED_AT)
      SELECT
        ?, ?, ?, ?,
        IFF(? IS NULL, NULL, TO_VARIANT(PARSE_JSON(?))),
        CURRENT_TIMESTAMP()
    `;

    await executeQuery(sql, [
      eventId,
      args.caseId,
      args.eventType,
      args.actor || null,
      detailsJson,
      detailsJson,
    ]);
  } catch {
    // swallow
  }
}

export async function GET(req: NextRequest) {
  // Demo allowed: cookie "demo" or "1"
  if (!requireAdmin(req, true)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const caseId = getCaseId(req);
  if (!caseId) {
    return NextResponse.json({ ok: false, error: "Missing query param: caseId" }, { status: 400 });
  }

  const all: EvidenceRow[] = await readJsonFile<EvidenceRow[]>(DATA_FILE, []);
  const rows = all
    .filter((r) => r.caseId === caseId)
    .sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));

  return NextResponse.json({ ok: true, rows, total: rows.length, page: 1, pageSize: rows.length });
}

export async function POST(req: NextRequest) {
  // Demo allowed: cookie "demo" or "1"
  if (!requireAdmin(req, true)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json().catch(() => ({}));
  } catch {
    body = {};
  }

  const caseId = getCaseId(req, body);
  if (!caseId) {
    return NextResponse.json({ ok: false, error: "Missing caseId" }, { status: 400 });
  }

  const evidenceType = String(body?.evidenceType ?? "link").trim() || "link";
  const title = String(body?.title ?? "").trim();
  const description = body?.description != null ? String(body.description).trim() : null;
  const sourceUrl = body?.sourceUrl != null ? String(body.sourceUrl).trim() : null;
  const storageRef = body?.storageRef != null ? String(body.storageRef).trim() : null;

  if (!title) {
    return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });
  }
  if (!sourceUrl && !storageRef) {
    return NextResponse.json(
      { ok: false, error: "Provide at least one of sourceUrl or storageRef" },
      { status: 400 }
    );
  }

  const all: EvidenceRow[] = await readJsonFile<EvidenceRow[]>(DATA_FILE, []);

  const createdAt = nowIso();
  const row: EvidenceRow = {
    evidenceId: `EVD-${Date.now()}-${rand6()}`,
    caseId,
    evidenceType,
    title,
    description: description || null,
    sourceUrl: sourceUrl || null,
    storageRef: storageRef || null,
    submittedBy: inferActor(req),
    submittedAt: createdAt,
    createdAt,
  };

  all.push(row);
  await writeJsonFile(DATA_FILE, all);

  // ✅ Audit event to Snowflake
  await emitEvent({
    caseId,
    eventType: "evidence_added",
    actor: inferActor(req),
    details: { evidenceId: row.evidenceId, evidenceType, title },
  });

  return NextResponse.json({ ok: true, row });
}
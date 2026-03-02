// app/api/admin/verification/evidence/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { executeQuery } from "@/lib/snowflake";
import { promises as fs } from "fs";
import path from "path";

type SummaryRow = {
  caseId: string;
  evidenceId: string;
  style: string;
  model: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
};

type EvidenceRow = {
  evidenceId: string;
  caseId: string;
  evidenceType: string;
  title: string;
  description?: string | null;
  sourceUrl?: string | null;
  storageRef?: string | null;
  createdAt?: string | null;
};

const EVIDENCE_FILE = path.join(process.cwd(), "data", "evidence.json");
const SUMMARY_FILE = path.join(process.cwd(), "data", "verification", "evidence-summaries.json");

function nowIso() {
  return new Date().toISOString();
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

function key(evidenceId: string, style: string, model: string) {
  return `${evidenceId}||${style}||${model}`;
}

function getQuery(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return {
    caseId: String(searchParams.get("caseId") ?? "").trim(),
    evidenceIds: String(searchParams.get("evidenceIds") ?? "").trim(), // comma-separated
  };
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

/**
 * GET: returns stored summaries for a case + evidenceIds list
 * /api/admin/verification/evidence/summary?caseId=CASE-0001&evidenceIds=EVD-1,EVD-2
 */
export async function GET(req: NextRequest) {
  if (!requireAdmin(req, true)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { caseId, evidenceIds } = getQuery(req);
  if (!caseId) {
    return NextResponse.json({ ok: false, error: "Missing query param: caseId" }, { status: 400 });
  }
  if (!evidenceIds) {
    return NextResponse.json({ ok: true, rows: [] });
  }

  const wanted = new Set(
    evidenceIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );

  const all: SummaryRow[] = await readJsonFile<SummaryRow[]>(SUMMARY_FILE, []);
  const rows = all.filter((r) => r.caseId === caseId && wanted.has(r.evidenceId));

  return NextResponse.json({ ok: true, rows });
}

/**
 * POST: generate + persist a summary for an evidence item.
 * Body: { caseId, evidenceId, style, model, persist:true, force:boolean }
 */
export async function POST(req: NextRequest) {
  if (!requireAdmin(req, true)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json().catch(() => ({}));
  } catch {
    body = {};
  }

  const caseId = String(body?.caseId ?? "").trim();
  const evidenceId = String(body?.evidenceId ?? "").trim();
  const style = String(body?.style ?? "bullets").trim() || "bullets";
  const model = String(body?.model ?? "snowflake-arctic").trim() || "snowflake-arctic";
  const persist = body?.persist !== false; // default true
  const force = !!body?.force;

  if (!caseId) {
    return NextResponse.json({ ok: false, error: "Missing caseId" }, { status: 400 });
  }
  if (!evidenceId) {
    return NextResponse.json({ ok: false, error: "Missing evidenceId" }, { status: 400 });
  }

  const allSummaries: SummaryRow[] = await readJsonFile<SummaryRow[]>(SUMMARY_FILE, []);
  const k = key(evidenceId, style, model);

  // If not forcing, return existing stored summary if present
  if (!force) {
    const existing = allSummaries.find(
      (r) => r.caseId === caseId && key(r.evidenceId, r.style, r.model) === k
    );
    if (existing) {
      return NextResponse.json({ ok: true, summary: existing.summary, row: existing, reused: true });
    }
  }

  // Placeholder summary generation (swap to Cortex later)
  const evidence: EvidenceRow[] = await readJsonFile<EvidenceRow[]>(EVIDENCE_FILE, []);
  const ev = evidence.find((e) => e.caseId === caseId && e.evidenceId === evidenceId);

  const base = ev ? `${ev.title}${ev.description ? ` — ${ev.description}` : ""}` : `Evidence ${evidenceId}`;

  const summary =
    style === "bullets"
      ? `• ${base}\n• Stored for auditability under case ${caseId}\n• Model: ${model}`
      : `Summary (${style}) for ${caseId}: ${base} (model: ${model}).`;

  const ts = nowIso();
  const row: SummaryRow = {
    caseId,
    evidenceId,
    style,
    model,
    summary,
    createdAt: ts,
    updatedAt: ts,
  };

  if (persist) {
    // Upsert
    const idx = allSummaries.findIndex(
      (r) => r.caseId === caseId && key(r.evidenceId, r.style, r.model) === k
    );
    if (idx >= 0) {
      allSummaries[idx] = { ...allSummaries[idx], summary, updatedAt: ts };
    } else {
      allSummaries.push(row);
    }
    await writeJsonFile(SUMMARY_FILE, allSummaries);
  }

  // ✅ Audit event to Snowflake
  await emitEvent({
    caseId,
    eventType: "evidence_summary_generated",
    actor: inferActor(req),
    details: { evidenceId, style, model, force, persist },
  });

  return NextResponse.json({ ok: true, summary, row, reused: false });
}
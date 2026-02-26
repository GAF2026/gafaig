// app/api/admin/verification/finding-evidence/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { executeQuery } from "@/lib/snowflake";
import fs from "fs/promises";
import path from "path";

/**
 * GAFAIG MVP storage
 * - Uses JSON file for junction rows between Findings and Evidence.
 * - Rows look like:
 *   { findingId: string, evidenceId: string, caseId?: string, createdAt: string }
 *
 * Contract:
 * - GET    ?caseId=CASE-0001  -> list links for a case (if caseId not present on rows, returns all)
 * - POST   { caseId?, findingId, evidenceId } -> create link (de-dupes)
 * - DELETE ?findingId=...&evidenceId=... (&caseId optional) -> deletes link
 */

const DATA_DIR = path.join(process.cwd(), "data", "verification");
const FILE_PATH = path.join(DATA_DIR, "finding-evidence.json");

type LinkRow = {
  findingId: string;
  evidenceId: string;
  caseId?: string;
  createdAt: string;
};

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

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.writeFile(FILE_PATH, JSON.stringify([], null, 2), "utf8");
  }
}

async function readRows(): Promise<LinkRow[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LinkRow[]) : [];
  } catch {
    return [];
  }
}

async function writeRows(rows: LinkRow[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(FILE_PATH, JSON.stringify(rows, null, 2), "utf8");
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req, true)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId") || undefined;

  const rows = await readRows();

  // If rows include caseId, filter by it. If not, return all.
  const hasCaseIds = rows.some((r) => typeof r.caseId === "string" && r.caseId.length > 0);
  const filtered = caseId && hasCaseIds ? rows.filter((r) => r.caseId === caseId) : rows;

  return NextResponse.json({ ok: true, rows: filtered });
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req, true)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const caseId: string | undefined = body?.caseId ? String(body.caseId).trim() : undefined;
  const findingId: string | undefined = body?.findingId ? String(body.findingId).trim() : undefined;
  const evidenceId: string | undefined = body?.evidenceId ? String(body.evidenceId).trim() : undefined;

  if (!findingId || !evidenceId) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields: findingId, evidenceId" },
      { status: 400 }
    );
  }

  const rows = await readRows();

  const exists = rows.some((r) => r.findingId === findingId && r.evidenceId === evidenceId);
  if (!exists) {
    const newRow: LinkRow = {
      findingId,
      evidenceId,
      ...(caseId ? { caseId } : {}),
      createdAt: new Date().toISOString(),
    };
    rows.push(newRow);
    await writeRows(rows);

    // ✅ Audit event if we have caseId
    if (caseId) {
      await emitEvent({
        caseId,
        eventType: "evidence_linked",
        actor: inferActor(req),
        details: { findingId, evidenceId },
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req, true)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const caseId = (searchParams.get("caseId") || "").trim() || undefined;
  const findingId = (searchParams.get("findingId") || "").trim();
  const evidenceId = (searchParams.get("evidenceId") || "").trim();

  if (!findingId || !evidenceId) {
    return NextResponse.json(
      { ok: false, error: "Missing query params: findingId, evidenceId" },
      { status: 400 }
    );
  }

  const rows = await readRows();
  const before = rows.length;

  const rowsStoreCaseId = rows.some((r) => r.caseId);
  const updated = rows.filter((r) => {
    const matchCore = r.findingId === findingId && r.evidenceId === evidenceId;
    if (!matchCore) return true;

    if (caseId && rowsStoreCaseId) {
      return r.caseId !== caseId; // keep rows not in this case
    }

    return false; // delete match
  });

  await writeRows(updated);

  const deletedCount = before - updated.length;

  // ✅ Audit event if we have caseId
  if (deletedCount > 0 && caseId) {
    await emitEvent({
      caseId,
      eventType: "evidence_unlinked",
      actor: inferActor(req),
      details: { findingId, evidenceId },
    });
  }

  return NextResponse.json({ ok: true, deletedCount });
}
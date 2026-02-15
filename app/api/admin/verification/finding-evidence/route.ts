import { NextResponse } from "next/server";
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
 *
 * IMPORTANT:
 * - DELETE no longer requires caseId. It will use it if supplied (for extra safety),
 *   but will still delete based on (findingId, evidenceId) alone.
 */

const DATA_DIR = path.join(process.cwd(), "data", "verification");
const FILE_PATH = path.join(DATA_DIR, "finding-evidence.json");

type LinkRow = {
  findingId: string;
  evidenceId: string;
  caseId?: string;
  createdAt: string;
};

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
    // If file is corrupted, fail safe to empty rather than crashing admin.
    return [];
  }
}

async function writeRows(rows: LinkRow[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(FILE_PATH, JSON.stringify(rows, null, 2), "utf8");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId") || undefined;

  const rows = await readRows();

  // If rows include caseId, filter by it. If not, return all.
  const hasCaseIds = rows.some((r) => typeof r.caseId === "string" && r.caseId.length > 0);
  const filtered =
    caseId && hasCaseIds ? rows.filter((r) => r.caseId === caseId) : rows;

  return NextResponse.json({ ok: true, rows: filtered });
}

export async function POST(req: Request) {
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const caseId: string | undefined = body?.caseId ? String(body.caseId) : undefined;
  const findingId: string | undefined = body?.findingId ? String(body.findingId) : undefined;
  const evidenceId: string | undefined = body?.evidenceId ? String(body.evidenceId) : undefined;

  if (!findingId || !evidenceId) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields: findingId, evidenceId" },
      { status: 400 }
    );
  }

  const rows = await readRows();

  // De-dupe by (findingId, evidenceId). If you want stricter de-dupe by caseId too, adjust here.
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
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);

  const caseId = searchParams.get("caseId") || undefined;
  const findingId = searchParams.get("findingId");
  const evidenceId = searchParams.get("evidenceId");

  if (!findingId || !evidenceId) {
    return NextResponse.json(
      { ok: false, error: "Missing query params: findingId, evidenceId" },
      { status: 400 }
    );
  }

  const rows = await readRows();

  const before = rows.length;

  // Primary delete key: (findingId, evidenceId)
  // If caseId is provided AND rows store it, require match for extra safety.
  const rowsStoreCaseId = rows.some((r) => r.caseId);
  const updated = rows.filter((r) => {
    const matchCore = r.findingId === findingId && r.evidenceId === evidenceId;
    if (!matchCore) return true;

    if (caseId && rowsStoreCaseId) {
      return r.caseId !== caseId; // keep rows that are not in this case
    }

    return false; // delete the match
  });

  await writeRows(updated);

  const deletedCount = before - updated.length;
  return NextResponse.json({ ok: true, deletedCount });
}
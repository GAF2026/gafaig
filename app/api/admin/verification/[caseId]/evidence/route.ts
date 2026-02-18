import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

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

const DATA_DIR = path.join(process.cwd(), "data");
const EVIDENCE_FILE = path.join(DATA_DIR, "evidence.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readAllEvidence(): Promise<EvidenceRow[]> {
  try {
    const raw = await fs.readFile(EVIDENCE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as EvidenceRow[];
    return [];
  } catch (e: any) {
    if (e?.code === "ENOENT") return [];
    // If JSON is invalid, fail loudly (better than silent hangs)
    throw e;
  }
}

async function writeAllEvidence(rows: EvidenceRow[]) {
  await ensureDataDir();
  await fs.writeFile(EVIDENCE_FILE, JSON.stringify(rows, null, 2), "utf8");
}

function nowTs() {
  return new Date().toISOString();
}

export async function GET(
  _req: Request,
  ctx: { params: { caseId: string } }
) {
  try {
    const caseId = ctx.params.caseId;
    const all = await readAllEvidence();
    const rows = all.filter((r) => r.caseId === caseId);

    return NextResponse.json({
      ok: true,
      rows,
      total: rows.length,
      page: 1,
      pageSize: 20,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "GET evidence failed" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  ctx: { params: { caseId: string } }
) {
  try {
    const caseId = ctx.params.caseId;
    const body = await req.json().catch(() => ({}));

    const evidenceType = String(body?.evidenceType || "document");
    const title = String(body?.title || "").trim();
    const description =
      body?.description === undefined ? null : String(body.description);
    const sourceUrl = body?.sourceUrl === undefined ? null : String(body.sourceUrl);

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Missing title" },
        { status: 400 }
      );
    }

    const all = await readAllEvidence();

    const row: EvidenceRow = {
      evidenceId: `EVD-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      caseId,
      evidenceType,
      title,
      description,
      sourceUrl,
      storageRef: null,
      submittedBy: null,
      submittedAt: nowTs(),
      createdAt: nowTs(),
    };

    all.push(row);
    await writeAllEvidence(all);

    const rows = all.filter((r) => r.caseId === caseId);

    return NextResponse.json({
      ok: true,
      row,
      rows,
      total: rows.length,
      page: 1,
      pageSize: 20,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "POST evidence failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: { caseId: string } }
) {
  try {
    const caseId = ctx.params.caseId;

    const { searchParams } = new URL(req.url);
    const evidenceId = searchParams.get("evidenceId")?.trim();

    if (!evidenceId) {
      return NextResponse.json(
        { ok: false, error: "Missing query param: evidenceId" },
        { status: 400 }
      );
    }

    const all = await readAllEvidence();
    const before = all.length;

    const next = all.filter(
      (r) => !(r.caseId === caseId && r.evidenceId === evidenceId)
    );

    if (next.length === before) {
      return NextResponse.json(
        { ok: false, error: "Evidence not found" },
        { status: 404 }
      );
    }

    await writeAllEvidence(next);

    const rows = next.filter((r) => r.caseId === caseId);

    return NextResponse.json({
      ok: true,
      rows,
      total: rows.length,
      page: 1,
      pageSize: 20,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "DELETE evidence failed" },
      { status: 500 }
    );
  }
}
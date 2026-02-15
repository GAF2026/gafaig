import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

type FileShape = {
  version?: string;
  lastUpdated?: string;
  items?: any[];
};

const VALID_STATUSES = new Set(["received", "in_review", "approved", "rejected"]);

function dataPath(fileName: string) {
  // Use process.cwd() so it works in dev and on Vercel (read-only caveat noted)
  return path.join(process.cwd(), "app", "data", fileName);
}

async function readJson(filePath: string): Promise<FileShape> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);

  // Support either { items: [...] } or [...] (but we standardize to {items})
  if (Array.isArray(parsed)) return { items: parsed };
  if (parsed && typeof parsed === "object") return parsed as FileShape;

  return { items: [] };
}

async function writeJson(filePath: string, data: FileShape) {
  const next: FileShape = {
    version: data.version ?? "1.0",
    lastUpdated: new Date().toISOString(),
    items: Array.isArray(data.items) ? data.items : [],
  };
  await fs.writeFile(filePath, JSON.stringify(next, null, 2) + "\n", "utf8");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const requestId = String(body?.requestId ?? "").trim();
    const status = String(body?.status ?? "").trim();

    if (!requestId) {
      return NextResponse.json({ ok: false, error: "missing_requestId" }, { status: 400 });
    }

    if (!VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { ok: false, error: "invalid_status", allowed: Array.from(VALID_STATUSES) },
        { status: 400 }
      );
    }

    const applicationsPath = dataPath("applications.json");
    const renewalsPath = dataPath("renewals.json");

    // 1) Try applications
    const apps = await readJson(applicationsPath);
    const appItems = Array.isArray(apps.items) ? apps.items : [];
    const appIdx = appItems.findIndex((x) => String(x?.requestId ?? "").trim() === requestId);

    if (appIdx >= 0) {
      appItems[appIdx] = {
        ...appItems[appIdx],
        status,
        updatedAt: new Date().toISOString(),
      };
      await writeJson(applicationsPath, { ...apps, items: appItems });
      return NextResponse.json({ ok: true, updated: { requestId, status, source: "applications" } });
    }

    // 2) Try renewals
    const rens = await readJson(renewalsPath);
    const renItems = Array.isArray(rens.items) ? rens.items : [];
    const renIdx = renItems.findIndex((x) => String(x?.requestId ?? "").trim() === requestId);

    if (renIdx >= 0) {
      renItems[renIdx] = {
        ...renItems[renIdx],
        status,
        updatedAt: new Date().toISOString(),
      };
      await writeJson(renewalsPath, { ...rens, items: renItems });
      return NextResponse.json({ ok: true, updated: { requestId, status, source: "renewals" } });
    }

    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "server_error", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

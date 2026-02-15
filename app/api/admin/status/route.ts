import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

type AnyObj = Record<string, any>;

function readFileJson(filePath: string): AnyObj {
  if (!fs.existsSync(filePath)) {
    return { version: 1, lastUpdated: new Date().toISOString(), items: [] };
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object") {
    return { version: 1, lastUpdated: new Date().toISOString(), items: [] };
  }
  if (!Array.isArray((parsed as any).items)) (parsed as any).items = [];
  return parsed as AnyObj;
}

function writeFileJson(filePath: string, obj: AnyObj) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), "utf8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requestId = String(body?.requestId ?? "");
    const status = String(body?.status ?? "");

    if (!requestId) {
      return NextResponse.json({ ok: false, error: "Missing requestId" }, { status: 400 });
    }
    if (!status) {
      return NextResponse.json({ ok: false, error: "Missing status" }, { status: 400 });
    }

    const cwd = process.cwd();
    const applicationsPath = path.join(cwd, "app", "data", "applications.json");
    const renewalsPath = path.join(cwd, "app", "data", "renewals.json");

    const now = new Date().toISOString();

    // Try update in renewals first
    const renewals = readFileJson(renewalsPath);
    const rIndex = (renewals.items as any[]).findIndex((x) => x?.requestId === requestId);

    if (rIndex >= 0) {
      renewals.items[rIndex] = { ...renewals.items[rIndex], status, updatedAt: now };
      renewals.lastUpdated = now;
      writeFileJson(renewalsPath, renewals);
      return NextResponse.json({ ok: true, updated: { requestId, status } });
    }

    // Then applications
    const applications = readFileJson(applicationsPath);
    const aIndex = (applications.items as any[]).findIndex((x) => x?.requestId === requestId);

    if (aIndex >= 0) {
      applications.items[aIndex] = { ...applications.items[aIndex], status, updatedAt: now };
      applications.lastUpdated = now;
      writeFileJson(applicationsPath, applications);
      return NextResponse.json({ ok: true, updated: { requestId, status } });
    }

    return NextResponse.json(
      { ok: false, error: "requestId not found" },
      { status: 404 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Status update failed" },
      { status: 500 }
    );
  }
}

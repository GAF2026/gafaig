import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoreShape = {
  version: number;
  lastUpdated: string;
  items: any[];
};

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix = "APP") {
  // Example: APP-20260130-<8hex>
  const yyyyMMdd =
    new Date().getFullYear().toString() +
    String(new Date().getMonth() + 1).padStart(2, "0") +
    String(new Date().getDate()).padStart(2, "0");
  const rand = crypto.randomBytes(4).toString("hex");
  return `${prefix}-${yyyyMMdd}-${rand}`;
}

async function safeReadStore(filePath: string): Promise<StoreShape> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    if (!raw.trim()) {
      return { version: 1, lastUpdated: nowIso(), items: [] };
    }
    const parsed = JSON.parse(raw);

    // Normalize to { version, lastUpdated, items }
    if (Array.isArray(parsed)) {
      return { version: 1, lastUpdated: nowIso(), items: parsed };
    }

    if (parsed && typeof parsed === "object") {
      const anyParsed: any = parsed;

      // If it already matches your schema:
      if (Array.isArray(anyParsed.items)) {
        return {
          version: typeof anyParsed.version === "number" ? anyParsed.version : 1,
          lastUpdated: typeof anyParsed.lastUpdated === "string" ? anyParsed.lastUpdated : nowIso(),
          items: anyParsed.items,
        };
      }

      // Back-compat shapes:
      if (Array.isArray(anyParsed.rows)) return { version: 1, lastUpdated: nowIso(), items: anyParsed.rows };
      if (Array.isArray(anyParsed.applications)) return { version: 1, lastUpdated: nowIso(), items: anyParsed.applications };

      // Unknown object shape -> preserve nothing, start clean
      return { version: 1, lastUpdated: nowIso(), items: [] };
    }

    return { version: 1, lastUpdated: nowIso(), items: [] };
  } catch {
    // If file doesn't exist or parse fails, create fresh store
    return { version: 1, lastUpdated: nowIso(), items: [] };
  }
}

async function atomicWriteJson(filePath: string, data: any) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  const tmpPath = `${filePath}.tmp`;
  const json = JSON.stringify(data, null, 2);

  await fs.writeFile(tmpPath, json, "utf8");
  await fs.rename(tmpPath, filePath);
}

export async function POST(req: Request) {
  const filePath = path.join(process.cwd(), "app", "data", "applications.json");

  let payload: any = {};
  try {
    payload = await req.json();
  } catch {
    payload = {};
  }

  const store = await safeReadStore(filePath);

  const requestId = makeId("APP");
  const createdAt = nowIso();

  const record = {
    requestId,
    createdAt,
    status: "received",
    ...payload,
  };

  store.items.push(record);
  store.lastUpdated = nowIso();

  await atomicWriteJson(filePath, store);

  return NextResponse.json(
    {
      ok: true,
      requestId,
      message: "Application received.",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

const TABLE_NAME = "GAFAIG_DB.CORE.APPLICATIONS";
const ALLOWED = new Set(["received", "in_review", "approved", "rejected"]);

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json({ ok: false, error: auth.error ?? "Unauthorized" }, auth.status ?? 401);
    }

    const body = await req.json().catch(() => ({}));
    const requestId = String(body?.requestId ?? "").trim();
    const status = String(body?.status ?? "").trim();

    if (!requestId) return json({ ok: false, error: "Missing requestId" }, 400);
    if (!ALLOWED.has(status)) return json({ ok: false, error: `Invalid status: ${status}` }, 400);

    const sql = `
      UPDATE ${TABLE_NAME}
      SET
        STATUS = ?,
        UPDATED_AT = CURRENT_TIMESTAMP()
      WHERE REQUEST_ID = ?
    `;

    await sfQuery(sql, [status, requestId]);

    return json({ ok: true });
  } catch (e: any) {
    return json({ ok: false, error: String(e?.message ?? e ?? "Unknown error") }, 500);
  }
}
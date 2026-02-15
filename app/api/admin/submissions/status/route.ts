import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

const ALLOWED = new Set(["received", "in_review", "approved", "rejected"]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestId = String(body?.requestId ?? "").trim();
    const nextStatus = String(body?.status ?? "").trim().toLowerCase();

    if (!requestId) {
      return NextResponse.json({ ok: false, error: "Missing requestId" }, { status: 400 });
    }
    if (!ALLOWED.has(nextStatus)) {
      return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
    }

    // Update status + updated_at
    const rows: any[] = (await executeQuery(
      `UPDATE GAFAIG_DB.CORE.SUBMISSIONS
       SET status = ?, updated_at = CURRENT_TIMESTAMP()
       WHERE request_id = ?`,
      [nextStatus, requestId]
    )) as any[];

    // Note: Snowflake SDK returns rows differently for UPDATE; we just return ok:true if no error.
    return NextResponse.json({ ok: true, requestId, status: nextStatus });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to update status" },
      { status: 500 }
    );
  }
}
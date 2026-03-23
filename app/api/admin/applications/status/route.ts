import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const requestId = String(body?.requestId ?? "").trim().toUpperCase();
    const status = String(body?.status ?? "").trim().toLowerCase();

    if (!requestId || !status) {
      return NextResponse.json(
        { ok: false, error: "Missing requestId or status" },
        { status: 400 }
      );
    }

    // ✅ Update canonical applications table
    await executeQuery(
      `
      UPDATE CORE.APPLICATIONS
      SET STATUS = ?, UPDATED_AT = CURRENT_TIMESTAMP()
      WHERE REQUEST_ID = ?
      `,
      [status, requestId]
    );

    // ⚠️ CRITICAL: also update source feeding V_ADMIN_SUBMISSIONS
    // (Assuming APPLICATIONS is the base — if not, this still safe)
    await executeQuery(
      `
      UPDATE GAFAIG_DB.CORE.APPLICATIONS
      SET STATUS = ?, UPDATED_AT = CURRENT_TIMESTAMP()
      WHERE REQUEST_ID = ?
      `,
      [status, requestId]
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
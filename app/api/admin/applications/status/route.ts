import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const requestId = String(body?.requestId ?? "").trim();
    const status = String(body?.status ?? "").trim().toLowerCase();

    if (!requestId || !status) {
      return NextResponse.json(
        { ok: false, error: "Missing requestId or status" },
        { status: 400 }
      );
    }

    // ✅ CRITICAL: use REQUEST_ID (not ID)
    const result = await executeQuery(
      `
      UPDATE CORE.APPLICATIONS
      SET STATUS = ?
      WHERE REQUEST_ID = ?
      `,
      [status, requestId]
    );

    // Optional: check rows affected (depends on your executeQuery implementation)
    if (!result) {
      return NextResponse.json(
        { ok: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
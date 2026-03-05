import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export async function POST(req: Request) {
  const expected = process.env.GAFAIG_ADMIN_PASSWORD;

  if (!expected || !expected.trim()) {
    return json(500, {
      ok: false,
      error: "Server misconfigured: missing GAFAIG_ADMIN_PASSWORD",
      code: "MISSING_ENV",
    });
  }

  let payload: any = null;
  try {
    payload = await req.json();
  } catch {
    // ignore
  }

  const password = String(payload?.password ?? "").trim();
  if (!password) {
    return json(400, { ok: false, error: "Missing password", code: "MISSING_PASSWORD" });
  }

  if (!safeEqual(password, expected.trim())) {
    return json(401, { ok: false, error: "Invalid password", code: "INVALID_PASSWORD" });
  }

  const res = json(200, { ok: true });

  // Demo cookie: short TTL, HttpOnly
  res.cookies.set({
    name: "gafaig_admin_demo",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}

export async function GET() {
  return json(405, { ok: false, error: "Method Not Allowed. Use POST." });
}
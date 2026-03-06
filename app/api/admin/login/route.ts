// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin_demo";
const COOKIE_VALUE = "1";
const COOKIE_MAX_AGE_SECONDS = 60 * 60; // 1 hour

function safeString(v: unknown) {
  return typeof v === "string" ? v : "";
}

function timingSafeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { password?: unknown };

    const provided = safeString(body?.password).trim();
    if (!provided) {
      return NextResponse.json(
        { ok: false, error: "Missing password" },
        { status: 400 }
      );
    }

    const expected = safeString(process.env.GAFAIG_ADMIN_PASSWORD).trim();
    if (!expected) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: GAFAIG_ADMIN_PASSWORD not set" },
        { status: 500 }
      );
    }

    if (!timingSafeEqual(provided, expected)) {
      return NextResponse.json(
        { ok: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: COOKIE_NAME,
      value: COOKIE_VALUE,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
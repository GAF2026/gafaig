// app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin_demo";
const COOKIE_MAX_AGE_SECONDS = 60 * 60; // 1 hour

function timingSafeEqual(a: string, b: string) {
  // Prevent trivial timing attacks (best-effort in JS)
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export async function POST(req: Request) {
  try {
    const expected = process.env.GAFAIG_ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: missing GAFAIG_ADMIN_PASSWORD" },
        { status: 500 }
      );
    }

    // Accept JSON body: { password: "..." }
    let password = "";
    try {
      const body = await req.json();
      password = String(body?.password ?? "");
    } catch {
      // If body isn't JSON, treat as empty; (LoginClient should send JSON)
      password = "";
    }

    if (!password) {
      return NextResponse.json(
        { ok: false, error: "Missing password" },
        { status: 400 }
      );
    }

    const ok = timingSafeEqual(password, expected);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true }, { status: 200 });

    // IMPORTANT:
    // - In production, set domain to ".gafaig.com" so cookie works for both apex + www.
    // - In dev (localhost), do NOT set domain (browsers will reject it).
    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set({
      name: COOKIE_NAME,
      value: "1",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
      ...(isProd ? { domain: ".gafaig.com" } : {}),
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
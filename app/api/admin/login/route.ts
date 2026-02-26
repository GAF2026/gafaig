// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, type AdminCookieValue } from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = String(body?.password ?? "").trim();

    const expected = String(process.env.GAFAIG_ADMIN_PASSWORD ?? "").trim();
    const demoExpected = String(process.env.GAFAIG_ADMIN_DEMO_PASSWORD ?? "").trim();

    let cookieValue: AdminCookieValue | "" = "";

    // Admin login
    if (expected.length > 0 && password === expected) {
      cookieValue = "1";
    }

    // Optional demo login path (only if configured)
    if (!cookieValue && demoExpected.length > 0 && password === demoExpected) {
      cookieValue = "demo";
    }

    if (!cookieValue) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({
      ok: true,
      mode: cookieValue === "demo" ? "demo" : "admin",
    });

    const isProd = process.env.NODE_ENV === "production";

    // ✅ Cookie security:
    // - Always httpOnly for API login (prevents XSS cookie theft)
    // - sameSite=lax is fine for same-site navigation
    // - secure in production only
    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: cookieValue,
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Login failed" }, { status: 500 });
  }
}
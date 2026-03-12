import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin_demo";
const COOKIE_VALUE = "1";
const COOKIE_MAX_AGE_SECONDS = 60 * 60; // 1 hour

function safeString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { password?: unknown };
    const provided = safeString(body?.password);

    if (!provided) {
      return NextResponse.json(
        { ok: false, error: "Missing password" },
        { status: 400 }
      );
    }

    const adminPassword = safeString(process.env.GAFAIG_ADMIN_PASSWORD);
    const demoPassword = safeString(process.env.GAFAIG_ADMIN_DEMO_PASSWORD);
    const publicDemoPassword = safeString(process.env.NEXT_PUBLIC_DEMO_PASSWORD);

    const acceptedPasswords = [
      adminPassword,
      demoPassword,
      publicDemoPassword,
    ].filter(Boolean);

    if (acceptedPasswords.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No demo password configured on server" },
        { status: 500 }
      );
    }

    const authorized = acceptedPasswords.includes(provided);

    if (!authorized) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: COOKIE_NAME,
      value: COOKIE_VALUE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
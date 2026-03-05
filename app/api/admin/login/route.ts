// app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin";

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,          // MUST be false on localhost
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,     // 8 hours
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const demo = Boolean(body?.demo);

    if (!demo) {
      const password = String(body?.password || "");
      const expected = process.env.GAFAIG_ADMIN_PASSWORD;

      if (!expected) {
        return NextResponse.json(
          { ok: false, error: "Server misconfigured: missing GAFAIG_ADMIN_PASSWORD" },
          { status: 500 }
        );
      }
      if (!password || password !== expected) {
        return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
      }
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, "1", cookieOptions());
    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
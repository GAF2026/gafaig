import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "gafaig_admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = String(body?.password ?? "");

    const expected = process.env.GAFAIG_ADMIN_PASSWORD ?? "";
    const ok = expected.length > 0 && password === expected;

    if (!ok) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });

    // Simple admin cookie
    res.cookies.set({
      name: COOKIE_NAME,
      value: "1",
      httpOnly: false, // so you can see it in DevTools while developing
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Login failed" },
      { status: 500 }
    );
  }
}

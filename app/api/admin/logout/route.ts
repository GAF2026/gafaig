// app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "gafaig_admin_demo";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const isProd = process.env.NODE_ENV === "production";

  // Clear the demo admin cookie
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 0,
  });

  return res;
}
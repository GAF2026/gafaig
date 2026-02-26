// app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth/admin";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const isProd = process.env.NODE_ENV === "production";

  // ✅ Clear cookie fully and safely
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 0,
  });

  return res;
}
// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin_demo";
const COOKIE_MAX_AGE_SECONDS = 60 * 60; // 1 hour

function timingSafeEqual(a: string, b: string) {
  // Node timing-safe compare
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function getCookieDomain(host: string | null) {
  // Only set Domain in production on our real domain so it works for both apex + www.
  // For localhost/dev, return undefined (host-only cookie).
  const h = (host || "").toLowerCase();
  if (!h) return undefined;

  // strip port
  const hostname = h.split(":")[0];

  if (hostname === "gafaig.com" || hostname.endsWith(".gafaig.com")) {
    return ".gafaig.com";
  }

  return undefined;
}

export async function POST(req: Request) {
  const expected =
    process.env.GAFAIG_ADMIN_PASSWORD ||
    process.env.GAFAIG_DEMO_ADMIN_PASSWORD ||
    "";

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: missing GAFAIG_ADMIN_PASSWORD", code: "MISCONFIG" },
      { status: 500 }
    );
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const provided = String(body?.password || "").trim();

  if (!provided || !timingSafeEqual(provided, expected)) {
    return NextResponse.json(
      { ok: false, error: "Invalid password", code: "INVALID_PASSWORD" },
      { status: 401 }
    );
  }

  const host = req.headers.get("host");
  const domain = getCookieDomain(host);

  // Derive secure from URL (Vercel/prod will be https)
  const url = new URL(req.url);
  const secure = url.protocol === "https:";

  const res = NextResponse.json({ ok: true });

  res.cookies.set({
    name: COOKIE_NAME,
    value: "1",
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    ...(domain ? { domain } : {}),
  });

  return res;
}
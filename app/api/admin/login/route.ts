// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin_demo";
const COOKIE_MAX_AGE_SECONDS = 60 * 60; // 1 hour

function timingSafeEqual(a: string, b: string) {
  // Best-effort timing-safe compare (Node)
  const aa = Buffer.from(String(a || ""), "utf8");
  const bb = Buffer.from(String(b || ""), "utf8");
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function getHostname(req: Request) {
  const host = req.headers.get("host") || "";
  // host may be "www.gafaig.com" or "localhost:3000"
  return host.split(":")[0].toLowerCase();
}

function cookieDomainForHost(hostname: string) {
  // In production we want the cookie to be valid for BOTH:
  // - gafaig.com
  // - www.gafaig.com
  // so we set Domain=.gafaig.com
  //
  // In local dev, do NOT set a domain.
  if (hostname === "gafaig.com" || hostname.endsWith(".gafaig.com")) return ".gafaig.com";
  return undefined;
}

export async function POST(req: Request) {
  const hostname = getHostname(req);
  const expected = process.env.GAFAIG_ADMIN_PASSWORD || "";

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    // ignore
  }

  const provided = String(body?.password || "").trim();

  if (!expected) {
    // Misconfiguration (env var missing)
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: GAFAIG_ADMIN_PASSWORD is not set." },
      { status: 500 }
    );
  }

  if (!provided) {
    return NextResponse.json({ ok: false, error: "Missing password." }, { status: 400 });
  }

  if (!timingSafeEqual(provided, expected)) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? cookieDomainForHost(hostname) : undefined;

  res.cookies.set({
    name: COOKIE_NAME,
    value: "1",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    ...(domain ? { domain } : {}),
  });

  return res;
}

// Optional: allow clearing the demo cookie
export async function DELETE(req: Request) {
  const hostname = getHostname(req);
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? cookieDomainForHost(hostname) : undefined;

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    ...(domain ? { domain } : {}),
  });

  return res;
}
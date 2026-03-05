// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin_demo";
const COOKIE_MAX_AGE_SECONDS = 60 * 60; // 1 hour

function safeString(v: unknown) {
  return typeof v === "string" ? v : "";
}

function timingSafeEqual(a: string, b: string) {
  // Timing-safe compare (Node). If lengths differ, bail.
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function getCookieDomainFromHost(host: string | null) {
  // host may be "www.gafaig.com:443" etc.
  const h = (host || "").split(":")[0].toLowerCase();
  if (!h) return undefined;

  // Local dev: do NOT set Domain
  if (h === "localhost" || h === "127.0.0.1" || h.endsWith(".localhost")) return undefined;

  // For your real site, force apex+www compatibility:
  // Domain=.gafaig.com covers BOTH gafaig.com and www.gafaig.com.
  if (h === "gafaig.com" || h === "www.gafaig.com" || h.endsWith(".gafaig.com")) {
    return ".gafaig.com";
  }

  // For Vercel previews and other hosts, safest is: no Domain attribute
  // (host-only cookie for that preview deployment).
  return undefined;
}

function isSecureRequest(req: Request) {
  // On Vercel this will usually be "https"
  const xfProto = req.headers.get("x-forwarded-proto")?.toLowerCase();
  if (xfProto) return xfProto === "https";
  // fallback
  return process.env.NODE_ENV === "production";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { password?: unknown };

    const provided = safeString(body?.password).trim();
    if (!provided) {
      return NextResponse.json({ ok: false, error: "Missing password" }, { status: 400 });
    }

    const expected = safeString(process.env.GAFAIG_ADMIN_PASSWORD).trim();
    if (!expected) {
      // Misconfigured env on Vercel
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: GAFAIG_ADMIN_PASSWORD not set" },
        { status: 500 }
      );
    }

    if (!timingSafeEqual(provided, expected)) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
    }

    const host = req.headers.get("host");
    const domain = getCookieDomainFromHost(host);
    const secure = isSecureRequest(req);

    const res = NextResponse.json({ ok: true });

    // IMPORTANT: value must match what the gate expects.
    // We use "1" as a stable value.
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
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
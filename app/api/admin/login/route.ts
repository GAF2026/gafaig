// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin_demo";
const COOKIE_MAX_AGE_SECONDS = 60 * 60; // 1 hour

function timingSafeEqual(a: string, b: string) {
  // Best-effort timing-safe compare (Node)
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function getCookieDomainFromHost(host: string | null): string | undefined {
  if (!host) return undefined;

  const h = host.split(":")[0].toLowerCase();

  // Local dev: do NOT set Domain (browsers can reject it for localhost/127.*)
  if (h === "localhost" || h === "127.0.0.1" || h.endsWith(".localhost")) return undefined;

  // Production: share cookie across apex + www + any subdomain
  // (fixes gafaig.com <-> www.gafaig.com redirect loops)
  if (h === "gafaig.com" || h.endsWith(".gafaig.com")) return ".gafaig.com";

  // For preview deployments / other hosts, omit Domain to avoid mis-scoping
  return undefined;
}

export async function POST(req: Request) {
  try {
    const expected = process.env.GAFAIG_ADMIN_PASSWORD;

    if (!expected || expected.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: missing GAFAIG_ADMIN_PASSWORD", code: "MISCONFIG" },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => null)) as { password?: string } | null;
    const provided = (body?.password ?? "").trim();

    if (!provided) {
      return NextResponse.json({ ok: false, error: "Missing password", code: "MISSING_PASSWORD" }, { status: 400 });
    }

    const ok = timingSafeEqual(provided, expected);

    if (!ok) {
      return NextResponse.json({ ok: false, error: "Invalid password", code: "INVALID_PASSWORD" }, { status: 401 });
    }

    const host = req.headers.get("host");
    const domain = getCookieDomainFromHost(host);

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: COOKIE_NAME,
      value: "1",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
      ...(domain ? { domain } : {}),
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unexpected error", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
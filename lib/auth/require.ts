// lib/auth/require.ts
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySession, type Role, type Session } from "./session";

const DEMO_COOKIE_NAME = "gafaig_admin_demo";
const LEGACY_COOKIE_NAME = "gafaig_admin";
const DEMO_SESSION_SECONDS = 60 * 60;

function nowEpoch() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Back-compat support:
 * - signed session cookie (preferred)
 * - legacy gafaig_admin=1|demo
 * - current demo cookie gafaig_admin_demo=1
 */
function getLegacySession(req: NextRequest): Session | null {
  const now = nowEpoch();

  const legacy = req.cookies.get(LEGACY_COOKIE_NAME)?.value;
  if (legacy === "1") {
    return {
      sub: "legacy-admin",
      role: "SUPER_ADMIN",
      mode: "admin",
      iat: now,
      exp: now + DEMO_SESSION_SECONDS,
    };
  }

  if (legacy === "demo") {
    return {
      sub: "legacy-demo",
      role: "DEMO",
      mode: "demo",
      iat: now,
      exp: now + DEMO_SESSION_SECONDS,
    };
  }

  const demoCookie = req.cookies.get(DEMO_COOKIE_NAME)?.value;
  if (demoCookie === "1") {
    return {
      sub: "demo-cookie",
      role: "DEMO",
      mode: "demo",
      iat: now,
      exp: now + DEMO_SESSION_SECONDS,
    };
  }

  return null;
}

export function getSession(req: NextRequest): Session | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const session = verifySession(token);
    if (session) return session;
  }

  return getLegacySession(req);
}

export function requireRoles(req: NextRequest, allowed: Role[]) {
  const session = getSession(req);

  if (!session) {
    return {
      ok: false as const,
      status: 401,
      error: "Unauthorized",
      session: null,
    };
  }

  if (!allowed.includes(session.role)) {
    return {
      ok: false as const,
      status: 403,
      error: "Forbidden",
      session,
    };
  }

  return {
    ok: true as const,
    status: 200,
    error: null,
    session,
  };
}

export function requireAdmin(req: NextRequest) {
  return requireRoles(req, ["SUPER_ADMIN", "REVIEWER", "DEMO"]);
}
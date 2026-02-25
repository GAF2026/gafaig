// lib/auth/require.ts
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySession, type Role, type Session } from "./session";

/**
 * Back-compat: accept legacy cookie gafaig_admin=1 or gafaig_admin=demo
 * during transition. We'll remove this later.
 */
function getLegacySession(req: NextRequest): Session | null {
  const legacy = req.cookies.get("gafaig_admin")?.value;
  const now = Math.floor(Date.now() / 1000);
  if (legacy === "1") {
    return { sub: "legacy-admin", role: "SUPER_ADMIN", mode: "admin", iat: now, exp: now + 3600 };
  }
  if (legacy === "demo") {
    return { sub: "legacy-demo", role: "DEMO", mode: "demo", iat: now, exp: now + 3600 };
  }
  return null;
}

export function getSession(req: NextRequest): Session | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    const s = verifySession(token);
    if (s) return s;
  }
  return getLegacySession(req);
}

export function requireRoles(req: NextRequest, allowed: Role[]) {
  const session = getSession(req);
  if (!session) return { ok: false as const, status: 401, error: "Unauthorized", session: null };

  // DEMO can be allowed explicitly, otherwise it's not admin
  if (!allowed.includes(session.role)) {
    return { ok: false as const, status: 403, error: "Forbidden", session };
  }

  return { ok: true as const, status: 200, error: null, session };
}

export function requireAdmin(req: NextRequest) {
  // For now: SUPER_ADMIN and REVIEWER are "admin area" roles.
  // We'll add finer-grained control later.
  return requireRoles(req, ["SUPER_ADMIN", "REVIEWER", "DEMO"]);
}
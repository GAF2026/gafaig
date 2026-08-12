import type {
  NextRequest,
} from "next/server";

import {
  SESSION_COOKIE_NAME,
  verifySession,
  type Role,
  type Session,
} from "./session";

const DEMO_COOKIE_NAME =
  "gafaig_admin_demo";

const LEGACY_COOKIE_NAME =
  "gafaig_admin";

const DEMO_SESSION_SECONDS =
  60 * 60;

function nowEpoch(): number {
  return Math.floor(
    Date.now() / 1000,
  );
}

function legacyAuthAllowed():
  boolean {
  if (
    process.env.NODE_ENV ===
    "production"
  ) {
    return false;
  }

  return (
    String(
      process.env
        .GAFAIG_ALLOW_LEGACY_DEMO_AUTH ??
        "true",
    )
      .trim()
      .toLowerCase() !==
    "false"
  );
}

/**
 * Development-only compatibility.
 *
 * Production never accepts these
 * unsigned cookies as authentication.
 */
function getLegacySession(
  req: NextRequest,
): Session | null {
  if (
    !legacyAuthAllowed()
  ) {
    return null;
  }

  const now =
    nowEpoch();

  const legacy =
    req.cookies.get(
      LEGACY_COOKIE_NAME,
    )?.value;

  if (legacy === "1") {
    return {
      sub:
        "legacy-admin",

      role:
        "SUPER_ADMIN",

      mode:
        "admin",

      iat:
        now,

      exp:
        now +
        DEMO_SESSION_SECONDS,
    };
  }

  if (
    legacy === "demo"
  ) {
    return {
      sub:
        "legacy-demo",

      role:
        "DEMO",

      mode:
        "demo",

      iat:
        now,

      exp:
        now +
        DEMO_SESSION_SECONDS,
    };
  }

  const demoCookie =
    req.cookies.get(
      DEMO_COOKIE_NAME,
    )?.value;

  if (
    demoCookie === "1"
  ) {
    return {
      sub:
        "demo-cookie",

      role:
        "DEMO",

      mode:
        "demo",

      iat:
        now,

      exp:
        now +
        DEMO_SESSION_SECONDS,
    };
  }

  return null;
}

export function getSession(
  req: NextRequest,
): Session | null {
  const token =
    req.cookies.get(
      SESSION_COOKIE_NAME,
    )?.value;

  if (token) {
    const session =
      verifySession(token);

    if (session) {
      return session;
    }

    /*
     * A malformed or invalid signed
     * session must not fall through to
     * an unsigned production identity.
     */
    if (
      process.env.NODE_ENV ===
      "production"
    ) {
      return null;
    }
  }

  return getLegacySession(
    req,
  );
}

export function requireRoles(
  req: NextRequest,
  allowed: Role[],
) {
  const session =
    getSession(req);

  if (!session) {
    return {
      ok:
        false as const,

      status:
        401,

      error:
        "Unauthorized",

      session:
        null,
    };
  }

  if (
    !allowed.includes(
      session.role,
    )
  ) {
    return {
      ok:
        false as const,

      status:
        403,

      error:
        "Forbidden",

      session,
    };
  }

  return {
    ok:
      true as const,

    status:
      200,

    error:
      null,

    session,
  };
}

export function requireAdmin(
  req: NextRequest,
) {
  return requireRoles(
    req,
    [
      "SUPER_ADMIN",
      "REVIEWER",
      "DEMO",
    ],
  );
}
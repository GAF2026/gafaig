// lib/auth/admin.ts
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "gafaig_admin_demo";

/**
 * Current GAFAIG admin cookie values:
 * - "1" = demo/admin access during buildout
 *
 * Later this can expand to role values if needed.
 */
export type AdminCookieValue = "1";

/**
 * Read GAFAIG admin cookie from the request.
 */
export function getAdminCookie(req: NextRequest): string | null {
  const v = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return v ? String(v) : null;
}

/**
 * True if the cookie value is a recognized admin value.
 */
export function isAdminCookie(
  value: string | null | undefined
): value is AdminCookieValue {
  return value === "1";
}

/**
 * Read x-admin-password header robustly.
 */
export function getAdminPasswordHeader(req: NextRequest): string | null {
  for (const [key, value] of req.headers.entries()) {
    if (key.toLowerCase() === "x-admin-password") {
      return value ? String(value) : null;
    }
  }

  return null;
}

/**
 * True if request includes the configured admin password.
 */
export function isAdminPasswordRequest(req: NextRequest): boolean {
  const expected =
    process.env.GAFAIG_ADMIN_PASSWORD ||
    process.env.GAFAIG_ADMIN_DEMO_PASSWORD ||
    "";

  const supplied = getAdminPasswordHeader(req);

  return Boolean(expected) && supplied === expected;
}

/**
 * True if this request has admin access.
 */
export function isAdminRequest(req: NextRequest): boolean {
  return isAdminCookie(getAdminCookie(req)) || isAdminPasswordRequest(req);
}

/**
 * Use this in API routes or middleware when you want to gate endpoints.
 *
 * GAFAIG buildout accepts either:
 * - admin cookie value "1"
 * - x-admin-password header matching the configured env password
 */
export function requireAdmin(
  req: NextRequest,
  _allowDemo = true
): boolean {
  return isAdminRequest(req);
}
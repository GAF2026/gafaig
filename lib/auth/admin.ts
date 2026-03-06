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
 * Read GAFAIG admin cookie from the request (middleware + route handlers).
 */
export function getAdminCookie(req: NextRequest): string | null {
  const v = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return v ? String(v) : null;
}

/**
 * True if the cookie value is a recognized admin value.
 */
export function isAdminCookie(value: string | null | undefined): value is AdminCookieValue {
  return value === "1";
}

/**
 * True if this request has admin access.
 */
export function isAdminRequest(req: NextRequest): boolean {
  return isAdminCookie(getAdminCookie(req));
}

/**
 * Use this in API routes or middleware when you want to gate endpoints.
 * For now, GAFAIG buildout accepts only cookie value "1".
 */
export function requireAdmin(req: NextRequest, _allowDemo = true): boolean {
  const v = getAdminCookie(req);
  return v === "1";
}
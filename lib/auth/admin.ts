// lib/auth/admin.ts
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "gafaig_admin";

/**
 * For now GAFAIG uses a simple cookie value.
 * - "1"    = full admin access
 * - "demo" = demo/reviewer access (allowed for most admin endpoints during buildout)
 *
 * Later we can expand this to "reviewer" | "auditor" | etc.
 */
export type AdminCookieValue = "1" | "demo";

/**
 * Read GAFAIG admin cookie from the request (middleware + route handlers).
 */
export function getAdminCookie(req: NextRequest): string | null {
  const v = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return v ? String(v) : null;
}

/**
 * True if the cookie value is a recognized admin/demo value.
 */
export function isAdminCookie(value: string | null | undefined): value is AdminCookieValue {
  return value === "1" || value === "demo";
}

/**
 * True if this request has either admin ("1") or demo ("demo") access.
 */
export function isAdminRequest(req: NextRequest): boolean {
  return isAdminCookie(getAdminCookie(req));
}

/**
 * Use this in API routes when you want to gate endpoints:
 * - allowDemo=true  => accepts cookie "demo" and "1"
 * - allowDemo=false => accepts only "1"
 */
export function requireAdmin(req: NextRequest, allowDemo = true): boolean {
  const v = getAdminCookie(req);
  if (allowDemo) return v === "1" || v === "demo";
  return v === "1";
}
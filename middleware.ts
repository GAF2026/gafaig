// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

function isPublicAdminApi(pathname: string) {
  // Allow these without auth:
  // - login sets cookie
  // - logout clears cookie
  // - status can be useful for simple health/auth checks
  return (
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout" ||
    pathname === "/api/admin/status"
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin/* and /api/admin/*
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // Always allow the login page
  if (pathname === "/admin/login") return NextResponse.next();

  // Allow public admin API endpoints
  if (isAdminApi && isPublicAdminApi(pathname)) return NextResponse.next();

  // ✅ Single source of truth: requireAdmin()
  // For now we allow demo on all guarded surfaces.
  const ok = requireAdmin(req, true);

  if (ok) return NextResponse.next();

  // If API request: return 401 JSON
  if (isAdminApi) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized (missing admin cookie)" },
      { status: 401 }
    );
  }

  // If page request: redirect to login with ?next=
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname + (req.nextUrl.search || ""));
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
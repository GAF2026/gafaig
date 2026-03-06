// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "gafaig_admin_demo";
const ADMIN_COOKIE_VALUE = "1";

function isPublicAdminApi(pathname: string) {
  return (
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout" ||
    pathname === "/api/admin/status"
  );
}

function hasAdminCookie(req: NextRequest) {
  return req.cookies.get(ADMIN_COOKIE_NAME)?.value === ADMIN_COOKIE_VALUE;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // Public admin entry point
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Public admin API endpoints needed for login/logout/status
  if (isAdminApi && isPublicAdminApi(pathname)) {
    return NextResponse.next();
  }

  // Allow all guarded admin surfaces when demo cookie is present
  if (hasAdminCookie(req)) {
    return NextResponse.next();
  }

  // API requests should receive JSON instead of redirects
  if (isAdminApi) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Page requests redirect to login and preserve intended destination
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
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

function isApplicantPage(pathname: string) {
  return pathname.startsWith("/applicant");
}

function isApplicantApi(pathname: string) {
  return pathname.startsWith("/api/applicant");
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  const applicantPage = isApplicantPage(pathname);
  const applicantApi = isApplicantApi(pathname);

  if (!isAdminPage && !isAdminApi && !applicantPage && !applicantApi) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (isAdminApi && isPublicAdminApi(pathname)) {
    return NextResponse.next();
  }

  if (hasAdminCookie(req)) {
    return NextResponse.next();
  }

  if (isAdminApi || applicantApi) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname + search);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/applicant/:path*",
    "/api/applicant/:path*",
  ],
};
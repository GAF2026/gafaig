import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "gafaig_admin";

function isLoggedIn(req: NextRequest) {
  return req.cookies.get(COOKIE_NAME)?.value === "1";
}

// ✅ Next.js 16+ "proxy.ts" must export a function named `proxy` (or default export)
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Always allow the admin login page
  if (pathname === "/admin/login") return NextResponse.next();

  // Always allow auth endpoints to function
  if (pathname === "/api/admin/login") return NextResponse.next();
  if (pathname === "/api/admin/logout") return NextResponse.next();

  // Protect admin pages: redirect to login
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn(req)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect admin APIs: return 401 JSON
  if (pathname.startsWith("/api/admin")) {
    if (!isLoggedIn(req)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

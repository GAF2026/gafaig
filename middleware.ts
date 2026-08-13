import {
  NextResponse,
} from "next/server";

import type {
  NextRequest,
} from "next/server";

const SESSION_COOKIE_NAME =
  "gafaig_session";

const ADMIN_DEMO_COOKIE_NAME =
  "gafaig_admin_demo";

const ADMIN_DEMO_COOKIE_VALUE =
  "1";

function isPublicAdminApi(
  pathname: string,
): boolean {
  return (
    pathname ===
      "/api/admin/login" ||
    pathname ===
      "/api/admin/logout" ||
    pathname ===
      "/api/admin/status"
  );
}

function isPublicApplicantApi(
  pathname: string,
): boolean {
  return (
    pathname ===
    "/api/applicant/login"
  );
}

function isPublicApplicantPage(
  pathname: string,
): boolean {
  return (
    pathname ===
    "/applicant/login"
  );
}

function isApplicantPage(
  pathname: string,
): boolean {
  return pathname.startsWith(
    "/applicant",
  );
}

function isApplicantApi(
  pathname: string,
): boolean {
  return pathname.startsWith(
    "/api/applicant",
  );
}

function hasSignedSessionCookie(
  req: NextRequest,
): boolean {
  return Boolean(
    req.cookies.get(
      SESSION_COOKIE_NAME,
    )?.value,
  );
}

function legacyDemoAllowed():
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

function hasLegacyDemoCookie(
  req: NextRequest,
): boolean {
  if (
    !legacyDemoAllowed()
  ) {
    return false;
  }

  return (
    req.cookies.get(
      ADMIN_DEMO_COOKIE_NAME,
    )?.value ===
    ADMIN_DEMO_COOKIE_VALUE
  );
}

function nextWithApplicantPathname(
  req: NextRequest,
  pathname: string,
) {
  const requestHeaders =
    new Headers(
      req.headers,
    );

  requestHeaders.set(
    "x-gafaig-pathname",
    pathname,
  );

  return NextResponse.next({
    request: {
      headers:
        requestHeaders,
    },
  });
}

export function middleware(
  req: NextRequest,
) {
  const {
    pathname,
    search,
  } = req.nextUrl;

  const isAdminPage =
    pathname.startsWith(
      "/admin",
    );

  const isAdminApi =
    pathname.startsWith(
      "/api/admin",
    );

  const applicantPage =
    isApplicantPage(
      pathname,
    );

  const applicantApi =
    isApplicantApi(
      pathname,
    );

  if (
    !isAdminPage &&
    !isAdminApi &&
    !applicantPage &&
    !applicantApi
  ) {
    return NextResponse.next();
  }

  if (
    pathname ===
    "/admin/login"
  ) {
    return NextResponse.next();
  }

  if (
    isAdminApi &&
    isPublicAdminApi(
      pathname,
    )
  ) {
    return NextResponse.next();
  }

  if (
    applicantApi &&
    isPublicApplicantApi(
      pathname,
    )
  ) {
    return NextResponse.next();
  }

  if (
    applicantPage &&
    isPublicApplicantPage(
      pathname,
    )
  ) {
    return nextWithApplicantPathname(
      req,
      pathname,
    );
  }

  if (
    hasSignedSessionCookie(
      req,
    ) ||
    hasLegacyDemoCookie(
      req,
    )
  ) {
    if (
      applicantPage
    ) {
      return nextWithApplicantPathname(
        req,
        pathname,
      );
    }

    return NextResponse.next();
  }

  if (
    isAdminApi ||
    applicantApi
  ) {
    return NextResponse.json(
      {
        ok:
          false,

        error:
          "Unauthorized",
      },
      {
        status:
          401,
      },
    );
  }

  const loginUrl =
    req.nextUrl.clone();

  if (
    applicantPage
  ) {
    loginUrl.pathname =
      "/applicant/login";
  } else {
    loginUrl.pathname =
      "/admin/login";
  }

  loginUrl.searchParams.set(
    "next",
    pathname + search,
  );

  return NextResponse.redirect(
    loginUrl,
  );
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/applicant/:path*",
    "/api/applicant/:path*",
  ],
};
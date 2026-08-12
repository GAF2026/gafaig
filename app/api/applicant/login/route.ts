import crypto from "crypto";

import {
  NextResponse,
} from "next/server";

import {
  buildSession,
  SESSION_COOKIE_NAME,
  signSession,
} from "@/lib/auth/session";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const COOKIE_MAX_AGE_SECONDS =
  60 * 60 * 8;

function clean(
  value: unknown,
): string {
  return String(
    value ?? "",
  ).trim();
}

function timingSafeEqual(
  a: string,
  b: string,
): boolean {
  const left =
    Buffer.from(a);

  const right =
    Buffer.from(b);

  if (
    left.length !==
    right.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    left,
    right,
  );
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request
        .json()
        .catch(
          () => ({}),
        )) as {
        email?: unknown;
        password?: unknown;
      };

    const providedEmail =
      clean(
        body.email,
      ).toLowerCase();

    const providedPassword =
      clean(
        body.password,
      );

    if (
      !providedEmail ||
      !providedPassword
    ) {
      return NextResponse.json(
        {
          ok:
            false,

          error:
            "Email and password are required.",
        },
        {
          status:
            400,
        },
      );
    }

    const expectedEmail =
      clean(
        process.env
          .GAFAIG_APPLICANT_LOGIN_EMAIL,
      ).toLowerCase();

    const expectedPassword =
      clean(
        process.env
          .GAFAIG_APPLICANT_LOGIN_PASSWORD,
      );

    const organizationId =
      clean(
        process.env
          .GAFAIG_APPLICANT_ORG_ID,
      );

    const organizationName =
      clean(
        process.env
          .GAFAIG_APPLICANT_ORG_NAME,
      );

    if (
      !expectedEmail ||
      !expectedPassword ||
      !organizationId ||
      !organizationName
    ) {
      return NextResponse.json(
        {
          ok:
            false,

          error:
            "Applicant authentication is not configured.",
        },
        {
          status:
            500,
        },
      );
    }

    const emailMatches =
      timingSafeEqual(
        providedEmail,
        expectedEmail,
      );

    const passwordMatches =
      timingSafeEqual(
        providedPassword,
        expectedPassword,
      );

    if (
      !emailMatches ||
      !passwordMatches
    ) {
      return NextResponse.json(
        {
          ok:
            false,

          error:
            "Invalid credentials.",
        },
        {
          status:
            401,
        },
      );
    }

    const session =
      buildSession({
        sub:
          `APPLICANT-${organizationId}`,

        role:
          "ORG_USER",

        mode:
          "applicant",

        organizationId,

        organizationName,

        email:
          expectedEmail,

        ttlSeconds:
          COOKIE_MAX_AGE_SECONDS,
      });

    const token =
      signSession(
        session,
      );

    const isProd =
      process.env.NODE_ENV ===
      "production";

    const response =
      NextResponse.json({
        ok:
          true,

        applicant: {
          email:
            expectedEmail,

          organizationId,

          organizationName,
        },
      });

    response.cookies.set({
      name:
        SESSION_COOKIE_NAME,

      value:
        token,

      httpOnly:
        true,

      secure:
        isProd,

      sameSite:
        "lax",

      path:
        "/",

      maxAge:
        COOKIE_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok:
          false,

        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error",
      },
      {
        status:
          500,
      },
    );
  }
}
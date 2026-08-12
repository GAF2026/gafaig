import {
  cookies,
} from "next/headers";

import {
  SESSION_COOKIE_NAME,
  verifySession,
} from "@/lib/auth/session";

export type ApplicantSession = {
  userId: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
};

const ADMIN_COOKIE_NAME =
  "gafaig_admin_demo";

const ADMIN_COOKIE_VALUE =
  "1";

const APPLICANT_ORG_COOKIE_NAME =
  "gafaig_applicant_org";

const APPLICANT_EMAIL_COOKIE_NAME =
  "gafaig_applicant_email";

function clean(
  value: unknown,
): string {
  return String(
    value ?? "",
  ).trim();
}

function legacyApplicantAuthAllowed():
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

function signedApplicantSession():
  ApplicantSession | null {
  const cookieStore =
    cookies();

  const token =
    cookieStore.get(
      SESSION_COOKIE_NAME,
    )?.value;

  if (!token) {
    return null;
  }

  const session =
    verifySession(token);

  if (
    !session ||
    session.role !==
      "ORG_USER"
  ) {
    return null;
  }

  const organizationId =
    clean(
      session.organizationId,
    );

  const organizationName =
    clean(
      session.organizationName,
    );

  const email =
    clean(
      session.email,
    );

  const userId =
    clean(
      session.sub,
    );

  if (
    !userId ||
    !organizationId ||
    !organizationName ||
    !email
  ) {
    return null;
  }

  return {
    userId,
    email,
    role:
      "ORG_ADMIN",
    organizationId,
    organizationName,
  };
}

function legacyApplicantSession():
  ApplicantSession | null {
  if (
    !legacyApplicantAuthAllowed()
  ) {
    return null;
  }

  const cookieStore =
    cookies();

  const hasAdminDemoCookie =
    cookieStore.get(
      ADMIN_COOKIE_NAME,
    )?.value ===
    ADMIN_COOKIE_VALUE;

  if (
    !hasAdminDemoCookie
  ) {
    return null;
  }

  const cookieOrganizationName =
    clean(
      cookieStore.get(
        APPLICANT_ORG_COOKIE_NAME,
      )?.value,
    );

  const cookieEmail =
    clean(
      cookieStore.get(
        APPLICANT_EMAIL_COOKIE_NAME,
      )?.value,
    );

  const envOrganizationName =
    clean(
      process.env
        .GAFAIG_APPLICANT_DEMO_ORG_NAME,
    );

  const envEmail =
    clean(
      process.env
        .GAFAIG_APPLICANT_DEMO_EMAIL,
    );

  const organizationName =
    cookieOrganizationName ||
    envOrganizationName ||
    "Applicant Organization";

  const email =
    cookieEmail ||
    envEmail ||
    "applicant@gafaig.com";

  const organizationId =
    organizationName
      .toUpperCase()
      .replace(
        /[^A-Z0-9]+/g,
        "-",
      );

  return {
    userId:
      `APPLICANT-${organizationId}`,

    email,

    role:
      "ORG_ADMIN",

    organizationId,

    organizationName,
  };
}

export async function getApplicantSession():
  Promise<ApplicantSession | null> {
  const signed =
    signedApplicantSession();

  if (signed) {
    return signed;
  }

  return legacyApplicantSession();
}

export function requireApplicantOrgScope(
  session:
    ApplicantSession | null,
  organizationName:
    string | null | undefined,
): boolean {
  if (
    !session ||
    !organizationName
  ) {
    return false;
  }

  return (
    session.organizationName
      .trim()
      .toLowerCase() ===
    organizationName
      .trim()
      .toLowerCase()
  );
}
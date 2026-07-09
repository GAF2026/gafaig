import { cookies } from "next/headers";

export type ApplicantSession = {
  userId: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
};

const ADMIN_COOKIE_NAME = "gafaig_admin_demo";
const ADMIN_COOKIE_VALUE = "1";

const APPLICANT_ORG_COOKIE_NAME = "gafaig_applicant_org";
const APPLICANT_EMAIL_COOKIE_NAME = "gafaig_applicant_email";

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

export async function getApplicantSession(): Promise<ApplicantSession | null> {
  const cookieStore = cookies();

  const hasAdminDemoCookie =
    cookieStore.get(ADMIN_COOKIE_NAME)?.value === ADMIN_COOKIE_VALUE;

  if (!hasAdminDemoCookie) {
    return null;
  }

  const cookieOrganizationName = clean(
    cookieStore.get(APPLICANT_ORG_COOKIE_NAME)?.value,
  );

  const cookieEmail = clean(cookieStore.get(APPLICANT_EMAIL_COOKIE_NAME)?.value);

  const envOrganizationName = clean(process.env.GAFAIG_APPLICANT_DEMO_ORG_NAME);
  const envEmail = clean(process.env.GAFAIG_APPLICANT_DEMO_EMAIL);

  const organizationName =
    cookieOrganizationName || envOrganizationName || "Applicant Organization";

  const email = cookieEmail || envEmail || "applicant@gafaig.com";

  return {
    userId: `APPLICANT-${organizationName.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`,
    email,
    role: "ORG_ADMIN",
    organizationId: organizationName.toUpperCase().replace(/[^A-Z0-9]+/g, "-"),
    organizationName,
  };
}

export function requireApplicantOrgScope(
  session: ApplicantSession | null,
  organizationName: string | null | undefined,
): boolean {
  if (!session || !organizationName) {
    return false;
  }

  return (
    session.organizationName.trim().toLowerCase() ===
    organizationName.trim().toLowerCase()
  );
}
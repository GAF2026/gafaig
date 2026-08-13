import {
  headers,
} from "next/headers";

import {
  redirect,
} from "next/navigation";

import {
  getApplicantSession,
} from "@/lib/applicant-auth";

const APPLICANT_LOGIN_PATH =
  "/applicant/login";

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders =
    headers();

  const pathname =
    requestHeaders.get(
      "x-gafaig-pathname",
    );

  if (
    pathname ===
    APPLICANT_LOGIN_PATH
  ) {
    return <>{children}</>;
  }

  const session =
    await getApplicantSession();

  if (!session) {
    redirect(
      `${APPLICANT_LOGIN_PATH}?next=${encodeURIComponent(
        pathname &&
          pathname.startsWith(
            "/applicant",
          )
          ? pathname
          : "/applicant/dashboard",
      )}`,
    );
  }

  return <>{children}</>;
}
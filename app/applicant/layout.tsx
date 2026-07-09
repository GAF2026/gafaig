import { redirect } from "next/navigation";
import { getApplicantSession } from "@/lib/applicant-auth";

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getApplicantSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
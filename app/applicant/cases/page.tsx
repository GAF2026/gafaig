import { cookies, headers } from "next/headers";
import Link from "next/link";
import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantCasesResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  cases?: Array<{
    caseId: string;
    organizationName: string;
    email: string | null;
    status: string;
    stage: string;
    updatedAt: string | null;
  }>;
  error?: string;
};

async function getBaseUrl() {
  const h = await headers();

  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

async function getApplicantCases(): Promise<ApplicantCasesResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/cases`, {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
      },
    });

    const json = (await res.json()) as ApplicantCasesResponse;

    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Cases request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant cases.",
    };
  }
}

function isActiveStatus(status: string) {
  const normalized = status.trim().toUpperCase();

  return !["CLOSED", "COMPLETE", "COMPLETED", "ARCHIVED"].includes(normalized);
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-4 text-[32px] font-semibold leading-none tracking-tight text-black sm:text-[36px]">
        {value}
      </div>
    </div>
  );
}

function WorkflowCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
      <div className="mt-5">
        <PublicButtonLink href={href} variant="secondary" size="sm">
          {cta}
        </PublicButtonLink>
      </div>
    </div>
  );
}

export default async function ApplicantCasesPage() {
  const data = await getApplicantCases();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant cases unavailable"
            description="The applicant case list could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant case access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/dashboard" variant="primary">
                  Back to Dashboard
                </PublicButtonLink>
                <PublicButtonLink href="/admin/login" variant="secondary">
                  Return to Login
                </PublicButtonLink>
              </>
            }
          />
        </div>
      </main>
    );
  }

  const organizationName =
    data.organization?.organizationName || "Applicant Organization";

  const cases = data.cases || [];
  const activeCases = cases.filter((item) => isActiveStatus(item.status)).length;
  const pendingCases = cases.filter((item) =>
    item.status.toUpperCase().includes("PENDING"),
  ).length;

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant cases"
          description={`Organization-scoped applicant case visibility for ${organizationName}.`}
          secondaryDescription="Applicant case pages expose operational workflow visibility only. They do not create scoring authority, decision authority, certification authority, registry authority, publication authority, or verification authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/cases" variant="primary">
                Cases
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/dashboard" variant="secondary">
                Dashboard
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/progress" variant="secondary">
                Progress
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Case summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped case inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            These cases are limited to the applicant organization associated
            with the authenticated applicant session. Applicant users may view
            only their organization-scoped records.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <MetricCard label="Total Cases" value={cases.length} />
            <MetricCard label="Active Cases" value={activeCases} />
            <MetricCard label="Pending Cases" value={pendingCases} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Case activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant case records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Case activity shown here is read-only and scoped to the
                authenticated applicant organization. Open a case to view
                case-specific workflow counts and repository-aware progress.
              </p>
            </div>

            <PublicButtonLink href="/applicant/dashboard" variant="secondary">
              Back to dashboard
            </PublicButtonLink>
          </div>

          {cases.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant cases are currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                No organization-scoped applicant case records are visible for
                this applicant session.
              </p>
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white">
              <div className="grid grid-cols-6 border-b border-black/10 bg-black/[0.02] px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                <div>Case</div>
                <div>Organization</div>
                <div>Status</div>
                <div>Stage</div>
                <div>Updated</div>
                <div>Action</div>
              </div>

              <div className="divide-y divide-black/10">
                {cases.map((item) => (
                  <div
                    key={item.caseId}
                    className="grid grid-cols-6 gap-4 px-5 py-5 text-[14px] leading-7 text-black/75"
                  >
                    <div>
                      <div className="font-semibold text-black">
                        {item.caseId}
                      </div>
                      <div className="mt-1 text-black/55">
                        {item.email || "No contact email"}
                      </div>
                    </div>

                    <div>{item.organizationName || organizationName}</div>
                    <div>{item.status}</div>
                    <div>{item.stage}</div>
                    <div>{item.updatedAt || "—"}</div>
                    <div>
                      <Link
                        href={`/applicant/cases/${encodeURIComponent(
                          item.caseId,
                        )}`}
                        className="inline-flex rounded-full border border-black/10 bg-black px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-black/80"
                      >
                        View Case
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <WorkflowCard
            title="Information requests"
            body="Review applicant information requests and response status through the request repository."
            href="/applicant/requests"
            cta="Open requests"
          />
          <WorkflowCard
            title="Evidence upload"
            body="Submit and review applicant evidence through the evidence repository."
            href="/applicant/evidence"
            cta="Open evidence"
          />
          <WorkflowCard
            title="Review status"
            body="Track applicant review visibility through the review status surface."
            href="/applicant/review-status"
            cta="Open review"
          />
          <WorkflowCard
            title="Certification progress"
            body="Review certification lifecycle visibility through the certification repository."
            href="/applicant/certifications"
            cta="Open certifications"
          />
        </section>
      </div>
    </main>
  );
}
import { cookies, headers } from "next/headers";
import Link from "next/link";
import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type DashboardResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  metrics?: {
    activeCases: number;
    openRequests: number;
    pendingActions: number;
    activeCertifications: number;
    repositoryActivity: number;
    evidenceRecords: number;
    artifactRecords: number;
    requestResponseRecords: number;
    remediationRecords: number;
    certificationRecords: number;
  };
  recentCases?: Array<{
    caseId: string;
    applicationId: string | null;
    status: string;
    stage: string;
    updatedAt: string | null;
    evidenceRecords: number;
    artifactRecords: number;
    requestResponseRecords: number;
    remediationRecords: number;
    certificationRecords: number;
    repositoryActivity: number;
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

async function getDashboard(): Promise<DashboardResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/dashboard`, {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
      },
    });

    const json = (await res.json()) as DashboardResponse;

    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error:
        json.error || `Dashboard request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant dashboard.",
    };
  }
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

function RepositoryMetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[20px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function StatusCard({
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

function StatusLabel({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/65">
      {value}
    </span>
  );
}

export default async function ApplicantDashboardPage() {
  const data = await getDashboard();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant dashboard unavailable"
            description="The applicant dashboard could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/admin/login" variant="primary">
                  Return to Login
                </PublicButtonLink>
                <PublicButtonLink href="/" variant="secondary">
                  Back to GAFAIG
                </PublicButtonLink>
              </>
            }
          />
        </div>
      </main>
    );
  }

  const metrics = data.metrics || {
    activeCases: 0,
    openRequests: 0,
    pendingActions: 0,
    activeCertifications: 0,
    repositoryActivity: 0,
    evidenceRecords: 0,
    artifactRecords: 0,
    requestResponseRecords: 0,
    remediationRecords: 0,
    certificationRecords: 0,
  };

  const recentCases = data.recentCases || [];
  const organizationName =
    data.organization?.organizationName || "Applicant Organization";

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title={organizationName}
          description="Organization-scoped applicant access for cases, submissions, requests, evidence, artifacts, deficiencies, remediation, certification progress, review status, decision status, and workflow visibility."
          secondaryDescription="Applicant portal surfaces are operational workflow views only. They do not create certification authority, publication authority, registry authority, scoring authority, decision authority, or verification authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/dashboard" variant="primary">
                Dashboard
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/cases" variant="secondary">
                Cases
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/progress" variant="secondary">
                Progress
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/requests" variant="secondary">
                Requests
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Applicant workflow summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Current organization-scoped applicant activity
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            This dashboard summarizes applicant activity visible to the
            authenticated organization. Applicant users may only access records
            scoped to their organization.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <MetricCard label="Active Cases" value={metrics.activeCases} />
            <MetricCard label="Open Requests" value={metrics.openRequests} />
            <MetricCard label="Pending Actions" value={metrics.pendingActions} />
            <MetricCard
              label="Active Certifications"
              value={metrics.activeCertifications}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Repository maturity summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Persisted applicant repository activity
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Repository maturity signals summarize persisted applicant records
            where available. These counts are visibility signals only and do not
            mutate governance, scoring, decision, certification, publication, or
            registry authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
            <RepositoryMetricCard
              label="Repository Activity"
              value={metrics.repositoryActivity}
            />
            <RepositoryMetricCard
              label="Evidence Records"
              value={metrics.evidenceRecords}
            />
            <RepositoryMetricCard
              label="Artifact Records"
              value={metrics.artifactRecords}
            />
            <RepositoryMetricCard
              label="Request Responses"
              value={metrics.requestResponseRecords}
            />
            <RepositoryMetricCard
              label="Remediation Records"
              value={metrics.remediationRecords}
            />
            <RepositoryMetricCard
              label="Certification Records"
              value={metrics.certificationRecords}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Recent cases
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Organization-scoped applicant case activity
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Cases shown here are limited to the applicant organization
                associated with the authenticated applicant session and include
                repository-aware activity signals where available.
              </p>
            </div>

            <PublicButtonLink href="/applicant/cases" variant="secondary">
              View all cases
            </PublicButtonLink>
          </div>

          {recentCases.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant cases are currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                No organization-scoped applicant cases are currently visible for
                this applicant session.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {recentCases.map((item) => (
                <div
                  key={item.caseId}
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Case
                      </div>
                      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.caseId}
                      </div>
                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        {item.applicationId || "No application ID"} ·{" "}
                        {item.stage}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel value={item.status} />
                      <StatusLabel
                        value={
                          item.repositoryActivity > 0
                            ? "Repository Active"
                            : "Workflow Only"
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-5">
                    <RepositoryMetricCard
                      label="Evidence"
                      value={item.evidenceRecords}
                    />
                    <RepositoryMetricCard
                      label="Artifacts"
                      value={item.artifactRecords}
                    />
                    <RepositoryMetricCard
                      label="Responses"
                      value={item.requestResponseRecords}
                    />
                    <RepositoryMetricCard
                      label="Remediation"
                      value={item.remediationRecords}
                    />
                    <RepositoryMetricCard
                      label="Certification"
                      value={item.certificationRecords}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/applicant/cases/${encodeURIComponent(
                        item.caseId,
                      )}`}
                      className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                    >
                      Open Case
                    </Link>

                    <Link
                      href={`/applicant/requests/${encodeURIComponent(
                        item.caseId,
                      )}`}
                      className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                    >
                      Open Request
                    </Link>

                    <Link
                      href={`/applicant/evidence/${encodeURIComponent(
                        `EV-${item.caseId}`,
                      )}`}
                      className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                    >
                      Open Evidence
                    </Link>

                    <Link
                      href={`/applicant/certifications/${encodeURIComponent(
                        `CERT-${item.caseId}`,
                      )}`}
                      className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                    >
                      Open Certification
                    </Link>
                  </div>

                  <p className="mt-4 text-[13px] leading-6 text-black/55">
                    Last updated: {item.updatedAt || "No recent update"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-3">
          <StatusCard
            title="Applicant cases"
            body="Review organization-scoped applicant cases, case status, and repository-aware lifecycle visibility."
            href="/applicant/cases"
            cta="Open cases"
          />
          <StatusCard
            title="Evidence and artifacts"
            body="Review submitted evidence, upload applicant evidence, and inspect artifact repository visibility."
            href="/applicant/evidence"
            cta="Open evidence"
          />
          <StatusCard
            title="Certification progress"
            body="Review certification repository visibility, lifecycle status, and applicant progress."
            href="/applicant/certifications"
            cta="Open certifications"
          />
          <StatusCard
            title="Requests"
            body="Review applicant information requests and submit request responses where available."
            href="/applicant/requests"
            cta="Open requests"
          />
          <StatusCard
            title="Deficiencies and remediation"
            body="Review deficiency visibility and submit remediation responses where required."
            href="/applicant/deficiencies"
            cta="Open deficiencies"
          />
          <StatusCard
            title="Review and decision status"
            body="Review applicant-facing governance review status and decision status visibility."
            href="/applicant/review-status"
            cta="Open review"
          />
        </section>
      </div>
    </main>
  );
}
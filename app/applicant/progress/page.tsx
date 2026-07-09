import { cookies, headers } from "next/headers";
import Link from "next/link";
import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantProgressResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalCases: number;
    activeCases: number;
    openRequests: number;
    pendingEvidence: number;
    pendingArtifacts: number;
    averageCompletion: number;
  };
  stages?: Array<{
    stage: string;
    status: string;
    description: string;
  }>;
  progress?: Array<{
    caseId: string;
    requestId: string;
    evidenceId: string;
    artifactId: string;
    certificationId: string;
    organizationName: string;
    email: string | null;
    status: string;
    source: string;
    lifecycleStage: string;
    completionPercent: number;
    openRequests: number;
    pendingEvidence: number;
    pendingArtifacts: number;
    certificationStatus: string;
    evidenceRecords: number;
    artifactRecords: number;
    requestResponseRecords: number;
    remediationRecords: number;
    certificationRecords: number;
    repositoryRecord: boolean;
    updatedAt: string | null;
  }>;
  error?: string;
};

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

async function getApplicantProgress(): Promise<ApplicantProgressResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/progress`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    const json = (await res.json()) as ApplicantProgressResponse;
    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Progress request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant progress.",
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
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[18px] font-semibold leading-none tracking-tight text-black">
        {value}
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

function StageCard({
  stage,
  status,
  description,
}: {
  stage: string;
  status: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {status}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
        {stage}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">
        {description}
      </p>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        <span>Completion</span>
        <span>{safeValue}%</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full border border-black/10 bg-black/[0.04]">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

export default async function ApplicantProgressPage() {
  const data = await getApplicantProgress();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant progress unavailable"
            description="The applicant progress view could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant progress access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/dashboard" variant="primary">
                  Dashboard
                </PublicButtonLink>
                <PublicButtonLink
                  href="/applicant/certifications"
                  variant="secondary"
                >
                  Certifications
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

  const summary = data.summary || {
    totalCases: 0,
    activeCases: 0,
    openRequests: 0,
    pendingEvidence: 0,
    pendingArtifacts: 0,
    averageCompletion: 0,
  };

  const stages = data.stages || [];
  const progress = data.progress || [];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant progress"
          description={`Organization-scoped applicant lifecycle progress for ${organizationName}.`}
          secondaryDescription="Applicant progress pages expose lifecycle visibility only. They do not create evidence authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or governance authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/progress" variant="primary">
                Progress
              </PublicButtonLink>
              <PublicButtonLink
                href="/applicant/certifications"
                variant="secondary"
              >
                Certifications
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/artifacts" variant="secondary">
                Artifacts
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/cases" variant="secondary">
                Cases
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Progress summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped applicant lifecycle progress
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            This view aggregates applicant cases, requests, evidence,
            artifacts, remediation, and certification repository visibility into
            a single applicant progress surface for the authenticated
            organization.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <MetricCard label="Total Cases" value={summary.totalCases} />
            <MetricCard label="Active Cases" value={summary.activeCases} />
            <MetricCard label="Open Requests" value={summary.openRequests} />
            <MetricCard label="Pending Evidence" value={summary.pendingEvidence} />
            <MetricCard label="Pending Artifacts" value={summary.pendingArtifacts} />
            <MetricCard
              label="Average Completion"
              value={summary.averageCompletion}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Lifecycle stages
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant lifecycle stage visibility
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Lifecycle stages summarize applicant-facing progress only. They do
            not alter request state, evidence state, artifact state,
            certification state, decision state, registry state, or governance
            authority.
          </p>

          {stages.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No lifecycle stages are currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Lifecycle stages will appear here when progress records are
                available.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
              {stages.map((item) => (
                <StageCard
                  key={`${item.stage}-${item.status}`}
                  stage={item.stage}
                  status={item.status}
                  description={item.description}
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Case progress
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant progress records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Progress records connect applicant cases to request, evidence,
                artifact, remediation, and certification repository visibility.
              </p>
            </div>

            <PublicButtonLink href="/applicant/cases" variant="secondary">
              Back to cases
            </PublicButtonLink>
          </div>

          {progress.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant progress records are currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                No organization-scoped applicant progress records are visible
                for this applicant session.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {progress.map((item) => (
                <div
                  key={item.caseId}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Progress Record
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.caseId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        {item.lifecycleStage} · {item.source}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-black/70">
                        {item.email || "No contact email"} ·{" "}
                        {item.updatedAt || "No recent update"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel value={item.status} />
                      <StatusLabel value={item.certificationStatus} />
                      <StatusLabel
                        value={
                          item.repositoryRecord
                            ? "Repository Record"
                            : "Workflow Only"
                        }
                      />
                    </div>
                  </div>

                  <ProgressBar value={item.completionPercent} />

                  <div className="mt-6 rounded-3xl border border-black/10 bg-black/[0.01] p-5">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                      Repository maturity signals
                    </div>

                    <p className="mt-3 text-[14px] leading-7 text-black/70">
                      These counts are derived from persisted repository records
                      where available and are displayed for applicant lifecycle
                      visibility only.
                    </p>

                    <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
                      <RepositoryMetricCard
                        label="Evidence Records"
                        value={item.evidenceRecords}
                      />
                      <RepositoryMetricCard
                        label="Artifact Records"
                        value={item.artifactRecords}
                      />
                      <RepositoryMetricCard
                        label="Request Responses"
                        value={item.requestResponseRecords}
                      />
                      <RepositoryMetricCard
                        label="Remediation Records"
                        value={item.remediationRecords}
                      />
                      <RepositoryMetricCard
                        label="Certification Records"
                        value={item.certificationRecords}
                      />
                      <RepositoryMetricCard
                        label="Repository Record"
                        value={item.repositoryRecord ? "Yes" : "No"}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-4">
                    <Link
                      href={`/applicant/cases/${encodeURIComponent(item.caseId)}`}
                      className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 transition hover:bg-black/[0.04]"
                    >
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Case
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        Open case
                      </div>
                    </Link>

                    <Link
                      href={`/applicant/requests/${encodeURIComponent(
                        item.requestId,
                      )}`}
                      className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 transition hover:bg-black/[0.04]"
                    >
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Request
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        Open request
                      </div>
                    </Link>

                    <Link
                      href={`/applicant/evidence/${encodeURIComponent(
                        item.evidenceId,
                      )}`}
                      className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 transition hover:bg-black/[0.04]"
                    >
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Evidence
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        Open evidence
                      </div>
                    </Link>

                    <Link
                      href={`/applicant/certifications/${encodeURIComponent(
                        item.certificationId,
                      )}`}
                      className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 transition hover:bg-black/[0.04]"
                    >
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Certification
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        Open certification
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
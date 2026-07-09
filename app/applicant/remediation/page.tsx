import { cookies, headers } from "next/headers";
import Link from "next/link";

import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantRemediationResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalRemediationRecords: number;
    remediationRequired: number;
    remediationInProgress: number;
    awaitingReview: number;
    completed: number;
    submitted?: number;
  };
  remediation?: Array<{
    remediationId: string;
    evidenceId: string | null;
    deficiencyId: string;
    caseId: string;
    requestId: string;
    organizationName: string;
    email: string | null;
    submittedBy: string | null;
    remediationType: string;
    remediationStatus: string;
    caseStatus: string;
    source: string;
    title: string | null;
    description: string | null;
    sourceUrl: string | null;
    responseSubmitted: boolean;
    reviewPending: boolean;
    governanceDecisionPending: boolean;
    submittedAt: string | null;
    reviewedAt: string | null;
    updatedAt: string | null;
  }>;
  error?: string;
};

async function getBaseUrl() {
  const h = await headers();

  const host =
    h.get("x-forwarded-host") ??
    h.get("host");

  const proto =
    h.get("x-forwarded-proto") ??
    "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

async function getRemediation(): Promise<ApplicantRemediationResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map(
      (cookie) =>
        `${cookie.name}=${cookie.value}`,
    )
    .join("; ");

  try {
    const res = await fetch(
      `${baseUrl}/api/applicant/remediation`,
      {
        cache: "no-store",
        headers: {
          cookie: cookieHeader,
        },
      },
    );

    const json =
      (await res.json()) as ApplicantRemediationResponse;

    if (res.ok && json.ok) {
      return json;
    }

    return {
      ok: false,
      error:
        json.error ??
        `Remediation request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load remediation records.",
    };
  }
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
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

function StatusLabel({
  value,
}: {
  value: string;
}) {
  return (
    <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/65">
      {value}
    </span>
  );
}

function WorkflowCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>

      <p className="mt-3 text-[14px] leading-7 text-black/70">
        {body}
      </p>
    </div>
  );
}

export default async function ApplicantRemediationPage() {
  const data =
    await getRemediation();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant remediation unavailable"
          description="The remediation workflow could not be loaded."
          secondaryDescription={
            data.error ??
            "Applicant remediation access is available only for authenticated organization-scoped users."
          }
          actions={
            <>
              <PublicButtonLink
                href="/applicant/dashboard"
                variant="primary"
              >
                Dashboard
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/deficiencies"
                variant="secondary"
              >
                Deficiencies
              </PublicButtonLink>
            </>
          }
        />
      </main>
    );
  }

  const organizationName =
    data.organization
      ?.organizationName ??
    "Applicant Organization";

  const summary =
    data.summary ?? {
      totalRemediationRecords: 0,
      remediationRequired: 0,
      remediationInProgress: 0,
      awaitingReview: 0,
      completed: 0,
      submitted: 0,
    };

  const remediation =
    data.remediation ?? [];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant remediation"
          description={`Organization-scoped remediation visibility for ${organizationName}.`}
          secondaryDescription="Applicant remediation pages expose workflow visibility and submitted remediation records only. They do not create findings authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or governance authority."
          actions={
            <>
              <PublicButtonLink
                href="/applicant/remediation"
                variant="primary"
              >
                Remediation
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/remediation/submit"
                variant="secondary"
              >
                Submit Remediation
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/deficiencies"
                variant="secondary"
              >
                Deficiencies
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/progress"
                variant="secondary"
              >
                Progress
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/cases"
                variant="secondary"
              >
                Cases
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Remediation Summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped remediation inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Remediation records shown here
            are scoped to the authenticated
            applicant organization and
            provide visibility into the
            applicant remediation lifecycle.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-6">
            <MetricCard
              label="Total"
              value={
                summary.totalRemediationRecords
              }
            />

            <MetricCard
              label="Required"
              value={
                summary.remediationRequired
              }
            />

            <MetricCard
              label="In Progress"
              value={
                summary.remediationInProgress
              }
            />

            <MetricCard
              label="Awaiting Review"
              value={
                summary.awaitingReview
              }
            />

            <MetricCard
              label="Completed"
              value={summary.completed}
            />

            <MetricCard
              label="Submitted"
              value={summary.submitted ?? 0}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Remediation Activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant remediation records
              </h2>
            </div>

            <PublicButtonLink
              href="/applicant/deficiencies"
              variant="secondary"
            >
              Back to Deficiencies
            </PublicButtonLink>
          </div>

          {remediation.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
              <div className="text-lg font-semibold text-black">
                No remediation records available
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                No organization-scoped remediation
                records are currently visible.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {remediation.map(
                (item) => (
                  <Link
                    key={
                      item.remediationId
                    }
                    href={`/applicant/remediation/${encodeURIComponent(
                      item.remediationId,
                    )}`}
                    className="block rounded-3xl border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                          Remediation
                        </div>

                        <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                          {
                            item.remediationId
                          }
                        </h3>

                        {item.title && (
                          <p className="mt-3 text-[15px] font-medium text-black">
                            {item.title}
                          </p>
                        )}

                        <p className="mt-3 text-[14px] leading-7 text-black/70">
                          Case{" "}
                          {
                            item.caseId
                          }{" "}
                          · Deficiency{" "}
                          {
                            item.deficiencyId
                          }
                        </p>

                        {item.description && (
                          <p className="mt-2 text-[14px] leading-7 text-black/70">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <StatusLabel
                          value={
                            item.remediationStatus
                          }
                        />

                        {item.reviewPending && (
                          <StatusLabel value="AWAITING_REVIEW" />
                        )}

                        {item.responseSubmitted && (
                          <StatusLabel value="SUBMITTED" />
                        )}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-5">
                      <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                          Response Submitted
                        </div>

                        <div className="mt-3 text-[14px] leading-7 text-black/75">
                          {item.responseSubmitted
                            ? "YES"
                            : "NO"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                          Review Pending
                        </div>

                        <div className="mt-3 text-[14px] leading-7 text-black/75">
                          {item.reviewPending
                            ? "YES"
                            : "NO"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                          Governance Decision
                        </div>

                        <div className="mt-3 text-[14px] leading-7 text-black/75">
                          {item.governanceDecisionPending
                            ? "PENDING"
                            : "N/A"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                          Updated
                        </div>

                        <div className="mt-3 text-[14px] leading-7 text-black/75">
                          {item.updatedAt ??
                            "No update"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                          Submitted
                        </div>

                        <div className="mt-3 text-[14px] leading-7 text-black/75">
                          {item.submittedAt ??
                            "Not submitted"}
                        </div>
                      </div>
                    </div>

                    {(item.evidenceId ||
                      item.submittedBy ||
                      item.sourceUrl) && (
                      <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
                        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                            Evidence ID
                          </div>

                          <div className="mt-3 break-words text-[14px] leading-7 text-black/75">
                            {item.evidenceId ??
                              "Not available"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                            Submitted By
                          </div>

                          <div className="mt-3 break-words text-[14px] leading-7 text-black/75">
                            {item.submittedBy ??
                              "Not available"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                            Source URL
                          </div>

                          <div className="mt-3 break-words text-[14px] leading-7 text-black/75">
                            {item.sourceUrl ??
                              "Not provided"}
                          </div>
                        </div>
                      </div>
                    )}
                  </Link>
                ),
              )}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <WorkflowCard
            title="Response Submission"
            body="Applicant remediation responses are stored as submitted remediation evidence linked to case and deficiency context."
          />

          <WorkflowCard
            title="Governance Review"
            body="Governance review remains separate from applicant remediation visibility."
          />

          <WorkflowCard
            title="Decision Tracking"
            body="Decision status visibility remains separate from applicant remediation submission."
          />

          <WorkflowCard
            title="Certification Impact"
            body="Accepted remediation may contribute to certification readiness after governance review."
          />
        </section>
      </div>
    </main>
  );
}
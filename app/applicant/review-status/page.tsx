import { cookies, headers } from "next/headers";
import Link from "next/link";

import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantReviewStatusResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalReviews: number;
    underReview: number;
    awaitingReview: number;
    completed: number;
    remediationRequired: number;
  };
  reviews?: Array<{
    reviewId: string;
    caseId: string;
    requestId: string;
    organizationName: string;
    email: string | null;
    reviewStatus: string;
    caseStatus: string;
    source: string;
    reviewerType: string;
    reviewStage: string;
    reviewStartedAt: string | null;
    estimatedCompletionAt: string | null;
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

async function getReviewStatus(): Promise<ApplicantReviewStatusResponse> {
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
      `${baseUrl}/api/applicant/review-status`,
      {
        cache: "no-store",
        headers: {
          cookie: cookieHeader,
        },
      },
    );

    const json =
      (await res.json()) as ApplicantReviewStatusResponse;

    if (res.ok && json.ok) {
      return json;
    }

    return {
      ok: false,
      error:
        json.error ??
        `Review status request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load review status.",
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

export default async function ApplicantReviewStatusPage() {
  const data =
    await getReviewStatus();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Review status unavailable"
          description="The governance review status view could not be loaded."
          secondaryDescription={
            data.error ??
            "Review status access is available only for authenticated organization-scoped users."
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
                href="/applicant/remediation"
                variant="secondary"
              >
                Remediation
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
      totalReviews: 0,
      underReview: 0,
      awaitingReview: 0,
      completed: 0,
      remediationRequired: 0,
    };

  const reviews =
    data.reviews ?? [];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG GOVERNANCE REVIEW"
          title="Review status"
          description={`Organization-scoped governance review visibility for ${organizationName}.`}
          secondaryDescription="Review status pages provide applicant visibility into governance review progression. They do not create governance authority, findings authority, scoring authority, decision authority, certification authority, publication authority, or registry authority."
          actions={
            <>
              <PublicButtonLink
                href="/applicant/review-status"
                variant="primary"
              >
                Review Status
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/remediation"
                variant="secondary"
              >
                Remediation
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
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Review Summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Governance review inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Governance review visibility provides
            applicants with transparency into the
            current evaluation lifecycle without
            exposing governance decision controls.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-5">
            <MetricCard
              label="Total Reviews"
              value={summary.totalReviews}
            />

            <MetricCard
              label="Under Review"
              value={summary.underReview}
            />

            <MetricCard
              label="Awaiting Review"
              value={summary.awaitingReview}
            />

            <MetricCard
              label="Completed"
              value={summary.completed}
            />

            <MetricCard
              label="Remediation Required"
              value={summary.remediationRequired}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Governance Review Activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Review status records
              </h2>
            </div>

            <PublicButtonLink
              href="/applicant/progress"
              variant="secondary"
            >
              Back to Progress
            </PublicButtonLink>
          </div>

          {reviews.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
              <div className="text-lg font-semibold text-black">
                No review records available
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                No organization-scoped review
                records are currently visible.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {reviews.map((item) => (
                <div
                  key={item.reviewId}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Review Record
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.reviewId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        Case {item.caseId}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-black/70">
                        {item.reviewStage}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel
                        value={item.reviewStatus}
                      />

                      <StatusLabel
                        value={item.caseStatus}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Reviewer
                      </div>

                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.reviewerType}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Started
                      </div>

                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.reviewStartedAt ??
                          "Not Available"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Estimated Completion
                      </div>

                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.estimatedCompletionAt ??
                          "Not Available"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Updated
                      </div>

                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.updatedAt ??
                          "No Update"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/applicant/cases/${encodeURIComponent(
                        item.caseId,
                      )}`}
                      className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                    >
                      Open Case
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <WorkflowCard
            title="Governance Intake"
            body="Applications enter governance evaluation after applicant submission readiness is achieved."
          />

          <WorkflowCard
            title="Review Evaluation"
            body="Governance reviewers evaluate evidence, findings, and applicant responses."
          />

          <WorkflowCard
            title="Remediation Cycle"
            body="Deficiencies may trigger remediation workflows before review completion."
          />

          <WorkflowCard
            title="Decision Readiness"
            body="Completed governance reviews become candidates for formal decision determination."
          />
        </section>
      </div>
    </main>
  );
}
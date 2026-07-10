import { cookies, headers } from "next/headers";
import Link from "next/link";

import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantRemediationRecord = {
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
  repositoryCategory?: string;
  workflowOrigin?: string;
  workflowStage?: string;
  remediationReadiness?: string;
  repositoryHealth?: string;
  ageDays?: number | null;
  isOpen?: boolean;
  isCompleted?: boolean;
  isPendingApplicant?: boolean;
  isPendingReview?: boolean;
  authorityBoundaryText?: string;
};

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
  remediation?: ApplicantRemediationRecord[];
  error?: string;
};

type PageProps = {
  searchParams?: Promise<
    Record<string, string | string[] | undefined>
  >;
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

function firstParam(
  value: string | string[] | undefined,
) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

function normalize(
  value: string | null | undefined,
) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function matchesFilter(
  item: ApplicantRemediationRecord,
  filters: {
    q: string;
    remediationStatus: string;
    remediationType: string;
    record: string;
    pendingReview: string;
  },
) {
  const q = normalize(filters.q);
  const status = normalize(
    filters.remediationStatus,
  );
  const type = normalize(
    filters.remediationType,
  );
  const record = normalize(
    filters.record,
  );
  const pendingReview = normalize(
    filters.pendingReview,
  );

  const searchable = [
    item.remediationId,
    item.evidenceId,
    item.deficiencyId,
    item.caseId,
    item.requestId,
    item.organizationName,
    item.email,
    item.submittedBy,
    item.remediationType,
    item.remediationStatus,
    item.caseStatus,
    item.source,
    item.title,
    item.description,
    item.sourceUrl,
    item.workflowOrigin,
    item.workflowStage,
    item.remediationReadiness,
    item.repositoryHealth,
  ]
    .map((value) => normalize(value))
    .join(" ");

  if (q && !searchable.includes(q)) {
    return false;
  }

  if (
    status &&
    normalize(item.remediationStatus) !== status
  ) {
    return false;
  }

  if (
    type &&
    normalize(item.remediationType) !== type
  ) {
    return false;
  }

  if (record === "open" && !item.isOpen) {
    return false;
  }

  if (
    record === "completed" &&
    !item.isCompleted
  ) {
    return false;
  }

  const itemPendingReview =
    item.isPendingReview ??
    item.reviewPending;

  if (
    pendingReview === "yes" &&
    !itemPendingReview
  ) {
    return false;
  }

  if (
    pendingReview === "no" &&
    itemPendingReview
  ) {
    return false;
  }

  return true;
}

function uniqueValues(
  items: ApplicantRemediationRecord[],
  key: keyof ApplicantRemediationRecord,
) {
  return Array.from(
    new Set(
      items
        .map((item) => item[key])
        .filter(
          (value): value is string =>
            typeof value === "string" &&
            value.trim().length > 0,
        ),
    ),
  ).sort((a, b) => a.localeCompare(b));
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

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>

      <div className="mt-3 break-words text-[14px] leading-7 text-black/75">
        {value}
      </div>
    </div>
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

function ageLabel(
  value: number | null | undefined,
) {
  if (typeof value !== "number") {
    return "Unavailable";
  }

  return `${value} day${value === 1 ? "" : "s"}`;
}

function yesNo(
  value: boolean | undefined,
) {
  return value ? "YES" : "NO";
}

export default async function ApplicantRemediationPage({
  searchParams,
}: PageProps) {
  const params =
    (await searchParams) ?? {};

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

  const filters = {
    q: firstParam(params.q),
    remediationStatus: firstParam(
      params.remediationStatus,
    ),
    remediationType: firstParam(
      params.remediationType,
    ),
    record: firstParam(params.record),
    pendingReview: firstParam(
      params.pendingReview,
    ),
  };

  const filteredRemediation =
    remediation.filter((item) =>
      matchesFilter(item, filters),
    );

  const statusOptions =
    uniqueValues(
      remediation,
      "remediationStatus",
    );

  const typeOptions =
    uniqueValues(
      remediation,
      "remediationType",
    );

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant remediation"
          description={`Organization-scoped remediation visibility for ${organizationName}.`}
          secondaryDescription="Applicant remediation pages expose repository visibility, workflow visibility, lifecycle visibility, and submitted remediation records only. They do not create findings authority, scoring authority, decision authority, certification authority, registry authority, publication authority, verification authority, or governance authority."
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
            Remediation records shown here are scoped
            to the authenticated applicant organization
            and provide visibility into applicant
            remediation submission, review readiness,
            workflow status, and repository health.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4 xl:grid-cols-7">
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

            <MetricCard
              label="Filtered Results"
              value={filteredRemediation.length}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Repository Filters
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Search and filter remediation records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Filters operate on organization-scoped
                remediation records already returned by
                the Snowflake-backed applicant API.
              </p>
            </div>

            <PublicButtonLink
              href="/applicant/remediation"
              variant="secondary"
            >
              Clear Filters
            </PublicButtonLink>
          </div>

          <form
            action="/applicant/remediation"
            method="get"
            className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5"
          >
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Search remediation, case, deficiency, evidence, title"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-2 xl:col-span-2"
            />

            <select
              name="remediationStatus"
              defaultValue={
                filters.remediationStatus
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">
                All statuses
              </option>

              {statusOptions.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ),
              )}
            </select>

            <select
              name="remediationType"
              defaultValue={
                filters.remediationType
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">
                All remediation types
              </option>

              {typeOptions.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ),
              )}
            </select>

            <select
              name="record"
              defaultValue={filters.record}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">
                All records
              </option>
              <option value="open">
                Open only
              </option>
              <option value="completed">
                Completed only
              </option>
            </select>

            <select
              name="pendingReview"
              defaultValue={
                filters.pendingReview
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-1 xl:col-span-4"
            >
              <option value="">
                All review states
              </option>
              <option value="yes">
                Pending review
              </option>
              <option value="no">
                Not pending review
              </option>
            </select>

            <button
              type="submit"
              className="rounded-2xl border border-black bg-black px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-black/80"
            >
              Apply Filters
            </button>
          </form>
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

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Remediation records combine applicant
                workflow context with persisted
                remediation submissions while preserving
                separate governance review and decision
                authority.
              </p>
            </div>

            <PublicButtonLink
              href="/applicant/deficiencies"
              variant="secondary"
            >
              Back to Deficiencies
            </PublicButtonLink>
          </div>

          {filteredRemediation.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
              <div className="text-lg font-semibold text-black">
                No remediation records match the current filters
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                Clear the filters or review another
                organization-scoped remediation state.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {filteredRemediation.map(
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
                          {item.repositoryCategory ??
                            "Remediation Repository"}
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

                        {(
                          item.isPendingReview ??
                          item.reviewPending
                        ) && (
                          <StatusLabel value="AWAITING_REVIEW" />
                        )}

                        {item.responseSubmitted && (
                          <StatusLabel value="SUBMITTED" />
                        )}

                        {item.repositoryHealth && (
                          <StatusLabel
                            value={
                              item.repositoryHealth
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-5">
                      <InfoCard
                        label="Response Submitted"
                        value={
                          item.responseSubmitted
                            ? "YES"
                            : "NO"
                        }
                      />

                      <InfoCard
                        label="Review Pending"
                        value={
                          item.reviewPending
                            ? "YES"
                            : "NO"
                        }
                      />

                      <InfoCard
                        label="Governance Decision"
                        value={
                          item.governanceDecisionPending
                            ? "PENDING"
                            : "N/A"
                        }
                      />

                      <InfoCard
                        label="Updated"
                        value={
                          item.updatedAt ??
                          "No update"
                        }
                      />

                      <InfoCard
                        label="Submitted"
                        value={
                          item.submittedAt ??
                          "Not submitted"
                        }
                      />
                    </div>

                    <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-4">
                      <InfoCard
                        label="Repository Category"
                        value={
                          item.repositoryCategory ??
                          "Remediation Repository"
                        }
                      />

                      <InfoCard
                        label="Workflow Origin"
                        value={
                          item.workflowOrigin ??
                          "Applicant Workflow"
                        }
                      />

                      <InfoCard
                        label="Workflow Stage"
                        value={
                          item.workflowStage ??
                          "REMEDIATION"
                        }
                      />

                      <InfoCard
                        label="Remediation Readiness"
                        value={
                          item.remediationReadiness ??
                          "Not classified"
                        }
                      />

                      <InfoCard
                        label="Repository Health"
                        value={
                          item.repositoryHealth ??
                          "Not classified"
                        }
                      />

                      <InfoCard
                        label="Age"
                        value={ageLabel(
                          item.ageDays,
                        )}
                      />

                      <InfoCard
                        label="Pending Applicant"
                        value={yesNo(
                          item.isPendingApplicant,
                        )}
                      />

                      <InfoCard
                        label="Pending Review"
                        value={yesNo(
                          item.isPendingReview ??
                            item.reviewPending,
                        )}
                      />
                    </div>

                    {(item.evidenceId ||
                      item.submittedBy ||
                      item.sourceUrl) && (
                      <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
                        <InfoCard
                          label="Evidence ID"
                          value={
                            item.evidenceId ??
                            "Not available"
                          }
                        />

                        <InfoCard
                          label="Submitted By"
                          value={
                            item.submittedBy ??
                            "Not available"
                          }
                        />

                        <InfoCard
                          label="Source URL"
                          value={
                            item.sourceUrl ??
                            "Not provided"
                          }
                        />
                      </div>
                    )}

                    <p className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[13px] leading-6 text-black/65">
                      {item.authorityBoundaryText ??
                        "Operational remediation repository visibility and applicant remediation submission only. No findings, scoring, decision, certification, registry, publication, verification, or governance authority is created."}
                    </p>
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
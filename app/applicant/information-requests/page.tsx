import { cookies, headers } from "next/headers";
import Link from "next/link";
import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type InformationRequestRecord = {
  requestId: string;
  caseId: string;
  organizationName: string;
  contactEmail: string | null;
  requestType: string;
  requestStatus: string;
  caseStatus: string;
  source: string;
  updatedAt: string | null;
  repositoryCategory?: string;
  workflowOrigin?: string;
  workflowStage?: string;
  responseReadiness?: string;
  repositoryHealth?: string;
  ageDays?: number | null;
  isOpen?: boolean;
  isCompleted?: boolean;
  isPendingApplicant?: boolean;
  isPendingReview?: boolean;
  isDeficiencyRelated?: boolean;
  authorityBoundaryText?: string;
};

type InformationRequestResponse = {
  ok: boolean;
  summary?: {
    totalRequests: number;
    openRequests: number;
    deficiencyIssued: number;
    underReview: number;
    completed: number;
  };
  informationRequests?: InformationRequestRecord[];
  error?: string;
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function getBaseUrl() {
  const h = await headers();

  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) return `${proto}://${host}`;

  return "http://localhost:3000";
}

async function getInformationRequests(): Promise<InformationRequestResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/information-requests`, {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
      },
    });

    const json = (await res.json()) as InformationRequestResponse;

    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error:
        json.error ||
        `Information requests request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant information requests.",
    };
  }
}

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function normalize(value: string | null | undefined) {
  return (value || "").trim().toLowerCase();
}

function matchesFilter(
  item: InformationRequestRecord,
  filters: {
    q: string;
    requestStatus: string;
    requestType: string;
    record: string;
    deficiency: string;
  },
) {
  const q = normalize(filters.q);
  const requestStatus = normalize(filters.requestStatus);
  const requestType = normalize(filters.requestType);
  const record = normalize(filters.record);
  const deficiency = normalize(filters.deficiency);

  const searchable = [
    item.requestId,
    item.caseId,
    item.organizationName,
    item.contactEmail,
    item.requestType,
    item.requestStatus,
    item.caseStatus,
    item.source,
    item.updatedAt,
    item.repositoryCategory,
    item.workflowOrigin,
    item.workflowStage,
    item.responseReadiness,
    item.repositoryHealth,
  ]
    .map((value) => normalize(value))
    .join(" ");

  if (q && !searchable.includes(q)) return false;
  if (requestStatus && normalize(item.requestStatus) !== requestStatus) return false;
  if (requestType && normalize(item.requestType) !== requestType) return false;

  if (record === "open" && !item.isOpen) return false;
  if (record === "completed" && !item.isCompleted) return false;

  if (deficiency === "deficiency" && !item.isDeficiencyRelated) return false;
  if (deficiency === "non-deficiency" && item.isDeficiencyRelated) return false;

  return true;
}

function uniqueValues(
  items: InformationRequestRecord[],
  key: keyof InformationRequestRecord,
) {
  return Array.from(
    new Set(
      items
        .map((item) => item[key])
        .filter(
          (value): value is string =>
            typeof value === "string" && value.length > 0,
        ),
    ),
  ).sort((a, b) => a.localeCompare(b));
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[14px] leading-7 text-black/75">{value}</div>
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

function WorkflowCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
    </div>
  );
}

export default async function ApplicantInformationRequestsPage({
  searchParams,
}: PageProps) {
  const params = (await searchParams) || {};
  const data = await getInformationRequests();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant information requests unavailable"
            description="The applicant information request view could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant information request access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/dashboard" variant="primary">
                  Dashboard
                </PublicButtonLink>
                <PublicButtonLink href="/applicant/cases" variant="secondary">
                  Cases
                </PublicButtonLink>
              </>
            }
          />
        </div>
      </main>
    );
  }

  const summary = data.summary || {
    totalRequests: 0,
    openRequests: 0,
    deficiencyIssued: 0,
    underReview: 0,
    completed: 0,
  };

  const informationRequests = data.informationRequests || [];
  const filters = {
    q: firstParam(params.q),
    requestStatus: firstParam(params.requestStatus),
    requestType: firstParam(params.requestType),
    record: firstParam(params.record),
    deficiency: firstParam(params.deficiency),
  };

  const filteredInformationRequests = informationRequests.filter((item) =>
    matchesFilter(item, filters),
  );
  const statusOptions = uniqueValues(informationRequests, "requestStatus");
  const typeOptions = uniqueValues(informationRequests, "requestType");

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant information requests"
          description="Organization-scoped information request visibility for applicant cases, review requests, deficiencies, responses, evidence coordination, and workflow status."
          secondaryDescription="Applicant information request pages expose workflow visibility only. They do not create governance authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or verification authority."
          actions={
            <>
              <PublicButtonLink
                href="/applicant/information-requests"
                variant="primary"
              >
                Information Requests
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/deficiencies" variant="secondary">
                Deficiencies
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/evidence" variant="secondary">
                Evidence
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/progress" variant="secondary">
                Progress
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Request summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped information request inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Information request records shown here are scoped to the
            authenticated applicant organization. These records provide workflow
            visibility for applicant response coordination and do not mutate
            governance, scoring, decision, certification, publication, registry,
            or verification authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard label="Total Requests" value={summary.totalRequests} />
            <MetricCard label="Open" value={summary.openRequests} />
            <MetricCard
              label="Deficiencies"
              value={summary.deficiencyIssued}
            />
            <MetricCard label="Under Review" value={summary.underReview} />
            <MetricCard label="Completed" value={summary.completed} />
            <MetricCard
              label="Filtered Results"
              value={filteredInformationRequests.length}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Repository filters
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Search and filter information requests
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Filters operate on organization-scoped information requests
                already returned by the Snowflake-backed applicant API.
              </p>
            </div>

            <PublicButtonLink
              href="/applicant/information-requests"
              variant="secondary"
            >
              Clear filters
            </PublicButtonLink>
          </div>

          <form
            className="mt-8 grid gap-4 md:grid-cols-4"
            action="/applicant/information-requests"
          >
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Search request, case, status, source"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-2"
            />

            <select
              name="requestStatus"
              defaultValue={filters.requestStatus}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              name="record"
              defaultValue={filters.record}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">All records</option>
              <option value="open">Open only</option>
              <option value="completed">Completed only</option>
            </select>

            <select
              name="requestType"
              defaultValue={filters.requestType}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">All request types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              name="deficiency"
              defaultValue={filters.deficiency}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-2"
            >
              <option value="">All deficiency states</option>
              <option value="deficiency">Deficiency-related only</option>
              <option value="non-deficiency">Non-deficiency only</option>
            </select>

            <button
              type="submit"
              className="rounded-2xl border border-black bg-black px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-black/80"
            >
              Apply filters
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Request activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant information request records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Request records are applicant-facing workflow surfaces only.
                Review authority, decision authority, certification authority,
                registry publication, and verification authority remain separate
                deterministic governance processes.
              </p>
            </div>

            <PublicButtonLink href="/applicant/cases" variant="secondary">
              Back to cases
            </PublicButtonLink>
          </div>

          {filteredInformationRequests.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant information requests match the current filters
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Clear the filters or review applicant cases for this applicant
                session.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {filteredInformationRequests.map((request) => (
                <div
                  key={request.requestId}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        {request.repositoryCategory ||
                          "Information Request Repository"}
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {request.requestId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        Case {request.caseId} · {request.requestType}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel value={request.requestStatus} />
                      <StatusLabel value={request.caseStatus} />
                      {request.repositoryHealth ? (
                        <StatusLabel value={request.repositoryHealth} />
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-4">
                    <InfoCard
                      label="Request Type"
                      value={request.requestType}
                    />
                    <InfoCard
                      label="Workflow Stage"
                      value={request.workflowStage || "Information Request"}
                    />
                    <InfoCard
                      label="Response Readiness"
                      value={request.responseReadiness || "Not classified"}
                    />
                    <InfoCard
                      label="Age"
                      value={
                        typeof request.ageDays === "number"
                          ? `${request.ageDays} day${
                              request.ageDays === 1 ? "" : "s"
                            }`
                          : "Unavailable"
                      }
                    />
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-5">
                    <InfoCard
                      label="Organization"
                      value={request.organizationName}
                    />
                    <InfoCard
                      label="Email"
                      value={request.contactEmail || "N/A"}
                    />
                    <InfoCard label="Source" value={request.source} />
                    <InfoCard
                      label="Origin"
                      value={request.workflowOrigin || "Applicant Workflow"}
                    />
                    <InfoCard
                      label="Updated"
                      value={request.updatedAt || "N/A"}
                    />
                  </div>

                  <p className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[13px] leading-6 text-black/65">
                    {request.authorityBoundaryText ||
                      "Operational information request visibility only. No governance authority, certification authority, publication authority, registry authority, scoring authority, decision authority, or verification authority is created."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/applicant/information-requests/${encodeURIComponent(
                        request.requestId,
                      )}`}
                      className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                    >
                      Open Request
                    </Link>

                    <Link
                      href={`/applicant/cases/${encodeURIComponent(
                        request.caseId,
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
            title="Request visibility"
            body="Applicant users may review organization-scoped information requests associated with their cases."
          />
          <WorkflowCard
            title="Deficiency coordination"
            body="Deficiency-related request activity remains visible without creating review, scoring, or decision authority."
          />
          <WorkflowCard
            title="Evidence coordination"
            body="Information requests may coordinate evidence response workflows while evidence authority remains separate."
          />
          <WorkflowCard
            title="Governance review"
            body="Reviewer-facing governance review and decision handling remain separate from applicant workflow visibility."
          />
        </section>
      </div>
    </main>
  );
}

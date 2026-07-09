import { cookies, headers } from "next/headers";
import Link from "next/link";
import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantDeficiencyItem = {
  deficiencyId: string;
  caseId: string;
  requestId: string;
  organizationName: string;
  email: string | null;
  deficiencyType: string;
  deficiencyStatus: string;
  caseStatus: string;
  source: string;
  description: string;
  responseRequired: boolean;
  dueDate: string | null;
  updatedAt: string | null;
  repositoryCategory?: string;
  workflowOrigin?: string;
  workflowStage?: string;
  remediationReadiness?: string;
  repositoryHealth?: string;
  ageDays?: number | null;
  isOpen?: boolean;
  isResolved?: boolean;
  isResponseRequired?: boolean;
  isRemediationPending?: boolean;
  isUnderReview?: boolean;
  authorityBoundaryText?: string;
};

type ApplicantDeficienciesResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalDeficiencies: number;
    openDeficiencies: number;
    resolvedDeficiencies: number;
    responseRequired: number;
  };
  deficiencies?: ApplicantDeficiencyItem[];
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

async function getApplicantDeficiencies(): Promise<ApplicantDeficienciesResponse> {
  const baseUrl = await getBaseUrl();
  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/deficiencies`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    const json = (await res.json()) as ApplicantDeficienciesResponse;
    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error:
        json.error || `Deficiencies request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant deficiencies.",
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
  item: ApplicantDeficiencyItem,
  filters: {
    q: string;
    deficiencyStatus: string;
    deficiencyType: string;
    record: string;
    responseRequired: string;
  },
) {
  const q = normalize(filters.q);
  const deficiencyStatus = normalize(filters.deficiencyStatus);
  const deficiencyType = normalize(filters.deficiencyType);
  const record = normalize(filters.record);
  const responseRequired = normalize(filters.responseRequired);

  const searchable = [
    item.deficiencyId,
    item.caseId,
    item.requestId,
    item.organizationName,
    item.email,
    item.deficiencyType,
    item.deficiencyStatus,
    item.caseStatus,
    item.source,
    item.description,
    item.repositoryCategory,
    item.workflowOrigin,
    item.workflowStage,
    item.remediationReadiness,
    item.repositoryHealth,
  ]
    .map((value) => normalize(value))
    .join(" ");

  if (q && !searchable.includes(q)) return false;
  if (deficiencyStatus && normalize(item.deficiencyStatus) !== deficiencyStatus) {
    return false;
  }
  if (deficiencyType && normalize(item.deficiencyType) !== deficiencyType) {
    return false;
  }

  if (record === "open" && !item.isOpen) return false;
  if (record === "resolved" && !item.isResolved) return false;

  if (responseRequired === "required" && !item.isResponseRequired) return false;
  if (responseRequired === "not-required" && item.isResponseRequired) return false;

  return true;
}

function uniqueValues(
  items: ApplicantDeficiencyItem[],
  key: keyof ApplicantDeficiencyItem,
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

function ageLabel(value: number | null | undefined) {
  if (typeof value !== "number") return "Unavailable";
  return `${value} day${value === 1 ? "" : "s"}`;
}

export default async function ApplicantDeficienciesPage({
  searchParams,
}: PageProps) {
  const params = (await searchParams) || {};
  const data = await getApplicantDeficiencies();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant deficiencies unavailable"
            description="The applicant deficiency notice view could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant deficiency access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/dashboard" variant="primary">
                  Dashboard
                </PublicButtonLink>
                <PublicButtonLink href="/applicant/requests" variant="secondary">
                  Requests
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
    totalDeficiencies: 0,
    openDeficiencies: 0,
    resolvedDeficiencies: 0,
    responseRequired: 0,
  };

  const deficiencies = data.deficiencies || [];
  const filters = {
    q: firstParam(params.q),
    deficiencyStatus: firstParam(params.deficiencyStatus),
    deficiencyType: firstParam(params.deficiencyType),
    record: firstParam(params.record),
    responseRequired: firstParam(params.responseRequired),
  };

  const filteredDeficiencies = deficiencies.filter((item) =>
    matchesFilter(item, filters),
  );
  const statusOptions = uniqueValues(deficiencies, "deficiencyStatus");
  const typeOptions = uniqueValues(deficiencies, "deficiencyType");

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant deficiencies"
          description={`Organization-scoped deficiency notice visibility for ${organizationName}.`}
          secondaryDescription="Applicant deficiency pages expose workflow visibility only. They do not create findings authority, evidence authority, scoring authority, decision authority, certification authority, registry authority, publication authority, verification authority, or governance authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/deficiencies" variant="primary">
                Deficiencies
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/remediation" variant="secondary">
                Remediation
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/requests" variant="secondary">
                Requests
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/progress" variant="secondary">
                Progress
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/cases" variant="secondary">
                Cases
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Deficiency summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped deficiency notice inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Deficiency notices shown here are scoped to the authenticated
            applicant organization. This repository provides operational
            deficiency visibility while remediation activity remains a separate
            authorized repository and workflow surface.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-5">
            <MetricCard
              label="Total Deficiencies"
              value={summary.totalDeficiencies}
            />
            <MetricCard
              label="Open Deficiencies"
              value={summary.openDeficiencies}
            />
            <MetricCard
              label="Resolved Deficiencies"
              value={summary.resolvedDeficiencies}
            />
            <MetricCard
              label="Response Required"
              value={summary.responseRequired}
            />
            <MetricCard
              label="Filtered Results"
              value={filteredDeficiencies.length}
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
                Search and filter deficiencies
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Filters operate on organization-scoped deficiencies already
                returned by the Snowflake-backed applicant API.
              </p>
            </div>

            <PublicButtonLink href="/applicant/deficiencies" variant="secondary">
              Clear filters
            </PublicButtonLink>
          </div>

          <form className="mt-8 grid gap-4 md:grid-cols-4" action="/applicant/deficiencies">
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Search deficiency, case, status, source"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-2"
            />

            <select
              name="deficiencyStatus"
              defaultValue={filters.deficiencyStatus}
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
              <option value="resolved">Resolved only</option>
            </select>

            <select
              name="deficiencyType"
              defaultValue={filters.deficiencyType}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">All deficiency types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              name="responseRequired"
              defaultValue={filters.responseRequired}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-2"
            >
              <option value="">All response states</option>
              <option value="required">Response required only</option>
              <option value="not-required">No response required only</option>
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
                Deficiency activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant deficiency repository records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Deficiency records are applicant-facing workflow visibility
                surfaces. Remediation responses are coordinated through the
                separate authorized remediation repository workflow.
              </p>
            </div>

            <PublicButtonLink href="/applicant/progress" variant="secondary">
              Back to progress
            </PublicButtonLink>
          </div>

          {filteredDeficiencies.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant deficiencies match the current filters
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Clear the filters or review applicant progress for this
                applicant session.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {filteredDeficiencies.map((item) => (
                <Link
                  key={item.deficiencyId}
                  href={`/applicant/deficiencies/${encodeURIComponent(
                    item.deficiencyId,
                  )}`}
                  className="block rounded-3xl border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        {item.repositoryCategory || "Deficiency Repository"}
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.deficiencyId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        Case {item.caseId} {"/"} Request {item.requestId}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-black/70">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel value={item.deficiencyStatus} />
                      <StatusLabel value={item.caseStatus} />
                      {item.repositoryHealth ? (
                        <StatusLabel value={item.repositoryHealth} />
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-4">
                    <InfoCard
                      label="Deficiency Type"
                      value={item.deficiencyType}
                    />
                    <InfoCard
                      label="Workflow Stage"
                      value={item.workflowStage || "Deficiency"}
                    />
                    <InfoCard
                      label="Remediation Readiness"
                      value={item.remediationReadiness || "Not classified"}
                    />
                    <InfoCard label="Age" value={ageLabel(item.ageDays)} />
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-5">
                    <InfoCard
                      label="Organization"
                      value={item.organizationName}
                    />
                    <InfoCard label="Email" value={item.email || "N/A"} />
                    <InfoCard label="Source" value={item.source} />
                    <InfoCard
                      label="Origin"
                      value={item.workflowOrigin || "Applicant Workflow"}
                    />
                    <InfoCard
                      label="Updated"
                      value={item.updatedAt || "No recent update"}
                    />
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
                    <InfoCard
                      label="Response Required"
                      value={item.isResponseRequired ? "Yes" : "No"}
                    />
                    <InfoCard
                      label="Remediation Pending"
                      value={item.isRemediationPending ? "Yes" : "No"}
                    />
                    <InfoCard
                      label="Due Date"
                      value={item.dueDate || "Not assigned"}
                    />
                  </div>

                  <p className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[13px] leading-6 text-black/65">
                    {item.authorityBoundaryText ||
                      "Operational deficiency repository visibility only. No governance authority, certification authority, publication authority, registry authority, scoring authority, decision authority, findings authority, evidence authority, or verification authority is created."}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <WorkflowCard
            title="Deficiency detail"
            body="Deficiency detail pages expose read-only deficiency metadata and authority boundaries."
          />
          <WorkflowCard
            title="Remediation response"
            body="Remediation responses are handled through a separate authorized applicant remediation repository and workflow surface."
          />
          <WorkflowCard
            title="Evidence attachment"
            body="Remediation evidence remains coordinated through applicant evidence workflows without creating evidence authority."
          />
          <WorkflowCard
            title="Governance review"
            body="Governance review remains separate from applicant deficiency visibility."
          />
        </section>
      </div>
    </main>
  );
}
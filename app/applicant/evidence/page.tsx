import { cookies, headers } from "next/headers";
import Link from "next/link";

import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantEvidenceItem = {
  evidenceId: string;
  caseId: string;
  requestId: string;
  organizationName: string;
  email: string | null;
  title?: string;
  description?: string | null;
  evidenceType: string;
  evidenceStatus: string;
  source: string;
  fileName: string | null;
  fileType: string | null;
  uploadedAt: string | null;
  updatedAt: string | null;
  repositoryRecord?: boolean;
  repositoryCategory?: string;
  workflowOrigin?: string;
  workflowStage?: string;
  reviewReadiness?: string;
  repositoryHealth?: string;
  ageDays?: number | null;
  hasFile?: boolean;
  isPending?: boolean;
  authorityBoundary?: string;
};

type ApplicantEvidenceResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalEvidenceSlots: number;
    uploadedEvidence: number;
    pendingEvidence: number;
  };
  evidence?: ApplicantEvidenceItem[];
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

async function getApplicantEvidence(): Promise<ApplicantEvidenceResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/evidence`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    const json = (await res.json()) as ApplicantEvidenceResponse;
    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Evidence request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant evidence.",
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

function matchesFilter(item: ApplicantEvidenceItem, filters: {
  q: string;
  status: string;
  type: string;
  record: string;
}) {
  const q = normalize(filters.q);
  const status = normalize(filters.status);
  const type = normalize(filters.type);
  const record = normalize(filters.record);

  const searchable = [
    item.evidenceId,
    item.caseId,
    item.requestId,
    item.organizationName,
    item.email,
    item.title,
    item.description,
    item.evidenceType,
    item.evidenceStatus,
    item.source,
    item.fileName,
    item.fileType,
    item.workflowOrigin,
    item.workflowStage,
    item.reviewReadiness,
    item.repositoryHealth,
  ]
    .map((value) => normalize(value))
    .join(" ");

  if (q && !searchable.includes(q)) return false;
  if (status && normalize(item.evidenceStatus) !== status) return false;
  if (type && normalize(item.evidenceType) !== type) return false;

  if (record === "uploaded" && !item.repositoryRecord) return false;
  if (record === "pending" && item.repositoryRecord) return false;

  return true;
}

function uniqueValues(items: ApplicantEvidenceItem[], key: keyof ApplicantEvidenceItem) {
  return Array.from(
    new Set(
      items
        .map((item) => item[key])
        .filter((value): value is string => typeof value === "string" && value.length > 0),
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

export default async function ApplicantEvidencePage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const data = await getApplicantEvidence();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant evidence unavailable"
            description="The applicant evidence view could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant evidence access is available only for authenticated organization-scoped users."
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
    totalEvidenceSlots: 0,
    uploadedEvidence: 0,
    pendingEvidence: 0,
  };

  const evidence = data.evidence || [];

  const filters = {
    q: firstParam(params.q),
    status: firstParam(params.status),
    type: firstParam(params.type),
    record: firstParam(params.record),
  };

  const filteredEvidence = evidence.filter((item) => matchesFilter(item, filters));
  const statusOptions = uniqueValues(evidence, "evidenceStatus");
  const typeOptions = uniqueValues(evidence, "evidenceType");

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant evidence"
          description={`Organization-scoped evidence visibility for ${organizationName}.`}
          secondaryDescription="Applicant evidence pages expose evidence workflow visibility only. They do not create verification authority, scoring authority, decision authority, certification authority, registry authority, or publication authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/evidence" variant="primary">
                Evidence
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/evidence/upload" variant="secondary">
                Upload Evidence
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/requests" variant="secondary">
                Requests
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/cases" variant="secondary">
                Cases
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Evidence summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped evidence inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Evidence records shown here are scoped to the authenticated applicant
            organization. This repository provides operational evidence visibility,
            upload access, lifecycle indicators, and repository metadata without
            creating governance, verification, scoring, certification, publication,
            or registry authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <MetricCard label="Evidence Slots" value={summary.totalEvidenceSlots} />
            <MetricCard label="Uploaded Evidence" value={summary.uploadedEvidence} />
            <MetricCard label="Pending Evidence" value={summary.pendingEvidence} />
            <MetricCard label="Filtered Results" value={filteredEvidence.length} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Repository filters
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Search and filter evidence
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Filters operate on organization-scoped evidence already returned
                by the Snowflake-backed applicant evidence API.
              </p>
            </div>

            <PublicButtonLink href="/applicant/evidence" variant="secondary">
              Clear filters
            </PublicButtonLink>
          </div>

          <form className="mt-8 grid gap-4 md:grid-cols-4" action="/applicant/evidence">
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Search evidence, case, file, status"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-2"
            />

            <select
              name="status"
              defaultValue={filters.status}
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
              <option value="uploaded">Uploaded only</option>
              <option value="pending">Pending only</option>
            </select>

            <select
              name="type"
              defaultValue={filters.type}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-3"
            >
              <option value="">All evidence types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
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
                Evidence activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant evidence records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Evidence records combine persisted repository records with
                workflow-derived pending evidence slots for the authenticated
                applicant organization.
              </p>
            </div>

            <PublicButtonLink href="/applicant/evidence/upload" variant="secondary">
              Upload evidence
            </PublicButtonLink>
          </div>

          {filteredEvidence.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant evidence records match the current filters
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Clear the filters or upload evidence for this applicant session.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {filteredEvidence.map((item) => (
                <div
                  key={item.evidenceId}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        {item.repositoryCategory || "Evidence Repository"}
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.title || item.evidenceId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        Evidence {item.evidenceId} · Case {item.caseId} · Request{" "}
                        {item.requestId}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-black/70">
                        {item.fileName || "No file uploaded"} ·{" "}
                        {item.updatedAt || "No recent update"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel value={item.evidenceStatus} />
                      <StatusLabel value={item.source} />
                      {item.repositoryHealth ? (
                        <StatusLabel value={item.repositoryHealth} />
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Evidence Type
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.evidenceType}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Workflow Stage
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.workflowStage || "Evidence"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Review Readiness
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.reviewReadiness || "Not classified"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Age
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {typeof item.ageDays === "number"
                          ? `${item.ageDays} day${item.ageDays === 1 ? "" : "s"}`
                          : "Unavailable"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        File Type
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.fileType || "Not uploaded"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Uploaded
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.uploadedAt || "Not uploaded"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Origin
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.workflowOrigin || "Applicant Workflow"}
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[13px] leading-6 text-black/65">
                    {item.authorityBoundary ||
                      "Operational evidence visibility only. No governance, verification, scoring, certification, registry, or publication authority is created."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {item.requestId ? (
                      <Link
                        href={`/applicant/requests/${encodeURIComponent(
                          item.requestId,
                        )}`}
                        className="rounded-full border border-black/10 bg-black px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-black/80"
                      >
                        Open Request
                      </Link>
                    ) : null}

                    {item.caseId ? (
                      <Link
                        href={`/applicant/cases/${encodeURIComponent(item.caseId)}`}
                        className="rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-black/[0.04]"
                      >
                        Open Case
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <WorkflowCard
            title="Upload workflow"
            body="Evidence upload is available through the applicant evidence upload surface."
          />
          <WorkflowCard
            title="Artifact repository"
            body="Uploaded evidence may also participate in artifact repository views where authorized."
          />
          <WorkflowCard
            title="Request attachment"
            body="Evidence remains associated with applicant workflow and request context where available."
          />
          <WorkflowCard
            title="Governance review"
            body="Reviewer-facing evidence handling remains separate from applicant evidence visibility."
          />
        </section>
      </div>
    </main>
  );
}
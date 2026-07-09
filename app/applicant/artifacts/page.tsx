import { cookies, headers } from "next/headers";
import Link from "next/link";

import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantArtifactItem = {
  artifactId: string;
  evidenceId: string;
  caseId: string;
  requestId: string;
  organizationName: string;
  email: string | null;
  artifactType: string;
  artifactStatus: string;
  source: string;
  title: string;
  fileName: string | null;
  fileType: string | null;
  version: string;
  preservedAt: string | null;
  updatedAt: string | null;
  repositoryRecord?: boolean;
  repositoryCategory?: string;
  workflowOrigin?: string;
  workflowStage?: string;
  preservationReadiness?: string;
  repositoryHealth?: string;
  ageDays?: number | null;
  hasFile?: boolean;
  isPending?: boolean;
  authorityBoundary?: string;
};

type ApplicantArtifactsResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalArtifacts: number;
    persistedArtifacts: number;
    pendingArtifacts: number;
  };
  artifacts?: ApplicantArtifactItem[];
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

async function getApplicantArtifacts(): Promise<ApplicantArtifactsResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/artifacts`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    const json = (await res.json()) as ApplicantArtifactsResponse;
    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Artifacts request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant artifacts.",
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
  item: ApplicantArtifactItem,
  filters: {
    q: string;
    status: string;
    type: string;
    record: string;
  },
) {
  const q = normalize(filters.q);
  const status = normalize(filters.status);
  const type = normalize(filters.type);
  const record = normalize(filters.record);

  const searchable = [
    item.artifactId,
    item.evidenceId,
    item.caseId,
    item.requestId,
    item.organizationName,
    item.email,
    item.artifactType,
    item.artifactStatus,
    item.source,
    item.title,
    item.fileName,
    item.fileType,
    item.version,
    item.workflowOrigin,
    item.workflowStage,
    item.preservationReadiness,
    item.repositoryHealth,
  ]
    .map((value) => normalize(value))
    .join(" ");

  if (q && !searchable.includes(q)) return false;
  if (status && normalize(item.artifactStatus) !== status) return false;
  if (type && normalize(item.artifactType) !== type) return false;

  if (record === "persisted" && !item.repositoryRecord) return false;
  if (record === "pending" && item.repositoryRecord) return false;

  return true;
}

function uniqueValues(items: ApplicantArtifactItem[], key: keyof ApplicantArtifactItem) {
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

export default async function ApplicantArtifactsPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const data = await getApplicantArtifacts();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant artifacts unavailable"
            description="The applicant artifact repository could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant artifact access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/dashboard" variant="primary">
                  Dashboard
                </PublicButtonLink>
                <PublicButtonLink href="/applicant/evidence" variant="secondary">
                  Evidence
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
    totalArtifacts: 0,
    persistedArtifacts: 0,
    pendingArtifacts: 0,
  };

  const artifacts = data.artifacts || [];

  const filters = {
    q: firstParam(params.q),
    status: firstParam(params.status),
    type: firstParam(params.type),
    record: firstParam(params.record),
  };

  const filteredArtifacts = artifacts.filter((item) => matchesFilter(item, filters));
  const statusOptions = uniqueValues(artifacts, "artifactStatus");
  const typeOptions = uniqueValues(artifacts, "artifactType");

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant artifacts"
          description={`Organization-scoped artifact repository visibility for ${organizationName}.`}
          secondaryDescription="Applicant artifact pages expose repository visibility only. They do not create evidence authority, verification authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or governance authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/artifacts" variant="primary">
                Artifacts
              </PublicButtonLink>
              <PublicButtonLink
                href="/applicant/artifacts/upload"
                variant="secondary"
              >
                Upload Artifact
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/evidence" variant="secondary">
                Evidence
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
            Artifact repository summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped artifact inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Artifact records shown here are scoped to the authenticated applicant
            organization. This repository provides operational artifact visibility,
            upload access, preservation indicators, and repository metadata without
            creating evidence, verification, scoring, certification, publication,
            registry, or governance authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <MetricCard label="Total Artifacts" value={summary.totalArtifacts} />
            <MetricCard
              label="Persisted Artifacts"
              value={summary.persistedArtifacts}
            />
            <MetricCard label="Pending Artifacts" value={summary.pendingArtifacts} />
            <MetricCard label="Filtered Results" value={filteredArtifacts.length} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Repository filters
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Search and filter artifacts
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Filters operate on organization-scoped artifacts already returned
                by the Snowflake-backed applicant artifact API.
              </p>
            </div>

            <PublicButtonLink href="/applicant/artifacts" variant="secondary">
              Clear filters
            </PublicButtonLink>
          </div>

          <form className="mt-8 grid gap-4 md:grid-cols-4" action="/applicant/artifacts">
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Search artifact, case, evidence, file, status"
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
              <option value="persisted">Persisted only</option>
              <option value="pending">Pending only</option>
            </select>

            <select
              name="type"
              defaultValue={filters.type}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-3"
            >
              <option value="">All artifact types</option>
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
                Artifact activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant artifact repository records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Artifact records combine persisted repository records with
                workflow-derived pending artifact slots for the authenticated
                applicant organization.
              </p>
            </div>

            <PublicButtonLink href="/applicant/artifacts/upload" variant="secondary">
              Upload artifact
            </PublicButtonLink>
          </div>

          {filteredArtifacts.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant artifacts match the current filters
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Clear the filters or upload an artifact for this applicant session.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {filteredArtifacts.map((item) => (
                <Link
                  key={item.artifactId}
                  href={`/applicant/artifacts/${encodeURIComponent(
                    item.artifactId,
                  )}`}
                  className="block rounded-3xl border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        {item.repositoryCategory || "Artifact Repository"}
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.title || item.artifactId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        Artifact {item.artifactId} · Case {item.caseId} · Evidence{" "}
                        {item.evidenceId}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-black/70">
                        {item.fileName || "No file persisted"} ·{" "}
                        {item.updatedAt || item.preservedAt || "No recent update"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel value={item.artifactStatus} />
                      <StatusLabel value={item.source} />
                      {item.repositoryHealth ? (
                        <StatusLabel value={item.repositoryHealth} />
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Artifact Type
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.artifactType}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Workflow Stage
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.workflowStage || "Artifact"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Preservation Readiness
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.preservationReadiness || "Not classified"}
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
                        {item.fileType || "Not persisted"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Version
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.version || "1"}
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
                      "Operational artifact repository visibility only. No evidence, verification, scoring, certification, registry, publication, or governance authority is created."}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <WorkflowCard
            title="Artifact detail"
            body="Artifact detail pages expose read-only artifact metadata and authority boundaries."
          />
          <WorkflowCard
            title="File persistence"
            body="Artifact upload and persistence are available through authorized artifact repository workflows."
          />
          <WorkflowCard
            title="Evidence linkage"
            body="Artifacts remain operationally associated with applicant evidence and request context where available."
          />
          <WorkflowCard
            title="Certification support"
            body="Preserved artifacts may support later certification repository visibility without creating certification authority."
          />
        </section>
      </div>
    </main>
  );
}
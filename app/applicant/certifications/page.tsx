import { cookies, headers } from "next/headers";
import Link from "next/link";

import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantCertificationRecord = {
  certificationId: string;
  caseId: string;
  requestId: string;
  organizationName: string;
  email: string | null;
  certificationType: string;
  certificationStatus: string;
  caseStatus: string;
  source: string;
  issuedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  renewalStatus: string;
  publicationStatus: string;
  updatedAt: string | null;
  repositoryRecord: boolean;
  repositoryCategory?: string;
  workflowOrigin?: string;
  workflowStage?: string;
  certificationReadiness?: string;
  repositoryHealth?: string;
  ageDays?: number | null;
  isActive?: boolean;
  isCertified?: boolean;
  isRenewalPending?: boolean;
  isSuspended?: boolean;
  isRevoked?: boolean;
  isAppealPending?: boolean;
  isPublished?: boolean;
  authorityBoundaryText?: string;
};

type ApplicantCertificationsResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalCertifications: number;
    activeCertifications: number;
    renewalPending: number;
    notCertified: number;
  };
  certifications?: ApplicantCertificationRecord[];
  error?: string;
};

type PageProps = {
  searchParams?: Promise<
    Record<string, string | string[] | undefined>
  >;
};

type CertificationFilters = {
  q: string;
  certificationStatus: string;
  certificationType: string;
  record: string;
  renewalStatus: string;
  publicationStatus: string;
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

async function getApplicantCertifications(): Promise<ApplicantCertificationsResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(
      `${baseUrl}/api/applicant/certifications`,
      {
        cache: "no-store",
        headers: {
          cookie: cookieHeader,
        },
      },
    );

    const json =
      (await res.json()) as ApplicantCertificationsResponse;

    if (res.ok && json.ok) {
      return json;
    }

    return {
      ok: false,
      error:
        json.error ||
        `Certifications request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant certifications.",
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

function matchesFilters(
  item: ApplicantCertificationRecord,
  filters: CertificationFilters,
) {
  const q = normalize(filters.q);

  const searchable = [
    item.certificationId,
    item.caseId,
    item.requestId,
    item.organizationName,
    item.email,
    item.certificationType,
    item.certificationStatus,
    item.caseStatus,
    item.source,
    item.renewalStatus,
    item.publicationStatus,
    item.workflowOrigin,
    item.workflowStage,
    item.certificationReadiness,
    item.repositoryHealth,
  ]
    .map((value) => normalize(value))
    .join(" ");

  if (q && !searchable.includes(q)) {
    return false;
  }

  if (
    filters.certificationStatus &&
    normalize(item.certificationStatus) !==
      normalize(filters.certificationStatus)
  ) {
    return false;
  }

  if (
    filters.certificationType &&
    normalize(item.certificationType) !==
      normalize(filters.certificationType)
  ) {
    return false;
  }

  if (
    filters.renewalStatus &&
    normalize(item.renewalStatus) !==
      normalize(filters.renewalStatus)
  ) {
    return false;
  }

  if (
    filters.publicationStatus &&
    normalize(item.publicationStatus) !==
      normalize(filters.publicationStatus)
  ) {
    return false;
  }

  const record = normalize(filters.record);

  if (
    record === "active" &&
    !item.isActive
  ) {
    return false;
  }

  if (
    record === "not-certified" &&
    (item.isCertified || item.isActive)
  ) {
    return false;
  }

  if (
    record === "persisted" &&
    !item.repositoryRecord
  ) {
    return false;
  }

  if (
    record === "placeholder" &&
    item.repositoryRecord
  ) {
    return false;
  }

  return true;
}

function uniqueValues(
  items: ApplicantCertificationRecord[],
  key: keyof ApplicantCertificationRecord,
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

export default async function ApplicantCertificationsPage({
  searchParams,
}: PageProps) {
  const params =
    (await searchParams) ?? {};

  const data =
    await getApplicantCertifications();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant certifications unavailable"
            description="The applicant certification repository could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant certification access is available only for authenticated organization-scoped users."
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
                  href="/applicant/artifacts"
                  variant="secondary"
                >
                  Artifacts
                </PublicButtonLink>
              </>
            }
          />
        </div>
      </main>
    );
  }

  const organizationName =
    data.organization?.organizationName ||
    "Applicant Organization";

  const summary =
    data.summary || {
      totalCertifications: 0,
      activeCertifications: 0,
      renewalPending: 0,
      notCertified: 0,
    };

  const certifications =
    data.certifications || [];

  const filters: CertificationFilters = {
    q: firstParam(params.q),
    certificationStatus: firstParam(
      params.certificationStatus,
    ),
    certificationType: firstParam(
      params.certificationType,
    ),
    record: firstParam(params.record),
    renewalStatus: firstParam(
      params.renewalStatus,
    ),
    publicationStatus: firstParam(
      params.publicationStatus,
    ),
  };

  const filteredCertifications =
    certifications.filter((item) =>
      matchesFilters(item, filters),
    );

  const certificationStatusOptions =
    uniqueValues(
      certifications,
      "certificationStatus",
    );

  const certificationTypeOptions =
    uniqueValues(
      certifications,
      "certificationType",
    );

  const renewalStatusOptions =
    uniqueValues(
      certifications,
      "renewalStatus",
    );

  const publicationStatusOptions =
    uniqueValues(
      certifications,
      "publicationStatus",
    );

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant certifications"
          description={`Organization-scoped certification repository visibility for ${organizationName}.`}
          secondaryDescription="Applicant certification pages expose repository visibility, certification lifecycle visibility, validity status, renewal state, appeal state, and publication state only. They do not create certification authority, publication authority, registry authority, verification authority, scoring authority, decision authority, or governance authority."
          actions={
            <>
              <PublicButtonLink
                href="/applicant/certifications"
                variant="primary"
              >
                Certifications
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/artifacts"
                variant="secondary"
              >
                Artifacts
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/evidence"
                variant="secondary"
              >
                Evidence
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
            Certification repository summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped certification inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Certification records shown here are scoped to the
            authenticated applicant organization and provide read-only
            visibility into certification status, validity, renewal
            state, appeal state, repository health, and publication
            state. Applicant visibility does not create or modify
            certification, publication, registry, decision, or
            governance authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
            <MetricCard
              label="Total Certifications"
              value={summary.totalCertifications}
            />

            <MetricCard
              label="Active Certifications"
              value={summary.activeCertifications}
            />

            <MetricCard
              label="Renewal Pending"
              value={summary.renewalPending}
            />

            <MetricCard
              label="Not Certified"
              value={summary.notCertified}
            />

            <MetricCard
              label="Filtered Results"
              value={filteredCertifications.length}
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
                Search and filter certification records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Filters operate only on organization-scoped
                certification records already returned by the
                Snowflake-backed applicant API.
              </p>
            </div>

            <PublicButtonLink
              href="/applicant/certifications"
              variant="secondary"
            >
              Clear Filters
            </PublicButtonLink>
          </div>

          <form
            action="/applicant/certifications"
            method="get"
            className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Search certification, case, organization, status"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30 md:col-span-2 xl:col-span-3"
            />

            <select
              name="certificationStatus"
              defaultValue={
                filters.certificationStatus
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">
                All certification statuses
              </option>

              {certificationStatusOptions.map(
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
              name="certificationType"
              defaultValue={
                filters.certificationType
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">
                All certification types
              </option>

              {certificationTypeOptions.map(
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

              <option value="active">
                Active only
              </option>

              <option value="not-certified">
                Not certified
              </option>

              <option value="persisted">
                Persisted records
              </option>

              <option value="placeholder">
                Workflow placeholders
              </option>
            </select>

            <select
              name="renewalStatus"
              defaultValue={
                filters.renewalStatus
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">
                All renewal states
              </option>

              {renewalStatusOptions.map(
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
              name="publicationStatus"
              defaultValue={
                filters.publicationStatus
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black outline-none transition focus:border-black/30"
            >
              <option value="">
                All publication states
              </option>

              {publicationStatusOptions.map(
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
                Certification activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant certification repository records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Certification records combine applicant workflow
                visibility with persisted certification lifecycle
                records. Certification issuance, renewal actions,
                appeals, reinstatement, publication, and registry
                authority remain separate authorized processes.
              </p>
            </div>

            <PublicButtonLink
              href="/applicant/artifacts"
              variant="secondary"
            >
              Back to Artifacts
            </PublicButtonLink>
          </div>

          {filteredCertifications.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No certification records match the current filters
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                Clear the filters or review another
                organization-scoped certification state.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {filteredCertifications.map(
                (item) => (
                  <Link
                    key={item.certificationId}
                    href={`/applicant/certifications/${encodeURIComponent(
                      item.certificationId,
                    )}`}
                    className="block rounded-3xl border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                          {item.repositoryCategory ||
                            "Certification Repository"}
                        </div>

                        <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                          {item.certificationId}
                        </h3>

                        <p className="mt-3 text-[14px] leading-7 text-black/70">
                          Case {item.caseId} ·{" "}
                          {item.certificationType}
                        </p>

                        <p className="mt-2 text-[14px] leading-7 text-black/70">
                          {item.email ||
                            "No contact email"}{" "}
                          ·{" "}
                          {item.updatedAt ||
                            "No recent update"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <StatusLabel
                          value={
                            item.certificationStatus
                          }
                        />

                        <StatusLabel
                          value={
                            item.publicationStatus
                          }
                        />

                        {item.isRenewalPending && (
                          <StatusLabel value="RENEWAL_PENDING" />
                        )}

                        {item.isSuspended && (
                          <StatusLabel value="SUSPENDED" />
                        )}

                        {item.isRevoked && (
                          <StatusLabel value="REVOKED" />
                        )}

                        {item.isAppealPending && (
                          <StatusLabel value="APPEAL_PENDING" />
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

                    <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
                      <InfoCard
                        label="Valid From"
                        value={
                          item.validFrom ||
                          "Not issued"
                        }
                      />

                      <InfoCard
                        label="Valid To"
                        value={
                          item.validTo ||
                          "Not issued"
                        }
                      />

                      <InfoCard
                        label="Renewal Status"
                        value={item.renewalStatus}
                      />
                    </div>

                    <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-4">
                      <InfoCard
                        label="Repository Category"
                        value={
                          item.repositoryCategory ||
                          "Certification Repository"
                        }
                      />

                      <InfoCard
                        label="Workflow Origin"
                        value={
                          item.workflowOrigin ||
                          "Applicant Workflow"
                        }
                      />

                      <InfoCard
                        label="Workflow Stage"
                        value={
                          item.workflowStage ||
                          "CERTIFICATION_PENDING"
                        }
                      />

                      <InfoCard
                        label="Certification Readiness"
                        value={
                          item.certificationReadiness ||
                          "NOT_READY"
                        }
                      />

                      <InfoCard
                        label="Repository Health"
                        value={
                          item.repositoryHealth ||
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
                        label="Persisted Record"
                        value={yesNo(
                          item.repositoryRecord,
                        )}
                      />

                      <InfoCard
                        label="Active"
                        value={yesNo(
                          item.isActive,
                        )}
                      />

                      <InfoCard
                        label="Certified"
                        value={yesNo(
                          item.isCertified,
                        )}
                      />

                      <InfoCard
                        label="Renewal Pending"
                        value={yesNo(
                          item.isRenewalPending,
                        )}
                      />

                      <InfoCard
                        label="Published"
                        value={yesNo(
                          item.isPublished,
                        )}
                      />

                      <InfoCard
                        label="Appeal Pending"
                        value={yesNo(
                          item.isAppealPending,
                        )}
                      />
                    </div>

                    <p className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[13px] leading-6 text-black/65">
                      {item.authorityBoundaryText ||
                        "Operational certification repository visibility only. No certification issuance, renewal, appeal, reinstatement, publication, registry, scoring, decision, verification, or governance authority is created."}
                    </p>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <WorkflowCard
            title="Certification detail"
            body="Certification detail pages provide read-only certification lifecycle, validity, renewal, and authority-boundary visibility."
          />

          <WorkflowCard
            title="Renewal status"
            body="Renewal status is displayed as lifecycle visibility. Renewal authorization and mutation remain separate controlled processes."
          />

          <WorkflowCard
            title="Appeals and reinstatement"
            body="Appeal and reinstatement states remain visible where available, while all related authority remains outside the applicant repository surface."
          />

          <WorkflowCard
            title="Publication control"
            body="Certification publication and registry activation remain separate from applicant certification visibility and require explicit authorized action."
          />
        </section>
      </div>
    </main>
  );
}
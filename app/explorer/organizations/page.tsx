import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getOrganizationIntelligence,
  getOrganizationIntelligenceValidation,
} from "@/lib/queries/organization-intelligence";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ORGANIZATION_PAGE_LIMIT = 50;
const ORGANIZATION_MAX_SAFE_OFFSET = 10000;

function numberFormat(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function safe(value: string | null | undefined): string {
  return String(value ?? "").trim() || "—";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function toOffset(value?: string): number {
  const n = Number(value ?? 0);

  if (!Number.isFinite(n)) {
    return 0;
  }

  return Math.min(Math.max(Math.trunc(n), 0), ORGANIZATION_MAX_SAFE_OFFSET);
}

function classifyOrganizationRow(row: {
  totalAiSystems: number | null;
  activeCertifications: number | null;
  renewalDue30Days: number | null;
  renewalDue90Days: number | null;
  expiring30Days: number | null;
}): string {
  const aiSystems = Number(row.totalAiSystems ?? 0);
  const activeCertifications = Number(row.activeCertifications ?? 0);
  const renewal30 = Number(row.renewalDue30Days ?? 0);
  const renewal90 = Number(row.renewalDue90Days ?? 0);
  const expiring30 = Number(row.expiring30Days ?? 0);

  if (renewal30 > 0 || expiring30 > 0) {
    return "Renewal Attention Required";
  }

  if (renewal90 > 0) {
    return "Renewal Monitoring";
  }

  if (aiSystems >= 10) {
    return "High AI Governance Surface Organizations";
  }

  if (activeCertifications >= 5) {
    return "High Certification Continuity Organizations";
  }

  return "Active Governance Organizations";
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </p>
      <p className="mt-3 text-[20px] font-semibold tracking-tight text-black">
        {value}
      </p>
    </div>
  );
}

export default async function ExplorerOrganizationsPage({
  searchParams,
}: {
  searchParams?: {
    offset?: string;
  };
}) {
  const offset = toOffset(searchParams?.offset);

  const [rows, validation] = await Promise.all([
    getOrganizationIntelligence(ORGANIZATION_PAGE_LIMIT, offset),
    getOrganizationIntelligenceValidation(),
  ]);

  const totalPublicRecords = rows.reduce(
    (sum, row) => sum + Number(row.totalPublicRecords ?? 0),
    0
  );

  const totalAiSystems = rows.reduce(
    (sum, row) => sum + Number(row.totalAiSystems ?? 0),
    0
  );

  const activeCertifications = rows.reduce(
    (sum, row) => sum + Number(row.activeCertifications ?? 0),
    0
  );

  const countries = new Set(
    rows
      .map((row) => row.country)
      .filter((country) => String(country ?? "").trim() !== "")
  ).size;

  const groupedOrganizations = rows.reduce<Record<string, typeof rows>>(
    (groups, row) => {
      const category = classifyOrganizationRow(row);

      return {
        ...groups,
        [category]: [...(groups[category] ?? []), row],
      };
    },
    {}
  );

  const orderedOrganizationGroups = Object.entries(groupedOrganizations).sort(
    ([a], [b]) => a.localeCompare(b)
  );

  const hasNextPage = rows.length >= ORGANIZATION_PAGE_LIMIT;

  const previousOffset = Math.max(
    offset - ORGANIZATION_PAGE_LIMIT,
    0
  );

  const nextOffset =
    offset + ORGANIZATION_PAGE_LIMIT;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / ORGANIZATION GOVERNANCE INTELLIGENCE"
          title="Browse public AI governance observability by organization"
          description="This page summarizes organizations represented in GAFAIG deterministic public governance trust infrastructure using publication-safe Snowflake governance observability views."
          secondaryDescription="Only organizations associated with explicitly published certification surfaces appear here. Private governance evidence, findings, reviewer materials, scoring internals, and execution telemetry are not exposed."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Open Certification Registry
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Browse Governance Jurisdictions
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Governance Organizations"
              value={numberFormat(rows.length)}
            />
            <MetricCard
              label="Certification Surfaces"
              value={numberFormat(totalPublicRecords)}
            />
            <MetricCard
              label="AI Governance Surfaces"
              value={numberFormat(totalAiSystems)}
            />
            <MetricCard
              label="Governance Jurisdictions"
              value={numberFormat(countries)}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Active Certifications"
              value={numberFormat(activeCertifications)}
            />
            <MetricCard
              label="Governance Validation Surfaces"
              value={numberFormat(validation?.totalOrganizations ?? rows.length)}
            />
            <MetricCard
              label="Empty Governance Organization Values"
              value={numberFormat(validation?.emptyOrganizationValues ?? 0)}
            />
            <MetricCard
              label="Null AI Governance Surface Counts"
              value={numberFormat(validation?.nullAiSystemCounts ?? 0)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Organization Governance Observability
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Publication-safe governance observability by organization
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Organization governance observability aggregates publication-safe
              lifecycle, renewal, continuity, and AI governance disclosure
              observability from canonical Snowflake public trust infrastructure
              views.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[14px] text-black/70">
              {rows.length} shown
            </p>

            <div className="flex flex-wrap gap-3">
              {offset > 0 ? (
                <PublicButtonLink
                  href={`/explorer/organizations?offset=${previousOffset}`}
                  variant="secondary"
                >
                  Previous
                </PublicButtonLink>
              ) : null}

              {hasNextPage ? (
                <PublicButtonLink
                  href={`/explorer/organizations?offset=${nextOffset}`}
                  variant="secondary"
                >
                  Next
                </PublicButtonLink>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-6">
            {rows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
                <div className="text-lg font-semibold text-black">
                  No published organization governance observability surfaces
                  are currently available.
                </div>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  GAFAIG did not receive organization rows from the canonical
                  Snowflake public organization governance observability view.
                </p>
              </div>
            ) : (
              orderedOrganizationGroups.map(([category, categoryRows]) => (
                <div key={category} className="grid gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-[18px] font-semibold tracking-tight text-black">
                      {category}
                    </h3>

                    <p className="text-[13px] font-medium text-black/50">
                      {numberFormat(categoryRows.length)} organizations
                    </p>
                  </div>

                  {categoryRows.map((row) => (
                    <article
                      key={`${row.organizationName}-${row.country}`}
                      className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/30"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                            Organization Governance Observability Surface
                          </p>

                          <h3 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
                            {safe(row.organizationName)}
                          </h3>

                          <p className="mt-2 text-[14px] leading-6 text-black/70">
                            {safe(row.country)} · publication-safe governance
                            observability derived from canonical Snowflake public
                            trust infrastructure views.
                          </p>
                        </div>

                        <PublicButtonLink
                          href={`/explorer/organizations/${encodeURIComponent(
                            safe(row.organizationName)
                          )}`}
                          variant="primary"
                        >
                          Open Organization Governance Surface
                        </PublicButtonLink>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                          label="Certification Surfaces"
                          value={numberFormat(row.totalPublicRecords)}
                        />
                        <MetricCard
                          label="AI Governance Surfaces"
                          value={numberFormat(row.totalAiSystems)}
                        />
                        <MetricCard
                          label="Active Certifications"
                          value={numberFormat(row.activeCertifications)}
                        />
                        <MetricCard
                          label="Continuity Records"
                          value={numberFormat(
                            row.certificationContinuityRecords
                          )}
                        />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                          label="Renewal Due 30 Days"
                          value={numberFormat(row.renewalDue30Days)}
                        />
                        <MetricCard
                          label="Renewal Due 90 Days"
                          value={numberFormat(row.renewalDue90Days)}
                        />
                        <MetricCard
                          label="Expiring 30 Days"
                          value={numberFormat(row.expiring30Days)}
                        />
                        <MetricCard
                          label="Latest Activity"
                          value={formatDate(row.latestPublicationActivity)}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              PUBLIC TRUST BOUNDARY
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Organization governance observability is publication-safe only
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              This page does not compute public trust and does not expose
              private governance execution data. It renders only deterministic
              public projections from Snowflake.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <ul className="grid gap-2 text-[15px] leading-7 text-black/75 md:grid-cols-2">
                <li>findings</li>
                <li>evidence</li>
                <li>reviewer materials</li>
                <li>scoring internals</li>
                <li>governance execution telemetry</li>
                <li>private workflow state</li>
                <li>unpublished certification records</li>
                <li>internal governance state</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
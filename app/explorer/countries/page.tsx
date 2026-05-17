import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getExplorerCountries,
  getExplorerStats,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const COUNTRY_PAGE_LIMIT = 50;
const COUNTRY_MAX_SAFE_OFFSET = 10000;

function numberFormat(value: number): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function safe(value: string | null | undefined): string {
  return String(value ?? "").trim() || "—";
}

function toOffset(value?: string): number {
  const n = Number(value ?? 0);

  if (!Number.isFinite(n)) {
    return 0;
  }

  return Math.min(
    Math.max(Math.trunc(n), 0),
    COUNTRY_MAX_SAFE_OFFSET
  );
}

function classifyCountryRow(row: {
  organizations: number;
  publicRecords: number;
  systems: number;
}): string {
  const organizations = Number(row.organizations ?? 0);
  const publicRecords = Number(row.publicRecords ?? 0);
  const systems = Number(row.systems ?? 0);

  if (systems >= 25) {
    return "High AI Governance Jurisdictions";
  }

  if (publicRecords >= 50) {
    return "High Certification Density Jurisdictions";
  }

  if (organizations >= 15) {
    return "Multi-Organization Governance Jurisdictions";
  }

  if (organizations <= 3) {
    return "Emerging Governance Jurisdictions";
  }

  return "Active Governance Jurisdictions";
}

export default async function ExplorerCountriesPage({
  searchParams,
}: {
  searchParams?: {
    offset?: string;
  };
}) {
  const offset = toOffset(searchParams?.offset);

  const [rows, stats] = await Promise.all([
    getExplorerCountries(
      COUNTRY_PAGE_LIMIT,
      offset
    ),
    getExplorerStats(),
  ]);

  const groupedCountries = rows.reduce<
    Record<string, typeof rows>
  >((groups, row) => {
    const category = classifyCountryRow(row);

    return {
      ...groups,
      [category]: [...(groups[category] ?? []), row],
    };
  }, {});

  const orderedCountryGroups = Object.entries(
    groupedCountries
  ).sort(([a], [b]) => a.localeCompare(b));

  const hasNextPage =
    rows.length >= COUNTRY_PAGE_LIMIT;

  const previousOffset = Math.max(
    offset - COUNTRY_PAGE_LIMIT,
    0
  );

  const nextOffset =
    offset + COUNTRY_PAGE_LIMIT;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / COUNTRY GOVERNANCE INTELLIGENCE"
          title="Browse GAFAIG public governance trust surfaces by country"
          description="This page summarizes countries represented in GAFAIG public governance trust surfaces using publication-controlled deterministic Snowflake-backed explorer data."
          secondaryDescription="Only organizations and AI governance surfaces associated with explicitly published certification surfaces appear in Explorer country views."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Open Public Certification Registry
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Governance Jurisdictions
              </div>

              <div className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                {numberFormat(stats.countries)}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Organizations
              </div>

              <div className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                {numberFormat(stats.organizations)}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Country Governance Observability
            </div>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Publication-safe governance observability by jurisdiction
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Explorer country views aggregate publicly visible certification
              surface metadata from organizations that explicitly elected
              publication. Select a country to open its country-level governance
              observability surface.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[14px] text-black/70">{rows.length} shown</p>

            <div className="flex flex-wrap gap-3">
              {offset > 0 ? (
                <PublicButtonLink
                  href={`/explorer/countries?offset=${previousOffset}`}
                  variant="secondary"
                >
                  Previous
                </PublicButtonLink>
              ) : null}

              {hasNextPage ? (
                <PublicButtonLink
                  href={`/explorer/countries?offset=${nextOffset}`}
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
                  No published country governance surfaces are currently
                  available.
                </div>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  GAFAIG did not receive country rows from the canonical
                  Snowflake public explorer views.
                </p>
              </div>
            ) : (
              orderedCountryGroups.map(
                ([category, categoryRows]) => (
                  <div key={category} className="grid gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-[18px] font-semibold tracking-tight text-black">
                        {category}
                      </h3>

                      <p className="text-[13px] font-medium text-black/50">
                        {numberFormat(categoryRows.length)} jurisdictions
                      </p>
                    </div>

                    {categoryRows.map((row) => (
                      <article
                        key={row.country}
                        className="rounded-3xl border border-black/10 bg-white p-6"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                              Country Governance Observability Surface
                            </p>

                            <h3 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
                              {safe(row.country)}
                            </h3>

                            <p className="mt-2 text-[14px] leading-6 text-black/70">
                              Publication-safe country-level governance observability
                              derived from canonical Snowflake public trust
                              infrastructure views.
                            </p>
                          </div>

                          <PublicButtonLink
                            href={`/explorer/countries/${encodeURIComponent(
                              safe(row.country)
                            )}`}
                            variant="primary"
                          >
                            Open Country Governance Surface
                          </PublicButtonLink>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                              Organizations
                            </div>

                            <div className="mt-3 text-[18px] font-semibold text-black">
                              {numberFormat(row.organizations)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                              Certification Surfaces
                            </div>

                            <div className="mt-3 text-[18px] font-semibold text-black">
                              {numberFormat(row.publicRecords)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                              AI Governance Surfaces
                            </div>

                            <div className="mt-3 text-[18px] font-semibold text-black">
                              {numberFormat(row.systems)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                              Public Trust Infrastructure
                            </div>

                            <div className="mt-3 text-[18px] font-semibold text-black">
                              Deterministic
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
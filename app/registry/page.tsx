import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import {
  getRegistryFilterOptions,
  getRegistryList,
  searchRegistryRecords,
} from "@/lib/queries/registry";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = {
  q?: string;
  country?: string;
  organization?: string;
  tier?: string;
  band?: string;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US");
}

function getCertificationLabel(row: any) {
  if (row.certificationLevel) return String(row.certificationLevel);
  if (row.certifiedTier && row.certifiedBand) {
    return `${row.certifiedTier} · ${row.certifiedBand}`;
  }
  if (row.certifiedTier) return String(row.certifiedTier);
  if (row.certifiedBand) return `Band ${row.certifiedBand}`;
  if (row.certificationStatus) return String(row.certificationStatus);
  return "Certified";
}

function FilterChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-sm font-medium text-black/70">
      <span className="mr-2 text-black/40">{label}</span>
      <span className="text-black">{value}</span>
    </span>
  );
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const q = String(searchParams?.q ?? "").trim();
  const country = String(searchParams?.country ?? "").trim();
  const organization = String(searchParams?.organization ?? "").trim();
  const tier = String(searchParams?.tier ?? "").trim();
  const band = String(searchParams?.band ?? "").trim();

  const [rows, options] = await Promise.all([
    q || country || organization || tier || band
      ? searchRegistryRecords({ q, country, organization, tier, band, limit: 500 })
      : getRegistryList(500),
    getRegistryFilterOptions(),
  ]);

  const activeFilters = [
    q ? { label: "Search", value: q } : null,
    country ? { label: "Country", value: country } : null,
    organization ? { label: "Organization", value: organization } : null,
    tier ? { label: "Tier", value: tier } : null,
    band ? { label: "Band", value: band } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <main className="mx-auto max-w-[1180px] space-y-8 px-6 py-10">
      <PublicPageHero
        eyebrow="Registry of Record"
        title="Browse the GAFAIG public registry"
        description="Browse certified public trust records by organization, jurisdiction, and registry identifier."
        actions={
          <>
            <PublicButtonLink href="/explorer" variant="primary">
              Open Explorer
            </PublicButtonLink>
            <PublicButtonLink href="/verify" variant="secondary">
              Verify a record
            </PublicButtonLink>
          </>
        }
      />

      <div className="max-w-3xl text-[15px] leading-7 text-black/70">
        This record represents a verified outcome of GAFAIG’s independent review process.
      </div>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="max-w-4xl space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            How to read the registry
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            The registry is the public record of certified outcomes
          </h2>
          <p className="text-base leading-7 text-black/70">
            The Registry of Record displays certified public trust records issued
            through the GAFAIG verification engine. It is narrower than
            Explorer. Explorer can surface the broader public trust footprint,
            while the Registry of Record is reserved for certification outcomes
            that have been finalized and published.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
              <div className="text-sm font-semibold text-black">Approved</div>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Approved means a system has completed the full GAFAIG
                evaluation process, including findings, evidence review, and
                governance scoring.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
              <div className="text-sm font-semibold text-black">Certified</div>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Certified means the evaluated outcome has been finalized,
                assigned certification metadata, and published as a verifiable
                public record in the registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="space-y-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Filter registry records
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Narrow the public registry
            </h2>
          </div>

          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" method="GET">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                Search
              </label>
              <input
                name="q"
                defaultValue={q}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-black outline-none"
                placeholder="Entity, country, registry ID"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                Country
              </label>
              <select
                name="country"
                defaultValue={country}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-black outline-none"
              >
                <option value="">All countries</option>
                {options.countries.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                Organization
              </label>
              <select
                name="organization"
                defaultValue={organization}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-black outline-none"
              >
                <option value="">All organizations</option>
                {options.organizations.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                Tier
              </label>
              <select
                name="tier"
                defaultValue={tier}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-black outline-none"
              >
                <option value="">All tiers</option>
                {options.tiers.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                Band
              </label>
              <select
                name="band"
                defaultValue={band}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-black outline-none"
              >
                <option value="">All bands</option>
                {options.bands.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-end gap-3 xl:col-span-5">
              <button
                type="submit"
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Apply filters
              </button>
              <a
                href="/registry"
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Clear all
              </a>
            </div>
          </form>

          {activeFilters.length > 0 ? (
            <div className="border-t border-black/10 pt-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                Active filters
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <FilterChip
                    key={`${filter.label}:${filter.value}`}
                    label={filter.label}
                    value={filter.value}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Certified public records
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Registry directory
            </h2>
            <p className="text-base leading-7 text-black/70">
              Browse certified public trust records by organization,
              jurisdiction, and registry identifier.
            </p>
          </div>

          <div className="text-sm text-black/45">
            {rows.length} certified records
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-6 text-sm text-black/65">
            No registry records matched the current filters. Clear filters or
            broaden the search terms.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {rows.map((row: any) => {
              const certificationStatus = String(
                row.certificationStatus || ""
              ).trim();
              const decisionStatus = String(row.decisionStatus || "").trim();

              return (
                <article
                  key={row.registryId}
                  className="rounded-2xl border border-black/10 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {certificationStatus ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {certificationStatus}
                          </span>
                        ) : null}

                        {decisionStatus ? (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
                            {decisionStatus}
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <div className="text-2xl font-semibold tracking-tight text-black">
                          {row.entityName || row.registryId}
                        </div>
                        <div className="mt-1 text-sm text-black/50">
                          {(row.country || "Unknown") +
                            " · " +
                            (row.registryId || "—")}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/registry/${row.registryId}`}
                      className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                    >
                      View Certified Record
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                        Certification
                      </div>
                      <div className="mt-2 text-sm font-medium text-black">
                        {getCertificationLabel(row)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                        Certified
                      </div>
                      <div className="mt-2 text-sm font-medium text-black">
                        {formatDate(row.certifiedAt)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                        Valid from
                      </div>
                      <div className="mt-2 text-sm font-medium text-black">
                        {formatDate(row.validFrom)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                        Valid to
                      </div>
                      <div className="mt-2 text-sm font-medium text-black">
                        {formatDate(row.validTo)}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
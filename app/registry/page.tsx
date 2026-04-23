import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import {
  getRegistryFilterOptions,
  getRegistryRecords,
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

type RegistryPageRow = {
  registryId: string;
  applicationId?: string | null;
  caseId?: string | null;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  certificationStatus?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  lifecycleStatus?: string | null;
  renewalStatus?: string | null;
  publishedAt?: string | null;
};

type FilterOptions = {
  countries: string[];
  organizations: string[];
  tiers: string[];
  bands: string[];
};

function clean(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("en-US");
}

function formatLabel(value: string | null | undefined): string {
  const cleaned = clean(value);
  return cleaned || "—";
}

function getStatusLabel(row: RegistryPageRow): string {
  const certificationStatus = clean(row.certificationStatus);
  return certificationStatus || "Certified";
}

function getCertificationLabel(row: RegistryPageRow): string {
  const tier = clean(row.certifiedTier);
  const band = clean(row.certifiedBand);

  if (tier && band) return `${tier} · ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;

  const certificationStatus = clean(row.certificationStatus);
  return certificationStatus || "Certified";
}

function FilterChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-sm font-medium text-black/70">
      <span className="mr-2 text-black/40">{label}</span>
      <span className="text-black">{value}</span>
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
      <div className="text-lg font-semibold text-black">No registry records found</div>
      <p className="mt-2 text-sm leading-6 text-black/60">
        Try changing or clearing your filters to see more certified public records.
      </p>
      <div className="mt-6">
        <PublicButtonLink href="/registry" variant="secondary">
          Clear all filters
        </PublicButtonLink>
      </div>
    </div>
  );
}

function RegistryCard({ row }: { row: RegistryPageRow }) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              {getStatusLabel(row)}
            </div>

            <div>
              <h2 className="text-[26px] font-semibold tracking-tight text-black">
                {formatLabel(row.entityName)}
              </h2>
              <p className="mt-2 text-[14px] text-black/70">
                {formatLabel(row.entityType)} · {formatLabel(row.country)}
              </p>
            </div>
          </div>

          <div className="min-w-[220px] rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Registry ID
            </div>
            <div className="mt-3 break-all text-[15px] leading-7 text-black">
              {row.registryId}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Certification
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {getCertificationLabel(row)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Certified
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatDate(row.certifiedAt)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Valid From
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatDate(row.validFrom)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Valid To
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatDate(row.validTo)}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Application ID
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatLabel(row.applicationId)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Case ID
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatLabel(row.caseId)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Published
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatDate(row.publishedAt)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <PublicButtonLink href={`/registry/${row.registryId}`} variant="primary">
            Open record
          </PublicButtonLink>
          <PublicButtonLink href={`/verify/${row.registryId}`} variant="secondary">
            Verify record
          </PublicButtonLink>
          <PublicButtonLink
            href={`/api/verify/${row.registryId}`}
            variant="secondary"
          >
            View JSON proof
          </PublicButtonLink>
        </div>
      </div>
    </article>
  );
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const q = clean(searchParams?.q);
  const country = clean(searchParams?.country);
  const organization = clean(searchParams?.organization);
  const tier = clean(searchParams?.tier);
  const band = clean(searchParams?.band);

  const hasServerFilters = q.length > 0 || country.length > 0;
  const hasAnyFilters =
    hasServerFilters ||
    organization.length > 0 ||
    tier.length > 0 ||
    band.length > 0;

  const [baseRows, rawOptionsUnknown] = await Promise.all([
    hasServerFilters
      ? searchRegistryRecords({
          q,
          country,
          registryId: "",
          caseId: "",
          applicationId: "",
          limit: 500,
        })
      : getRegistryRecords(500),
    getRegistryFilterOptions(),
  ]);

  const rawOptions = rawOptionsUnknown as {
    countries?: string[];
    organizations?: string[];
    tiers?: string[];
    bands?: string[];
  };

  const rows = (baseRows as RegistryPageRow[]).filter((row) => {
    const matchesOrganization =
      !organization ||
      clean(row.entityName).toLowerCase() === organization.toLowerCase();

    const matchesTier =
      !tier || clean(row.certifiedTier).toLowerCase() === tier.toLowerCase();

    const matchesBand =
      !band || clean(row.certifiedBand).toLowerCase() === band.toLowerCase();

    return matchesOrganization && matchesTier && matchesBand;
  });

  const options: FilterOptions = {
    countries: Array.isArray(rawOptions?.countries) ? rawOptions.countries : [],
    organizations: Array.isArray(rawOptions?.organizations)
      ? rawOptions.organizations
      : [],
    tiers: Array.isArray(rawOptions?.tiers) ? rawOptions.tiers : [],
    bands: Array.isArray(rawOptions?.bands) ? rawOptions.bands : [],
  };

  const activeFilters = [
    q ? { label: "Search", value: q } : null,
    country ? { label: "Country", value: country } : null,
    organization ? { label: "Organization", value: organization } : null,
    tier ? { label: "Tier", value: tier } : null,
    band ? { label: "Band", value: band } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="Registry of Record"
          title="Browse the GAFAIG public registry"
          description="Browse independently verifiable public certification records by organization, jurisdiction, and registry identifier."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Open Explorer
              </PublicButtonLink>
              <PublicButtonLink href="/verify" variant="secondary">
                Verify a Record
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              How to read the registry
            </div>
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              The registry is the public index of certified records
            </h2>
            <p className="text-[15px] leading-7 text-black/75">
              Each entry in the Registry of Record represents a published GAFAIG
              public certification record that can be independently verified
              outside the originating organization’s platform.
            </p>
            <p className="text-[15px] leading-7 text-black/75">
              The Registry of Record is reserved for public certification records
              that have already been finalized and published. Internal workflow
              approval remains upstream. The public registry only exposes the
              certified trust surface.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="space-y-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Filter registry records
              </div>
              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                Narrow the certified public record index
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
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black outline-none"
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
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black outline-none"
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
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black outline-none"
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
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black outline-none"
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
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black outline-none"
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

                <Link
                  href="/registry"
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  Clear all
                </Link>
              </div>
            </form>

            {activeFilters.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {activeFilters.map((filter) => (
                  <FilterChip
                    key={`${filter.label}-${filter.value}`}
                    label={filter.label}
                    value={filter.value}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Certified records
                </div>
                <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                  {rows.length} public {rows.length === 1 ? "record" : "records"}
                </h2>
              </div>
            </div>

            {!hasAnyFilters && rows.length === 0 ? (
              <EmptyState />
            ) : rows.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-6">
                {rows.map((row) => (
                  <RegistryCard key={row.registryId} row={row} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
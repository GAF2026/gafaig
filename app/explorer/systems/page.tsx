export const dynamic = "force-dynamic";
export const revalidate = 0;

import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getRegistryAiSystemsPaginated } from "@/lib/queries/registry-ai-systems";

type SearchParams = {
  page?: string;
  pageSize?: string;
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

function safeText(value: string | null | undefined, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function trustPillClass(label: string) {
  const normalized = label.trim().toUpperCase();

  if (normalized === "CERTIFIED") return "bg-emerald-100 text-emerald-700";
  if (normalized === "APPROVED") return "bg-blue-100 text-blue-700";

  return "bg-neutral-100 text-black/65";
}

function riskPillClass(label: string) {
  const normalized = label.trim().toUpperCase();

  if (normalized === "HIGH") return "bg-red-100 text-red-700";
  if (normalized === "MEDIUM") return "bg-amber-100 text-amber-700";
  if (normalized === "LOW") return "bg-emerald-100 text-emerald-700";

  return "bg-neutral-100 text-black/65";
}

function MetricCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-black">{value}</div>
    </div>
  );
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

export default async function ExplorerSystemsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const q = String(searchParams?.q ?? "").trim();
  const country = String(searchParams?.country ?? "").trim();
  const organization = String(searchParams?.organization ?? "").trim();
  const tier = String(searchParams?.tier ?? "").trim();
  const band = String(searchParams?.band ?? "").trim();

  const pageSize = Math.max(1, Number(searchParams?.pageSize || "200") || 200);

  const result = await getRegistryAiSystemsPaginated({ page: 1, pageSize });
  const allRows = result.rows ?? [];

  const filterValue = (value: unknown) => String(value ?? "").trim();

  const filteredRows = allRows.filter((row: any) => {
    const haystack = [
      row.systemName,
      row.developerOrganization,
      row.entityName,
      row.country,
      row.systemType,
      row.intendedUse,
      row.certifiedTier,
      row.certifiedBand,
      row.registryId,
      row.systemId,
    ]
      .map((v) => filterValue(v).toLowerCase())
      .join(" ");

    if (q && !haystack.includes(q.toLowerCase())) return false;
    if (country && filterValue(row.country).toLowerCase() !== country.toLowerCase()) return false;
    if (
      organization &&
      filterValue(row.developerOrganization || row.entityName).toLowerCase() !==
        organization.toLowerCase()
    ) {
      return false;
    }
    if (tier && filterValue(row.certifiedTier).toLowerCase() !== tier.toLowerCase()) return false;
    if (band && filterValue(row.certifiedBand).toLowerCase() !== band.toLowerCase()) return false;

    return true;
  });

  const countries = Array.from(
    new Set(allRows.map((r: any) => filterValue(r.country)).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const organizations = Array.from(
    new Set(
      allRows
        .map((r: any) => filterValue(r.developerOrganization || r.entityName))
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  const tiers = Array.from(
    new Set(allRows.map((r: any) => filterValue(r.certifiedTier)).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const bands = Array.from(
    new Set(allRows.map((r: any) => filterValue(r.certifiedBand)).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

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
        eyebrow="Explorer Systems"
        title="Public AI systems in the GAFAIG trust surface"
      />

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="max-w-4xl space-y-4">
          <p className="text-base leading-7 text-black/70">
            This page lists publicly visible AI systems linked to certified
            GAFAIG registry records. It is the systems view of the public trust
            surface.
          </p>
          <p className="text-base leading-7 text-black/70">
            Approved-only workflow records remain private. Systems shown here
            are tied to certified and published registry outcomes only.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <PublicButtonLink href="/explorer">Back to Explorer</PublicButtonLink>
            <PublicButtonLink href="/registry/ai-systems">
              AI Systems Registry
            </PublicButtonLink>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="space-y-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Filter systems
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Narrow the public systems surface
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
                placeholder="System, org, country, tier"
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
                {countries.map((value) => (
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
                {organizations.map((value) => (
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
                {tiers.map((value) => (
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
                {bands.map((value) => (
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
                href="/explorer/systems"
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

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Systems shown
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {filteredRows.length}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Total systems
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {allRows.length}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Countries in view
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {new Set(filteredRows.map((row: any) => safeText(row.country, ""))).size}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Organizations in view
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {
              new Set(
                filteredRows.map((row: any) =>
                  safeText(row.developerOrganization || row.entityName, "")
                )
              ).size
            }
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Public systems directory
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Certified public AI systems
            </h2>
            <p className="text-base leading-7 text-black/70">
              Browse public AI systems linked to certified registry records,
              including organization, country, trust state, and registry
              linkage.
            </p>
          </div>

          <div className="text-sm text-black/45">{filteredRows.length} shown</div>
        </div>

        {filteredRows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-6 text-sm text-black/65">
            No systems matched the current filters. Clear filters or broaden the
            search terms.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredRows.map((row: any) => {
              const certificationStatus = safeText(row.certificationStatus, "");
              const decisionStatus = safeText(row.decisionStatus, "");
              const riskTier = safeText(row.riskTier, "");
              const certificationLabel =
                row.certifiedTier && row.certifiedBand
                  ? `${row.certifiedTier} ${row.certifiedBand}`
                  : safeText(row.certifiedTier);

              return (
                <article
                  key={row.systemId}
                  className="rounded-2xl border border-black/10 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {certificationStatus ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${trustPillClass(
                              certificationStatus
                            )}`}
                          >
                            {certificationStatus}
                          </span>
                        ) : null}

                        {decisionStatus ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${trustPillClass(
                              decisionStatus
                            )}`}
                          >
                            {decisionStatus}
                          </span>
                        ) : null}

                        {riskTier ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${riskPillClass(
                              riskTier
                            )}`}
                          >
                            {riskTier} risk
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <div className="text-2xl font-semibold tracking-tight text-black">
                          {safeText(row.systemName)}
                        </div>
                        <div className="mt-1 text-sm text-black/50">
                          {safeText(row.entityName)} · {safeText(row.country)} ·{" "}
                          {safeText(row.systemId)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`/registry/ai-systems/${encodeURIComponent(
                          row.systemId
                        )}`}
                        className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                      >
                        System Detail
                      </a>

                      <a
                        href={`/registry/${encodeURIComponent(row.registryId)}`}
                        className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                      >
                        View Certified Record
                      </a>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCell
                      label="Organization"
                      value={safeText(
                        row.developerOrganization || row.entityName
                      )}
                    />
                    <MetricCell
                      label="System type"
                      value={safeText(row.systemType)}
                    />
                    <MetricCell
                      label="Intended use"
                      value={safeText(row.intendedUse)}
                    />
                    <MetricCell
                      label="Deployment"
                      value={safeText(row.deploymentStatus)}
                    />
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCell
                      label="Certification"
                      value={certificationLabel}
                    />
                    <MetricCell
                      label="Certified"
                      value={formatDate(row.certifiedAt)}
                    />
                    <MetricCell
                      label="Oversight"
                      value={safeText(row.oversightLevel)}
                    />
                    <MetricCell
                      label="Lifecycle"
                      value={safeText(row.lifecycleStatus)}
                    />
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
export const dynamic = "force-dynamic";
export const revalidate = 0;

import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";

import {
  getExplorerSummary,
  getExplorerOrganizations,
  getExplorerCountries,
  getExplorerSystems,
  getRecentRegistryRecords,
} from "@/lib/queries/explorer";

function formatDate(value: unknown): string {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US");
}

export default async function ExplorerPage() {
  const [summary, organizations, countries, systems, recentRecords] =
    await Promise.all([
      getExplorerSummary(),
      getExplorerOrganizations(6),
      getExplorerCountries(6),
      getExplorerSystems(8),
      getRecentRegistryRecords(8),
    ]);

  return (
    <main className="mx-auto max-w-[1180px] space-y-8 px-6 py-10">
      <PublicPageHero
        eyebrow="Public Trust Surface"
        title="Explore the public GAFAIG trust surface"
      />

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="max-w-4xl space-y-4">
          <p className="text-base leading-7 text-black/70">
            Explorer shows the broader public governance footprint across
            organizations, countries, and publicly surfaced records in the
            GAFAIG network.
          </p>
          <p className="text-base leading-7 text-black/70">
            Public registry visibility includes only certified and published
            records.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <PublicButtonLink href="/registry">View Registry</PublicButtonLink>
            <PublicButtonLink href="/explorer/organizations">
              Organizations
            </PublicButtonLink>
            <PublicButtonLink href="/explorer/countries">
              Countries
            </PublicButtonLink>
            <PublicButtonLink href="/registry/ai-systems">
              AI Systems
            </PublicButtonLink>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="max-w-4xl space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            How to read Explorer
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Certified and published records appear in the public trust surface
          </h2>
          <p className="text-base leading-7 text-black/70">
            Explorer is broader than a single Registry of Record detail page,
            but it still follows the public trust policy. Only records that have
            completed publication are shown here.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
              <div className="text-sm font-semibold text-black">Certified</div>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Certified means the evaluated outcome has been finalized,
                published into the GAFAIG registry, assigned certification
                metadata, and surfaced as a public record.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
              <div className="text-sm font-semibold text-black">
                Explorer visibility
              </div>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Approved-only workflow records remain private. Explorer and the
                public registry reflect published trust records only.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Public records
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {summary.certifiedCount}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Certified
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {summary.certifiedCount}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Organizations
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {summary.totalOrganizations}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Countries
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {summary.totalCountries}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Systems
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {summary.totalSystems}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Latest public records
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Public records currently visible in Explorer
            </h2>
            <p className="max-w-3xl text-base leading-7 text-black/70">
              This view surfaces public registry metadata across entities and
              certification state without exposing private reviewer materials.
            </p>
          </div>
          <div className="text-sm text-black/45">{recentRecords.length} shown</div>
        </div>

        <div className="mt-6 space-y-4">
          {recentRecords.map((record: any) => (
            <div
              key={record.REGISTRY_ID}
              className="rounded-2xl border border-black/10 bg-white p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Certified
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
                      {record.DECISION_STATUS ?? "APPROVED"}
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-black">
                      {record.ENTITY_NAME}
                    </div>
                    <div className="mt-1 text-sm text-black/50">
                      {record.COUNTRY ?? "Unknown"} · {record.REGISTRY_ID}
                    </div>
                  </div>
                </div>

                <a
                  href={`/registry/${record.REGISTRY_ID}`}
                  className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  View Certified Record
                </a>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                    Certification
                  </div>
                  <div className="mt-2 text-sm font-medium text-black">
                    {record.CERTIFIED_TIER ?? "—"}
                    {record.CERTIFIED_BAND ? ` · ${record.CERTIFIED_BAND}` : ""}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                    Certified
                  </div>
                  <div className="mt-2 text-sm font-medium text-black">
                    {formatDate(record.CERTIFIED_AT)}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                    Valid from
                  </div>
                  <div className="mt-2 text-sm font-medium text-black">
                    {formatDate(record.VALID_FROM)}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
                    Valid to
                  </div>
                  <div className="mt-2 text-sm font-medium text-black">
                    {formatDate(record.VALID_TO)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Top organizations
          </h2>
          <PublicButtonLink href="/explorer/organizations">
            View all
          </PublicButtonLink>
        </div>

        <div className="space-y-3">
          {organizations.map((org) => (
            <div
              key={org.organization}
              className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-lg font-medium text-black">
                  {org.organization}
                </div>
                <div className="mt-1 text-sm text-black/55">
                  {org.country ?? "Unknown"}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-black/65">
                <span className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1">
                  {org.systemCount} systems
                </span>
                <span className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1">
                  {org.registryCount} registry records
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Countries
          </h2>
          <PublicButtonLink href="/explorer/countries">
            View all
          </PublicButtonLink>
        </div>

        <div className="space-y-3">
          {countries.map((country) => (
            <div
              key={country.country}
              className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="text-lg font-medium text-black">
                {country.country}
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-black/65">
                <span className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1">
                  {country.organizationCount} organizations
                </span>
                <span className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1">
                  {country.systemCount} systems
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            AI systems
          </h2>
          <PublicButtonLink href="/explorer/systems">
            View all
          </PublicButtonLink>
        </div>

        <div className="space-y-3">
          {systems.map((system) => (
            <div
              key={system.systemId}
              className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-lg font-medium text-black">
                  {system.systemName}
                </div>
                <div className="mt-1 text-sm text-black/55">
                  {system.entityName} · {system.country}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-sm text-black/65">
                  {system.certifiedTier ?? "—"}
                  {system.certifiedBand ? ` ${system.certifiedBand}` : ""}
                </span>
                <a
                  href={`/registry/${system.registryId}`}
                  className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  View Certified Record
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
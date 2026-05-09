import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getExplorerCountries,
  getExplorerStats,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function numberFormat(value: number): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function safe(value: string | null | undefined): string {
  return String(value ?? "").trim() || "—";
}

export default async function ExplorerCountriesPage() {
  const [rows, stats] = await Promise.all([
    getExplorerCountries(250),
    getExplorerStats(),
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / COUNTRIES"
          title="Browse the GAFAIG public trust surface by country"
          description="This page summarizes countries represented in the GAFAIG public trust surface using publication-controlled Snowflake-backed explorer data."
          secondaryDescription="Only organizations and systems associated with explicitly published certification records appear in Explorer country views."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Open Registry
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Countries
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
              Country Governance Intelligence
            </div>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Public governance observability by country
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Explorer country views aggregate publicly visible certification
              metadata from organizations that explicitly elected publication.
              Select a country to open its country-level governance intelligence
              profile.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <p className="text-[14px] text-black/70">{rows.length} shown</p>
          </div>

          <div className="mt-6 grid gap-4">
            {rows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
                <div className="text-lg font-semibold text-black">
                  No published country records are currently available.
                </div>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  GAFAIG did not receive country rows from the canonical
                  Snowflake public explorer views.
                </p>
              </div>
            ) : (
              rows.map((row) => (
                <article
                  key={row.country}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                        Country Intelligence Profile
                      </p>

                      <h3 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
                        {safe(row.country)}
                      </h3>

                      <p className="mt-2 text-[14px] leading-6 text-black/70">
                        Publication-safe country-level governance observability
                        derived from canonical Snowflake public registry views.
                      </p>
                    </div>

                    <PublicButtonLink
                      href={`/explorer/countries/${encodeURIComponent(
                        safe(row.country)
                      )}`}
                      variant="primary"
                    >
                      Open Country Intelligence
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
                        Public Records
                      </div>

                      <div className="mt-3 text-[18px] font-semibold text-black">
                        {numberFormat(row.publicRecords)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                        Systems
                      </div>

                      <div className="mt-3 text-[18px] font-semibold text-black">
                        {numberFormat(row.systems)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                        Governance Surface
                      </div>

                      <div className="mt-3 text-[18px] font-semibold text-black">
                        Publication-safe
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
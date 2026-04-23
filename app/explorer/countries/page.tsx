import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import { getExplorerCountries, getExplorerStats } from "@/lib/queries/explorer";

function numberFormat(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExplorerCountriesPage() {
  const [rows, stats] = await Promise.all([
    getExplorerCountries(250),
    getExplorerStats(),
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="Explorer"
          title="Browse certified public trust records by country"
          description="This page summarizes countries represented in the GAFAIG public trust surface using Snowflake-backed explorer data."
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
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Country Table
              </div>
              <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
                Public trust footprint by country
              </h2>
            </div>
            <p className="text-[14px] text-black/70">{rows.length} shown</p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-0 border-b border-black/10 bg-black/[0.02] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              <div>Country</div>
              <div>Organizations</div>
              <div>Public Records</div>
              <div>Systems</div>
            </div>

            <div className="divide-y divide-black/10">
              {rows.map((row) => (
                <div
                  key={row.country}
                  className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-0 px-6 py-5 text-[15px] leading-7 text-black/75"
                >
                  <div className="font-semibold text-black">{row.country}</div>
                  <div>{numberFormat(row.organizations)}</div>
                  <div>{numberFormat(row.publicRecords)}</div>
                  <div>{numberFormat(row.systems)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
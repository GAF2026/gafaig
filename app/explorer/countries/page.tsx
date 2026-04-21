import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getExplorerCountries } from "@/lib/queries/explorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExplorerCountriesPage() {
  const rows = await getExplorerCountries(250);

  return (
    <main className="bg-[#f5f7fb] text-[#111111]">
      <PublicPageHero
        eyebrow="Country explorer"
        title="Browse certified public trust records by country"
        description="This page summarizes countries represented in the current GAFAIG public trust surface using Snowflake-backed explorer data."
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

      <section className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-6 pb-16 pt-2 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Countries
            </div>
            <div className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-black">
              {rows.length}
            </div>
          </article>

          <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Organizations represented
            </div>
            <div className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-black">
              {rows.reduce((sum, row) => sum + row.organizations, 0)}
            </div>
          </article>

          <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Certified records
            </div>
            <div className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-black">
              {rows.reduce((sum, row) => sum + row.records, 0)}
            </div>
          </article>
        </div>

        <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
                Country table
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-black">
                Public trust footprint by country
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-black/65">
                Countries are ordered by the number of currently visible public
                trust records in the explorer surface.
              </p>
            </div>

            <div className="text-sm text-black/45">{rows.length} shown</div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[24px] border border-black/10">
            <table className="min-w-full border-collapse">
              <thead className="bg-black/[0.03]">
                <tr>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                    Country
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                    Organizations
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                    Certified records
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-10 text-center text-[15px] text-black/55"
                    >
                      No countries are currently visible in the public explorer.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.country}
                      className="border-t border-black/10 bg-white"
                    >
                      <td className="px-4 py-4 text-[15px] font-medium text-black">
                        {row.country}
                      </td>
                      <td className="px-4 py-4 text-[15px] text-black/75">
                        {row.organizations}
                      </td>
                      <td className="px-4 py-4 text-[15px] text-black/75">
                        {row.records}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
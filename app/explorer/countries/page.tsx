import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getExplorerCountries } from "@/lib/queries/explorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExplorerCountriesPage() {
  const rows = await getExplorerCountries(250);

  const totalCountries = rows.length;
  const totalOrganizations = rows.reduce(
    (sum, row) => sum + (row.organizations ?? 0),
    0
  );

  return (
    <main className="bg-[#f5f7fb] text-[#111111]">
      <PublicPageHero
        eyebrow="Country explorer"
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

      <section className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-6 pb-16 pt-2 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[28px] border border-black/10 bg-white p-6">
            <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
              Countries
            </div>
            <div className="mt-3 text-4xl font-semibold">{totalCountries}</div>
          </article>

          <article className="rounded-[28px] border border-black/10 bg-white p-6">
            <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
              Organizations
            </div>
            <div className="mt-3 text-4xl font-semibold">
              {totalOrganizations}
            </div>
          </article>
        </div>

        <section className="rounded-[32px] border border-black/10 bg-white p-6 md:p-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                Country table
              </div>
              <h2 className="mt-2 text-3xl font-semibold">
                Public trust footprint by country
              </h2>
            </div>
            <div className="text-sm text-black/45">{rows.length} shown</div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[24px] border border-black/10">
            <table className="min-w-full">
              <thead className="bg-black/[0.03]">
                <tr>
                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-black/45">
                    Country
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-black/45">
                    Organizations
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.country} className="border-t border-black/10">
                    <td className="px-4 py-4 text-[15px] text-black/80">
                      {row.country}
                    </td>
                    <td className="px-4 py-4 text-[15px] text-black/80">
                      {row.organizations ?? 0}
                    </td>
                  </tr>
                ))}

                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-10 text-center text-sm text-black/45"
                    >
                      No countries found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
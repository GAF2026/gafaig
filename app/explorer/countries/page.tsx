import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getExplorerCountries } from "@/lib/queries/explorer";

export const revalidate = 300;

export default async function ExplorerCountriesPage() {
  const rows = await getExplorerCountries(200);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER"
          title="Countries"
          description="Public country-level visibility across the GAFAIG trust surface."
          secondaryDescription="This explorer surface includes both evaluated (Approved) and publicly trusted (Certified) records across countries, showing how GAFAIG’s public trust layer is distributed by geography, organizations, registry records, and visible AI systems."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="primary">
                View Registry
              </PublicButtonLink>

              <PublicButtonLink href="/explorer" variant="secondary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/organizations"
                variant="secondary"
              >
                Organizations
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/systems" variant="secondary">
                Systems
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="max-w-[980px] space-y-3 text-[15px] leading-[1.8] text-black/65">
            <p>
              Explorer distinguishes between evaluated country presence and publicly trusted country presence.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <div className="grid gap-3 text-[15px] leading-[1.8] text-black/72">
                <div>
                  <span className="font-semibold text-black">Approved</span>{" "}
                  means a country may contain organizations or systems that have completed the GAFAIG evaluation process and received governance decisions, even if those records are not yet published as certified public records.
                </div>

                <div>
                  <span className="font-semibold text-black">Certified</span>{" "}
                  means a country contains finalized, published GAFAIG trust records that appear in the registry of record.
                </div>
              </div>
            </div>

            <p className="text-black/60">
              This countries view may include both Approved and Certified records. The Registry of Record shows Certified records only.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                COUNTRY DIRECTORY
              </div>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Public country coverage in the trust surface
              </h2>

              <p className="mt-3 max-w-[820px] text-[15px] leading-[1.8] text-black/68">
                Browse country-level representation across the GAFAIG public trust surface.
              </p>
            </div>

            <div>
              <PublicButtonLink href="/registry" variant="secondary">
                Open Full Registry
              </PublicButtonLink>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-left text-[12px] uppercase tracking-[0.16em] text-black/55">
                  <th className="px-0 py-3">Country</th>
                  <th className="px-4 py-3">Organizations</th>
                  <th className="px-4 py-3">Registry Records</th>
                  <th className="px-4 py-3">Systems</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.country ?? "unknown"}
                    className="border-b border-black/5"
                  >
                    <td className="px-0 py-4 font-semibold text-black">
                      {row.country ?? "Unknown"}
                    </td>

                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.organizationCount}
                    </td>

                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.registryCount}
                    </td>

                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.systemCount}
                    </td>
                  </tr>
                ))}

                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-0 py-8 text-sm text-black/60">
                      No countries found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-6">
            <PublicButtonLink href="/explorer" variant="secondary">
              Explorer
            </PublicButtonLink>

            <PublicButtonLink
              href="/explorer/organizations"
              variant="secondary"
            >
              Organizations
            </PublicButtonLink>

            <PublicButtonLink href="/explorer/systems" variant="secondary">
              Systems
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
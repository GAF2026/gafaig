import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import { getExplorerOrganizations } from "@/lib/queries/explorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExplorerOrganizationsPage() {
  const rows = await getExplorerOrganizations(250);

  return (
    <main className="bg-[#f5f7fb] text-[#111111]">
      <PublicPageHero
        eyebrow="Organizations"
        title="Explore organizations in the GAFAIG public trust surface"
        description="Browse organizations currently surfaced through the Snowflake-backed public registry views."
        actions={
          <>
            <PublicButtonLink href="/explorer" variant="primary">
              Back to Explorer
            </PublicButtonLink>
            <PublicButtonLink href="/registry" variant="secondary">
              View Registry
            </PublicButtonLink>
          </>
        }
      />

      <section className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-6 pb-16 pt-2 md:px-8">
        <section className="rounded-[32px] border border-black/10 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                Public organizations
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-black">
                Organizations currently visible in Explorer
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-black/65">
                This list reflects organizations currently surfaced by the GAFAIG
                Snowflake-backed public trust views.
              </p>
            </div>

            <div className="rounded-[24px] border border-black/10 bg-[#f8fafc] px-5 py-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                Organizations
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-black">
                {rows.length}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-6 md:p-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                Directory
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-black">
                Public organization directory
              </h3>
            </div>

            <div className="text-sm text-black/45">{rows.length} shown</div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-black/10">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-black/[0.03]">
                    <th className="px-4 py-4 text-left text-[11px] uppercase tracking-[0.24em] text-black/45">
                      Organization
                    </th>
                    <th className="px-4 py-4 text-left text-[11px] uppercase tracking-[0.24em] text-black/45">
                      Country
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length > 0 ? (
                    rows.map((row) => (
                      <tr
                        key={`${row.entityName}-${row.country ?? "unknown"}`}
                        className="border-t border-black/10"
                      >
                        <td className="px-4 py-4 text-[15px] text-black/80">
                          {row.entityName}
                        </td>
                        <td className="px-4 py-4 text-[15px] text-black/65">
                          {row.country ?? "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-10 text-center text-sm text-black/45"
                      >
                        No organizations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
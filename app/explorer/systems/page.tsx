import Link from "next/link";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getExplorerSystems } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExplorerSystemsPage() {
  const rows = await getExplorerSystems(200);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER"
          title="AI systems"
          description="Public AI systems surfaced through the registry’s canonical systems view."
          secondaryDescription="This explorer surface shows publicly disclosed AI systems connected to the GAFAIG trust layer, including visible system metadata and links back to associated public registry records when available."
          actions={
            <>
              <PublicButtonLink href="/registry/ai-systems" variant="primary">
                Open AI Systems Registry
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

              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Countries
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                SYSTEM DIRECTORY
              </div>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Public AI systems in the registry
              </h2>

              <p className="mt-3 max-w-[820px] text-[15px] leading-[1.8] text-black/68">
                Browse AI systems currently surfaced through the GAFAIG public
                trust layer.
              </p>
            </div>

            <div>
              <PublicButtonLink href="/registry/ai-systems" variant="secondary">
                Open Full AI Systems Registry
              </PublicButtonLink>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-left text-[12px] uppercase tracking-[0.16em] text-black/55">
                  <th className="px-0 py-4">System</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Developer</th>
                  <th className="px-4 py-4">Deployment</th>
                  <th className="px-4 py-4">Risk tier</th>
                  <th className="px-4 py-4">Registry</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.systemId}
                    className="border-b border-black/5 align-top"
                  >
                    <td className="px-0 py-5">
                      <div className="text-[16px] font-semibold text-black">
                        {row.systemName}
                      </div>
                      <div className="mt-1 text-[14px] text-black/55">
                        {row.systemId}
                      </div>
                    </td>

                    <td className="px-4 py-5 text-[15px] text-black/75">
                      {row.systemType ?? "—"}
                    </td>

                    <td className="px-4 py-5 text-[15px] text-black/75">
                      {row.developerOrganization ?? "—"}
                    </td>

                    <td className="px-4 py-5 text-[15px] text-black/75">
                      {row.deploymentStatus ?? "—"}
                    </td>

                    <td className="px-4 py-5 text-[15px] text-black/75">
                      {row.riskTier ?? "—"}
                    </td>

                    <td className="px-4 py-5 text-[15px]">
                      {row.registryId ? (
                        <Link
                          href={`/registry/${row.registryId}`}
                          className="font-semibold text-black underline underline-offset-4"
                        >
                          {row.registryId}
                        </Link>
                      ) : (
                        <span className="text-black/55">—</span>
                      )}
                    </td>
                  </tr>
                ))}

                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-0 py-10 text-[15px] text-black/60">
                      No AI systems found.
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

            <PublicButtonLink href="/explorer/countries" variant="secondary">
              Countries
            </PublicButtonLink>

            <PublicButtonLink href="/registry/ai-systems" variant="secondary">
              AI Systems Registry
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
import Link from "next/link";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getExplorerSystems } from "@/lib/queries/explorer";

export default async function ExplorerSystemsPage() {
  const rows = await getExplorerSystems(200);

  return (
    <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-14 md:px-8">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            EXPLORER
          </div>

          <h1 className="mt-4 max-w-[980px] text-[32px] font-semibold leading-[1.08] tracking-tight text-black md:text-[64px]">
            AI systems
          </h1>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.85] text-black/75 md:text-[18px]">
            Public AI systems surfaced through the registry&apos;s canonical
            systems view.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <PublicButtonLink href="/explorer" variant="secondary">
              Back to explorer
            </PublicButtonLink>
            <PublicButtonLink href="/registry/ai-systems" variant="primary">
              Open AI systems registry
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-left text-[12px] uppercase tracking-[0.16em] text-black/55">
                  <th className="px-0 py-3">System</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Developer</th>
                  <th className="px-4 py-3">Deployment</th>
                  <th className="px-4 py-3">Oversight</th>
                  <th className="px-4 py-3">Risk tier</th>
                  <th className="px-4 py-3">Registry</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.systemId}
                    className="border-b border-black/5 align-top"
                  >
                    <td className="px-0 py-4">
                      <div className="font-semibold text-black">
                        {row.systemName}
                      </div>
                      <div className="mt-1 text-sm text-black/60">
                        {row.systemId}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.systemType ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.developerOrganization ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.deploymentStatus ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.oversightModel ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.riskTier ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.registryId ? (
                        <Link
                          href={`/registry/${encodeURIComponent(row.registryId)}`}
                          className="font-semibold underline underline-offset-4"
                        >
                          {row.registryId}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}

                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-0 py-8 text-sm text-black/60">
                      No AI systems found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-6">
            <PublicButtonLink href="/explorer/organizations" variant="secondary">
              Organizations
            </PublicButtonLink>
            <PublicButtonLink href="/explorer/countries" variant="secondary">
              Countries
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
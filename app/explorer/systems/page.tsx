import Link from "next/link";
import { getExplorerSystems } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExplorerSystemsPage() {
  const rows = await getExplorerSystems(200);

  return (
    <main className="px-6 py-12 md:px-10 xl:px-14">
      <section className="rounded-[32px] border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
          Explorer
        </div>

        <h1 className="mt-4 max-w-5xl text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-black md:text-[56px]">
          AI systems
        </h1>

        <p className="mt-6 max-w-4xl text-[18px] leading-[1.7] text-black/70 md:text-[20px]">
          Public AI systems surfaced through the registry’s canonical systems
          view.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explorer"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 text-[15px] font-semibold text-black transition hover:bg-black/[0.04]"
          >
            Back to explorer
          </Link>

          <Link
            href="/registry/ai-systems"
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-black/90"
          >
            Open AI systems registry
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-[32px] border border-black/10 bg-white p-8 md:p-10">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-left text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
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
                  className="border-b border-black/6 align-top last:border-b-0"
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
                        className="font-semibold text-black underline decoration-black/20 underline-offset-4 hover:decoration-black"
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
      </section>
    </main>
  );
}
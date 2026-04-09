import Link from "next/link";
import { getExplorerSystems } from "@/lib/queries/explorer";

export default async function ExplorerSystemsPage() {
  const rows = await getExplorerSystems(200);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="rounded-[32px] border border-black/10 bg-white p-8">
        <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
          Explorer
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black">
          AI systems
        </h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-8 text-black/70">
          Public AI systems surfaced through the registry’s canonical systems
          view.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/explorer"
            className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Back to explorer
          </Link>
          <Link
            href="/registry/ai-systems"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Open AI systems registry
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-[32px] border border-black/10 bg-white p-8">
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
                <tr key={row.systemId} className="border-b border-black/5">
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
                    {row.oversightLevel ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {row.riskTier ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {row.registryId ? (
                      <Link
                        href={`/registry/${row.registryId}`}
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
                  <td
                    colSpan={7}
                    className="px-0 py-8 text-sm text-black/60"
                  >
                    No systems found.
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
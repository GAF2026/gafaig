import Link from "next/link";
import { getExplorerSummary, getRecentRegistryRecords } from "@/lib/queries/explorer";

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ExplorerPage() {
  const [summary, recentRecords] = await Promise.all([
    getExplorerSummary(),
    getRecentRegistryRecords(10),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12">
      <section className="rounded-[32px] border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
          Global explorer
        </div>

        <h1 className="mt-4 max-w-5xl text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] text-black md:text-[56px]">
          Explore the public GAFAIG trust surface.
        </h1>

        <p className="mt-6 max-w-4xl text-[16px] leading-8 text-black/72 md:text-[18px]">
          Discover public certification records across organizations, countries,
          and AI systems using the canonical registry views published from
          Snowflake.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/registry"
            className="inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            View registry
          </Link>
          <Link
            href="/explorer/organizations"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Organizations
          </Link>
          <Link
            href="/explorer/systems"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Systems
          </Link>
          <Link
            href="/explorer/countries"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Countries
          </Link>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] border border-black/10 bg-white p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
            Registry records
          </div>
          <div className="mt-4 text-5xl font-semibold leading-none text-black">
            {summary.totalRecords}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
            Organizations
          </div>
          <div className="mt-4 text-5xl font-semibold leading-none text-black">
            {summary.totalOrganizations}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
            Countries
          </div>
          <div className="mt-4 text-5xl font-semibold leading-none text-black">
            {summary.totalCountries}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
            AI systems
          </div>
          <div className="mt-4 text-5xl font-semibold leading-none text-black">
            {summary.totalSystems}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[32px] border border-black/10 bg-white p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
              Recent registry activity
            </div>
            <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.02em] text-black">
              Latest public records
            </h2>
          </div>

          <Link
            href="/registry"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-4 py-2 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Open full registry
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-left text-[12px] uppercase tracking-[0.16em] text-black/55">
                <th className="px-0 py-3">Entity</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Tier / Band</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Certified</th>
                <th className="px-4 py-3">Record</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((row) => (
                <tr key={row.registryId} className="border-b border-black/5 align-top">
                  <td className="px-0 py-4">
                    <div className="font-semibold text-black">
                      {row.entityName ?? "—"}
                    </div>
                    <div className="mt-1 text-sm text-black/60">{row.registryId}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {row.country ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {[row.certifiedTier, row.certifiedBand].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {row.decisionStatus ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {formatDate(row.certifiedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/registry/${row.registryId}`}
                      className="text-sm font-semibold text-black underline underline-offset-4"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}

              {recentRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-0 py-8 text-sm text-black/60">
                    No explorer records found.
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
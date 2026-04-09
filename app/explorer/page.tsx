import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import {
  getExplorerSummary,
  getRecentRegistryRecords,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";

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
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="GLOBAL EXPLORER"
          title="Explore the public GAFAIG trust surface."
          description="Discover public certification records across organizations, countries, and AI systems using the canonical registry views published from Snowflake."
          secondaryDescription="The explorer provides a public discovery layer across the GAFAIG network so third parties can inspect governance presence, review recent certifications, and navigate linked records without accessing private evidence or internal reviewer workflow."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="primary">
                View Registry
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

              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Countries
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Registry records" value={String(summary.totalRecords)} />
          <MetricCard
            label="Organizations"
            value={String(summary.totalOrganizations)}
          />
          <MetricCard label="Countries" value={String(summary.totalCountries)} />
          <MetricCard label="AI systems" value={String(summary.totalSystems)} />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                RECENT REGISTRY ACTIVITY
              </div>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Latest public records
              </h2>

              <p className="mt-3 max-w-[820px] text-[15px] leading-[1.8] text-black/68">
                Recently surfaced certification records from the GAFAIG public
                registry.
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
                  <tr key={row.registryId} className="border-b border-black/5">
                    <td className="px-0 py-4">
                      <div className="font-semibold text-black">
                        {row.entityName ?? "—"}
                      </div>
                      <div className="mt-1 text-sm text-black/60">
                        {row.registryId}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-black/75">
                      {row.country ?? "—"}
                    </td>

                    <td className="px-4 py-4 text-sm text-black/75">
                      {[row.certifiedTier, row.certifiedBand]
                        .filter(Boolean)
                        .join(" · ") || "—"}
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
                      No recent public records found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[36px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}
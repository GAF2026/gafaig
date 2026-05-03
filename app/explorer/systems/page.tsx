import {
  getExplorerStats,
  getExplorerSystems,
  type ExplorerSystemRow,
} from "@/lib/queries/explorer";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";

function numberFormat(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatText(value?: string | null): string {
  const clean = String(value ?? "").trim();
  return clean.length > 0 ? clean : "—";
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExplorerSystemsPage() {
  const [rows, stats] = await Promise.all([
    getExplorerSystems(200),
    getExplorerStats(),
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="AI Systems"
          title="Explore AI systems in the GAFAIG public trust surface"
          description="This page surfaces registry-linked AI systems using Snowflake-backed explorer data."
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

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Systems
              </p>
              <p className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                {numberFormat(rows.length)}
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Public Records
              </p>
              <p className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                {numberFormat(stats.publicRecords)}
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Organizations
              </p>
              <p className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                {numberFormat(stats.organizations)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-black/45">
                Public AI Systems
              </p>
              <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
                Systems currently visible in Explorer
              </h2>
            </div>

            <p className="text-[14px] text-black/70">{rows.length} shown</p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-0 border-b border-black/10 bg-black/[0.02] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              <div>System</div>
              <div>Organization</div>
              <div>Country</div>
              <div>Status</div>
            </div>

            <div className="divide-y divide-black/10">
              {rows.map((row) => (
                <div
                  key={`${row.registryId}-${row.caseId ?? "none"}`}
                  className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-0 px-6 py-5 text-[15px] leading-7 text-black/75"
                >
                  <div className="font-semibold text-black">
                    {formatText(row.systemName)}
                  </div>
                  <div>{formatText(row.entityName)}</div>
                  <div>{formatText(row.country)}</div>
                  <div>{formatText(row.certificationStatus)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
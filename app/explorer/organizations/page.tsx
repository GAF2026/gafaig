import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getExplorerOrganizations,
  getExplorerStats,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function numberFormat(value: number): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function safe(value: string | null | undefined): string {
  return String(value ?? "").trim() || "—";
}

export default async function ExplorerOrganizationsPage() {
  const [rows, stats] = await Promise.all([
    getExplorerOrganizations(250),
    getExplorerStats(),
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / ORGANIZATIONS"
          title="Explore organizations in the GAFAIG public trust surface"
          description="Browse organizations currently surfaced through GAFAIG’s publication-controlled public registry views. Only organizations associated with explicitly published certification records appear here."
          secondaryDescription="This page is projection-only. It does not compute trust, expose private governance records, or display unpublished certification outcomes."
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

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Organizations
              </div>
              <div className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                {numberFormat(stats.organizations)}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Public Records
              </div>
              <div className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                {numberFormat(stats.publicRecords)}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Public organization directory
            </div>
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Organizations with published GAFAIG certification records
            </h2>
            <p className="text-[15px] leading-7 text-black/75">
              Each row represents an organization visible through GAFAIG’s public
              trust surface. Certification is evaluated privately, and only
              records explicitly selected for publication appear in Explorer.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <p className="text-[14px] text-black/70">{rows.length} shown</p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] gap-0 border-b border-black/10 bg-black/[0.02] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              <div>Organization</div>
              <div>Country</div>
              <div>Records</div>
              <div>Systems</div>
            </div>

            <div className="divide-y divide-black/10">
              {rows.length === 0 ? (
                <div className="px-6 py-10 text-[15px] leading-7 text-black/70">
                  No published organization records are currently available.
                </div>
              ) : (
                rows.map((row) => (
                  <div
                    key={`${row.organization}-${row.country ?? "none"}`}
                    className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] gap-0 px-6 py-5 text-[15px] leading-7 text-black/75"
                  >
                    <div className="font-semibold text-black">
                      {safe(row.organization)}
                    </div>
                    <div>{safe(row.country)}</div>
                    <div>{numberFormat(row.publicRecords)}</div>
                    <div>{numberFormat(row.systems)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
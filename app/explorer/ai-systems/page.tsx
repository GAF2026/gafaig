import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getExplorerStats,
  getExplorerSystems,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function numberFormat(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function safe(value: unknown): string {
  return String(value ?? "").trim() || "—";
}

function field(row: unknown, key: string): unknown {
  if (!row || typeof row !== "object") return null;
  return (row as Record<string, unknown>)[key];
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </p>
      <p className="mt-3 text-[20px] font-semibold tracking-tight text-black">
        {value}
      </p>
    </div>
  );
}

export default async function ExplorerAiSystemsPage() {
  const [rows, stats] = await Promise.all([
    getExplorerSystems(500),
    getExplorerStats(),
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / AI SYSTEM INTELLIGENCE"
          title="Global public AI system governance intelligence"
          description="This page surfaces publication-safe AI system governance observability derived from canonical Snowflake public registry views."
          secondaryDescription="Only AI systems associated with explicitly published certification records appear here. Private governance evidence, findings, scoring internals, reviewer materials, and execution telemetry are not exposed."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/systems" variant="secondary">
                Open Systems
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Open Registry
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="AI Systems" value={numberFormat(stats.systems)} />
            <MetricCard
              label="Public Records"
              value={numberFormat(stats.publicRecords)}
            />
            <MetricCard
              label="Organizations"
              value={numberFormat(stats.organizations)}
            />
            <MetricCard
              label="Countries"
              value={numberFormat(stats.countries)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              AI System Governance Intelligence
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Public AI system observability records
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Each record represents publication-safe AI system metadata
              associated with a published GAFAIG certification record. This page
              does not compute trust and does not expose private governance
              workflow data.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <p className="text-[14px] text-black/70">{rows.length} shown</p>
          </div>

          <div className="mt-6 grid gap-4">
            {rows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
                <div className="text-lg font-semibold text-black">
                  No public AI system intelligence records are currently
                  available.
                </div>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  GAFAIG did not receive AI system rows from the canonical
                  Snowflake public explorer views.
                </p>
              </div>
            ) : (
              rows.map((row, index) => {
                const registryId = safe(field(row, "registryId"));
                const systemName = safe(field(row, "systemName"));
                const entityName = safe(field(row, "entityName"));
                const country = safe(field(row, "country"));
                const systemNameQuery =
                  systemName !== "—"
                    ? `?systemName=${encodeURIComponent(systemName)}`
                    : "";

                return (
                  <article
                    key={`${registryId}-${systemName}-${index}`}
                    className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/30"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                          AI Governance Intelligence Record
                        </p>

                        <h3 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
                          {systemName}
                        </h3>

                        <p className="mt-2 text-[14px] leading-6 text-black/70">
                          {entityName} · {country}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <PublicButtonLink
                          href={`/explorer/ai-systems/${encodeURIComponent(
                            registryId
                          )}${systemNameQuery}`}
                          variant="secondary"
                        >
                          Open AI Governance Record
                        </PublicButtonLink>

                        <PublicButtonLink
                          href={`/verify/${encodeURIComponent(registryId)}`}
                          variant="primary"
                        >
                          Verify Record
                        </PublicButtonLink>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <MetricCard
                        label="Organization"
                        value={entityName}
                      />
                      <MetricCard
                        label="Country"
                        value={country}
                      />
                      <MetricCard
                        label="Certification"
                        value={safe(field(row, "certificationStatus"))}
                      />
                      <MetricCard
                        label="Lifecycle"
                        value={safe(field(row, "lifecycleStatus"))}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <MetricCard
                        label="Registry ID"
                        value={registryId}
                      />
                      <MetricCard
                        label="System Type"
                        value={safe(field(row, "systemType"))}
                      />
                      <MetricCard
                        label="Renewal"
                        value={safe(field(row, "renewalStatus"))}
                      />
                      <MetricCard
                        label="Governance Surface"
                        value="Publication-safe"
                      />
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Public Trust Boundary
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              This page surfaces publication-safe AI system telemetry only
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              AI system intelligence is derived exclusively from canonical
              Snowflake public registry and AI system observability views.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <ul className="grid gap-2 text-[15px] leading-7 text-black/75 md:grid-cols-2">
                <li>findings</li>
                <li>evidence</li>
                <li>reviewer materials</li>
                <li>scoring internals</li>
                <li>recommendation systems</li>
                <li>governance execution telemetry</li>
                <li>private workflow state</li>
                <li>unpublished certification records</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
import {
  getExplorerStats,
  getExplorerSystems,
} from "@/lib/queries/explorer";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SYSTEM_PAGE_LIMIT = 50;
const SYSTEM_MAX_SAFE_OFFSET = 10000;

function numberFormat(value: number): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function formatText(value?: string | null): string {
  const clean = String(value ?? "").trim();
  return clean.length > 0 ? clean : "—";
}

function toOffset(value?: string): number {
  const n = Number(value ?? 0);

  if (!Number.isFinite(n)) {
    return 0;
  }

  return Math.min(
    Math.max(Math.trunc(n), 0),
    SYSTEM_MAX_SAFE_OFFSET
  );
}

function classifySystemRow(row: {
  lifecycleStatus?: string | null;
  certificationStatus?: string | null;
}): string {
  const lifecycle = String(
    row.lifecycleStatus ?? ""
  ).toLowerCase();

  const certification = String(
    row.certificationStatus ?? ""
  ).toLowerCase();

  if (lifecycle === "expired") {
    return "Expired AI Governance Surfaces";
  }

  if (certification.includes("renewal")) {
    return "Renewal AI Governance Surfaces";
  }

  if (lifecycle === "active") {
    return "Active AI Governance Surfaces";
  }

  return "Published AI Governance Surfaces";
}

export default async function ExplorerSystemsPage({
  searchParams,
}: {
  searchParams?: {
    offset?: string;
  };
}) {
  const offset = toOffset(searchParams?.offset);

  const [rows, stats] = await Promise.all([
    getExplorerSystems(
      SYSTEM_PAGE_LIMIT,
      offset
    ),
    getExplorerStats(),
  ]);

  const lifecycleActive = rows.filter(
    (row) => String(row.lifecycleStatus ?? "").trim().toLowerCase() === "active"
  ).length;

  const countriesRepresented = new Set(
    rows
      .map((row) => String(row.country ?? "").trim())
      .filter((country) => country.length > 0)
  ).size;

  const groupedSystems = rows.reduce<
    Record<string, typeof rows>
  >((groups, row) => {
    const category = classifySystemRow(row);

    return {
      ...groups,
      [category]: [...(groups[category] ?? []), row],
    };
  }, {});

  const orderedSystemGroups = Object.entries(
    groupedSystems
  ).sort(([a], [b]) => a.localeCompare(b));

  const hasNextPage =
    rows.length >= SYSTEM_PAGE_LIMIT;

  const previousOffset = Math.max(
    offset - SYSTEM_PAGE_LIMIT,
    0
  );

  const nextOffset =
    offset + SYSTEM_PAGE_LIMIT;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / AI GOVERNANCE OBSERVABILITY"
          title="Explore public AI governance observability"
          description="This page surfaces publication-safe AI system governance observability derived from canonical Snowflake public registry views."
          secondaryDescription="Only AI systems associated with explicitly published certification records appear here. Explorer exposes publication-safe AI governance metadata only. Private governance evidence, findings, scoring internals, reviewer materials, and governance telemetry are not exposed."
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Lifecycle Active
              </p>
              <p className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                {numberFormat(lifecycleActive)}
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Countries
              </p>
              <p className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                {numberFormat(countriesRepresented)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              AI governance observability
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Explorer surfaces publication-safe AI governance metadata derived
              from canonical Snowflake public registry views.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-black/45">
                This page does not expose
              </p>

              <ul className="mt-4 grid gap-2 text-[15px] leading-7 text-black/75 md:grid-cols-2">
                <li>findings</li>
                <li>evidence</li>
                <li>scoring internals</li>
                <li>reviewer materials</li>
                <li>recommendation systems</li>
                <li>governance execution telemetry</li>
                <li>private workflow state</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-black/45">
              AI Governance Observability
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Public AI governance observability records
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Each row represents publication-safe AI governance observability
              metadata associated with published GAFAIG certification records.
              Explorer does not compute trust and does not expose unpublished
              systems, findings, evidence, reviewer materials, or private
              governance execution workflows.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[14px] text-black/70">{rows.length} shown</p>

            <div className="flex flex-wrap gap-3">
              {offset > 0 ? (
                <PublicButtonLink
                  href={`/explorer/systems?offset=${previousOffset}`}
                  variant="secondary"
                >
                  Previous
                </PublicButtonLink>
              ) : null}

              {hasNextPage ? (
                <PublicButtonLink
                  href={`/explorer/systems?offset=${nextOffset}`}
                  variant="secondary"
                >
                  Next
                </PublicButtonLink>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {rows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
                <div className="text-lg font-semibold text-black">
                  No publication-safe AI governance observability records are
                  currently available.
                </div>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  GAFAIG did not receive public AI governance observability
                  records from the canonical Snowflake public registry views.
                </p>
              </div>
            ) : (
              orderedSystemGroups.map(
                ([category, categoryRows]) => (
                  <section
                    key={category}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <h3 className="text-[18px] font-semibold tracking-tight text-black">
                        {category}
                      </h3>

                      <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-black/45">
                        {numberFormat(categoryRows.length)} shown
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {categoryRows.map((row) => (
                        <article
                          key={`${row.registryId}-${row.caseId ?? "none"}`}
                          className="rounded-3xl border border-black/10 bg-white p-6"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-3">
                              <span className="inline-flex rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/70">
                                AI Governance Record
                              </span>

                              <div>
                                <h2 className="text-[24px] font-semibold tracking-tight text-black">
                                  {formatText(row.systemName)}
                                </h2>

                                <p className="mt-2 text-[14px] text-black/70">
                                  {formatText(row.entityName)} ·{" "}
                                  {formatText(row.country)}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <PublicButtonLink
                                href={`/registry/${encodeURIComponent(
                                  row.registryId
                                )}`}
                                variant="secondary"
                              >
                                Open Certification Record
                              </PublicButtonLink>

                              <PublicButtonLink
                                href={`/verify/${encodeURIComponent(
                                  row.registryId
                                )}`}
                                variant="primary"
                              >
                                Verify Record
                              </PublicButtonLink>
                            </div>
                          </div>

                          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                                Organization
                              </div>

                              <div className="mt-3 text-[18px] font-semibold text-black">
                                {formatText(row.entityName)}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                                Country
                              </div>

                              <div className="mt-3 text-[18px] font-semibold text-black">
                                {formatText(row.country)}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                                Certification
                              </div>

                              <div className="mt-3 text-[18px] font-semibold text-black">
                                {formatText(row.certificationStatus)}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                                Lifecycle
                              </div>

                              <div className="mt-3 text-[18px] font-semibold text-black">
                                {formatText(row.lifecycleStatus)}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                                Registry ID
                              </div>

                              <div className="mt-3 break-all text-[16px] font-semibold text-black">
                                {formatText(row.registryId)}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                                Governance Surface
                              </div>

                              <div className="mt-3 text-[16px] font-semibold text-black">
                                Publication-safe observability
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
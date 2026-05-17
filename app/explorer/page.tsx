import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getExplorerStats,
  getLatestExplorerRecords,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ExplorerStats = {
  publicRecords: number;
  certified: number;
  organizations: number;
  countries: number;
  systems: number;
};

type ExplorerRecord = {
  registryId: string;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certificationStatus: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
};

const EXPLORER_LATEST_RECORD_LIMIT = 8;
const EXPLORER_MAX_SAFE_OFFSET = 10000;

function formatNumber(value: number | null | undefined): string {
  const safeValue = Number(value ?? 0);

  return new Intl.NumberFormat("en-US").format(
    Number.isFinite(safeValue) ? safeValue : 0
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatText(value: string | null | undefined): string {
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
    EXPLORER_MAX_SAFE_OFFSET
  );
}

function normalizeStats(
  stats: Partial<ExplorerStats> | null | undefined
): ExplorerStats {
  return {
    publicRecords: Number(stats?.publicRecords ?? 0),
    certified: Number(stats?.certified ?? 0),
    organizations: Number(stats?.organizations ?? 0),
    countries: Number(stats?.countries ?? 0),
    systems: Number(stats?.systems ?? 0),
  };
}

function normalizeRecord(
  row: Partial<ExplorerRecord> | null | undefined
): ExplorerRecord | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const registryId = String(row.registryId ?? "").trim();

  if (!registryId) {
    return null;
  }

  return {
    registryId,
    entityName: row.entityName ?? null,
    entityType: row.entityType ?? null,
    country: row.country ?? null,
    certificationStatus: row.certificationStatus ?? null,
    certifiedAt: row.certifiedAt ?? null,
    validFrom: row.validFrom ?? null,
    validTo: row.validTo ?? null,
  };
}

function classifyExplorerRecord(
  record: ExplorerRecord
): string {
  const certification = String(
    record.certificationStatus ?? ""
  ).toLowerCase();

  if (certification.includes("expired")) {
    return "Expired Certification Surfaces";
  }

  if (certification.includes("renewal")) {
    return "Renewal Certification Surfaces";
  }

  if (certification.includes("active")) {
    return "Active Certification Surfaces";
  }

  return "Published Certification Surfaces";
}

function ExplorerUnavailableState() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-9">
        <PublicPageHero
          eyebrow="PUBLIC GOVERNANCE TRUST INFRASTRUCTURE"
          title="Explore the GAFAIG public governance trust infrastructure"
          description="Explorer is temporarily unavailable."
          secondaryDescription="The public governance trust infrastructure depends on canonical Snowflake public trust infrastructure views. Please try again shortly."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="primary">
                Open Certification Registry
              </PublicButtonLink>

              <PublicButtonLink href="/verify" variant="secondary">
                Open Verification Surface
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
            <div className="text-lg font-semibold text-black">
              Explorer unavailable
            </div>

            <p className="mt-2 text-sm leading-6 text-black/60">
              GAFAIG could not load governance observability surfaces from canonical Snowflake public trust infrastructure views.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function EmptyLatestRecordsState() {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
      <div className="text-lg font-semibold text-black">
        No public certification surfaces available
      </div>

      <p className="mt-2 text-sm leading-6 text-black/60">
        Explorer did not receive published certification surfaces from the canonical public trust infrastructure view.
      </p>
    </div>
  );
}

export default async function ExplorerPage({
  searchParams,
}: {
  searchParams?: {
    offset?: string;
  };
}) {
  const offset = toOffset(searchParams?.offset);

  let rawStats: unknown = null;
  let rawLatestRecords: unknown = [];

  try {
    [rawStats, rawLatestRecords] = await Promise.all([
      getExplorerStats(),
      getLatestExplorerRecords(
        EXPLORER_LATEST_RECORD_LIMIT,
        offset
      ),
    ]);
  } catch (error) {
    console.error("Explorer page failed to load:", error);

    return <ExplorerUnavailableState />;
  }

  const stats = normalizeStats(
    rawStats as Partial<ExplorerStats> | null | undefined
  );

  const latestRecords = Array.isArray(rawLatestRecords)
    ? rawLatestRecords
        .map((record) =>
          normalizeRecord(record as Partial<ExplorerRecord>)
        )
        .filter(
          (record): record is ExplorerRecord =>
            record !== null
        )
    : [];

  const groupedLatestRecords = latestRecords.reduce<
    Record<string, ExplorerRecord[]>
  >((groups, record) => {
    const category = classifyExplorerRecord(record);

    return {
      ...groups,
      [category]: [...(groups[category] ?? []), record],
    };
  }, {});

  const orderedLatestRecordGroups = Object.entries(
    groupedLatestRecords
  ).sort(([a], [b]) => a.localeCompare(b));

  const hasNextPage =
    latestRecords.length >= EXPLORER_LATEST_RECORD_LIMIT;

  const previousOffset = Math.max(
    offset - EXPLORER_LATEST_RECORD_LIMIT,
    0
  );

  const nextOffset =
    offset + EXPLORER_LATEST_RECORD_LIMIT;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="PUBLIC GOVERNANCE TRUST INFRASTRUCTURE"
          title="Explore the GAFAIG public governance trust infrastructure"
          description="Explorer surfaces publication-safe governance observability derived from GAFAIG certification surfaces that organizations have explicitly chosen to publish."
          secondaryDescription="Use Explorer when you want to browse broader public governance trust infrastructure across organizations, governance jurisdictions, and AI governance surfaces. Registry is the canonical certification-by-certification public trust surface for inspecting a specific published certification surface."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="primary">
                Open Certification Registry
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/organizations"
                variant="secondary"
              >
                Governance Organizations
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/countries"
                variant="secondary"
              >
                Governance Jurisdictions
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/systems"
                variant="secondary"
              >
                AI Governance Surfaces
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/lifecycle"
                variant="secondary"
              >
                Lifecycle
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/renewals"
                variant="secondary"
              >
                Renewals
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/governance-signals"
                variant="secondary"
              >
                Governance Signals
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              How to read Explorer
            </div>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Published certification surfaces appear in public governance trust infrastructure
            </h2>

            <p className="text-[15px] leading-8 text-black/75">
              Explorer is broader than a single certification surface page, but
              it still follows the public governance trust policy. Only certification
              surfaces that organizations explicitly choose to publish appear
              here.
            </p>

            <p className="text-[15px] leading-8 text-black/75">
              Explorer surfaces publication-controlled trust metadata across
              governance organizations, governance jurisdictions, and AI governance surfaces without exposing private
              governance workflows, findings, reviewer materials, scoring
              internals, or operational telemetry.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <h3 className="text-[18px] font-semibold tracking-tight text-black">
                Certification evaluation remains private until publication
              </h3>

              <p className="mt-4 text-[15px] leading-8 text-black/75">
                Governance evaluation occurs inside the deterministic private
                verification engine. Public governance trust surfaces expose only published certification outcomes and verification proof infrastructure.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <h3 className="text-[18px] font-semibold tracking-tight text-black">
                Explorer is projection-only
              </h3>

              <p className="mt-4 text-[15px] leading-8 text-black/75">
                Explorer does not recompute public trust. It renders projection data
                from canonical Snowflake public trust infrastructure views and links users to the
                registry and verification surfaces.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Certification Surfaces
            </div>

            <div className="mt-5 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.publicRecords)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Published Certification Outcomes
            </div>

            <div className="mt-5 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.certified)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Governance Organizations
            </div>

            <div className="mt-5 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.organizations)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Governance Jurisdictions
            </div>

            <div className="mt-5 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.countries)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              AI Governance Surfaces
            </div>

            <div className="mt-5 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.systems)}
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          <article className="rounded-3xl border border-neutral-200 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Organizations
            </div>

            <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black">
              Governance organizations
            </h2>

            <p className="mt-4 text-[15px] leading-8 text-black/70">
              Browse organizations with published GAFAIG certification surfaces
              while preserving the public/private governance boundary.
            </p>

            <div className="mt-7">
              <PublicButtonLink
                href="/explorer/organizations"
                variant="secondary"
              >
                Open Organizations
              </PublicButtonLink>
            </div>
          </article>

          <article className="rounded-3xl border border-neutral-200 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Jurisdictions
            </div>

            <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black">
              Governance jurisdictions
            </h2>

            <p className="mt-4 text-[15px] leading-8 text-black/70">
              Review jurisdiction-level public governance trust observability
              based only on publication-safe certification metadata.
            </p>

            <div className="mt-7">
              <PublicButtonLink
                href="/explorer/countries"
                variant="secondary"
              >
                Open Jurisdictions
              </PublicButtonLink>
            </div>
          </article>

          <article className="rounded-3xl border border-neutral-200 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              AI Systems
            </div>

            <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black">
              AI governance surfaces
            </h2>

            <p className="mt-4 text-[15px] leading-8 text-black/70">
              Inspect public AI governance surfaces connected to published
              certification outcomes without exposing private system evidence.
            </p>

            <div className="mt-7">
              <PublicButtonLink
                href="/explorer/systems"
                variant="secondary"
              >
                Open AI Governance Surfaces
              </PublicButtonLink>
            </div>
          </article>
        </section>

        <section className="mt-12 rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Public Governance Observability
            </div>

            <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
              Operational governance signals remain publication-safe
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-black/75">
              GAFAIG separates private governance execution infrastructure from
              public governance trust infrastructure. Explorer exposes aggregated
              and publication-controlled observability surfaces so users can understand public governance posture without accessing private governance materials.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Lifecycle
              </div>

              <h3 className="mt-4 text-[18px] font-semibold tracking-tight text-black">
                Certification lifecycle posture
              </h3>

              <p className="mt-4 text-[15px] leading-8 text-black/70">
                Review publication-safe certification lifecycle categories across
                published certification surfaces.
              </p>

              <div className="mt-7">
                <PublicButtonLink
                  href="/explorer/lifecycle"
                  variant="secondary"
                >
                  Open Lifecycle
                </PublicButtonLink>
              </div>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Renewals
              </div>

              <h3 className="mt-4 text-[18px] font-semibold tracking-tight text-black">
                Renewal continuity intelligence
              </h3>

              <p className="mt-4 text-[15px] leading-8 text-black/70">
                Inspect renewal posture using public governance trust metadata
                without exposing private renewal workflows.
              </p>

              <div className="mt-7">
                <PublicButtonLink
                  href="/explorer/renewals"
                  variant="secondary"
                >
                  Open Renewals
                </PublicButtonLink>
              </div>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Governance Signals
              </div>

              <h3 className="mt-4 text-[18px] font-semibold tracking-tight text-black">
                Aggregated governance telemetry
              </h3>

              <p className="mt-4 text-[15px] leading-8 text-black/70">
                View high-level public governance signals derived only from
                published certification surfaces and publication-safe projections.
              </p>

              <div className="mt-7">
                <PublicButtonLink
                  href="/explorer/governance-signals"
                  variant="secondary"
                >
                  Open Governance Signals
                </PublicButtonLink>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-4xl">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Latest Published Certification Surfaces
              </div>

              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                Recently published certification surfaces
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-black/75">
                Explorer surfaces metadata from published GAFAIG certification surfaces while preserving the boundary between public governance trust infrastructure and private governance execution infrastructure.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[14px] text-black/70">
                {latestRecords.length} shown
              </span>

              {offset > 0 ? (
                <PublicButtonLink
                  href={`/explorer?offset=${previousOffset}`}
                  variant="secondary"
                >
                  Previous
                </PublicButtonLink>
              ) : null}

              {hasNextPage ? (
                <PublicButtonLink
                  href={`/explorer?offset=${nextOffset}`}
                  variant="secondary"
                >
                  Next
                </PublicButtonLink>
              ) : null}
            </div>
          </div>

          <div className="mt-10 space-y-5">
            {latestRecords.length === 0 ? (
              <EmptyLatestRecordsState />
            ) : (
              orderedLatestRecordGroups.map(
                ([category, categoryRecords]) => (
                  <div key={category} className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-[18px] font-semibold tracking-tight text-black">
                        {category}
                      </h3>

                      <div className="text-[13px] text-black/60">
                        {formatNumber(categoryRecords.length)} shown
                      </div>
                    </div>

                    {categoryRecords.map((record) => (
                      <article
                        key={record.registryId}
                        className="rounded-3xl border border-black/10 bg-white p-7"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-5">
                            <div className="flex flex-wrap gap-3 pt-1">
                              <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-[14px] font-semibold text-emerald-800">
                                {formatText(record.certificationStatus)}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-[26px] font-semibold tracking-tight text-black">
                                {formatText(record.entityName)}
                              </h3>

                              <p className="mt-3 text-[14px] leading-7 text-black/70">
                                {formatText(record.country)} ·{" "}
                                {record.registryId}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 pt-1">
                            <PublicButtonLink
                              href={`/registry/${record.registryId}`}
                              variant="secondary"
                            >
                              Open Certification Surface
                            </PublicButtonLink>

                            <PublicButtonLink
                              href={`/verify/${record.registryId}`}
                              variant="primary"
                            >
                              Open Verification Surface
                            </PublicButtonLink>
                          </div>
                        </div>

                        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                              Certification
                            </div>

                            <div className="mt-4 text-[18px] leading-8 font-semibold text-black">
                              {formatText(record.certificationStatus)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                              Certified
                            </div>

                            <div className="mt-4 text-[18px] leading-8 font-semibold text-black">
                              {formatDate(record.certifiedAt)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                              Valid From
                            </div>

                            <div className="mt-4 text-[18px] leading-8 font-semibold text-black">
                              {formatDate(record.validFrom)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                              Valid To
                            </div>

                            <div className="mt-4 text-[18px] leading-8 font-semibold text-black">
                              {formatDate(record.validTo)}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
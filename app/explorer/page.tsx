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

function ExplorerUnavailableState() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
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

export default async function ExplorerPage() {
  let rawStats: unknown = null;
  let rawLatestRecords: unknown = [];

  try {
    [rawStats, rawLatestRecords] = await Promise.all([
      getExplorerStats(),
      getLatestExplorerRecords(8),
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
          (record): record is ExplorerRecord => record !== null
        )
    : [];

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
          <div className="max-w-4xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              How to read Explorer
            </div>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Published certification surfaces appear in public governance trust infrastructure
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Explorer is broader than a single certification surface page, but
              it still follows the public governance trust policy. Only certification
              surfaces that organizations explicitly choose to publish appear
              here.
            </p>

            <p className="text-[15px] leading-7 text-black/75">
              Explorer surfaces publication-controlled trust metadata across
              governance organizations, governance jurisdictions, and AI governance surfaces without exposing private
              governance workflows, findings, reviewer materials, scoring
              internals, or operational telemetry.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <h3 className="text-[18px] font-semibold tracking-tight text-black">
                Certification evaluation remains private until publication
              </h3>

              <p className="mt-3 text-[15px] leading-7 text-black/75">
                Governance evaluation occurs inside the deterministic private
                verification engine. Public governance trust surfaces expose only published certification outcomes and verification proof infrastructure.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <h3 className="text-[18px] font-semibold tracking-tight text-black">
                Explorer is projection-only
              </h3>

              <p className="mt-3 text-[15px] leading-7 text-black/75">
                Explorer does not recompute public trust. It renders projection data
                from canonical Snowflake public trust infrastructure views and links users to the
                registry and verification surfaces.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Certification Surfaces
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.publicRecords)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Published Certification Outcomes
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.certified)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Governance Organizations
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.organizations)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Governance Jurisdictions
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.countries)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              AI Governance Surfaces
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.systems)}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Lifecycle
            </p>

            <h2 className="mt-4 text-[22px] font-semibold tracking-tight text-black">
              Certification Lifecycle Observability
            </h2>

            <p className="mt-3 text-[15px] leading-7 text-black/70">
              Publication-safe certification lifecycle visibility derived from canonical Snowflake registry views.
            </p>

            <div className="mt-5">
              <PublicButtonLink href="/explorer/lifecycle" variant="secondary">
                Open Lifecycle
              </PublicButtonLink>
            </div>
          </article>

          <article className="rounded-3xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Renewals
            </p>

            <h2 className="mt-4 text-[22px] font-semibold tracking-tight text-black">
              Renewal Observability
            </h2>

            <p className="mt-3 text-[15px] leading-7 text-black/70">
              Public renewal posture and certification continuity observability for certified public certification surfaces.
            </p>

            <div className="mt-5">
              <PublicButtonLink href="/explorer/renewals" variant="secondary">
                Open Renewals
              </PublicButtonLink>
            </div>
          </article>

          <article className="rounded-3xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Signals
            </p>

            <h2 className="mt-4 text-[22px] font-semibold tracking-tight text-black">
              Governance Signals
            </h2>

            <p className="mt-3 text-[15px] leading-7 text-black/70">
              Aggregated governance observability and publication-safe operational governance signals.
            </p>

            <div className="mt-5">
              <PublicButtonLink href="/explorer/governance-signals" variant="secondary">
                Open Signals
              </PublicButtonLink>
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-4xl">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Latest Published Certification Surfaces
              </div>

              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                Recently published certification surfaces
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-black/75">
                Explorer surfaces metadata from published GAFAIG certification surfaces while preserving the boundary between public governance trust infrastructure and private governance execution infrastructure.
              </p>
            </div>

            <div className="text-[14px] text-black/70">
              {latestRecords.length} shown
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {latestRecords.length === 0 ? (
              <EmptyLatestRecordsState />
            ) : (
              latestRecords.map((record) => (
                <article
                  key={record.registryId}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-[14px] font-semibold text-emerald-800">
                          {formatText(record.certificationStatus)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-[26px] font-semibold tracking-tight text-black">
                          {formatText(record.entityName)}
                        </h3>

                        <p className="mt-2 text-[14px] text-black/70">
                          {formatText(record.country)} ·{" "}
                          {record.registryId}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
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

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                        Certification
                      </div>

                      <div className="mt-3 text-[18px] font-semibold text-black">
                        {formatText(record.certificationStatus)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                        Certified
                      </div>

                      <div className="mt-3 text-[18px] font-semibold text-black">
                        {formatDate(record.certifiedAt)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                        Valid From
                      </div>

                      <div className="mt-3 text-[18px] font-semibold text-black">
                        {formatDate(record.validFrom)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                        Valid To
                      </div>

                      <div className="mt-3 text-[18px] font-semibold text-black">
                        {formatDate(record.validTo)}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
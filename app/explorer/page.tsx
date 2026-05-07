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
          eyebrow="PUBLIC TRUST SURFACE"
          title="Explore the public GAFAIG trust surface"
          description="Explorer is temporarily unavailable."
          secondaryDescription="The public trust surface depends on the canonical Snowflake public views. Please try again shortly."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="primary">
                View Registry
              </PublicButtonLink>

              <PublicButtonLink href="/verify" variant="secondary">
                Verify a Record
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
              GAFAIG could not load Explorer records from the canonical public
              views.
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
        No public records available
      </div>

      <p className="mt-2 text-sm leading-6 text-black/60">
        Explorer did not receive any published public records from the canonical
        public view.
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
          eyebrow="PUBLIC TRUST SURFACE"
          title="Explore the public GAFAIG trust surface"
          description="Explorer shows the public governance footprint derived from GAFAIG certification records that organizations have explicitly chosen to publish."
          secondaryDescription="Use Explorer when you want to browse the broader public trust surface across organizations, countries, and systems. Registry is the canonical record-by-record trust surface for inspecting a specific published certification record."
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

              <PublicButtonLink
                href="/explorer/countries"
                variant="secondary"
              >
                Countries
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/systems"
                variant="secondary"
              >
                AI Systems
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
              Published certification records appear in the public trust surface
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Explorer is broader than a single certification record page, but
              it still follows the public trust policy. Only certification
              records that organizations explicitly choose to publish appear
              here.
            </p>

            <p className="text-[15px] leading-7 text-black/75">
              Explorer surfaces publication-controlled trust metadata across
              organizations, countries, and systems without exposing private
              governance workflows, findings, reviewer materials, scoring
              internals, or operational telemetry.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <h3 className="text-[18px] font-semibold tracking-tight text-black">
                Certification remains private until publication
              </h3>

              <p className="mt-3 text-[15px] leading-7 text-black/75">
                Governance evaluation occurs inside the deterministic private
                verification engine. Public trust surfaces expose only published
                certification outcomes and verification proof infrastructure.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <h3 className="text-[18px] font-semibold tracking-tight text-black">
                Explorer is projection-only
              </h3>

              <p className="mt-3 text-[15px] leading-7 text-black/75">
                Explorer does not recompute trust. It renders projection data
                from canonical Snowflake public views and links users to the
                registry and verification surfaces.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Public Records
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.publicRecords)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Published Certifications
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.certified)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Organizations
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.organizations)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Countries
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.countries)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Systems
            </div>

            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.systems)}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-4xl">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Latest Published Records
              </div>

              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                Recently published certification records
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-black/75">
                Explorer surfaces metadata from published GAFAIG certification
                records while preserving the boundary between public trust
                surfaces and private governance execution infrastructure.
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
                        Open Certification Record
                      </PublicButtonLink>

                      <PublicButtonLink
                        href={`/verify/${record.registryId}`}
                        variant="primary"
                      >
                        Verify Record
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
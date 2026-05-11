import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getLifecycleRecords,
  type LifecycleRecord,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatText(value: string | null | undefined): string {
  const clean = String(value ?? "").trim();
  return clean.length > 0 ? clean : "—";
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

function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function formatDays(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(Number(value));
}

function activityDate(row: LifecycleRecord): string | null {
  return row.publishedAt ?? row.certifiedAt ?? row.validFrom ?? null;
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </div>
      <div className="mt-3 text-[26px] font-semibold tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function ActivityRow({ row }: { row: LifecycleRecord }) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
            Public Governance Activity
          </div>

          <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
            {formatText(row.entityName)}
          </h2>

          <p className="mt-2 text-[14px] text-black/70">
            {formatText(row.country)} · {formatText(row.registryId)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <PublicButtonLink
            href={`/registry/${encodeURIComponent(row.registryId)}`}
            variant="secondary"
          >
            Open Certification Record
          </PublicButtonLink>

          <PublicButtonLink
            href={`/verify/${encodeURIComponent(row.registryId)}`}
            variant="primary"
          >
            Verify Record
          </PublicButtonLink>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Activity Date" value={formatDate(activityDate(row))} />
        <MetricCard label="Certification" value={formatText(row.certificationStatus)} />
        <MetricCard label="Lifecycle" value={formatText(row.lifecycleStatus)} />
        <MetricCard label="Renewal" value={formatText(row.renewalStatus)} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Valid From" value={formatDate(row.validFrom)} />
        <MetricCard label="Valid To" value={formatDate(row.validTo)} />
        <MetricCard
          label="Days Until Expiration"
          value={formatDays(row.daysUntilExpiration)}
        />
        <MetricCard label="Entity Type" value={formatText(row.entityType)} />
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
      <div className="text-lg font-semibold text-black">
        No public governance activity available
      </div>
      <p className="mt-2 text-sm leading-6 text-black/60">
        GAFAIG did not receive public activity records from the canonical
        Snowflake public lifecycle projection.
      </p>
    </div>
  );
}

export default async function ExplorerActivityPage() {
  const rows = await getLifecycleRecords(200);

  const sortedRows = [...rows].sort((a, b) => {
    const left = new Date(activityDate(a) ?? 0).getTime();
    const right = new Date(activityDate(b) ?? 0).getTime();
    return right - left;
  });

  const total = rows.length;
  const active = rows.filter(
    (row) => String(row.lifecycleStatus ?? "").toLowerCase() === "active"
  ).length;
  const renewalValid = rows.filter(
    (row) => String(row.renewalStatus ?? "").toLowerCase() === "valid"
  ).length;
  const countries = new Set(
    rows
      .map((row) => String(row.country ?? "").trim())
      .filter((value) => value.length > 0)
  ).size;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / ACTIVITY"
          title="Public governance activity intelligence"
          description="Activity Explorer surfaces publication-safe governance activity and certification continuity signals derived from GAFAIG’s canonical Snowflake public lifecycle projections."
          secondaryDescription="This page does not compute trust or infer private activity. It displays Snowflake-originated public certification activity, lifecycle state, renewal posture, and validity timing for explicitly published certification records only."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/lifecycle" variant="secondary">
                Lifecycle Observability
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/renewals" variant="secondary">
                Renewal Observability
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/graph" variant="secondary">
                Governance Graph
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Public Activity Records" value={formatNumber(total)} />
            <MetricCard label="Active Lifecycle" value={formatNumber(active)} />
            <MetricCard label="Valid Renewals" value={formatNumber(renewalValid)} />
            <MetricCard label="Countries" value={formatNumber(countries)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Activity Directory
            </div>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Public certification activity records
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Each record is projected from GAFAIG’s canonical Snowflake public
              lifecycle surface. The UI formats public data only. Activity,
              lifecycle status, renewal posture, and continuity windows are
              determined upstream in Snowflake.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {sortedRows.length === 0 ? (
              <EmptyState />
            ) : (
              sortedRows.map((row) => (
                <ActivityRow key={row.registryId} row={row} />
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Public Trust Boundary
            </div>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              This page surfaces publication-safe activity telemetry only
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Activity intelligence is derived exclusively from canonical
              Snowflake public projections and explicitly published public trust
              records.
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
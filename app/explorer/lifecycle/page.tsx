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

function formatDays(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(Number(value));
}

function lifecycleLabel(value: string | null | undefined): string {
  const clean = formatText(value);
  return clean.replace(/_/g, " ");
}

function lifecycleTone(value: string | null | undefined): string {
  const clean = String(value ?? "").trim().toLowerCase();

  if (clean === "active") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (clean.includes("30")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (clean.includes("90")) {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  if (clean === "expired") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-black/10 bg-black/[0.02] text-black/70";
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

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
      <div className="text-lg font-semibold text-black">
        No certification lifecycle observability surfaces available
      </div>
      <p className="mt-2 text-sm leading-6 text-black/60">
        GAFAIG did not receive public certification lifecycle observability
        surfaces from the canonical Snowflake lifecycle observability view.
      </p>
    </div>
  );
}

function LifecycleRow({ row }: { row: LifecycleRecord }) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold capitalize ${lifecycleTone(
              row.lifecycleWindow
            )}`}
          >
            {lifecycleLabel(row.lifecycleWindow)}
          </span>

          <div>
            <h2 className="text-[24px] font-semibold tracking-tight text-black">
              {formatText(row.entityName)}
            </h2>
            <p className="mt-2 text-[14px] text-black/70">
              {formatText(row.country)} · {formatText(row.registryId)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <PublicButtonLink
            href={`/registry/${encodeURIComponent(row.registryId)}`}
            variant="secondary"
          >
            Open Certification Surface
          </PublicButtonLink>

          <PublicButtonLink
            href={`/verify/${encodeURIComponent(row.registryId)}`}
            variant="primary"
          >
            Open Verification Surface
          </PublicButtonLink>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Lifecycle Status"
          value={formatText(row.lifecycleStatus)}
        />
        <MetricCard label="Renewal" value={formatText(row.renewalStatus)} />
        <MetricCard label="Valid From" value={formatDate(row.validFrom)} />
        <MetricCard label="Valid To" value={formatDate(row.validTo)} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Days Until Expiration"
          value={formatDays(row.daysUntilExpiration)}
        />
        <MetricCard
          label="Certification"
          value={formatText(row.certificationStatus)}
        />
        <MetricCard label="Entity Type" value={formatText(row.entityType)} />
        <MetricCard
          label="Governance Jurisdiction"
          value={formatText(row.country)}
        />
      </div>
    </article>
  );
}

export default async function ExplorerLifecyclePage() {
  const rows = await getLifecycleRecords(200);

  const total = rows.length;
  const active = rows.filter(
    (row) => String(row.lifecycleStatus ?? "").toLowerCase() === "active"
  ).length;
  const expired = rows.filter(
    (row) => String(row.lifecycleStatus ?? "").toLowerCase() === "expired"
  ).length;
  const expiring30 = rows.filter((row) =>
    String(row.lifecycleWindow ?? "").toLowerCase().includes("30")
  ).length;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / CERTIFICATION LIFECYCLE OBSERVABILITY"
          title="Certification lifecycle observability"
          description="Lifecycle Explorer surfaces publication-safe certification lifecycle continuity observability derived from GAFAIG’s canonical Snowflake public lifecycle observability views."
          secondaryDescription="This page does not compute public trust. It displays Snowflake-originated lifecycle status, renewal status, validity windows, and expiration posture for explicitly published certification surfaces only."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/renewals" variant="secondary">
                Renewal Observability
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="secondary">
                Open Certification Registry
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Published Certification Lifecycle Surfaces"
              value={String(total)}
            />
            <MetricCard label="Active" value={String(active)} />
            <MetricCard label="Expiring 30 Days" value={String(expiring30)} />
            <MetricCard label="Expired" value={String(expired)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Certification Lifecycle Observatory
            </div>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Public certification continuity observability surfaces
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Each observability surface is projected from{" "}
              <strong>CORE.V_LIFECYCLE_PUBLIC</strong>. The UI formats the data
              only. Lifecycle observability state, expiration windows, and
              certification continuity observability are determined in
              Snowflake.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {rows.length === 0 ? (
              <EmptyState />
            ) : (
              rows.map((row) => (
                <LifecycleRow key={row.registryId} row={row} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
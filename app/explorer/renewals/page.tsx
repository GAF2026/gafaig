import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getRenewalRecords,
  type RenewalRecord,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RENEWAL_PAGE_LIMIT = 50;
const RENEWAL_MAX_SAFE_OFFSET = 10000;

function formatText(value: string | null | undefined): string {
  const clean = String(value ?? "").trim();
  return clean.length > 0 ? clean : "—";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

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

function toOffset(value?: string): number {
  const n = Number(value ?? 0);

  if (!Number.isFinite(n)) {
    return 0;
  }

  return Math.min(
    Math.max(Math.trunc(n), 0),
    RENEWAL_MAX_SAFE_OFFSET
  );
}

function renewalLabel(value: string | null | undefined): string {
  return formatText(value).replace(/_/g, " ");
}

function renewalTone(value: string | null | undefined): string {
  const clean = String(value ?? "").trim().toLowerCase();

  if (clean === "active") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (clean.includes("30")) return "border-amber-200 bg-amber-50 text-amber-700";
  if (clean.includes("90")) return "border-yellow-200 bg-yellow-50 text-yellow-700";
  if (clean === "expired") return "border-red-200 bg-red-50 text-red-700";

  return "border-black/10 bg-black/[0.02] text-black/70";
}

function classifyRenewalRow(row: RenewalRecord): string {
  const renewalWindow = String(
    row.renewalWindow ?? ""
  ).toLowerCase();

  const renewalStatus = String(
    row.renewalStatus ?? ""
  ).toLowerCase();

  if (renewalWindow === "expired") {
    return "Renewal Expired";
  }

  if (renewalWindow.includes("30")) {
    return "Renewal Due Within 30 Days";
  }

  if (renewalWindow.includes("90")) {
    return "Renewal Due Within 90 Days";
  }

  if (
    renewalStatus.includes("attention") ||
    renewalStatus.includes("review")
  ) {
    return "Renewal Attention Required";
  }

  return "Renewal Active";
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

function RenewalRow({ row }: { row: RenewalRecord }) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold capitalize ${renewalTone(
              row.renewalWindow
            )}`}
          >
            {renewalLabel(row.renewalWindow)}
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
        <MetricCard label="Certification Renewal Status" value={formatText(row.renewalStatus)} />
        <MetricCard label="Renewal Window" value={renewalLabel(row.renewalWindow)} />
        <MetricCard label="Lifecycle Status" value={formatText(row.lifecycleStatus)} />
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
        <MetricCard label="Governance Jurisdiction" value={formatText(row.country)} />
        <MetricCard label="Registry ID" value={formatText(row.registryId)} />
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
      <div className="text-lg font-semibold text-black">
        No certification renewal observability surfaces available
      </div>
      <p className="mt-2 text-sm leading-6 text-black/60">
        GAFAIG did not receive public certification renewal observability
        surfaces from the canonical Snowflake renewal observability view.
      </p>
    </div>
  );
}

export default async function ExplorerRenewalsPage({
  searchParams,
}: {
  searchParams?: {
    offset?: string;
  };
}) {
  const offset = toOffset(searchParams?.offset);

  const rows = await getRenewalRecords(
    RENEWAL_PAGE_LIMIT,
    offset
  );

  const total = rows.length;
  const active = rows.filter(
    (row) => String(row.renewalWindow ?? "").toLowerCase() === "active"
  ).length;
  const due30 = rows.filter((row) =>
    String(row.renewalWindow ?? "").toLowerCase().includes("30")
  ).length;
  const due90 = rows.filter((row) =>
    String(row.renewalWindow ?? "").toLowerCase().includes("90")
  ).length;
  const expired = rows.filter(
    (row) => String(row.renewalWindow ?? "").toLowerCase() === "expired"
  ).length;

  const groupedRenewalRows = rows.reduce<Record<string, RenewalRecord[]>>(
    (groups, row) => {
      const category = classifyRenewalRow(row);

      return {
        ...groups,
        [category]: [...(groups[category] ?? []), row],
      };
    },
    {}
  );

  const orderedRenewalGroups = Object.entries(
    groupedRenewalRows
  ).sort(([a], [b]) => a.localeCompare(b));

  const hasNextPage =
    rows.length >= RENEWAL_PAGE_LIMIT;

  const previousOffset = Math.max(
    offset - RENEWAL_PAGE_LIMIT,
    0
  );

  const nextOffset =
    offset + RENEWAL_PAGE_LIMIT;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / CERTIFICATION RENEWAL OBSERVABILITY"
          title="Certification renewal observability"
          description="Renewals Explorer surfaces publication-safe certification renewal continuity observability derived from GAFAIG’s canonical Snowflake renewal observability views."
          secondaryDescription="This page does not compute certification renewal status. It displays Snowflake-originated renewal windows, lifecycle status, validity dates, and renewal posture for explicitly published certification surfaces only."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/lifecycle" variant="secondary">
                Lifecycle Observability
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="secondary">
                Open Certification Registry
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Certification Renewal Surfaces" value={String(total)} />
            <MetricCard label="Active" value={String(active)} />
            <MetricCard label="Due 30 Days" value={String(due30)} />
            <MetricCard label="Due 90 Days" value={String(due90)} />
            <MetricCard label="Expired" value={String(expired)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Certification Renewal Observatory
            </div>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Public certification renewal observability surfaces
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Each observability surface is projected from{" "}
              <strong>CORE.V_RENEWAL_PUBLIC</strong>. The UI formats the data
              only. Certification renewal observability windows, expiration posture, lifecycle
              observability status, and certification continuity observability
              are determined in Snowflake.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[14px] text-black/70">
              {rows.length} shown
            </p>

            <div className="flex flex-wrap gap-3">
              {offset > 0 ? (
                <PublicButtonLink
                  href={`/explorer/renewals?offset=${previousOffset}`}
                  variant="secondary"
                >
                  Previous
                </PublicButtonLink>
              ) : null}

              {hasNextPage ? (
                <PublicButtonLink
                  href={`/explorer/renewals?offset=${nextOffset}`}
                  variant="secondary"
                >
                  Next
                </PublicButtonLink>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-6">
            {rows.length === 0 ? (
              <EmptyState />
            ) : (
              orderedRenewalGroups.map(([category, categoryRows]) => (
                <div key={category} className="grid gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-[18px] font-semibold tracking-tight text-black">
                      {category}
                    </h3>

                    <p className="text-[13px] font-medium text-black/50">
                      {formatDays(categoryRows.length)} surfaces
                    </p>
                  </div>

                  {categoryRows.map((row) => (
                    <RenewalRow key={row.registryId} row={row} />
                  ))}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
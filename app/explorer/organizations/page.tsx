import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type OrganizationRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFIED_AT: string | null;
  VALID_TO: string | null;
  DECISION_STATUS: string | null;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
};

type CountrySummaryRow = {
  COUNTRY: string | null;
  TOTAL_RECORDS: number;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function valueOrDash(value: string | null | undefined) {
  return value && value.trim() ? value : "—";
}

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function statusPillClass(value: string | null | undefined) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized === "certified") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (normalized === "published") {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }
  return "border-black/10 bg-black/[0.03] text-black/65";
}

export default async function ExplorerOrganizationsPage() {
  const [rows, countrySummary] = await Promise.all([
    sfQuery<OrganizationRow>(`
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFICATION_STATUS,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        CERTIFIED_AT,
        VALID_TO,
        DECISION_STATUS,
        APPLICATION_ID,
        CASE_ID
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ORDER BY ENTITY_NAME ASC, CERTIFIED_AT DESC NULLS LAST
    `),
    sfQuery<CountrySummaryRow>(`
      SELECT
        COUNTRY,
        TOTAL_RECORDS
      FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_COUNTRY
      ORDER BY TOTAL_RECORDS DESC, COUNTRY ASC
      LIMIT 6
    `),
  ]);

  const totalOrganizations = rows.length;
  const certifiedOrganizations = rows.filter(
    (row) => String(row.CERTIFICATION_STATUS ?? "").trim().toLowerCase() === "certified"
  ).length;
  const countriesRepresented = new Set(
    rows.map((row) => row.COUNTRY).filter(Boolean)
  ).size;
  const publishedRecords = rows.filter(
    (row) => String(row.DECISION_STATUS ?? "").trim().toLowerCase() === "published"
  ).length;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER — ORGANIZATIONS
        </div>

        <h1 className="mt-4 max-w-[900px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Organizations represented in the GAFAIG public registry
        </h1>

        <p className="mt-5 max-w-[940px] text-[17px] leading-[1.72] text-black/72">
          This page shows the organizations that appear in GAFAIG’s public
          certification registry. Each row represents a public certification
          record that can be opened directly to inspect registry details, linked
          systems, and verification surfaces.
        </p>

        <p className="mt-4 max-w-[940px] text-[15px] leading-[1.8] text-black/68">
          The organizations explorer is derived from canonical public registry
          data. It is intended to show which entities are represented in the
          trust surface without exposing private evidence, reviewer notes, or
          controlled workflow materials.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explorer"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to explorer
          </Link>

          <Link
            href="/registry"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            View registry
          </Link>

          <Link
            href="/explorer/countries"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Countries
          </Link>

          <Link
            href="/explorer/systems"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Systems
          </Link>

          <Link
            href="/explorer/map"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Map
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Organizations" value={String(totalOrganizations)} />
        <MetricCard label="Certified" value={String(certifiedOrganizations)} />
        <MetricCard label="Countries" value={String(countriesRepresented)} />
        <MetricCard label="Published" value={String(publishedRecords)} />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT ORGANIZATION DATA SHOWS
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public entity visibility across the registry
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Public certification presence"
              body="Organization rows show which entities currently appear in the public registry of record."
            />
            <StatementCard
              title="Registry-linked trust records"
              body="Each organization row leads to a canonical certification record with validity details and verification surfaces."
            />
            <StatementCard
              title="No private workflow disclosure"
              body="This explorer surface summarizes public certification representation without exposing internal reviewer operations."
            />
            <StatementCard
              title="Cross-registry navigation"
              body="Visitors can move from organization records into country, system, and trust-layer surfaces directly from here."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                TOP COUNTRIES BY ORGANIZATION PRESENCE
              </div>
              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Where represented entities appear
              </h2>
            </div>

            <Link
              href="/explorer/countries"
              className="text-sm font-semibold underline underline-offset-4"
            >
              Open countries →
            </Link>
          </div>

          <div className="mt-8 grid gap-4">
            {countrySummary.length === 0 ? (
              <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
                No country summary data is available.
              </div>
            ) : (
              countrySummary.map((row) => (
                <Link
                  key={row.COUNTRY || "Unknown"}
                  href={`/explorer/countries/${encodeURIComponent(row.COUNTRY || "Unknown")}`}
                  className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[20px] font-semibold tracking-tight text-black">
                        {valueOrDash(row.COUNTRY)}
                      </div>
                      <div className="mt-2 text-sm text-black/65">
                        Public registry representation by country
                      </div>
                    </div>

                    <InfoPanel
                      label="Records"
                      value={String(row.TOTAL_RECORDS)}
                      compact
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              ORGANIZATION DIRECTORY
            </div>
            <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Public certification records by organization
            </h2>
            <p className="mt-4 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
              Open any organization record to inspect certification status,
              validity dates, linked systems, and the public trust surface for
              that registry entry.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/70">
            {rows.length} visible organization record{rows.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
              No organization-level registry data is available.
            </div>
          ) : (
            rows.map((row) => (
              <Link
                key={row.REGISTRY_ID}
                href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusPillClass(
                          row.CERTIFICATION_STATUS
                        )}`}
                      >
                        {valueOrDash(row.CERTIFICATION_STATUS)}
                      </span>

                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusPillClass(
                          row.DECISION_STATUS
                        )}`}
                      >
                        {valueOrDash(row.DECISION_STATUS)}
                      </span>
                    </div>

                    <div className="mt-4 text-[24px] font-semibold tracking-tight text-black">
                      {valueOrDash(row.ENTITY_NAME)}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/65">
                      <span>{valueOrDash(row.ENTITY_TYPE)}</span>
                      <span>{valueOrDash(row.COUNTRY)}</span>
                      <span>{row.REGISTRY_ID}</span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoPanel
                      label="Tier / Band"
                      value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
                      compact
                    />
                    <InfoPanel
                      label="Certified at"
                      value={formatDate(row.CERTIFIED_AT)}
                      compact
                    />
                    <InfoPanel
                      label="Valid to"
                      value={formatDate(row.VALID_TO)}
                      compact
                    />
                    <InfoPanel
                      label="Case ID"
                      value={valueOrDash(row.CASE_ID)}
                      compact
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-black/55">
                  <span>Application: {valueOrDash(row.APPLICATION_ID)}</span>
                  <span>Registry ID: {row.REGISTRY_ID}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <FeatureCard
          title="Explorer"
          body="Return to the main discovery surface for the GAFAIG public registry."
          href="/explorer"
          cta="Back to explorer"
        />
        <FeatureCard
          title="Countries"
          body="See geographic representation across the public certification registry."
          href="/explorer/countries"
          cta="Open countries"
        />
        <FeatureCard
          title="Systems"
          body="Browse disclosed AI systems linked to organization certification records."
          href="/explorer/systems"
          cta="Open systems"
        />
        <FeatureCard
          title="Map"
          body="View country-level distribution through the explorer map surface."
          href="/explorer/map"
          cta="Open map"
        />
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function StatementCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function InfoPanel({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border border-black/8 bg-black/[0.015]",
        compact ? "px-3 py-3" : "px-4 py-4",
      ].join(" ")}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className={compact ? "mt-2 text-[14px] text-black/85" : "mt-3 text-[15px] text-black/88"}>
        {value}
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[20px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/72">{body}</p>
      <div className="mt-5">
        <Link
          href={href}
          className="font-semibold underline underline-offset-4 transition hover:text-black/65"
        >
          {cta} →
        </Link>
      </div>
    </div>
  );
}
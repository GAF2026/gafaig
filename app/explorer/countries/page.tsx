import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CountryRow = {
  COUNTRY: string | null;
  TOTAL_RECORDS: number;
  TOTAL_ENTITIES: number;
  TOTAL_REGISTRY_IDS: number;
  TOTAL_CERTIFIED: number;
  TOTAL_NOT_CERTIFIED: number;
  LAST_ACTIVITY_AT: string | null;
};

type RecentRegistryRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  COUNTRY: string | null;
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFIED_AT: string | null;
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

export default async function ExplorerCountriesPage() {
  const [rows, recentRows] = await Promise.all([
    sfQuery<CountryRow>(`
      SELECT
        COUNTRY,
        TOTAL_RECORDS,
        TOTAL_ENTITIES,
        TOTAL_REGISTRY_IDS,
        TOTAL_CERTIFIED,
        TOTAL_NOT_CERTIFIED,
        LAST_ACTIVITY_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_COUNTRY
      ORDER BY TOTAL_RECORDS DESC, COUNTRY ASC
    `),
    sfQuery<RecentRegistryRow>(`
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        COUNTRY,
        CERTIFICATION_STATUS,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ORDER BY CERTIFIED_AT DESC NULLS LAST, ENTITY_NAME ASC
      LIMIT 8
    `),
  ]);

  const totalCountries = rows.length;
  const totalRecords = rows.reduce((sum, row) => sum + Number(row.TOTAL_RECORDS || 0), 0);
  const totalCertified = rows.reduce((sum, row) => sum + Number(row.TOTAL_CERTIFIED || 0), 0);
  const totalEntities = rows.reduce((sum, row) => sum + Number(row.TOTAL_ENTITIES || 0), 0);

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER — COUNTRIES
        </div>

        <h1 className="mt-4 max-w-[900px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Country-level view of the GAFAIG public registry
        </h1>

        <p className="mt-5 max-w-[940px] text-[17px] leading-[1.72] text-black/72">
          This page shows where GAFAIG public certification records are represented
          geographically. It summarizes registry activity by country, including
          visible records, entities, registry identifiers, and certification totals.
        </p>

        <p className="mt-4 max-w-[940px] text-[15px] leading-[1.8] text-black/68">
          Country pages are derived directly from the canonical public registry.
          They are designed to help visitors understand the geographic footprint
          of public certification without exposing private review materials or
          controlled workflow.
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
            href="/explorer/organizations"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Organizations
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
        <MetricCard label="Countries" value={String(totalCountries)} />
        <MetricCard label="Registry records" value={String(totalRecords)} />
        <MetricCard label="Certified records" value={String(totalCertified)} />
        <MetricCard label="Entities" value={String(totalEntities)} />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT COUNTRY DATA SHOWS
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Geographic visibility across the registry
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Public certification footprint"
              body="Country rows show where public certification records currently appear in the GAFAIG registry."
            />
            <StatementCard
              title="Registry-linked entities"
              body="Each country view reflects organizations represented through public certification records."
            />
            <StatementCard
              title="No private workflow exposure"
              body="This explorer surface summarizes public registry activity without exposing private evidence or reviewer operations."
            />
            <StatementCard
              title="Structured trust visibility"
              body="Country-level distribution helps visitors understand how public trust signals are represented geographically."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                RECENT PUBLIC CERTIFICATIONS
              </div>
              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Latest registry activity
              </h2>
            </div>

            <Link
              href="/registry"
              className="text-sm font-semibold underline underline-offset-4"
            >
              Open registry →
            </Link>
          </div>

          <div className="mt-8 grid gap-4">
            {recentRows.length === 0 ? (
              <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
                No recent public registry activity is available.
              </div>
            ) : (
              recentRows.map((row) => (
                <Link
                  key={row.REGISTRY_ID}
                  href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                  className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
                >
                  <div className="text-[20px] font-semibold tracking-tight text-black">
                    {valueOrDash(row.ENTITY_NAME)}
                  </div>

                  <div className="mt-2 text-sm text-black/65">
                    {valueOrDash(row.COUNTRY)}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <InfoPanel
                      label="Status"
                      value={valueOrDash(row.CERTIFICATION_STATUS)}
                      compact
                    />
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
              COUNTRY DIRECTORY
            </div>
            <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Public registry distribution by country
            </h2>
            <p className="mt-4 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
              Open a country row to inspect registry representation at the
              country level and follow through to public certification records.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/70">
            {rows.length} visible countr{rows.length === 1 ? "y" : "ies"}
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
              No country-level registry data is available.
            </div>
          ) : (
            rows.map((row) => (
              <Link
                key={row.COUNTRY || "Unknown"}
                href={`/explorer/countries/${encodeURIComponent(row.COUNTRY || "Unknown")}`}
                className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-[24px] font-semibold tracking-tight text-black">
                      {valueOrDash(row.COUNTRY)}
                    </div>

                    <div className="mt-2 text-sm text-black/65">
                      Last activity {formatDate(row.LAST_ACTIVITY_AT)}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <InfoPanel
                      label="Records"
                      value={String(row.TOTAL_RECORDS)}
                      compact
                    />
                    <InfoPanel
                      label="Entities"
                      value={String(row.TOTAL_ENTITIES)}
                      compact
                    />
                    <InfoPanel
                      label="Certified"
                      value={String(row.TOTAL_CERTIFIED)}
                      compact
                    />
                    <InfoPanel
                      label="Not certified"
                      value={String(row.TOTAL_NOT_CERTIFIED)}
                      compact
                    />
                    <InfoPanel
                      label="Registry IDs"
                      value={String(row.TOTAL_REGISTRY_IDS)}
                      compact
                    />
                  </div>
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
          title="Organizations"
          body="Browse organizations represented across public certification records."
          href="/explorer/organizations"
          cta="Open organizations"
        />
        <FeatureCard
          title="Systems"
          body="Inspect disclosed AI systems linked to registry certifications."
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
import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type GlobalStatsRow = {
  TOTAL_REGISTRY_RECORDS: number;
  TOTAL_REGISTRY_IDS: number;
  TOTAL_CASES: number;
  TOTAL_APPLICATIONS: number;
  TOTAL_ENTITIES: number;
  TOTAL_COUNTRIES: number;
  TOTAL_PUBLISHED: number;
  TOTAL_CERTIFIED: number;
  TOTAL_NOT_CERTIFIED: number;
  FIRST_PUBLISHED_AT: string | null;
  LAST_PUBLISHED_AT: string | null;
};

type CountryStatsRow = {
  COUNTRY: string | null;
  TOTAL_RECORDS: number;
  TOTAL_ENTITIES: number;
  TOTAL_REGISTRY_IDS: number;
  TOTAL_CERTIFIED: number;
  TOTAL_NOT_CERTIFIED: number;
  LAST_PUBLISHED_AT: string | null;
};

type RecentRegistryRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  COUNTRY: string | null;
  DECISION_STATUS: string | null;
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

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function valueOrDash(value: string | null | undefined) {
  return value && value.trim() ? value : "—";
}

function certificationStatus(row: {
  CERTIFIED_AT: string | null;
}) {
  return row.CERTIFIED_AT ? "Certified" : "Not Certified";
}

export default async function ExplorerPage() {
  const [globalRows, countryRows, recentRows] = await Promise.all([
    sfQuery<GlobalStatsRow>(`
      SELECT
        COUNT(*) AS TOTAL_REGISTRY_RECORDS,
        COUNT(DISTINCT REGISTRY_ID) AS TOTAL_REGISTRY_IDS,
        COUNT(DISTINCT CASE_ID) AS TOTAL_CASES,
        COUNT(DISTINCT APPLICATION_ID) AS TOTAL_APPLICATIONS,
        COUNT(DISTINCT ENTITY_NAME) AS TOTAL_ENTITIES,
        COUNT(DISTINCT COUNTRY) AS TOTAL_COUNTRIES,
        COUNT_IF(LOWER(COALESCE(DECISION_STATUS, '')) = 'published') AS TOTAL_PUBLISHED,
        COUNT_IF(CERTIFIED_AT IS NOT NULL) AS TOTAL_CERTIFIED,
        COUNT_IF(CERTIFIED_AT IS NULL) AS TOTAL_NOT_CERTIFIED,
        MIN(CERTIFIED_AT) AS FIRST_PUBLISHED_AT,
        MAX(CERTIFIED_AT) AS LAST_PUBLISHED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    `),
    sfQuery<CountryStatsRow>(`
      SELECT
        COUNTRY,
        COUNT(*) AS TOTAL_RECORDS,
        COUNT(DISTINCT ENTITY_NAME) AS TOTAL_ENTITIES,
        COUNT(DISTINCT REGISTRY_ID) AS TOTAL_REGISTRY_IDS,
        COUNT_IF(CERTIFIED_AT IS NOT NULL) AS TOTAL_CERTIFIED,
        COUNT_IF(CERTIFIED_AT IS NULL) AS TOTAL_NOT_CERTIFIED,
        MAX(CERTIFIED_AT) AS LAST_PUBLISHED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE COUNTRY IS NOT NULL
      GROUP BY COUNTRY
      ORDER BY TOTAL_RECORDS DESC, COUNTRY ASC
      LIMIT 6
    `),
    sfQuery<RecentRegistryRow>(`
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        COUNTRY,
        DECISION_STATUS,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ORDER BY CERTIFIED_AT DESC NULLS LAST, ENTITY_NAME ASC
      LIMIT 5
    `),
  ]);

  const stats = globalRows[0] || null;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 max-w-[940px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Global AI governance explorer
        </h1>

        <p className="mt-5 max-w-[960px] text-[17px] leading-[1.72] text-black/72">
          The Explorer is GAFAIG’s public intelligence and discovery layer. It
          helps visitors understand where certification exists, which
          organizations and systems are represented, and how governance trust
          signals appear across the public network.
        </p>

        <p className="mt-4 max-w-[960px] text-[15px] leading-[1.8] text-black/68">
          This surface is derived directly from canonical public registry data.
          It does not expose private review materials. Instead, it provides a
          structured view into public certification records, countries,
          organizations, disclosed AI systems, and registry activity so the
          public trust footprint can be inspected as a coherent network rather
          than a set of isolated records.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <IntroCard
            title="Public governance intelligence"
            body="The Explorer transforms certification records into a navigable public intelligence layer that shows where governance trust is visible across countries, organizations, and systems."
          />
          <IntroCard
            title="Discovery built on canonical registry data"
            body="Everything shown here is derived from GAFAIG’s public registry of record, allowing visitors to move from aggregate visibility to individual certification records and trust surfaces."
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/registry"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
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
        <MetricCard
          label="Registry records"
          value={String(stats?.TOTAL_REGISTRY_RECORDS ?? "—")}
        />
        <MetricCard
          label="Certified records"
          value={String(stats?.TOTAL_CERTIFIED ?? "—")}
        />
        <MetricCard
          label="Countries"
          value={String(stats?.TOTAL_COUNTRIES ?? "—")}
        />
        <MetricCard
          label="Entities"
          value={String(stats?.TOTAL_ENTITIES ?? "—")}
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER AS INFRASTRUCTURE
        </div>

        <h2 className="mt-4 max-w-[880px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          This is the network view of GAFAIG’s public trust layer
        </h2>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
          The registry establishes the canonical certification record. The
          Explorer shows how those records connect across geography,
          organizations, systems, and activity. In that sense, the Explorer is
          not only a browsing surface. It is the public visibility layer of
          GAFAIG’s trust infrastructure, turning isolated certification records
          into a readable map of governance presence.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <StatementCard
            title="Country-level public visibility"
            body="Inspect where governance-certified records are represented geographically and how public trust signals are distributed across jurisdictions."
          />
          <StatementCard
            title="Entity and system discovery"
            body="Move from high-level public metrics to specific organizations and disclosed AI systems connected to certification records."
          />
          <StatementCard
            title="Registry activity as signal"
            body="See how the public record evolves over time through publication and certification activity without exposing private review evidence."
          />
          <StatementCard
            title="Bridge from aggregate to canonical record"
            body="Every surface in the Explorer ultimately resolves back to the underlying registry record, preserving a direct path to the canonical trust source."
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT THIS SURFACE SHOWS
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public governance visibility across the registry
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Country-level presence"
              body="See where GAFAIG-certified records are represented geographically across the public registry."
            />
            <StatementCard
              title="Organization visibility"
              body="Explore which organizations have public certification records and how they appear within the trust surface."
            />
            <StatementCard
              title="System disclosure"
              body="Inspect publicly disclosed AI systems linked to registry certification records and certification context."
            />
            <StatementCard
              title="Registry activity"
              body="Track the shape of the public record without exposing private evidence, findings, or reviewer workflow."
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <InfoPanel
              label="First published"
              value={formatDate(stats?.FIRST_PUBLISHED_AT)}
            />
            <InfoPanel
              label="Last activity"
              value={formatDate(stats?.LAST_PUBLISHED_AT)}
            />
            <InfoPanel
              label="Published records"
              value={String(stats?.TOTAL_PUBLISHED ?? "—")}
            />
            <InfoPanel
              label="Registry IDs"
              value={String(stats?.TOTAL_REGISTRY_IDS ?? "—")}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                RECENT CERTIFICATION RECORDS
              </div>
              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Latest public certifications
              </h2>
            </div>

            <Link
              href="/registry"
              className="text-sm font-semibold underline underline-offset-4"
            >
              Open full registry →
            </Link>
          </div>

          <div className="mt-8 grid gap-4">
            {recentRows.length === 0 ? (
              <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
                No recent public registry records are available.
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
                      value={certificationStatus(row)}
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
              TOP COUNTRIES
            </div>
            <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Public registry distribution by country
            </h2>
            <p className="mt-4 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
              These rows reflect the public certification footprint visible in
              the registry today.
            </p>
          </div>

          <Link
            href="/explorer/countries"
            className="text-sm font-semibold underline underline-offset-4"
          >
            View all countries →
          </Link>
        </div>

        <div className="mt-8 grid gap-4">
          {countryRows.length === 0 ? (
            <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
              No country-level registry data is available.
            </div>
          ) : (
            countryRows.map((row) => (
              <Link
                key={row.COUNTRY || "Unknown"}
                href={`/explorer/countries/${encodeURIComponent(
                  row.COUNTRY || "Unknown"
                )}`}
                className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-[22px] font-semibold tracking-tight text-black">
                      {valueOrDash(row.COUNTRY)}
                    </div>
                    <div className="mt-2 text-sm text-black/65">
                      Last activity {formatDate(row.LAST_PUBLISHED_AT)}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          title="Countries"
          body="See where public certification records are represented geographically."
          href="/explorer/countries"
          cta="Open countries"
        />
        <FeatureCard
          title="Organizations"
          body="Browse the organizations that appear in GAFAIG’s public registry."
          href="/explorer/organizations"
          cta="Open organizations"
        />
        <FeatureCard
          title="Systems"
          body="Review disclosed AI systems linked to registry certification records."
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

function IntroCard({
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
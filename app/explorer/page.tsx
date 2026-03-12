import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

type ExplorerSummaryRow = {
  TOTAL_ORGANIZATIONS: number | null;
  TOTAL_SYSTEMS: number | null;
  TOTAL_COUNTRIES: number | null;
  APPROVED_ORGANIZATIONS: number | null;
};

type TierRow = {
  CERTIFIED_TIER: string | null;
  ORG_COUNT: number | null;
};

type RiskRow = {
  RISK_TIER: string | null;
  SYSTEM_COUNT: number | null;
};

type OversightRow = {
  OVERSIGHT_LEVEL: string | null;
  SYSTEM_COUNT: number | null;
};

function num(value: number | null | undefined) {
  return Number(value ?? 0);
}

export default async function ExplorerPage() {
  const [summaryRes, tierRes, riskRes, oversightRes] = await Promise.all([
    sfQueryResult<ExplorerSummaryRow>(
      `
      SELECT
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC) AS TOTAL_ORGANIZATIONS,
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC) AS TOTAL_SYSTEMS,
        (SELECT COUNT(DISTINCT COUNTRY) FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC WHERE COUNTRY IS NOT NULL) AS TOTAL_COUNTRIES,
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC WHERE UPPER(COALESCE(DECISION_STATUS, '')) = 'APPROVED') AS APPROVED_ORGANIZATIONS
      `
    ),
    sfQueryResult<TierRow>(
      `
      SELECT
        CERTIFIED_TIER,
        COUNT(*) AS ORG_COUNT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      GROUP BY CERTIFIED_TIER
      ORDER BY ORG_COUNT DESC, CERTIFIED_TIER ASC
      `
    ),
    sfQueryResult<RiskRow>(
      `
      SELECT
        RISK_TIER,
        COUNT(*) AS SYSTEM_COUNT
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      GROUP BY RISK_TIER
      ORDER BY SYSTEM_COUNT DESC, RISK_TIER ASC
      `
    ),
    sfQueryResult<OversightRow>(
      `
      SELECT
        OVERSIGHT_LEVEL,
        COUNT(*) AS SYSTEM_COUNT
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      GROUP BY OVERSIGHT_LEVEL
      ORDER BY SYSTEM_COUNT DESC, OVERSIGHT_LEVEL ASC
      `
    ),
  ]);

  const summary = summaryRes.ok ? summaryRes.rows?.[0] ?? null : null;
  const tiers = tierRes.ok ? tierRes.rows ?? [] : [];
  const risks = riskRes.ok ? riskRes.rows ?? [] : [];
  const oversight = oversightRes.ok ? oversightRes.rows ?? [] : [];

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="EXPLORER"
        title="Global AI Governance Explorer"
        description="A public explorer for GAFAIG-certified organizations and disclosed AI systems. This layer surfaces governance coverage, certification distribution, and oversight patterns without exposing private evidence."
        actions={
          <>
            <Link
              href="/explorer/organizations"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Explore organizations
            </Link>

            <Link
              href="/explorer/systems"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Explore systems
            </Link>

            <Link
              href="/explorer/countries"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Explore countries
            </Link>

            <Link
              href="/explorer/map"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open map
            </Link>
          </>
        }
      />

      {!summaryRes.ok ? (
        <ErrorBox message={summaryRes.error} />
      ) : (
        <>
          <section className="mt-10 grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Certified organizations"
              value={String(num(summary?.TOTAL_ORGANIZATIONS))}
            />
            <MetricCard
              label="Disclosed AI systems"
              value={String(num(summary?.TOTAL_SYSTEMS))}
            />
            <MetricCard
              label="Countries represented"
              value={String(num(summary?.TOTAL_COUNTRIES))}
            />
            <MetricCard
              label="Approved organizations"
              value={String(num(summary?.APPROVED_ORGANIZATIONS))}
            />
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-4">
            <ExplorerCard
              title="Organizations"
              body="Browse the public organizations represented in the GAFAIG registry."
              href="/explorer/organizations"
              cta="Open organizations"
            />
            <ExplorerCard
              title="Systems"
              body="Explore disclosed AI systems, risk tiers, oversight levels, and public certification context."
              href="/explorer/systems"
              cta="Open systems"
            />
            <ExplorerCard
              title="Countries"
              body="Review country-level participation, system counts, and risk distribution."
              href="/explorer/countries"
              cta="Open countries"
            />
            <ExplorerCard
              title="Map"
              body="View global geographic coverage of certified organizations and disclosed systems."
              href="/explorer/map"
              cta="Open map"
            />
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            <DistributionCard
              title="Tier distribution"
              rows={tiers.map((row) => ({
                label: row.CERTIFIED_TIER ?? "Unspecified",
                value: num(row.ORG_COUNT),
              }))}
            />

            <DistributionCard
              title="System risk distribution"
              rows={risks.map((row) => ({
                label: row.RISK_TIER ?? "Unspecified",
                value: num(row.SYSTEM_COUNT),
              }))}
            />

            <DistributionCard
              title="Oversight distribution"
              rows={oversight.map((row) => ({
                label: row.OVERSIGHT_LEVEL ?? "Unspecified",
                value: num(row.SYSTEM_COUNT),
              }))}
            />
          </section>

          <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              WHAT THIS EXPLORER SHOWS
            </div>

            <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Public governance visibility without exposing reviewer evidence
            </h2>

            <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
              The explorer aggregates public governance signals from the GAFAIG
              registry. It helps users understand how many organizations and AI
              systems are represented, what certification tiers are most common,
              and how risk and oversight are distributed across disclosed
              systems.
            </p>
          </section>
        </>
      )}
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </div>
      <div className="mt-2 text-[28px] font-semibold text-black">{value}</div>
    </div>
  );
}

function ExplorerCard({
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

function DistributionCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5">
      <h3 className="text-[20px] font-semibold tracking-tight text-black">
        {title}
      </h3>
      <div className="mt-4 space-y-3">
        {rows.length === 0 ? (
          <div className="text-sm text-black/60">No public data available.</div>
        ) : (
          rows.map((row) => (
            <div
              key={`${title}-${row.label}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-black/5 px-3 py-2"
            >
              <div className="text-sm text-black/75">{row.label}</div>
              <div className="text-sm font-semibold text-black">{row.value}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      Failed to load explorer data.
      <div className="mt-2 break-words text-red-600">{message}</div>
    </div>
  );
}
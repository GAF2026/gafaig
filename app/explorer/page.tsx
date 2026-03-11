import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";

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
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-10">
          <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Global governance explorer
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Global AI Governance Explorer
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            A public explorer for GAFAIG-certified organizations and disclosed AI
            systems. This layer surfaces governance coverage, certification
            distribution, and oversight patterns without exposing private
            evidence.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/explorer/organizations"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Explore organizations
            </Link>
            <Link
              href="/explorer/systems"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Explore systems
            </Link>
            <Link
              href="/explorer/countries"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Explore countries
            </Link>
            <Link
              href="/registry"
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
            >
              Browse registry
            </Link>
          </div>
        </section>

        {!summaryRes.ok ? (
          <ErrorBox message={summaryRes.error} />
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4">
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

            <section className="mt-10 rounded-2xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold text-black">
                What this explorer shows
              </h2>
              <p className="mt-3 max-w-4xl text-[15px] leading-[1.8] text-black/75">
                The explorer aggregates public governance signals from the
                GAFAIG registry. It helps users understand how many organizations
                and AI systems are represented, what certification tiers are
                most common, and how risk and oversight are distributed across
                disclosed systems.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </div>
      <div className="mt-2 text-[28px] font-semibold text-black">{value}</div>
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
    <div className="rounded-2xl border border-black/10 p-5">
      <h3 className="text-[16px] font-semibold text-black">{title}</h3>
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
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      Failed to load explorer data.
      <div className="mt-2 break-words text-red-600">{message}</div>
    </div>
  );
}
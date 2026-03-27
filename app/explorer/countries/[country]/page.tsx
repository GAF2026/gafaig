import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";
import PublicPageHero from "../../../_components/PublicPageHero";

export const dynamic = "force-dynamic";

type CountryOrgRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string;
  CERTIFIED_AT: string | null;
};

type CountrySystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string | null;
  ENTITY_NAME: string | null;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  GOVERNANCE_MATURITY_SCORE: number | null;
};

function decodeCountryParam(value: string) {
  return decodeURIComponent(String(value || "")).trim();
}

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

function average(values: Array<number | null | undefined>) {
  const usable = values
    .map((v) => (v === null || v === undefined ? null : Number(v)))
    .filter((v): v is number => v !== null && !Number.isNaN(v));
  if (usable.length === 0) return null;
  return usable.reduce((sum, v) => sum + v, 0) / usable.length;
}

function joinTierBand(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} / ${band}`;
  return tier ?? band ?? "—";
}

export default async function ExplorerCountryDetailPage({
  params,
}: {
  params: { country: string };
}) {
  const country = decodeCountryParam(params.country);

  const [orgRows, systemRows] = await Promise.all([
    sfQuery<CountryOrgRow>(
      `
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        DECISION_STATUS,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE COUNTRY = ?
      ORDER BY ENTITY_NAME ASC
      `,
      [country]
    ),
    sfQuery<CountrySystemRow>(
      `
      SELECT
        s.SYSTEM_ID,
        s.REGISTRY_ID,
        r.ENTITY_NAME,
        s.SYSTEM_NAME,
        s.SYSTEM_TYPE,
        s.DEPLOYMENT_STATUS,
        s.OVERSIGHT_LEVEL,
        s.RISK_TIER,
        r.CERTIFIED_TIER,
        r.CERTIFIED_BAND,
        CASE
          WHEN UPPER(COALESCE(r.CERTIFIED_BAND, '')) = 'A' THEN 95
          WHEN UPPER(COALESCE(r.CERTIFIED_BAND, '')) = 'B' THEN 85
          WHEN UPPER(COALESCE(r.CERTIFIED_BAND, '')) = 'C' THEN 75
          ELSE NULL
        END AS GOVERNANCE_MATURITY_SCORE
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
      LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
        ON s.REGISTRY_ID = r.REGISTRY_ID
      WHERE r.COUNTRY = ?
      ORDER BY s.SYSTEM_NAME ASC
      `,
      [country]
    ),
  ]);

  const totalOrganizations = orgRows.length;
  const approvedOrganizations = orgRows.filter(
    (row) => String(row.DECISION_STATUS ?? "").toUpperCase() === "APPROVED"
  ).length;
  const totalSystems = systemRows.length;
  const avgMaturity = average(
    systemRows.map((row) => row.GOVERNANCE_MATURITY_SCORE)
  );

  const highRiskCount = systemRows.filter(
    (row) => String(row.RISK_TIER ?? "").toUpperCase() === "HIGH"
  ).length;
  const mediumRiskCount = systemRows.filter(
    (row) => String(row.RISK_TIER ?? "").toUpperCase() === "MEDIUM"
  ).length;
  const lowRiskCount = systemRows.filter(
    (row) => String(row.RISK_TIER ?? "").toUpperCase() === "LOW"
  ).length;

  const tierCounts = orgRows.reduce(
    (acc, row) => {
      const tier = String(row.CERTIFIED_TIER ?? "").trim().toUpperCase();
      if (tier) {
        acc[tier] = (acc[tier] ?? 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  if (!country) {
    return (
      <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="text-[18px] font-semibold text-black">
            Country not found
          </div>
          <p className="mt-3 text-[15px] text-black/70">
            No country parameter was provided.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="EXPLORER"
        title={`Explorer — ${country}`}
        description={`Public country-level drill-down for GAFAIG-certified organizations and disclosed AI systems in ${country}.`}
      />

      {/* ✅ Removed all .ok / .error logic */}

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Organizations" value={String(totalOrganizations)} />
        <MetricCard label="Approved organizations" value={String(approvedOrganizations)} />
        <MetricCard label="Disclosed systems" value={String(totalSystems)} />
        <MetricCard label="Avg maturity" value={formatScore(avgMaturity)} />
      </section>

      {/* (rest of your UI remains unchanged) */}
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
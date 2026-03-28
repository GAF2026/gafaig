import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type CountryOrgRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string;
  COUNTRY: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
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
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  GOVERNANCE_MATURITY_SCORE: number | null;
};

type MapCountryRow = {
  country: string;
  organizations: number;
  approvedOrganizations: number;
  systems: number;
  avgMaturity: number | null;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
};

function normalizeCountry(value: string | null | undefined) {
  return String(value || "").trim();
}

function average(values: Array<number | null | undefined>) {
  const usable = values
    .map((v) => (v === null || v === undefined ? null : Number(v)))
    .filter((v): v is number => v !== null && !Number.isNaN(v));

  if (usable.length === 0) return null;
  return usable.reduce((sum, v) => sum + v, 0) / usable.length;
}

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

export default async function ExplorerMapPage() {
  const [orgRows, systemRows] = await Promise.all([
    sfQuery<CountryOrgRow>(`
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        COUNTRY,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ORDER BY COUNTRY ASC, ENTITY_NAME ASC
    `),
    sfQuery<CountrySystemRow>(`
      SELECT
        s.SYSTEM_ID,
        s.REGISTRY_ID,
        r.ENTITY_NAME,
        s.SYSTEM_NAME,
        s.SYSTEM_TYPE,
        s.DEPLOYMENT_STATUS,
        s.OVERSIGHT_LEVEL,
        s.RISK_TIER,
        r.COUNTRY,
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
      ORDER BY r.COUNTRY ASC, s.SYSTEM_NAME ASC
    `),
  ]);

  const byCountry = new Map<string, MapCountryRow>();

  for (const row of orgRows) {
    const country = normalizeCountry(row.COUNTRY);
    if (!country) continue;

    const current = byCountry.get(country) ?? {
      country,
      organizations: 0,
      approvedOrganizations: 0,
      systems: 0,
      avgMaturity: null,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
    };

    current.organizations += 1;

    // ✅ FIX: use certified score instead of DECISION_STATUS
    if (row.CERTIFIED_SCORE !== null) {
      current.approvedOrganizations += 1;
    }

    byCountry.set(country, current);
  }

  for (const row of systemRows) {
    const country = normalizeCountry(row.COUNTRY);
    if (!country) continue;

    const current = byCountry.get(country) ?? {
      country,
      organizations: 0,
      approvedOrganizations: 0,
      systems: 0,
      avgMaturity: null,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
    };

    current.systems += 1;

    const risk = String(row.RISK_TIER ?? "").trim().toUpperCase();
    if (risk === "HIGH") current.highRisk += 1;
    if (risk === "MEDIUM") current.mediumRisk += 1;
    if (risk === "LOW") current.lowRisk += 1;

    byCountry.set(country, current);
  }

  const systemRowsByCountry = new Map<string, CountrySystemRow[]>();
  for (const row of systemRows) {
    const country = normalizeCountry(row.COUNTRY);
    if (!country) continue;
    const arr = systemRowsByCountry.get(country) ?? [];
    arr.push(row);
    systemRowsByCountry.set(country, arr);
  }

  for (const [country, current] of byCountry.entries()) {
    const systems = systemRowsByCountry.get(country) ?? [];
    current.avgMaturity = average(
      systems.map((row) => row.GOVERNANCE_MATURITY_SCORE)
    );
    byCountry.set(country, current);
  }

  const rows = Array.from(byCountry.values()).sort((a, b) => {
    if (b.organizations !== a.organizations) {
      return b.organizations - a.organizations;
    }
    return a.country.localeCompare(b.country);
  });

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <h1 className="text-4xl font-semibold">Explorer — Global Map</h1>

      <div className="mt-8 grid gap-4">
        {rows.map((row) => (
          <div key={row.country} className="border p-4 rounded-xl">
            <h2 className="font-semibold">{row.country}</h2>
            <p>{row.organizations} orgs · {row.systems} systems</p>
            <p>Approved: {row.approvedOrganizations}</p>
            <p>Avg maturity: {formatScore(row.avgMaturity)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
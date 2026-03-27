import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type CountryOrgRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string;
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
    sfQuery<CountryOrgRow>(
      `
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        COUNTRY,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        DECISION_STATUS,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ORDER BY COUNTRY ASC, ENTITY_NAME ASC
      `
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
      `
    ),
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

    if (String(row.DECISION_STATUS ?? "").toUpperCase() === "APPROVED") {
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
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Explorer — Global Map
        </h1>

        <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
          Country-level public registry coverage for GAFAIG-certified
          organizations and disclosed AI systems.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explorer"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to explorer
          </Link>
          <Link
            href="/explorer/countries"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            View countries
          </Link>
          <Link
            href="/explorer/organizations"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            View organizations
          </Link>
          <Link
            href="/explorer/systems"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            View systems
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Countries" value={String(rows.length)} />
        <MetricCard label="Organizations" value={String(orgRows.length)} />
        <MetricCard label="Disclosed systems" value={String(systemRows.length)} />
        <MetricCard
          label="Avg maturity"
          value={formatScore(
            average(systemRows.map((row) => row.GOVERNANCE_MATURITY_SCORE))
          )}
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          MAP DIRECTORY
        </div>

        <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Country coverage
        </h2>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public country map data available.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {rows.map((row) => (
              <div
                key={row.country}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[20px] font-semibold text-black">
                      {row.country}
                    </h3>
                    <div className="mt-2 text-[14px] text-black/65">
                      {row.organizations} organizations · {row.systems} systems
                    </div>
                  </div>

                  <Link
                    href={`/explorer/countries/${encodeURIComponent(row.country)}`}
                    className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                  >
                    Open country detail
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-6">
                  <Info label="Organizations" value={String(row.organizations)} />
                  <Info
                    label="Approved orgs"
                    value={String(row.approvedOrganizations)}
                  />
                  <Info label="Systems" value={String(row.systems)} />
                  <Info label="Avg maturity" value={formatScore(row.avgMaturity)} />
                  <Info label="High risk" value={String(row.highRisk)} />
                  <Info
                    label="Medium / Low"
                    value={`${row.mediumRisk} / ${row.lowRisk}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85">{value}</div>
    </div>
  );
}
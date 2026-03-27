import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

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
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Explorer — {country}
        </h1>

        <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
          Public country-level drill-down for GAFAIG-certified organizations and
          disclosed AI systems in {country}.
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
            All countries
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
        <MetricCard label="Organizations" value={String(totalOrganizations)} />
        <MetricCard
          label="Approved organizations"
          value={String(approvedOrganizations)}
        />
        <MetricCard label="Disclosed systems" value={String(totalSystems)} />
        <MetricCard label="Avg maturity" value={formatScore(avgMaturity)} />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          COUNTRY DETAIL
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          {country}
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Info label="Organizations" value={String(totalOrganizations)} />
          <Info
            label="Approved orgs"
            value={String(approvedOrganizations)}
          />
          <Info label="Systems" value={String(totalSystems)} />
          <Info label="Avg maturity" value={formatScore(avgMaturity)} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Info label="High-risk systems" value={String(highRiskCount)} />
          <Info label="Medium-risk systems" value={String(mediumRiskCount)} />
          <Info label="Low-risk systems" value={String(lowRiskCount)} />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              ORGANIZATIONS
            </div>
            <h3 className="mt-3 text-[28px] font-semibold tracking-tight text-black">
              Certified organizations in {country}
            </h3>
          </div>

          <Link
            href="/explorer/countries"
            className="rounded-full border border-black px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
          >
            Back to countries
          </Link>
        </div>

        {orgRows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No organizations found for this country.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {orgRows.map((row) => (
              <div
                key={`${row.REGISTRY_ID}-${row.ENTITY_NAME}`}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-[20px] font-semibold text-black">
                      {row.ENTITY_NAME}
                    </div>
                    <div className="mt-2 text-[14px] text-black/65">
                      {joinTierBand(row.CERTIFIED_TIER, row.CERTIFIED_BAND)} ·{" "}
                      {row.DECISION_STATUS}
                    </div>
                  </div>

                  <Link
                    href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                    className="rounded-full border border-black px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
                  >
                    View registry record
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          DISCLOSED SYSTEMS
        </div>
        <h3 className="mt-3 text-[28px] font-semibold tracking-tight text-black">
          AI systems associated with {country}
        </h3>

        {systemRows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No AI systems found for this country.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {systemRows.map((row) => (
              <div
                key={`${row.SYSTEM_ID}-${row.SYSTEM_NAME ?? ""}`}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="text-[18px] font-semibold text-black">
                  {row.SYSTEM_NAME ?? row.SYSTEM_ID}
                </div>
                <div className="mt-2 text-[14px] text-black/65">
                  {(row.SYSTEM_TYPE ?? "—")} · {(row.RISK_TIER ?? "—")} ·{" "}
                  {(row.OVERSIGHT_LEVEL ?? "—")}
                </div>
              </div>
            ))}
          </div>
        )}
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
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </div>
      <div className="mt-2 text-[28px] font-semibold text-black">{value}</div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85">{value}</div>
    </div>
  );
}
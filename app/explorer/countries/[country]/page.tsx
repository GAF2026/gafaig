import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type CountryOrgRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_TIER_LEVEL: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_AT: string | null;
  VALID_TO: string | null;
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
  CERTIFIED_TIER_LEVEL: string | null;
  CERTIFIED_BAND: string | null;
  GOVERNANCE_MATURITY_SCORE: number | null;
};

function normalizeCountry(value: string | null | undefined) {
  return String(value || "").trim();
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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

function tierBandLabel(
  tier: string | null | undefined,
  tierLevel: string | null | undefined,
  band: string | null | undefined
) {
  const bestTier = String(tierLevel || tier || "").trim();
  const bestBand = String(band || "").trim();

  if (bestTier && bestBand) return `${bestTier} · Band ${bestBand}`;
  if (bestTier) return bestTier;
  if (bestBand) return `Band ${bestBand}`;
  return "—";
}

type PageProps = {
  params: {
    country: string;
  };
};

export default async function ExplorerCountryDetailPage({ params }: PageProps) {
  const countryParam = decodeURIComponent(params.country);
  const country = normalizeCountry(countryParam);

  const [orgRows, systemRows] = await Promise.all([
    sfQuery<CountryOrgRow>(
      `
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_TIER_LEVEL,
        CERTIFIED_BAND,
        CERTIFICATION_STATUS,
        CERTIFIED_AT,
        VALID_TO
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE UPPER(TRIM(COUNTRY)) = UPPER(TRIM(?))
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
        r.COUNTRY,
        r.CERTIFIED_TIER,
        r.CERTIFIED_TIER_LEVEL,
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
      WHERE UPPER(TRIM(r.COUNTRY)) = UPPER(TRIM(?))
      ORDER BY s.SYSTEM_NAME ASC
      `,
      [country]
    ),
  ]);

  const certifiedCount = orgRows.filter((row) => row.CERTIFIED_SCORE !== null).length;
  const avgMaturity = average(systemRows.map((row) => row.GOVERNANCE_MATURITY_SCORE));
  const highRisk = systemRows.filter(
    (row) => String(row.RISK_TIER ?? "").trim().toUpperCase() === "HIGH"
  ).length;
  const mediumRisk = systemRows.filter(
    (row) => String(row.RISK_TIER ?? "").trim().toUpperCase() === "MEDIUM"
  ).length;
  const lowRisk = systemRows.filter(
    (row) => String(row.RISK_TIER ?? "").trim().toUpperCase() === "LOW"
  ).length;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Explorer — {country || "Country"}
        </h1>

        <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
          Country-level public explorer detail for GAFAIG-certified organizations
          and disclosed AI systems.
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
            Organizations
          </Link>
          <Link
            href="/explorer/systems"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Systems
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Organizations" value={String(orgRows.length)} />
        <MetricCard label="Certified" value={String(certifiedCount)} />
        <MetricCard label="Systems" value={String(systemRows.length)} />
        <MetricCard label="Avg maturity" value={formatScore(avgMaturity)} />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          COUNTRY OVERVIEW
        </div>

        <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          {country}
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Info label="High-risk systems" value={String(highRisk)} />
          <Info label="Medium-risk systems" value={String(mediumRisk)} />
          <Info label="Low-risk systems" value={String(lowRisk)} />
          <Info label="Avg maturity" value={formatScore(avgMaturity)} />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          ORGANIZATIONS
        </div>

        <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Registry organizations in {country}
        </h2>

        {orgRows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public organization data available for this country.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {orgRows.map((row) => (
              <div
                key={row.REGISTRY_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[20px] font-semibold text-black">
                      {row.ENTITY_NAME}
                    </h3>
                    <div className="mt-2 text-[14px] text-black/65">
                      {row.ENTITY_TYPE || "—"}
                    </div>
                  </div>

                  <Link
                    href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                    className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                  >
                    View registry record
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-5">
                  <Info
                    label="Tier / Band"
                    value={tierBandLabel(
                      row.CERTIFIED_TIER,
                      row.CERTIFIED_TIER_LEVEL,
                      row.CERTIFIED_BAND
                    )}
                  />
                  <Info label="Score" value={formatScore(row.CERTIFIED_SCORE)} />
                  <Info
                    label="Certification"
                    value={row.CERTIFICATION_STATUS || "—"}
                  />
                  <Info label="Certified at" value={formatDate(row.CERTIFIED_AT)} />
                  <Info label="Valid to" value={formatDate(row.VALID_TO)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          AI SYSTEMS
        </div>

        <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Disclosed systems in {country}
        </h2>

        {systemRows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No disclosed AI systems available for this country.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {systemRows.map((row) => (
              <div
                key={row.SYSTEM_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <h3 className="text-[20px] font-semibold text-black">
                  {row.SYSTEM_NAME || row.SYSTEM_ID}
                </h3>

                <div className="mt-2 text-[14px] text-black/65">
                  {(row.ENTITY_NAME || "Unknown entity")} · {(row.SYSTEM_TYPE || "—")}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-5">
                  <Info label="Risk tier" value={row.RISK_TIER || "—"} />
                  <Info label="Oversight" value={row.OVERSIGHT_LEVEL || "—"} />
                  <Info
                    label="Deployment"
                    value={row.DEPLOYMENT_STATUS || "—"}
                  />
                  <Info
                    label="Tier / Band"
                    value={tierBandLabel(
                      row.CERTIFIED_TIER,
                      row.CERTIFIED_TIER_LEVEL,
                      row.CERTIFIED_BAND
                    )}
                  />
                  <Info
                    label="Maturity"
                    value={formatScore(row.GOVERNANCE_MATURITY_SCORE)}
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
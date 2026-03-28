import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type CountryOrgRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFICATION_STATUS: string | null;
  DECISION_STATUS: string | null;
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
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
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

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

export default async function ExplorerCountryDetailPage({
  params,
}: {
  params: { country: string };
}) {
  const country = decodeURIComponent(String(params.country || "")).trim();

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
        CERTIFIED_BAND,
        CERTIFICATION_STATUS,
        DECISION_STATUS,
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
        r.CERTIFIED_SCORE,
        r.CERTIFIED_TIER,
        r.CERTIFIED_BAND
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
      LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
        ON s.REGISTRY_ID = r.REGISTRY_ID
      WHERE UPPER(TRIM(r.COUNTRY)) = UPPER(TRIM(?))
      ORDER BY s.SYSTEM_NAME ASC
      `,
      [country]
    ),
  ]);

  const certifiedCount = orgRows.filter(
    (row) => String(row.CERTIFICATION_STATUS || "").trim() === "Certified"
  ).length;

  const highRiskCount = systemRows.filter(
    (row) => String(row.RISK_TIER || "").trim().toUpperCase() === "HIGH"
  ).length;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          {country}
        </h1>

        <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
          Country-level view of public registry records and disclosed AI systems.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explorer/countries"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to countries
          </Link>
          <Link
            href="/explorer"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Explorer home
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Organizations" value={String(orgRows.length)} />
        <MetricCard label="Systems" value={String(systemRows.length)} />
        <MetricCard label="Certified" value={String(certifiedCount)} />
        <MetricCard label="High risk systems" value={String(highRiskCount)} />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            ORGANIZATIONS
          </div>

          <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-black">
            Registry records
          </h2>

          <div className="mt-6 grid gap-4">
            {orgRows.length === 0 ? (
              <div className="rounded-2xl border border-black/10 p-5 text-sm text-black/65">
                No registry records found for this country.
              </div>
            ) : (
              orgRows.map((row) => (
                <Link
                  key={row.REGISTRY_ID}
                  href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                  className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
                >
                  <div className="text-[20px] font-semibold text-black">
                    {row.ENTITY_NAME || row.REGISTRY_ID}
                  </div>
                  <div className="mt-2 text-sm text-black/65">
                    {row.ENTITY_TYPE || "Organization"}
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <Info label="Score" value={formatScore(row.CERTIFIED_SCORE)} />
                    <Info
                      label="Tier / Band"
                      value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
                    />
                    <Info label="Status" value={row.CERTIFICATION_STATUS || "—"} />
                    <Info label="Decision" value={row.DECISION_STATUS || "—"} />
                    <Info label="Certified at" value={formatDate(row.CERTIFIED_AT)} />
                    <Info label="Valid to" value={formatDate(row.VALID_TO)} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            SYSTEMS
          </div>

          <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-black">
            Disclosed AI systems
          </h2>

          <div className="mt-6 grid gap-4">
            {systemRows.length === 0 ? (
              <div className="rounded-2xl border border-black/10 p-5 text-sm text-black/65">
                No public AI systems found for this country.
              </div>
            ) : (
              systemRows.map((row) => (
                <div
                  key={row.SYSTEM_ID}
                  className="rounded-2xl border border-black/10 p-5"
                >
                  <div className="text-[20px] font-semibold text-black">
                    {row.SYSTEM_NAME || row.SYSTEM_ID}
                  </div>
                  <div className="mt-2 text-sm text-black/65">
                    {row.ENTITY_NAME || "Unknown organization"}
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <Info label="Type" value={row.SYSTEM_TYPE || "—"} />
                    <Info label="Deployment" value={row.DEPLOYMENT_STATUS || "—"} />
                    <Info label="Oversight" value={row.OVERSIGHT_LEVEL || "—"} />
                    <Info label="Risk tier" value={row.RISK_TIER || "—"} />
                    <Info label="Score" value={formatScore(row.CERTIFIED_SCORE)} />
                    <Info
                      label="Tier / Band"
                      value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
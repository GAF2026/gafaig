import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";
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

  const [orgRes, systemRes] = await Promise.all([
    sfQueryResult<CountryOrgRow>(
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
    sfQueryResult<CountrySystemRow>(
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

  const orgRows = orgRes.ok ? orgRes.rows ?? [] : [];
  const systemRows = systemRes.ok ? systemRes.rows ?? [] : [];

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
        description={`Public country-level drill-down for GAFAIG-certified organizations and disclosed AI systems in ${country}. This page surfaces public certification signals, AI system exposure, and governance maturity where available.`}
        actions={
          <>
            <Link
              href="/explorer/countries"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Back to countries
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
          </>
        }
      />

      {!orgRes.ok ? (
        <ErrorBox message={orgRes.error} />
      ) : !systemRes.ok ? (
        <ErrorBox message={systemRes.error} />
      ) : (
        <>
          <section className="mt-10 grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Organizations"
              value={String(totalOrganizations)}
            />
            <MetricCard
              label="Approved organizations"
              value={String(approvedOrganizations)}
            />
            <MetricCard
              label="Disclosed systems"
              value={String(totalSystems)}
            />
            <MetricCard
              label="Avg maturity"
              value={formatScore(avgMaturity)}
            />
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="High-risk systems"
              value={String(highRiskCount)}
            />
            <MetricCard
              label="Medium-risk systems"
              value={String(mediumRiskCount)}
            />
            <MetricCard
              label="Low-risk systems"
              value={String(lowRiskCount)}
            />
          </section>

          <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              CERTIFICATION MIX
            </div>

            <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Public certification distribution in {country}
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {Object.keys(tierCounts).length === 0 ? (
                <div className="text-sm text-black/60">
                  No public certification tier data available.
                </div>
              ) : (
                Object.entries(tierCounts)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([tier, count]) => (
                    <Info
                      key={tier}
                      label={`Tier ${tier}`}
                      value={String(count)}
                    />
                  ))
              )}
            </div>
          </section>

          <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              ORGANIZATIONS
            </div>

            <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Organizations in {country}
            </h2>

            {orgRows.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
                No public organizations found for this country.
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
                          <Link
                            href={`/registry/${encodeURIComponent(
                              row.REGISTRY_ID
                            )}`}
                            className="hover:underline"
                          >
                            {row.ENTITY_NAME}
                          </Link>
                        </h3>
                        <div className="mt-2 text-[14px] text-black/65">
                          {row.REGISTRY_ID}
                        </div>
                      </div>

                      <Link
                        href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                        className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                      >
                        View certification
                      </Link>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-5">
                      <Info label="Entity type" value={row.ENTITY_TYPE ?? "—"} />
                      <Info label="Country" value={row.COUNTRY ?? "—"} />
                      <Info label="Status" value={row.DECISION_STATUS ?? "—"} />
                      <Info
                        label="Tier / band"
                        value={joinTierBand(
                          row.CERTIFIED_TIER,
                          row.CERTIFIED_BAND
                        )}
                      />
                      <Info
                        label="Certified at"
                        value={formatDate(row.CERTIFIED_AT)}
                      />
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

            <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              AI systems in {country}
            </h2>

            {systemRows.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
                No public AI systems found for this country.
              </div>
            ) : (
              <div className="mt-8 grid gap-4">
                {systemRows.map((row) => (
                  <div
                    key={row.SYSTEM_ID}
                    className="rounded-2xl border border-black/10 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[20px] font-semibold text-black">
                          <Link
                            href={`/ai-systems/${encodeURIComponent(
                              row.SYSTEM_ID
                            )}`}
                            className="hover:underline"
                          >
                            {row.SYSTEM_NAME ?? "Unnamed AI system"}
                          </Link>
                        </h3>
                        <div className="mt-2 text-[14px] text-black/65">
                          {row.SYSTEM_ID}
                        </div>
                        {row.ENTITY_NAME ? (
                          <div className="mt-2 text-[14px] text-black/70">
                            Organization:{" "}
                            <span className="font-medium text-black">
                              {row.ENTITY_NAME}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {row.REGISTRY_ID ? (
                        <Link
                          href={`/registry/${encodeURIComponent(
                            row.REGISTRY_ID
                          )}`}
                          className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                        >
                          View certification
                        </Link>
                      ) : null}
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-6">
                      <Info label="System type" value={row.SYSTEM_TYPE ?? "—"} />
                      <Info
                        label="Deployment"
                        value={row.DEPLOYMENT_STATUS ?? "—"}
                      />
                      <Info
                        label="Oversight"
                        value={row.OVERSIGHT_LEVEL ?? "—"}
                      />
                      <Info label="Risk tier" value={row.RISK_TIER ?? "—"} />
                      <Info
                        label="Tier / band"
                        value={joinTierBand(
                          row.CERTIFIED_TIER,
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

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      Failed to load country detail explorer data.
      <div className="mt-2 break-words text-red-600">{message}</div>
    </div>
  );
}
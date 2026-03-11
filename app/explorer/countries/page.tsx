import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type CountryOrgRow = {
  COUNTRY: string | null;
  ORGANIZATION_COUNT: number | null;
  APPROVED_COUNT: number | null;
  TIER_A_COUNT: number | null;
  TIER_B_COUNT: number | null;
  TIER_C_COUNT: number | null;
};

type CountrySystemRow = {
  COUNTRY: string | null;
  SYSTEM_COUNT: number | null;
  AVG_GOVERNANCE_MATURITY_SCORE: number | null;
  HIGH_RISK_SYSTEM_COUNT: number | null;
  MEDIUM_RISK_SYSTEM_COUNT: number | null;
  LOW_RISK_SYSTEM_COUNT: number | null;
};

type CountryRow = {
  country: string;
  organizationCount: number;
  approvedCount: number;
  tierACount: number;
  tierBCount: number;
  tierCCount: number;
  systemCount: number;
  avgGovernanceMaturityScore: number | null;
  highRiskSystemCount: number;
  mediumRiskSystemCount: number;
  lowRiskSystemCount: number;
};

function num(value: number | null | undefined) {
  return Number(value ?? 0);
}

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

function scoreNarrative(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "No published maturity average yet.";
  }

  const n = Number(value);
  if (n >= 90) return "Very strong public governance maturity.";
  if (n >= 75) return "Solid public governance maturity.";
  if (n >= 60) return "Developing governance maturity.";
  return "Limited published governance maturity.";
}

function sortRows(rows: CountryRow[]) {
  return [...rows].sort((a, b) => {
    if (b.organizationCount !== a.organizationCount) {
      return b.organizationCount - a.organizationCount;
    }
    if (b.systemCount !== a.systemCount) {
      return b.systemCount - a.systemCount;
    }
    return a.country.localeCompare(b.country);
  });
}

export default async function ExplorerCountriesPage() {
  const [orgRes, systemRes] = await Promise.all([
    sfQueryResult<CountryOrgRow>(
      `
      SELECT
        COUNTRY,
        COUNT(*) AS ORGANIZATION_COUNT,
        SUM(IFF(UPPER(COALESCE(DECISION_STATUS, '')) = 'APPROVED', 1, 0)) AS APPROVED_COUNT,
        SUM(IFF(UPPER(COALESCE(CERTIFIED_BAND, '')) = 'A', 1, 0)) AS TIER_A_COUNT,
        SUM(IFF(UPPER(COALESCE(CERTIFIED_BAND, '')) = 'B', 1, 0)) AS TIER_B_COUNT,
        SUM(IFF(UPPER(COALESCE(CERTIFIED_BAND, '')) = 'C', 1, 0)) AS TIER_C_COUNT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE COUNTRY IS NOT NULL
      GROUP BY COUNTRY
      ORDER BY ORGANIZATION_COUNT DESC, COUNTRY ASC
      `
    ),
    sfQueryResult<CountrySystemRow>(
      `
      SELECT
        r.COUNTRY,
        COUNT(*) AS SYSTEM_COUNT,
        AVG(s.GOVERNANCE_MATURITY_SCORE) AS AVG_GOVERNANCE_MATURITY_SCORE,
        SUM(IFF(UPPER(COALESCE(s.RISK_TIER, '')) = 'HIGH', 1, 0)) AS HIGH_RISK_SYSTEM_COUNT,
        SUM(IFF(UPPER(COALESCE(s.RISK_TIER, '')) = 'MEDIUM', 1, 0)) AS MEDIUM_RISK_SYSTEM_COUNT,
        SUM(IFF(UPPER(COALESCE(s.RISK_TIER, '')) = 'LOW', 1, 0)) AS LOW_RISK_SYSTEM_COUNT
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
      LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
        ON s.REGISTRY_ID = r.REGISTRY_ID
      WHERE r.COUNTRY IS NOT NULL
      GROUP BY r.COUNTRY
      ORDER BY SYSTEM_COUNT DESC, r.COUNTRY ASC
      `
    ),
  ]);

  const orgRows = orgRes.ok ? orgRes.rows ?? [] : [];
  const systemRows = systemRes.ok ? systemRes.rows ?? [] : [];

  const byCountry = new Map<string, CountryRow>();

  for (const row of orgRows) {
    const country = String(row.COUNTRY ?? "").trim();
    if (!country) continue;

    byCountry.set(country, {
      country,
      organizationCount: num(row.ORGANIZATION_COUNT),
      approvedCount: num(row.APPROVED_COUNT),
      tierACount: num(row.TIER_A_COUNT),
      tierBCount: num(row.TIER_B_COUNT),
      tierCCount: num(row.TIER_C_COUNT),
      systemCount: 0,
      avgGovernanceMaturityScore: null,
      highRiskSystemCount: 0,
      mediumRiskSystemCount: 0,
      lowRiskSystemCount: 0,
    });
  }

  for (const row of systemRows) {
    const country = String(row.COUNTRY ?? "").trim();
    if (!country) continue;

    const existing = byCountry.get(country) ?? {
      country,
      organizationCount: 0,
      approvedCount: 0,
      tierACount: 0,
      tierBCount: 0,
      tierCCount: 0,
      systemCount: 0,
      avgGovernanceMaturityScore: null,
      highRiskSystemCount: 0,
      mediumRiskSystemCount: 0,
      lowRiskSystemCount: 0,
    };

    existing.systemCount = num(row.SYSTEM_COUNT);
    existing.avgGovernanceMaturityScore =
      row.AVG_GOVERNANCE_MATURITY_SCORE === null ||
      row.AVG_GOVERNANCE_MATURITY_SCORE === undefined
        ? null
        : Number(row.AVG_GOVERNANCE_MATURITY_SCORE);
    existing.highRiskSystemCount = num(row.HIGH_RISK_SYSTEM_COUNT);
    existing.mediumRiskSystemCount = num(row.MEDIUM_RISK_SYSTEM_COUNT);
    existing.lowRiskSystemCount = num(row.LOW_RISK_SYSTEM_COUNT);

    byCountry.set(country, existing);
  }

  const rows = sortRows(Array.from(byCountry.values()));

  const totalCountries = rows.length;
  const totalOrganizations = rows.reduce((sum, row) => sum + row.organizationCount, 0);
  const totalSystems = rows.reduce((sum, row) => sum + row.systemCount, 0);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8">
          <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Global governance explorer
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Explorer — Countries
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            Public country-level view of the GAFAIG registry, showing where
            certified organizations and disclosed AI systems are represented,
            along with public governance maturity and risk distribution where
            available.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/explorer"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Back to explorer
            </Link>
            <Link
              href="/explorer/organizations"
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
            >
              View organizations
            </Link>
            <Link
              href="/explorer/systems"
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
            >
              View systems
            </Link>
          </div>
        </section>

        {!orgRes.ok ? (
          <ErrorBox message={orgRes.error} />
        ) : !systemRes.ok ? (
          <ErrorBox message={systemRes.error} />
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <MetricCard
                label="Countries represented"
                value={String(totalCountries)}
              />
              <MetricCard
                label="Certified organizations"
                value={String(totalOrganizations)}
              />
              <MetricCard
                label="Disclosed AI systems"
                value={String(totalSystems)}
              />
            </section>

            <section className="mt-10 grid gap-4">
              {rows.length === 0 ? (
                <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
                  No country-level public registry data is available yet.
                </div>
              ) : (
                rows.map((row) => (
                  <div
                    key={row.country}
                    className="rounded-2xl border border-black/10 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-[22px] font-semibold text-black">
                          {row.country}
                        </h2>
                        <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
                          {scoreNarrative(row.avgGovernanceMaturityScore)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-black/10 px-4 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                          Avg maturity
                        </div>
                        <div className="mt-2 text-[20px] font-semibold text-black">
                          {formatScore(row.avgGovernanceMaturityScore)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-4">
                      <Info
                        label="Organizations"
                        value={String(row.organizationCount)}
                      />
                      <Info
                        label="Approved orgs"
                        value={String(row.approvedCount)}
                      />
                      <Info
                        label="Disclosed systems"
                        value={String(row.systemCount)}
                      />
                      <Info
                        label="Band mix"
                        value={`A:${row.tierACount}  B:${row.tierBCount}  C:${row.tierCCount}`}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <Info
                        label="High-risk systems"
                        value={String(row.highRiskSystemCount)}
                      />
                      <Info
                        label="Medium-risk systems"
                        value={String(row.mediumRiskSystemCount)}
                      />
                      <Info
                        label="Low-risk systems"
                        value={String(row.lowRiskSystemCount)}
                      />
                    </div>
                  </div>
                ))
              )}
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
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      Failed to load country explorer data.
      <div className="mt-2 break-words text-red-600">{message}</div>
    </div>
  );
}
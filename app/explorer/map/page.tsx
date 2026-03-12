import Link from "next/link";
import WorldGovernanceMap, {
  type MapCountryRow,
} from "@/components/explorer/WorldGovernanceMap";
import { sfQueryResult } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type CountryOrgRow = {
  COUNTRY: string | null;
  ORGANIZATION_COUNT: number | null;
};

type CountrySystemRow = {
  COUNTRY: string | null;
  SYSTEM_COUNT: number | null;
  HIGH_RISK_SYSTEM_COUNT: number | null;
  AVG_GOVERNANCE_MATURITY_SCORE: number | null;
};

function num(value: number | null | undefined) {
  return Number(value ?? 0);
}

export default async function ExplorerMapPage() {
  const [orgRes, systemRes] = await Promise.all([
    sfQueryResult<CountryOrgRow>(
      `
      SELECT
        COUNTRY,
        COUNT(*) AS ORGANIZATION_COUNT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE COUNTRY IS NOT NULL
      GROUP BY COUNTRY
      ORDER BY COUNTRY ASC
      `
    ),
    sfQueryResult<CountrySystemRow>(
      `
      SELECT
        r.COUNTRY,
        COUNT(*) AS SYSTEM_COUNT,
        SUM(IFF(UPPER(COALESCE(s.RISK_TIER, '')) = 'HIGH', 1, 0)) AS HIGH_RISK_SYSTEM_COUNT,
        AVG(s.GOVERNANCE_MATURITY_SCORE) AS AVG_GOVERNANCE_MATURITY_SCORE
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
      LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
        ON s.REGISTRY_ID = r.REGISTRY_ID
      WHERE r.COUNTRY IS NOT NULL
      GROUP BY r.COUNTRY
      ORDER BY r.COUNTRY ASC
      `
    ),
  ]);

  const orgRows = orgRes.ok ? orgRes.rows ?? [] : [];
  const systemRows = systemRes.ok ? systemRes.rows ?? [] : [];

  const byCountry = new Map<string, MapCountryRow>();

  for (const row of orgRows) {
    const country = String(row.COUNTRY ?? "").trim();
    if (!country) continue;

    byCountry.set(country, {
      country,
      organizationCount: num(row.ORGANIZATION_COUNT),
      systemCount: 0,
      highRiskSystemCount: 0,
      avgGovernanceMaturityScore: null,
    });
  }

  for (const row of systemRows) {
    const country = String(row.COUNTRY ?? "").trim();
    if (!country) continue;

    const existing = byCountry.get(country) ?? {
      country,
      organizationCount: 0,
      systemCount: 0,
      highRiskSystemCount: 0,
      avgGovernanceMaturityScore: null,
    };

    existing.systemCount = num(row.SYSTEM_COUNT);
    existing.highRiskSystemCount = num(row.HIGH_RISK_SYSTEM_COUNT);
    existing.avgGovernanceMaturityScore =
      row.AVG_GOVERNANCE_MATURITY_SCORE === null ||
      row.AVG_GOVERNANCE_MATURITY_SCORE === undefined
        ? null
        : Number(row.AVG_GOVERNANCE_MATURITY_SCORE);

    byCountry.set(country, existing);
  }

  const rows = Array.from(byCountry.values()).sort((a, b) =>
    a.country.localeCompare(b.country)
  );

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8">
          <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Global governance explorer
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Explorer — Map
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            Interactive global map showing where GAFAIG-certified organizations
            and public AI system disclosures are represented.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/explorer"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Back to explorer
            </Link>
            <Link
              href="/explorer/countries"
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
            >
              View countries
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
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load map data.
            <div className="mt-2 break-words text-red-600">{orgRes.error}</div>
          </div>
        ) : !systemRes.ok ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load map data.
            <div className="mt-2 break-words text-red-600">
              {systemRes.error}
            </div>
          </div>
        ) : (
          <WorldGovernanceMap rows={rows} />
        )}
      </div>
    </main>
  );
}
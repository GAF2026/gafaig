import Link from "next/link";
import WorldGovernanceMap, {
  type MapCountryRow,
} from "@/components/explorer/WorldGovernanceMap";
import { sfQueryResult } from "@/lib/snowflake";
import PublicPageHero from "../../_components/PublicPageHero";

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
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="EXPLORER"
        title="Explorer — Map"
        description="Interactive global map showing where GAFAIG-certified organizations and public AI system disclosures are represented."
        actions={
          <>
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
              href="/explorer/systems"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              View systems
            </Link>
          </>
        }
      />

      {!orgRes.ok ? (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Failed to load map data.
          <div className="mt-2 break-words text-red-600">{orgRes.error}</div>
        </div>
      ) : !systemRes.ok ? (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Failed to load map data.
          <div className="mt-2 break-words text-red-600">
            {systemRes.error}
          </div>
        </div>
      ) : (
        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            GLOBAL MAP
          </div>

          <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Geographic view of public governance coverage
          </h2>

          <div className="mt-8">
            <WorldGovernanceMap rows={rows} />
          </div>
        </section>
      )}
    </main>
  );
}
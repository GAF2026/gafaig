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
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function formatScore(value: number | null | undefined) {
  if (!value) return "—";
  return `${Math.round(Number(value))} / 100`;
}

function tierBandLabel(tier: any, level: any, band: any) {
  return `${level || tier || "—"} ${band ? `· Band ${band}` : ""}`;
}

export default async function ExplorerCountryDetailPage({ params }: any) {
  const country = decodeURIComponent(params.country);

  const [orgRows, systemRows] = await Promise.all([
    sfQuery<CountryOrgRow>(
      `
      SELECT *
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE UPPER(TRIM(COUNTRY)) = UPPER(TRIM(?))
      ORDER BY ENTITY_NAME
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
        r.CERTIFIED_BAND
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
      LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
        ON s.REGISTRY_ID = r.REGISTRY_ID
      WHERE UPPER(TRIM(r.COUNTRY)) = UPPER(TRIM(?))
      ORDER BY s.SYSTEM_NAME
      `,
      [country]
    ),
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">

      <h1 className="text-3xl font-semibold">
        Explorer — {country}
      </h1>

      <section className="mt-6 grid grid-cols-3 gap-4">
        <Metric label="Organizations" value={String(orgRows.length)} />
        <Metric label="Systems" value={String(systemRows.length)} />
        <Metric label="Certified" value={String(orgRows.filter(o => o.CERTIFICATION_STATUS === "Certified").length)} />
      </section>

      {/* ORGANIZATIONS */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Organizations</h2>

        <div className="mt-4 grid gap-4">
          {orgRows.map((row) => (
            <div key={row.REGISTRY_ID} className="card">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{row.ENTITY_NAME}</div>
                  <div className="text-sm">{row.ENTITY_TYPE}</div>
                </div>

                <Link href={`/registry/${row.REGISTRY_ID}`} className="btn-outline">
                  View
                </Link>
              </div>

              <div className="mt-3 grid grid-cols-5 gap-2 text-sm">
                <Info label="Tier" value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_TIER_LEVEL, row.CERTIFIED_BAND)} />
                <Info label="Score" value={formatScore(row.CERTIFIED_SCORE)} />
                <Info label="Status" value={row.CERTIFICATION_STATUS || "—"} />
                <Info label="Certified" value={formatDate(row.CERTIFIED_AT)} />
                <Info label="Valid to" value={formatDate(row.VALID_TO)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SYSTEMS */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Systems</h2>

        <div className="mt-4 grid gap-4">
          {systemRows.map((row) => (
            <div key={row.SYSTEM_ID} className="card">
              <div className="font-semibold">
                {row.SYSTEM_NAME || row.SYSTEM_ID}
              </div>

              <div className="text-sm">
                {row.ENTITY_NAME} · {row.SYSTEM_TYPE}
              </div>

              <div className="mt-3 grid grid-cols-5 gap-2 text-sm">
                <Info label="Risk" value={row.RISK_TIER || "—"} />
                <Info label="Oversight" value={row.OVERSIGHT_LEVEL || "—"} />
                <Info label="Deployment" value={row.DEPLOYMENT_STATUS || "—"} />
                <Info label="Tier" value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_TIER_LEVEL, row.CERTIFIED_BAND)} />
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

function Metric({ label, value }: any) {
  return (
    <div className="card">
      <div className="text-xs">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <div className="text-xs text-black/50">{label}</div>
      <div>{value}</div>
    </div>
  );
}
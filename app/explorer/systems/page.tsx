import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";
import PublicPageHero from "../../_components/PublicPageHero";

export const dynamic = "force-dynamic";

type SystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string | null;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  GOVERNANCE_MATURITY_SCORE: number | null;
};

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

function joinTierBand(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} / ${band}`;
  return tier ?? band ?? "—";
}

export default async function ExplorerSystemsPage() {
  const res = await sfQueryResult<SystemRow>(
    `
    SELECT
      s.SYSTEM_ID,
      s.REGISTRY_ID,
      s.SYSTEM_NAME,
      s.SYSTEM_TYPE,
      s.DEPLOYMENT_STATUS,
      s.OVERSIGHT_LEVEL,
      s.RISK_TIER,
      r.CERTIFIED_TIER,
      r.CERTIFIED_BAND,
      CASE
        WHEN r.CERTIFIED_BAND = 'A' THEN 95
        WHEN r.CERTIFIED_BAND = 'B' THEN 85
        WHEN r.CERTIFIED_BAND = 'C' THEN 75
        ELSE NULL
      END AS GOVERNANCE_MATURITY_SCORE
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
    LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
      ON s.REGISTRY_ID = r.REGISTRY_ID
    ORDER BY s.SYSTEM_NAME ASC
    `
  );

  const rows = res.ok ? res.rows ?? [] : [];

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="EXPLORER"
        title="Explorer — Systems"
        description="Public explorer for AI systems included in the GAFAIG registry, including risk tier, oversight level, certification classification, and governance maturity where available."
        actions={
          <>
            <Link
              href="/explorer"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Back to explorer
            </Link>
            <Link
              href="/registry/ai-systems"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open systems directory
            </Link>
            <Link
              href="/explorer/countries"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              View countries
            </Link>
          </>
        }
      />

      {!res.ok ? (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Failed to load systems.
          <div className="mt-2 break-words text-red-600">{res.error}</div>
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/70">
          No public AI systems found.
        </div>
      ) : (
        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            AI SYSTEMS
          </div>

          <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public AI systems included in the registry
          </h2>

          <div className="mt-8 grid gap-4">
            {rows.map((row) => (
              <div
                key={row.SYSTEM_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[20px] font-semibold text-black">
                      <Link
                        href={`/ai-systems/${encodeURIComponent(row.SYSTEM_ID)}`}
                        className="hover:underline"
                      >
                        {row.SYSTEM_NAME ?? "Unnamed AI system"}
                      </Link>
                    </h2>
                    <div className="mt-2 text-[14px] text-black/65">
                      {row.SYSTEM_ID}
                    </div>
                  </div>

                  {row.REGISTRY_ID ? (
                    <Link
                      href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                      className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                    >
                      View certification
                    </Link>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-6">
                  <Info label="System type" value={row.SYSTEM_TYPE} />
                  <Info label="Deployment" value={row.DEPLOYMENT_STATUS} />
                  <Info label="Oversight" value={row.OVERSIGHT_LEVEL} />
                  <Info label="Risk tier" value={row.RISK_TIER} />
                  <Info
                    label="Tier / band"
                    value={joinTierBand(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
                  />
                  <Info
                    label="Maturity"
                    value={formatScore(row.GOVERNANCE_MATURITY_SCORE)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85">{value ?? "—"}</div>
    </div>
  );
}
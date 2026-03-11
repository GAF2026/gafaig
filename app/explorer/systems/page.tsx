import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";

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

export default async function ExplorerSystemsPage() {
  const res = await sfQueryResult<SystemRow>(
    `
    SELECT
      SYSTEM_ID,
      REGISTRY_ID,
      SYSTEM_NAME,
      SYSTEM_TYPE,
      DEPLOYMENT_STATUS,
      OVERSIGHT_LEVEL,
      RISK_TIER,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      GOVERNANCE_MATURITY_SCORE
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY SYSTEM_NAME ASC
    `
  );

  const rows = res.ok ? res.rows ?? [] : [];

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8">
          <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Global governance explorer
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Explorer — Systems
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            Public explorer for AI systems included in the GAFAIG registry,
            including risk tier, oversight level, certification classification,
            and governance maturity where available.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/explorer"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Back to explorer
            </Link>
            <Link
              href="/registry/ai-systems"
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
            >
              Open systems directory
            </Link>
          </div>
        </section>

        {!res.ok ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load systems.
            <div className="mt-2 break-words text-red-600">{res.error}</div>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public AI systems found.
          </div>
        ) : (
          <div className="grid gap-4">
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
                  <Info label="Tier / band" value={joinTierBand(row.CERTIFIED_TIER, row.CERTIFIED_BAND)} />
                  <Info label="Maturity" value={formatScore(row.GOVERNANCE_MATURITY_SCORE)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function joinTierBand(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} / ${band}`;
  return tier ?? band ?? "—";
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
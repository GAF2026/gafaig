import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";
import CopyButton from "@/app/components/CopyButton";

export const dynamic = "force-dynamic";

type SystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  SYSTEM_NAME: string;
  SYSTEM_TYPE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFICATION_STATUS: string | null;
  DISPLAY_ORDER: number | null;
};

export default async function ExplorerSystemsPage() {
  const rows = await sfQuery<SystemRow>(`
    SELECT
      SYSTEM_ID,
      REGISTRY_ID,
      ENTITY_NAME,
      SYSTEM_NAME,
      SYSTEM_TYPE,
      DEPLOYMENT_STATUS,
      OVERSIGHT_LEVEL,
      RISK_TIER,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFICATION_STATUS,
      DISPLAY_ORDER
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY DISPLAY_ORDER ASC, SYSTEM_NAME ASC
  `);

  const total = rows.length;
  const highRisk = rows.filter((r) => r.RISK_TIER === "High").length;
  const mediumRisk = rows.filter((r) => r.RISK_TIER === "Medium").length;
  const lowRisk = rows.filter((r) => r.RISK_TIER === "Low").length;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      {/* HEADER */}
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Explorer — Systems
        </h1>

        <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
          Public AI system-level explorer for disclosed systems associated with GAFAIG registry records.
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
            View countries
          </Link>

          <Link
            href="/explorer/organizations"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            View organizations
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <Stat label="Systems" value={String(total)} />
        <Stat label="High Risk" value={String(highRisk)} />
        <Stat label="Medium Risk" value={String(mediumRisk)} />
        <Stat label="Low Risk" value={String(lowRisk)} />
      </section>

      {/* SYSTEM LIST */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          SYSTEM DIRECTORY
        </div>

        <h2 className="mt-4 text-[32px] font-semibold tracking-tight text-black">
          Public AI systems
        </h2>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-xl border border-black/10 px-4 py-6 text-sm text-black/60">
            No public AI systems have been published yet.
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {rows.map((row) => (
              <div
                key={row.SYSTEM_ID}
                className="rounded-2xl border border-black/10 p-6"
              >
                {/* HEADER */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-[20px] font-semibold text-black">
                      {row.SYSTEM_NAME}
                    </div>

                    <div className="mt-1 text-sm text-black/60">
                      {row.ENTITY_NAME || "Unknown organization"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/registry/ai-systems/${row.SYSTEM_ID}`}
                      className="rounded-full border border-black bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-black/90"
                    >
                      View system
                    </Link>

                    <Link
                      href={`/registry/${row.REGISTRY_ID}`}
                      className="rounded-full border border-black px-4 py-2 text-xs font-semibold transition hover:bg-black/[0.04]"
                    >
                      View registry
                    </Link>
                  </div>
                </div>

                {/* META GRID */}
                <div className="mt-5 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
                  <Info label="System Type" value={row.SYSTEM_TYPE} />
                  <Info label="Deployment" value={row.DEPLOYMENT_STATUS} />
                  <Info label="Oversight" value={row.OVERSIGHT_LEVEL} />
                  <Info label="Risk Tier" value={row.RISK_TIER} />
                  <Info label="Certification" value={row.CERTIFICATION_STATUS} />

                  <div className="rounded-lg border border-black/5 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-black/50">
                      Tier / Band
                    </div>
                    <div className="mt-1 text-[13px] text-black/85">
                      {row.CERTIFIED_TIER
                        ? `${row.CERTIFIED_TIER} · ${row.CERTIFIED_BAND}`
                        : "—"}
                    </div>
                  </div>

                  {/* REGISTRY ID (FIXED + COPYABLE) */}
                  <div className="rounded-lg border border-black/5 px-3 py-2 col-span-full md:col-span-3 lg:col-span-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-black/50">
                      Registry ID
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="font-mono text-[11px] text-black/80 break-all">
                        {row.REGISTRY_ID}
                      </div>

                      <CopyButton value={row.REGISTRY_ID} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[22px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-lg border border-black/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.18em] text-black/50">
        {label}
      </div>
      <div className="mt-1 text-[13px] text-black/85">
        {value || "—"}
      </div>
    </div>
  );
}
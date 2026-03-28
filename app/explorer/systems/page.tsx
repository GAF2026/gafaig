import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type SystemRow = {
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
  CERTIFIED_SCORE: number | null;
};

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

export default async function ExplorerSystemsPage() {
  const rows = await sfQuery<SystemRow>(
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
      r.CERTIFIED_SCORE
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
    LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
      ON s.REGISTRY_ID = r.REGISTRY_ID
    ORDER BY s.SYSTEM_NAME ASC
    `
  );

  const highRiskCount = rows.filter(
    (row) => String(row.RISK_TIER ?? "").trim().toUpperCase() === "HIGH"
  ).length;

  const mediumRiskCount = rows.filter(
    (row) => String(row.RISK_TIER ?? "").trim().toUpperCase() === "MEDIUM"
  ).length;

  const lowRiskCount = rows.filter(
    (row) => String(row.RISK_TIER ?? "").trim().toUpperCase() === "LOW"
  ).length;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Explorer — Systems
        </h1>

        <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
          Public AI system-level explorer for disclosed systems associated with
          GAFAIG registry records.
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

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Systems" value={String(rows.length)} />
        <MetricCard label="High risk" value={String(highRiskCount)} />
        <MetricCard label="Medium risk" value={String(mediumRiskCount)} />
        <MetricCard label="Low risk" value={String(lowRiskCount)} />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <MetricCard
          label="Linked registry records"
          value={String(rows.filter((row) => !!row.REGISTRY_ID).length)}
        />
        <MetricCard
          label="With organization"
          value={String(rows.filter((row) => !!row.ENTITY_NAME).length)}
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          SYSTEM DIRECTORY
        </div>

        <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Public AI systems
        </h2>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public system data available.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {rows.map((row) => (
              <div
                key={row.SYSTEM_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[20px] font-semibold text-black">
                      {row.SYSTEM_NAME || row.SYSTEM_ID}
                    </h3>
                    <div className="mt-2 text-[14px] text-black/65">
                      {row.ENTITY_NAME || "Unknown organization"}
                    </div>
                  </div>

                  {row.REGISTRY_ID ? (
                    <Link
                      href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                      className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                    >
                      View registry record
                    </Link>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-7">
                  <Info label="System type" value={row.SYSTEM_TYPE || "—"} />
                  <Info
                    label="Deployment"
                    value={row.DEPLOYMENT_STATUS || "—"}
                  />
                  <Info
                    label="Oversight"
                    value={row.OVERSIGHT_LEVEL || "—"}
                  />
                  <Info label="Risk tier" value={row.RISK_TIER || "—"} />
                  <Info
                    label="Certified score"
                    value={formatScore(row.CERTIFIED_SCORE)}
                  />
                  <Info
                    label="Tier"
                    value={row.CERTIFIED_TIER || "—"}
                  />
                  <Info
                    label="Band"
                    value={row.CERTIFIED_BAND || "—"}
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
import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  CERTIFICATION_STATUS: string | null;
  DISPLAY_ORDER?: number | null;
};

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function riskBadgeClass(riskTier: string | null) {
  const value = String(riskTier ?? "").trim().toUpperCase();

  if (value === "HIGH") {
    return "border-black/15 bg-black text-white";
  }
  if (value === "MEDIUM") {
    return "border-black/15 bg-black/10 text-black";
  }
  return "border-black/10 bg-white text-black/75";
}

export default async function ExplorerSystemsPage() {
  const rows = await sfQuery<SystemRow>(
    `
    SELECT
      s.SYSTEM_ID,
      s.REGISTRY_ID,
      s.ENTITY_NAME,
      s.SYSTEM_NAME,
      s.SYSTEM_TYPE,
      s.DEPLOYMENT_STATUS,
      s.OVERSIGHT_LEVEL,
      s.RISK_TIER,
      s.CERTIFIED_TIER,
      s.CERTIFIED_BAND,
      s.CERTIFICATION_STATUS,
      s.DISPLAY_ORDER
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
    ORDER BY
      COALESCE(s.ENTITY_NAME, '') ASC,
      COALESCE(s.DISPLAY_ORDER, 999999) ASC,
      s.SYSTEM_NAME ASC
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
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Explorer — Systems
        </h1>

        <p className="mt-5 max-w-[840px] text-[17px] leading-[1.7] text-black/72">
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
          <Link
            href="/registry/ai-systems"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            AI systems registry
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Systems" value={String(rows.length)} />
        <MetricCard label="High risk" value={String(highRiskCount)} />
        <MetricCard label="Medium risk" value={String(mediumRiskCount)} />
        <MetricCard label="Low risk" value={String(lowRiskCount)} />
      </section>

      {rows.length === 0 ? (
        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            SYSTEM DIRECTORY
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public AI systems
          </h2>

          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public AI systems have been published yet.
          </div>
        </section>
      ) : (
        <>
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

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                  Public AI systems
                </h2>
                <p className="mt-3 max-w-[760px] text-[15px] leading-[1.7] text-black/68">
                  Publicly disclosed systems connected to canonical registry
                  records and displayed through the GAFAIG public contract.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/70">
                {rows.length} disclosed system{rows.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              {rows.map((row) => (
                <article
                  key={row.SYSTEM_ID}
                  className="group relative rounded-[28px] border border-black/10 bg-white p-6 shadow-sm transition hover:border-black/20 hover:bg-black/[0.015]"
                >
                  <Link
                    href={`/registry/ai-systems/${encodeURIComponent(row.SYSTEM_ID)}`}
                    className="absolute inset-0 rounded-[28px]"
                    aria-label={`View details for ${row.SYSTEM_NAME || row.SYSTEM_ID}`}
                  />

                  <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] ${riskBadgeClass(
                            row.RISK_TIER
                          )}`}
                        >
                          {row.RISK_TIER || "Unknown risk"}
                        </span>

                        <span className="inline-flex rounded-full border border-black/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/70">
                          {row.CERTIFICATION_STATUS || "—"}
                        </span>
                      </div>

                      <h3 className="mt-4 text-[24px] font-semibold leading-tight text-black transition group-hover:underline md:text-[30px]">
                        {row.SYSTEM_NAME || row.SYSTEM_ID}
                      </h3>

                      <div className="mt-2 text-[16px] text-black/62">
                        {row.ENTITY_NAME || "Unknown organization"}
                      </div>
                    </div>

                    <div className="relative z-20 flex flex-wrap gap-3 xl:justify-end">
                      <Link
                        href={`/registry/ai-systems/${encodeURIComponent(
                          row.SYSTEM_ID
                        )}`}
                        className="inline-flex items-center rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
                      >
                        View system detail
                      </Link>

                      {row.REGISTRY_ID ? (
                        <Link
                          href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                          className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
                        >
                          View registry record
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7">
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
                      label="Certification"
                      value={row.CERTIFICATION_STATUS || "—"}
                    />
                    <Info
                      label="Tier / Band"
                      value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
                    />
                    <Info
                      label="Registry ID"
                      value={row.REGISTRY_ID || "—"}
                      mono
                      breakAll
                    />
                  </div>
                </article>
              ))}
            </div>
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

function Info({
  label,
  value,
  mono = false,
  breakAll = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  breakAll?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/6 bg-black/[0.015] px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={[
          "mt-3 text-[15px] leading-[1.55] text-black/88",
          mono ? "font-mono text-[14px]" : "",
          breakAll ? "break-all" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}
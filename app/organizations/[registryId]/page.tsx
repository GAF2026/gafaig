import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type OrganizationRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFICATION_STATUS: string | null;
  DECISION_STATUS: string | null;
  CERTIFIED_AT: string | null;
  VALID_TO: string | null;
};

type OrganizationSystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string | null;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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

export default async function OrganizationDetailPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = decodeURIComponent(String(params.registryId || "")).trim();

  if (!registryId) {
    notFound();
  }

  const orgRows = await sfQuery<OrganizationRow>(
    `
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFIED_SCORE,
      CERTIFICATION_STATUS,
      DECISION_STATUS,
      CERTIFIED_AT,
      VALID_TO
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    WHERE REGISTRY_ID = ?
    LIMIT 1
    `,
    [registryId]
  );

  const row = orgRows[0] ?? null;

  if (!row) {
    notFound();
  }

  const systemRows = await sfQuery<OrganizationSystemRow>(
    `
    SELECT
      SYSTEM_ID,
      REGISTRY_ID,
      SYSTEM_NAME,
      SYSTEM_TYPE,
      DEPLOYMENT_STATUS,
      OVERSIGHT_LEVEL,
      RISK_TIER,
      CERTIFIED_SCORE,
      CERTIFIED_TIER,
      CERTIFIED_BAND
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE REGISTRY_ID = ?
    ORDER BY SYSTEM_NAME ASC
    `,
    [registryId]
  );

  const highRiskCount = systemRows.filter(
    (system) => String(system.RISK_TIER ?? "").trim().toUpperCase() === "HIGH"
  ).length;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          ORGANIZATION
        </div>

        <h1 className="mt-4 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          {row.ENTITY_NAME}
        </h1>

        <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
          Public organization record and associated AI systems linked to this
          GAFAIG registry certification.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explorer/organizations"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to organizations
          </Link>
          <Link
            href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            View registry record
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Country" value={row.COUNTRY || "—"} />
        <MetricCard label="Entity type" value={row.ENTITY_TYPE || "—"} />
        <MetricCard
          label="Tier / Band"
          value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
        />
        <MetricCard
          label="Certified score"
          value={formatScore(row.CERTIFIED_SCORE)}
        />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Certification"
          value={row.CERTIFICATION_STATUS || "—"}
        />
        <MetricCard label="Decision" value={row.DECISION_STATUS || "—"} />
        <MetricCard
          label="Certified at"
          value={formatDate(row.CERTIFIED_AT)}
        />
        <MetricCard label="Valid to" value={formatDate(row.VALID_TO)} />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              AI SYSTEMS
            </div>
            <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Systems associated with this organization
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Systems" value={String(systemRows.length)} />
            <MetricCard label="High risk" value={String(highRiskCount)} />
          </div>
        </div>

        {systemRows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public AI systems are linked to this organization.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {systemRows.map((system) => (
              <div
                key={system.SYSTEM_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="text-[20px] font-semibold text-black">
                  {system.SYSTEM_NAME || system.SYSTEM_ID}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-8">
                  <Info label="System ID" value={system.SYSTEM_ID} />
                  <Info label="Type" value={system.SYSTEM_TYPE || "—"} />
                  <Info
                    label="Deployment"
                    value={system.DEPLOYMENT_STATUS || "—"}
                  />
                  <Info
                    label="Oversight"
                    value={system.OVERSIGHT_LEVEL || "—"}
                  />
                  <Info label="Risk tier" value={system.RISK_TIER || "—"} />
                  <Info
                    label="Certified score"
                    value={formatScore(system.CERTIFIED_SCORE)}
                  />
                  <Info
                    label="Tier"
                    value={system.CERTIFIED_TIER || "—"}
                  />
                  <Info
                    label="Band"
                    value={system.CERTIFIED_BAND || "—"}
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
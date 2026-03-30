import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SystemDetailRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string | null;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  INTENDED_USE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  DEVELOPER_ORGANIZATION: string | null;
  TRAINING_DATA_CATEGORY: string | null;
  OVERSIGHT_MODEL: string | null;
  HUMAN_REVIEW_REQUIRED: boolean | null;
  EVALUATION_PROTOCOL: string | null;
  AUDIT_FREQUENCY: string | null;
  PUBLIC_SUMMARY: string | null;
  ENTITY_NAME: string | null;
  ORG_ID: string | null;
  VERIFICATION_TYPE: string | null;
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFIED_AT: string | null;
  DECISION_STATUS: string | null;
  RENEWAL_STATUS: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  LIFECYCLE_STATUS: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function yesNo(value: boolean | null | undefined) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "—";
}

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

export default async function RegistryAiSystemDetailPage({
  params,
}: {
  params: { systemId: string };
}) {
  const systemId = decodeURIComponent(params.systemId);

  const rows = await sfQuery<SystemDetailRow>(
    `
    SELECT
      SYSTEM_ID,
      REGISTRY_ID,
      APPLICATION_ID,
      CASE_ID,
      SYSTEM_NAME,
      SYSTEM_TYPE,
      INTENDED_USE,
      DEPLOYMENT_STATUS,
      OVERSIGHT_LEVEL,
      RISK_TIER,
      DEVELOPER_ORGANIZATION,
      TRAINING_DATA_CATEGORY,
      OVERSIGHT_MODEL,
      HUMAN_REVIEW_REQUIRED,
      EVALUATION_PROTOCOL,
      AUDIT_FREQUENCY,
      PUBLIC_SUMMARY,
      ENTITY_NAME,
      ORG_ID,
      VERIFICATION_TYPE,
      CERTIFICATION_STATUS,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFIED_AT,
      DECISION_STATUS,
      RENEWAL_STATUS,
      VALID_FROM,
      VALID_TO,
      LIFECYCLE_STATUS
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE UPPER(TRIM(SYSTEM_ID)) = UPPER(TRIM(?))
    LIMIT 1
    `,
    [systemId]
  );

  const row = rows[0];

  if (!row) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          AI SYSTEM RECORD
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
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

          <span className="inline-flex rounded-full border border-black/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/70">
            {row.LIFECYCLE_STATUS || "—"}
          </span>
        </div>

        <h1 className="mt-5 max-w-[880px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          {row.SYSTEM_NAME || row.SYSTEM_ID}
        </h1>

        <p className="mt-4 max-w-[860px] text-[17px] leading-[1.7] text-black/72">
          {row.PUBLIC_SUMMARY ||
            "Publicly disclosed AI system associated with a GAFAIG registry record."}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explorer/systems"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to systems
          </Link>

          {row.REGISTRY_ID ? (
            <Link
              href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              View registry record
            </Link>
          ) : null}

          <Link
            href="/registry/ai-systems"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            AI systems registry
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="System ID" value={row.SYSTEM_ID} mono />
        <MetricCard label="System type" value={row.SYSTEM_TYPE || "—"} />
        <MetricCard label="Deployment" value={row.DEPLOYMENT_STATUS || "—"} />
        <MetricCard label="Tier / Band" value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)} />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            SYSTEM PROFILE
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black">
            Public system details
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Info label="Organization" value={row.ENTITY_NAME || "—"} />
            <Info label="Developer organization" value={row.DEVELOPER_ORGANIZATION || "—"} />
            <Info label="Verification type" value={row.VERIFICATION_TYPE || "—"} />
            <Info label="Risk tier" value={row.RISK_TIER || "—"} />
            <Info label="Oversight level" value={row.OVERSIGHT_LEVEL || "—"} />
            <Info label="Oversight model" value={row.OVERSIGHT_MODEL || "—"} />
            <Info label="Human review required" value={yesNo(row.HUMAN_REVIEW_REQUIRED)} />
            <Info label="Evaluation protocol" value={row.EVALUATION_PROTOCOL || "—"} />
            <Info label="Audit frequency" value={row.AUDIT_FREQUENCY || "—"} />
            <Info label="Training data category" value={row.TRAINING_DATA_CATEGORY || "—"} />
            <Info label="Intended use" value={row.INTENDED_USE || "—"} full />
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            REGISTRY CONNECTION
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black">
            Linked registry metadata
          </h2>

          <div className="mt-8 grid gap-3">
            <Info label="Registry ID" value={row.REGISTRY_ID || "—"} mono breakAll />
            <Info label="Application ID" value={row.APPLICATION_ID || "—"} mono breakAll />
            <Info label="Case ID" value={row.CASE_ID || "—"} mono />
            <Info label="Organization ID" value={row.ORG_ID || "—"} mono breakAll />
            <Info label="Certification status" value={row.CERTIFICATION_STATUS || "—"} />
            <Info label="Decision status" value={row.DECISION_STATUS || "—"} />
            <Info label="Tier / Band" value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)} />
            <Info label="Certified at" value={formatDate(row.CERTIFIED_AT)} />
            <Info label="Valid from" value={formatDate(row.VALID_FROM)} />
            <Info label="Valid to" value={formatDate(row.VALID_TO)} />
            <Info label="Lifecycle status" value={row.LIFECYCLE_STATUS || "—"} />
            <Info label="Renewal status" value={row.RENEWAL_STATUS || "—"} />
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </div>
      <div
        className={[
          "mt-2 text-[22px] font-semibold text-black",
          mono ? "break-all font-mono text-[18px]" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  mono = false,
  breakAll = false,
  full = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  breakAll?: boolean;
  full?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-black/6 bg-black/[0.015] px-4 py-4",
        full ? "sm:col-span-2" : "",
      ].join(" ")}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={[
          "mt-3 text-[15px] leading-[1.6] text-black/88",
          mono ? "font-mono text-[14px]" : "",
          breakAll ? "break-all" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}
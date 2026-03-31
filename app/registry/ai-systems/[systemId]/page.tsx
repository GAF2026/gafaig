import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    systemId: string;
  };
};

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
  IS_PUBLIC: boolean | null;
  DISPLAY_ORDER: number | null;
  CREATED_AT: string | null;
  UPDATED_AT: string | null;
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

function fmtDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function clean(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "—";
}

function boolLabel(value: boolean | null | undefined) {
  if (value === true) return "Required";
  if (value === false) return "Not required";
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
  if (value === "LOW") {
    return "border-black/10 bg-white text-black/80";
  }
  return "border-black/10 bg-white text-black/65";
}

function statusBadgeClass(status: string | null) {
  const value = String(status ?? "").trim().toUpperCase();

  if (value === "CERTIFIED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (value === "PUBLISHED") {
    return "border-sky-200 bg-sky-50 text-sky-800";
  }
  return "border-black/10 bg-white text-black/70";
}

export default async function RegistryAiSystemDetailPage({ params }: PageProps) {
  const systemId = decodeURIComponent(params.systemId || "").trim();

  if (!systemId) {
    notFound();
  }

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
      IS_PUBLIC,
      DISPLAY_ORDER,
      CREATED_AT,
      UPDATED_AT,
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

  const pageTitle = row.SYSTEM_NAME || row.SYSTEM_ID;
  const organizationName =
    row.ENTITY_NAME || row.DEVELOPER_ORGANIZATION || "Unknown organization";

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          AI SYSTEM RECORD
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] ${riskBadgeClass(
              row.RISK_TIER
            )}`}
          >
            {row.RISK_TIER || "Unknown risk"}
          </span>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] ${statusBadgeClass(
              row.CERTIFICATION_STATUS
            )}`}
          >
            {row.CERTIFICATION_STATUS || "—"}
          </span>

          {row.DECISION_STATUS ? (
            <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/70">
              {row.DECISION_STATUS}
            </span>
          ) : null}

          {row.CERTIFIED_TIER || row.CERTIFIED_BAND ? (
            <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/70">
              {tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 max-w-[920px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          {pageTitle}
        </h1>

        <p className="mt-4 max-w-[860px] text-[17px] leading-[1.7] text-black/72">
          Public disclosure record for an AI system associated with a GAFAIG certification record. This page shows the public system profile, certification context, and the registry linkage that supports external trust.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explorer/systems"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to systems explorer
          </Link>

          <Link
            href="/registry/ai-systems"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            AI systems registry
          </Link>

          {row.REGISTRY_ID ? (
            <Link
              href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              View linked registry record
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Certification" value={clean(row.CERTIFICATION_STATUS)} />
        <MetricCard
          label="Tier / Band"
          value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
        />
        <MetricCard label="Lifecycle" value={clean(row.LIFECYCLE_STATUS)} />
        <MetricCard label="Valid to" value={fmtDate(row.VALID_TO)} />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            SYSTEM PROFILE
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public disclosure summary
          </h2>

          <div className="mt-6 rounded-2xl border border-black/8 bg-black/[0.015] p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-black/55">
              Summary
            </div>
            <p className="mt-3 text-[16px] leading-[1.75] text-black/80">
              {row.PUBLIC_SUMMARY ||
                row.INTENDED_USE ||
                "No public summary has been provided for this system record."}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard label="System name" value={pageTitle} />
            <InfoCard label="Organization" value={organizationName} />
            <InfoCard label="System type" value={clean(row.SYSTEM_TYPE)} />
            <InfoCard label="Deployment" value={clean(row.DEPLOYMENT_STATUS)} />
            <InfoCard label="Risk tier" value={clean(row.RISK_TIER)} />
            <InfoCard label="Oversight level" value={clean(row.OVERSIGHT_LEVEL)} />
            <InfoCard label="Oversight model" value={clean(row.OVERSIGHT_MODEL)} />
            <InfoCard label="Human review" value={boolLabel(row.HUMAN_REVIEW_REQUIRED)} />
            <InfoCard label="Audit frequency" value={clean(row.AUDIT_FREQUENCY)} />
            <InfoCard label="Evaluation protocol" value={clean(row.EVALUATION_PROTOCOL)} />
            <InfoCard label="Training data" value={clean(row.TRAINING_DATA_CATEGORY)} />
            <InfoCard label="Developer organization" value={clean(row.DEVELOPER_ORGANIZATION)} />
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              CERTIFICATION CONTEXT
            </div>

            <div className="mt-6 grid gap-3">
              <InfoCard label="Certification status" value={clean(row.CERTIFICATION_STATUS)} />
              <InfoCard label="Decision status" value={clean(row.DECISION_STATUS)} />
              <InfoCard
                label="Tier / Band"
                value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
              />
              <InfoCard label="Issued" value={fmtDate(row.CERTIFIED_AT)} />
              <InfoCard label="Valid from" value={fmtDate(row.VALID_FROM)} />
              <InfoCard label="Valid to" value={fmtDate(row.VALID_TO)} />
              <InfoCard label="Renewal status" value={clean(row.RENEWAL_STATUS)} />
              <InfoCard label="Verification type" value={clean(row.VERIFICATION_TYPE)} />
            </div>
          </section>

          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              REGISTRY LINKAGE
            </div>

            <p className="mt-4 text-[15px] leading-[1.8] text-black/70">
              This system record is linked to a public GAFAIG certification record. That registry record is the canonical public trust surface for certification status, validity window, and verification endpoints.
            </p>

            <div className="mt-6 grid gap-3">
              <MonoCard label="System ID" value={row.SYSTEM_ID} />
              <MonoCard label="Registry ID" value={row.REGISTRY_ID || "—"} />
              <MonoCard label="Application ID" value={row.APPLICATION_ID || "—"} />
              <MonoCard label="Case ID" value={row.CASE_ID || "—"} />
              <MonoCard label="Organization ID" value={row.ORG_ID || "—"} />
            </div>
          </section>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WHY THIS PAGE EXISTS
        </div>

        <h2 className="mt-4 text-[28px] font-semibold leading-[1.18] tracking-tight text-black md:text-[34px]">
          Public system context without exposing private review
        </h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <NarrativeCard
            title="Public transparency"
            body="This page discloses public-facing system metadata associated with a GAFAIG certification. It helps external parties understand what system is covered and how it sits within the public trust surface."
          />
          <NarrativeCard
            title="Private verification remains private"
            body="GAFAIG’s verification engine operates privately through intake, evidence review, findings, scoring, and certification workflow. Those internal materials are not exposed here."
          />
          <NarrativeCard
            title="Registry-linked trust"
            body="Each public system record is connected to a registry certification record so visitors can evaluate the system in the context of an issued certification and its validity window."
          />
        </div>
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
      <div className="mt-2 text-[24px] font-semibold leading-tight text-black">
        {value}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/6 bg-black/[0.015] px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[15px] leading-[1.6] text-black/88">
        {value}
      </div>
    </div>
  );
}

function MonoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/6 bg-black/[0.015] px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 break-all font-mono text-[13px] leading-tight text-black/85">
        {value}
      </div>
    </div>
  );
}

function NarrativeCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-5">
      <div className="text-[18px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[15px] leading-[1.75] text-black/72">{body}</p>
    </div>
  );
}
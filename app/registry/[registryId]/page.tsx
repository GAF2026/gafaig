import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type RegistryRecord = {
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

type PublicSystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string;
  CASE_ID: string | null;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  DEVELOPER_ORGANIZATION: string | null;
  PUBLIC_SUMMARY: string | null;
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

function certificationStatus(record: RegistryRecord) {
  return record.CERTIFIED_AT ? "Certified" : "Not Certified";
}

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function baseOrigin() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  ).replace(/\/$/, "");
}

export default async function RegistryDetailPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = decodeURIComponent(params.registryId || "").trim();

  if (!registryId) {
    notFound();
  }

  const [records, systems] = await Promise.all([
    sfQuery<RegistryRecord>(
      `
      SELECT
        REGISTRY_ID,
        APPLICATION_ID,
        CASE_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        DECISION_STATUS,
        VALID_FROM,
        VALID_TO,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE REGISTRY_ID = ?
      LIMIT 1
      `,
      [registryId]
    ),
    sfQuery<PublicSystemRow>(
      `
      SELECT
        SYSTEM_ID,
        REGISTRY_ID,
        CASE_ID,
        SYSTEM_NAME,
        SYSTEM_TYPE,
        DEPLOYMENT_STATUS,
        OVERSIGHT_LEVEL,
        RISK_TIER,
        DEVELOPER_ORGANIZATION,
        PUBLIC_SUMMARY,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_BAND
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE REGISTRY_ID = ?
      ORDER BY SYSTEM_NAME ASC
      LIMIT 50
      `,
      [registryId]
    ),
  ]);

  const record = records[0];

  if (!record) {
    notFound();
  }

  const certStatus = certificationStatus(record);
  const verifyUrl = `/api/verify/${encodeURIComponent(record.REGISTRY_ID)}`;
  const badgeUrl = `/badge/${encodeURIComponent(record.REGISTRY_ID)}`;
  const absoluteVerifyUrl = `${baseOrigin()}${verifyUrl}`;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          CERTIFICATION RECORD
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-[34px] font-semibold leading-[1.08] tracking-tight text-black md:text-[48px]">
              {record.ENTITY_NAME || record.REGISTRY_ID}
            </h1>

            <p className="mt-4 max-w-[840px] text-[16px] leading-[1.7] text-black/72">
              Canonical public certification record issued by GAFAIG. This
              record reflects Snowflake-backed registry data and links directly
              to the live cryptographic verification payload.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <StatusPill value={certStatus} />
              <StatusPill value={record.DECISION_STATUS || "—"} subtle />
              <StatusPill
                value={tierBandLabel(
                  record.CERTIFIED_TIER,
                  record.CERTIFIED_BAND
                )}
                subtle
              />
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
              Certified score
            </div>
            <div className="mt-2 text-[32px] font-semibold text-black">
              {formatScore(record.CERTIFIED_SCORE)}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/registry"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Back to registry
          </Link>

          <Link
            href={verifyUrl}
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            target="_blank"
          >
            Verify certification
          </Link>

          <Link
            href={badgeUrl}
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            target="_blank"
          >
            Open badge
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Country" value={record.COUNTRY || "—"} />
        <MetricCard
          label="Tier / Band"
          value={tierBandLabel(record.CERTIFIED_TIER, record.CERTIFIED_BAND)}
        />
        <MetricCard label="Certified at" value={formatDate(record.CERTIFIED_AT)} />
        <MetricCard label="Valid to" value={formatDate(record.VALID_TO)} />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          CERTIFICATION SUMMARY
        </div>

        <h2 className="mt-4 text-[30px] font-semibold leading-[1.16] tracking-tight text-black md:text-[36px]">
          Public registry details
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Info label="Registry ID" value={record.REGISTRY_ID} mono />
          <Info label="Entity type" value={record.ENTITY_TYPE || "—"} />
          <Info label="Certification status" value={certStatus} />
          <Info label="Decision status" value={record.DECISION_STATUS || "—"} />
          <Info label="Application ID" value={record.APPLICATION_ID || "—"} mono />
          <Info label="Case ID" value={record.CASE_ID || "—"} mono />
          <Info label="Certified score" value={formatScore(record.CERTIFIED_SCORE)} />
          <Info
            label="Certified tier"
            value={record.CERTIFIED_TIER || "—"}
          />
          <Info
            label="Certified band"
            value={record.CERTIFIED_BAND || "—"}
          />
          <Info label="Valid from" value={formatDate(record.VALID_FROM)} />
          <Info label="Valid to" value={formatDate(record.VALID_TO)} />
          <Info label="Certified at" value={formatDate(record.CERTIFIED_AT)} />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              LIVE VERIFICATION
            </div>
            <h2 className="mt-4 text-[30px] font-semibold leading-[1.16] tracking-tight text-black md:text-[36px]">
              Cryptographic trust surface
            </h2>
          </div>

          <Link
            href={verifyUrl}
            target="_blank"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Open live verification JSON
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Verification endpoint
            </div>
            <div className="mt-3 break-all rounded-xl bg-black/[0.03] px-4 py-3 font-mono text-[13px] text-black/75">
              {absoluteVerifyUrl}
            </div>
            <p className="mt-3 text-sm leading-[1.7] text-black/68">
              This endpoint returns the signed public verification payload for
              the registry record, including the certification outcome,
              timestamps, and signature metadata.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Trust summary
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <InfoSmall label="Algorithm" value="HS256" />
              <InfoSmall label="Verified" value={certStatus === "Certified" ? "true" : "false"} />
              <InfoSmall label="Decision" value={record.DECISION_STATUS || "—"} />
              <InfoSmall label="Validity" value={formatDate(record.VALID_TO)} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          DISCLOSED AI SYSTEMS
        </div>

        <h2 className="mt-4 text-[30px] font-semibold leading-[1.16] tracking-tight text-black md:text-[36px]">
          Systems associated with this certification
        </h2>

        {systems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public AI systems are associated with this registry record.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {systems.map((system) => (
              <div
                key={system.SYSTEM_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[22px] font-semibold tracking-tight text-black">
                      {system.SYSTEM_NAME || system.SYSTEM_ID}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/65">
                      <span>{system.SYSTEM_TYPE || "—"}</span>
                      <span>{system.DEPLOYMENT_STATUS || "—"}</span>
                      <span>{system.OVERSIGHT_LEVEL || "—"}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
                      Certified score
                    </div>
                    <div className="mt-1 text-[20px] font-semibold text-black">
                      {formatScore(system.CERTIFIED_SCORE)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <InfoSmall label="System ID" value={system.SYSTEM_ID} mono />
                  <InfoSmall label="Risk tier" value={system.RISK_TIER || "—"} />
                  <InfoSmall
                    label="Tier / Band"
                    value={tierBandLabel(
                      system.CERTIFIED_TIER,
                      system.CERTIFIED_BAND
                    )}
                  />
                  <InfoSmall
                    label="Developer"
                    value={system.DEVELOPER_ORGANIZATION || "—"}
                  />
                </div>

                {system.PUBLIC_SUMMARY ? (
                  <p className="mt-4 text-sm leading-[1.7] text-black/72">
                    {system.PUBLIC_SUMMARY}
                  </p>
                ) : null}
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
      <div className="mt-2 text-[24px] font-semibold text-black">{value}</div>
    </div>
  );
}

function Info({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/5 px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={`mt-2 text-[14px] text-black/85 ${
          mono ? "break-all font-mono" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function InfoSmall({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={`mt-2 text-[13px] text-black/85 ${
          mono ? "break-all font-mono" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusPill({
  value,
  subtle = false,
}: {
  value: string;
  subtle?: boolean;
}) {
  const normalized = String(value || "").trim().toLowerCase();

  let classes =
    "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]";

  if (!subtle && normalized === "certified") {
    classes += " border-emerald-300 bg-emerald-50 text-emerald-700";
  } else if (!subtle && normalized === "not certified") {
    classes += " border-zinc-300 bg-zinc-50 text-zinc-700";
  } else if (normalized === "published") {
    classes += " border-blue-300 bg-blue-50 text-blue-700";
  } else {
    classes += " border-black/10 bg-black/[0.03] text-black/65";
  }

  return <span className={classes}>{value}</span>;
}
import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQuery } from "@/lib/snowflake";
import CopyButton from "@/app/components/CopyButton";

export const dynamic = "force-dynamic";

/* ================= TYPES ================= */

type RegistryRecord = {
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
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
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
};

type VerifyFetchResult = {
  ok: boolean;
  status: number | null;
  payload: unknown | null;
  pretty: string | null;
  error: string | null;
};

/* ================= HELPERS ================= */

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

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function certificationStatus(record: RegistryRecord) {
  return record.CERTIFIED_AT ? "Certified" : "Not Certified";
}

function statusBadgeClass(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized === "certified") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (normalized === "published") {
    return "border-sky-200 bg-sky-50 text-sky-800";
  }
  return "border-black/10 bg-white text-black/70";
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

function baseOrigin() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  ).replace(/\/$/, "");
}

async function getVerificationPayload(
  registryId: string
): Promise<VerifyFetchResult> {
  const url = `${baseOrigin()}/api/verify/${encodeURIComponent(registryId)}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    const text = await response.text();
    let payload: unknown = null;

    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }

    return {
      ok: response.ok,
      status: response.status,
      payload,
      pretty:
        payload == null
          ? null
          : typeof payload === "string"
          ? payload
          : JSON.stringify(payload, null, 2),
      error: response.ok ? null : `Verification endpoint returned ${response.status}.`,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      payload: null,
      pretty: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to fetch verification payload.",
    };
  }
}

function getProofSignedAt(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const p = payload as Record<string, unknown>;
  const candidates = [
    p.signedAt,
    p.signed_at,
    p.issuedAt,
    p.issued_at,
    p.timestamp,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  if (
    p.proof &&
    typeof p.proof === "object" &&
    p.proof !== null &&
    typeof (p.proof as Record<string, unknown>).signedAt === "string"
  ) {
    return (p.proof as Record<string, string>).signedAt;
  }

  return null;
}

function getProofAlgorithm(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const p = payload as Record<string, unknown>;
  const candidates = [p.alg, p.algorithm];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  if (
    p.proof &&
    typeof p.proof === "object" &&
    p.proof !== null &&
    typeof (p.proof as Record<string, unknown>).alg === "string"
  ) {
    return (p.proof as Record<string, string>).alg;
  }

  return null;
}

/* ================= PAGE ================= */

export default async function RegistryDetailPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = decodeURIComponent(params.registryId || "").trim();

  if (!registryId) notFound();

  const [records, systems, verify] = await Promise.all([
    sfQuery<RegistryRecord>(
      `
      SELECT
        REGISTRY_ID,
        APPLICATION_ID,
        CASE_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
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
        CERTIFIED_TIER,
        CERTIFIED_BAND
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE REGISTRY_ID = ?
      ORDER BY SYSTEM_NAME ASC
      `,
      [registryId]
    ),
    getVerificationPayload(registryId),
  ]);

  const record = records[0];
  if (!record) notFound();

  const certStatus = certificationStatus(record);
  const verifyUrl = `/api/verify/${encodeURIComponent(record.REGISTRY_ID)}`;
  const badgeUrl = `/badge/${encodeURIComponent(record.REGISTRY_ID)}`;
  const absoluteVerifyUrl = `${baseOrigin()}${verifyUrl}`;
  const absoluteBadgeUrl = `${baseOrigin()}${badgeUrl}`;
  const signedAt = getProofSignedAt(verify.payload);
  const proofAlg = getProofAlgorithm(verify.payload);

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          CERTIFICATION RECORD
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] ${statusBadgeClass(
                  certStatus
                )}`}
              >
                {certStatus}
              </span>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] ${statusBadgeClass(
                  record.DECISION_STATUS || "—"
                )}`}
              >
                {record.DECISION_STATUS || "—"}
              </span>

              <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/70">
                {tierBandLabel(record.CERTIFIED_TIER, record.CERTIFIED_BAND)}
              </span>
            </div>

            <h1 className="mt-5 max-w-[900px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
              {record.ENTITY_NAME || "Unnamed Entity"}
            </h1>

            <p className="mt-4 max-w-[860px] text-[17px] leading-[1.72] text-black/72">
              Canonical public certification record issued by GAFAIG. This page
              summarizes the public certification outcome, presents the live
              trust surface, and links directly to any disclosed AI systems
              associated with the record.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/registry"
                className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                Back to registry
              </Link>

              <Link
                href={verifyUrl}
                className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
                target="_blank"
              >
                View verification
              </Link>

              <Link
                href={badgeUrl}
                className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
                target="_blank"
              >
                Open badge
              </Link>

              {systems.length > 0 ? (
                <Link
                  href={`/registry/ai-systems/${encodeURIComponent(
                    systems[0].SYSTEM_ID
                  )}`}
                  className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
                >
                  View linked systems
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:min-w-[260px]">
            <MetricCard
              label="Certification"
              value={tierBandLabel(record.CERTIFIED_TIER, record.CERTIFIED_BAND)}
            />
            <MetricCard label="Valid to" value={formatDate(record.VALID_TO)} />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Registry ID" value={record.REGISTRY_ID} mono />
        <MetricCard label="Country" value={record.COUNTRY || "—"} />
        <MetricCard
          label="Tier / Band"
          value={tierBandLabel(record.CERTIFIED_TIER, record.CERTIFIED_BAND)}
        />
        <MetricCard label="Certified at" value={formatDate(record.CERTIFIED_AT)} />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            CERTIFICATION SUMMARY
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[30px] font-semibold leading-[1.16] tracking-tight text-black md:text-[36px]">
                Public registry details
              </h2>
              <p className="mt-3 max-w-[760px] text-[15px] leading-[1.72] text-black/68">
                Core public certification metadata associated with this registry
                record.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/70">
              {systems.length} linked system{systems.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <InfoCard label="Registry ID" value={record.REGISTRY_ID} mono />
            <InfoCard label="Entity type" value={record.ENTITY_TYPE || "—"} />
            <InfoCard label="Certification status" value={certStatus} />
            <InfoCard label="Decision status" value={record.DECISION_STATUS || "—"} />
            <InfoCard label="Application ID" value={record.APPLICATION_ID || "—"} mono />
            <InfoCard label="Case ID" value={record.CASE_ID || "—"} mono />
            <InfoCard label="Certified tier" value={record.CERTIFIED_TIER || "—"} />
            <InfoCard label="Certified band" value={record.CERTIFIED_BAND || "—"} />
            <InfoCard
              label="Tier / Band"
              value={tierBandLabel(record.CERTIFIED_TIER, record.CERTIFIED_BAND)}
            />
            <InfoCard label="Valid from" value={formatDate(record.VALID_FROM)} />
            <InfoCard label="Valid to" value={formatDate(record.VALID_TO)} />
            <InfoCard label="Certified at" value={formatDate(record.CERTIFIED_AT)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            LIVE TRUST SURFACE
          </div>

          <h2 className="mt-4 text-[30px] font-semibold leading-[1.16] tracking-tight text-black md:text-[36px]">
            Verification, badge, and proof
          </h2>

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-black/6 bg-black/[0.015] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                Registry ID
              </div>
              <div className="mt-3 flex items-start gap-2">
                <div className="min-w-0 break-all font-mono text-[13px] leading-tight text-black/85">
                  {record.REGISTRY_ID}
                </div>
                <CopyButton value={record.REGISTRY_ID} />
              </div>
            </div>

            <div className="rounded-2xl border border-black/6 bg-black/[0.015] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                    Verification badge
                  </div>
                  <div className="mt-3 text-sm leading-[1.7] text-black/72">
                    Open the embeddable public badge for this certification
                    record.
                  </div>
                </div>

                <Link
                  href={badgeUrl}
                  target="_blank"
                  className="inline-flex items-center rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
                >
                  Open badge
                </Link>
              </div>

              <div className="mt-4 break-all rounded-xl bg-white px-4 py-3 font-mono text-[12px] text-black/70">
                {absoluteBadgeUrl}
              </div>
            </div>

            <div className="rounded-2xl border border-black/6 bg-black/[0.015] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                    Verification proof
                  </div>
                  <div className="mt-3 text-sm leading-[1.7] text-black/72">
                    Open the live verification payload for this registry record.
                  </div>
                </div>

                <Link
                  href={verifyUrl}
                  target="_blank"
                  className="inline-flex items-center rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
                >
                  Open proof JSON
                </Link>
              </div>

              <div className="mt-4 break-all rounded-xl bg-white px-4 py-3 font-mono text-[12px] text-black/70">
                {absoluteVerifyUrl}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoSmall label="Status" value={certStatus} />
              <InfoSmall label="Decision" value={record.DECISION_STATUS || "—"} />
              <InfoSmall
                label="Tier / Band"
                value={tierBandLabel(record.CERTIFIED_TIER, record.CERTIFIED_BAND)}
              />
              <InfoSmall label="Signed at" value={signedAt ? formatDate(signedAt) : "—"} />
              <InfoSmall label="Algorithm" value={proofAlg || "—"} />
              <InfoSmall
                label="Proof fetch"
                value={
                  verify.ok
                    ? `Live (${verify.status ?? "OK"})`
                    : verify.error || "Unavailable"
                }
              />
            </div>

            <details className="rounded-2xl border border-black/8 bg-white p-5">
              <summary className="cursor-pointer text-sm font-semibold text-black">
                View proof payload
              </summary>

              {verify.pretty ? (
                <pre className="mt-4 overflow-x-auto rounded-xl bg-black px-4 py-4 text-[12px] leading-[1.7] text-white">
                  {verify.pretty}
                </pre>
              ) : (
                <div className="mt-4 rounded-xl border border-black/8 bg-black/[0.015] px-4 py-4 text-sm text-black/70">
                  Verification payload is not currently available.
                </div>
              )}
            </details>
          </div>
        </section>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          LINKED AI SYSTEMS
        </div>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[30px] font-semibold leading-[1.16] tracking-tight text-black md:text-[36px]">
              Systems under this certification
            </h2>
            <p className="mt-3 max-w-[760px] text-[15px] leading-[1.72] text-black/68">
              Publicly disclosed AI systems associated with this certification
              record. Each links directly to its public system detail page.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/70">
            {systems.length} disclosed system{systems.length === 1 ? "" : "s"}
          </div>
        </div>

        {systems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public AI systems are associated with this registry record.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {systems.map((system) => (
              <Link
                key={system.SYSTEM_ID}
                href={`/registry/ai-systems/${encodeURIComponent(system.SYSTEM_ID)}`}
                className="group block rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.02]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] ${riskBadgeClass(
                          system.RISK_TIER
                        )}`}
                      >
                        {system.RISK_TIER || "Unknown risk"}
                      </span>

                      <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/70">
                        {tierBandLabel(system.CERTIFIED_TIER, system.CERTIFIED_BAND)}
                      </span>
                    </div>

                    <div className="mt-4 text-[22px] font-semibold tracking-tight text-black group-hover:underline">
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
                      Certification
                    </div>
                    <div className="mt-1 text-[20px] font-semibold text-black">
                      {tierBandLabel(system.CERTIFIED_TIER, system.CERTIFIED_BAND)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoSmall label="System ID" value={system.SYSTEM_ID} mono />
                  <InfoSmall label="Risk tier" value={system.RISK_TIER || "—"} />
                  <InfoSmall
                    label="Tier / Band"
                    value={tierBandLabel(system.CERTIFIED_TIER, system.CERTIFIED_BAND)}
                  />
                  <InfoSmall
                    label="Developer"
                    value={system.DEVELOPER_ORGANIZATION || "—"}
                  />
                </div>

                {system.PUBLIC_SUMMARY ? (
                  <p className="mt-4 text-sm leading-[1.72] text-black/72">
                    {system.PUBLIC_SUMMARY}
                  </p>
                ) : null}

                <div className="mt-4 text-sm font-semibold text-black underline">
                  View system detail →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ================= COMPONENTS ================= */

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
          "mt-2 text-[24px] font-semibold leading-tight text-black",
          mono ? "break-all font-mono text-[16px]" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/6 bg-black/[0.015] px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={[
          "mt-3 text-[15px] leading-[1.6] text-black/88",
          mono ? "break-all font-mono text-[13px] leading-tight" : "",
        ].join(" ")}
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
    <div className="rounded-xl border border-black/6 bg-black/[0.015] px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={[
          "mt-3 text-[15px] leading-[1.55] text-black/88",
          mono ? "break-all font-mono text-[13px] leading-tight" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}
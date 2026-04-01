import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQuery } from "@/lib/snowflake";
import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    registryId: string;
  };
};

type RegistryRow = {
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

type LinkedSystemRow = {
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
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
};

type VerifyApiResponse = {
  ok: boolean;
  verified?: boolean;
  registryId?: string;
  proof?: {
    alg?: string | null;
    kid?: string | null;
    verificationKeyUrl?: string | null;
    signature?: string | null;
    signedAt?: string | null;
    message?: Record<string, unknown> | string | null;
  } | null;
  record?: {
    registryId?: string | null;
    entityName?: string | null;
    entityType?: string | null;
    country?: string | null;
    applicationId?: string | null;
    caseId?: string | null;
    certificationStatus?: string | null;
    certifiedTier?: string | null;
    certifiedBand?: string | null;
    decisionStatus?: string | null;
    certifiedAt?: string | null;
    validFrom?: string | null;
    validTo?: string | null;
  } | null;
  error?: string;
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

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function statusBadgeClass(value: string | null | undefined) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized === "certified") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (normalized === "published") {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }

  return "border-black/10 bg-white text-black/70";
}

function riskBadgeClass(value: string | null | undefined) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized === "high") {
    return "border-black bg-black text-white";
  }
  if (normalized === "medium") {
    return "border-black/15 bg-black/10 text-black";
  }
  if (normalized === "low") {
    return "border-black/10 bg-white text-black/80";
  }

  return "border-black/10 bg-white text-black/65";
}

async function getVerifyData(
  registryId: string
): Promise<VerifyApiResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  try {
    const response = await fetch(
      `${baseUrl}/api/verify/${encodeURIComponent(registryId)}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const json = (await response.json()) as VerifyApiResponse;

    if (!response.ok) {
      return {
        ok: false,
        error: json?.error || "Verification unavailable",
      };
    }

    return json;
  } catch {
    return {
      ok: false,
      error: "Verification unavailable",
    };
  }
}

export default async function RegistryRecordPage({ params }: PageProps) {
  const registryId = decodeURIComponent(params.registryId || "").trim();

  if (!registryId) {
    notFound();
  }

  const [registryRows, linkedSystems, verifyData] = await Promise.all([
    sfQuery<RegistryRow>(
      `
      SELECT
        REGISTRY_ID,
        APPLICATION_ID,
        CASE_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFICATION_STATUS,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        DECISION_STATUS,
        VALID_FROM,
        VALID_TO,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM(?))
      LIMIT 1
      `,
      [registryId]
    ),
    sfQuery<LinkedSystemRow>(
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
        CERTIFICATION_STATUS,
        CERTIFIED_TIER,
        CERTIFIED_BAND
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM(?))
      ORDER BY COALESCE(DISPLAY_ORDER, 100), SYSTEM_NAME
      `,
      [registryId]
    ),
    getVerifyData(registryId),
  ]);

  const row = registryRows[0];

  if (!row) {
    notFound();
  }

  const verificationUrl = `/api/verify/${encodeURIComponent(row.REGISTRY_ID)}`;
  const badgeUrl = `/badge/${encodeURIComponent(row.REGISTRY_ID)}`;
  const entityName =
    verifyData.ok && verifyData.record?.entityName
      ? verifyData.record.entityName
      : row.ENTITY_NAME || row.REGISTRY_ID;

  const siteBase =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const absoluteRegistryUrl = `${siteBase}/registry/${encodeURIComponent(
    row.REGISTRY_ID
  )}`;
  const absoluteVerifyUrl = `${siteBase}${verificationUrl}`;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          CERTIFICATION RECORD
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] ${statusBadgeClass(
              row.CERTIFICATION_STATUS
            )}`}
          >
            {clean(row.CERTIFICATION_STATUS)}
          </span>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] ${statusBadgeClass(
              row.DECISION_STATUS
            )}`}
          >
            {clean(row.DECISION_STATUS)}
          </span>

          {(row.CERTIFIED_TIER || row.CERTIFIED_BAND) && (
            <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/70">
              {tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[760px]">
            <h1 className="text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
              {entityName}
            </h1>

            <p className="mt-4 text-[16px] leading-[1.8] text-black/72">
              Canonical public certification record issued by GAFAIG. This page
              summarizes public certification outcome, validity window, trust
              surfaces, and any disclosed AI systems associated with the record.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/registry"
                className="inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                Back to registry
              </Link>

              <Link
                href={verificationUrl}
                className="inline-flex min-w-[132px] items-center justify-center rounded-full border border-black px-5 py-3 text-center text-sm font-semibold transition hover:bg-black/[0.04]"
              >
                Open proof JSON
              </Link>

              <Link
                href={badgeUrl}
                className="inline-flex min-w-[132px] items-center justify-center rounded-full border border-black px-5 py-3 text-center text-sm font-semibold transition hover:bg-black/[0.04]"
              >
                Open badge
              </Link>

              {linkedSystems.length > 0 && (
                <a
                  href="#linked-systems"
                  className="inline-flex min-w-[148px] items-center justify-center rounded-full border border-black px-5 py-3 text-center text-sm font-semibold transition hover:bg-black/[0.04]"
                >
                  View linked systems
                </a>
              )}
            </div>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric
              label="Certification"
              value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
            />
            <HeroMetric label="Valid to" value={fmtDate(row.VALID_TO)} />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Registry ID" value={row.REGISTRY_ID} mono />
        <MetricCard label="Country" value={clean(row.COUNTRY)} />
        <MetricCard
          label="Tier / Band"
          value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
        />
        <MetricCard label="Certified at" value={fmtDate(row.CERTIFIED_AT)} />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                PUBLIC REGISTRY DETAILS
              </div>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Certification record summary
              </h2>

              <p className="mt-4 max-w-[760px] text-[15px] leading-[1.8] text-black/70">
                Core public certification metadata associated with this registry
                record.
              </p>
            </div>

            <div className="rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-medium text-black/65">
              {linkedSystems.length} linked system{linkedSystems.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard label="Registry ID" value={row.REGISTRY_ID} mono />
            <InfoCard label="Entity type" value={clean(row.ENTITY_TYPE)} />
            <InfoCard label="Certification status" value={clean(row.CERTIFICATION_STATUS)} />
            <InfoCard label="Decision status" value={clean(row.DECISION_STATUS)} />
            <InfoCard label="Application ID" value={clean(row.APPLICATION_ID)} />
            <InfoCard label="Case ID" value={clean(row.CASE_ID)} />
            <InfoCard label="Certified tier" value={clean(row.CERTIFIED_TIER)} />
            <InfoCard label="Certified band" value={clean(row.CERTIFIED_BAND)} />
            <InfoCard
              label="Tier / Band"
              value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
            />
            <InfoCard label="Valid from" value={fmtDate(row.VALID_FROM)} />
            <InfoCard label="Valid to" value={fmtDate(row.VALID_TO)} />
            <InfoCard label="Certified at" value={fmtDate(row.CERTIFIED_AT)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            LIVE TRUST SURFACE
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Verification, badge, and proof
          </h2>

          <p className="mt-4 text-[15px] leading-[1.8] text-black/70">
            This panel exposes the public trust layer for the registry record.
            It provides a direct verification endpoint, a portable badge
            surface, and the canonical public identifiers needed to validate the
            certification externally.
          </p>

          <div className="mt-8 grid gap-4">
            <TrustSurfaceCard
              label="Registry ID"
              description="Canonical public identifier for this certification record."
              value={row.REGISTRY_ID}
              mono
            />

            <TrustActionCard
              label="Verification proof"
              description="Open the live verification payload for this registry record."
              href={verificationUrl}
              hrefLabel="Open proof JSON"
              value={verificationUrl}
            />

            <TrustActionCard
              label="Verification badge"
              description="Open the embeddable public badge for this certification record."
              href={badgeUrl}
              hrefLabel="Open badge"
              value={badgeUrl}
            />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <InfoCard label="Status" value={clean(row.CERTIFICATION_STATUS)} />
            <InfoCard label="Decision" value={clean(row.DECISION_STATUS)} />
            <InfoCard
              label="Tier / Band"
              value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
            />
            <InfoCard label="Issued at" value={fmtDate(row.CERTIFIED_AT)} />
            <InfoCard label="Valid through" value={fmtDate(row.VALID_TO)} />
            <InfoCard label="Proof surface" value="Verification endpoint live" />
          </div>

          <div className="mt-8 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              Why this matters
            </div>
            <p className="mt-3 text-[15px] leading-[1.8] text-black/72">
              GAFAIG separates private verification workflow from public trust
              surfaces. Evidence and findings remain private. Certification
              status, validity window, badge access, and proof payloads become
              public and verifiable.
            </p>
          </div>
        </section>
      </section>

      <RegistryVerificationPanel
        absoluteVerifyUrl={absoluteVerifyUrl}
        absoluteRegistryUrl={absoluteRegistryUrl}
        registryId={row.REGISTRY_ID}
        entityName={entityName}
        verifyData={verifyData}
      />

      <section
        id="linked-systems"
        className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              LINKED AI SYSTEMS
            </div>

            <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Systems under this certification
            </h2>

            <p className="mt-4 max-w-[820px] text-[15px] leading-[1.8] text-black/70">
              Publicly disclosed AI systems associated with this certification
              record. Each row links directly to its public system detail page.
            </p>
          </div>

          <div className="rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-medium text-black/65">
            {linkedSystems.length} disclosed system{linkedSystems.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {linkedSystems.length === 0 ? (
            <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
              No public AI systems are associated with this registry record.
            </div>
          ) : (
            linkedSystems.map((system) => (
              <div
                key={system.SYSTEM_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {system.RISK_TIER ? (
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${riskBadgeClass(
                            system.RISK_TIER
                          )}`}
                        >
                          {system.RISK_TIER}
                        </span>
                      ) : null}

                      {system.CERTIFICATION_STATUS ? (
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusBadgeClass(
                            system.CERTIFICATION_STATUS
                          )}`}
                        >
                          {system.CERTIFICATION_STATUS}
                        </span>
                      ) : null}

                      {(system.CERTIFIED_TIER || system.CERTIFIED_BAND) && (
                        <span className="inline-flex rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/70">
                          {tierBandLabel(system.CERTIFIED_TIER, system.CERTIFIED_BAND)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 text-[24px] font-semibold tracking-tight text-black">
                      {clean(system.SYSTEM_NAME)}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/65">
                      <span>{clean(system.SYSTEM_TYPE)}</span>
                      <span>{clean(system.DEPLOYMENT_STATUS)}</span>
                      <span>{clean(system.OVERSIGHT_LEVEL)}</span>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                      Certification
                    </div>
                    <div className="mt-2 text-[16px] font-semibold text-black">
                      {tierBandLabel(system.CERTIFIED_TIER, system.CERTIFIED_BAND)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoCard label="System ID" value={system.SYSTEM_ID} mono />
                  <InfoCard label="Risk tier" value={clean(system.RISK_TIER)} />
                  <InfoCard
                    label="Tier / Band"
                    value={tierBandLabel(system.CERTIFIED_TIER, system.CERTIFIED_BAND)}
                  />
                  <InfoCard
                    label="Developer"
                    value={clean(system.DEVELOPER_ORGANIZATION)}
                  />
                </div>

                <div className="mt-5 text-[14px] leading-[1.8] text-black/68">
                  {system.INTENDED_USE && system.INTENDED_USE.trim().length > 0
                    ? system.INTENDED_USE
                    : `${clean(system.SYSTEM_NAME)} is publicly disclosed under GAFAIG certification record ${row.REGISTRY_ID}.`}
                </div>

                <div className="mt-5">
                  <Link
                    href={`/registry/ai-systems/${encodeURIComponent(system.SYSTEM_ID)}`}
                    className="text-sm font-semibold underline underline-offset-4"
                  >
                    View system detail →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[18px] font-semibold leading-tight text-black">
        {value}
      </div>
    </div>
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
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={[
          "mt-3 text-[24px] font-semibold leading-tight tracking-tight text-black",
          mono ? "break-all font-mono text-[18px]" : "",
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
    <div className="rounded-xl border border-black/8 bg-black/[0.015] px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={[
          "mt-3 text-[14px] leading-[1.65] text-black/88",
          mono ? "break-all font-mono text-[13px]" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function TrustSurfaceCard({
  label,
  description,
  value,
  mono = false,
}: {
  label: string;
  description: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <p className="mt-3 text-[14px] leading-[1.75] text-black/68">
        {description}
      </p>
      <div
        className={[
          "mt-4 rounded-xl border border-black/8 bg-black/[0.015] px-4 py-3 text-black/85",
          mono ? "break-all font-mono text-[13px]" : "text-[14px]",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function TrustActionCard({
  label,
  description,
  href,
  hrefLabel,
  value,
}: {
  label: string;
  description: string;
  href: string;
  hrefLabel: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
            {label}
          </div>
          <p className="mt-3 text-[14px] leading-[1.75] text-black/68">
            {description}
          </p>
        </div>

        <Link
          href={href}
          className="inline-flex min-w-[132px] items-center justify-center rounded-full border border-black bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-black/90"
        >
          {hrefLabel}
        </Link>
      </div>

      <div className="mt-4 break-all rounded-xl border border-black/8 bg-black/[0.015] px-4 py-3 font-mono text-[13px] text-black/85">
        {value}
      </div>
    </div>
  );
}
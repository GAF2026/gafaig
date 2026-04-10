import { notFound } from "next/navigation";

import PublicButtonLink from "@/app/_components/PublicButtonLink";
import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";
import RegistryTrustTools from "@/components/registry/RegistryTrustTools";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RegistryApiRow = {
  registryId?: string;
  applicationId?: string | null;
  caseId?: string | null;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  certifiedScore?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  certifiedAt?: string | null;
};

type RegistryApiResponse = {
  ok?: boolean;
  total?: number;
  rows?: RegistryApiRow[];
  error?: string;
};

type VerifyApiResponse = {
  ok: boolean;
  verified: boolean;
  registryId: string;
  proof?: {
    alg?: string;
    kid?: string;
    signature?: string;
    signedAt?: string;
    verificationKeyUrl?: string;
    message?: Record<string, unknown>;
    messageString?: string;
  };
  record?: {
    registryId?: string;
    entityName?: string | null;
    entityType?: string | null;
    country?: string | null;
    applicationId?: string | null;
    caseId?: string | null;
    certificationStatus?: string | null;
    certifiedScore?: number | null;
    certifiedTier?: string | null;
    certifiedBand?: string | null;
    decisionStatus?: string | null;
    certifiedAt?: string | null;
    validFrom?: string | null;
    validTo?: string | null;
  };
};

type ScoreBreakdownComponent = {
  registryId?: string;
  applicationId?: string | null;
  caseId?: string | null;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  verificationType?: string | null;
  modelVersion?: string | null;
  certifiedScore?: number | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  scoreDimension?: string | null;
  scoreComponent?: string | null;
  scoreDimensionOrder?: number | null;
  scoreComponentOrder?: number | null;
  componentScore?: number | null;
  componentMaxScore?: number | null;
  componentWeight?: number | null;
  componentContribution?: number | null;
  componentScorePct?: number | null;
};

type ScoreBreakdownDimension = {
  registryId?: string;
  applicationId?: string | null;
  caseId?: string | null;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  verificationType?: string | null;
  modelVersion?: string | null;
  certifiedScore?: number | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  scoreDimension?: string | null;
  scoreDimensionOrder?: number | null;
  dimensionScore?: number | null;
  dimensionMaxScore?: number | null;
  dimensionContribution?: number | null;
  avgComponentWeight?: number | null;
  componentCount?: number | null;
  dimensionScorePct?: number | null;
  components?: ScoreBreakdownComponent[];
};

type ScoreBreakdownApiResponse = {
  ok?: boolean;
  registryId?: string;
  caseId?: string | null;
  applicationId?: string | null;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  verificationType?: string | null;
  modelVersion?: string | null;
  certifiedScore?: number | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  dimensionCount?: number | null;
  componentCount?: number | null;
  dimensions?: ScoreBreakdownDimension[];
  error?: string;
};

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  );
}

async function getRegistryData(
  registryId: string
): Promise<RegistryApiResponse | null> {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(
      `${baseUrl}/api/registry?registryId=${encodeURIComponent(registryId)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return (await res.json()) as RegistryApiResponse;
  } catch {
    return null;
  }
}

async function getVerifyData(
  registryId: string
): Promise<VerifyApiResponse | null> {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(
      `${baseUrl}/api/verify/${encodeURIComponent(registryId)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return (await res.json()) as VerifyApiResponse;
  } catch {
    return null;
  }
}

async function getScoreBreakdownData(
  registryId: string
): Promise<ScoreBreakdownApiResponse | null> {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(
      `${baseUrl}/api/registry/${encodeURIComponent(
        registryId
      )}/score-breakdown`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return (await res.json()) as ScoreBreakdownApiResponse;
  } catch {
    return null;
  }
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPercent(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  const num = Number(value);

  if (num <= 1) {
    return `${Math.round(num * 100)}%`;
  }

  return `${Math.round(num)}%`;
}

function formatWeight(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${(Number(value) * 100).toFixed(0)}%`;
}

function getDimensionSummary(dimension: ScoreBreakdownDimension) {
  if (
    dimension.dimensionScorePct !== null &&
    dimension.dimensionScorePct !== undefined
  ) {
    return formatPercent(dimension.dimensionScorePct);
  }

  if (
    dimension.dimensionScore !== null &&
    dimension.dimensionScore !== undefined &&
    dimension.dimensionMaxScore !== null &&
    dimension.dimensionMaxScore !== undefined &&
    Number(dimension.dimensionMaxScore) > 0
  ) {
    const pct =
      (Number(dimension.dimensionScore) / Number(dimension.dimensionMaxScore)) *
      100;
    return `${Math.round(pct)}%`;
  }

  if (
    dimension.dimensionScore !== null &&
    dimension.dimensionScore !== undefined &&
    Number(dimension.dimensionScore) <= 1
  ) {
    return `${Math.round(Number(dimension.dimensionScore) * 100)}%`;
  }

  if (
    dimension.dimensionScore !== null &&
    dimension.dimensionScore !== undefined
  ) {
    return `${Math.round(Number(dimension.dimensionScore))}`;
  }

  return "—";
}

function getComponentSummary(component: ScoreBreakdownComponent) {
  if (
    component.componentScorePct !== null &&
    component.componentScorePct !== undefined
  ) {
    return formatPercent(component.componentScorePct);
  }

  if (
    component.componentScore !== null &&
    component.componentScore !== undefined &&
    component.componentMaxScore !== null &&
    component.componentMaxScore !== undefined &&
    Number(component.componentMaxScore) > 0
  ) {
    const pct =
      (Number(component.componentScore) / Number(component.componentMaxScore)) *
      100;
    return `${Math.round(pct)}%`;
  }

  if (
    component.componentScore !== null &&
    component.componentScore !== undefined &&
    Number(component.componentScore) <= 1
  ) {
    return `${Math.round(Number(component.componentScore) * 100)}%`;
  }

  if (
    component.componentScore !== null &&
    component.componentScore !== undefined
  ) {
    return `${Math.round(Number(component.componentScore))}`;
  }

  return "—";
}

export default async function RegistryRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId || "").trim();

  if (!registryId) {
    notFound();
  }

  const [registryData, verifyData, scoreBreakdownData] = await Promise.all([
    getRegistryData(registryId),
    getVerifyData(registryId),
    getScoreBreakdownData(registryId),
  ]);

  const row = registryData?.rows?.[0] ?? null;
  const record = verifyData?.record ?? null;
  const dimensions = scoreBreakdownData?.dimensions ?? [];

  const entityName = record?.entityName || row?.entityName || "Unknown Entity";

  const certifiedScore =
    record?.certifiedScore !== null && record?.certifiedScore !== undefined
      ? String(record.certifiedScore)
      : row?.certifiedScore || null;

  const certifiedTier = record?.certifiedTier || row?.certifiedTier || null;
  const certifiedBand = record?.certifiedBand || row?.certifiedBand || null;
  const decisionStatus = record?.decisionStatus || row?.decisionStatus || null;
  const certifiedAt = record?.certifiedAt || row?.certifiedAt || null;
  const validTo = record?.validTo || row?.validTo || null;

  const certificationStatus =
    record?.certificationStatus || (certifiedAt ? "Certified" : "Not Certified");

  const baseUrl = getBaseUrl();
  const absoluteRegistryUrl = `${baseUrl}/registry/${encodeURIComponent(
    registryId
  )}`;
  const absoluteVerifyUrl = `${baseUrl}/api/verify/${encodeURIComponent(
    registryId
  )}`;
  const absoluteBadgeUrl = `${baseUrl}/badge/${encodeURIComponent(registryId)}`;

  if (!row && !record) {
    return (
      <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
        <div className="space-y-8">
          <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              REGISTRY
            </div>
            <h1 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Registry record not found
            </h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-[1.85] text-black/75">
              We could not find a public GAFAIG registry record for this ID.
            </p>
            <div className="mt-8">
              <PublicButtonLink href="/registry" variant="secondary">
                Back to registry
              </PublicButtonLink>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <header className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            CANONICAL PUBLIC TRUST RECORD
          </div>

          <h1 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            {entityName}
          </h1>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.85] text-black/75">
            This page is the public certification record for this entity within
            the GAFAIG registry of record.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <IntroCard
              title="Public record of certification"
              body="Disclosed certification outcome."
            />
            <IntroCard
              title="Programmatically verifiable"
              body="Verified via API + signed proof."
            />
            <IntroCard
              title="Portable across the web"
              body="Badge, QR, widget."
            />
            <IntroCard
              title="Certified score"
              body={certifiedScore ? `Score ${certifiedScore}` : "No score disclosed"}
            />
          </div>

          <div className="mt-6 text-sm text-black/70">
            Want to independently verify this certification?{" "}
            <PublicButtonLink href="/verify" variant="ghost" size="sm">
              Learn how verification works →
            </PublicButtonLink>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <InfoCard label="Status" value={certificationStatus} />
            <InfoCard label="Score" value={certifiedScore || "—"} />
            <InfoCard
              label="Tier / Band"
              value={[certifiedTier, certifiedBand].filter(Boolean).join(" · ") || "—"}
            />
            <InfoCard label="Decision" value={decisionStatus || "—"} />
            <InfoCard label="Valid To" value={validTo || "—"} />
          </div>
        </header>

        <RegistryVerificationPanel
          registryId={registryId}
          entityName={entityName}
          verifyData={verifyData}
        />

        {dimensions.length > 0 ? (
          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              SCORE EXPLANATION
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                  Score breakdown
                </h2>
                <p className="mt-4 max-w-[900px] text-[15px] leading-[1.8] text-black/68">
                  This section explains the public score using the canonical
                  breakdown published from Snowflake. Dimension and component
                  values are displayed as readable percentages for external
                  review.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-4">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  Overall certified score
                </div>
                <div className="mt-2 text-[24px] font-semibold tracking-tight text-black">
                  {certifiedScore || "—"}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {dimensions.map((dimension, index) => {
                const dimensionTitle =
                  dimension.scoreDimension || `Dimension ${index + 1}`;
                const components = dimension.components ?? [];

                return (
                  <details
                    key={`${dimensionTitle}-${index}`}
                    className="group rounded-2xl border border-black/10 bg-black/[0.02] open:bg-white"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5">
                      <div>
                        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                          Dimension
                        </div>
                        <div className="mt-2 text-[20px] font-semibold tracking-tight text-black">
                          {dimensionTitle}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                            Components
                          </div>
                          <div className="mt-2 text-[16px] font-semibold text-black">
                            {components.length}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                            Score
                          </div>
                          <div className="mt-2 text-[22px] font-semibold tracking-tight text-black">
                            {getDimensionSummary(dimension)}
                          </div>
                        </div>
                      </div>
                    </summary>

                    <div className="border-t border-black/10 px-5 py-5">
                      <div className="grid gap-4 md:grid-cols-4">
                        <MiniStat
                          label="Dimension score"
                          value={getDimensionSummary(dimension)}
                        />
                        <MiniStat
                          label="Contribution weight"
                          value={formatWeight(dimension.avgComponentWeight)}
                        />
                        <MiniStat
                          label="Contribution to total"
                          value={formatPercent(dimension.dimensionContribution)}
                        />
                        <MiniStat
                          label="Components"
                          value={String(components.length)}
                        />
                      </div>

                      <div className="mt-5 overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="border-b border-black/10 text-left">
                              <th className="px-0 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                                Component
                              </th>
                              <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                                Score
                              </th>
                              <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                                Weight
                              </th>
                              <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                                Contribution
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {components.map((component, componentIndex) => (
                              <tr
                                key={`${dimensionTitle}-${component.scoreComponent || "component"}-${componentIndex}`}
                                className="border-b border-black/5"
                              >
                                <td className="px-0 py-4 text-[15px] font-semibold text-black">
                                  {component.scoreComponent || "Unnamed component"}
                                </td>
                                <td className="px-4 py-4 text-[15px] text-black/75">
                                  {getComponentSummary(component)}
                                </td>
                                <td className="px-4 py-4 text-[15px] text-black/75">
                                  {formatWeight(component.componentWeight)}
                                </td>
                                <td className="px-4 py-4 text-[15px] text-black/75">
                                  {formatPercent(component.componentContribution)}
                                </td>
                              </tr>
                            ))}

                            {components.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="px-0 py-4 text-[15px] text-black/60"
                                >
                                  No public component details available for this
                                  dimension.
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        ) : null}

        <RegistryTrustTools
          registryId={registryId}
          entityName={entityName}
          absoluteRegistryUrl={absoluteRegistryUrl}
          absoluteVerifyUrl={absoluteVerifyUrl}
          absoluteBadgeUrl={absoluteBadgeUrl}
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            TRUST DISTRIBUTION
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Embed this certification anywhere
          </h2>

          <p className="mt-4 max-w-[900px] text-[15px] leading-[1.8] text-black/68">
            Use the snippets below to display GAFAIG certification on your
            website, product, or documentation. These embed directly from the
            canonical verification system.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 p-6">
              <div className="text-sm font-semibold text-black">
                Badge (linked)
              </div>

              <pre className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-black/[0.03] p-4 text-[13px] leading-7 text-black/85">
                <code>{`<a href="${absoluteVerifyUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${absoluteBadgeUrl}" alt="GAFAIG certification badge" style="height:64px;width:auto" />
</a>`}</code>
              </pre>
            </div>

            <div className="rounded-2xl border border-black/10 p-6">
              <div className="text-sm font-semibold text-black">
                Live widget
              </div>

              <pre className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-black/[0.03] p-4 text-[13px] leading-7 text-black/85">
                <code>{`<script src="https://www.gafaig.com/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${registryId}"></div>`}</code>
              </pre>
            </div>

            <div className="rounded-2xl border border-black/10 p-6">
              <div className="text-sm font-semibold text-black">
                Verification link
              </div>

              <pre className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-black/[0.03] p-4 text-[13px] leading-7 text-black/85">
                <code>{absoluteVerifyUrl}</code>
              </pre>
            </div>

            <div className="rounded-2xl border border-black/10 p-6">
              <div className="text-sm font-semibold text-black">
                Widget preview
              </div>

              <div className="mt-4">
                <PublicButtonLink
                  href={`/widget-preview/${encodeURIComponent(registryId)}`}
                  variant="primary"
                >
                  Open widget preview →
                </PublicButtonLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function IntroCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  const displayValue =
    label.toLowerCase() === "valid to" ? formatDate(value) : value;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 break-words whitespace-normal text-[20px] font-semibold leading-[1.15] tracking-tight text-black md:text-[22px]">
        {displayValue}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[18px] font-semibold tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}
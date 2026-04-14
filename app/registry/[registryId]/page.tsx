import { notFound } from "next/navigation";

import PublicButtonLink from "@/app/_components/PublicButtonLink";
import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";
import RegistryTrustTools from "@/components/registry/RegistryTrustTools";

export const revalidate = 300;

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

type VerifyApiRecord = {
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
  record?: VerifyApiRecord;
};

type ScoreBreakdownDimension = {
  scoreDimension?: string | null;
};

type ScoreBreakdownApiResponse = {
  ok?: boolean;
  dimensionCount?: number | null;
  dimensions?: ScoreBreakdownDimension[];
};

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function infoValue(values: Array<string | null | undefined>): string {
  for (const value of values) {
    const s = String(value ?? "").trim();
    if (s) return s;
  }
  return "—";
}

function formatTierBand(tier?: string | null, band?: string | null): string {
  const safeTier = String(tier ?? "").trim();
  const safeBand = String(band ?? "").trim();
  if (safeTier && safeBand) return `${safeTier} · ${safeBand}`;
  if (safeTier) return safeTier;
  if (safeBand) return safeBand;
  return "—";
}

function statusTone(value: string) {
  const v = value.trim().toUpperCase();
  if (v === "APPROVED") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v === "CERTIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function getTrustState({
  isCertified,
  decisionStatus,
}: {
  isCertified: boolean;
  decisionStatus: string;
}) {
  if (isCertified) {
    return {
      label: "Verified",
      className:
        "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-200",
    };
  }

  if (decisionStatus !== "—" && decisionStatus.toUpperCase() === "APPROVED") {
    return {
      label: "Approved",
      className:
        "inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700 ring-1 ring-blue-200",
    };
  }

  return {
    label: "Pending",
    className:
      "inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 ring-1 ring-slate-200",
  };
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[15px] font-medium leading-[1.6] text-black">
        {value}
      </div>
    </div>
  );
}

export default async function RegistryRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId || "").trim();
  if (!registryId) notFound();

  const baseUrl = getBaseUrl();

  const [registryRes, verifyRes, scoreBreakdownRes] = await Promise.all([
    fetch(`${baseUrl}/api/registry?registryId=${encodeURIComponent(registryId)}`, {
      next: { revalidate: 300 },
    }).catch(() => null),
    fetch(`${baseUrl}/api/verify/${encodeURIComponent(registryId)}`, {
      next: { revalidate: 300 },
    }).catch(() => null),
    fetch(
      `${baseUrl}/api/registry/${encodeURIComponent(registryId)}/score-breakdown`,
      { next: { revalidate: 300 } }
    ).catch(() => null),
  ]);

  const registryData: RegistryApiResponse | null = registryRes
    ? await registryRes.json()
    : null;

  const verifyData: VerifyApiResponse | null = verifyRes
    ? await verifyRes.json()
    : null;

  const scoreBreakdownData: ScoreBreakdownApiResponse | null = scoreBreakdownRes
    ? await scoreBreakdownRes.json()
    : null;

  const row = registryData?.rows?.[0] ?? null;
  const record = verifyData?.record ?? null;

  if (!row && !record) notFound();

  const entityName = infoValue([record?.entityName, row?.entityName]);
  const entityType = infoValue([record?.entityType, row?.entityType]);
  const country = infoValue([record?.country, row?.country]);
  const applicationId = infoValue([record?.applicationId, row?.applicationId]);
  const caseId = infoValue([record?.caseId, row?.caseId]);

  const certifiedTierRaw = infoValue([record?.certifiedTier, row?.certifiedTier]);
  const certifiedBandRaw = infoValue([record?.certifiedBand, row?.certifiedBand]);
  const decisionStatus = infoValue([record?.decisionStatus, row?.decisionStatus]);

  const certifiedAtRaw = record?.certifiedAt ?? row?.certifiedAt ?? null;
  const validFromRaw = record?.validFrom ?? row?.validFrom ?? null;
  const validToRaw = record?.validTo ?? row?.validTo ?? null;

  const certifiedScore =
    record?.certifiedScore != null
      ? String(record.certifiedScore)
      : infoValue([row?.certifiedScore]);

  const isCertified = Boolean(String(certifiedAtRaw ?? "").trim());

  const dimensions: string[] = (scoreBreakdownData?.dimensions ?? [])
    .map((d) => String(d.scoreDimension ?? "").trim())
    .filter(Boolean);

  const dimensionCount =
    typeof scoreBreakdownData?.dimensionCount === "number"
      ? scoreBreakdownData.dimensionCount
      : dimensions.length;

  const tierBand = formatTierBand(
    certifiedTierRaw === "—" ? null : certifiedTierRaw,
    certifiedBandRaw === "—" ? null : certifiedBandRaw
  );

  const trustState = getTrustState({
    isCertified,
    decisionStatus,
  });

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-20 pt-12 lg:px-10">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className={trustState.className}>{trustState.label}</span>

            {decisionStatus !== "—" && (
              <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${statusTone(decisionStatus)}`}>
                {decisionStatus}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-[42px] font-semibold">{entityName}</h1>

          <div className="mt-8 grid gap-3 md:grid-cols-5">
            <InfoCard label="Status" value={isCertified ? "Certified" : "Not Certified"} />
            <InfoCard label="Tier / Band" value={isCertified ? tierBand : "—"} />
            <InfoCard label="Decision" value={decisionStatus} />
            <InfoCard label="Certified At" value={isCertified ? formatDate(certifiedAtRaw) : "—"} />
            <InfoCard label="Valid To" value={formatDate(validToRaw)} />
          </div>
        </section>

        {isCertified && (
          <RegistryVerificationPanel
            registryId={registryId}
            entityName={entityName}
            verifyData={verifyData}
          />
        )}

        {dimensionCount > 0 && (
          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
            <h2 className="text-[28px] font-semibold">
              {isCertified ? "Reviewed across governance dimensions" : "Public-safe governance review scope"}
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {dimensions.map((d) => (
                <div key={d} className="rounded-2xl border p-5">
                  {d}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
          <div className="grid gap-3 md:grid-cols-3">
            <InfoCard label="Registry ID" value={registryId} />
            <InfoCard label="Application ID" value={applicationId} />
            <InfoCard label="Case ID" value={caseId} />
          </div>
        </section>

        {isCertified && (
          <RegistryTrustTools
            registryId={registryId}
            entityName={entityName}
            absoluteRegistryUrl={`${baseUrl}/registry/${registryId}`}
            absoluteVerifyUrl={`${baseUrl}/api/verify/${registryId}`}
            absoluteBadgeUrl={`${baseUrl}/badge/${registryId}`}
          />
        )}
      </div>
    </main>
  );
}
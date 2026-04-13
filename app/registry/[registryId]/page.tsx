import { notFound } from "next/navigation";

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

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-black/10 bg-black/[0.02] p-4">
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
      cache: "no-store",
    }).catch(() => null),
    fetch(`${baseUrl}/api/verify/${encodeURIComponent(registryId)}`, {
      cache: "no-store",
    }).catch(() => null),
    fetch(
      `${baseUrl}/api/registry/${encodeURIComponent(registryId)}/score-breakdown`,
      {
        cache: "no-store",
      }
    ).catch(() => null),
  ]);

  const registryData: RegistryApiResponse | null = registryRes
    ? ((await registryRes.json()) as RegistryApiResponse)
    : null;

  const verifyData: VerifyApiResponse | null = verifyRes
    ? ((await verifyRes.json()) as VerifyApiResponse)
    : null;

  const scoreBreakdownData: ScoreBreakdownApiResponse | null = scoreBreakdownRes
    ? ((await scoreBreakdownRes.json()) as ScoreBreakdownApiResponse)
    : null;

  const row = registryData?.rows?.[0] ?? null;
  const record = verifyData?.record ?? null;

  if (!row && !record) {
    notFound();
  }

  const entityName = infoValue([record?.entityName, row?.entityName]);
  const entityType = infoValue([record?.entityType, row?.entityType]);
  const country = infoValue([record?.country, row?.country]);
  const applicationId = infoValue([record?.applicationId, row?.applicationId]);
  const caseId = infoValue([record?.caseId, row?.caseId]);
  const certifiedTier = infoValue([record?.certifiedTier, row?.certifiedTier]);
  const certifiedBand = infoValue([record?.certifiedBand, row?.certifiedBand]);
  const decisionStatus = infoValue([
    record?.decisionStatus,
    row?.decisionStatus,
  ]);
  const certifiedAtRaw =
    record?.certifiedAt ?? row?.certifiedAt ?? null;
  const validFromRaw =
    record?.validFrom ?? row?.validFrom ?? null;
  const validToRaw =
    record?.validTo ?? row?.validTo ?? null;

  const certifiedScore =
    record?.certifiedScore != null
      ? String(record.certifiedScore)
      : infoValue([row?.certifiedScore]);

  const certificationStatus = infoValue([
    record?.certificationStatus,
    certifiedAtRaw ? "Certified" : "Not Certified",
  ]);

  const dimensions: string[] = (scoreBreakdownData?.dimensions ?? [])
    .map((d: ScoreBreakdownDimension) => String(d.scoreDimension ?? "").trim())
    .filter(Boolean);

  const dimensionCount =
    scoreBreakdownData?.dimensionCount ?? dimensions.length ?? 0;

  const tierBand =
    certifiedTier !== "—" && certifiedBand !== "—"
      ? `${certifiedTier} · ${certifiedBand}`
      : certifiedTier !== "—"
      ? certifiedTier
      : certifiedBand !== "—"
      ? certifiedBand
      : "—";

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-200">
              Verified
            </span>

            {decisionStatus !== "—" ? (
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700 ring-1 ring-blue-200">
                {decisionStatus}
              </span>
            ) : null}
          </div>

          <div className="mt-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Canonical Public Trust Record
          </div>

          <h1 className="mt-4 text-[40px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
            {entityName}
          </h1>

          <p className="mt-4 max-w-[900px] text-[16px] leading-8 text-black/68">
            This page is the public certification record for this entity within
            the GAFAIG registry of record.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-5">
            <InfoCard label="Status" value={certificationStatus} />
            <InfoCard label="Tier / Band" value={tierBand} />
            <InfoCard label="Decision" value={decisionStatus} />
            <InfoCard label="Certified At" value={formatDate(certifiedAtRaw)} />
            <InfoCard label="Valid To" value={formatDate(validToRaw)} />
          </div>
        </section>

        <RegistryVerificationPanel
          registryId={registryId}
          entityName={entityName}
          verifyData={verifyData}
        />

        {dimensionCount > 0 ? (
          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/60">
              Public-Safe Trust Explanation
            </div>

            <h2 className="mt-4 text-[30px] font-semibold leading-[1.18] tracking-tight text-black">
              Reviewed across governance dimensions
            </h2>

            <p className="mt-3 max-w-[900px] text-[15px] leading-[1.8] text-black/68">
              GAFAIG publishes certification outcomes and high-level governance
              review scope without exposing private reviewer materials, internal
              evidence, control-by-control scoring logic, or controlled workflow
              details from the private verification engine.
            </p>

            <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                Review Scope
              </div>
              <div className="mt-2 text-[15px] font-medium text-black">
                Reviewed across {dimensionCount} governance dimensions
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {dimensions.map((d: string) => (
                <div
                  key={d}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                    Governance Dimension
                  </div>
                  <div className="mt-2 text-[15px] font-medium text-black">
                    {d}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="grid gap-3 md:grid-cols-4">
            <InfoCard label="Entity Type" value={entityType} />
            <InfoCard label="Country" value={country} />
            <InfoCard label="Application ID" value={applicationId} />
            <InfoCard label="Case ID" value={caseId} />
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <InfoCard label="Registry ID" value={registryId} />
            <InfoCard label="Certified Score" value={certifiedScore} />
            <InfoCard label="Valid From" value={formatDate(validFromRaw)} />
          </div>
        </section>

        <RegistryTrustTools
          registryId={registryId}
          entityName={entityName}
          absoluteRegistryUrl={`${baseUrl}/registry/${encodeURIComponent(
            registryId
          )}`}
          absoluteVerifyUrl={`${baseUrl}/api/verify/${encodeURIComponent(
            registryId
          )}`}
          absoluteBadgeUrl={`${baseUrl}/badge/${encodeURIComponent(registryId)}`}
        />
      </div>
    </main>
  );
}
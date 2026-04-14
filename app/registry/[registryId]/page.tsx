import Link from "next/link";
import { notFound } from "next/navigation";

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

function safe(value?: string | null): string {
  const s = String(value ?? "").trim();
  return s || "—";
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

function formatTierBand(tier?: string | null, band?: string | null): string {
  const safeTier = safe(tier);
  const safeBand = safe(band);
  if (safeTier !== "—" && safeBand !== "—") return `${safeTier} · ${safeBand}`;
  if (safeTier !== "—") return safeTier;
  if (safeBand !== "—") return safeBand;
  return "—";
}

function statusTone(value: string) {
  const v = value.trim().toUpperCase();
  if (v === "APPROVED") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v === "CERTIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function trustTone(kind: "verified" | "approved" | "pending") {
  if (kind === "verified") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (kind === "approved") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }
  return "bg-slate-100 text-slate-600 ring-slate-200";
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

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-[30px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-[980px] text-[15px] leading-[1.8] text-black/68">
          {description}
        </p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
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

  const entityName = safe(record?.entityName ?? row?.entityName);
  const entityType = safe(record?.entityType ?? row?.entityType);
  const country = safe(record?.country ?? row?.country);
  const applicationId = safe(record?.applicationId ?? row?.applicationId);
  const caseId = safe(record?.caseId ?? row?.caseId);

  const certifiedScore =
    record?.certifiedScore != null
      ? String(record.certifiedScore)
      : safe(row?.certifiedScore);

  const certifiedTier = safe(record?.certifiedTier ?? row?.certifiedTier);
  const certifiedBand = safe(record?.certifiedBand ?? row?.certifiedBand);
  const decisionStatus = safe(record?.decisionStatus ?? row?.decisionStatus);

  const certifiedAtRaw = record?.certifiedAt ?? row?.certifiedAt ?? null;
  const validFromRaw = record?.validFrom ?? row?.validFrom ?? null;
  const validToRaw = record?.validTo ?? row?.validTo ?? null;

  const isCertified = Boolean(String(certifiedAtRaw ?? "").trim());
  const isApprovedOnly =
    !isCertified && decisionStatus !== "—" && decisionStatus.toUpperCase() === "APPROVED";

  const dimensions: string[] = (scoreBreakdownData?.dimensions ?? [])
    .map((d) => String(d.scoreDimension ?? "").trim())
    .filter(Boolean);

  const dimensionCount =
    typeof scoreBreakdownData?.dimensionCount === "number"
      ? scoreBreakdownData.dimensionCount
      : dimensions.length;

  const tierBand = formatTierBand(
    certifiedTier === "—" ? null : certifiedTier,
    certifiedBand === "—" ? null : certifiedBand
  );

  const trustKind: "verified" | "approved" | "pending" = isCertified
    ? "verified"
    : isApprovedOnly
    ? "approved"
    : "pending";

  const trustLabel =
    trustKind === "verified"
      ? "Verified"
      : trustKind === "approved"
      ? "Approved"
      : "Pending";

  const headerEyebrow = isCertified
    ? "CANONICAL PUBLIC TRUST RECORD"
    : isApprovedOnly
    ? "APPROVED PUBLIC RECORD"
    : "PUBLIC EXPLORER RECORD";

  const headerDescription = isCertified
    ? "This page is the public certified record for this entity within the GAFAIG registry of record."
    : isApprovedOnly
    ? "This page is an approved public record surfaced through GAFAIG Explorer. It has passed governance review and public publication checks, but it does not represent a certified public outcome."
    : "This page is a public record surfaced through GAFAIG Explorer.";

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-20 pt-12 lg:px-10">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${trustTone(
                trustKind
              )}`}
            >
              {trustLabel}
            </span>

            {decisionStatus !== "—" ? (
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${statusTone(
                  decisionStatus
                )}`}
              >
                {decisionStatus}
              </span>
            ) : null}
          </div>

          <div className="mt-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            {headerEyebrow}
          </div>

          <h1 className="mt-3 text-[42px] font-semibold leading-[1.05] tracking-tight text-black md:text-[56px] xl:text-[64px]">
            {entityName}
          </h1>

          <p className="mt-4 max-w-[980px] text-[15px] leading-[1.8] text-black/68">
            {headerDescription}
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-5">
            <InfoCard
              label="Status"
              value={isCertified ? "Certified" : isApprovedOnly ? "Not Certified" : "Pending"}
            />
            <InfoCard label="Tier / Band" value={isCertified ? tierBand : "—"} />
            <InfoCard label="Decision" value={decisionStatus} />
            <InfoCard label="Certified At" value={isCertified ? formatDate(certifiedAtRaw) : "—"} />
            <InfoCard label="Valid To" value={formatDate(validToRaw)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {isApprovedOnly ? (
              <Link
                href="/explorer"
                className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                Back to explorer
              </Link>
            ) : null}

            <Link
              href={isApprovedOnly ? "/registry" : "/registry"}
              className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Back to registry
            </Link>
          </div>
        </section>

        {isCertified ? (
          <>
            <RegistryVerificationPanel
              registryId={registryId}
              entityName={entityName}
              verifyData={verifyData}
            />

            {dimensionCount > 0 ? (
              <Section
                eyebrow="PUBLIC-SAFE TRUST EXPLANATION"
                title="Reviewed across governance dimensions"
                description="GAFAIG publishes certification outcomes and high-level governance review scope without exposing private reviewer materials, internal evidence, certified-by-control scoring logic, or controlled workflow details from the private verification engine."
              >
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                    Review Scope
                  </div>
                  <div className="mt-2 text-[15px] font-medium text-black">
                    Reviewed across {dimensionCount} governance dimensions
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {dimensions.map((dimension) => (
                    <div
                      key={dimension}
                      className="rounded-2xl border border-black/10 bg-black/[0.02] p-5"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Governance Dimension
                      </div>
                      <div className="mt-2 text-[15px] font-medium text-black">
                        {dimension}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            ) : null}

            <Section
              eyebrow="PUBLIC RECORD METADATA"
              title="Registry metadata"
              description="Public metadata is surfaced to support verifiability, record lookup, and high-level public trust review."
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <InfoCard label="Entity Type" value={entityType} />
                <InfoCard label="Country" value={country} />
                <InfoCard label="Application ID" value={applicationId} />
                <InfoCard label="Case ID" value={caseId} />
                <InfoCard label="Registry ID" value={registryId} />
                <InfoCard label="Certified Score" value={certifiedScore} />
                <InfoCard label="Valid From" value={formatDate(validFromRaw)} />
                <InfoCard label="Valid To" value={formatDate(validToRaw)} />
              </div>
            </Section>

            <RegistryTrustTools
              registryId={registryId}
              entityName={entityName}
              absoluteRegistryUrl={`${baseUrl}/registry/${encodeURIComponent(registryId)}`}
              absoluteVerifyUrl={`${baseUrl}/api/verify/${encodeURIComponent(registryId)}`}
              absoluteBadgeUrl={`${baseUrl}/badge/${encodeURIComponent(registryId)}`}
            />
          </>
        ) : (
          <>
            <Section
              eyebrow="PUBLIC-SAFE TRUST EXPLANATION"
              title="Public-safe governance review scope"
              description="This approved public record may disclose limited public-safe governance review scope without exposing private reviewer materials, internal evidence, control-by-control governance logic, or controlled workflow details from the private verification engine."
            >
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  Review Scope
                </div>
                <div className="mt-2 text-[15px] font-medium text-black">
                  {dimensionCount > 0
                    ? `Reviewed across ${dimensionCount} governance dimensions`
                    : "Public-safe review scope available"}
                </div>
              </div>

              {dimensions.length > 0 ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {dimensions.map((dimension) => (
                    <div
                      key={dimension}
                      className="rounded-2xl border border-black/10 bg-black/[0.02] p-5"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Governance Dimension
                      </div>
                      <div className="mt-2 text-[15px] font-medium text-black">
                        {dimension}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Section>

            <Section
              eyebrow="PUBLIC RECORD METADATA"
              title="Approved public record metadata"
              description="This page surfaces approved public metadata and governance review scope. It does not claim a certified public outcome."
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <InfoCard label="Entity Type" value={entityType} />
                <InfoCard label="Country" value={country} />
                <InfoCard label="Application ID" value={applicationId} />
                <InfoCard label="Case ID" value={caseId} />
                <InfoCard label="Registry ID" value={registryId} />
                <InfoCard label="Certified Score" value="—" />
                <InfoCard label="Valid From" value={formatDate(validFromRaw)} />
                <InfoCard label="Valid To" value={formatDate(validToRaw)} />
              </div>
            </Section>
          </>
        )}
      </div>
    </main>
  );
}
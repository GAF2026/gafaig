import { notFound } from "next/navigation";
import Link from "next/link";

import PublicButtonLink from "@/app/_components/PublicButtonLink";

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

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  );
}

function infoValue(values: Array<string | null | undefined>): string {
  for (const value of values) {
    const s = String(value ?? "").trim();
    if (s) return s;
  }
  return "—";
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
  const safeTier = String(tier ?? "").trim();
  const safeBand = String(band ?? "").trim();

  if (safeTier && safeBand) return `${safeTier} · ${safeBand}`;
  if (safeTier) return safeTier;
  if (safeBand) return safeBand;
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
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[15px] font-medium leading-[1.6] text-black">
        {value}
      </div>
    </div>
  );
}

export default async function BadgePage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId || "").trim();
  if (!registryId) notFound();

  const baseUrl = getBaseUrl();

  const [registryRes, verifyRes] = await Promise.all([
    fetch(`${baseUrl}/api/registry?registryId=${encodeURIComponent(registryId)}`, {
      cache: "no-store",
    }).catch(() => null),
    fetch(`${baseUrl}/api/verify/${encodeURIComponent(registryId)}`, {
      cache: "no-store",
    }).catch(() => null),
  ]);

  const registryData: RegistryApiResponse | null = registryRes
    ? ((await registryRes.json()) as RegistryApiResponse)
    : null;

  const verifyData: VerifyApiResponse | null = verifyRes
    ? ((await verifyRes.json()) as VerifyApiResponse)
    : null;

  const row = registryData?.rows?.[0] ?? null;
  const record = verifyData?.record ?? null;

  if (!row && !record) {
    notFound();
  }

  const entityName = infoValue([record?.entityName, row?.entityName]);
  const entityType = infoValue([record?.entityType, row?.entityType]);
  const country = infoValue([record?.country, row?.country]);
  const certifiedTier = infoValue([record?.certifiedTier, row?.certifiedTier]);
  const certifiedBand = infoValue([record?.certifiedBand, row?.certifiedBand]);
  const decisionStatus = infoValue([record?.decisionStatus, row?.decisionStatus]);
  const certificationStatus = infoValue([
    record?.certificationStatus,
    row?.certifiedAt ? "Certified" : null,
  ]);
  const validTo = formatDate(record?.validTo ?? row?.validTo ?? null);
  const verifyPath = `/api/verify/${encodeURIComponent(registryId)}`;
  const registryPath = `/registry/${encodeURIComponent(registryId)}`;
  const tierBand = formatTierBand(
    certifiedTier === "—" ? null : certifiedTier,
    certifiedBand === "—" ? null : certifiedBand
  );

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            LIVE TRUST BADGE PREVIEW
          </div>

          <h1 className="mt-4 text-[40px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
            Portable public certification badge
          </h1>

          <p className="mt-4 max-w-[900px] text-[16px] leading-8 text-black/68">
            This page renders the same portable public certification badge used across GAFAIG public trust surfaces so organizations can preview what external users will see.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href={registryPath} variant="primary">
              Open Certification Record
            </PublicButtonLink>

            <PublicButtonLink href={verifyPath} variant="secondary">
              Open Verification Proof
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)] lg:items-start">
            <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              <div className="h-1 rounded-full bg-emerald-500" />

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/50">
                    GAFAIG Public Certification Badge
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-200">
                      {certificationStatus}
                    </span>

                    {decisionStatus !== "—" ? (
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700 ring-1 ring-blue-200">
                        {decisionStatus}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-200">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-[34px] font-semibold leading-[1.08] tracking-tight text-black">
                  {entityName}
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-black/62">
                  Public certification record issued through GAFAIG public trust infrastructure.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_0.9fr]">
                <InfoCard label="Registry ID" value={registryId} />
                <InfoCard label="Country" value={country} />
                <InfoCard label="Tier / Band" value={tierBand} />
                <InfoCard label="Valid To" value={validTo} />
              </div>

              <div className="mt-4 rounded-2xl bg-[#071a49] px-5 py-4 text-white">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  Verification Surface Endpoint
                </div>
                <div className="mt-2 break-all text-[13px] leading-6 text-white">
                  {`${baseUrl}${verifyPath}`}
                </div>
              </div>

              <div className="mt-4 text-[12px] leading-6 text-black/45">
                Issued via GAFAIG deterministic public trust infrastructure. Private review materials are not disclosed.
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  Entity
                </div>
                <div className="mt-2 text-[20px] font-semibold text-black">
                  {entityName}
                </div>
                <div className="mt-2 text-[14px] text-black/60">
                  {entityType} · {country}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard label="Status" value={certificationStatus} />
                <InfoCard label="Decision" value={decisionStatus} />
                <InfoCard label="Tier / Band" value={tierBand} />
                <InfoCard label="Valid To" value={validTo} />
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  Badge Embed URL
                </div>
                <div className="mt-2 break-all text-[14px] leading-7 text-black/72">
                  {`${baseUrl}/badge/${encodeURIComponent(registryId)}`}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  Portable Public Trust Widget
                </div>
                <div className="mt-2 break-all text-[14px] leading-7 text-black/72">
                  {`${baseUrl}/widget-preview/${encodeURIComponent(registryId)}`}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <PublicButtonLink
                    href={`/widget-preview/${encodeURIComponent(registryId)}`}
                    variant="secondary"
                    size="sm"
                  >
                    Open Public Trust Widget
                  </PublicButtonLink>

                  <PublicButtonLink
                    href={registryPath}
                    variant="secondary"
                    size="sm"
                  >
                    Open Certification Record
                  </PublicButtonLink>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  Portable Public Badge Embed
                </div>

                <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/[0.03] p-4 text-[12px] leading-6 text-black/70">
{`<img
  src="${baseUrl}/badge/${registryId}"
  alt="GAFAIG certification badge for ${entityName}"
/>`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PUBLIC TRUST DISTRIBUTION
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Embed this certification record anywhere
          </h2>

          <p className="mt-3 max-w-[900px] text-[15px] leading-[1.8] text-black/68">
            The same portable public certification badge can be used in websites, procurement documents, product pages, and other external trust surfaces without exposing private evidence or controlled reviewer workflow details.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <InfoCard label="Registry ID" value={registryId} />
            <InfoCard label="Certification Record" value={`${baseUrl}${registryPath}`} />
            <InfoCard label="Signed Proof JSON" value={`${baseUrl}${verifyPath}`} />
          </div>
        </section>
      </div>
    </main>
  );
}
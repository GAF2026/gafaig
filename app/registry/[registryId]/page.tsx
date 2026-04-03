import Link from "next/link";
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
    certifiedTier?: string | null;
    certifiedBand?: string | null;
    decisionStatus?: string | null;
    certifiedAt?: string | null;
    validFrom?: string | null;
    validTo?: string | null;
  };
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

export default async function RegistryRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId || "").trim();

  if (!registryId) {
    notFound();
  }

  const [registryData, verifyData] = await Promise.all([
    getRegistryData(registryId),
    getVerifyData(registryId),
  ]);

  const row = registryData?.rows?.[0] ?? null;
  const record = verifyData?.record ?? null;

  const entityName = record?.entityName || row?.entityName || "Unknown Entity";

  const entityType = record?.entityType || row?.entityType || null;
  const country = record?.country || row?.country || null;
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
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[32px] border border-black/10 bg-white p-10 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
            Registry
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            Registry record not found
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-black/65">
            We could not find a public GAFAIG registry record for this ID.
          </p>
          <div className="mt-8">
            <Link
              href="/registry"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Back to registry
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <header className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm md:p-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
          Canonical public trust record
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black md:text-6xl">
          {entityName}
        </h1>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/72">
          This page is the public certification record for this entity within
          the GAFAIG registry of record.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
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
        </div>

        <div className="mt-6 text-sm text-black/70">
          Want to independently verify this certification?{" "}
          <Link
            href="/verify"
            className="font-semibold underline underline-offset-4 hover:opacity-70"
          >
            Learn how verification works →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <InfoCard label="Status" value={certificationStatus} />
          <InfoCard
            label="Tier / Band"
            value={[certifiedTier, certifiedBand].filter(Boolean).join(" · ") || "—"}
          />
          <InfoCard label="Decision" value={decisionStatus || "—"} />
          <InfoCard label="Valid To" value={validTo || "—"} />
        </div>
      </header>

      <div className="mt-8 space-y-8">
        <RegistryVerificationPanel
          registryId={registryId}
          entityName={entityName}
          verifyData={verifyData}
        />

        <RegistryTrustTools
          registryId={registryId}
          entityName={entityName}
          absoluteRegistryUrl={absoluteRegistryUrl}
          absoluteVerifyUrl={absoluteVerifyUrl}
          absoluteBadgeUrl={absoluteBadgeUrl}
        />
      </div>
    </main>
  );
}

function IntroCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[18px] font-semibold">{title}</div>
      <p className="mt-2 text-sm text-black/70">{body}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-white p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
        {label}
      </div>
      <div className="mt-3 text-base font-semibold text-black">{value}</div>
    </div>
  );
}
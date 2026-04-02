import Link from "next/link";
import { notFound } from "next/navigation";

import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";
import RegistryTrustTools from "@/components/registry/RegistryTrustTools";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RegistryApiResult = {
  registryId?: string;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
  certifiedAt?: string | null;
  validTo?: string | null;
};

type RegistryApiResponse = {
  ok?: boolean;
  count?: number;
  results?: RegistryApiResult[];
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

  const row = registryData?.results?.[0] ?? null;
  const entityName =
    row?.entityName ||
    verifyData?.record?.entityName ||
    "Unknown Entity";

  const entityType =
    row?.entityType ||
    verifyData?.record?.entityType ||
    null;

  const country =
    row?.country ||
    verifyData?.record?.country ||
    null;

  const certifiedTier =
    row?.certifiedTier ||
    verifyData?.record?.certifiedTier ||
    null;

  const certifiedBand =
    row?.certifiedBand ||
    verifyData?.record?.certifiedBand ||
    null;

  const decisionStatus =
    row?.decisionStatus ||
    verifyData?.record?.decisionStatus ||
    null;

  const certifiedAt =
    row?.certifiedAt ||
    verifyData?.record?.certifiedAt ||
    null;

  const validTo =
    row?.validTo ||
    verifyData?.record?.validTo ||
    null;

  const certificationStatus =
    verifyData?.record?.certificationStatus ||
    (certifiedAt ? "Certified" : "Not Certified");

  const baseUrl = getBaseUrl();
  const absoluteRegistryUrl = `${baseUrl}/registry/${encodeURIComponent(
    registryId
  )}`;
  const absoluteVerifyUrl = `${baseUrl}/api/verify/${encodeURIComponent(
    registryId
  )}`;
  const absoluteBadgeUrl = `${baseUrl}/badge/${encodeURIComponent(registryId)}`;

  if (!row && !verifyData?.record) {
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
          the GAFAIG registry of record. It is designed to function as a
          canonical trust surface: a public record that can be inspected by
          people, verified programmatically, and distributed across the web
          through badges, QR-linked verification, and embeddable trust tools.
        </p>

        <p className="mt-4 max-w-[980px] text-[15px] leading-[1.8] text-black/68">
          Private evidence, findings, and review workflow remain inside the
          controlled verification engine. What appears here is the public
          certification layer that external parties can rely on without access
          to internal reviewer materials.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <RecordPill value={certificationStatus} strong />
          {entityType ? <RecordPill value={entityType} /> : null}
          {country ? <RecordPill value={country} /> : null}
          {certifiedTier || certifiedBand ? (
            <RecordPill value={[certifiedTier, certifiedBand].filter(Boolean).join(" · ")} />
          ) : null}
          {decisionStatus ? <RecordPill value={decisionStatus} /> : null}
          {validTo ? (
            <RecordPill value={`Valid to ${new Date(validTo).toLocaleDateString()}`} />
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <IntroCard
            title="Public record of certification"
            body="This page presents the disclosed certification status, timing, and trust signals associated with this registry ID."
          />
          <IntroCard
            title="Programmatically verifiable"
            body="The same record can be checked through GAFAIG’s verification endpoint and signed public proof surface."
          />
          <IntroCard
            title="Portable across the web"
            body="Badge, widget, verify button, and QR-linked trust tools allow this certification to travel while resolving back to the same canonical record."
          />
        </div>
      </header>

      <section className="mt-8 rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
          Verification & trust infrastructure
        </div>

        <h2 className="mt-4 text-[32px] font-semibold leading-[1.12] tracking-tight text-black md:text-[42px]">
          Public trust for this certification is supported by multiple verification surfaces
        </h2>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
          This registry record is not only a page view. It is part of GAFAIG’s
          broader trust infrastructure layer. The certification can resolve into
          a signed proof payload, a verification endpoint, a public badge, QR
          verification, and embeddable trust surfaces that allow third parties
          to validate governance status independently.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <InfrastructureCard
            title="Signed proof layer"
            body="This record can be expressed as a signed public payload that supports external validation against GAFAIG’s published verification key."
          />
          <InfrastructureCard
            title="Verification endpoint"
            body="The public verify JSON surface provides a programmatic trust layer for independent checks, integrations, and audits."
          />
          <InfrastructureCard
            title="Badge and QR verification"
            body="This certification can be distributed through a public badge and QR-linked verification path while preserving a canonical resolution back to the registry."
          />
          <InfrastructureCard
            title="Portable trust surfaces"
            body="Widgets, verify buttons, and embed tools allow this certification to appear beyond the GAFAIG site without losing verifiability."
          />
        </div>
      </section>

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

      {(certifiedAt || validTo) && (
        <section className="mt-8 rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
            Record timing
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                Certified at
              </div>
              <div className="mt-3 text-lg font-medium text-black">
                {certifiedAt ? new Date(certifiedAt).toLocaleString() : "—"}
              </div>
            </div>

            <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                Valid to
              </div>
              <div className="mt-3 text-lg font-medium text-black">
                {validTo ? new Date(validTo).toLocaleString() : "—"}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function RecordPill({
  value,
  strong = false,
}: {
  value: string;
  strong?: boolean;
}) {
  const classes = strong
    ? "border-black bg-black text-white"
    : "border-black/10 text-black/70";

  return (
    <span
      className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium ${classes}`}
    >
      {value}
    </span>
  );
}

function IntroCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function InfrastructureCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

export const dynamic = "force-dynamic";

type VerifyResponse = {
  ok: boolean;
  verified: boolean;
  registryId: string;
  proof?: {
    alg: string;
    signature: string;
    signedAt: string;
    message?: {
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
      signedAt?: string | null;
    };
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

type TrustSummary = {
  entityName: string;
  entityType: string;
  country: string;
  applicationId: string;
  caseId: string;
  certificationStatusRaw: string | null;
  certifiedScoreRaw: number | null;
  certifiedTierRaw: string | null;
  certifiedBandRaw: string | null;
  decisionStatusRaw: string | null;
  certifiedAtRaw: string | null;
  validFromRaw: string | null;
  validToRaw: string | null;
};

async function getVerification(registryId: string): Promise<VerifyResponse | null> {
  try {
    const h = headers();
    const host = h.get("host");
    const proto = process.env.NODE_ENV === "development" ? "http" : "https";

    if (!host) return null;

    const res = await fetch(`${proto}://${host}/api/verify/${registryId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatScore(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

function displayText(value?: string | null, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function trustSummary(data: VerifyResponse): TrustSummary {
  const record = data.record;
  const proofMessage = data.proof?.message;

  return {
    entityName: displayText(record?.entityName ?? proofMessage?.entityName ?? data.registryId, data.registryId),
    entityType: displayText(record?.entityType ?? proofMessage?.entityType, "Organization"),
    country: displayText(record?.country ?? proofMessage?.country, "—"),
    applicationId: displayText(record?.applicationId ?? proofMessage?.applicationId, "—"),
    caseId: displayText(record?.caseId ?? proofMessage?.caseId, "—"),
    certificationStatusRaw: record?.certificationStatus ?? proofMessage?.certificationStatus ?? null,
    certifiedScoreRaw: record?.certifiedScore ?? proofMessage?.certifiedScore ?? null,
    certifiedTierRaw: record?.certifiedTier ?? proofMessage?.certifiedTier ?? null,
    certifiedBandRaw: record?.certifiedBand ?? proofMessage?.certifiedBand ?? null,
    decisionStatusRaw: record?.decisionStatus ?? proofMessage?.decisionStatus ?? null,
    certifiedAtRaw: record?.certifiedAt ?? proofMessage?.certifiedAt ?? null,
    validFromRaw: record?.validFrom ?? proofMessage?.validFrom ?? null,
    validToRaw: record?.validTo ?? proofMessage?.validTo ?? null,
  };
}

function getTrustState(certifiedAt?: string | null, decisionStatus?: string | null, certificationStatus?: string | null) {
  const certified = String(certifiedAt ?? "").trim();
  const decision = String(decisionStatus ?? "").trim().toUpperCase();
  const contractStatus = String(certificationStatus ?? "").trim().toUpperCase();

  if (certified) return { label: "Certified", description: "Trusted + published" };
  if (contractStatus === "APPROVED" || decision === "APPROVED") return { label: "Approved", description: "Evaluated" };
  return { label: "Pending", description: "Not finalized" };
}

export default async function VerifyPage({ params }: { params: { registryId: string } }) {
  const data = await getVerification(params.registryId);
  if (!data) notFound();

  const verified = !!data.verified;
  const summary = trustSummary(data);
  const trust = getTrustState(summary.certifiedAtRaw, summary.decisionStatusRaw, summary.certificationStatusRaw);

  const shortSignature = data.proof?.signature
    ? `${data.proof.signature.slice(0, 18)}…${data.proof.signature.slice(-18)}`
    : "—";

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          VERIFICATION
        </div>

        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[760px]">
            <h1 className="text-[36px] font-semibold tracking-tight text-black md:text-[52px]">
              {verified ? "Verified Record" : "Verification Failed"}
            </h1>

            <p className="mt-5 text-[17px] text-black/72">
              This page confirms whether the public GAFAIG record matches the signed verification payload.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <StatusPill verified={verified} />
              <NeutralPill>{trust.label}</NeutralPill>
              <NeutralPill>{displayText(summary.decisionStatusRaw)}</NeutralPill>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <PublicButtonLink href={`/verify/${encodeURIComponent(data.registryId)}`} variant="primary">
                View verification record
              </PublicButtonLink>

              <PublicButtonLink href={`/registry/${encodeURIComponent(data.registryId)}`} variant="secondary">
                View registry record
              </PublicButtonLink>

              <PublicButtonLink href={`/api/verify/${encodeURIComponent(data.registryId)}`} variant="secondary">
                Open raw API proof
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Browse registry
              </PublicButtonLink>
            </div>
          </div>

          <div className="w-full max-w-[280px] rounded-2xl border border-black/10 p-5">
            <div className="text-[11px] uppercase text-black/50">Trust state</div>
            <div className="mt-3 text-[28px] font-semibold">{verified ? "Valid" : "Invalid"}</div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusPill({ verified }: { verified: boolean }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
      verified ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
    }`}>
      {verified ? "Verified" : "Invalid"}
    </span>
  );
}

function NeutralPill({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-black/10 px-2.5 py-1 text-[11px]">
      {children}
    </span>
  );
}
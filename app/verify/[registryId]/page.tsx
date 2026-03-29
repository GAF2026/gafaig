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
      entityName?: string;
      entityType?: string;
      country?: string;
      applicationId?: string;
      caseId?: string;
      certificationStatus?: string;
      certifiedScore?: number;
      certifiedTier?: string;
      certifiedBand?: string;
      decisionStatus?: string;
      certifiedAt?: string;
      validFrom?: string;
      validTo?: string;
      signedAt?: string;
    };
  };
  record?: {
    registryId?: string;
    entityName?: string;
    entityType?: string;
    country?: string;
    applicationId?: string;
    caseId?: string;
    certificationStatus?: string;
    certifiedScore?: number;
    certifiedTier?: string;
    certifiedBand?: string;
    decisionStatus?: string;
    certifiedAt?: string;
    validFrom?: string;
    validTo?: string;
  };
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

function trustSummary(data: VerifyResponse) {
  const record = data.record;
  const proofMessage = data.proof?.message;

  return {
    entityName: record?.entityName || proofMessage?.entityName || data.registryId,
    entityType: record?.entityType || proofMessage?.entityType || "Organization",
    country: record?.country || proofMessage?.country || "—",
    applicationId: record?.applicationId || proofMessage?.applicationId || "—",
    caseId: record?.caseId || proofMessage?.caseId || "—",
    certificationStatus:
      record?.certificationStatus || proofMessage?.certificationStatus || "—",
    certifiedScore:
      record?.certifiedScore ?? proofMessage?.certifiedScore ?? null,
    certifiedTier: record?.certifiedTier || proofMessage?.certifiedTier || "—",
    certifiedBand: record?.certifiedBand || proofMessage?.certifiedBand || "—",
    decisionStatus: record?.decisionStatus || proofMessage?.decisionStatus || "—",
    certifiedAt: record?.certifiedAt || proofMessage?.certifiedAt || "—",
    validFrom: record?.validFrom || proofMessage?.validFrom || "—",
    validTo: record?.validTo || proofMessage?.validTo || "—",
  };
}

export default async function VerifyPage({
  params,
}: {
  params: { registryId: string };
}) {
  const data = await getVerification(params.registryId);

  if (!data) notFound();

  const verified = !!data.verified;
  const summary = trustSummary(data);
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
            <h1 className="text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
              {verified ? "Verified Certification" : "Verification Failed"}
            </h1>

            <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
              This page confirms whether the public GAFAIG certification record
              matches the signed verification payload generated from the registry
              trust layer.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StatusPill verified={verified} />
              <NeutralPill>{summary.certificationStatus}</NeutralPill>
              <NeutralPill>{summary.decisionStatus}</NeutralPill>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <PublicButtonLink
                href={`/registry/${encodeURIComponent(data.registryId)}`}
                variant="primary"
              >
                View registry record
              </PublicButtonLink>

              <PublicButtonLink
                href={`/api/verify/${encodeURIComponent(data.registryId)}`}
                variant="secondary"
              >
                Open raw API proof
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Browse registry
              </PublicButtonLink>
            </div>
          </div>

          <div className="w-full max-w-[280px] rounded-2xl border border-black/10 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
              Trust state
            </div>
            <div className="mt-3 text-[28px] font-semibold text-black">
              {verified ? "Valid" : "Invalid"}
            </div>
            <div className="mt-2 text-[14px] leading-[1.7] text-black/65">
              {verified
                ? "The signed proof and public certification record are aligned."
                : "The certification could not be confirmed from the verification payload."}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Registry ID" value={data.registryId} />
        <MetricCard label="Certified score" value={formatScore(summary.certifiedScore)} />
        <MetricCard
          label="Tier / Band"
          value={`${summary.certifiedTier} · ${summary.certifiedBand}`}
        />
        <MetricCard label="Country" value={summary.country} />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            CERTIFICATION RECORD
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public trust summary
          </h2>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <Info label="Entity name" value={summary.entityName} />
            <Info label="Entity type" value={summary.entityType} />
            <Info label="Certification status" value={summary.certificationStatus} />
            <Info label="Decision status" value={summary.decisionStatus} />
            <Info label="Application ID" value={summary.applicationId} />
            <Info label="Case ID" value={summary.caseId} />
            <Info label="Certified at" value={formatDate(summary.certifiedAt)} />
            <Info label="Valid from" value={formatDate(summary.validFrom)} />
            <Info label="Valid to" value={formatDate(summary.validTo)} />
            <Info label="Tier" value={summary.certifiedTier} />
            <Info label="Band" value={summary.certifiedBand} />
            <Info label="Certified score" value={formatScore(summary.certifiedScore)} />
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              CRYPTOGRAPHIC PROOF
            </div>

            <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-black md:text-[34px]">
              Signed verification payload
            </h2>

            <div className="mt-6 grid gap-3">
              <Info label="Algorithm" value={data.proof?.alg || "—"} />
              <Info label="Signed at" value={formatDate(data.proof?.signedAt)} />
              <Info label="Signature" value={shortSignature} />
            </div>

            <p className="mt-6 text-[14px] leading-[1.8] text-black/70">
              GAFAIG generates a signed public payload linked to the registry record.
              This lets external parties confirm that the published certification is
              tied to a stable trust artifact rather than an unverifiable claim.
            </p>
          </section>

          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              WHAT THIS MEANS
            </div>

            <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-black md:text-[34px]">
              Verification interpretation
            </h2>

            <div className="mt-6 grid gap-4">
              <ExplainCard
                title="Registry-backed"
                body="The public certification is tied to a canonical GAFAIG registry record."
              />
              <ExplainCard
                title="Signed proof"
                body="The verification layer returns a signed payload rather than an unstructured assertion."
              />
              <ExplainCard
                title="Externally checkable"
                body="Auditors, partners, and the public can inspect the same trust output that supports the certification."
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </div>
      <div className="mt-2 break-all text-[22px] font-semibold text-black">
        {value || "—"}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 break-words text-[14px] text-black/85">{value || "—"}</div>
    </div>
  );
}

function ExplainCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[18px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.75] text-black/70">{body}</p>
    </div>
  );
}

function StatusPill({ verified }: { verified: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
        verified
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {verified ? "Verified" : "Invalid"}
    </span>
  );
}

function NeutralPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/65">
      {children}
    </span>
  );
}
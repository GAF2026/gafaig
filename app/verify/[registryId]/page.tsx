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
  };
  record?: {
    entityName?: string;
    certificationStatus?: string;
    certifiedScore?: number;
    certifiedTier?: string;
    certifiedBand?: string;
    certifiedAt?: string;
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

export default async function VerifyPage({
  params,
}: {
  params: { registryId: string };
}) {
  const data = await getVerification(params.registryId);

  if (!data) {
    notFound();
  }

  const isValid = !!data.verified;
  const record = data.record;
  const proof = data.proof;

  return (
    <main className="mx-auto max-w-[900px] px-6 py-16">
      <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          VERIFICATION
        </div>

        <h1 className="mt-4 text-[36px] font-semibold tracking-tight text-black md:text-[48px]">
          {isValid ? "Verified Certification" : "Verification Failed"}
        </h1>

        <div className="mt-6 flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${isValid ? "bg-emerald-500" : "bg-red-500"}`}
          />
          <div className="text-[18px] text-black/85">
            {isValid
              ? "This certification is valid and cryptographically verified."
              : "This certification could not be verified."}
          </div>
        </div>

        {record ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6">
            <div className="text-[24px] font-semibold text-black">
              {record.entityName || data.registryId}
            </div>

            <div className="mt-2 text-[15px] text-black/65">
              {(record.certificationStatus || "—")} · Band {record.certifiedBand || "—"} · Score{" "}
              {record.certifiedScore ?? "—"}/100
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Info label="Certified At" value={record.certifiedAt || "—"} />
              <Info label="Valid To" value={record.validTo || "—"} />
              <Info label="Tier" value={record.certifiedTier || "—"} />
              <Info label="Status" value={record.certificationStatus || "—"} />
            </div>
          </div>
        ) : null}

        {proof ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Cryptographic Proof
            </div>

            <div className="mt-3 text-[14px] text-black/70">
              This certification is signed using {proof.alg}.
            </div>

            <div className="mt-4 break-all text-[12px] text-black/50">
              Signature: {proof.signature}
            </div>

            <div className="mt-2 text-[12px] text-black/50">
              Signed at: {proof.signedAt}
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <PublicButtonLink href={`/registry/${data.registryId}`} variant="primary">
            View registry record
          </PublicButtonLink>

          <PublicButtonLink href="/registry" variant="secondary">
            Browse registry
          </PublicButtonLink>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
        {label}
      </div>
      <div className="mt-1 text-[14px] text-black/85">{value}</div>
    </div>
  );
}
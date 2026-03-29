import { notFound } from "next/navigation";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

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
    entityName: string;
    certificationStatus: string;
    certifiedScore: number;
    certifiedTier: string;
    certifiedBand: string;
    certifiedAt: string;
    validTo: string;
  };
};

async function getVerification(registryId: string): Promise<VerifyResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${registryId}`,
      { cache: "no-store" }
    );

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

  if (!data) return notFound();

  const isValid = data.verified;

  return (
    <main className="mx-auto max-w-[900px] px-6 py-16">
      <section className="rounded-3xl border border-black/10 bg-white p-10">
        <div className="text-[13px] uppercase tracking-[0.22em] text-black/60 font-semibold">
          VERIFICATION
        </div>

        <h1 className="mt-4 text-[40px] font-semibold tracking-tight">
          {isValid ? "Verified Certification" : "Verification Failed"}
        </h1>

        <div className="mt-6 flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              isValid ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          <div className="text-[18px]">
            {isValid
              ? "This certification is valid and cryptographically verified."
              : "This certification could not be verified."}
          </div>
        </div>

        {data.record && (
          <div className="mt-8 rounded-2xl border border-black/10 p-6">
            <div className="text-[22px] font-semibold">
              {data.record.entityName}
            </div>

            <div className="mt-2 text-black/60">
              Certified · Band {data.record.certifiedBand} · Score{" "}
              {data.record.certifiedScore}/100
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Info label="Certified At" value={data.record.certifiedAt} />
              <Info label="Valid To" value={data.record.validTo} />
              <Info label="Tier" value={data.record.certifiedTier} />
              <Info label="Status" value={data.record.certificationStatus} />
            </div>
          </div>
        )}

        {data.proof && (
          <div className="mt-8 rounded-2xl border border-black/10 p-6">
            <div className="text-sm font-semibold uppercase text-black/60">
              Cryptographic Proof
            </div>

            <div className="mt-3 text-sm text-black/70">
              This certification is signed using {data.proof.alg}.
            </div>

            <div className="mt-3 break-all text-xs text-black/50">
              Signature: {data.proof.signature}
            </div>

            <div className="mt-2 text-xs text-black/50">
              Signed at: {data.proof.signedAt}
            </div>
          </div>
        )}

        <div className="mt-10 flex gap-3">
          <PublicButtonLink
            href={`/registry/${data.registryId}`}
            variant="primary"
          >
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
      <div className="text-xs uppercase text-black/50">{label}</div>
      <div className="mt-1 text-sm">{value || "—"}</div>
    </div>
  );
}
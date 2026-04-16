export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { notFound } from "next/navigation";

type VerifyData = {
  registryId?: string;
  entityName?: string;
  decisionStatus?: string;
  certifiedTier?: string;
  certifiedBand?: string;
  certifiedAt?: string;
  validFrom?: string;
  validTo?: string;
  signature?: string;
  signedAt?: string;
  verificationKeyUrl?: string;
  signedMessageString?: string;
};

function safe(v?: string | null) {
  return (v || "").trim() || "—";
}

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US");
}

function pillTone(value: string) {
  const v = value.toUpperCase();

  if (v === "CERTIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "APPROVED") return "bg-blue-50 text-blue-700 ring-blue-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
        {label}
      </div>
      <div className="mt-2 text-[15px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

async function getVerify(registryId: string): Promise<VerifyData | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${registryId}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function VerifyPage({
  params,
}: {
  params: { registryId: string };
}) {
  const data = await getVerify(params.registryId);

  if (!data) return notFound();

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">

          <div className="flex gap-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Verified
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${pillTone(
                safe(data.decisionStatus)
              )}`}
            >
              {safe(data.decisionStatus)}
            </span>
          </div>

          <h1 className="mt-4 text-[42px] font-semibold tracking-tight text-black">
            {safe(data.entityName)}
          </h1>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <InfoCard label="Certification" value={`${safe(data.certifiedTier)} ${safe(data.certifiedBand)}`} />
            <InfoCard label="Certified" value={formatDate(data.certifiedAt)} />
            <InfoCard label="Valid From" value={formatDate(data.validFrom)} />
            <InfoCard label="Valid To" value={formatDate(data.validTo)} />
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/registry/${params.registryId}`}
              className="inline-flex rounded-full border border-black/20 px-5 py-2 text-sm font-semibold"
            >
              View Registry Record
            </Link>

            <Link
              href="/explorer"
              className="inline-flex rounded-full border border-black/20 px-5 py-2 text-sm font-semibold"
            >
              Back to Explorer
            </Link>
          </div>
        </section>

        {/* VERIFICATION DETAILS */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[22px] font-semibold">
            Verification details
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <InfoCard label="Registry ID" value={safe(data.registryId)} />
            <InfoCard label="Signed At" value={formatDate(data.signedAt)} />
            <InfoCard label="Signature" value={safe(data.signature)} />
          </div>
        </section>

        {/* SIGNED PAYLOAD */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[22px] font-semibold">
            Signed payload
          </h2>

          <div className="mt-4 rounded-2xl border border-black/10 bg-neutral-50 p-4 overflow-x-auto text-sm">
            <pre className="whitespace-pre-wrap">
              {safe(data.signedMessageString)}
            </pre>
          </div>
        </section>

      </div>
    </main>
  );
}
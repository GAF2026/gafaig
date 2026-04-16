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

function formatDateTime(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString("en-US");
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
      <div className="mt-2 break-words text-[15px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

async function getVerify(registryId: string): Promise<VerifyData | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/verify/${registryId}`, {
    cache: "no-store",
  });

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

          <div className="mt-4 max-w-4xl text-base leading-7 text-black/70">
            This page verifies the public GAFAIG trust record for this registry
            entry. It shows the public certification window and the signing
            surface used for trust verification.
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <InfoCard
              label="Certification"
              value={`${safe(data.certifiedTier)} ${safe(data.certifiedBand)}`.trim()}
            />
            <InfoCard label="Certified" value={formatDate(data.certifiedAt)} />
            <InfoCard label="Valid From" value={formatDate(data.validFrom)} />
            <InfoCard label="Valid To" value={formatDate(data.validTo)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/registry/${params.registryId}`}
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              View Registry Record
            </Link>

            <Link
              href="/explorer"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              Back to Explorer
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Trust verification
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Verification details
            </h2>
            <p className="max-w-3xl text-base leading-7 text-black/70">
              These fields identify the public record, signing time, key
              reference, and signature surface used to verify the trust payload.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Registry ID" value={safe(data.registryId)} />
            <InfoCard label="Signed At" value={formatDateTime(data.signedAt)} />
            <InfoCard label="Verification Key" value={safe(data.verificationKeyUrl)} />
            <InfoCard label="Signature" value={safe(data.signature)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Signed payload
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Public signed message
            </h2>
            <p className="max-w-3xl text-base leading-7 text-black/70">
              This is the public payload returned by the verification surface.
              It is intended for trust inspection and signature validation.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-4 text-sm text-black/75">
            <pre className="overflow-x-auto whitespace-pre-wrap break-words">
              {safe(data.signedMessageString)}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
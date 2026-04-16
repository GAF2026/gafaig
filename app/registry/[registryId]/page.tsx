import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RegistryRecord = {
  registryId?: string;
  registryIdRaw?: string;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  applicationId?: string | null;
  caseId?: string | null;
  certifiedScore?: number | string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  certifiedAt?: string | null;
  certificationStatus?: string | null;
  decisionStatus?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
};

type RegistryApiResponse = {
  ok?: boolean;
  row?: RegistryRecord | null;
  rows?: RegistryRecord[];
};

type VerifyResponse = {
  ok?: boolean;
  registryId?: string;
  entityName?: string;
  decisionStatus?: string;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  verificationKeyUrl?: string | null;
  signedAt?: string | null;
  signature?: string | null;
  signedMessageString?: string | null;
  signedMessageObject?: Record<string, unknown> | null;
};

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function safe(value?: string | null): string {
  const s = String(value ?? "").trim();
  return s || "—";
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatScore(value?: number | string | null): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toFixed(2);
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function statusTone(value: string) {
  const v = value.trim().toUpperCase();
  if (v === "CERTIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "APPROVED") return "bg-blue-50 text-blue-700 ring-blue-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function prettifyBand(tier?: string | null, band?: string | null): string {
  const t = safe(tier);
  const b = safe(band);
  if (t !== "—" && b !== "—") return `${t} · Band ${b}`;
  if (t !== "—") return t;
  if (b !== "—") return `Band ${b}`;
  return "—";
}

async function getRegistryRecord(registryId: string): Promise<RegistryRecord | null> {
  const res = await fetch(`${getBaseUrl()}/api/registry?registryId=${encodeURIComponent(registryId)}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as RegistryApiResponse;
  return data?.row || data?.rows?.[0] || null;
}

async function getVerifyData(registryId: string): Promise<VerifyResponse | null> {
  const res = await fetch(`${getBaseUrl()}/api/verify/${encodeURIComponent(registryId)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as VerifyResponse;
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">{label}</div>
      <div className="mt-2 text-[15px] font-semibold text-black">{value}</div>
    </div>
  );
}

export default async function RegistryRecordPage({ params }: { params: { registryId: string } }) {
  const registryId = decodeURIComponent(params.registryId);
  const [record, verify] = await Promise.all([getRegistryRecord(registryId), getVerifyData(registryId)]);
  if (!record) notFound();

  const entityName = safe(record.entityName);
  const decisionStatus = safe(record.decisionStatus);
  const isCertified = Boolean(record.certifiedAt);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex gap-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">Certified</span>
            <span className={classNames("inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1", statusTone(decisionStatus))}>{decisionStatus}</span>
          </div>

          <h1 className="mt-4 text-[42px] font-semibold tracking-tight text-black">{entityName}</h1>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <InfoCard label="Certification" value={prettifyBand(record.certifiedTier, record.certifiedBand)} />
            <InfoCard label="Certified" value={formatDate(record.certifiedAt)} />
            <InfoCard label="Valid From" value={formatDate(record.validFrom)} />
            <InfoCard label="Valid To" value={formatDate(record.validTo)} />
          </div>

          <div className="mt-6 flex gap-3">
            <Link href={`/registry/${registryId}`} className="inline-flex rounded-full border border-black/20 px-5 py-2 text-sm font-semibold">
              View Certified Record
            </Link>
            <Link href="/registry" className="inline-flex rounded-full border border-black/20 px-5 py-2 text-sm font-semibold">
              Back to registry
            </Link>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[22px] font-semibold">Public record summary</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <InfoCard label="Entity Type" value={safe(record.entityType)} />
            <InfoCard label="Country" value={safe(record.country)} />
            <InfoCard label="Registry ID" value={safe(record.registryId)} />
            <InfoCard label="Application ID" value={safe(record.applicationId)} />
            <InfoCard label="Case ID" value={safe(record.caseId)} />
            <InfoCard label="Score" value={formatScore(record.certifiedScore)} />
          </div>
        </section>

      </div>
    </main>
  );
}
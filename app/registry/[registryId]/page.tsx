import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getRegistryByRegistryId } from "@/lib/queries/registry";
import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";
import PublicPageSection from "@/app/_components/PublicPageSection";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    registryId: string;
  };
};

function fmtDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function valueOrDash(value?: string | number | null): string | number {
  if (value === null || value === undefined || value === "") return "—";
  return value;
}

function badgeClass(text?: string | null) {
  const v = String(text || "").toLowerCase();

  if (v.includes("certified")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (v.includes("not certified")) {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  if (v.includes("published") || v.includes("approved")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");

  return `${proto}://${host}`;
}

export default async function RegistryDetailPage({ params }: PageProps) {
  const registryId = decodeURIComponent(params.registryId || "").trim();
  if (!registryId) notFound();

  const row = await getRegistryByRegistryId(registryId);
  if (!row) notFound();

  const baseUrl = await getBaseUrl();
  const absoluteVerifyUrl = `${baseUrl}/api/verify/${encodeURIComponent(
    row.registryId
  )}`;
  const absoluteRegistryUrl = `${baseUrl}/registry/${encodeURIComponent(
    row.registryId
  )}`;

  let verifyData: any = null;

  try {
    const res = await fetch(absoluteVerifyUrl, { cache: "no-store" });
    verifyData = await res.json();
  } catch {
    verifyData = null;
  }

  return (
    <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-14 md:px-8">
      <div className="space-y-8">
        <PublicPageSection
          eyebrow="Certification record"
          title={row.entityName ?? "Registry Record"}
          description="This is the canonical public certification record issued by GAFAIG. It reflects governance outcome, tier classification, and verification status."
        >
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
                row.certificationStatus
              )}`}
            >
              {row.certificationStatus}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs ${badgeClass(
                row.certifiedTier
              )}`}
            >
              {row.certifiedTier ?? "—"}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs ${badgeClass(
                row.certifiedBand
              )}`}
            >
              Band {row.certifiedBand ?? "—"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Metric label="Score" value={row.certifiedScore} />
            <Metric label="Certified At" value={fmtDate(row.certifiedAt)} />
            <Metric label="Country" value={row.country} />
            <Metric label="Entity Type" value={row.entityType} />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-xs uppercase text-black/50">Registry ID</div>
            <div className="mt-2 break-all font-mono text-sm">{row.registryId}</div>
          </div>
        </PublicPageSection>

        <div className="mt-10">
          <PublicPageSection title="Certification Details">
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Decision Status" value={row.decisionStatus} />
              <Info label="Valid From" value={fmtDate(row.validFrom)} />
              <Info label="Valid To" value={fmtDate(row.validTo)} />
              <Info label="Last Activity" value={fmtDate(row.lastActivityAt)} />
              <Info label="Application ID" value={row.applicationId} />
              <Info label="Case ID" value={row.caseId} />
            </div>
          </PublicPageSection>
        </div>

        <PublicPageSection title="Verification">
          <RegistryVerificationPanel
            absoluteVerifyUrl={absoluteVerifyUrl}
            absoluteRegistryUrl={absoluteRegistryUrl}
            registryId={String(row.registryId)}
            entityName={row.entityName ?? ""}
            verifyData={verifyData ?? null}
          />
        </PublicPageSection>

        <PublicPageSection title="Public Record Notice">
          <p className="text-sm text-black/70">
            This certification record represents a controlled public disclosure.
            Private findings, evidence, and internal review materials are not
            exposed.
          </p>
        </PublicPageSection>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs text-black/50">{label}</div>
      <div className="mt-1 text-xl font-semibold">{valueOrDash(value)}</div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs text-black/50">{label}</div>
      <div className="mt-1 text-sm">{valueOrDash(value)}</div>
    </div>
  );
}
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getRegistryByRegistryId } from "@/lib/queries/registry";
import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";
import PublicPageSection from "@/app/_components/PublicPageSection";

export const dynamic = "force-dynamic";

type RouteParams = {
  registryId?: string;
  id?: string;
  slug?: string;
};

type PageProps = {
  params: Promise<RouteParams> | RouteParams;
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

  if (v.includes("not certified")) {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  if (v.includes("certified")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (v.includes("published") || v.includes("approved")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (v === "a") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (v === "b") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (v === "c") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (v === "d") {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function scoreTone(score?: number | null) {
  if (score === null || score === undefined) {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }
  if (score >= 90) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (score >= 80) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (score >= 70) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function formatScore(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Number(value).toFixed(0);
}

function pctWidth(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "0%";
  const safe = Math.max(0, Math.min(100, Number(value)));
  return `${safe}%`;
}

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");

  return `${proto}://${host}`;
}

export default async function RegistryDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);

  const rawRegistryId =
    resolvedParams?.registryId ??
    resolvedParams?.id ??
    resolvedParams?.slug ??
    "";

  const registryId = decodeURIComponent(rawRegistryId).trim();

  if (!registryId) {
    notFound();
  }

  const row = await getRegistryByRegistryId(registryId);

  if (!row || !row.registryId) {
    notFound();
  }

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
    if (res.ok) {
      verifyData = await res.json();
    }
  } catch {
    verifyData = null;
  }

  const score = row.certifiedScore ?? row.score;
  const tier = row.certifiedTier ?? row.tier;
  const band = row.certifiedBand ?? row.band;

  return (
    <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-14 md:px-8">
      <div className="space-y-8">
        <PublicPageSection
          eyebrow="Certification record"
          title={row.entityName ?? "Registry Record"}
          description="Canonical public certification record issued by GAFAIG. This record reflects governance outcome, tier classification, and public verification status without exposing private evidence."
        >
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
                row.certificationStatus
              )}`}
            >
              {row.certificationStatus ?? "—"}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs ${badgeClass(
                tier
              )}`}
            >
              {tier ?? "—"}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs ${badgeClass(
                band
              )}`}
            >
              Band {band ?? "—"}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs ${badgeClass(
                row.decisionStatus
              )}`}
            >
              {row.decisionStatus ?? "—"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <MetricCard
              label="Certified Score"
              value={formatScore(score)}
              tone={scoreTone(score)}
            />
            <MetricCard label="Certified At" value={fmtDate(row.certifiedAt)} />
            <MetricCard label="Country" value={row.country} />
            <MetricCard label="Entity Type" value={row.entityType} />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-xs uppercase text-black/50">Registry ID</div>
            <div className="mt-2 break-all font-mono text-sm">{row.registryId}</div>
          </div>
        </PublicPageSection>

        <PublicPageSection
          title="Certification Summary"
          description="Public summary of certification state, validity window, and source workflow identifiers."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard label="Decision Status" value={row.decisionStatus} />
            <InfoCard label="Certification Status" value={row.certificationStatus} />
            <InfoCard label="Valid From" value={fmtDate(row.validFrom)} />
            <InfoCard label="Valid To" value={fmtDate(row.validTo)} />
            <InfoCard label="Published At" value={fmtDate(row.publishedAt)} />
            <InfoCard label="Last Activity" value={fmtDate(row.lastActivityAt)} />
            <InfoCard label="Application ID" value={row.applicationId} />
            <InfoCard label="Case ID" value={row.caseId} />
            <InfoCard label="Model Version" value={row.modelVersion} />
            <InfoCard label="Snapshot ID" value={row.snapshotId} mono />
          </div>
        </PublicPageSection>

        <PublicPageSection
          title="Governance Outcome"
          description="Public certification fields derived from the underlying GAFAIG governance engine and registry publication workflow."
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase text-black/50">
                    Governance Score
                  </div>
                  <div className="mt-2 text-5xl font-semibold text-black">
                    {formatScore(score)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs uppercase text-black/50">Band</div>
                  <div
                    className={`mt-2 inline-flex rounded-full border px-4 py-2 text-lg font-semibold ${badgeClass(
                      band
                    )}`}
                  >
                    {band ?? "—"}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-black/60">Certification strength</span>
                  <span className="font-medium text-black">
                    {formatScore(score)} / 100
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{ width: pctWidth(score) }}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MiniMetric label="Tier" value={tier} />
                <MiniMetric label="Band" value={band} />
                <MiniMetric label="Status" value={row.certificationStatus} />
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-xs uppercase text-black/50">
                Record Attributes
              </div>

              <div className="mt-4 space-y-4">
                <AttributeRow label="Entity">{valueOrDash(row.entityName)}</AttributeRow>
                <AttributeRow label="Country">{valueOrDash(row.country)}</AttributeRow>
                <AttributeRow label="Verification Type">
                  {valueOrDash(row.registryStatus ?? row.decisionStatus)}
                </AttributeRow>
                <AttributeRow label="Workflow Type">
                  {valueOrDash(row.modelVersion)}
                </AttributeRow>
              </div>
            </div>
          </div>
        </PublicPageSection>

        <PublicPageSection
          title="Verification"
          description="Live verification surface for external parties validating this certification record."
        >
          <RegistryVerificationPanel
            absoluteVerifyUrl={absoluteVerifyUrl}
            absoluteRegistryUrl={absoluteRegistryUrl}
            registryId={String(row.registryId)}
            entityName={row.entityName ?? ""}
            verifyData={verifyData ?? null}
          />
        </PublicPageSection>

        <PublicPageSection title="Public Record Notice">
          <p className="text-sm leading-6 text-black/70">
            This certification record is a controlled public disclosure. It
            exposes registry outcome, certification fields, and external
            verification metadata only. Private findings, evidence, internal
            deliberations, and proprietary source materials are not disclosed in
            this surface.
          </p>
        </PublicPageSection>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value?: string | number | null;
  tone?: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${tone ?? "border-black/10 bg-white"}`}>
      <div className="text-xs text-black/50">{label}</div>
      <div className="mt-2 text-xl font-semibold">{valueOrDash(value)}</div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs text-black/50">{label}</div>
      <div className={`mt-2 text-sm ${mono ? "break-all font-mono" : ""}`}>
        {valueOrDash(value)}
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-xs uppercase text-black/50">{label}</div>
      <div className="mt-2 text-base font-medium text-black">
        {valueOrDash(value)}
      </div>
    </div>
  );
}

function AttributeRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/5 pb-3 last:border-b-0 last:pb-0">
      <div className="text-xs uppercase text-black/50">{label}</div>
      <div className="mt-1 text-sm text-black">{children}</div>
    </div>
  );
}
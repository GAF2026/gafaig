import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getRegistryByRegistryId } from "@/lib/queries/registry";
import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    registryId: string;
  };
};

type VerifyApiResponse = {
  ok: boolean;
  verified?: boolean;
  registryId?: string;
  entity?: string | null;
  entityType?: string | null;
  country?: string | null;
  applicationId?: string | null;
  caseId?: string | null;
  status?: string | null;
  tier?: string | null;
  band?: string | null;
  score?: number | null;
  decisionStatus?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  lastActivityAt?: string | null;
  proof?: {
    alg?: string | null;
    signature?: string | null;
    signedAt?: string | null;
    message?: string | null;
  } | null;
  error?: string;
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
  if (v.includes("pending")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
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

function getBaseUrl() {
  const h = headers();
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

  const isCertified = row.certificationStatus === "Certified";

  const baseUrl = getBaseUrl();
  const absoluteRegistryUrl = `${baseUrl}/registry/${encodeURIComponent(
    row.registryId
  )}`;
  const absoluteVerifyUrl = `${baseUrl}/api/verify/${encodeURIComponent(
    row.registryId
  )}`;

  let verifyData: VerifyApiResponse = {
    ok: false,
    error: "Verification unavailable",
  };

  try {
    const res = await fetch(absoluteVerifyUrl, { cache: "no-store" });
    verifyData = (await res.json()) as VerifyApiResponse;
  } catch (error) {
    verifyData = {
      ok: false,
      error:
        error instanceof Error ? error.message : "Verification unavailable",
    };
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/registry"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to Registry
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
              row.certificationStatus
            )}`}
          >
            {row.certificationStatus}
          </span>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
              row.decisionStatus
            )}`}
          >
            {valueOrDash(row.decisionStatus)}
          </span>

          {row.certifiedTier ? (
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                row.certifiedTier
              )}`}
            >
              {row.certifiedTier}
            </span>
          ) : null}

          {row.certifiedBand ? (
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                row.certifiedBand
              )}`}
            >
              Band {row.certifiedBand}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900">
          {row.entityName ?? "Registry Record"}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Public certification record for this entity in the GAFAIG registry.
          This page exposes certification status, governance signal, and
          verification metadata without revealing private evidence.
        </p>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Certification Status"
          value={valueOrDash(row.certificationStatus)}
          tone={row.certificationStatus}
        />
        <MetricCard
          label="Certified Tier"
          value={valueOrDash(row.certifiedTier)}
          tone={row.certifiedTier}
        />
        <MetricCard
          label="Certified Band"
          value={valueOrDash(row.certifiedBand)}
          tone={row.certifiedBand}
        />
        <MetricCard
          label="Certified Score"
          value={valueOrDash(row.certifiedScore)}
        />
      </section>

      <section className="mb-8 grid gap-6 xl:grid-cols-3">
        <Panel title="Certification Overview" className="xl:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoRow label="Certification Status" value={row.certificationStatus} />
            <InfoRow label="Decision Status" value={row.decisionStatus} />
            <InfoRow label="Certified Tier" value={row.certifiedTier} />
            <InfoRow label="Certified Band" value={row.certifiedBand} />
            <InfoRow
              label="Certified Score"
              value={
                row.certifiedScore === null || row.certifiedScore === undefined
                  ? "—"
                  : String(row.certifiedScore)
              }
            />
            <InfoRow label="Certified At" value={fmtDate(row.certifiedAt)} />
            <InfoRow label="Valid From" value={fmtDate(row.validFrom)} />
            <InfoRow label="Valid To" value={fmtDate(row.validTo)} />
            <InfoRow label="Last Activity" value={fmtDate(row.lastActivityAt)} />
          </div>
        </Panel>

        <Panel title="Trust Signal">
          <div className="space-y-4">
            <TrustItem label="Registry-backed" value="Yes" tone="Certified" />
            <TrustItem
              label="Verification Status"
              value={valueOrDash(row.certificationStatus)}
              tone={row.certificationStatus}
            />
            <TrustItem
              label="Published"
              value={fmtDate(row.lastActivityAt || row.certifiedAt)}
              tone="published"
            />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Immutable Registry ID
              </div>
              <div className="mt-2 break-all font-mono text-sm text-slate-800">
                {row.registryId}
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <section className="mb-8 grid gap-6 xl:grid-cols-2">
        <Panel title="Entity Profile">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoRow label="Entity Name" value={row.entityName} />
            <InfoRow label="Entity Type" value={row.entityType} />
            <InfoRow label="Country" value={row.country} />
            <InfoRow label="Application ID" value={row.applicationId} />
            <InfoRow label="Case ID" value={row.caseId} />
            <InfoRow label="Registry ID" value={row.registryId} mono />
          </div>
        </Panel>

        <Panel title="Verification Endpoint">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-600">
              External systems can verify this registry record through the public
              verification endpoint.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                API Endpoint
              </div>
              <div className="mt-2 break-all font-mono text-sm text-slate-800">
                /api/verify/{row.registryId}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/api/verify/${encodeURIComponent(row.registryId)}`}
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Open Verification JSON
              </Link>

              <Link
                href={`/registry/${encodeURIComponent(row.registryId)}`}
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Canonical Permalink
              </Link>
            </div>
          </div>
        </Panel>
      </section>

      <RegistryVerificationPanel
        absoluteVerifyUrl={absoluteVerifyUrl}
        absoluteRegistryUrl={absoluteRegistryUrl}
        registryId={row.registryId}
        entityName={row.entityName ?? "Registry Record"}
        verifyData={verifyData}
      />

      <section className="mt-8">
        <Panel title="Public Record Notice">
          <p className="text-sm leading-6 text-slate-600">
            This certification record is a controlled public disclosure derived
            from the GAFAIG verification workflow. It communicates governance
            outcome and certification metadata only. Private findings, evidence,
            and internal reviewer materials are not exposed on this page.
          </p>

          {isCertified ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              This record currently carries a live certification signal in the
              GAFAIG public registry.
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              This record is present in the public registry but does not
              currently carry an active certification signal.
            </div>
          )}
        </Panel>
      </section>
    </main>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 flex items-center gap-3">
        <div className="text-3xl font-semibold text-slate-900">{value}</div>
        {tone ? (
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(
              tone
            )}`}
          >
            {tone}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div
        className={`mt-2 text-sm text-slate-900 ${
          mono ? "break-all font-mono" : ""
        }`}
      >
        {valueOrDash(value)}
      </div>
    </div>
  );
}

function TrustItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: string | null;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-slate-900">{value}</div>
        {tone ? (
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(
              tone
            )}`}
          >
            {tone}
          </span>
        ) : null}
      </div>
    </div>
  );
}
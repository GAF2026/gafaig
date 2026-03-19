import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistryAiSystemByRegistryId } from "@/lib/queries/registry-ai-systems";

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

function badgeClass(text?: string | null) {
  const v = String(text || "").toLowerCase();

  if (v.includes("enterprise") || v === "a") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (v.includes("standard") || v === "b") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (v.includes("baseline") || v === "c") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (v.includes("approved")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (v.includes("pending")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (v.includes("revoked") || v.includes("denied")) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function valueOrDash(value?: string | null | number): string | number {
  if (value === null || value === undefined || value === "") return "—";
  return value;
}

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    registryId: string;
  };
};

export default async function RegistryDetailPage({ params }: PageProps) {
  const registryId = params.registryId?.trim().toUpperCase();

  if (!registryId) notFound();

  const record = await getRegistryAiSystemByRegistryId(registryId);

  if (!record) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/registry"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Registry
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                  record.certifiedTier
                )}`}
              >
                {record.certifiedTier ?? "Unspecified Tier"}
              </span>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                  record.certifiedBand
                )}`}
              >
                Band {record.certifiedBand ?? "—"}
              </span>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                  record.decisionStatus
                )}`}
              >
                {record.decisionStatus ?? "Unknown Status"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              Registry Certification Record
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Official GAFAIG public certification record for a published AI
              system. This page exposes the public governance signal and linked
              certification metadata without revealing private evidence or
              reviewer materials.
            </p>

            <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              Public registry disclosure
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[360px]">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Score
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {valueOrDash(record.certifiedScore)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Certified
              </div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {fmtDate(record.certifiedAt)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Valid From
              </div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {fmtDate(record.validFrom)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Valid To
              </div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {fmtDate(record.validTo)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Record Identity
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Registry ID
                </div>
                <div className="mt-2 break-all text-sm font-medium text-slate-900">
                  {record.registryId ?? "—"}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  System ID
                </div>
                <div className="mt-2 break-all text-sm font-medium text-slate-900">
                  {record.systemId}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Case ID
                </div>
                <div className="mt-2 break-all text-sm font-medium text-slate-900">
                  {record.caseId ?? "—"}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/registry/ai-systems/${encodeURIComponent(record.systemId)}`}
                className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                View AI System
              </Link>

              <Link
                href="/registry"
                className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Browse Systems
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Certification Status
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Decision Status</span>
                <span className="font-medium text-slate-900">
                  {record.decisionStatus ?? "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Tier</span>
                <span className="font-medium text-slate-900">
                  {record.certifiedTier ?? "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Band</span>
                <span className="font-medium text-slate-900">
                  {record.certifiedBand ?? "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Audit Frequency</span>
                <span className="font-medium text-slate-900">
                  {record.auditFrequency ?? "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Last Activity</span>
                <span className="font-medium text-slate-900">
                  {fmtDate(record.lastActivityAt)}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              AI System
            </h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  System Name
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {record.systemName}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Type
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {record.systemType ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Risk Tier
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {record.riskTier ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Deployment
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {record.deploymentStatus ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Oversight
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {record.oversightLevel ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Linked Entity
            </h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Name
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {record.entityName ?? "—"}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Type
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {record.entityType ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Country
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {record.country ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Governance Signal
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Oversight Model
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {record.oversightModel ?? "—"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Human Review Required
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {record.humanReviewRequired === null
                    ? "—"
                    : record.humanReviewRequired
                      ? "Yes"
                      : "No"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Evaluation Protocol
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {record.evaluationProtocol ?? "—"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Additional Metadata
            </h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Developer Organization
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {record.developerOrganization ?? "—"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Training Data Category
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {record.trainingDataCategory ?? "—"}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Intended Use
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {record.intendedUse ?? "—"}
          </p>
        </section>

        {record.publicSummary ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Public Summary
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {record.publicSummary}
            </p>
          </section>
        ) : null}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Registry Notice
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            This record reflects public certification output derived from the
            GAFAIG deterministic governance workflow. Private evidence,
            findings, reviewer rationale, and internal assessment materials are
            not disclosed on this public page.
          </p>
        </section>
      </div>
    </main>
  );
}
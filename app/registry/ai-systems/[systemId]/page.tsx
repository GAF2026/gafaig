import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistryAiSystemBySystemId } from "@/lib/queries/registry-ai-systems";

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
  params: Promise<{
    systemId: string;
  }>;
};

export default async function RegistryAiSystemDetailPage({
  params,
}: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.systemId?.trim();

  if (!slug) notFound();

  const system = await getRegistryAiSystemBySystemId(slug);

  if (!system) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/registry/ai-systems"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to AI Systems Registry
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                  system.certifiedTier
                )}`}
              >
                {system.certifiedTier ?? "Unspecified Tier"}
              </span>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                  system.certifiedBand
                )}`}
              >
                Band {system.certifiedBand ?? "—"}
              </span>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                  system.decisionStatus
                )}`}
              >
                {system.decisionStatus ?? "Unknown Status"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              {system.systemName}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Public GAFAIG registry detail for this AI system, including linked
              certification metadata, governance status, and published system
              disclosures.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[360px]">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Score
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {valueOrDash(system.certifiedScore)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Certified
              </div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {fmtDate(system.certifiedAt)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Valid From
              </div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {fmtDate(system.validFrom)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Valid To
              </div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {fmtDate(system.validTo)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Registry Identity
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  System ID
                </div>
                <div className="mt-2 break-all text-sm font-medium text-slate-900">
                  {system.systemId}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Registry ID
                </div>
                <div className="mt-2 break-all text-sm font-medium text-slate-900">
                  {system.registryId ?? "—"}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Case ID
                </div>
                <div className="mt-2 break-all text-sm font-medium text-slate-900">
                  {system.caseId ?? "—"}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {system.registryId ? (
                <Link
                  href={`/registry/${encodeURIComponent(system.registryId)}`}
                  className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  View Registry Record
                </Link>
              ) : null}

              <Link
                href="/registry/ai-systems"
                className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back to Systems
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
                  {system.decisionStatus ?? "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Tier</span>
                <span className="font-medium text-slate-900">
                  {system.certifiedTier ?? "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Band</span>
                <span className="font-medium text-slate-900">
                  {system.certifiedBand ?? "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Audit Frequency</span>
                <span className="font-medium text-slate-900">
                  {system.auditFrequency ?? "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Last Activity</span>
                <span className="font-medium text-slate-900">
                  {fmtDate(system.lastActivityAt)}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Entity
            </h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Name
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.entityName ?? "—"}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Type
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {system.entityType ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Country
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {system.country ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              System
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Type
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.systemType ?? "—"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Risk Tier
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.riskTier ?? "—"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Deployment
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.deploymentStatus ?? "—"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Oversight
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.oversightLevel ?? "—"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Governance
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Oversight Model
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.oversightModel ?? "—"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Human Review Required
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.humanReviewRequired === null
                    ? "—"
                    : system.humanReviewRequired
                      ? "Yes"
                      : "No"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Evaluation Protocol
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.evaluationProtocol ?? "—"}
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
                  {system.developerOrganization ?? "—"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Training Data Category
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.trainingDataCategory ?? "—"}
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
            {system.intendedUse ?? "—"}
          </p>
        </section>

        {system.publicSummary ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Public Summary
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {system.publicSummary}
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
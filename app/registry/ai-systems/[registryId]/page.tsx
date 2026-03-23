import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistryAiSystemsByRegistryId } from "@/lib/queries/registry-ai-systems";

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

export default async function RegistryAiSystemPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = params.registryId?.trim();

  if (!registryId) notFound();

  const systems = await getRegistryAiSystemsByRegistryId(registryId);

  if (!systems || systems.length === 0) notFound();

  const system = systems[0];
  const isCertified = system.decisionStatus?.toLowerCase() === "approved";

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/registry/ai-systems"
        className="text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to AI Systems Registry
      </Link>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                {isCertified ? system.certifiedTier || "Certified" : "Not Certified"}
              </span>

              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                {isCertified && system.certifiedBand
                  ? `Band ${system.certifiedBand}`
                  : "No Band"}
              </span>

              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                {system.decisionStatus || "Unknown"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              {system.systemName || "Unnamed System"}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Public GAFAIG registry detail for this AI system, including certified
              governance metadata and published system disclosures.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[360px]">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Certified Score
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {isCertified && system.certifiedScore !== null
                  ? system.certifiedScore
                  : "Pending"}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Certified At
              </div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {isCertified ? fmtDate(system.certifiedAt) : "Not issued"}
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
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Certification Status
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Decision</span>
                <span className="font-medium text-slate-900">
                  {system.decisionStatus ?? "—"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Tier</span>
                <span className="font-medium text-slate-900">
                  {isCertified ? system.certifiedTier ?? "—" : "—"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Band</span>
                <span className="font-medium text-slate-900">
                  {isCertified ? system.certifiedBand ?? "—" : "—"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Audit Frequency</span>
                <span className="font-medium text-slate-900">
                  {system.auditFrequency ?? "—"}
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

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Country
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {system.country ?? "—"}
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
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

  if (v.includes("approved")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (v.includes("pending")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (v.includes("rejected") || v.includes("denied") || v.includes("revoked")) {
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

  const isCertified =
    system.decisionStatus?.toLowerCase() === "approved";

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
                  system.decisionStatus
                )}`}
              >
                {system.decisionStatus ?? "Unknown Status"}
              </span>

              <span className="inline-flex rounded-full border px-3 py-1 text-xs font-medium border-slate-200 bg-slate-50 text-slate-700">
                {isCertified
                  ? system.certifiedTier || "Certified"
                  : "Not Certified"}
              </span>

              <span className="inline-flex rounded-full border px-3 py-1 text-xs font-medium border-slate-200 bg-slate-50 text-slate-700">
                {isCertified && system.certifiedBand
                  ? `Band ${system.certifiedBand}`
                  : "No Band"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              {system.systemName}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Public GAFAIG registry detail for this AI system, including certified
              governance metadata and system disclosures.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[360px]">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Certified Score
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {isCertified
                  ? valueOrDash(system.certifiedScore)
                  : "Pending"}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Certified At
              </div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {isCertified
                  ? fmtDate(system.certifiedAt)
                  : "Not issued"}
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
              <div className="flex justify-between">
                <span className="text-slate-500">Decision</span>
                <span className="font-medium text-slate-900">
                  {system.decisionStatus ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tier</span>
                <span className="font-medium text-slate-900">
                  {isCertified ? system.certifiedTier ?? "—" : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Band</span>
                <span className="font-medium text-slate-900">
                  {isCertified ? system.certifiedBand ?? "—" : "—"}
                </span>
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
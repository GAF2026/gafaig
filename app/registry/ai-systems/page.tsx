import Link from "next/link";
import { getRegistryAiSystemsPaginated } from "@/lib/queries/registry-ai-systems";

type SearchParams = {
  search?: string;
  country?: string;
  tier?: string;
  band?: string;
  sort?: string;
  order?: string;
  page?: string;
  pageSize?: string;
};

function fmtDate(value: string | null | undefined) {
  if (!value) return "Not issued";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Not issued";
  return d.toLocaleDateString();
}

function badgeTone(value: string | null | undefined) {
  const v = String(value || "").trim().toUpperCase();

  if (v === "A") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "B") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v === "C") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (v === "D") return "bg-slate-100 text-slate-700 ring-slate-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function statusTone(value: string | null | undefined) {
  const v = String(value || "").trim().toLowerCase();

  if (v === "approved") return "text-emerald-700";
  if (v === "rejected") return "text-red-600";
  if (v === "pending") return "text-amber-700";

  return "text-slate-500";
}

export default async function RegistryAiSystemsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const page = Math.max(1, Number(searchParams?.page || "1") || 1);
  const pageSize = Math.max(1, Number(searchParams?.pageSize || "12") || 12);

  const result = await getRegistryAiSystemsPaginated({
    page,
    pageSize,
  });

  const systems = result.rows;
  const total = result.total;

  const linkedEntities = new Set(
    systems.map((s) => s.registryId).filter((v): v is string => Boolean(v))
  ).size;

  const countries = new Set(
    systems.map((s) => s.country).filter((v): v is string => Boolean(v))
  ).size;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">
            Global AI Systems Registry
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            Public-facing AI systems connected to published GAFAIG registry
            records. This view reflects certified AI systems derived from the
            canonical registry.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Matching Systems
            </div>
            <div className="mt-2 text-4xl font-semibold">{total}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Global Linked Entities
            </div>
            <div className="mt-2 text-4xl font-semibold">{linkedEntities}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Global Countries
            </div>
            <div className="mt-2 text-4xl font-semibold">{countries}</div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {systems.map((system) => {
            const isCertified =
              system.decisionStatus?.toLowerCase() === "approved";

            return (
              <section
                key={system.systemId}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                        {system.systemName || "Unnamed System"}
                      </h2>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                        {isCertified
                          ? system.certifiedTier || "Certified"
                          : "Not Certified"}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badgeTone(
                          system.certifiedBand
                        )}`}
                      >
                        {isCertified && system.certifiedBand
                          ? `Band ${system.certifiedBand}`
                          : "No Band"}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-medium text-slate-500">
                      {isCertified
                        ? "Certified under GAFAIG registry"
                        : "Not yet certified"}
                    </div>

                    <div
                      className={`mt-2 text-xs font-medium ${statusTone(
                        system.decisionStatus
                      )}`}
                    >
                      Decision: {system.decisionStatus || "Unknown"}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
                      <div>
                        <span className="font-medium text-slate-500">
                          Entity:
                        </span>{" "}
                        {system.entityName || "Unknown"}
                      </div>
                      <div>
                        <span className="font-medium text-slate-500">
                          Country:
                        </span>{" "}
                        {system.country || "Not disclosed"}
                      </div>
                      <div>
                        <span className="font-medium text-slate-500">
                          Type:
                        </span>{" "}
                        {system.systemType || "—"}
                      </div>
                      <div>
                        <span className="font-medium text-slate-500">
                          Risk:
                        </span>{" "}
                        {system.riskTier || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="grid min-w-[320px] gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Registry ID
                      </div>
                      <div className="mt-1 break-all text-sm font-medium text-slate-800">
                        {system.registryId || "—"}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Case ID
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-800">
                        {system.caseId || "—"}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Certified
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-800">
                        {isCertified
                          ? fmtDate(system.certifiedAt)
                          : "Not issued"}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Certified Score
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-800">
                        {isCertified && system.certifiedScore !== null
                          ? system.certifiedScore
                          : "Pending"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Public Summary
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-700">
                    {system.publicSummary || "No public summary available."}
                  </div>
                </div>
              </section>
            );
          })}

          {systems.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              No AI systems matched the current filters.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
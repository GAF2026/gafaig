import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
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
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="AI SYSTEMS REGISTRY"
          title="Global AI Systems Registry"
          description="Public-facing AI systems connected to published GAFAIG registry records. This surface helps visitors inspect disclosed systems while preserving the canonical certification trust record in the linked registry entry."
          secondaryDescription="Each system record provides public context for an AI system that sits within GAFAIG’s broader trust infrastructure. System-level disclosure remains distinct from the canonical certification record, which is available through the linked registry record and public verification surfaces."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="primary">
                View Registry
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/systems" variant="secondary">
                Systems Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/explorer" variant="secondary">
                Back to Explorer
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Matching Systems" value={String(total)} />
          <MetricCard label="Linked Entities" value={String(linkedEntities)} />
          <MetricCard label="Countries" value={String(countries)} />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            SYSTEM DIRECTORY
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public AI systems
          </h2>

          <p className="mt-4 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
            Open a system record to inspect public system context, certification
            status, and linkage to the canonical registry record.
          </p>

          <div className="mt-8 space-y-6">
            {systems.map((system) => {
              const isCertified =
                system.decisionStatus?.toLowerCase() === "approved";

              return (
                <section
                  key={system.systemId}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-semibold tracking-tight text-black">
                          {system.systemName || "Unnamed System"}
                        </h3>

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

                    <div className="flex flex-wrap gap-3 lg:justify-end">
                      <PublicButtonLink
                        href={`/registry/ai-systems/${system.systemId}`}
                        variant="primary"
                        size="sm"
                      >
                        View system
                      </PublicButtonLink>

                      {system.registryId ? (
                        <PublicButtonLink
                          href={`/registry/${system.registryId}`}
                          variant="secondary"
                          size="sm"
                        >
                          View registry
                        </PublicButtonLink>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
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
              <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-slate-600">
                No AI systems matched the current filters.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[36px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getRegistryAiSystemsPaginated } from "@/lib/queries/registry-ai-systems";

type SearchParams = {
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

function toneForTier(value: string | null | undefined) {
  const v = String(value || "").toUpperCase();
  if (v === "A") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "B") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v === "C") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (v === "D") return "bg-slate-100 text-slate-700 ring-slate-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function toneForRisk(value: string | null | undefined) {
  const v = String(value || "").toLowerCase();
  if (v === "high") return "bg-red-50 text-red-700 ring-red-200";
  if (v === "medium") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (v === "low") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function normalizeTrustState(
  certifiedAt: string | null | undefined,
  decisionStatus: string | null | undefined
) {
  const isCertified = Boolean(String(certifiedAt ?? "").trim());
  const decision = String(decisionStatus ?? "").trim().toUpperCase();

  if (isCertified) {
    return {
      label: "Certified",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      isCertified: true,
    };
  }

  if (decision === "APPROVED") {
    return {
      label: "Approved",
      className: "bg-blue-50 text-blue-700 ring-blue-200",
      isCertified: false,
    };
  }

  return {
    label: "Pending",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    isCertified: false,
  };
}

export default async function RegistryAiSystemsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const page = Math.max(1, Number(searchParams?.page || "1") || 1);
  const pageSize = Math.max(1, Number(searchParams?.pageSize || "12") || 12);

  const result = await getRegistryAiSystemsPaginated({ page, pageSize });
  const systems = result.rows;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="AI SYSTEMS REGISTRY"
          title="Global AI Systems Registry"
          description="Public-facing AI systems connected to the GAFAIG trust surface."
          secondaryDescription="This registry view may include both evaluated (Approved) systems and publicly trusted (Certified) systems. Certification remains anchored at the registry record level, while system-level disclosure provides transparency into deployment, risk, oversight, and public summaries."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="primary">
                View Registry
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/systems" variant="secondary">
                Systems Explorer
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="max-w-[980px] space-y-3 text-[15px] leading-[1.8] text-black/65">
            <p>
              The AI systems registry distinguishes between evaluated systems and publicly trusted systems.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <div className="grid gap-3 text-[15px] leading-[1.8] text-black/72">
                <div>
                  <span className="font-semibold text-black">Approved</span>{" "}
                  means a system is connected to a completed GAFAIG evaluation and governance decision, but it may not yet have a certified public registry record.
                </div>

                <div>
                  <span className="font-semibold text-black">Certified</span>{" "}
                  means the evaluated outcome has been finalized and published as a trusted public record in the GAFAIG registry of record.
                </div>
              </div>
            </div>

            <p className="text-black/60">
              This systems registry may include both Approved and Certified systems. The Registry of Record shows Certified records only.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <h2 className="text-[32px] font-semibold tracking-tight text-black">
            Public AI systems
          </h2>

          <div className="mt-8 space-y-6">
            {systems.map((system) => {
              const trust = normalizeTrustState(
                system.certifiedAt,
                system.decisionStatus
              );

              return (
                <section
                  key={system.systemId}
                  className="rounded-2xl border border-black/10 p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-black">
                        {system.systemName}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneForRisk(
                            system.riskTier
                          )}`}
                        >
                          {system.riskTier || "Risk Unknown"}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${trust.className}`}
                        >
                          {trust.label}
                        </span>

                        {trust.isCertified && system.certifiedTier && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneForTier(
                              system.certifiedTier
                            )}`}
                          >
                            Tier {system.certifiedTier}
                          </span>
                        )}

                        {trust.isCertified && system.certifiedBand && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                            Band {system.certifiedBand}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <PublicButtonLink
                        href={`/registry/ai-systems/${system.systemId}`}
                        variant="primary"
                        size="sm"
                      >
                        View system
                      </PublicButtonLink>

                      {system.registryId && (
                        <PublicButtonLink
                          href={`/registry/${system.registryId}`}
                          variant="secondary"
                          size="sm"
                        >
                          View registry
                        </PublicButtonLink>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-black/5 bg-black/[0.02] p-4">
                    <div className="text-xs font-semibold uppercase text-black/50">
                      Trust Signal
                    </div>
                    <div className="mt-2 text-sm text-black/80">
                      {trust.isCertified
                        ? `Certified ${system.certifiedTier || ""}${
                            system.certifiedBand
                              ? ` / Band ${system.certifiedBand}`
                              : ""
                          } • Issued ${fmtDate(system.certifiedAt)}`
                        : trust.label === "Approved"
                        ? "Approved • Evaluated but not yet published as a certified public registry record"
                        : "Pending"}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <Block
                      title="Governance"
                      items={[
                        ["Oversight", system.oversightLevel],
                        [
                          "Human Review",
                          system.humanReviewRequired ? "Required" : "—",
                        ],
                        ["Audit", system.auditFrequency],
                      ]}
                    />

                    <Block
                      title="Risk & Deployment"
                      items={[
                        ["Risk Tier", system.riskTier],
                        ["Deployment", system.deploymentStatus],
                        ["Data", system.trainingDataCategory],
                      ]}
                    />

                    <Block
                      title="Registry Context"
                      items={[
                        ["Registry ID", system.registryId],
                        ["Case ID", system.caseId],
                        ["Decision", system.decisionStatus],
                      ]}
                    />
                  </div>

                  <div className="mt-5 rounded-xl bg-black/[0.03] p-4">
                    <div className="text-xs font-semibold uppercase text-black/50">
                      Public Summary
                    </div>
                    <div className="mt-2 text-sm text-black/80">
                      {system.publicSummary || "No summary available."}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Block({
  title,
  items,
}: {
  title: string;
  items: [string, string | null][];
}) {
  return (
    <div className="rounded-xl border border-black/5 p-4">
      <div className="text-xs font-semibold uppercase text-black/50">
        {title}
      </div>
      <div className="mt-3 space-y-2 text-sm">
        {items.map(([label, value]) => (
          <div key={label}>
            <span className="text-black/50">{label}:</span>{" "}
            {value || "—"}
          </div>
        ))}
      </div>
    </div>
  );
}
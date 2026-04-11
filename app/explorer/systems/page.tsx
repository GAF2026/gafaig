import Link from "next/link";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getExplorerSystems } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toneForRisk(value: string | null | undefined) {
  const v = String(value || "").trim().toLowerCase();

  if (v === "high") return "bg-red-50 text-red-700 ring-red-200";
  if (v === "medium") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (v === "low") return "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function toneForCertification(value: string | null | undefined) {
  const v = String(value || "").trim().toLowerCase();

  if (v === "certified") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function formatBoolean(value: boolean | null | undefined) {
  if (value === true) return "Required";
  if (value === false) return "Not required";
  return "—";
}

export default async function ExplorerSystemsPage() {
  const rows = await getExplorerSystems(200);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER"
          title="AI systems"
          description="Public AI systems surfaced through the registry’s canonical systems view."
          secondaryDescription="This explorer surface now reflects the richer canonical systems contract: visible system metadata, risk posture, oversight details, public summaries, and links back to the associated public registry records."
          actions={
            <>
              <PublicButtonLink href="/registry/ai-systems" variant="primary">
                Open AI Systems Registry
              </PublicButtonLink>

              <PublicButtonLink href="/explorer" variant="secondary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/organizations"
                variant="secondary"
              >
                Organizations
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Countries
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                SYSTEM DIRECTORY
              </div>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Public AI systems in the registry
              </h2>

              <p className="mt-3 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
                Browse public system metadata connected to GAFAIG registry
                records, including deployment status, risk tier, oversight
                posture, and public system summaries.
              </p>
            </div>

            <div>
              <PublicButtonLink href="/registry/ai-systems" variant="secondary">
                Open Full AI Systems Registry
              </PublicButtonLink>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {rows.map((row) => (
              <article
                key={row.systemId || `${row.registryId}-${row.displayOrder}`}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[24px] font-semibold tracking-tight text-black">
                        {row.systemName || "Unnamed System"}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneForRisk(
                          row.riskTier
                        )}`}
                      >
                        {row.riskTier ? `${row.riskTier} Risk` : "Risk Undisclosed"}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneForCertification(
                          row.certificationStatus
                        )}`}
                      >
                        {row.certificationStatus || "Certification Pending"}
                      </span>
                    </div>

                    <div className="mt-2 text-[14px] text-black/55">
                      {row.systemId || "No system ID"}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-black/72">
                      <div>
                        <span className="font-medium text-black/50">Developer:</span>{" "}
                        {row.developerOrganization || row.entityName || "—"}
                      </div>
                      <div>
                        <span className="font-medium text-black/50">Country:</span>{" "}
                        {row.country || "Not disclosed"}
                      </div>
                      <div>
                        <span className="font-medium text-black/50">Type:</span>{" "}
                        {row.systemType || "—"}
                      </div>
                      <div>
                        <span className="font-medium text-black/50">Deployment:</span>{" "}
                        {row.deploymentStatus || "—"}
                      </div>
                      <div>
                        <span className="font-medium text-black/50">Oversight:</span>{" "}
                        {row.oversightLevel || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    {row.registryId ? (
                      <PublicButtonLink
                        href={`/registry/${row.registryId}`}
                        variant="primary"
                        size="sm"
                      >
                        View Registry
                      </PublicButtonLink>
                    ) : null}

                    <PublicButtonLink
                      href="/registry/ai-systems"
                      variant="secondary"
                      size="sm"
                    >
                      Open Systems Registry
                    </PublicButtonLink>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <Info label="Registry ID" value={row.registryId || "—"} breakAll />
                  <Info label="Case ID" value={row.caseId || "—"} />
                  <Info
                    label="Human Review"
                    value={formatBoolean(row.humanReviewRequired)}
                  />
                  <Info label="Audit Frequency" value={row.auditFrequency || "—"} />
                  <Info
                    label="Certified Tier / Band"
                    value={
                      row.certifiedTier || row.certifiedBand
                        ? `${row.certifiedTier || "—"} / ${row.certifiedBand || "—"}`
                        : "—"
                    }
                  />
                  <Info label="Decision Status" value={row.decisionStatus || "—"} />
                  <Info label="Training Data" value={row.trainingDataCategory || "—"} />
                  <Info label="Oversight Model" value={row.oversightModel || "—"} />
                </div>

                <div className="mt-5 rounded-xl bg-black/[0.03] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                    Intended Use
                  </div>
                  <div className="mt-2 text-sm leading-6 text-black/75">
                    {row.intendedUse || "No intended use available."}
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-black/[0.03] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                    Public Summary
                  </div>
                  <div className="mt-2 text-sm leading-6 text-black/75">
                    {row.publicSummary || "No public summary available."}
                  </div>
                </div>
              </article>
            ))}

            {rows.length === 0 ? (
              <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/60">
                No AI systems found.
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-6">
            <PublicButtonLink href="/explorer" variant="secondary">
              Explorer
            </PublicButtonLink>

            <PublicButtonLink
              href="/explorer/organizations"
              variant="secondary"
            >
              Organizations
            </PublicButtonLink>

            <PublicButtonLink href="/explorer/countries" variant="secondary">
              Countries
            </PublicButtonLink>

            <PublicButtonLink href="/registry/ai-systems" variant="secondary">
              AI Systems Registry
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
  breakAll = false,
}: {
  label: string;
  value: string;
  breakAll?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={`mt-2 text-[14px] text-black/85 ${breakAll ? "break-all" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
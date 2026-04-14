import Link from "next/link";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getExplorerSystems } from "@/lib/queries/explorer";

export const revalidate = 300;

function toneForRisk(value: string | null | undefined) {
  const v = String(value || "").trim().toLowerCase();
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
    };
  }

  if (decision === "APPROVED") {
    return {
      label: "Approved",
      className: "bg-blue-50 text-blue-700 ring-blue-200",
    };
  }

  return {
    label: "Pending",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  };
}

function toneForTier(value: string | null | undefined) {
  const v = String(value || "").trim().toUpperCase();
  if (v === "A") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "B") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v === "C") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (v === "D") return "bg-slate-100 text-slate-700 ring-slate-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function toneForBand(value: string | null | undefined) {
  if (!value) return "bg-slate-100 text-slate-600 ring-slate-200";
  return "bg-blue-50 text-blue-700 ring-blue-200";
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
          description="Public AI systems represented across the GAFAIG trust surface."
          secondaryDescription="This explorer surface includes both evaluated (Approved) systems and publicly trusted (Certified) systems. It shows visible system metadata, risk posture, oversight details, certification signals, public summaries, and direct links into both the system trust surface and the linked registry record."
          actions={
            <>
              <PublicButtonLink href="/registry/ai-systems" variant="primary">
                Open AI Systems Registry
              </PublicButtonLink>
              <PublicButtonLink href="/explorer" variant="secondary">
                Back to Explorer
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/organizations" variant="secondary">
                Organizations
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Countries
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="max-w-[980px] space-y-3 text-[15px] leading-[1.8] text-black/65">
            <p>
              Explorer distinguishes between evaluated systems and publicly trusted systems.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <div className="grid gap-3 text-[15px] leading-[1.8] text-black/72">
                <div>
                  <span className="font-semibold text-black">Approved</span>{" "}
                  means a system has completed the GAFAIG evaluation process and received a governance decision, but it may not yet have a certified public registry record.
                </div>

                <div>
                  <span className="font-semibold text-black">Certified</span>{" "}
                  means the evaluated outcome has been finalized and published as a trusted public record in the GAFAIG registry of record.
                </div>
              </div>
            </div>

            <p className="text-black/60">
              This systems view may include both Approved and Certified systems. The Registry of Record shows Certified records only.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                SYSTEM DIRECTORY
              </div>

              <h2 className="mt-4 text-[32px] font-semibold tracking-tight text-black md:text-[38px]">
                Public AI systems in the trust surface
              </h2>

              <p className="mt-3 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
                Browse public system metadata connected to GAFAIG registry records, including deployment status, risk tier, oversight posture, certification signals, and public summaries.
              </p>
            </div>

            <PublicButtonLink href="/registry/ai-systems" variant="secondary">
              Open Full AI Systems Registry
            </PublicButtonLink>
          </div>

          <div className="mt-8 space-y-5">
            {rows.map((row) => {
              const trust = normalizeTrustState(row.certifiedAt, row.decisionStatus);

              return (
                <article
                  key={row.systemId || `${row.registryId}-${row.displayOrder}`}
                  className="rounded-2xl border border-black/10 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[24px] font-semibold text-black">
                          {row.systemName || "Unnamed System"}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ring-1 ${toneForRisk(
                            row.riskTier
                          )}`}
                        >
                          {row.riskTier ? `${row.riskTier} Risk` : "Risk Unknown"}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ring-1 ${trust.className}`}
                        >
                          {trust.label}
                        </span>

                        {row.certifiedTier && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs ring-1 ${toneForTier(
                              row.certifiedTier
                            )}`}
                          >
                            Tier {row.certifiedTier}
                          </span>
                        )}

                        {row.certifiedBand && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs ring-1 ${toneForBand(
                              row.certifiedBand
                            )}`}
                          >
                            Band {row.certifiedBand}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-[13px] text-black/55">
                        {row.systemId || "No system ID"}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-black/72">
                        <div>
                          <span className="font-medium text-black/50">Developer:</span>{" "}
                          {row.developerOrganization || "—"}
                        </div>
                        <div>
                          <span className="font-medium text-black/50">Country:</span>{" "}
                          {row.country || "—"}
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

                    <div className="flex flex-wrap gap-3">
                      {row.systemId && (
                        <PublicButtonLink
                          href={`/registry/ai-systems/${row.systemId}`}
                          variant="primary"
                          size="sm"
                        >
                          View System
                        </PublicButtonLink>
                      )}

                      {row.registryId && (
                        <PublicButtonLink
                          href={`/registry/${row.registryId}`}
                          variant="secondary"
                          size="sm"
                        >
                          View Registry
                        </PublicButtonLink>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <Info label="Registry ID" value={row.registryId || "—"} breakAll />
                    <Info label="Case ID" value={row.caseId || "—"} />
                    <Info label="Human Review" value={formatBoolean(row.humanReviewRequired)} />
                    <Info label="Audit Frequency" value={row.auditFrequency || "—"} />
                    <Info label="Decision" value={row.decisionStatus || "—"} />
                    <Info label="Training Data" value={row.trainingDataCategory || "—"} />
                    <Info label="Oversight Model" value={row.oversightModel || "—"} />
                    <Info label="Trust State" value={trust.label} />
                  </div>

                  <div className="mt-5 rounded-xl bg-black/[0.03] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-black/55">
                      Intended Use
                    </div>
                    <div className="mt-2 text-sm text-black/75">
                      {row.intendedUse || "No intended use available."}
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-black/[0.03] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-black/55">
                      Public Summary
                    </div>
                    <div className="mt-2 text-sm text-black/75">
                      {row.publicSummary || "No public summary available."}
                    </div>
                  </div>
                </article>
              );
            })}

            {rows.length === 0 && (
              <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/60">
                No AI systems found.
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-6">
            <PublicButtonLink href="/explorer" variant="secondary">
              Explorer
            </PublicButtonLink>

            <PublicButtonLink href="/explorer/organizations" variant="secondary">
              Organizations
            </PublicButtonLink>

            <PublicButtonLink href="/explorer/countries" variant="secondary">
              Countries
            </PublicButtonLink>

            <Link
              href="/registry/ai-systems"
              className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open AI Systems Registry
            </Link>
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
      <div className="text-[11px] uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={`mt-2 text-[14px] text-black/85 ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
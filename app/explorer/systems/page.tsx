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
    label: "Unverified",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    isCertified: false,
  };
}

function trustDescriptor(trustState: string) {
  if (trustState === "Certified") return "Certified public AI system";
  if (trustState === "Approved") return "Evaluated AI system (not yet certified)";
  return "Unverified system";
}

function safeText(value: string | null | undefined, fallback = "—") {
  const v = String(value ?? "").trim();
  return v ? v : fallback;
}

export default async function ExplorerSystemsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const page = Math.max(1, Number(searchParams?.page || "1") || 1);
  const pageSize = Math.max(1, Number(searchParams?.pageSize || "200") || 200);

  const result = await getRegistryAiSystemsPaginated({ page, pageSize });
  const systems = result.rows;

  const certifiedCount = systems.filter((row) =>
    Boolean(String(row.certifiedAt ?? "").trim())
  ).length;

  const approvedOnlyCount = systems.filter((row) => {
    const hasCertifiedAt = Boolean(String(row.certifiedAt ?? "").trim());
    const decision = String(row.decisionStatus ?? "").trim().toUpperCase();
    return !hasCertifiedAt && decision === "APPROVED";
  }).length;

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
            <p>Explorer distinguishes between evaluated systems and publicly trusted systems.</p>

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

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Public AI systems in the trust surface
              </h2>

              <p className="mt-3 max-w-[820px] text-[15px] leading-[1.8] text-black/68">
                Browse public system metadata connected to GAFAIG registry records, including deployment status, risk tier, oversight posture, certification signals, and public summaries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[12px] text-black/55">
                {systems.length} total systems
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] text-emerald-700">
                {certifiedCount} certified
              </div>
              <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] text-blue-700">
                {approvedOnlyCount} approved only
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {systems.map((row) => {
              const trust = normalizeTrustState(row.certifiedAt, row.decisionStatus);
              const trustLabel = trustDescriptor(trust.label);

              return (
                <article
                  key={row.systemId}
                  className="rounded-2xl border border-black/10 bg-white p-5 md:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[24px] font-semibold leading-[1.2] tracking-tight text-black">
                          {safeText(row.systemName, "Unnamed system")}
                        </h3>

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${toneForRisk(
                            row.riskTier
                          )}`}
                        >
                          {safeText(row.riskTier, "Unknown risk")}
                        </span>

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${trust.className}`}
                        >
                          {trust.label}
                        </span>

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${toneForTier(
                            row.certifiedBand
                          )}`}
                        >
                          {safeText(row.certifiedTier, "—")}
                        </span>

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${toneForTier(
                            row.certifiedBand
                          )}`}
                        >
                          {safeText(row.certifiedBand, "—")}
                        </span>
                      </div>

                      <div className="mt-1 text-[13px] font-medium text-black/60">
                        {trustLabel}
                      </div>

                      <div className="mt-2 text-[13px] leading-[1.7] text-black/60">
                        {safeText(row.developerOrganization, "Unknown developer")} ·{" "}
                        {safeText(row.country, "Unknown country")} ·{" "}
                        {safeText(row.systemType, "Unknown type")} ·{" "}
                        {safeText(row.deploymentStatus, "Unknown deployment")} ·{" "}
                        {safeText(row.oversightLevel, "Unknown oversight")}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <PublicButtonLink
                        href={`/verify/${row.registryId}`}
                        variant="primary"
                      >
                        View System Profile
                      </PublicButtonLink>

                      <PublicButtonLink
                        href={`/registry/${row.registryId}`}
                        variant="secondary"
                      >
                        View Certified Record
                      </PublicButtonLink>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-6">
                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Registry ID
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {safeText(row.registryId)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Case ID
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {safeText(row.caseId)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Human Review
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {row.humanReviewRequired === true
                          ? "Required"
                          : row.humanReviewRequired === false
                          ? "Not required"
                          : "—"}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Oversight Model
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {safeText(row.oversightModel)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Audit Frequency
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {safeText(row.auditFrequency)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Trust State
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {trust.label}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Decision
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {safeText(row.decisionStatus)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Training Data
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {safeText(row.trainingDataCategory)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Trust State
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {trust.label}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/8 bg-[#fafafa] p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                        Country
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-black/78">
                        {safeText(row.country)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-black/8 bg-[#fafafa] p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                      Intended Use
                    </div>
                    <div className="mt-2 text-[13px] leading-[1.7] text-black/72">
                      {safeText(row.intendedUse)}
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-black/8 bg-[#fafafa] p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                      Public Summary
                    </div>
                    <div className="mt-2 text-[13px] leading-[1.7] text-black/72">
                      {String(row.publicSummary ?? "").trim() || "No public summary provided for this system."}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PublicButtonLink href="/explorer" variant="secondary">
              Explorer
            </PublicButtonLink>
            <PublicButtonLink href="/explorer/organizations" variant="secondary">
              Organizations
            </PublicButtonLink>
            <PublicButtonLink href="/explorer/countries" variant="secondary">
              Countries
            </PublicButtonLink>
            <PublicButtonLink href="/registry/ai-systems" variant="secondary">
              Open AI Systems Registry
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  if (v === "A") return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (v === "B") return "bg-blue-100 text-blue-700 border border-blue-200";
  if (v === "C") return "bg-amber-100 text-amber-700 border border-amber-200";
  if (v === "D") return "bg-slate-100 text-slate-700 border border-slate-200";
  return "bg-slate-100 text-slate-600 border border-slate-200";
}

function toneForRisk(value: string | null | undefined) {
  const v = String(value || "").toLowerCase();
  if (v === "high") return "bg-red-100 text-red-700 border border-red-200";
  if (v === "medium") return "bg-amber-100 text-amber-700 border border-amber-200";
  if (v === "low") return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  return "bg-slate-100 text-slate-600 border border-slate-200";
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
      className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      isCertified: true,
    };
  }

  if (decision === "APPROVED") {
    return {
      label: "Approved",
      className: "bg-blue-100 text-blue-700 border border-blue-200",
      isCertified: false,
    };
  }

  return {
    label: "Unverified",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
    isCertified: false,
  };
}

function safeText(value: string | null | undefined, fallback = "—") {
  const v = String(value ?? "").trim();
  return v ? v : fallback;
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-black">{value}</div>
    </div>
  );
}

export default async function ExplorerSystemsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const page = Math.max(1, Number(searchParams?.page || "1") || 1);
  const pageSize = Math.max(1, Number(searchParams?.pageSize || "200") || 200);

  const result = await getRegistryAiSystemsPaginated({ page, pageSize });
  const systems = result.rows ?? [];

  const certifiedCount = systems.filter((row) =>
    Boolean(String(row.certifiedAt ?? "").trim())
  ).length;

  return (
    <main className="mx-auto max-w-[1180px] space-y-8 px-6 py-10">
      <PublicPageHero
        eyebrow="Explorer"
        title="Public AI systems"
        description="Certified public AI systems represented across the GAFAIG trust surface."
        actions={
          <>
            <PublicButtonLink href="/explorer" variant="secondary">
              Back to Explorer
            </PublicButtonLink>
            <PublicButtonLink href="/registry/ai-systems" variant="primary">
              Open AI Systems Registry
            </PublicButtonLink>
          </>
        }
      />

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="max-w-[980px] space-y-4">
          <p className="text-base leading-7 text-black/70">
            This systems view reflects the public GAFAIG trust surface for AI
            systems linked to certified and published registry records.
          </p>
          <p className="text-base leading-7 text-black/70">
            Approved-only workflow records remain private. Public systems shown
            here are tied to certified registry outcomes only.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Public systems
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {systems.length}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Certified
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {certifiedCount}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Page
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">{page}</div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Page size
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {pageSize}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Systems directory
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Certified public AI systems
            </h2>
            <p className="max-w-3xl text-base leading-7 text-black/70">
              Browse public AI systems linked to certified registry records,
              including trust status, organization, country, risk posture, and
              registry linkage.
            </p>
          </div>
          <div className="text-sm text-black/45">{systems.length} shown</div>
        </div>

        <div className="mt-6 space-y-4">
          {systems.map((row: any) => {
            const trustState = normalizeTrustState(
              row.certifiedAt,
              row.decisionStatus
            );

            return (
              <article
                key={row.systemId}
                className="rounded-2xl border border-black/10 bg-white p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${trustState.className}`}
                      >
                        {trustState.label}
                      </span>

                      {row.certifiedTier ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${toneForTier(
                            row.certifiedBand
                          )}`}
                        >
                          {safeText(row.certifiedTier)}
                          {row.certifiedBand
                            ? ` · ${safeText(row.certifiedBand)}`
                            : ""}
                        </span>
                      ) : null}

                      {row.riskTier ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${toneForRisk(
                            row.riskTier
                          )}`}
                        >
                          {safeText(row.riskTier)} risk
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <div className="text-2xl font-semibold tracking-tight text-black">
                        {safeText(row.systemName)}
                      </div>
                      <div className="mt-1 text-sm text-black/50">
                        {safeText(row.entityName)} · {safeText(row.country)} ·{" "}
                        {safeText(row.systemId)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <PublicButtonLink
                      href={`/registry/ai-systems/${encodeURIComponent(
                        row.systemId
                      )}`}
                      variant="secondary"
                    >
                      System detail
                    </PublicButtonLink>
                    <PublicButtonLink
                      href={`/registry/${encodeURIComponent(row.registryId)}`}
                      variant="primary"
                    >
                      Registry record
                    </PublicButtonLink>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Organization"
                    value={safeText(
                      row.developerOrganization ?? row.entityName
                    )}
                  />
                  <MetricCard
                    label="System type"
                    value={safeText(row.systemType)}
                  />
                  <MetricCard
                    label="Oversight"
                    value={safeText(row.oversightLevel)}
                  />
                  <MetricCard
                    label="Deployment"
                    value={safeText(row.deploymentStatus)}
                  />
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Intended use"
                    value={safeText(row.intendedUse)}
                  />
                  <MetricCard
                    label="Certified"
                    value={fmtDate(row.certifiedAt)}
                  />
                  <MetricCard
                    label="Decision"
                    value={safeText(row.decisionStatus)}
                  />
                  <MetricCard
                    label="Lifecycle"
                    value={safeText(row.lifecycleStatus)}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
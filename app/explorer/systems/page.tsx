export const dynamic = "force-dynamic";
export const revalidate = 0;

import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getRegistryAiSystemsPaginated } from "@/lib/queries/registry-ai-systems";

type SearchParams = {
  page?: string;
  pageSize?: string;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US");
}

function safeText(value: string | null | undefined, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function trustPillClass(label: string) {
  const normalized = label.trim().toUpperCase();

  if (normalized === "CERTIFIED") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized === "APPROVED") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-neutral-100 text-black/65";
}

function riskPillClass(label: string) {
  const normalized = label.trim().toUpperCase();

  if (normalized === "HIGH") {
    return "bg-red-100 text-red-700";
  }

  if (normalized === "MEDIUM") {
    return "bg-amber-100 text-amber-700";
  }

  if (normalized === "LOW") {
    return "bg-emerald-100 text-emerald-700";
  }

  return "bg-neutral-100 text-black/65";
}

function MetricCell({
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
  const pageSize = Math.max(1, Number(searchParams?.pageSize || "24") || 24);

  const result = await getRegistryAiSystemsPaginated({ page, pageSize });
  const rows = result.rows ?? [];
  const total = Number(result.total ?? rows.length);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="mx-auto max-w-[1180px] space-y-8 px-6 py-10">
      <PublicPageHero
        eyebrow="Explorer Systems"
        title="Public AI systems in the GAFAIG trust surface"
      />

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="max-w-4xl space-y-4">
          <p className="text-base leading-7 text-black/70">
            This page lists publicly visible AI systems linked to certified
            GAFAIG registry records. It is the systems view of the public trust
            surface.
          </p>
          <p className="text-base leading-7 text-black/70">
            Approved-only workflow records remain private. Systems shown here
            are tied to certified and published registry outcomes only.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <PublicButtonLink href="/explorer">Back to Explorer</PublicButtonLink>
            <PublicButtonLink href="/registry/ai-systems">
              AI Systems Registry
            </PublicButtonLink>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Systems shown
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {rows.length}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Total systems
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">{total}</div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Page
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">{page}</div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Total pages
          </div>
          <div className="mt-3 text-3xl font-semibold text-black">
            {totalPages}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Public systems directory
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Certified public AI systems
            </h2>
            <p className="text-base leading-7 text-black/70">
              Browse public AI systems linked to certified registry records,
              including organization, country, trust state, and registry
              linkage.
            </p>
          </div>

          <div className="text-sm text-black/45">{rows.length} shown</div>
        </div>

        <div className="mt-6 space-y-4">
          {rows.map((row: any) => {
            const certificationStatus = safeText(row.certificationStatus, "");
            const decisionStatus = safeText(row.decisionStatus, "");
            const riskTier = safeText(row.riskTier, "");
            const certificationLabel =
              row.certifiedTier && row.certifiedBand
                ? `${row.certifiedTier} ${row.certifiedBand}`
                : safeText(row.certifiedTier);

            return (
              <article
                key={row.systemId}
                className="rounded-2xl border border-black/10 bg-white p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {certificationStatus ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${trustPillClass(
                            certificationStatus
                          )}`}
                        >
                          {certificationStatus}
                        </span>
                      ) : null}

                      {decisionStatus ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${trustPillClass(
                            decisionStatus
                          )}`}
                        >
                          {decisionStatus}
                        </span>
                      ) : null}

                      {riskTier ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${riskPillClass(
                            riskTier
                          )}`}
                        >
                          {riskTier} risk
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
                    <a
                      href={`/registry/ai-systems/${encodeURIComponent(
                        row.systemId
                      )}`}
                      className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                    >
                      System Detail
                    </a>

                    <a
                      href={`/registry/${encodeURIComponent(row.registryId)}`}
                      className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                    >
                      View Certified Record
                    </a>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCell
                    label="Organization"
                    value={safeText(
                      row.developerOrganization || row.entityName
                    )}
                  />
                  <MetricCell
                    label="System type"
                    value={safeText(row.systemType)}
                  />
                  <MetricCell
                    label="Intended use"
                    value={safeText(row.intendedUse)}
                  />
                  <MetricCell
                    label="Deployment"
                    value={safeText(row.deploymentStatus)}
                  />
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCell
                    label="Certification"
                    value={certificationLabel}
                  />
                  <MetricCell
                    label="Certified"
                    value={formatDate(row.certifiedAt)}
                  />
                  <MetricCell
                    label="Oversight"
                    value={safeText(row.oversightLevel)}
                  />
                  <MetricCell
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
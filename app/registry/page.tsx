import Link from "next/link";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import {
  getRegistryCountries,
  searchRegistryRecords,
} from "@/lib/queries/registry";

export const revalidate = 300;

type RegistryPageSearchParams = {
  q?: string;
  country?: string;
};

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTierBand(tier?: string | null, band?: string | null) {
  const safeTier = String(tier ?? "").trim();
  const safeBand = String(band ?? "").trim();

  if (safeTier && safeBand) return `${safeTier} · ${safeBand}`;
  if (safeTier) return safeTier;
  if (safeBand) return safeBand;
  return "—";
}

function toneForDecision(value: string | null | undefined) {
  const v = String(value || "").trim().toUpperCase();

  if (v === "APPROVED") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function getTrustState(row: {
  certifiedAt?: string | null;
  decisionStatus?: string | null;
}) {
  if (row.certifiedAt) {
    return {
      label: "Verified",
      className:
        "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200",
    };
  }

  if (String(row.decisionStatus ?? "").trim().toUpperCase() === "APPROVED") {
    return {
      label: "Approved",
      className:
        "rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200",
    };
  }

  return {
    label: "Pending",
    className:
      "rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200",
  };
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams?: RegistryPageSearchParams;
}) {
  const q = String(searchParams?.q ?? "").trim();
  const country = String(searchParams?.country ?? "").trim();

  const [allRows, countries] = await Promise.all([
    searchRegistryRecords({
      q,
      country,
      limit: 500,
    }),
    getRegistryCountries(),
  ]);

  const rows = allRows.filter((row) =>
    Boolean(String(row.certifiedAt ?? "").trim())
  );

  return (
    <main className="mx-auto max-w-[1320px] px-6 pb-16 pt-14 lg:px-8">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="REGISTRY OF RECORD"
          title="Certified public AI governance registry"
          description="The GAFAIG Registry is the canonical public record of certified outcomes issued through the GAFAIG verification framework. This page is intentionally reserved for records with a surfaced public certification outcome."
          secondaryDescription="Approved but uncertified records belong in Explorer. Registry is the stricter certification layer of record."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Open Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/verify" variant="secondary">
                Verify a record
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <form action="/registry">
            <div className="space-y-3">
              <label className="block text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Search certified records
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Entity, registry ID, application ID, or case ID"
                  className="h-14 min-w-[280px] flex-1 rounded-full border border-black/10 px-6 text-[15px] outline-none focus:border-black/20"
                />

                <select
                  name="country"
                  defaultValue={country}
                  className="h-14 min-w-[160px] rounded-full border border-black/10 bg-white px-5 text-[15px]"
                >
                  <option value="">All countries</option>
                  {countries.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="h-14 rounded-full border border-black bg-black px-6 text-[15px] font-semibold text-white hover:bg-black/90"
                >
                  Apply
                </button>

                <Link
                  href="/registry"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-black/10 px-6 text-[15px] font-semibold hover:bg-black/[0.04]"
                >
                  Reset
                </Link>
              </div>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                CERTIFIED PUBLIC RECORDS
              </div>

              <h2 className="mt-4 text-[32px] font-semibold tracking-tight md:text-[40px]">
                Registry directory
              </h2>

              <p className="mt-3 max-w-[860px] text-[15px] leading-[1.8] text-black/70">
                Browse surfaced certified records by organization, jurisdiction,
                and registry identifier.
              </p>
            </div>

            <div className="text-[13px] text-black/50">
              {rows.length} visible certified records
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {rows.length > 0 ? (
              rows.map((row) => {
                const trustState = getTrustState(row);

                return (
                  <article
                    key={row.registryId}
                    className="rounded-3xl border border-black/10 p-6 md:p-7"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className={trustState.className}>
                            {trustState.label}
                          </span>

                          {row.decisionStatus ? (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneForDecision(
                                row.decisionStatus
                              )}`}
                            >
                              {row.decisionStatus}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-3 text-[24px] font-semibold tracking-tight">
                          {row.entityName || "Unknown entity"}
                        </h3>

                        <div className="text-sm text-black/60">
                          {row.country || "—"} · {row.registryId}
                        </div>
                      </div>

                      <PublicButtonLink
                        href={`/registry/${row.registryId}`}
                        variant="secondary"
                        size="sm"
                      >
                        Open
                      </PublicButtonLink>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                      <InfoCard
                        label="Certification"
                        value={formatTierBand(
                          row.certifiedTier,
                          row.certifiedBand
                        )}
                      />
                      <InfoCard
                        label="Certified"
                        value={formatDate(row.certifiedAt)}
                      />
                      <InfoCard
                        label="Valid From"
                        value={formatDate(row.validFrom)}
                      />
                      <InfoCard
                        label="Valid To"
                        value={formatDate(row.validTo)}
                      />
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] p-8 text-[15px] text-black/60">
                No certified registry records matched your current search.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-xs uppercase text-black/60">{label}</div>
      <div className="mt-2 font-medium">{value}</div>
    </div>
  );
}
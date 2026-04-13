import Link from "next/link";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { searchRegistryRecords } from "@/lib/queries/registry";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function getCountries(
  rows: Awaited<ReturnType<typeof searchRegistryRecords>>
): string[] {
  return Array.from(
    new Set(
      rows
        .map((row) => String(row.country ?? "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
}

function toneForDecision(value: string | null | undefined) {
  const v = String(value || "").trim().toUpperCase();

  if (v === "APPROVED") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams?: RegistryPageSearchParams;
}) {
  const q = String(searchParams?.q ?? "").trim();
  const country = String(searchParams?.country ?? "").trim();

  const allRows = await searchRegistryRecords({ limit: 500 });
  const rows = await searchRegistryRecords({
    q,
    country,
    limit: 500,
  });

  const countries = getCountries(allRows);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="REGISTRY OF RECORD"
          title="Public AI governance registry of record"
          description="The GAFAIG Registry is the canonical public record of certification outcomes issued through the GAFAIG verification framework. Each record provides a verifiable trust signal with certification status, tier, band, and validity without exposing private evidence or internal review workflows."
          secondaryDescription="Registry is the canonical record layer. Use Explorer to discover organizations, countries, and AI systems across the broader GAFAIG public trust surface."
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

        {/* SEARCH SECTION — FIXED */}
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <form action="/registry">
            <div className="space-y-3">
              <label className="block text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Search records
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Entity, registry ID, application ID, or case ID"
                  className="flex-1 min-w-[280px] h-14 rounded-full border border-black/10 px-6 text-[15px] outline-none focus:border-black/20"
                />

                <select
                  name="country"
                  defaultValue={country}
                  className="h-14 min-w-[160px] rounded-full border border-black/10 px-5 text-[15px] bg-white"
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
                  className="h-14 inline-flex items-center justify-center rounded-full border border-black/10 px-6 text-[15px] font-semibold hover:bg-black/[0.04]"
                >
                  Reset
                </Link>
              </div>
            </div>
          </form>
        </section>

        {/* DIRECTORY */}
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                PUBLIC RECORDS
              </div>

              <h2 className="mt-4 text-[32px] font-semibold tracking-tight md:text-[38px]">
                Registry directory
              </h2>

              <p className="mt-3 max-w-[820px] text-[15px] leading-[1.8] text-black/70">
                Browse surfaced certification records by organization,
                jurisdiction, and registry identifier.
              </p>
            </div>

            <div className="text-[13px] text-black/50">
              {rows.length} visible records
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {rows.map((row) => (
              <article
                key={row.registryId}
                className="rounded-3xl border border-black/10 p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Verified
                      </span>

                      {row.decisionStatus && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneForDecision(
                            row.decisionStatus
                          )}`}
                        >
                          {row.decisionStatus}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-[22px] font-semibold">
                      {row.entityName || "Unknown entity"}
                    </h3>

                    <div className="text-sm text-black/60">
                      {row.country} · {row.registryId}
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

                <div className="mt-5 grid md:grid-cols-4 gap-3">
                  <InfoCard
                    label="Certification"
                    value={formatTierBand(row.certifiedTier, row.certifiedBand)}
                  />
                  <InfoCard label="Certified" value={formatDate(row.certifiedAt)} />
                  <InfoCard label="Valid From" value={formatDate(row.validFrom)} />
                  <InfoCard label="Valid To" value={formatDate(row.validTo)} />
                </div>
              </article>
            ))}
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
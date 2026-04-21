import Link from "next/link";
import {
  getExplorerStats,
  getLatestExplorerRecords,
  getExplorerOrganizations,
  getExplorerCountries,
} from "@/lib/queries/explorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function titleCase(value: string | null | undefined): string {
  if (!value) return "—";
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

export default async function ExplorerPage() {
  const [stats, records, organizations, countries] = await Promise.all([
    getExplorerStats(),
    getLatestExplorerRecords(8),
    getExplorerOrganizations(8),
    getExplorerCountries(8),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-4 pb-16 pt-6 md:px-6 lg:px-8">
        <section className="rounded-[28px] border border-black/10 bg-white px-6 py-6 md:px-8 md:py-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-black/45">
            Public Trust Surface
          </p>
          <h1 className="max-w-[780px] text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-black md:text-[48px]">
            Explore the public GAFAIG trust surface
          </h1>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white px-6 py-6 md:px-8 md:py-8">
          <p className="max-w-[860px] text-[15px] leading-7 text-black/65">
            Explorer shows the broader public governance footprint across
            organizations, countries, and publicly surfaced records in the
            GAFAIG network.
          </p>
          <p className="mt-3 max-w-[860px] text-[15px] leading-7 text-black/65">
            Public registry visibility includes only certified and published
            records.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/registry"
              className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 text-[13px] font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
            >
              View Registry
            </Link>
            <Link
              href="/explorer/organizations"
              className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 text-[13px] font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
            >
              Organizations
            </Link>
            <Link
              href="/explorer/countries"
              className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 text-[13px] font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
            >
              Countries
            </Link>
            <Link
              href="/registry/ai-systems"
              className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 text-[13px] font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
            >
              AI Systems
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white px-6 py-6 md:px-8 md:py-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-black/45">
            How to Read Explorer
          </p>
          <h2 className="max-w-[760px] text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-black md:text-[36px]">
            Certified and published records appear in the public trust surface
          </h2>
          <p className="mt-4 max-w-[860px] text-[15px] leading-7 text-black/65">
            Explorer is broader than a single Registry of Record detail page,
            but it still follows the public trust policy. Only records that have
            completed publication are shown here.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-black/10 bg-[#fafaf8] p-5">
              <p className="text-[13px] font-semibold text-black">Certified</p>
              <p className="mt-2 text-[14px] leading-6 text-black/60">
                Certified means the evaluated outcome has been finalized,
                published into the GAFAIG registry, assigned certification
                metadata, and surfaced as a public record.
              </p>
            </div>
            <div className="rounded-[20px] border border-black/10 bg-[#fafaf8] p-5">
              <p className="text-[13px] font-semibold text-black">
                Explorer visibility
              </p>
              <p className="mt-2 text-[14px] leading-6 text-black/60">
                Approved-only workflow records remain private. Explorer and the
                public registry reflect published trust records only.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-black/10 bg-white px-6 py-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/45">
              Public Records
            </p>
            <p className="mt-3 text-[18px] font-semibold text-black">
              {stats.publicRecords}
            </p>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-white px-6 py-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/45">
              Certified
            </p>
            <p className="mt-3 text-[18px] font-semibold text-black">
              {stats.certifiedRecords}
            </p>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-white px-6 py-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/45">
              Organizations
            </p>
            <p className="mt-3 text-[18px] font-semibold text-black">
              {stats.organizations}
            </p>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-white px-6 py-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/45">
              Countries
            </p>
            <p className="mt-3 text-[18px] font-semibold text-black">
              {stats.countries}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white px-6 py-6 md:px-8 md:py-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/45">
                Latest Public Records
              </p>
              <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-black">
                Public records currently visible in Explorer
              </h2>
              <p className="mt-3 max-w-[760px] text-[15px] leading-7 text-black/65">
                This view surfaces public registry metadata across entities and
                certification state without exposing private reviewer materials.
              </p>
            </div>

            <p className="hidden text-[13px] text-black/40 md:block">
              {records.length} shown
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {records.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-black/15 bg-[#fafaf8] px-6 py-10 text-[15px] text-black/55">
                No public explorer records are currently available.
              </div>
            ) : (
              records.map((row) => (
                <article
                  key={row.registryId}
                  className="rounded-[24px] border border-black/10 bg-[#fcfcfb] p-5 md:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-[#c8f0db] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0f6b45]">
                          Certified
                        </span>
                        <span className="inline-flex rounded-full bg-[#d9e6ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2a58c9]">
                          {titleCase(row.decisionStatus)}
                        </span>
                      </div>

                      <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-black">
                        {row.entityName ?? "Unnamed record"}
                      </h3>

                      <p className="mt-1 text-[14px] text-black/45">
                        {row.country ?? "—"} · {row.registryId}
                      </p>
                    </div>

                    <Link
                      href={`/registry/${row.registryId}`}
                      className="inline-flex shrink-0 items-center justify-center rounded-full border border-black/15 px-4 py-2 text-[13px] font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
                    >
                      View Certified Record
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <div className="rounded-[18px] border border-black/10 bg-white px-4 py-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/40">
                        Certification
                      </p>
                      <p className="mt-3 text-[14px] font-medium text-black">
                        {(row.certifiedTier ?? "—") +
                          (row.certifiedBand ? ` · ${row.certifiedBand}` : "")}
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-black/10 bg-white px-4 py-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/40">
                        Certified
                      </p>
                      <p className="mt-3 text-[14px] font-medium text-black">
                        {formatDate(row.certifiedAt)}
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-black/10 bg-white px-4 py-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/40">
                        Valid From
                      </p>
                      <p className="mt-3 text-[14px] font-medium text-black">
                        {formatDate(row.validFrom)}
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-black/10 bg-white px-4 py-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/40">
                        Valid To
                      </p>
                      <p className="mt-3 text-[14px] font-medium text-black">
                        {formatDate(row.validTo)}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-black/10 bg-white px-6 py-6 md:px-8 md:py-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/45">
                  Organizations
                </p>
                <h2 className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-black">
                  Public organizations in scope
                </h2>
              </div>
              <Link
                href="/explorer/organizations"
                className="hidden rounded-full border border-black/15 px-4 py-2 text-[13px] font-medium text-black transition hover:border-black hover:bg-black hover:text-white md:inline-flex"
              >
                View All
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {organizations.map((item) => (
                <Link
                  key={item.name}
                  href={`/registry?organization=${encodeURIComponent(item.name)}`}
                  className="inline-flex rounded-full border border-black/10 bg-[#fafaf8] px-3 py-2 text-[13px] text-black/70 transition hover:border-black hover:text-black"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white px-6 py-6 md:px-8 md:py-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black/45">
                  Countries
                </p>
                <h2 className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-black">
                  Countries represented in public records
                </h2>
              </div>
              <Link
                href="/explorer/countries"
                className="hidden rounded-full border border-black/15 px-4 py-2 text-[13px] font-medium text-black transition hover:border-black hover:bg-black hover:text-white md:inline-flex"
              >
                View All
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {countries.map((item) => (
                <Link
                  key={item.country}
                  href={`/registry?country=${encodeURIComponent(item.country)}`}
                  className="inline-flex rounded-full border border-black/10 bg-[#fafaf8] px-3 py-2 text-[13px] text-black/70 transition hover:border-black hover:text-black"
                >
                  {item.country}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
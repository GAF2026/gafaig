import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import { getExplorerStats, getLatestExplorerRecords } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatText(value: string | null): string {
  return value && value.trim().length > 0 ? value : "—";
}

export default async function ExplorerPage() {
  const [stats, latestRecords] = await Promise.all([
    getExplorerStats(),
    getLatestExplorerRecords(8),
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="Public Trust Surface"
          title="Explore the public GAFAIG trust surface"
          description="Explorer shows the broader public governance footprint across organizations, countries, and publicly surfaced records in the GAFAIG network."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="secondary">
                View Registry
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/organizations" variant="secondary">
                Organizations
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Countries
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/systems" variant="secondary">
                AI Systems
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              How to read Explorer
            </div>
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Certified and published records appear in the public trust surface
            </h2>
            <p className="text-[15px] leading-7 text-black/75">
              Explorer is broader than a single Registry of Record detail page, but it
              still follows the public trust policy. Only records that have completed
              publication are shown here.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <h3 className="text-[18px] font-semibold tracking-tight text-black">
                Certified
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-black/75">
                Certified means the evaluated outcome has been finalized, published
                into the GAFAIG registry, assigned certification metadata, and surfaced
                as a public record.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <h3 className="text-[18px] font-semibold tracking-tight text-black">
                Explorer visibility
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-black/75">
                Approved-only workflow records remain private. Explorer and the public
                registry reflect published trust records only.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Public Records
            </div>
            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.publicRecords)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Certified
            </div>
            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.certified)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Organizations
            </div>
            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.organizations)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Countries
            </div>
            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.countries)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Systems
            </div>
            <div className="mt-4 text-[40px] font-semibold tracking-tight text-black">
              {formatNumber(stats.systems)}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-4xl">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Latest Public Records
              </div>
              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                Public records currently visible in Explorer
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-black/75">
                This view surfaces public registry metadata across entities and
                certification state without exposing private reviewer materials.
              </p>
            </div>

            <div className="text-[14px] text-black/70">
              {latestRecords.length} shown
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {latestRecords.map((record) => (
              <article
                key={record.registryId}
                className="rounded-3xl border border-black/10 bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-[14px] font-semibold text-emerald-800">
                        {formatText(record.certificationStatus)}
                      </span>
                      {record.certifiedBand ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-[14px] font-semibold text-blue-800">
                          {record.certifiedBand}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="text-[26px] font-semibold tracking-tight text-black">
                        {record.entityName}
                      </h3>
                      <p className="mt-2 text-[14px] text-black/70">
                        {formatText(record.country)} · {record.registryId}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <PublicButtonLink
                      href={`/registry/${record.registryId}`}
                      variant="secondary"
                    >
                      View Certified Record
                    </PublicButtonLink>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                      Certification
                    </div>
                    <div className="mt-3 text-[18px] font-semibold text-black">
                      {formatText(record.certificationStatus)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                      Certified
                    </div>
                    <div className="mt-3 text-[18px] font-semibold text-black">
                      {formatDate(record.certifiedAt)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                      Valid From
                    </div>
                    <div className="mt-3 text-[18px] font-semibold text-black">
                      {formatDate(record.validFrom)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                      Valid To
                    </div>
                    <div className="mt-3 text-[18px] font-semibold text-black">
                      {formatDate(record.validTo)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
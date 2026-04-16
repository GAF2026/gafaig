import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import { getRegistryList } from "@/lib/queries/registry";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US");
}

function getCertificationLabel(row: any) {
  if (row.certificationLevel) return String(row.certificationLevel);
  if (row.certifiedTier && row.certifiedBand) {
    return `${row.certifiedTier} · ${row.certifiedBand}`;
  }
  if (row.certifiedTier) return String(row.certifiedTier);
  if (row.certifiedBand) return `Band ${row.certifiedBand}`;
  if (row.certificationStatus) return String(row.certificationStatus);
  return "Certified";
}

export default async function RegistryPage() {
  const rows = await getRegistryList();

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="REGISTRY OF RECORD"
          title="Certified public AI governance registry"
          description="This registry serves as the public record of AI governance certifications issued through the GAFAIG verification engine."
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
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            HOW TO READ THE REGISTRY
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public certification outcomes published through the GAFAIG trust layer
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            The registry discloses certification outcomes without exposing private
            reviewer materials, internal evidence, or controlled workflow details.
            Each published record represents a public trust artifact that can be
            opened, inspected, and independently verified.
          </p>

          <div className="mt-7 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              Status definitions
            </div>

            <div className="mt-4 space-y-5">
              <div>
                <div className="text-[16px] font-semibold text-black">
                  Approved
                </div>
                <p className="mt-2 text-[15px] leading-[1.8] text-black/75">
                  A system has completed the full GAFAIG evaluation process,
                  including findings, evidence review, and governance scoring.
                </p>
              </div>

              <div>
                <div className="text-[16px] font-semibold text-black">
                  Certified
                </div>
                <p className="mt-2 text-[15px] leading-[1.8] text-black/75">
                  The evaluated outcome has been finalized, assigned a governance
                  score and certification tier, and published as a verifiable
                  public record in the registry.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[920px]">
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                CERTIFIED PUBLIC RECORDS
              </div>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Registry directory
              </h2>

              <p className="mt-3 max-w-[860px] text-[16px] leading-[1.85] text-black/75">
                Browse certified public trust records by organization,
                jurisdiction, and registry identifier.
              </p>
            </div>

            <div className="shrink-0 text-[15px] font-medium text-black/45">
              {rows.length} certified records
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {rows.map((row: any) => {
              const certificationStatus = String(
                row.certificationStatus || ""
              ).trim();
              const decisionStatus = String(row.decisionStatus || "").trim();

              return (
                <article
                  key={row.registryId}
                  className="rounded-2xl border border-black/10 bg-white p-5 md:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {certificationStatus ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-semibold text-emerald-700">
                            {certificationStatus}
                          </span>
                        ) : null}

                        {decisionStatus ? (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-[12px] font-semibold uppercase text-blue-700">
                            {decisionStatus}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-4 text-[26px] font-semibold leading-[1.08] tracking-tight text-black">
                        {row.entityName || row.registryId}
                      </h3>

                      <div className="mt-2 text-[15px] leading-[1.6] text-black/45">
                        {(row.country || "—") + " · " + (row.registryId || "—")}
                      </div>
                    </div>

                    <Link
                      href={`/registry/${row.registryId}`}
                      className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-black/20 bg-white px-4 text-[13px] font-semibold text-black transition hover:bg-black hover:text-white"
                    >
                      Open
                    </Link>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                        Certification
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-[1.4] text-black">
                        {getCertificationLabel(row)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                        Certified
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-[1.4] text-black">
                        {formatDate(row.certifiedAt)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                        Valid from
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-[1.4] text-black">
                        {formatDate(row.validFrom)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                        Valid to
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-[1.4] text-black">
                        {formatDate(row.validTo)}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
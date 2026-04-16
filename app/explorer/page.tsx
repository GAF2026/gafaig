import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import {
  getExplorerSummary,
  getRecentRegistryRecords,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function safe(value: unknown, fallback = "—") {
  const s = String(value ?? "").trim();
  return s || fallback;
}

function formatDate(value: unknown) {
  const s = String(value ?? "").trim();
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-US");
}

function formatTierBand(tier: unknown, band: unknown) {
  const t = safe(tier, "");
  const b = safe(band, "");
  if (t && b) return `${t} · ${b}`;
  if (t) return t;
  if (b) return b;
  return "—";
}

function formatCount(value: unknown) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US");
}

function trustTone(certificationStatus: unknown, decisionStatus: unknown) {
  const cert = safe(certificationStatus, "").toUpperCase();
  const decision = safe(decisionStatus, "").toUpperCase();

  if (cert === "CERTIFIED") {
    return {
      label: "Certified",
      className:
        "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-200",
    };
  }

  if (decision === "APPROVED") {
    return {
      label: "Approved",
      className:
        "inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700 ring-1 ring-blue-200",
    };
  }

  return {
    label: "Public",
    className:
      "inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 ring-1 ring-slate-200",
  };
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
        {label}
      </div>
      <div className="mt-3 text-[28px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

export default async function ExplorerPage() {
  const summary = ((await getExplorerSummary()) ?? {}) as any;
  const recentRecords = (((await getRecentRegistryRecords()) ?? []) as any[]).slice(
    0,
    8
  );

  const totalRecords = formatCount(
    summary.totalRecords ?? summary.recordCount ?? summary.records ?? 0
  );
  const certifiedCount = formatCount(
    summary.certifiedCount ?? summary.certified ?? 0
  );
  const approvedCount = formatCount(
    summary.approvedCount ?? summary.approved ?? 0
  );
  const countryCount = formatCount(
    summary.countryCount ?? summary.countries ?? 0
  );

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="PUBLIC TRUST SURFACE"
          title="Explore the public GAFAIG trust surface"
          description="Explorer shows the broader public governance footprint across organizations, countries, and publicly surfaced records in the GAFAIG network."
          secondaryDescription="Explorer includes both evaluated systems and publicly trusted systems."
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
              <PublicButtonLink href="/explorer/systems" variant="primary">
                AI Systems
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            HOW TO READ EXPLORER
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Approved and Certified records appear together in the public surface
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            Explorer is broader than the Registry of Record. It includes both
            systems that have completed evaluation and systems that have already
            been published as certified public trust records.
          </p>

          <div className="mt-7 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="space-y-5 text-[15px] leading-[1.8] text-black/75">
              <div>
                <span className="font-semibold text-black">Approved</span>{" "}
                means a system has completed the GAFAIG evaluation process and
                received a governance decision, but it has not yet been
                published as a certified public record.
              </div>
              <div>
                <span className="font-semibold text-black">Certified</span>{" "}
                means the evaluated outcome has been finalized, assigned a
                governance score and certification tier, and published as a
                verifiable public record in the registry.
              </div>
            </div>
          </div>

          <p className="mt-5 max-w-[960px] text-[15px] leading-[1.8] text-black/62">
            Explorer shows both Approved and Certified records. The Registry of
            Record shows Certified records only.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Public records" value={totalRecords} />
          <MetricCard label="Certified" value={certifiedCount} />
          <MetricCard label="Approved" value={approvedCount} />
          <MetricCard label="Countries" value={countryCount} />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[900px]">
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                LATEST PUBLIC RECORDS
              </div>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Public records currently visible in Explorer
              </h2>

              <p className="mt-4 text-[16px] leading-[1.85] text-black/75">
                This view surfaces public registry metadata across entities and
                certification states without exposing private reviewer materials.
              </p>
            </div>

            <div className="shrink-0 text-[15px] font-medium text-black/45">
              {recentRecords.length} shown
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {recentRecords.map((row: any, index: number) => {
              const entityName = safe(row.entityName ?? row.entity ?? row.organization);
              const registryId = safe(row.registryId);
              const country = safe(row.country);
              const certificationStatus = safe(row.certificationStatus, "");
              const decisionStatus = safe(row.decisionStatus, "");
              const tone = trustTone(certificationStatus, decisionStatus);

              return (
                <article
                  key={`${registryId}-${index}`}
                  className="rounded-2xl border border-black/10 bg-white p-5 md:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={tone.className}>{tone.label}</span>

                        {decisionStatus && decisionStatus !== "—" ? (
                          <span className="inline-flex rounded-full bg-black/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/65 ring-1 ring-black/10">
                            {decisionStatus}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-4 text-[26px] font-semibold leading-[1.08] tracking-tight text-black">
                        {entityName}
                      </h3>

                      <div className="mt-2 text-[15px] leading-[1.6] text-black/45">
                        {country} · {registryId}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-3">
                      <Link
                        href={`/registry/${registryId}`}
                        className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black bg-black px-4 text-[13px] font-semibold text-white transition hover:bg-black/85"
                      >
                        View Certified Record
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                        Certification
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-[1.4] text-black">
                        {formatTierBand(row.certifiedTier, row.certifiedBand)}
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

          <div className="mt-8 flex flex-wrap gap-3">
            <PublicButtonLink href="/explorer/organizations" variant="secondary">
              Browse organizations
            </PublicButtonLink>
            <PublicButtonLink href="/explorer/countries" variant="secondary">
              Browse countries
            </PublicButtonLink>
            <PublicButtonLink href="/explorer/systems" variant="primary">
              Browse AI systems
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
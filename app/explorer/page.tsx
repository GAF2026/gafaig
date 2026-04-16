import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import {
  getExplorerSummary,
  getRecentRegistryRecords,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function firstValue(...values: unknown[]): string {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return "";
}

function safeText(...values: unknown[]): string {
  const value = firstValue(...values);
  return value || "—";
}

function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatCount(value: unknown): string {
  return safeNumber(value, 0).toLocaleString("en-US");
}

function formatDate(...values: unknown[]): string {
  const raw = firstValue(...values);
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US");
}

function formatCertification(tier: string, band: string): string {
  if (tier && band) return `${tier} · ${band}`;
  if (tier) return tier;
  if (band) return band;
  return "—";
}

function normalizeStatus(value: unknown): string {
  return firstValue(value).toUpperCase();
}

function getRegistryCertifiedPillClass() {
  return "inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-semibold text-emerald-700";
}

function getRegistryApprovedPillClass() {
  return "inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[12px] font-semibold uppercase text-blue-700";
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/52">
        {label}
      </div>
      <div className="mt-4 text-[34px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

export default async function ExplorerPage() {
  const [summaryRaw, recentRaw] = await Promise.all([
    getExplorerSummary(),
    getRecentRegistryRecords(),
  ]);

  const summary = (summaryRaw ?? {}) as any;
  const recentRecords = Array.isArray(recentRaw) ? recentRaw.slice(0, 8) : [];

  const derivedCertifiedCount = recentRecords.filter((row: any) => {
    return normalizeStatus(
      row?.certificationStatus ?? row?.CERTIFICATION_STATUS
    ) === "CERTIFIED";
  }).length;

  const derivedApprovedCount = recentRecords.filter((row: any) => {
    return normalizeStatus(row?.decisionStatus ?? row?.DECISION_STATUS) === "APPROVED";
  }).length;

  const derivedCountryCount = new Set(
    recentRecords
      .map((row: any) => firstValue(row?.country, row?.COUNTRY))
      .filter(Boolean)
  ).size;

  const certifiedCountNumber =
    safeNumber(
      summary?.certifiedRecordCount ??
        summary?.certifiedRecords ??
        summary?.certifiedPublicRecords ??
        summary?.CERTIFIED_RECORD_COUNT ??
        summary?.CERTIFIED_COUNT,
      0
    ) || derivedCertifiedCount;

  const approvedCountNumber =
    safeNumber(
      summary?.approvedRecordCount ??
        summary?.approvedRecords ??
        summary?.approvedPublicRecords ??
        summary?.APPROVED_RECORD_COUNT ??
        summary?.APPROVED_COUNT,
      0
    ) || derivedApprovedCount;

  const publicRecordsNumber =
    safeNumber(
      summary?.publicRecordCount ??
        summary?.totalPublicRecords ??
        summary?.recordCount ??
        summary?.totalRecords ??
        summary?.TOTAL_RECORDS ??
        summary?.PUBLIC_RECORD_COUNT,
      0
    ) || certifiedCountNumber + approvedCountNumber || recentRecords.length;

  const countryCountNumber =
    safeNumber(
      summary?.countryCount ??
        summary?.countriesCount ??
        summary?.COUNTRY_COUNT ??
        summary?.COUNTRIES,
      0
    ) || derivedCountryCount;

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
                received a governance decision, but it has not been published as
                a certified public record.
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
          <MetricCard label="Public records" value={formatCount(publicRecordsNumber)} />
          <MetricCard label="Certified" value={formatCount(certifiedCountNumber)} />
          <MetricCard label="Approved" value={formatCount(approvedCountNumber)} />
          <MetricCard label="Countries" value={formatCount(countryCountNumber)} />
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
              const registryId = safeText(
                row?.registryId,
                row?.REGISTRY_ID,
                row?.id,
                row?.ID
              );

              const entityName = safeText(
                row?.entityName,
                row?.ENTITY_NAME,
                row?.organization,
                row?.ORGANIZATION,
                row?.name,
                row?.NAME,
                row?.developerOrganization,
                row?.DEVELOPER_ORGANIZATION,
                registryId
              );

              const country = safeText(
                row?.country,
                row?.COUNTRY,
                row?.jurisdiction,
                row?.JURISDICTION
              );

              const certificationStatus = normalizeStatus(
                row?.certificationStatus ?? row?.CERTIFICATION_STATUS
              );

              const decisionStatus = normalizeStatus(
                row?.decisionStatus ?? row?.DECISION_STATUS
              );

              const tier = firstValue(
                row?.certifiedTier,
                row?.CERTIFIED_TIER,
                row?.tier,
                row?.TIER
              );

              const band = firstValue(
                row?.certifiedBand,
                row?.CERTIFIED_BAND,
                row?.band,
                row?.BAND
              );

              const certifiedAt = formatDate(
                row?.certifiedAt,
                row?.CERTIFIED_AT,
                row?.approvedAt,
                row?.APPROVED_AT,
                row?.publishedAt,
                row?.PUBLISHED_AT
              );

              const validFrom = formatDate(row?.validFrom, row?.VALID_FROM);
              const validTo = formatDate(row?.validTo, row?.VALID_TO);

              return (
                <article
                  key={`${registryId}-${index}`}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {certificationStatus === "CERTIFIED" ? (
                          <span className={getRegistryCertifiedPillClass()}>
                            Certified
                          </span>
                        ) : null}

                        {decisionStatus === "APPROVED" ? (
                          <span className={getRegistryApprovedPillClass()}>
                            APPROVED
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

                  <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                        Certification
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-[1.45] text-black">
                        {formatCertification(tier, band)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                        Certified
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-[1.45] text-black">
                        {certifiedAt}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                        Valid from
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-[1.45] text-black">
                        {validFrom}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                        Valid to
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-[1.45] text-black">
                        {validTo}
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
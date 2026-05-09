import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getOrganizationIntelligence,
  getOrganizationIntelligenceValidation,
} from "@/lib/queries/organization-intelligence";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function numberFormat(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function safe(value: string | null | undefined): string {
  return String(value ?? "").trim() || "—";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </p>
      <p className="mt-3 text-[20px] font-semibold tracking-tight text-black">
        {value}
      </p>
    </div>
  );
}

export default async function ExplorerOrganizationsPage() {
  const [rows, validation] = await Promise.all([
    getOrganizationIntelligence(),
    getOrganizationIntelligenceValidation(),
  ]);

  const totalPublicRecords = rows.reduce(
    (sum, row) => sum + Number(row.totalPublicRecords ?? 0),
    0
  );

  const totalAiSystems = rows.reduce(
    (sum, row) => sum + Number(row.totalAiSystems ?? 0),
    0
  );

  const activeCertifications = rows.reduce(
    (sum, row) => sum + Number(row.activeCertifications ?? 0),
    0
  );

  const countries = new Set(
    rows
      .map((row) => row.country)
      .filter((country) => String(country ?? "").trim() !== "")
  ).size;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / ORGANIZATIONS"
          title="Browse public AI governance intelligence by organization"
          description="This page summarizes organizations represented in GAFAIG’s public trust surface using publication-safe Snowflake governance intelligence views."
          secondaryDescription="Only organizations associated with explicitly published certification records appear here. Private governance evidence, findings, reviewer materials, scoring internals, and execution telemetry are not exposed."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Open Registry
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Browse Countries
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Organizations"
              value={numberFormat(rows.length)}
            />
            <MetricCard
              label="Public Records"
              value={numberFormat(totalPublicRecords)}
            />
            <MetricCard
              label="AI Systems"
              value={numberFormat(totalAiSystems)}
            />
            <MetricCard label="Countries" value={numberFormat(countries)} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Active Certifications"
              value={numberFormat(activeCertifications)}
            />
            <MetricCard
              label="Validation Records"
              value={numberFormat(validation?.totalOrganizations ?? rows.length)}
            />
            <MetricCard
              label="Empty Organization Values"
              value={numberFormat(validation?.emptyOrganizationValues ?? 0)}
            />
            <MetricCard
              label="Null AI System Counts"
              value={numberFormat(validation?.nullAiSystemCounts ?? 0)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Organization Governance Intelligence
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Public governance observability by organization
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Organization intelligence aggregates publication-safe lifecycle,
              renewal, continuity, and AI system disclosure telemetry from
              canonical Snowflake public views.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <p className="text-[14px] text-black/70">{rows.length} shown</p>
          </div>

          <div className="mt-6 grid gap-4">
            {rows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
                <div className="text-lg font-semibold text-black">
                  No published organization intelligence records are currently
                  available.
                </div>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  GAFAIG did not receive organization rows from the canonical
                  Snowflake public organization intelligence view.
                </p>
              </div>
            ) : (
              rows.map((row) => (
                <article
                  key={`${row.organizationName}-${row.country}`}
                  className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/30"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                        Organization Intelligence Profile
                      </p>

                      <h3 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
                        {safe(row.organizationName)}
                      </h3>

                      <p className="mt-2 text-[14px] leading-6 text-black/70">
                        {safe(row.country)} · publication-safe governance
                        observability derived from canonical Snowflake public
                        registry views.
                      </p>
                    </div>

                    <PublicButtonLink
                      href={`/explorer/organizations/${encodeURIComponent(
                        safe(row.organizationName)
                      )}`}
                      variant="primary"
                    >
                      Open Organization Intelligence
                    </PublicButtonLink>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                      label="Public Records"
                      value={numberFormat(row.totalPublicRecords)}
                    />
                    <MetricCard
                      label="AI Systems"
                      value={numberFormat(row.totalAiSystems)}
                    />
                    <MetricCard
                      label="Active Certifications"
                      value={numberFormat(row.activeCertifications)}
                    />
                    <MetricCard
                      label="Continuity Records"
                      value={numberFormat(row.certificationContinuityRecords)}
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                      label="Renewal Due 30 Days"
                      value={numberFormat(row.renewalDue30Days)}
                    />
                    <MetricCard
                      label="Renewal Due 90 Days"
                      value={numberFormat(row.renewalDue90Days)}
                    />
                    <MetricCard
                      label="Expiring 30 Days"
                      value={numberFormat(row.expiring30Days)}
                    />
                    <MetricCard
                      label="Latest Activity"
                      value={formatDate(row.latestPublicationActivity)}
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Public Trust Boundary
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Organization intelligence is publication-safe only
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              This page does not compute trust and does not expose private
              governance execution data. It renders only deterministic public
              projections from Snowflake.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <ul className="grid gap-2 text-[15px] leading-7 text-black/75 md:grid-cols-2">
                <li>findings</li>
                <li>evidence</li>
                <li>reviewer materials</li>
                <li>scoring internals</li>
                <li>governance execution telemetry</li>
                <li>private workflow state</li>
                <li>unpublished certification records</li>
                <li>internal governance state</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
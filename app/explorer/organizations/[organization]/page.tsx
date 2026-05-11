import { notFound } from "next/navigation";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getOrganizationAiSystems,
  getOrganizationCertificationRecords,
  getOrganizationGovernanceSignals,
  getOrganizationIntelligence,
} from "@/lib/queries/organization-intelligence";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    organization: string;
  };
};

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

function formatSignalTitle(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

export default async function OrganizationGovernanceIntelligencePage({
  params,
}: PageProps) {
  const decodedOrganization = decodeURIComponent(params.organization);

  const [organizations, signals, records, systems] = await Promise.all([
    getOrganizationIntelligence(),
    getOrganizationGovernanceSignals(decodedOrganization),
    getOrganizationCertificationRecords(decodedOrganization),
    getOrganizationAiSystems(decodedOrganization),
  ]);

  const organization = organizations.find(
    (row) =>
      row.organizationName.trim().toLowerCase() ===
      decodedOrganization.trim().toLowerCase()
  );

  if (!organization) {
    return notFound();
  }

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / ORGANIZATION INTELLIGENCE"
          title={`${safe(
            organization.organizationName
          )} governance intelligence`}
          description="This organization intelligence profile surfaces publication-safe governance observability derived from GAFAIG’s canonical Snowflake public registry and AI system intelligence views."
          secondaryDescription="This page exposes only publication-safe governance metadata projections. Findings, evidence, reviewer materials, scoring internals, recommendation systems, governance execution telemetry, and private workflow state are not exposed."
          actions={
            <>
              <PublicButtonLink href="/explorer/organizations" variant="primary">
                Back to Organizations
              </PublicButtonLink>

              <PublicButtonLink href="/explorer" variant="secondary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Open Registry
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Published Records"
              value={numberFormat(organization.totalPublicRecords)}
            />
            <MetricCard
              label="AI Systems"
              value={numberFormat(organization.totalAiSystems)}
            />
            <MetricCard
              label="Active Certifications"
              value={numberFormat(organization.activeCertifications)}
            />
            <MetricCard
              label="Continuity Records"
              value={numberFormat(organization.certificationContinuityRecords)}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Renewal Due 30 Days"
              value={numberFormat(organization.renewalDue30Days)}
            />
            <MetricCard
              label="Renewal Due 90 Days"
              value={numberFormat(organization.renewalDue90Days)}
            />
            <MetricCard
              label="Country"
              value={safe(organization.country)}
            />
            <MetricCard
              label="Latest Activity"
              value={formatDate(organization.latestPublicationActivity)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Governance Intelligence Signals
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Publication-safe organization governance intelligence
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Each signal is derived from canonical Snowflake public views and
              summarizes publication-safe lifecycle, renewal, continuity, and AI
              system disclosure intelligence.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {signals.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center md:col-span-2">
                <div className="text-lg font-semibold text-black">
                  No organization governance signals available
                </div>
              </div>
            ) : (
              signals.map((signal) => (
                <article
                  key={`${signal.organizationName}-${signal.country}-${signal.signalType}`}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                    {safe(signal.signalCategory)}
                  </p>

                  <h3 className="mt-3 text-[22px] font-semibold tracking-tight text-black">
                    {formatSignalTitle(signal.signalType)}
                  </h3>

                  <p className="mt-3 text-[15px] leading-7 text-black/70">
                    {safe(signal.signalDescription)}
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <MetricCard
                      label="Signal Value"
                      value={numberFormat(signal.signalValue)}
                    />
                    <MetricCard
                      label="Last Activity"
                      value={formatDate(signal.lastActivityAt)}
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-4xl space-y-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                Certification Records
              </p>

              <h2 className="text-[26px] font-semibold tracking-tight text-black">
                Published certification intelligence records
              </h2>

              <p className="text-[15px] leading-7 text-black/75">
                These records appear only when explicitly published into the
                GAFAIG public trust surface.
              </p>
            </div>

            <p className="text-[14px] text-black/70">
              {numberFormat(records.length)} shown
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {records.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
                <div className="text-lg font-semibold text-black">
                  No published certification records available
                </div>
              </div>
            ) : (
              records.map((record) => (
                <article
                  key={`${record.registryId}-${record.registrySnapshotId ?? ""}`}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[22px] font-semibold tracking-tight text-black">
                        {safe(record.registryId)}
                      </h3>

                      <p className="mt-2 text-[14px] text-black/70">
                        {safe(record.country)} · {safe(record.lifecycleStatus)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <PublicButtonLink
                        href={`/registry/${encodeURIComponent(record.registryId)}`}
                        variant="secondary"
                      >
                        Open Certification Record
                      </PublicButtonLink>

                      <PublicButtonLink
                        href={`/verify/${encodeURIComponent(record.registryId)}`}
                        variant="primary"
                      >
                        Verify Record
                      </PublicButtonLink>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                      label="Certification"
                      value={safe(record.certificationStatus)}
                    />
                    <MetricCard
                      label="Renewal"
                      value={safe(record.renewalStatus)}
                    />
                    <MetricCard
                      label="Valid To"
                      value={formatDate(record.validTo)}
                    />
                    <MetricCard
                      label="Days Until Expiration"
                      value={numberFormat(record.daysUntilExpiration)}
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-4xl space-y-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                AI Systems
              </p>

              <h2 className="text-[26px] font-semibold tracking-tight text-black">
                Public AI systems disclosed by {safe(
                  organization.organizationName
                )}
              </h2>

              <p className="text-[15px] leading-7 text-black/75">
                AI systems appear only when associated with explicitly published
                GAFAIG certification records.
              </p>
            </div>

            <p className="text-[14px] text-black/70">
              {numberFormat(systems.length)} shown
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {systems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
                <div className="text-lg font-semibold text-black">
                  No public AI systems available
                </div>
              </div>
            ) : (
              systems.map((system) => (
                <article
                  key={`${system.registryId}-${system.systemName ?? "none"}`}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[22px] font-semibold tracking-tight text-black">
                        {safe(system.systemName)}
                      </h3>

                      <p className="mt-2 text-[14px] text-black/70">
                        {safe(system.systemType)} · {safe(system.country)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <PublicButtonLink
                        href={`/registry/ai-systems/${encodeURIComponent(
                          system.registryId
                        )}`}
                        variant="secondary"
                      >
                        Open AI Governance Record
                      </PublicButtonLink>

                      <PublicButtonLink
                        href={`/verify/${encodeURIComponent(system.registryId)}`}
                        variant="primary"
                      >
                        Verify Record
                      </PublicButtonLink>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                      label="Certification"
                      value={safe(system.certificationStatus)}
                    />
                    <MetricCard
                      label="Lifecycle"
                      value={safe(system.lifecycleStatus)}
                    />
                    <MetricCard
                      label="Renewal"
                      value={safe(system.renewalStatus)}
                    />
                    <MetricCard
                      label="Oversight"
                      value={safe(system.oversightLevel)}
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
              Connected Governance Intelligence
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              This organization participates in GAFAIG’s broader governance
              intelligence topology
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Connected governance intelligence links organizations, countries,
              certification records, AI systems, lifecycle observability, renewal
              continuity, and verification trust surfaces into a deterministic
              publication-safe global governance intelligence framework.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <PublicButtonLink href="/explorer" variant="primary">
                Open Governance Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/ai-systems" variant="secondary">
                View AI Systems
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/countries" variant="secondary">
                View Countries
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Open Public Certification Records
              </PublicButtonLink>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Public Trust Boundary
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Publication-safe governance boundaries
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Organization intelligence is derived exclusively from canonical
              Snowflake public registry, lifecycle, renewal, certification, and
              AI system observability projections.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <ul className="grid gap-2 text-[15px] leading-7 text-black/75 md:grid-cols-2">
                <li>findings</li>
                <li>evidence</li>
                <li>reviewer materials</li>
                <li>scoring internals</li>
                <li>governance execution systems</li>
                <li>private workflow telemetry</li>
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
import {
  getExplorerStats,
  getExplorerSystems,
  type ExplorerSystemRow,
} from "@/lib/queries/explorer";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";

function numberFormat(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US");
}

function formatLabel(value?: string | null): string {
  if (!value) return "—";
  const text = String(value).trim();
  return text.length > 0 ? text : "—";
}

function DetailCard({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/10 bg-black/[0.02] p-5 ${className}`}
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </p>
      <p className="mt-3 text-[18px] font-medium leading-8 text-black">
        {value}
      </p>
    </div>
  );
}

function SystemCard({ row }: { row: ExplorerSystemRow }) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.04em] text-emerald-700">
              {formatLabel(row.certificationStatus)}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#dce7ff] px-4 py-2 text-[13px] font-semibold text-[#5678d6]">
              {formatLabel(row.certifiedTier)}
            </span>
          </div>

          <h2 className="mt-5 text-[32px] md:text-[38px] font-semibold tracking-tight text-black">
            {formatLabel(row.systemName)}
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            {formatLabel(row.entityName)} · {formatLabel(row.country)}
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 min-w-[220px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
            Registry ID
          </p>
          <p className="mt-3 text-[18px] font-medium leading-8 text-black break-all">
            {formatLabel(row.registryId)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard
          label="Certification"
          value={formatLabel(row.certificationStatus)}
        />
        <DetailCard
          label="Certified Tier"
          value={formatLabel(row.certifiedTier)}
        />
        <DetailCard
          label="Certified Band"
          value={formatLabel(row.certifiedBand)}
        />
        <DetailCard label="Certified At" value={formatDate(row.certifiedAt)} />

        <DetailCard label="System Type" value={formatLabel(row.systemType)} />
        <DetailCard
          label="Deployment Status"
          value={formatLabel(row.deploymentStatus)}
        />
        <DetailCard
          label="Oversight Level"
          value={formatLabel(row.oversightLevel)}
        />
        <DetailCard label="Risk Tier" value={formatLabel(row.riskTier)} />

        <DetailCard
          label="Developer Organization"
          value={formatLabel(row.developerOrganization)}
        />
        <DetailCard
          label="Human Review Required"
          value={formatLabel(row.humanReviewRequired)}
        />
        <DetailCard
          label="Audit Frequency"
          value={formatLabel(row.auditFrequency)}
        />
        <DetailCard label="System ID" value={formatLabel(row.systemId)} />

        <DetailCard
          label="Application ID"
          value={formatLabel(row.applicationId)}
        />
        <DetailCard label="Case ID" value={formatLabel(row.caseId)} />
        <DetailCard
          label="Training Data Category"
          value={formatLabel(row.trainingDataCategory)}
        />
        <DetailCard
          label="Oversight Model"
          value={formatLabel(row.oversightModel)}
        />

        <DetailCard
          label="Intended Use"
          value={formatLabel(row.intendedUse)}
          className="md:col-span-2"
        />
        <DetailCard
          label="Evaluation Protocol"
          value={formatLabel(row.evaluationProtocol)}
          className="md:col-span-2"
        />
        <DetailCard
          label="Public Summary"
          value={formatLabel(row.publicSummary)}
          className="md:col-span-2 xl:col-span-4"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <PublicButtonLink href={`/registry/${row.registryId}`} variant="primary">
          View Certified Record
        </PublicButtonLink>
        <PublicButtonLink
          href={`/verify/${row.registryId}`}
          variant="secondary"
        >
          Verify Record
        </PublicButtonLink>
      </div>
    </article>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExplorerSystemsPage() {
  const [rows, stats] = await Promise.all([
    getExplorerSystems(200, 0),
    getExplorerStats(),
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="AI Systems"
          title="Explore AI systems in the GAFAIG public trust surface"
          description="This page surfaces registry-linked AI systems using Snowflake-backed explorer data. Only public trust surface records appear here."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="secondary">
                Open Registry
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Systems
            </p>
            <p className="mt-4 text-[54px] font-semibold leading-none tracking-[-0.04em] text-black">
              {numberFormat(rows.length)}
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Public Records
            </p>
            <p className="mt-4 text-[54px] font-semibold leading-none tracking-[-0.04em] text-black">
              {numberFormat(stats.publicRecords)}
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Organizations
            </p>
            <p className="mt-4 text-[54px] font-semibold leading-none tracking-[-0.04em] text-black">
              {numberFormat(stats.organizations)}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-black/45">
                Public AI Systems
              </p>
              <h2 className="mt-4 text-[32px] md:text-[38px] font-semibold tracking-tight text-black">
                Systems currently visible in Explorer
              </h2>
              <p className="mt-4 max-w-4xl text-[15px] leading-7 text-black/75">
                This list reflects public AI systems associated with published
                GAFAIG registry records.
              </p>
            </div>

            <p className="text-[14px] text-black/70">{rows.length} shown</p>
          </div>

          <div className="mt-8 space-y-6">
            {rows.map((row) => (
              <SystemCard key={`${row.registryId}-${row.systemId}`} row={row} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
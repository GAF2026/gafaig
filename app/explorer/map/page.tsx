import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MapRow = {
  COUNTRY: string | null;
  TOTAL_RECORDS: number;
  TOTAL_CERTIFIED: number;
  TOTAL_NOT_CERTIFIED: number;
  LAST_ACTIVITY_AT: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function valueOrDash(value: string | null | undefined) {
  return value && value.trim() ? value : "Unknown";
}

export default async function ExplorerMapPage() {
  const rows = await sfQuery<MapRow>(`
  SELECT
    COUNTRY,
    TOTAL_RECORDS,
    TOTAL_CERTIFIED,
    TOTAL_NOT_CERTIFIED,
    NULL AS LAST_ACTIVITY_AT
  FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_COUNTRY
  ORDER BY TOTAL_RECORDS DESC, COUNTRY ASC
`);

  const totalCountries = rows.length;
  const totalRecords = rows.reduce((sum, row) => sum + Number(row.TOTAL_RECORDS || 0), 0);
  const totalCertified = rows.reduce((sum, row) => sum + Number(row.TOTAL_CERTIFIED || 0), 0);
  const totalNotCertified = rows.reduce((sum, row) => sum + Number(row.TOTAL_NOT_CERTIFIED || 0), 0);

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER — MAP
        </div>

        <h1 className="mt-4 max-w-[900px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Country-level distribution across the GAFAIG public registry
        </h1>

        <p className="mt-5 max-w-[940px] text-[17px] leading-[1.72] text-black/72">
          The Explorer map surface shows how public certification records are
          distributed geographically across the GAFAIG registry. It is designed
          to make the public trust footprint legible at the country level.
        </p>

        <p className="mt-4 max-w-[940px] text-[15px] leading-[1.8] text-black/68">
          This page is derived directly from canonical public registry data. It
          summarizes visible registry activity by country without exposing
          private evidence, findings, or reviewer workflow materials.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <PublicButtonLink href="/explorer" variant="primary">
            Back to explorer
          </PublicButtonLink>

          <PublicButtonLink href="/explorer/countries" variant="secondary">
            Countries
          </PublicButtonLink>

          <PublicButtonLink href="/explorer/organizations" variant="secondary">
            Organizations
          </PublicButtonLink>

          <PublicButtonLink href="/explorer/systems" variant="secondary">
            Systems
          </PublicButtonLink>

          <PublicButtonLink href="/registry" variant="secondary">
            View registry
          </PublicButtonLink>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Countries" value={String(totalCountries)} />
        <MetricCard label="Registry records" value={String(totalRecords)} />
        <MetricCard label="Certified" value={String(totalCertified)} />
        <MetricCard label="Not certified" value={String(totalNotCertified)} />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT THIS MAP SURFACE SHOWS
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Geographic visibility into public certification activity
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Country-level trust footprint"
              body="See where public certification records are currently represented across the GAFAIG registry."
            />
            <StatementCard
              title="Registry-backed distribution"
              body="All totals shown here are derived directly from canonical public registry views."
            />
            <StatementCard
              title="Structured public visibility"
              body="This surface helps visitors understand geographic representation without exposing private workflow."
            />
            <StatementCard
              title="Path into deeper detail"
              body="Each country row leads naturally into country-level explorer and registry views."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            HOW TO USE THIS PAGE
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Start at country level, then move into records
          </h2>

          <div className="mt-7 grid gap-4">
            <StepCard
              number="1"
              title="Review country totals"
              body="Use this page to see where public certification records currently appear."
            />
            <StepCard
              number="2"
              title="Open countries explorer"
              body="Move into the countries page for a dedicated country-level directory."
            />
            <StepCard
              number="3"
              title="Open registry records"
              body="Continue from country-level visibility into individual public certification records."
            />
          </div>

          <div className="mt-8 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              Current public footprint
            </div>
            <p className="mt-3 text-[15px] leading-[1.8] text-black/72">
              GAFAIG’s public trust surface is visible across {totalCountries}{" "}
              countr{totalCountries === 1 ? "y" : "ies"} and currently includes{" "}
              {totalRecords} public registry record{totalRecords === 1 ? "" : "s"}.
            </p>
          </div>
        </section>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              COUNTRY DISTRIBUTION
            </div>
            <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Public registry distribution by country
            </h2>
            <p className="mt-4 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
              These rows summarize registry activity geographically. Open a
              country to continue into a country-specific explorer view.
            </p>
          </div>

          <PublicButtonLink href="/explorer/countries" variant="link" size="sm">
            Open countries explorer →
          </PublicButtonLink>
        </div>

        <div className="mt-8 grid gap-4">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
              No country-level registry data is available.
            </div>
          ) : (
            rows.map((row) => (
              <a
                key={row.COUNTRY || "Unknown"}
                href={`/explorer/countries/${encodeURIComponent(row.COUNTRY || "Unknown")}`}
                className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-[24px] font-semibold tracking-tight text-black">
                      {valueOrDash(row.COUNTRY)}
                    </div>

                    <div className="mt-2 text-sm text-black/65">
                      Last activity {formatDate(row.LAST_ACTIVITY_AT)}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoPanel
                      label="Records"
                      value={String(row.TOTAL_RECORDS)}
                      compact
                    />
                    <InfoPanel
                      label="Certified"
                      value={String(row.TOTAL_CERTIFIED)}
                      compact
                    />
                    <InfoPanel
                      label="Not certified"
                      value={String(row.TOTAL_NOT_CERTIFIED)}
                      compact
                    />
                    <InfoPanel
                      label="Last activity"
                      value={formatDate(row.LAST_ACTIVITY_AT)}
                      compact
                    />
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <FeatureCard
          title="Explorer"
          body="Return to the main discovery surface for GAFAIG’s public registry."
          href="/explorer"
          cta="Back to explorer"
        />
        <FeatureCard
          title="Countries"
          body="Browse the full country-level explorer directory."
          href="/explorer/countries"
          cta="Open countries"
        />
        <FeatureCard
          title="Organizations"
          body="See which organizations appear across public certification records."
          href="/explorer/organizations"
          cta="Open organizations"
        />
        <FeatureCard
          title="Systems"
          body="Inspect disclosed AI systems linked to registry certifications."
          href="/explorer/systems"
          cta="Open systems"
        />
      </section>
    </main>
  );
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
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function StatementCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-2 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-[1.7] text-black/72">{body}</p>
    </div>
  );
}

function InfoPanel({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border border-black/8 bg-black/[0.015]",
        compact ? "px-3 py-3" : "px-4 py-4",
      ].join(" ")}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className={compact ? "mt-2 text-[14px] text-black/85" : "mt-3 text-[15px] text-black/88"}>
        {value}
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[20px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/72">{body}</p>
      <div className="mt-5">
        <PublicButtonLink href={href} variant="link" size="sm">
          {cta} →
        </PublicButtonLink>
      </div>
    </div>
  );
}
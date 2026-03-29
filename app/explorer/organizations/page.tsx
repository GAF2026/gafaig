import Link from "next/link";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type OrganizationRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  CERTIFIED_AT: string | null;
  VALID_TO: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function statusPillClasses(value: string | null | undefined) {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "certified") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized === "published") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-black/10 bg-black/[0.03] text-black/65";
}

export default async function ExplorerOrganizationsPage() {
  const rows = await sfQuery<OrganizationRow>(
    `
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      CERTIFICATION_STATUS,
      CERTIFIED_SCORE,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      CERTIFIED_AT,
      VALID_TO
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    ORDER BY
      CASE WHEN CERTIFIED_AT IS NOT NULL THEN 0 ELSE 1 END ASC,
      CERTIFIED_AT DESC NULLS LAST,
      ENTITY_NAME ASC
    `
  );

  const totalOrganizations = rows.length;
  const certifiedOrganizations = rows.filter(
    (row) => String(row.CERTIFICATION_STATUS || "").trim().toLowerCase() === "certified"
  ).length;
  const approvedOrganizations = rows.filter(
    (row) => String(row.DECISION_STATUS || "").trim().toLowerCase() === "published"
  ).length;
  const countries = new Set(rows.map((row) => row.COUNTRY || "Unknown")).size;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Explorer — Organizations
        </h1>

        <p className="mt-5 max-w-[860px] text-[17px] leading-[1.7] text-black/72">
          Public organization-level explorer for registry entities visible through the
          canonical GAFAIG public registry contract.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <PublicButtonLink href="/explorer" variant="primary">
            Back to explorer
          </PublicButtonLink>

          <PublicButtonLink href="/explorer/countries" variant="secondary">
            View countries
          </PublicButtonLink>

          <PublicButtonLink href="/explorer/systems" variant="secondary">
            View systems
          </PublicButtonLink>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Organizations" value={String(totalOrganizations)} />
        <MetricCard label="Certified" value={String(certifiedOrganizations)} />
        <MetricCard label="Approved" value={String(approvedOrganizations)} />
        <MetricCard label="Countries" value={String(countries)} />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          ORGANIZATION DIRECTORY
        </div>

        <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Public registry organizations
        </h2>

        <div className="mt-8 grid gap-4">
          {rows.map((row) => (
            <Link
              key={row.REGISTRY_ID}
              href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
              className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
            >
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusPillClasses(
                        row.CERTIFICATION_STATUS
                      )}`}
                    >
                      {row.CERTIFICATION_STATUS || "—"}
                    </span>

                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusPillClasses(
                        row.DECISION_STATUS
                      )}`}
                    >
                      {row.DECISION_STATUS || "—"}
                    </span>
                  </div>

                  <div className="mt-4 text-[24px] font-semibold tracking-tight text-black">
                    {row.ENTITY_NAME || row.REGISTRY_ID}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/65">
                    <span>{row.COUNTRY || "Unknown country"}</span>
                    <span>{row.ENTITY_TYPE || "Organization"}</span>
                    <span>{row.REGISTRY_ID}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
                    Certified score
                  </div>
                  <div className="mt-1 text-[22px] font-semibold text-black">
                    {formatScore(row.CERTIFIED_SCORE)}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <Info
                  label="Tier / Band"
                  value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
                />
                <Info label="Certification" value={row.CERTIFICATION_STATUS || "—"} />
                <Info label="Certified at" value={formatDate(row.CERTIFIED_AT)} />
                <Info label="Valid to" value={formatDate(row.VALID_TO)} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </div>
      <div className="mt-2 text-[28px] font-semibold text-black">{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85">{value}</div>
    </div>
  );
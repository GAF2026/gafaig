import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type OrganizationRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFICATION_STATUS: string | null;
  DECISION_STATUS: string | null;
  CERTIFIED_AT: string | null;
  VALID_TO: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

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

export default async function ExplorerOrganizationsPage() {
  const rows = await sfQuery<OrganizationRow>(
    `
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFIED_SCORE,
      CERTIFICATION_STATUS,
      DECISION_STATUS,
      CERTIFIED_AT,
      VALID_TO
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    ORDER BY ENTITY_NAME ASC
    `
  );

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Explorer — Organizations
        </h1>

        <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
          Public organization-level explorer for GAFAIG-certified entities and
          their registry records.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explorer"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to explorer
          </Link>
          <Link
            href="/explorer/countries"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            View countries
          </Link>
          <Link
            href="/explorer/systems"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            View systems
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Organizations" value={String(rows.length)} />
        <MetricCard
          label="Certified"
          value={String(
            rows.filter((row) =>
              String(row.CERTIFICATION_STATUS ?? "")
                .toUpperCase()
                .includes("CERTIFIED")
            ).length
          )}
        />
        <MetricCard
          label="Approved"
          value={String(
            rows.filter(
              (row) => String(row.DECISION_STATUS ?? "").toUpperCase() === "APPROVED"
            ).length
          )}
        />
        <MetricCard
          label="Countries"
          value={String(
            new Set(
              rows
                .map((row) => String(row.COUNTRY ?? "").trim())
                .filter(Boolean)
            ).size
          )}
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          ORGANIZATION DIRECTORY
        </div>

        <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Public registry organizations
        </h2>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public organization data available.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {rows.map((row) => (
              <div
                key={row.REGISTRY_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[20px] font-semibold text-black">
                      {row.ENTITY_NAME}
                    </h3>
                    <div className="mt-2 text-[14px] text-black/65">
                      {row.COUNTRY || "—"} · {row.ENTITY_TYPE || "—"}
                    </div>
                  </div>

                  <Link
                    href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                    className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                  >
                    View registry record
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-6">
                  <Info
                    label="Tier / Band"
                    value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
                  />
                  <Info
                    label="Certified score"
                    value={formatScore(row.CERTIFIED_SCORE)}
                  />
                  <Info
                    label="Certification"
                    value={row.CERTIFICATION_STATUS || "—"}
                  />
                  <Info
                    label="Decision"
                    value={row.DECISION_STATUS || "—"}
                  />
                  <Info
                    label="Certified at"
                    value={formatDate(row.CERTIFIED_AT)}
                  />
                  <Info
                    label="Valid to"
                    value={formatDate(row.VALID_TO)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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
}
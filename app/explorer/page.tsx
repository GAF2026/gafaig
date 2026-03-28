import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type ExplorerSummaryRow = {
  COUNTRY: string | null;
  TOTAL_RECORDS: number;
  TOTAL_CERTIFIED: number;
  AVG_CERTIFIED_SCORE: number | null;
};

type ExplorerRecentRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  COUNTRY: string | null;
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFIED_AT: string | null;
};

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

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

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

export default async function ExplorerPage() {
  const [countryRows, recentRows, totalsRows] = await Promise.all([
    sfQuery<ExplorerSummaryRow>(
      `
      SELECT
        COALESCE(COUNTRY, 'Unknown') AS COUNTRY,
        COUNT(*) AS TOTAL_RECORDS,
        SUM(CASE WHEN CERTIFICATION_STATUS = 'Certified' THEN 1 ELSE 0 END) AS TOTAL_CERTIFIED,
        AVG(CERTIFIED_SCORE) AS AVG_CERTIFIED_SCORE
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      GROUP BY COALESCE(COUNTRY, 'Unknown')
      ORDER BY TOTAL_RECORDS DESC, COUNTRY ASC
      `
    ),
    sfQuery<ExplorerRecentRow>(
      `
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        COUNTRY,
        CERTIFICATION_STATUS,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ORDER BY CERTIFIED_AT DESC NULLS LAST, ENTITY_NAME ASC
      LIMIT 6
      `
    ),
    sfQuery<{ TOTAL_RECORDS: number; TOTAL_CERTIFIED: number; TOTAL_COUNTRIES: number }>(
      `
      SELECT
        COUNT(*) AS TOTAL_RECORDS,
        SUM(CASE WHEN CERTIFICATION_STATUS = 'Certified' THEN 1 ELSE 0 END) AS TOTAL_CERTIFIED,
        COUNT(DISTINCT COALESCE(COUNTRY, 'Unknown')) AS TOTAL_COUNTRIES
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      `
    ),
  ]);

  const totals = totalsRows[0] ?? {
    TOTAL_RECORDS: 0,
    TOTAL_CERTIFIED: 0,
    TOTAL_COUNTRIES: 0,
  };

  const averageCertifiedScore =
    countryRows.length > 0
      ? countryRows
          .map((r) => Number(r.AVG_CERTIFIED_SCORE))
          .filter((n) => Number.isFinite(n))
          .reduce((a, b) => a + b, 0) /
        Math.max(
          1,
          countryRows.filter((r) => Number.isFinite(Number(r.AVG_CERTIFIED_SCORE))).length
        )
      : 0;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Global AI Governance Explorer
        </h1>

        <p className="mt-5 max-w-[860px] text-[17px] leading-[1.7] text-black/72">
          Country, organization, and system-level views derived directly from the
          GAFAIG public registry contract.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/registry"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            View registry
          </Link>
          <Link
            href="/explorer/countries"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Countries
          </Link>
          <Link
            href="/explorer/organizations"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Organizations
          </Link>
          <Link
            href="/explorer/systems"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Systems
          </Link>
          <Link
            href="/explorer/map"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Map
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Registry records" value={String(totals.TOTAL_RECORDS)} />
        <MetricCard label="Certified records" value={String(totals.TOTAL_CERTIFIED)} />
        <MetricCard label="Countries" value={String(totals.TOTAL_COUNTRIES)} />
        <MetricCard
          label="Avg certified score"
          value={totals.TOTAL_CERTIFIED > 0 ? `${Math.round(averageCertifiedScore)} / 100` : "—"}
        />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            COUNTRY DISTRIBUTION
          </div>
          <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-black">
            Top countries by registry activity
          </h2>

          <div className="mt-6 grid gap-4">
            {countryRows.slice(0, 8).map((row) => (
              <Link
                key={row.COUNTRY || "Unknown"}
                href={`/explorer/countries/${encodeURIComponent(row.COUNTRY || "Unknown")}`}
                className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[20px] font-semibold text-black">
                      {row.COUNTRY || "Unknown"}
                    </div>
                    <div className="mt-2 text-sm text-black/65">
                      {row.TOTAL_RECORDS} records · {row.TOTAL_CERTIFIED} certified
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50">
                      Avg score
                    </div>
                    <div className="mt-1 text-lg font-semibold text-black">
                      {formatScore(row.AVG_CERTIFIED_SCORE)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            RECENT RECORDS
          </div>
          <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-black">
            Latest public certifications
          </h2>

          <div className="mt-6 grid gap-4">
            {recentRows.map((row) => (
              <Link
                key={row.REGISTRY_ID}
                href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
              >
                <div className="text-[18px] font-semibold text-black">
                  {row.ENTITY_NAME || row.REGISTRY_ID}
                </div>
                <div className="mt-2 text-sm text-black/65">
                  {row.COUNTRY || "Unknown country"}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <Info label="Status" value={row.CERTIFICATION_STATUS || "—"} />
                  <Info
                    label="Tier / Band"
                    value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
                  />
                  <Info label="Certified at" value={formatDate(row.CERTIFIED_AT)} />
                </div>
              </Link>
            ))}
          </div>
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
}
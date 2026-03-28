import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type CountryRow = {
  COUNTRY: string | null;
  TOTAL_RECORDS: number;
  TOTAL_CERTIFIED: number;
  AVG_CERTIFIED_SCORE: number | null;
};

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

export default async function ExplorerCountriesPage() {
  const rows = await sfQuery<CountryRow>(
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
  );

  const totalRecords = rows.reduce((sum, r) => sum + Number(r.TOTAL_RECORDS || 0), 0);
  const totalCertified = rows.reduce((sum, r) => sum + Number(r.TOTAL_CERTIFIED || 0), 0);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Countries
        </h1>

        <p className="mt-5 max-w-[820px] text-[17px] leading-[1.7] text-black/72">
          Country-level public registry summary derived directly from the
          canonical GAFAIG registry view.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explorer"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to explorer
          </Link>
          <Link
            href="/explorer/map"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            View map
          </Link>
          <Link
            href="/explorer/organizations"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Organizations
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <MetricCard label="Countries" value={String(rows.length)} />
        <MetricCard label="Registry records" value={String(totalRecords)} />
        <MetricCard label="Certified records" value={String(totalCertified)} />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          COUNTRY DIRECTORY
        </div>

        <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Public registry by country
        </h2>

        <div className="mt-8 grid gap-4">
          {rows.map((row) => (
            <Link
              key={row.COUNTRY || "Unknown"}
              href={`/explorer/countries/${encodeURIComponent(row.COUNTRY || "Unknown")}`}
              className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[20px] font-semibold text-black">
                    {row.COUNTRY || "Unknown"}
                  </div>
                  <div className="mt-2 text-sm text-black/65">
                    {row.TOTAL_RECORDS} records · {row.TOTAL_CERTIFIED} certified
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Info label="Certified" value={String(row.TOTAL_CERTIFIED)} />
                  <Info label="Avg score" value={formatScore(row.AVG_CERTIFIED_SCORE)} />
                </div>
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
}
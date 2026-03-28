import Link from "next/link";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type CountryRow = {
  COUNTRY: string;
  TOTAL_RECORDS: number;
  TOTAL_ENTITIES: number;
  TOTAL_CERTIFIED: number;
  LAST_ACTIVITY_AT: string | null;
};

export default async function ExplorerCountriesPage() {
  const rows = await sfQuery<CountryRow>(`
    SELECT
      COUNTRY,
      TOTAL_RECORDS,
      TOTAL_ENTITIES,
      TOTAL_CERTIFIED,
      LAST_ACTIVITY_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_COUNTRY
    ORDER BY TOTAL_RECORDS DESC, COUNTRY ASC
  `);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 text-[36px] font-semibold tracking-tight">
          Explorer — Countries
        </h1>

        <p className="mt-5 text-[17px] text-black/72">
          Country-level public registry view of certified organizations.
        </p>

        <div className="mt-8 flex gap-3">
          <Link href="/explorer" className="btn">Back</Link>
          <Link href="/explorer/organizations" className="btn-outline">Organizations</Link>
          <Link href="/explorer/systems" className="btn-outline">Systems</Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Metric label="Countries" value={String(rows.length)} />
        <Metric
          label="Organizations"
          value={String(rows.reduce((sum, r) => sum + Number(r.TOTAL_ENTITIES || 0), 0))}
        />
        <Metric
          label="Certified"
          value={String(rows.reduce((sum, r) => sum + Number(r.TOTAL_CERTIFIED || 0), 0))}
        />
      </section>

      <section className="mt-10 rounded-3xl border bg-white p-8">
        <h2 className="text-[28px] font-semibold">Countries</h2>

        <div className="mt-6 grid gap-4">
          {rows.map((row) => (
            <div key={row.COUNTRY} className="card">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-[20px] font-semibold">
                    <Link href={`/explorer/countries/${encodeURIComponent(row.COUNTRY)}`}>
                      {row.COUNTRY}
                    </Link>
                  </h3>
                  <div className="text-sm text-black/60">
                    {row.TOTAL_ENTITIES} orgs
                  </div>
                </div>

                <Link
                  href={`/explorer/countries/${encodeURIComponent(row.COUNTRY)}`}
                  className="btn-outline"
                >
                  View
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Info label="Records" value={String(row.TOTAL_RECORDS)} />
                <Info label="Certified" value={String(row.TOTAL_CERTIFIED)} />
                <Info label="Last activity" value={row.LAST_ACTIVITY_AT || "—"} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: any) {
  return (
    <div className="card">
      <div className="text-xs uppercase text-black/60">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="text-sm">
      <div className="text-black/50">{label}</div>
      <div>{value}</div>
    </div>
  );
}
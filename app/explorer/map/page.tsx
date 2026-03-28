import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type CountryRow = {
  COUNTRY: string;
  TOTAL_ENTITIES: number;
  TOTAL_CERTIFIED: number;
  TOTAL_RECORDS: number;
};

export default async function ExplorerMapPage() {
  const rows = await sfQuery<CountryRow>(`
    SELECT
      COUNTRY,
      TOTAL_ENTITIES,
      TOTAL_CERTIFIED,
      TOTAL_RECORDS
    FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_COUNTRY
    ORDER BY TOTAL_ENTITIES DESC
  `);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <h1 className="text-4xl font-semibold">Explorer — Global Map</h1>

      <div className="mt-8 grid gap-4">
        {rows.map((row) => (
          <div key={row.COUNTRY} className="border p-4 rounded-xl">
            <h2 className="font-semibold">{row.COUNTRY}</h2>

            <p>{row.TOTAL_ENTITIES} organizations</p>
            <p>{row.TOTAL_CERTIFIED} certified</p>
            <p>{row.TOTAL_RECORDS} registry records</p>
          </div>
        ))}
      </div>
    </main>
  );
}
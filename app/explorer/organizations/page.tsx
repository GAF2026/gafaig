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
  const rows = await sfQuery<OrganizationRow>(`
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFIED_SCORE,
      CERTIFICATION_STATUS,
      CERTIFIED_AT,
      VALID_TO
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    ORDER BY ENTITY_NAME ASC
  `);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXPLORER
        </div>

        <h1 className="mt-4 text-[36px] font-semibold tracking-tight md:text-[52px]">
          Explorer — Organizations
        </h1>

        <p className="mt-5 text-[17px] text-black/70">
          Public organization-level explorer for GAFAIG-certified entities.
        </p>

        <div className="mt-8 flex gap-3">
          <Link href="/explorer" className="btn">Back</Link>
          <Link href="/explorer/countries" className="btn">Countries</Link>
          <Link href="/explorer/systems" className="btn">Systems</Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Organizations" value={String(rows.length)} />

        <MetricCard
          label="Certified"
          value={String(
            rows.filter((r) => r.CERTIFIED_SCORE !== null).length
          )}
        />

        <MetricCard
          label="Approved"
          value={String(
            rows.filter((r) => r.CERTIFIED_SCORE !== null).length
          )}
        />

        <MetricCard
          label="Countries"
          value={String(
            new Set(rows.map((r) => r.COUNTRY).filter(Boolean)).size
          )}
        />
      </section>

      <section className="mt-10 grid gap-4">
        {rows.map((row) => (
          <div key={row.REGISTRY_ID} className="card">
            <h3>{row.ENTITY_NAME}</h3>

            <div>{row.COUNTRY || "—"} · {row.ENTITY_TYPE || "—"}</div>

            <div className="grid md:grid-cols-5 gap-3 mt-4">
              <Info label="Tier/Band" value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)} />
              <Info label="Score" value={formatScore(row.CERTIFIED_SCORE)} />
              <Info label="Certification" value={row.CERTIFICATION_STATUS || "—"} />
              <Info label="Certified at" value={formatDate(row.CERTIFIED_AT)} />
              <Info label="Valid to" value={formatDate(row.VALID_TO)} />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return <div className="card"><div>{label}</div><div>{value}</div></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div>{label}</div><div>{value}</div></div>;
}
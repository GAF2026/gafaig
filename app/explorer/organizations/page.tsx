import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";
import PublicPageHero from "../../_components/PublicPageHero";

export const dynamic = "force-dynamic";

type OrganizationRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string;
  CERTIFIED_AT: string | null;
};

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default async function ExplorerOrganizationsPage() {
  const res = await sfQueryResult<OrganizationRow>(
    `
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      CERTIFIED_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    ORDER BY ENTITY_NAME ASC
    `
  );

  const rows = res.ok ? res.rows ?? [] : [];

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="EXPLORER"
        title="Explorer — Organizations"
        description="Public view of organizations represented in the GAFAIG registry, including certification status, tier, band, and country."
        actions={
          <>
            <Link
              href="/explorer"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Back to explorer
            </Link>
            <Link
              href="/explorer/systems"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              View systems
            </Link>
            <Link
              href="/explorer/countries"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              View countries
            </Link>
          </>
        }
      />

      {!res.ok ? (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Failed to load organizations.
          <div className="mt-2 break-words text-red-600">{res.error}</div>
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/70">
          No public organizations found.
        </div>
      ) : (
        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            ORGANIZATIONS
          </div>

          <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Certified organizations in the public registry
          </h2>

          <div className="mt-8 grid gap-4">
            {rows.map((row) => (
              <div
                key={row.REGISTRY_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[20px] font-semibold text-black">
                      <Link
                        href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                        className="hover:underline"
                      >
                        {row.ENTITY_NAME}
                      </Link>
                    </h2>
                    <div className="mt-2 text-[14px] text-black/65">
                      {row.REGISTRY_ID}
                    </div>
                  </div>

                  <Link
                    href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                    className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                  >
                    View certification
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-5">
                  <Info label="Entity type" value={row.ENTITY_TYPE} />
                  <Info label="Country" value={row.COUNTRY} />
                  <Info label="Status" value={row.DECISION_STATUS} />
                  <Info label="Tier" value={row.CERTIFIED_TIER} />
                  <Info label="Band" value={row.CERTIFIED_BAND} />
                </div>

                <div className="mt-4 text-[14px] text-black/70">
                  Certified at: {formatDate(row.CERTIFIED_AT)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85">{value ?? "—"}</div>
    </div>
  );
}
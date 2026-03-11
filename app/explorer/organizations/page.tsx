import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";

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
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8">
          <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Global governance explorer
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Explorer — Organizations
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            Public view of organizations represented in the GAFAIG registry,
            including certification status, tier, band, and country.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/explorer"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Back to explorer
            </Link>
            <Link
              href="/explorer/systems"
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
            >
              View systems
            </Link>
            <Link
              href="/explorer/countries"
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
            >
              View countries
            </Link>
          </div>
        </section>

        {!res.ok ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load organizations.
            <div className="mt-2 break-words text-red-600">{res.error}</div>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public organizations found.
          </div>
        ) : (
          <div className="grid gap-4">
            {rows.map((row) => (
              <div
                key={row.REGISTRY_ID}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[20px] font-semibold text-black">
                      <Link
                        href={`/organizations/${encodeURIComponent(row.REGISTRY_ID)}`}
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
        )}
      </div>
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
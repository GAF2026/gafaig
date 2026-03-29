import Link from "next/link";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type RegistryRow = {
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

type CountryOptionRow = {
  COUNTRY: string | null;
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

function normalizeString(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]?.trim() || "";
  return String(value || "").trim();
}

function certificationStatus(row: RegistryRow) {
  return row.CERTIFIED_AT ? "Certified" : "Not Certified";
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams?: {
    q?: string | string[];
    country?: string | string[];
  };
}) {
  const q = normalizeString(searchParams?.q);
  const country = normalizeString(searchParams?.country);

  const whereParts: string[] = [];
  const binds: Array<string | number | null> = [];

  if (q) {
    whereParts.push(`
      (
        UPPER(COALESCE(ENTITY_NAME, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(REGISTRY_ID, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(APPLICATION_ID, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(CASE_ID, '')) LIKE UPPER(?)
      )
    `);
    const like = `%${q}%`;
    binds.push(like, like, like, like);
  }

  if (country) {
    whereParts.push(`UPPER(COALESCE(COUNTRY, '')) = UPPER(?)`);
    binds.push(country);
  }

  const whereClause = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

  const [rows, countries] = await Promise.all([
    sfQuery<RegistryRow>(
      `
      SELECT
        REGISTRY_ID,
        APPLICATION_ID,
        CASE_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        DECISION_STATUS,
        VALID_FROM,
        VALID_TO,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ${whereClause}
      ORDER BY
        CASE WHEN CERTIFIED_AT IS NOT NULL THEN 0 ELSE 1 END ASC,
        CERTIFIED_AT DESC NULLS LAST,
        ENTITY_NAME ASC
      LIMIT 100
      `,
      binds
    ),
    sfQuery<CountryOptionRow>(
      `
      SELECT DISTINCT COUNTRY
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE COUNTRY IS NOT NULL
      ORDER BY COUNTRY ASC
      `
    ),
  ]);

  const totalRecords = rows.length;
  const certifiedRecords = rows.filter((row) => !!row.CERTIFIED_AT).length;
  const publishedRecords = rows.filter(
    (row) => String(row.DECISION_STATUS || "").trim().toLowerCase() === "published"
  ).length;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          REGISTRY
        </div>

        <h1 className="mt-4 max-w-[780px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Global AI Governance Registry
        </h1>

        <form className="mt-8 grid gap-4 md:grid-cols-[1.3fr_0.7fr_auto]">

          {/* BUTTON FIX */}
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="
                inline-flex items-center justify-center
                h-[44px] px-5
                rounded-full
                border border-black
                bg-black text-white
                text-sm font-semibold
                transition hover:bg-black/90
              "
            >
              Apply
            </button>

            <PublicButtonLink href="/registry" variant="secondary">
              Reset
            </PublicButtonLink>
          </div>
        </form>
      </section>

      {/* ✅ FIXED ERROR: MetricCard EXISTS NOW */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <MetricCard label="Visible records" value={String(totalRecords)} />
        <MetricCard label="Certified" value={String(certifiedRecords)} />
        <MetricCard label="Published" value={String(publishedRecords)} />
      </section>
    </main>
  );
}

/* ========================= */
/* ✅ MISSING COMPONENTS FIXED */
/* ========================= */

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

function StatusPill({
  value,
  subtle = false,
}: {
  value: string;
  subtle?: boolean;
}) {
  const normalized = String(value || "").trim().toLowerCase();

  let classes =
    "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]";

  if (!subtle && normalized === "certified") {
    classes += " border-emerald-300 bg-emerald-50 text-emerald-700";
  } else if (!subtle && normalized === "not certified") {
    classes += " border-zinc-300 bg-zinc-50 text-zinc-700";
  } else if (normalized === "published") {
    classes += " border-blue-300 bg-blue-50 text-blue-700";
  } else {
    classes += " border-black/10 bg-black/[0.03] text-black/65";
  }

  return <span className={classes}>{value}</span>;
}
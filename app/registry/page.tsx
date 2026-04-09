import Link from "next/link";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicButton from "@/app/_components/PublicButton";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type RegistryRow = {
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_SCORE: string | null;
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

function tierBandLabel(
  score: string | null,
  tier: string | null,
  band: string | null
) {
  const scoreLabel = score ? `Score ${score}` : null;
  const tierBand = tier && band ? `${tier} · Band ${band}` : tier || band || null;
  return [scoreLabel, tierBand].filter(Boolean).join(" · ") || "—";
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

  let rows: RegistryRow[] = [];
  let countries: CountryOptionRow[] = [];

  [rows, countries] = await Promise.all([
    sfQuery<RegistryRow>(
      `
      SELECT *
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ${whereClause}
      ORDER BY CERTIFIED_AT DESC NULLS LAST
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

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="REGISTRY OF RECORD"
          title="Public AI governance certification records"
          description="The GAFAIG Registry is the canonical public record of certification outcomes issued through the GAFAIG verification framework."
          secondaryDescription="Each record discloses certification status, validity information, and linked trust surfaces without exposing private evidence, findings, or internal review workflow."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="secondary">
                Open Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/verify" variant="secondary">
                Verification Guide
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <form className="grid gap-4 md:grid-cols-[1.3fr_0.7fr_auto]">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search entity, registry ID, application, case"
              className="w-full rounded-2xl border border-black/10 px-4 py-3"
            />

            <select
              name="country"
              defaultValue={country}
              className="rounded-2xl border border-black/10 px-4 py-3"
            >
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c.COUNTRY || ""} value={c.COUNTRY || ""}>
                  {c.COUNTRY}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <PublicButton type="submit" variant="primary">
                Apply
              </PublicButton>

              <PublicButtonLink href="/registry" variant="secondary">
                Reset
              </PublicButtonLink>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="grid gap-4">
            {rows.map((row) => (
              <Link
                key={row.REGISTRY_ID}
                href={`/registry/${row.REGISTRY_ID}`}
                className="rounded-2xl border border-black/10 p-5 hover:bg-black/[0.03]"
              >
                <div className="text-[20px] font-semibold">
                  {row.ENTITY_NAME || row.REGISTRY_ID}
                </div>

                <div className="mt-2 text-sm text-black/60">
                  {row.ENTITY_TYPE} · {row.COUNTRY} · {row.REGISTRY_ID}
                </div>

                <div className="mt-4 grid md:grid-cols-4 gap-3 text-sm">
                  <div>{tierBandLabel(row.CERTIFIED_SCORE, row.CERTIFIED_TIER, row.CERTIFIED_BAND)}</div>
                  <div>{formatDate(row.CERTIFIED_AT)}</div>
                  <div>{formatDate(row.VALID_FROM)}</div>
                  <div>{formatDate(row.VALID_TO)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
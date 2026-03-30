import Link from "next/link";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type Row = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  COUNTRY: string | null;
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  CERTIFIED_AT: string | null;
  VALID_TO: string | null;
};

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · ${band}`;
  if (tier) return tier;
  if (band) return band;
  return "—";
}

export default async function Page() {
  const rows = await sfQuery<Row>(`
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      COUNTRY,
      CERTIFICATION_STATUS,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFIED_AT,
      VALID_TO
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY CERTIFIED_AT DESC NULLS LAST, ENTITY_NAME ASC
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

        <div className="mt-8 flex flex-wrap gap-3">
          <PublicButtonLink href="/explorer" variant="primary">
            Back to explorer
          </PublicButtonLink>
          <PublicButtonLink href="/explorer/countries" variant="secondary">
            Countries
          </PublicButtonLink>
          <PublicButtonLink href="/explorer/systems" variant="secondary">
            Systems
          </PublicButtonLink>
        </div>
      </section>

      <section className="mt-10 grid gap-4">
        {rows.map((r) => (
          <Link
            key={r.REGISTRY_ID}
            href={`/registry/${r.REGISTRY_ID}`}
            className="rounded-2xl border border-black/10 p-5 hover:bg-black/[0.03]"
          >
            <div className="flex justify-between gap-4">
              <div>
                <div className="text-[22px] font-semibold">
                  {r.ENTITY_NAME || r.REGISTRY_ID}
                </div>

                <div className="mt-1 text-sm text-black/60">
                  {r.COUNTRY || "Unknown"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs uppercase text-black/50">
                  Status
                </div>
                <div className="text-lg font-semibold">
                  {r.CERTIFICATION_STATUS || "—"}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-xs text-black/50">Tier/Band</div>
                <div>{tierBandLabel(r.CERTIFIED_TIER, r.CERTIFIED_BAND)}</div>
              </div>

              <div>
                <div className="text-xs text-black/50">Status</div>
                <div>{r.CERTIFICATION_STATUS || "—"}</div>
              </div>

              <div>
                <div className="text-xs text-black/50">Certified</div>
                <div>{formatDate(r.CERTIFIED_AT)}</div>
              </div>

              <div>
                <div className="text-xs text-black/50">Valid to</div>
                <div>{formatDate(r.VALID_TO)}</div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
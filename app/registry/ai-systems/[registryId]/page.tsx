import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQueryResult } from "@/lib/snowflake";
import { isGafaigRegistryId } from "@/lib/ids";

export const dynamic = "force-dynamic";

type AiSystemRow = {
  REGISTRY_ID: string;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  INTENDED_USE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  PUBLIC_SUMMARY: string | null;

  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;

  DECISION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;

  CERTIFIED_AT: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
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

function chip() {
  return "inline-flex items-center rounded-full border border-black/15 bg-black/[0.04] px-2.5 py-1 text-[12px] font-semibold";
}

function val(v?: string | null) {
  const s = String(v ?? "").trim();
  return s || "—";
}

export default async function Page({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId || "").trim().toUpperCase();

  if (!isGafaigRegistryId(registryId)) {
    notFound();
  }

  const res = await sfQueryResult<AiSystemRow>(
    `
SELECT
  s.REGISTRY_ID,
  s.SYSTEM_NAME,
  s.SYSTEM_TYPE,
  s.INTENDED_USE,
  s.DEPLOYMENT_STATUS,
  s.OVERSIGHT_LEVEL,
  s.RISK_TIER,
  s.PUBLIC_SUMMARY,

  r.ENTITY_NAME,
  r.ENTITY_TYPE,
  r.COUNTRY,

  r.DECISION_STATUS,
  r.CERTIFIED_TIER,
  r.CERTIFIED_BAND,
  r.CERTIFIED_AT,
  r.VALID_FROM,
  r.VALID_TO

FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
  ON s.REGISTRY_ID = r.REGISTRY_ID
WHERE s.REGISTRY_ID = ?
LIMIT 1
`,
    [registryId]
  );

  if (!res.ok) {
    throw new Error(res.error);
  }

  const row = res.rows?.[0];

  if (!row) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">

      <section className="pb-10">

        <div className="text-[13px] uppercase tracking-[0.22em] text-black/60">
          Certified AI system
        </div>

        <h1 className="mt-4 text-[40px] font-semibold">
          {val(row.SYSTEM_NAME)}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">

          <span className={chip()}>{row.REGISTRY_ID}</span>

          {row.SYSTEM_TYPE && <span className={chip()}>{row.SYSTEM_TYPE}</span>}
          {row.DEPLOYMENT_STATUS && (
            <span className={chip()}>{row.DEPLOYMENT_STATUS}</span>
          )}
          {row.RISK_TIER && <span className={chip()}>{row.RISK_TIER}</span>}

          {row.CERTIFIED_TIER && (
            <span className={chip()}>{row.CERTIFIED_TIER}</span>
          )}

          {row.CERTIFIED_BAND && (
            <span className={chip()}>{row.CERTIFIED_BAND}</span>
          )}

        </div>

        <p className="mt-6 max-w-[900px] text-[16px] leading-[1.8] text-black/80">
          {val(row.PUBLIC_SUMMARY)}
        </p>

      </section>

      <section className="border-t border-black/10 pt-8">

        <div className="grid md:grid-cols-3 gap-4">

          <div className="card">
            <div className="label">Organization</div>
            <div>{val(row.ENTITY_NAME)}</div>
          </div>

          <div className="card">
            <div className="label">Country</div>
            <div>{val(row.COUNTRY)}</div>
          </div>

          <div className="card">
            <div className="label">Decision status</div>
            <div>{val(row.DECISION_STATUS)}</div>
          </div>

          <div className="card">
            <div className="label">Certified tier</div>
            <div>{val(row.CERTIFIED_TIER)}</div>
          </div>

          <div className="card">
            <div className="label">Certified band</div>
            <div>{val(row.CERTIFIED_BAND)}</div>
          </div>

          <div className="card">
            <div className="label">Certified at</div>
            <div>{formatDate(row.CERTIFIED_AT)}</div>
          </div>

          <div className="card">
            <div className="label">Valid from</div>
            <div>{formatDate(row.VALID_FROM)}</div>
          </div>

          <div className="card">
            <div className="label">Valid to</div>
            <div>{formatDate(row.VALID_TO)}</div>
          </div>

        </div>

      </section>

      <section className="mt-10 border-t border-black/10 pt-8">

        <Link
          href="/registry/ai-systems"
          className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm hover:bg-black hover:text-white"
        >
          Back to AI systems
        </Link>

      </section>

    </main>
  );
}
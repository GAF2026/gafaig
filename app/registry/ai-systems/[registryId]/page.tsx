import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQueryResult } from "@/lib/snowflake";
import { isGafaigRegistryId } from "@/lib/ids";

export const dynamic = "force-dynamic";

type RegistryRow = {
  REGISTRY_ID: string;
  CASE_ID: string | null;
  APPLICATION_ID: string | null;
  ENTITY_NAME: string;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
  LAST_ACTIVITY_AT: string | null;
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

function chipClass() {
  return "inline-flex items-center rounded-full border border-black/15 bg-black/[0.04] px-2.5 py-1 text-[12px] font-semibold leading-none text-black";
}

function valueOrDash(v?: string | null) {
  const s = String(v ?? "").trim();
  return s.length > 0 ? s : "—";
}

export default async function RegistryAiSystemRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId || "").trim().toUpperCase();

  if (!isGafaigRegistryId(registryId)) {
    notFound();
  }

  const res = await sfQueryResult<RegistryRow>(
    `
    SELECT
      REGISTRY_ID,
      CASE_ID,
      APPLICATION_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      VALID_FROM,
      VALID_TO,
      CERTIFIED_AT,
      LAST_ACTIVITY_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC_SEARCH
    WHERE REGISTRY_ID = ?
    LIMIT 1
    `,
    [registryId]
  );

  if (!res.ok) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="text-[16px] font-semibold text-red-700">
            Unable to load registry record
          </div>
          <p className="mt-3 text-[15px] leading-[1.75] text-red-700/90">
            {res.error || "Snowflake query failed."}
          </p>
          <div className="mt-6">
            <Link
              href="/registry/ai-systems"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Back to public registry
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const row = res.rows?.[0] ?? null;

  if (!row) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
      <section className="pb-10 pt-2">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          Certified AI system record
        </div>

        <h1 className="mt-4 max-w-[980px] text-[40px] font-semibold leading-[1.15] text-black">
          {row.ENTITY_NAME}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={chipClass()}>{row.REGISTRY_ID}</span>
          <span className={chipClass()}>{row.DECISION_STATUS}</span>

          {row.CERTIFIED_TIER ? (
            <span className={chipClass()}>{row.CERTIFIED_TIER}</span>
          ) : null}

          {row.CERTIFIED_BAND ? (
            <span className={chipClass()}>{row.CERTIFIED_BAND}</span>
          ) : null}

          {row.ENTITY_TYPE ? (
            <span className={chipClass()}>{row.ENTITY_TYPE}</span>
          ) : null}
        </div>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          This public GAFAIG record confirms certification status and high-level
          registry metadata without exposing private evidence, findings, or
          controlled verification materials.
        </p>
      </section>

      <section className="border-t border-black/10 pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Registry ID
            </div>
            <div className="mt-2 font-mono text-[13px] text-black/85">
              {valueOrDash(row.REGISTRY_ID)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Entity name
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.ENTITY_NAME)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Entity type
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.ENTITY_TYPE)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Country
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.COUNTRY)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Decision status
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.DECISION_STATUS)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Certified at
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {formatDate(row.CERTIFIED_AT)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Valid from
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {formatDate(row.VALID_FROM)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Valid to
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {formatDate(row.VALID_TO)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Last activity
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {formatDate(row.LAST_ACTIVITY_AT)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Certified tier
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.CERTIFIED_TIER)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Certified band
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.CERTIFIED_BAND)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Application ID
            </div>
            <div className="mt-2 font-mono text-[13px] text-black/85">
              {valueOrDash(row.APPLICATION_ID)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Case ID
            </div>
            <div className="mt-2 font-mono text-[13px] text-black/85">
              {valueOrDash(row.CASE_ID)}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 border-t border-black/10 pt-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/registry/ai-systems"
            className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            Back to public registry
          </Link>

          <Link
            href={`/api/verify/${encodeURIComponent(row.REGISTRY_ID)}`}
            className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            Open verification endpoint
          </Link>
        </div>
      </section>
    </main>
  );
}
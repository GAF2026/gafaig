import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";
import { isGafaigRegistryId } from "@/lib/ids";

export const dynamic = "force-dynamic";

type RegistryRow = {
  REGISTRY_ID: string;
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

export default async function RegistryRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId || "").trim().toUpperCase();

  if (!isGafaigRegistryId(registryId)) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
        <section className="rounded-2xl border border-black/10 p-6">
          <div className="text-[16px] font-semibold text-black">
            Registry record not found
          </div>
          <p className="mt-3 text-[15px] leading-[1.75] text-black/72">
            No GAFAIG registry record exists for{" "}
            <span className="font-mono text-black">{registryId}</span>.
          </p>
        </section>
      </main>
    );
  }

  const res = await sfQueryResult<RegistryRow>(
    `
    SELECT
      REGISTRY_ID,
      APPLICATION_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      VALID_FROM,
      VALID_TO,
      CERTIFIED_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    WHERE REGISTRY_ID = ?
    LIMIT 1
    `,
    [registryId]
  );

  const row = res.ok ? res.rows?.[0] ?? null : null;

  if (!row) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
        <section className="rounded-2xl border border-black/10 p-6">
          <div className="text-[16px] font-semibold text-black">
            Registry record not found
          </div>
          <p className="mt-3 text-[15px] leading-[1.75] text-black/72">
            No GAFAIG registry record exists for{" "}
            <span className="font-mono text-black">{registryId}</span>.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
      <section className="pb-10 pt-2">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          Registry record
        </div>

        <h1 className="mt-4 max-w-[980px] text-[40px] font-semibold leading-[1.15] text-black">
          <Link
            href={`/organizations/${encodeURIComponent(row.REGISTRY_ID)}`}
            className="hover:underline"
          >
            {row.ENTITY_NAME}
          </Link>
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
        </div>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          This GAFAIG registry record confirms certification outcomes without
          exposing internal evidence, findings, reviewer identities, or private
          assessment materials.
        </p>
      </section>

      <section className="border-t border-black/10 pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Entity type
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {row.ENTITY_TYPE ?? "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Country
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {row.COUNTRY ?? "—"}
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
              Application ID
            </div>
            <div className="mt-2 font-mono text-[13px] text-black/85">
              {row.APPLICATION_ID ?? "—"}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 border-t border-black/10 pt-8">
        <Link
          href={`/organizations/${encodeURIComponent(row.REGISTRY_ID)}`}
          className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
        >
          View organization profile
        </Link>
      </section>
    </main>
  );
}
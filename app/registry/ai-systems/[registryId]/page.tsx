import Link from "next/link";
import { notFound } from "next/navigation";
import { isGafaigRegistryId } from "@/lib/ids";
import { getRegistryAiSystemByRegistryId } from "@/lib/queries/registry-ai-systems";

export const dynamic = "force-dynamic";

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

  const res = await getRegistryAiSystemByRegistryId(registryId);

  if (!res.ok) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="text-[16px] font-semibold text-red-700">
            Unable to load AI system record
          </div>
          <p className="mt-3 text-[15px] leading-[1.75] text-red-700/90">
            {res.error || "Snowflake query failed."}
          </p>
          <div className="mt-6">
            <Link
              href="/registry/ai-systems"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Back to AI systems
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
          Certified AI system
        </div>

        <h1 className="mt-4 max-w-[980px] text-[40px] font-semibold leading-[1.15] text-black">
          {row.SYSTEM_NAME}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={chipClass()}>{row.REGISTRY_ID}</span>

          {row.SYSTEM_TYPE ? (
            <span className={chipClass()}>{row.SYSTEM_TYPE}</span>
          ) : null}

          {row.DEPLOYMENT_STATUS ? (
            <span className={chipClass()}>{row.DEPLOYMENT_STATUS}</span>
          ) : null}

          {row.RISK_TIER ? (
            <span className={chipClass()}>{row.RISK_TIER}</span>
          ) : null}
        </div>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          {valueOrDash(row.PUBLIC_SUMMARY)}
        </p>
      </section>

      <section className="border-t border-black/10 pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Organization
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.ENTITY_NAME)}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Country
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              —
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Decision status
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.DECISION_STATUS)}
            </div>
          </div>

          <div>
            <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Certified tier
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.CERTIFIED_TIER)}
            </div>
          </div>

          <div>
            <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Certified band
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.CERTIFIED_BAND)}
            </div>
          </div>

          <div>
            <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Certified at
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              —
            </div>
          </div>

          <div>
            <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Valid from
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              —
            </div>
          </div>

          <div>
            <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Valid to
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              —
            </div>
          </div>

          <div>
            <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Audit frequency
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {valueOrDash(row.AUDIT_FREQUENCY)}
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
            Back to AI systems
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
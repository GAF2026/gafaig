import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getGovernanceSignals,
  type GovernanceSignal,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatText(value: string | null | undefined): string {
  const clean = String(value ?? "").trim();
  return clean.length > 0 ? clean : "—";
}

function formatSignalType(value: string | null | undefined): string {
  return formatText(value).replace(/_/g, " ");
}

function formatNumber(value: number | null | undefined): string {
  const safe = Number(value ?? 0);

  return new Intl.NumberFormat("en-US").format(
    Number.isFinite(safe) ? safe : 0
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function signalTone(value: string | null | undefined): string {
  const clean = String(value ?? "").trim().toLowerCase();

  if (clean.includes("activity")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (clean.includes("renewal")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (clean.includes("continuity")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (clean.includes("disclosure")) {
    return "border-purple-200 bg-purple-50 text-purple-700";
  }

  return "border-black/10 bg-black/[0.02] text-black/70";
}

function SignalCard({ signal }: { signal: GovernanceSignal }) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold capitalize ${signalTone(
              signal.signalType
            )}`}
          >
            Governance Signal
          </span>

          <div>
            <h2 className="text-[24px] font-semibold tracking-tight text-black capitalize">
              {formatSignalType(signal.signalType)}
            </h2>

            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-black/75">
              {formatText(signal.signalDescription)}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-black/[0.02] px-6 py-5 text-center">
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
            Signal Value
          </div>

          <div className="mt-3 text-[42px] font-semibold tracking-tight text-black">
            {formatNumber(signal.signalValue)}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
            Signal Type
          </div>

          <div className="mt-3 text-[18px] font-semibold text-black capitalize">
            {formatSignalType(signal.signalType)}
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
            Last Activity
          </div>

          <div className="mt-3 text-[18px] font-semibold text-black">
            {formatDate(signal.lastActivityAt)}
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
      <div className="text-lg font-semibold text-black">
        No governance signals available
      </div>

      <p className="mt-2 text-sm leading-6 text-black/60">
        GAFAIG did not receive governance observability signals from the
        canonical Snowflake governance signals view.
      </p>
    </div>
  );
}

export default async function GovernanceSignalsPage() {
  const signals = await getGovernanceSignals();

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / GOVERNANCE SIGNALS"
          title="Public governance observability signals"
          description="Governance Signals surfaces publication-safe operational trust telemetry derived from GAFAIG’s canonical Snowflake observability infrastructure."
          secondaryDescription="Signals are aggregated projections only. This page does not expose findings, evidence, reviewer state, scoring internals, AI recommendation internals, or private governance execution."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/lifecycle"
                variant="secondary"
              >
                Lifecycle Observability
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/renewals"
                variant="secondary"
              >
                Renewal Observability
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Governance observability
            </div>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Publication-safe governance telemetry
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              Every signal on this page is projected from{" "}
              <strong>CORE.V_GOVERNANCE_SIGNALS_PUBLIC</strong>. The UI formats
              the data only. Governance observability signals are generated in
              Snowflake and surfaced through canonical public observability
              views.
            </p>

            <p className="text-[15px] leading-7 text-black/75">
              These signals help external stakeholders understand public
              certification continuity, lifecycle activity, renewal posture, and
              public AI system disclosure activity without exposing private
              governance execution infrastructure.
            </p>
          </div>
        </section>

        <section className="grid gap-4">
          {signals.length === 0 ? (
            <EmptyState />
          ) : (
            signals.map((signal) => (
              <SignalCard
                key={`${signal.signalType}-${signal.lastActivityAt ?? "none"}`}
                signal={signal}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
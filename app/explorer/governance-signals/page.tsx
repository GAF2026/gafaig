import Link from "next/link";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import { getGovernanceObservabilityData } from "@/lib/queries/observability";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function numberFormat(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function formatText(value: string | null | undefined) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : "—";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatSignalTitle(signalType: string) {
  return signalType
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function signalTone(signalType: string) {
  if (
    signalType.includes("expiring") ||
    signalType.includes("renewal") ||
    signalType.includes("expired")
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (
    signalType.includes("active") ||
    signalType.includes("continuity") ||
    signalType.includes("certification")
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (signalType.includes("ai_system")) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

export default async function GovernanceSignalsPage() {
  const { signals, summary, aiSystems, validation } =
    await getGovernanceObservabilityData();

  return (
    <main className="mx-auto w-full max-w-[1180px] px-6 py-10">
      <PublicPageHero
        eyebrow="EXPLORER / GOVERNANCE SIGNALS"
        title="Public governance observability signals"
        description="Governance Signals surfaces publication-safe operational trust telemetry derived from GAFAIG’s canonical Snowflake observability infrastructure."
        secondaryDescription="Signals are aggregated projections only. This page does not expose findings, evidence, reviewer state, scoring internals, AI recommendation internals, or private governance execution telemetry."
        actions={
          <>
            <PublicButtonLink href="/explorer" variant="primary">
              Back to Explorer
            </PublicButtonLink>
            <PublicButtonLink href="/explorer/lifecycle" variant="secondary">
              Lifecycle Observability
            </PublicButtonLink>
            <PublicButtonLink href="/explorer/renewals" variant="secondary">
              Renewal Observability
            </PublicButtonLink>
          </>
        }
      />

      <section className="mt-8 rounded-3xl border border-black/10 bg-white p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-black/40">
          Governance observability
        </p>

        <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
          Publication-safe governance telemetry
        </h2>

        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-black/70">
          Every signal on this page is projected from canonical Snowflake public
          views. Governance observability signals are generated from public
          lifecycle, renewal, registry, and AI system disclosure views only.
        </p>

        <p className="mt-4 max-w-4xl text-[15px] leading-7 text-black/70">
          These signals help external stakeholders understand public
          certification continuity, lifecycle activity, renewal posture, and
          public AI system disclosure activity without exposing private
          governance execution infrastructure.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Public Records"
          value={summary.totalPublicRecords}
        />
        <MetricCard
          label="Active Certifications"
          value={summary.totalActiveCertifications}
        />
        <MetricCard
          label="Public AI Systems"
          value={aiSystems.totalPublicAiSystems}
        />
        <MetricCard
          label="Signals"
          value={validation.totalSignals}
        />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Countries"
          value={summary.totalActiveCountries}
        />
        <MetricCard
          label="Organizations"
          value={summary.totalActiveOrganizations}
        />
        <MetricCard
          label="Expiring 30 Days"
          value={summary.totalExpiring30Days}
        />
        <MetricCard
          label="Expiring 90 Days"
          value={summary.totalExpiring90Days}
        />
      </section>

      <section className="mt-8 rounded-3xl border border-black/10 bg-white p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-black/40">
              Signal validation
            </p>

            <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
              Deterministic public signal validation
            </h2>

            <p className="mt-3 max-w-4xl text-[15px] leading-7 text-black/70">
              GAFAIG validates signal completeness through a canonical Snowflake
              validation view. Empty signal types and null signal values should
              remain zero.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <MetricCard label="Total Signals" value={validation.totalSignals} />
          <MetricCard
            label="Distinct Signals"
            value={validation.distinctSignalTypes}
          />
          <MetricCard
            label="Empty Signal Types"
            value={validation.emptySignalTypes}
          />
          <MetricCard
            label="Null Signal Values"
            value={validation.nullSignalValues}
          />
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-black/10 bg-white p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-black/40">
              Governance signals
            </p>

            <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
              Public governance observability signal layer
            </h2>

            <p className="mt-3 max-w-4xl text-[15px] leading-7 text-black/70">
              Each card represents a publication-safe governance signal derived
              from deterministic Snowflake public views.
            </p>
          </div>

          <p className="text-[13px] font-medium text-black/50">
            {numberFormat(signals.length)} shown
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          {signals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
              <div className="text-lg font-semibold text-black">
                No public governance observability signals are currently
                available.
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                GAFAIG did not receive signal rows from the canonical Snowflake
                public governance signal view.
              </p>
            </div>
          ) : (
            signals.map((signal) => (
              <article
                key={signal.signalType}
                className="rounded-3xl border border-black/10 bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold ${signalTone(
                        signal.signalType
                      )}`}
                    >
                      Governance Signal
                    </span>

                    <h3 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
                      {formatSignalTitle(signal.signalType)}
                    </h3>

                    <p className="mt-2 text-[14px] leading-6 text-black/70">
                      {formatText(signal.signalDescription)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] px-8 py-6 text-center">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                      Signal Value
                    </p>
                    <p className="mt-3 text-[34px] font-semibold tracking-tight text-black">
                      {numberFormat(signal.signalValue)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                      Signal Type
                    </p>
                    <p className="mt-3 break-words text-[16px] font-semibold text-black">
                      {formatSignalTitle(signal.signalType)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
                      Last Activity
                    </p>
                    <p className="mt-3 text-[16px] font-semibold text-black">
                      {formatDate(signal.lastActivityAt)}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-black/10 bg-white p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-black/40">
          Public trust boundary
        </p>

        <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
          This page does not expose private governance execution
        </h2>

        <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
          <ul className="grid gap-2 text-[15px] leading-7 text-black/75 md:grid-cols-2">
            <li>findings</li>
            <li>evidence</li>
            <li>scoring internals</li>
            <li>reviewer materials</li>
            <li>recommendation systems</li>
            <li>governance execution telemetry</li>
            <li>private workflow state</li>
            <li>unpublished certification records</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/explorer"
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Back to Explorer
          </Link>

          <Link
            href="/registry"
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
          >
            Open Registry
          </Link>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </p>
      <p className="mt-3 text-[26px] font-semibold tracking-tight text-black">
        {numberFormat(value)}
      </p>
    </div>
  );
}
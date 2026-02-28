// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="mx-auto max-w-[1100px] px-6 pt-14 pb-10">
        {/* Top header */}
        <div className="text-xs font-semibold tracking-wide text-gray-600">
          Global Authority for AI Intelligence
        </div>

        <div className="mt-3 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Structured and auditable oversight of AI systems.
          </h1>

          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-3xl">
            GAFAIG is global governance assurance infrastructure for artificial intelligence — making Human AI
            oversight measurable, auditable, and visible at planetary scale.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90"
            >
              Open Demo
            </Link>
            <Link
              href="/framework"
              className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2.5 text-sm font-semibold hover:bg-black/[0.04]"
            >
              View Framework
            </Link>
            <Link
              href="/registry"
              className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2.5 text-sm font-semibold hover:bg-black/[0.04]"
            >
              View Registry
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-[1100px] px-6 pb-14">
        <div className="rounded-2xl border bg-white p-6 sm:p-8">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              GAFAIG turns governance claims into an auditable record—so oversight is comparable, reproducible,
              and reviewable.
            </p>
          </header>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border p-5">
              <div className="text-xs font-semibold text-gray-600">Step 1</div>
              <h3 className="mt-2 font-semibold">Collect evidence</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Policies, system inventories, monitoring artifacts, test results, and incident runbooks are
                captured with structured metadata.
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="text-xs font-semibold text-gray-600">Step 2</div>
              <h3 className="mt-2 font-semibold">Review + score</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence is mapped to defined requirements. Findings are recorded with rationale, then a
                deterministic engine produces a governance score and tier/band outcome.
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="text-xs font-semibold text-gray-600">Step 3</div>
              <h3 className="mt-2 font-semibold">Publish outcomes</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Registry disclosures make oversight visible without exposing sensitive evidence—while the full
                record remains available for authorized review.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border p-5">
            <div className="text-xs font-semibold text-gray-600 mb-2">Workflow</div>
            <div className="font-mono text-xs text-gray-800 whitespace-pre-wrap">
              Evidence → Findings → Events → Scoring → Decision → Registry
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/technology"
              className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2.5 text-sm font-semibold hover:bg-black/[0.04]"
            >
              Technology
            </Link>
            <Link
              href="/mission"
              className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2.5 text-sm font-semibold hover:bg-black/[0.04]"
            >
              Mission
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90"
            >
              Run the Demo
            </Link>
          </div>
        </div>
      </section>

      {/* OPTIONAL: QUICK LINKS / VALUE */}
      <section className="mx-auto max-w-[1100px] px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold">Framework</h3>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              Governance controls and verification structure designed to be implementable and auditable.
            </p>
            <div className="mt-4">
              <Link className="text-sm font-semibold underline" href="/framework">
                Open Framework
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold">Registry</h3>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              Public participation signals that communicate oversight maturity and verification strength.
            </p>
            <div className="mt-4">
              <Link className="text-sm font-semibold underline" href="/registry">
                Open Registry
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold">Reviewer workflow</h3>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              Step through evidence, findings, scoring, and publish a registry snapshot in the demo.
            </p>
            <div className="mt-4">
              <Link className="text-sm font-semibold underline" href="/demo">
                Open Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
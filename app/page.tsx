// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 py-14">
      {/* Hero */}
      <header className="max-w-3xl space-y-5">
        <div className="text-xs tracking-[0.25em] uppercase text-gray-500">
          Global Authority for AI Intelligence
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight">
          Structured and auditable oversight of AI systems.
        </h1>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          GAFAIG is governance assurance infrastructure for artificial intelligence — making Human AI
          oversight measurable, auditable, and visible at planetary scale.
        </p>

        {/* Snowflake architectural signal */}
        <p className="text-sm text-gray-500 leading-relaxed">
          Built on Snowflake as the system of record, GAFAIG stores evidence, findings, and scoring logic
          in structured, auditable data workflows — ensuring deterministic outcomes and reproducible oversight.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/demo"
            className="px-5 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            Open Demo
          </Link>

          <Link
            href="/framework"
            className="px-5 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            View Framework
          </Link>

          <Link
            href="/registry"
            className="px-5 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            View Registry
          </Link>

          <Link
            href="/technology"
            className="px-5 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Technology
          </Link>

          <Link
            href="/demo-script"
            className="px-5 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
            title="Open the Snowflake demo talk track"
          >
            Demo Script
          </Link>
        </div>
      </header>

      {/* How it works */}
      <section className="mt-12">
        <div className="rounded-2xl border p-6 sm:p-7">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">How it works</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              GAFAIG turns governance claims into an auditable record — so oversight is comparable,
              reproducible, and reviewable.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="border rounded-xl p-5">
              <div className="text-xs font-semibold text-gray-500">Step 1</div>
              <h3 className="mt-1 font-semibold">Collect evidence</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Policies, system inventories, monitoring artifacts, test results, and incident runbooks are
                captured with structured metadata.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-xs font-semibold text-gray-500">Step 2</div>
              <h3 className="mt-1 font-semibold">Review + score</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence is mapped to defined requirements. Findings are recorded with rationale, then a
                deterministic engine produces a governance score and tier/band outcome.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-xs font-semibold text-gray-500">Step 3</div>
              <h3 className="mt-1 font-semibold">Publish outcomes</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Registry disclosures make oversight visible without exposing sensitive evidence—while the full
                record remains available for authorized review.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border px-4 py-3">
            <div className="text-xs font-semibold text-gray-500">Workflow</div>
            <div className="mt-1 text-sm text-gray-700">
              Evidence → Findings → Events → Scoring → Decision → Registry
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/technology"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
            >
              Technology
            </Link>

            <Link
              href="/mission"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
            >
              Mission
            </Link>

            <Link
              href="/demo-script"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
            >
              Demo Script
            </Link>

            <Link
              href="/demo"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
            >
              Run the Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mt-10">
        <div className="rounded-2xl border p-6 sm:p-7">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Use cases</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              GAFAIG provides a consistent way to measure Human AI oversight across different operators,
              teams, deployments, and high-impact contexts.
            </p>

            {/* Why this matters */}
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              AI systems now influence markets, infrastructure, and public decision-making.
              Governance must be measurable — not declared.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Enterprise AI governance assurance</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Give boards and executives a repeatable, evidence-based signal of oversight maturity.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Regulator-facing reporting</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Produce audit-ready disclosures that show what was reviewed and how outcomes were determined.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Vendor & platform risk evaluation</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Compare third-party AI systems using deterministic governance scoring.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Public trust signaling</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Publish registry participation and outcomes without exposing sensitive artifacts.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/registry"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
            >
              See the Registry
            </Link>

            <Link
              href="/technology"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
            >
              How the tech works
            </Link>

            <Link
              href="/demo"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
            >
              Run the Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Three tiles */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <h3 className="text-lg font-semibold">Framework</h3>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Governance controls and verification structure designed to be implementable and auditable.
          </p>
          <div className="mt-3">
            <Link href="/framework" className="text-sm font-semibold underline">
              Open Framework
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="text-lg font-semibold">Registry</h3>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Public participation signals that communicate governance maturity and verification strength.
          </p>
          <div className="mt-3">
            <Link href="/registry" className="text-sm font-semibold underline">
              Open Registry
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="text-lg font-semibold">Reviewer workflow</h3>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Step through evidence, findings, scoring, and publish a registry snapshot in the demo.
          </p>
          <div className="mt-3">
            <Link href="/demo" className="text-sm font-semibold underline">
              Open Demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
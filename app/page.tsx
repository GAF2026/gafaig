// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      {/* HERO */}
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Structured and auditable oversight of AI systems.
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          GAFAIG is global governance assurance infrastructure for artificial intelligence — making Human AI
          oversight measurable, auditable, and visible at planetary scale.
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-2">
          <Link
            href="/framework"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            Explore the Framework
          </Link>
          <Link
            href="/registry"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            View the Registry
          </Link>
          <Link
            href="/demo"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-transparent hover:border-black/15 hover:bg-black/[0.04]"
            title="Open the GAFAIG demo overview"
          >
            Open the Demo
          </Link>
        </div>
      </header>

      <section className="mt-12 space-y-12">
        {/* SECTION 1 */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">The structural gap</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Artificial intelligence now operates across markets, institutions, infrastructure, and public
            services — yet oversight remains structurally fragmented.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Governance practices differ across organizations, development teams, and deployment contexts.
            Documentation varies. Evaluation methods vary. Evidence is siloed. Outcomes are difficult to compare.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Intelligence scales globally. Oversight does not. GAFAIG provides a common verification backbone.
          </p>
        </div>

        {/* SECTION 2 */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What GAFAIG does</h2>
          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Evaluates Human AI oversight</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                GAFAIG does not regulate AI. It evaluates and classifies the level of Human AI oversight applied
                to high-impact systems using structured, auditable logic.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Turns governance claims into measurable outcomes</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Through deterministic scoring and evidence-linked decisions, governance becomes measurable.
                Oversight becomes visible.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Two coordinated layers</h2>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="text-lg font-semibold">Private Verification Layer</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                A structured case-based workflow:
              </p>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed font-medium">
                Evidence → Findings → Scoring → Decision
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Artifacts are mapped to defined controls.</li>
                <li>Findings are recorded with written rationale.</li>
                <li>Scores and classifications are reproducible.</li>
                <li>Renewal triggers keep decisions current over time.</li>
              </ul>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Sensitive evidence remains private to authorized reviewers and the verified organization.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="text-lg font-semibold">Public Registry Layer</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                A standardized transparency layer communicating:
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Participation status</li>
                <li>Tier / band classification</li>
                <li>Governance maturity signal</li>
                <li>Renewal cadence</li>
              </ul>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                The registry enables comparability without exposing confidential implementation details.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Why it matters</h2>
          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Without structured evaluation</h3>
              <ul className="mt-2 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Governance remains interpretive.</li>
                <li>Accountability varies.</li>
                <li>Comparability weakens.</li>
                <li>Trust fragments.</li>
              </ul>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">With structured oversight</h3>
              <ul className="mt-2 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Institutions gain clarity.</li>
                <li>Regulators gain signal.</li>
                <li>Organizations gain credibility.</li>
                <li>The public gains visibility.</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Human oversight must scale with machine capability.
          </p>
        </div>

        {/* SECTION 5 */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Planetary-scale governance assurance</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            GAFAIG is governance assurance infrastructure for the age of autonomous intelligence: a shared
            verification backbone that helps oversight remain measurable, auditable, and comparable — even as
            AI deployment scales globally.
          </p>
        </div>

        {/* FOOT CTA */}
        <div className="border rounded-xl p-5">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold">Explore GAFAIG</div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/framework"
                className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
              >
                Framework
              </Link>
              <Link
                href="/registry"
                className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
              >
                Registry
              </Link>
              <Link
                href="/mission"
                className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
              >
                Mission
              </Link>
              <Link
                href="/demo"
                className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
              >
                Open Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
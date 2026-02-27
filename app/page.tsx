// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      {/* HERO */}
      <header className="space-y-5">
        <div className="text-xs uppercase tracking-widest text-gray-500">
          Global Authority for AI Intelligence
        </div>

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
          >
            Open the Demo
          </Link>
        </div>
      </header>

      <section className="mt-12 space-y-12">
        {/* Structural Gap */}
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

        {/* What GAFAIG Does */}
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
              <h3 className="font-semibold">Transforms claims into measurable outcomes</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Through deterministic scoring and evidence-linked decisions, governance becomes measurable.
                Oversight becomes visible.
              </p>
            </div>
          </div>
        </div>

        {/* Two Coordinated Layers */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Two coordinated layers</h2>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="text-lg font-semibold">Private Verification Layer</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed font-medium">
                Evidence → Findings → Scoring → Decision
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Artifacts mapped to defined controls</li>
                <li>Findings recorded with written rationale</li>
                <li>Deterministic scoring logic</li>
                <li>Renewal triggers tied to system evolution</li>
              </ul>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Sensitive evidence remains accessible only to authorized reviewers and the verified organization.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="text-lg font-semibold">Public Registry Layer</h3>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Participation status</li>
                <li>Tier / band classification</li>
                <li>Governance maturity signal</li>
                <li>Renewal cadence</li>
              </ul>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                A privacy-preserving transparency layer enabling comparability without exposing confidential details.
              </p>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Why it matters</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            AI systems increasingly shape economic stability, institutional trust, and public life.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Without structured evaluation, governance remains interpretive and accountability varies.
            With structured oversight, institutions gain clarity, regulators gain signal,
            organizations gain credibility, and the public gains visibility.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            Human oversight must scale with machine capability.
          </p>
        </div>

        {/* Closing */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Planetary-scale governance assurance</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            GAFAIG is governance assurance infrastructure for the age of autonomous intelligence —
            a shared verification backbone designed to keep oversight measurable, auditable, and comparable
            as AI deployment scales globally.
          </p>
        </div>
      </section>
    </main>
  );
}
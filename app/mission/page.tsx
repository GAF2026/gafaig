// app/mission/page.tsx
export default function MissionPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Mission</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          AI is now embedded in institutions, infrastructure, and everyday decisions—yet oversight of high-impact
          systems remains fragmented across organizations, teams, deployments, and operational contexts.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          GAFAIG exists to make Human AI oversight measurable: a deterministic, evidence-based review and scoring
          process that shows the public, regulators, and organizations what governance is actually in place.
        </p>
      </header>

      <section className="mt-12 space-y-12">
        {/* Why GAFAIG */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Why GAFAIG</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Today, “AI governance” often means policies, promises, or scattered documentation. GAFAIG turns governance
            claims into an auditable record—evidence mapped to requirements, findings recorded with rationale, and
            decisions made reproducible.
          </p>
        </div>

        {/* What we provide */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What we provide</h2>
          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">A common verification workflow</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Findings → Evidence → Events → Scoring → Decision—implemented as a deterministic, auditable process.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">A measurable signal of oversight</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                A clear tier/band outcome and score that communicates governance maturity without exposing private
                evidence.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">A privacy-preserving transparency layer</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                A public registry view for accountability, backed by a controlled verification layer for authorized
                reviewers.
              </p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Principles</h2>
          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>
              <span className="font-semibold">Evidence first:</span> governance is demonstrated, not declared.
            </li>
            <li>
              <span className="font-semibold">Deterministic outcomes:</span> scoring is reproducible and auditable.
            </li>
            <li>
              <span className="font-semibold">Least privilege:</span> sensitive evidence stays private by default.
            </li>
            <li>
              <span className="font-semibold">Interoperable standards:</span> designed to work across institutions and
              jurisdictions.
            </li>
          </ul>
        </div>

        {/* What success looks like */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What success looks like</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            A world where high-impact AI systems can be evaluated consistently—where oversight is legible, comparable,
            and enforceable. GAFAIG is the trust infrastructure for making that possible at scale.
          </p>
        </div>
      </section>
    </main>
  );
}
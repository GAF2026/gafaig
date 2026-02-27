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
                Clear tiers, bands, and scores that communicate the level of verified Human AI oversight without
                exposing private evidence.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Evidence-linked decisions</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Every decision is traceable to evidence and findings, making it reviewable by authorized parties and
                defensible over time.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">A public registry layer</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                A transparent view of participation and status—designed for comparability—while keeping sensitive
                evidence in a controlled review layer.
              </p>
            </div>
          </div>
        </div>

        {/* What we believe */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What we believe</h2>
          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Oversight must be operational: evidence, findings, decisions—not slogans.</li>
            <li>Governance must be auditable and repeatable across organizations and deployments.</li>
            <li>Transparency should be real, while protecting legitimately sensitive details.</li>
            <li>Renewal is essential: systems evolve, and oversight must stay current.</li>
          </ul>
        </div>

        {/* Outcome */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">The outcome</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            GAFAIG creates a durable signal of verified Human AI oversight—so governance becomes legible to the public,
            meaningful to regulators, and actionable for organizations building and deploying high-impact AI.
          </p>
        </div>
      </section>
    </main>
  );
}
export default function RegistryPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">GAFAIG Registry</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          The GAFAIG Registry is the public transparency layer for AI governance. It publishes participation
          status and high-level outcomes that are comparable and auditable—without replacing statutory
          compliance or regulator authority.
        </p>
      </header>

      <section className="mt-12 space-y-10">
        {/* Participation levels */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Participation levels</h2>
          <p className="text-sm text-gray-600">
            Levels communicate governance maturity and verification strength. Movement is evidence-based and
            renewed as systems change.
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold">Registered Participant</h3>
                <span className="text-xs px-2 py-1 rounded-full border bg-white text-gray-700">
                  Public commitment
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                Entry level. The participant publishes a governance commitment and agrees to provide evidence
                artifacts upon request.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Publishes a commitment statement (scope + accountable owner).</li>
                <li>Identifies in-scope AI systems (or declares “none in scope” with rationale).</li>
                <li>Adopts baseline documentation (policies, roles, incident pathway).</li>
              </ul>
            </div>

            <div className="border rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold">Verified Participant</h3>
                <span className="text-xs px-2 py-1 rounded-full border bg-white text-gray-700">
                  Evidence reviewed
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                Evidence has been submitted, mapped to defined controls, reviewed through a GAFAIG workflow,
                and recorded with auditable findings and decisions.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Provides core artifacts (policy, inventory, risk assessment, monitoring plan).</li>
                <li>Evidence is linked to findings (pass/fail/needs-work) with rationale.</li>
                <li>Maintains a renewal cadence or re-review on material system changes.</li>
              </ul>
            </div>

            <div className="border rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold">Advanced Certification</h3>
                <span className="text-xs px-2 py-1 rounded-full border bg-white text-gray-700">
                  High-impact readiness
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                Demonstrated implementation across high-impact systems with repeatable controls, monitoring
                evidence over time, and incident readiness tested in practice.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Controls are implemented and evidenced (not just documented).</li>
                <li>Monitoring and response are operational, with metrics captured over time.</li>
                <li>Accountability is clear across developers, operators, and downstream integrators.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What inclusion signals */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What registry inclusion signals</h2>
          <p className="text-sm text-gray-600">
            Inclusion is a public signal of governance transparency and operational discipline. It is designed
            to be comparable across participants while remaining sensitive to confidentiality constraints.
          </p>
          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Public alignment with structured AI governance expectations.</li>
            <li>Evidence-backed oversight (artifacts, review findings, and decisions).</li>
            <li>Defined escalation and remediation pathways for failures and incidents.</li>
            <li>Renewal expectations so published claims remain current over time.</li>
          </ul>
        </div>

        {/* Transparency boundary */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Transparency boundary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            The Registry publishes outcomes and high-level disclosures. Sensitive evidence remains in the
            private verification layer and is visible only to authorized reviewers and the verified
            organization. Registry status does not substitute for regulator determinations or legal
            compliance.
          </p>
        </div>

        {/* How participation works */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">How participation works</h2>
          <p className="text-sm text-gray-600">
            GAFAIG is built around a case workflow that turns governance claims into an auditable record:
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">1) Submit evidence</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Participants submit governance evidence (policies, system cards, test results, monitoring,
                incident runbooks) as structured evidence items.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">2) Evidence → findings</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Reviewers map evidence to defined controls and record findings with rationale
                (pass/fail/needs-work).
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">3) Findings → decision</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                A decision is issued and recorded alongside renewal expectations and remediation requirements.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">4) Summaries for reporting</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Summaries can be generated for consistent reporting (public disclosures and private
                audit-ready narratives).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
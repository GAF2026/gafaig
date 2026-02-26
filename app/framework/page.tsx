export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Framework</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          GAFAIG’s framework is a practical governance structure for high-impact AI systems—designed to be
          transparent, measurable, and enforceable across jurisdictions. It focuses on what can be implemented:
          standards, verification, reporting, and clear accountability.
        </p>
      </header>

      <section className="mt-12 space-y-12">
        {/* Core components */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Core components</h2>
          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Scope classification</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Defines which AI systems require heightened oversight based on impact, autonomy, scale, and risk.
                Establishes what is “in scope” for evidence and review.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Baseline requirements</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Minimum expectations for safety testing, data governance, monitoring, and incident response—
                with requirements expressed as verifiable controls.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Transparency & reporting</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Standardized disclosures and reporting practices so oversight can be consistent and comparable
                across participants, while allowing redaction for sensitive details.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Auditability</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Independent evaluation pathways and verifiable evidence for compliance claims. Evidence must
                be attributable, reviewable, and linked to findings and decisions.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Accountability chain</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Clarifies responsibility across developers, deployers, operators, and downstream integrators.
                Ensures there is always an accountable owner for remediation and escalation.
              </p>
            </div>
          </div>
        </div>

        {/* What good looks like */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What “good” looks like</h2>
          <p className="text-sm text-gray-600">
            The framework is built around observable outcomes, not vague aspirations. In practice, a governed
            AI system should be:
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Explainable to oversight bodies</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Not necessarily fully interpretable, but documentable, testable, and reviewable with clear
                system boundaries and operating assumptions.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Continuously monitored</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                With mechanisms to detect drift, misuse, and emergent risk as conditions change—plus defined
                response playbooks.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Auditable end-to-end</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                With traceable evidence for key claims about safety, security, privacy, and performance—
                linked to findings and decisions.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Governed by enforceable rules</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Including escalation triggers, remediation timelines, and consequences for non-compliance—so
                governance has operational reality.
              </p>
            </div>
          </div>
        </div>

        {/* Standards & artifacts */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Standards & artifacts</h2>
          <p className="text-sm text-gray-600">
            GAFAIG produces reusable governance artifacts that organizations and regulators can adopt. Typical
            artifacts include:
          </p>
          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Risk tiering + scope definitions for high-impact systems</li>
            <li>Audit and evaluation requirements (controls + test evidence expectations)</li>
            <li>Model and system disclosure templates (system card, data sheet, monitoring summary)</li>
            <li>Incident reporting and response standards (playbooks + timelines)</li>
            <li>Public participation mechanisms and comment pathways</li>
          </ul>
        </div>

        {/* Verification workflow */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Verification workflow</h2>
          <p className="text-sm text-gray-600">
            The verification workflow turns “governance claims” into an auditable record:
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Evidence intake</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence items (links, documents, policies, dashboards) are captured with metadata and stored
                as an auditable record.
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Evidence-to-control mapping</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Reviewers map evidence to defined requirements and record findings with rationale (what passes,
                what fails, what needs remediation).
              </p>
            </div>
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Case decision + renewal</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Decisions are recorded with renewal expectations. Material system changes trigger re-review to
                keep registry claims current over time.
              </p>
            </div>
          </div>
        </div>

        {/* Interoperability */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Interoperable by design</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            AI governance will not succeed if every jurisdiction creates incompatible standards. GAFAIG is built
            to support interoperability—so oversight can remain consistent while respecting local law, culture,
            and institutional structure. The objective is a shared governance backbone: a common language for
            evaluating high-impact AI systems and a practical pathway to transparent oversight at planetary scale.
          </p>
        </div>
      </section>
    </main>
  );
}
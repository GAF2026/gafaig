// app/framework/page.tsx

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Framework</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          GAFAIG’s framework is a practical governance structure for high-impact AI systems—designed to be
          transparent, measurable, and enforceable across jurisdictions. It turns governance claims into an
          auditable record: standards → evidence → findings → scoring → decision → publication.
        </p>
      </header>

      <section className="mt-12 space-y-12">
        {/* Core components */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Core components</h2>
          <p className="text-sm text-gray-600">
            The framework is organized around implementable requirements—expressed as controls that can be
            evidenced, reviewed, and renewed over time.
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Scope classification</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Defines which AI systems require heightened oversight based on impact, autonomy, scale, and
                risk. Establishes what is “in scope” for evidence collection and review.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Baseline requirements</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Minimum expectations for safety testing, data governance, monitoring, and incident response—
                expressed as verifiable controls rather than vague principles.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Transparency & reporting</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Standardized disclosures and reporting so oversight outcomes can be compared across
                participants, while allowing redaction for sensitive details.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Auditability</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence must be attributable, reviewable, and linked to findings and decisions. Key claims
                should be reproducible from the case record.
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
            GAFAIG is built around observable outcomes. A governed AI system should be:
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
                response playbooks and escalation triggers.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Auditable end-to-end</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                With traceable evidence for key claims about safety, security, privacy, and performance—
                linked to findings, scoring, and decisions.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Governed by enforceable rules</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Including remediation timelines and renewal requirements—so governance has operational
                reality, not just policy intent.
              </p>
            </div>
          </div>
        </div>

        {/* Standards & artifacts */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Standards & artifacts</h2>
          <p className="text-sm text-gray-600">
            GAFAIG produces reusable governance artifacts that organizations and oversight bodies can adopt.
            Typical artifacts include:
          </p>

          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Scope definitions and tiering for high-impact systems</li>
            <li>Controls and evidence expectations for evaluation and audit</li>
            <li>Disclosure templates (system card, data sheet, monitoring summary)</li>
            <li>Incident response and reporting standards (playbooks + timelines)</li>
            <li>Renewal triggers and change-management requirements</li>
          </ul>
        </div>

        {/* Verification workflow */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Verification workflow</h2>
          <p className="text-sm text-gray-600">
            The workflow turns “governance claims” into an auditable case record:
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
                Reviewers map evidence to requirements and record findings with rationale (what passes, what
                fails, what needs remediation).
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Scoring + decision</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Deterministic scoring produces subscores and an overall tier/band classification. A decision
                is recorded with renewal expectations and change triggers.
              </p>
            </div>
          </div>
        </div>

        {/* Interoperability */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Interoperable by design</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            AI governance will not succeed if every jurisdiction creates incompatible standards. GAFAIG is
            built for interoperability so oversight can remain consistent while respecting local law,
            culture, and institutional structure. The objective is a shared governance backbone: a common
            language for evaluating high-impact AI systems and a practical pathway to transparent oversight
            at planetary scale.
          </p>
        </div>
      </section>
    </main>
  );
}
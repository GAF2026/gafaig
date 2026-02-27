// app/mission/page.tsx

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Mission</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          GAFAIG exists to make oversight of high-impact AI systems structured, auditable, and comparable.
          We do this through evidence-based verification workflows and a public registry that communicates
          outcomes transparently—without replacing statutory compliance or regulator authority.
        </p>
      </header>

      <section className="mt-12 space-y-12">
        {/* Why GAFAIG exists */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Why GAFAIG exists</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            AI systems increasingly influence critical decisions, infrastructure, and individual rights.
            Yet governance is often inconsistent: evidence is scattered, decisions are difficult to reproduce,
            and oversight cannot be compared across organizations or jurisdictions. GAFAIG provides a practical,
            repeatable framework for turning governance claims into an auditable record.
          </p>
        </div>

        {/* What GAFAIG is */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What GAFAIG is</h2>
          <p className="text-sm text-gray-600">
            GAFAIG is governance assurance infrastructure with two coordinated layers:
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold">Private verification layer</h3>
                <span className="text-xs px-2 py-1 rounded-full border bg-white text-gray-700">
                  Controlled access
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                A case-based workflow where evidence is collected, mapped to defined controls, reviewed,
                and recorded as findings, scoring, and a decision. Sensitive artifacts remain private and
                are visible only to authorized reviewers and the verified organization.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold">Public registry layer</h3>
                <span className="text-xs px-2 py-1 rounded-full border bg-white text-gray-700">
                  Transparency layer
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                A standardized publication of outcomes—participation level, tier/band classification,
                and high-level disclosures—so oversight results can be compared across participants
                while protecting sensitive details.
              </p>
            </div>
          </div>
        </div>

        {/* Operating principles */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Operating principles</h2>
          <p className="text-sm text-gray-600">
            GAFAIG focuses on verifiable governance: requirements map to implementable controls and auditable evidence.
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Transparency</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Outcomes are explainable, publishable at defined disclosure thresholds, and comparable across participants.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Auditability</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Decisions are reproducible from evidence, findings, and deterministic scoring logic recorded in the case.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Accountability</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Clear accountable owners, escalation triggers, remediation timelines, and traceability for governance decisions.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Practical governance</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Requirements align to real operations: policies, monitoring, reporting, incident response, and renewal cadence.
              </p>
            </div>
          </div>
        </div>

        {/* Verification workflow */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Verification workflow</h2>
          <p className="text-sm text-gray-600">
            GAFAIG turns governance claims into an auditable record through a consistent workflow:
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Evidence</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence artifacts (documents, policies, dashboards, system cards, test reports) are captured with metadata.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Findings</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Reviewers map evidence to controls and record findings with rationale (pass/fail/needs-work) linked to evidence.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Scoring</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Deterministic scoring produces subscores and an overall tier/band classification for the case.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Decision + renewal</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Decisions are recorded with renewal expectations. Material system changes can trigger re-review to keep claims current.
              </p>
            </div>
          </div>
        </div>

        {/* What gets published */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What gets published</h2>
          <p className="text-sm text-gray-600">
            GAFAIG publishes outcomes designed for public trust while keeping sensitive evidence private.
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Publishable outcomes</h3>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Participation level and verification status</li>
                <li>Tier / band classification and score summary</li>
                <li>High-level scope and governance disclosures (as applicable)</li>
                <li>Renewal timing and change triggers</li>
              </ul>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Protected details</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Full evidence artifacts and detailed findings remain private in the verification layer and are accessible
                only to authorized parties.
              </p>
            </div>
          </div>
        </div>

        {/* What GAFAIG is not */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What GAFAIG is not</h2>
          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-700 leading-relaxed">
              GAFAIG is not a regulator and does not replace statutory compliance obligations. It provides an evidence-based,
              auditable verification record that helps organizations, oversight bodies, and the public evaluate governance maturity consistently.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
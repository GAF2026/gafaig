// app/registry/page.tsx

export default function RegistryPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          GAFAIG Registry
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          The GAFAIG Registry publishes structured verification outcomes for
          participating organizations and governments. Registry status is
          transparent, comparable, and evidence-based—without replacing
          statutory compliance or regulator authority.
        </p>
      </header>

      <section className="mt-12 space-y-12">
        {/* Participation levels */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Participation levels</h2>
          <p className="text-sm text-gray-600">
            Participation levels communicate governance maturity and
            verification strength. Movement across levels is evidence-based and
            subject to renewal as systems evolve.
          </p>

          <div className="mt-4 grid gap-4">
            {/* Registered */}
            <div className="border rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold">
                  Registered Participant
                </h3>
                <span className="text-xs px-2 py-1 rounded-full border bg-white text-gray-700">
                  Public commitment
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                Entry level. The participant publicly commits to GAFAIG
                governance principles and adopts baseline documentation
                expectations.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Publishes governance commitment statement</li>
                <li>Identifies in-scope AI systems (or declares none in scope)</li>
                <li>Establishes accountable owner + incident pathway</li>
              </ul>
            </div>

            {/* Verified */}
            <div className="border rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold">
                  Verified Participant
                </h3>
                <span className="text-xs px-2 py-1 rounded-full border bg-white text-gray-700">
                  Evidence reviewed
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                Evidence has been submitted, mapped to defined controls, reviewed
                within a GAFAIG case workflow, and recorded with auditable
                findings and deterministic scoring.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Controls evidenced and linked to findings</li>
                <li>Subscores + tier/band classification recorded</li>
                <li>Renewal cadence established</li>
              </ul>
            </div>

            {/* Advanced */}
            <div className="border rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold">
                  Advanced Certification
                </h3>
                <span className="text-xs px-2 py-1 rounded-full border bg-white text-gray-700">
                  High-impact readiness
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                Demonstrated governance implementation across high-impact AI
                systems with operational monitoring, tested incident response,
                and accountability chain validation.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Operational controls evidenced in practice</li>
                <li>Monitoring + drift response measured over time</li>
                <li>Clear accountability across lifecycle actors</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What registry inclusion signals */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">
            What registry inclusion signals
          </h2>
          <p className="text-sm text-gray-600">
            Registry inclusion is a public signal of governance maturity,
            transparency, and structured oversight.
          </p>

          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Structured evidence collection practices</li>
            <li>Documented review and escalation pathways</li>
            <li>Deterministic scoring and renewal triggers</li>
            <li>Commitment to continuous governance improvement</li>
          </ul>
        </div>

        {/* Transparency model */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Transparency model</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            The GAFAIG Registry publishes structured outcomes while protecting
            sensitive artifacts. Public entries may include participation level,
            tier/band classification, score summary, scope disclosures, and
            renewal timing. Full evidence records remain private within the
            verification layer.
          </p>
        </div>

        {/* Workflow summary */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">How verification feeds the registry</h2>
          <p className="text-sm text-gray-600">
            Registry status is derived from an auditable case workflow:
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">1) Evidence</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Governance artifacts are submitted and stored as structured records.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">2) Findings</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence is mapped to controls and recorded with rationale.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">3) Scoring</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Deterministic scoring produces subscores and overall classification.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">4) Decision + publication</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                A structured decision is issued and appropriate registry disclosures are published.
              </p>
            </div>
          </div>
        </div>

        {/* Clarification */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Clarification</h2>
          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-700 leading-relaxed">
              GAFAIG does not regulate and does not replace legal compliance
              obligations. It provides an interoperable governance backbone that
              supports regulators, institutions, and the public with structured,
              evidence-based verification records.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
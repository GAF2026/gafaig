export default function ParticipantsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">GAFAIG Registry</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          The GAFAIG Registry lists participating organizations and governments that have committed to
          structured, auditable AI governance practices. Registry status is designed to be transparent,
          comparable, and verifiable—without replacing statutory compliance or regulator authority.
        </p>
      </header>

      <section className="mt-12 space-y-10">
        {/* Participation levels */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Participation levels</h2>
          <p className="text-sm text-gray-600">
            Participation levels communicate maturity and verification strength. Movement across levels is
            evidence-based and can be renewed as systems change.
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
                Entry level. The participant publicly commits to GAFAIG governance principles and agrees to
                submit evidence artifacts upon request.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Publishes a governance commitment statement (scope + accountable owner).</li>
                <li>Identifies in-scope AI systems (or declares “none in scope” with rationale).</li>
                <li>Adopts baseline documentation expectations (policies, roles, incident pathway).</li>
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
                Evidence has been submitted, mapped to defined controls, reviewed by a GAFAIG workflow, and
                recorded with auditable findings and decisions.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Provides core artifacts: governance policy, system inventory, risk assessment, monitoring plan.</li>
                <li>Evidence is linked to findings (pass/fail/needs-work) with written rationale.</li>
                <li>Maintains a renewal cadence (e.g., quarterly/annual) or when material system changes occur.</li>
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
                Demonstrated implementation across high-impact AI systems, with repeatable controls,
                monitoring evidence, and incident readiness tested in practice.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Controls are implemented and evidenced (not just documented).</li>
                <li>Monitoring + drift response are operational, with metrics captured over time.</li>
                <li>Clear accountability chain across developers, operators, and downstream integrators.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What inclusion signals */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What registry inclusion signals</h2>
          <p className="text-sm text-gray-600">
            Registry inclusion is a public signal of governance maturity and transparency. It is meant to be
            comparable across organizations while remaining sensitive to confidentiality constraints.
          </p>
          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Public alignment with transparent AI governance standards.</li>
            <li>Structured evidence collection and documentation practices.</li>
            <li>Defined review, escalation, and reporting procedures.</li>
            <li>Commitment to continuous governance improvement as systems evolve.</li>
          </ul>
        </div>

        {/* Transparency */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Transparency</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Registry status reflects governance process and documentation under GAFAIG standards. It does not
            replace legal compliance, regulator determinations, or statutory oversight. Where needed,
            participants may publish redacted evidence summaries while maintaining a private evidence record
            for authorized review.
          </p>
        </div>

        {/* How participation works */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">How participation works</h2>
          <p className="text-sm text-gray-600">
            Participation is evidence-driven. GAFAIG is built around an auditable workflow so that “claims”
            about governance can be supported with artifacts, review findings, and decisions.
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">1) Submit evidence</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Participants submit governance evidence (links, documents, policies, system cards, test
                results, monitoring dashboards, incident runbooks).
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">2) Evidence → findings</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Reviewers map evidence to controls/requirements and record findings (pass/fail/needs-work)
                with rationale. Findings are linked back to specific evidence items.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">3) Findings → decision</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                A case decision is issued based on findings, with an auditable record of what was reviewed,
                what was accepted, and what remediation is required.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">4) Summaries for reporting</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence summaries can be generated and stored for consistent reporting and oversight (e.g.,
                public disclosure summaries and private audit-ready narratives).
              </p>
            </div>
          </div>
        </div>

        {/* Join */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Join the Registry</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            For the Snowflake challenge demo, the Registry is presented as the public-facing view of
            participation. The “Demo” button in the header opens the reviewer workflow.
          </p>
        </div>
      </section>
    </main>
  );
}
// app/technology/page.tsx
export default function TechnologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Technology</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          GAFAIG is governance assurance infrastructure built on Snowflake. We turn Human AI oversight from
          narrative claims into an auditable, reproducible record—evidence → findings → scoring → decisions—
          with a public registry view for transparency.
        </p>
      </header>

      <section className="mt-12 space-y-12">
        {/* What GAFAIG runs on */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What GAFAIG runs on</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Snowflake is GAFAIG’s governance data plane and system of record. All verification activity is stored,
            queryable, and auditable—so scoring and decisions are deterministic and reproducible over time.
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">System of record</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence, findings, events, scores, and decisions are persisted in Snowflake so every outcome can
                be traced back to inputs and reviewed independently.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Deterministic scoring in SQL</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Scoring is executed as Snowflake-native logic so the same case inputs always produce the same
                results—making the governance signal stable, comparable, and auditable.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Cortex summaries for reporting</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence summaries can be generated to support consistent reporting and oversight—useful for
                review packets, public disclosures, and audit-ready narratives.
              </p>
            </div>
          </div>
        </div>

        {/* Data flow */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">End-to-end data flow</h2>
          <p className="text-sm text-gray-600">
            GAFAIG’s workflow is designed to be simple to explain and hard to fake:
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">1) Evidence intake</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence items (documents, links, dashboards, policies) are captured with structured metadata and
                stored as an auditable record.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">2) Evidence → findings</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Reviewers map evidence to requirements/controls and record findings (pass/fail/needs-work) with
                rationale—linked back to specific evidence.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">3) Findings → scoring → decision</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                A deterministic scoring engine produces a tier/band classification and decision outcome, with
                renewal triggers to keep claims current as systems evolve.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">4) Registry publication</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Public-facing registry views publish outcomes and high-level disclosures while sensitive evidence
                remains protected in the controlled verification layer.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border p-5">
            <div className="text-xs font-semibold text-gray-600 mb-2">Conceptual pipeline</div>
            <div className="font-mono text-xs leading-relaxed text-gray-800 whitespace-pre-wrap">
{`Evidence → Findings → Events → Scoring → Decision → Registry`}
            </div>
          </div>
        </div>

        {/* Security + access */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Security and access model</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            GAFAIG separates governance verification from public transparency. The controlled layer protects
            sensitive evidence, while the registry layer publishes outcomes and standardized disclosures.
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Controlled verification layer</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence and detailed findings are restricted to authorized reviewers and the verified organization,
                with least-privilege enforcement and full auditability.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Public registry layer</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                The registry publishes tier/band results and standardized disclosure summaries so oversight claims
                are comparable—without exposing sensitive artifacts.
              </p>
            </div>
          </div>
        </div>

        {/* Snowflake features */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Snowflake features used</h2>
          <p className="text-sm text-gray-600">
            GAFAIG is built to be Snowflake-native, deterministic, and auditable.
          </p>

          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li><span className="font-semibold">SQL-based scoring logic</span> for reproducible outcomes</li>
            <li><span className="font-semibold">Views</span> to power admin and registry read models</li>
            <li><span className="font-semibold">Role-based access control</span> + least privilege enforcement</li>
            <li><span className="font-semibold">Audit-friendly data modeling</span> (traceability from decision → evidence)</li>
            <li><span className="font-semibold">Cortex</span> for evidence summarization and reporting artifacts</li>
          </ul>
        </div>

        {/* Why it matters */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Why this matters</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            AI oversight fails when it cannot be reproduced, compared, or audited. GAFAIG makes oversight measurable:
            a stable governance signal grounded in evidence, recorded decisions, and transparent outcomes—designed
            for planetary-scale interoperability.
          </p>
        </div>
      </section>
    </main>
  );
}
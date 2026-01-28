export default function StandardsPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>
        GAFAIG Standards
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 32 }}>
        GAFAIG standards define verifiable expectations for human-centered AI governance.
        They are designed to support transparency, accountability, and institutional trust
        through clear disclosure requirements, evidence-based evaluation, and consistent
        interpretation.
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Standards posture
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG standards are written to avoid superficial or checkbox-based compliance.
          Where discretion exists, GAFAIG favors substance over marketing claims, requires
          traceability of decisions, and applies procedural consistency across applicants.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          Published standards
        </h2>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            GAFAIG-S-001 — Human Impact Disclosure Standard
          </h3>
          <p style={{ lineHeight: 1.7, color: "#374151" }}>
            Defines minimum disclosure requirements for how AI systems affect people,
            including intended use, deployment context, risk areas, monitoring practices,
            and accountability ownership.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            GAFAIG-S-002 — AI Incident Disclosure & Reporting Standard
          </h3>
          <p style={{ lineHeight: 1.7, color: "#374151" }}>
            Defines how organizations disclose, classify, and report AI incidents,
            including severity tiers, confidence scoring, reporting timelines, and
            update obligations as investigations evolve.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          How standards connect to certification
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG standards may be adopted voluntarily, but certification requires
          evidence. Applicants must demonstrate alignment through documented disclosures,
          operational controls, registry consistency, and ongoing obligations such as
          renewal and incident updates.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Versioning and updates
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Standards evolve as AI capabilities and governance needs change. GAFAIG publishes
          material updates with version identifiers and explanatory notes to maintain
          continuity and public trust.
        </p>
      </section>
    </main>
  );
}

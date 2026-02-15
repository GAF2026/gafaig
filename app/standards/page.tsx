import Link from "next/link";

export default function StandardsPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: 16 }}>
        GAFAIG Standards
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 32 }}>
        GAFAIG standards define verifiable expectations for human-centered AI governance.
        They are designed to support transparency, accountability, and institutional trust
        through clear disclosure requirements, evidence-based evaluation, and consistent
        interpretation.
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
          Standards posture
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG standards are written to avoid superficial or checkbox-based compliance.
          Where discretion exists, GAFAIG favors substance over marketing claims, requires
          traceability of decisions, and applies procedural consistency across applicants.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
          Published standards
        </h2>

        <div
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 14,
            padding: "16px 16px",
            background: "white",
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>
            HG-1 · v1.0
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: "6px 0 6px" }}>
            GAFAIG Human Governance Standard
          </h3>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#374151" }}>
            Defines minimum requirements for accountable human oversight, override authority,
            auditability, and prohibitions against AI self-governance.
          </p>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/standards/hg/v1"
              style={{
                display: "inline-block",
                padding: "0.7rem 0.95rem",
                borderRadius: 12,
                border: "1px solid #000",
                background: "#000",
                color: "#fff",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Read HG-1 v1.0
            </Link>

            <Link
              href="/participants"
              style={{
                display: "inline-block",
                padding: "0.7rem 0.95rem",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.18)",
                background: "white",
                color: "#000",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              View registry
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
            GAFAIG-S-001 — Human Impact Disclosure Standard
          </h3>
          <p style={{ lineHeight: 1.7, color: "#374151" }}>
            Defines minimum disclosure requirements for how AI systems affect people,
            including intended use, deployment context, risk areas, monitoring practices,
            and accountability ownership.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
            GAFAIG-S-002 — AI Incident Disclosure &amp; Reporting Standard
          </h3>
          <p style={{ lineHeight: 1.7, color: "#374151" }}>
            Defines how organizations disclose, classify, and report AI incidents,
            including severity tiers, confidence scoring, reporting timelines, and
            update obligations as investigations evolve.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
          How standards connect to designation
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG standards may be adopted voluntarily, but public designation requires
          evidence. Applicants must demonstrate alignment through documented disclosures,
          operational controls, registry consistency, and ongoing obligations such as
          renewal and incident updates.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
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
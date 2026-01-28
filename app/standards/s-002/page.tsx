import Link from "next/link";

export default function S002Page() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ marginBottom: 14 }}>
        <Link href="/standards" style={{ textDecoration: "none", color: "#111827" }}>
          ← Back to Standards
        </Link>
      </p>

      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 10 }}>
        GAFAIG-S-002 — AI Incident Disclosure & Reporting Standard
      </h1>

      <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 26 }}>
        GAFAIG-S-002 defines expectations for how organizations disclose, classify, and
        report AI-related incidents. The standard is designed to promote timely awareness,
        proportional transparency, and continuous updating as information evolves.
      </p>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Scope
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          This standard applies to AI incidents that may materially affect individuals,
          groups, systems, or public trust. Covered incidents include unintended outcomes,
          misuse, failures, near-misses, and emergent behaviors identified during operation
          or post-deployment review.
        </p>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Incident classification
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Incidents should be classified using defined severity tiers and confidence
          indicators. Classification may evolve as investigations proceed and new evidence
          becomes available.
        </p>
        <ul style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            <strong>Severity:</strong> degree of actual or potential harm.
          </li>
          <li>
            <strong>Confidence:</strong> level of certainty regarding facts and causation.
          </li>
          <li>
            <strong>Scope:</strong> systems, users, or populations affected.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Disclosure expectations
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Organizations are expected to disclose incidents in a manner proportionate to
          severity and confidence. Initial disclosures may be high-level and should be
          updated as facts are verified. GAFAIG discourages premature conclusions while
          emphasizing timely acknowledgment.
        </p>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Ongoing updates
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Incident records are not static. Updates should reflect investigative findings,
          corrective actions, and resolution status. Where public disclosure thresholds
          apply, GAFAIG policies govern what information is published and when.
        </p>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Evidence and traceability
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Incident disclosures should be supported by internal records such as logs,
          timelines, investigation notes, and remediation actions. GAFAIG may review
          evidence as part of certification assessment or follow-up processes.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Interpretation posture
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG interprets this standard to prioritize clarity, proportionality, and
          procedural fairness. The objective is to improve governance outcomes, not to
          penalize good-faith reporting or evolving understanding.
        </p>
      </section>
    </main>
  );
}

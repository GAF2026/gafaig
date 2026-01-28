import Link from "next/link";

export default function S001Page() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ marginBottom: 14 }}>
        <Link href="/standards" style={{ textDecoration: "none", color: "#111827" }}>
          ← Back to Standards
        </Link>
      </p>

      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 10 }}>
        GAFAIG-S-001 — Human Impact Disclosure Standard
      </h1>

      <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 26 }}>
        GAFAIG-S-001 defines minimum disclosure requirements for how AI systems affect people.
        It is designed to enable meaningful transparency, reduce ambiguity, and support evidence-based
        governance evaluation.
      </p>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Scope</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          This standard applies to AI systems that materially affect human outcomes, access,
          opportunities, safety, rights, or welfare. It covers disclosures related to intended use,
          deployment context, affected populations, and accountability ownership.
        </p>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Required disclosure domains (overview)
        </h2>
        <ul style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            <strong>System purpose & intended use:</strong> what the system is designed to do and where it is used.
          </li>
          <li>
            <strong>Deployment context:</strong> environment, user groups, and operational constraints.
          </li>
          <li>
            <strong>Affected populations:</strong> who may be impacted and how impacts are identified.
          </li>
          <li>
            <strong>Risk areas:</strong> foreseeable harms, misuse vectors, and impact boundaries.
          </li>
          <li>
            <strong>Monitoring & controls:</strong> oversight, testing, and ongoing evaluation practices.
          </li>
          <li>
            <strong>Accountability ownership:</strong> who is responsible for decisions, escalation, and remediation.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Evidence expectations
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Claims should be supportable with documented artifacts such as system documentation,
          testing summaries, monitoring procedures, escalation policies, and governance review records.
          Where disclosures rely on judgment, the rationale should be recorded and attributable.
        </p>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Interpretation posture
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG interprets this standard to prevent “checkbox compliance.” Where discretion exists,
          GAFAIG favors substance over marketing claims, requires traceability of decisions, and
          evaluates disclosures for completeness, clarity, and real-world applicability.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Versioning
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG standards are living documents. Material updates are versioned and published with
          explanatory notes to maintain continuity and public trust.
        </p>
      </section>
    </main>
  );
}

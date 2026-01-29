import Link from "next/link";

export default function EnforcementBoundaryPolicyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ marginBottom: 14 }}>
        <Link href="/policy" style={{ textDecoration: "none", color: "#111827" }}>
          ← Back to Policies
        </Link>
      </p>

      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 10 }}>
        GAFAIG Certification Enforcement Boundary
      </h1>

      <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 22 }}>
        This statement defines the scope and limits of GAFAIG certification enforcement. It is
        intended to preserve accuracy, procedural fairness, and public trust while avoiding
        misinterpretation of GAFAIG’s role.
      </p>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>1. Nature of GAFAIG authority</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG is a certification authority operating under published standards, program
          terms, and procedural policies. GAFAIG is not a governmental regulator, law
          enforcement body, court, or arbitration forum.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>2. What GAFAIG may do</h2>
        <ul style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Evaluate applications against GAFAIG standards and program requirements</li>
          <li>Issue, deny, suspend, modify scope, or revoke certification under defined procedures</li>
          <li>Publish registry entries consistent with disclosure thresholds</li>
          <li>Require corrective actions or evidence supplementation as a condition of certification status</li>
          <li>Investigate potential misuse of the GAFAIG compliance mark within program scope</li>
        </ul>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>3. What GAFAIG does not do</h2>
        <ul style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Determine legal liability, fault, or negligence</li>
          <li>Provide legal advice or regulatory clearance</li>
          <li>Guarantee safety, performance, legality, or absence of harm</li>
          <li>Compel third parties to comply with GAFAIG standards</li>
          <li>Publish confidential applicant information except as permitted by policy and terms</li>
        </ul>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>4. Enforcement mechanisms</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG enforcement is programmatic and procedural, primarily through certification
          status decisions and controlled licensing of the GAFAIG compliance mark. Where misuse
          occurs, GAFAIG may pursue corrective actions and program remedies under published
          procedures and applicable agreement terms.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>5. Procedural fairness</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG maintains a defined pathway for clarification, reconsideration, and appeal
          of certain decisions, as specified by GAFAIG policy. This boundary statement does
          not expand or reduce rights otherwise stated in GAFAIG program terms.
        </p>
      </section>
    </main>
  );
}

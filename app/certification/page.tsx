export default function CertificationPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>
        GAFAIG Certification
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 32 }}>
        GAFAIG certification is a governance signal grounded in published standards,
        documented evidence, and defined review procedures. Certification enables eligible
        organizations to represent verified alignment with GAFAIG requirements and, where
        applicable, to license the GAFAIG compliance mark under controlled rules.
      </p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          What certification is
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>Evidence-based evaluation against GAFAIG standards (S-series)</li>
          <li>Defined review workflows with documented decisions</li>
          <li>Ongoing obligations: updates, renewal, and incident reporting where applicable</li>
          <li>Controlled use of the GAFAIG compliance mark for approved scope</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          What certification is not
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG is not a government regulator, court, or law enforcement body. Certification
          does not replace legal compliance obligations and does not constitute a guarantee
          of safety, legality, or performance. Certification reflects alignment with GAFAIG’s
          published requirements based on information provided and reviewed under defined
          procedures.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Certification ladder (overview)
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG certification is designed as a tiered ladder to support adoption at different
          maturity levels. Each tier has explicit scope definitions and evidence requirements.
          Detailed tier criteria, mark rules, and pricing are published as part of the GAFAIG
          certification program.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Why certification can change
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Certification status may change as information changes. This includes new evidence,
          scope changes, updated disclosures, incident developments, renewal outcomes, or
          policy/standard revisions. GAFAIG publishes procedural policies governing suspension,
          revocation, and appeals to ensure consistency and fairness.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Next steps
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          The certification program includes published standards (S-series), master terms,
          evidence requirements, application workflow, and a public certification registry.
          Applicants should review the standards and program terms before submitting an
          application.
        </p>
      </section>
    </main>
  );
}

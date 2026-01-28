import Link from "next/link";

export default function ApplyCertificationPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ marginBottom: 14 }}>
        <Link href="/certification" style={{ textDecoration: "none", color: "#111827" }}>
          ← Back to Certification
        </Link>
      </p>

      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>
        Apply for GAFAIG Certification
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 28 }}>
        GAFAIG certification is available to organizations seeking to demonstrate verified
        alignment with human-centered AI governance standards. Applications are reviewed
        using documented evidence and defined procedures.
      </p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Before you apply
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>
            Review the applicable GAFAIG standards, including{" "}
            <Link href="/standards/s-001">GAFAIG-S-001</Link> and{" "}
            <Link href="/standards/s-002">GAFAIG-S-002</Link>.
          </li>
          <li>
            Confirm the scope of systems, products, or services you intend to certify.
          </li>
          <li>
            Prepare supporting documentation describing governance practices, disclosures,
            and monitoring controls.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          What the application includes
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>Organizational information and certification scope</li>
          <li>Standards alignment disclosures and evidence references</li>
          <li>Incident reporting posture and update commitments (where applicable)</li>
          <li>Applicant acknowledgments and acceptance of certification terms</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Review process
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Applications are reviewed by GAFAIG using a structured process. Review may
          include clarification requests, scope refinement, or evidence supplementation.
          Certification outcomes are recorded in the public registry in accordance with
          GAFAIG disclosure policies.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Certification status
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Certification status may change over time based on renewal outcomes, new
          information, incident developments, or standards updates. GAFAIG publishes
          procedural policies governing suspension, revocation, and appeals.
        </p>
      </section>

      <section
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: 24,
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 12 }}>
          Application intake
        </p>
        <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>
          The online application form will be available in an upcoming release. In the
          interim, organizations may express interest by contacting GAFAIG.
        </p>

        <Link
          href="/contact"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            border: "1px solid #111827",
            textDecoration: "none",
            color: "#111827",
            fontWeight: 600,
          }}
        >
          Contact GAFAIG to Apply
        </Link>
      </section>
    </main>
  );
}

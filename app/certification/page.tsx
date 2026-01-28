import Link from "next/link";

export default function CertificationPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>
        GAFAIG Certification
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 28 }}>
        GAFAIG certification provides an independent, structured assessment of alignment
        with human-centered AI governance standards. Certification is evidence-based,
        scope-defined, and subject to ongoing review.
      </p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          What certification represents
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>Verified alignment with applicable GAFAIG standards</li>
          <li>Clear definition of certified scope</li>
          <li>Documented governance, monitoring, and accountability practices</li>
          <li>Public registry listing subject to disclosure thresholds</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Applicable standards
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Certification assessments reference GAFAIG’s published standards, including:
        </p>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>
            <Link href="/standards/s-001">GAFAIG-S-001 — Human Impact Disclosure</Link>
          </li>
          <li>
            <Link href="/standards/s-002">GAFAIG-S-002 — AI Incident Disclosure & Reporting</Link>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Certification lifecycle
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>Application and scope definition</li>
          <li>Evidence review and clarification</li>
          <li>Certification decision and registry publication</li>
          <li>Ongoing monitoring and renewal</li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Status changes and governance
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Certification status may change over time based on renewal outcomes, new
          information, incident developments, or standards updates. GAFAIG publishes
          procedural policies governing suspension, revocation, and appeals to ensure
          consistency and fairness.
        </p>
      </section>

      <section
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          Next steps
        </h2>

        <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>
          Organizations seeking certification should review applicable standards and
          program terms before beginning the application or renewal process.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/certification/apply"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #111827",
              textDecoration: "none",
              color: "#111827",
              fontWeight: 600,
            }}
          >
            Apply for Certification
          </Link>

          <Link
            href="/certification/renewal"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #111827",
              textDecoration: "none",
              color: "#111827",
              fontWeight: 600,
            }}
          >
            Renewal & Fast-Track
          </Link>
        </div>
      </section>
    </main>
  );
}

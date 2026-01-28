import Link from "next/link";

export default function RenewalPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ marginBottom: 14 }}>
        <Link href="/certification" style={{ textDecoration: "none", color: "#111827" }}>
          ← Back to Certification
        </Link>
      </p>

      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>
        Renewal & Low-Risk Fast-Track
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 28 }}>
        GAFAIG certification is not a one-time event. Renewal validates that certification
        scope, disclosures, and operational governance remain current. In limited cases,
        GAFAIG may offer a low-risk fast-track pathway when changes are minimal and evidence
        is strong.
      </p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Standard renewal
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>Confirm scope remains accurate</li>
          <li>Update disclosures (S-001 / S-002) where needed</li>
          <li>Provide evidence updates (controls, monitoring, governance)</li>
          <li>Report material incidents and outcomes since last review (as applicable)</li>
          <li>Re-accept applicable program terms for the renewal period</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Low-risk fast-track (eligibility overview)
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Fast-track review may be available when the applicant demonstrates that changes are
          limited, the certified scope is stable, and there are no unresolved material incidents.
          GAFAIG retains discretion to deny fast-track and require standard review.
        </p>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>Minimal scope changes (or none)</li>
          <li>No unresolved high-severity incidents within scope</li>
          <li>Strong monitoring and documentation continuity</li>
          <li>Clear update log since prior certification decision</li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Outcomes and status
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Renewal outcomes may include continued certification, scope modification, conditional
          certification, or status change. Certification status changes are governed by published
          GAFAIG policies, including procedural (non-punitive) suspension, revocation, and appeals.
        </p>
      </section>

      <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: 24 }}>
        <p style={{ fontWeight: 600, marginBottom: 12 }}>Renewal intake</p>
        <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>
          The online renewal / fast-track intake form will be available in an upcoming release.
          For now, contact GAFAIG to begin a renewal review.
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
          Contact GAFAIG for Renewal
        </Link>
      </section>
    </main>
  );
}

import Link from "next/link";

export default function RegistryDisclosureThresholdsPolicyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ marginBottom: 14 }}>
        <Link href="/policy" style={{ textDecoration: "none", color: "#111827" }}>
          ← Back to Policies
        </Link>
      </p>

      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 10 }}>
        Public Registry Disclosure Thresholds
      </h1>

      <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 22 }}>
        This policy defines what information GAFAIG may publish in the public certification
        registry, when it may be published, and what may be withheld or delayed. The goal is
        proportional transparency without publishing unverified claims, sensitive details, or
        information under active review.
      </p>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>1. Core registry fields</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Unless otherwise restricted by this policy or program terms, GAFAIG may publish:
        </p>
        <ul style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Organization name</li>
          <li>Certification status (e.g., certified, suspended, revoked, expired)</li>
          <li>Certification tier (where applicable)</li>
          <li>Certified scope description</li>
          <li>Applicable standards (e.g., S-001, S-002)</li>
          <li>Effective date and renewal/expiry indicators</li>
        </ul>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>2. Conditional disclosures</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG may publish limited status history, decision summaries, or corrective action
          indicators when doing so improves clarity and reduces risk of deception, provided that
          the information is verified and publication does not violate confidentiality or fairness
          requirements.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>3. Withheld or delayed disclosures</h2>
        <ul style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Unverified allegations or incomplete investigative findings</li>
          <li>Confidential security details, exploit information, or sensitive operational data</li>
          <li>Personal data or information identifying individual complainants</li>
          <li>Proprietary applicant materials not required for public understanding</li>
          <li>Information subject to legal restriction or credible safety risk</li>
        </ul>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>4. Accuracy and corrections</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG may correct registry entries if errors are discovered or if new verified
          information materially changes the record. Corrections may include status updates,
          scope refinements, and clarifying notes. GAFAIG does not guarantee continuous uptime,
          but aims for timely updates consistent with program procedures.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>5. Relationship to program terms</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          This policy is governed by GAFAIG program terms and may be updated with versioning.
          Applicants agree that GAFAIG may publish registry information consistent with this
          policy and controlling agreements.
        </p>
      </section>
    </main>
  );
}

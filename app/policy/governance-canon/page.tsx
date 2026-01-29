export default function GovernanceCanonPage() {
  return (
    <main style={{ padding: "4rem", maxWidth: "960px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700 }}>
        GAFAIG Governance Canon
      </h1>

      <p style={{ marginTop: "1.5rem", fontSize: "1.1rem", lineHeight: 1.7 }}>
        The GAFAIG Governance Canon defines how GAFAIG makes decisions, how certification
        review is conducted, how conflicts are managed, and how GAFAIG instruments are
        updated over time. This Canon is procedural and non-adjudicative.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        1) Canonical Instruments
      </h2>
      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>
          <strong>Standards:</strong> Requirements (e.g., S-001, S-002) that define what must be met.
        </li>
        <li>
          <strong>Policies:</strong> Operational rules (enforcement boundaries, appeals, registry disclosures, master terms).
        </li>
        <li>
          <strong>Registry:</strong> Public record of certification status, subject to disclosure thresholds.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        2) Decision Authority & Separation of Functions
      </h2>
      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        GAFAIG governance is structured to separate (a) assessment and review from
        (b) enforcement and status-change actions. Automated tooling may assist review,
        but final authority remains human.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        3) Conflicts of Interest
      </h2>
      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>Reviewers must disclose material conflicts and recuse where appropriate.</li>
        <li>Certification outcomes must not be contingent on commercial sponsorship.</li>
        <li>Policy changes must not be tailored to individual applicants.</li>
      </ul>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        4) Certification Status Changes
      </h2>
      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        Certification status may change through renewal outcomes, discovery of material
        nonconformance, or verified incident disclosures. Status changes are governed by
        GAFAIG policy and are procedural and non-punitive.
      </p>

      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>
          <a href="/policy/enforcement-boundary" style={{ fontWeight: 600 }}>
            Enforcement Boundary Statement
          </a>
        </li>
        <li>
          <a href="/policy/revocation-suspension" style={{ fontWeight: 600 }}>
            Revocation & Suspension Policy
          </a>
        </li>
        <li>
          <a href="/policy/appeals" style={{ fontWeight: 600 }}>
            Appeals & Reconsideration Framework
          </a>
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        5) Amendments & Versioning
      </h2>
      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        GAFAIG may update standards and policies to reflect evolving risk, technology,
        and governance best practices. Changes are versioned, documented, and may include
        transition periods. GAFAIG publishes applicant-facing explanations of material
        changes when they impact certification expectations.
      </p>

      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>
          <a href="/policy/master-terms" style={{ fontWeight: 600 }}>
            Certification Agreement — Master Terms
          </a>
        </li>
        <li>
          <a href="/policy" style={{ fontWeight: 600 }}>
            Policy Index
          </a>
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        6) Public Trust Commitments
      </h2>
      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>Publish standards and policies openly.</li>
        <li>Maintain a verifiable registry with disclosure thresholds.</li>
        <li>Maintain due process, notice, and appeals procedures.</li>
        <li>Maintain independence from vendor influence.</li>
      </ul>

      <p style={{ marginTop: "2rem", color: "rgba(0,0,0,0.7)", lineHeight: 1.7 }}>
        Note: This Canon is not legal advice and does not create legal obligations
        beyond GAFAIG’s published certification agreement and applicable law.
      </p>
    </main>
  );
}

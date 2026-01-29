export default function GovernancePage() {
  return (
    <main style={{ padding: "4rem", maxWidth: "960px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700 }}>
        GAFAIG Governance Framework
      </h1>

      <p style={{ marginTop: "1.5rem", fontSize: "1.1rem", lineHeight: 1.7 }}>
        The Global Authority for AI Governance (GAFAIG) operates as an independent,
        human-centered certification authority. Its governance framework is designed
        to ensure legitimacy, neutrality, accountability, and transparency in the
        oversight of AI systems and organizations.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        Governance Principles
      </h2>

      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>
          <strong>Human Primacy:</strong> AI systems remain subordinate to human
          values, rights, and decision-making authority.
        </li>
        <li>
          <strong>Independence:</strong> GAFAIG governance decisions are insulated
          from commercial, political, and vendor influence.
        </li>
        <li>
          <strong>Transparency:</strong> Standards, processes, and enforcement
          boundaries are publicly documented.
        </li>
        <li>
          <strong>Proportionality:</strong> Oversight intensity scales with risk,
          impact, and deployment context.
        </li>
        <li>
          <strong>Due Process:</strong> Applicants and certified entities are entitled
          to notice, explanation, and appeal.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        Governance Instruments
      </h2>

      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        GAFAIG governance is formalized through the following canonical instruments:
      </p>

      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>
          <a href="/policy/charter" style={{ fontWeight: 600 }}>
            GAFAIG Charter
          </a>{" "}
          — Establishes GAFAIG’s mandate, authority boundaries, and institutional role.
        </li>
        <li>
          <a href="/policy/governance-canon" style={{ fontWeight: 600 }}>
            Governance Canon
          </a>{" "}
          — Defines decision-making structures, review authority, escalation paths,
          and amendment procedures.
        </li>
        <li>
          <a href="/policy" style={{ fontWeight: 600 }}>
            Policy Framework
          </a>{" "}
          — Includes enforcement boundaries, revocation & suspension rules,
          appeals, registry disclosure thresholds, and master certification terms.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        Oversight & Accountability
      </h2>

      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        GAFAIG governance includes structured human review, internal separation
        of assessment and enforcement functions, and documented escalation paths
        for material incidents or disputes. Automated systems may assist review,
        but final authority remains human.
      </p>

      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        Governance decisions do not constitute legal judgments, regulatory approvals,
        or warranties. GAFAIG certification reflects compliance with GAFAIG standards
        at the time of assessment.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>
        Public Trust Commitment
      </h2>

      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        GAFAIG’s governance framework exists to serve the public interest by enabling
        credible, global, and human-centered AI accountability — without replacing
        democratic institutions, regulators, or courts.
      </p>
    </main>
  );
}

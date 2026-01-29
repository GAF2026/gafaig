export default function CharterPage() {
  return (
    <main style={{ padding: "4rem", maxWidth: "960px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700 }}>GAFAIG Charter</h1>

      <p style={{ marginTop: "1.5rem", fontSize: "1.1rem", lineHeight: 1.7 }}>
        This Charter establishes the mandate, scope boundaries, and operational posture
        of the Global Authority for AI Governance (GAFAIG) as an independent certification
        authority. The Charter is designed to maximize public trust, procedural fairness,
        and transparency while remaining non-regulatory and non-adjudicative.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>1) Mission</h2>
      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        GAFAIG exists to advance human-centered AI governance by publishing standards,
        operating a certification and registry system, and enabling credible disclosure
        of AI impacts and incidents.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>2) Scope of Authority</h2>
      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>
          GAFAIG defines requirements for certification against GAFAIG standards (e.g., S-001, S-002).
        </li>
        <li>
          GAFAIG operates an applicant review workflow, renewal process, and public registry.
        </li>
        <li>
          GAFAIG publishes policy governing certification status changes, appeals, and disclosure thresholds.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>3) Explicit Non-Claims</h2>
      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>GAFAIG is not a regulator and does not grant legal approval or authorization.</li>
        <li>GAFAIG does not adjudicate disputes or determine legal liability.</li>
        <li>GAFAIG certification is not a warranty and does not eliminate risk.</li>
      </ul>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>4) Independence</h2>
      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        GAFAIG governance and certification decisions are designed to be insulated from
        vendor influence, political control, and financial conflicts of interest. GAFAIG
        may partner with institutions but retains independent judgment over standards and certification.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>5) Transparency</h2>
      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        GAFAIG publishes its standards, certification rules, disclosure policies, and enforcement boundaries.
        The public registry provides status information subject to disclosure thresholds policy.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>6) Due Process</h2>
      <p style={{ marginTop: "1rem", lineHeight: 1.7 }}>
        GAFAIG provides notice and explanation of material certification status changes and
        offers an appeals and reconsideration pathway according to GAFAIG policy.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.75rem" }}>7) Canonical References</h2>
      <ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        <li>
          <a href="/policy" style={{ fontWeight: 600 }}>Policy Index</a>
        </li>
        <li>
          <a href="/policy/enforcement-boundary" style={{ fontWeight: 600 }}>
            Certification Enforcement Boundary Statement
          </a>
        </li>
        <li>
          <a href="/policy/appeals" style={{ fontWeight: 600 }}>
            Appeals & Reconsideration Framework
          </a>
        </li>
        <li>
          <a href="/standards" style={{ fontWeight: 600 }}>Standards Index</a>
        </li>
      </ul>
    </main>
  );
}

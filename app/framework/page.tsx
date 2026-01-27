import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Framework — GAFAIG",
  description:
    "GAFAIG’s framework defines practical, auditable standards for transparent AI oversight, participation, and accountability at planetary scale.",
};

export default function FrameworkPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "4rem 1rem",
        lineHeight: 1.7,
      }}
    >
      <h1>Framework</h1>

      <p style={{ marginTop: "1.5rem", fontSize: "1.05rem", opacity: 0.9 }}>
        GAFAIG’s framework is a practical governance structure for high-impact AI
        systems—designed to be transparent, measurable, and enforceable across
        jurisdictions. It focuses on what can be implemented: standards,
        verification, reporting, and clear accountability.
      </p>

      <h2 style={{ marginTop: "3rem" }}>Core Components</h2>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>
          <strong>Scope classification:</strong> Defines which AI systems require
          heightened oversight based on impact, autonomy, scale, and risk.
        </li>
        <li>
          <strong>Baseline requirements:</strong> Minimum expectations for safety
          testing, data governance, monitoring, and incident response.
        </li>
        <li>
          <strong>Transparency & reporting:</strong> Standardized disclosures and
          reporting practices so oversight can be consistent and comparable.
        </li>
        <li>
          <strong>Auditability:</strong> Independent evaluation pathways and
          verifiable evidence for compliance claims.
        </li>
        <li>
          <strong>Accountability chain:</strong> Clarifies responsibility across
          developers, deployers, operators, and downstream integrators.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>What “Good” Looks Like</h2>

      <p>
        The framework is built around concrete outcomes, not vague aspirations.
        In practice, a governed AI system should be:
      </p>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>
          <strong>Explainable to oversight bodies:</strong> Not necessarily fully
          interpretable, but documentable, testable, and reviewable.
        </li>
        <li>
          <strong>Continuously monitored:</strong> With mechanisms to detect
          drift, misuse, and emergent risk as conditions change.
        </li>
        <li>
          <strong>Auditable end-to-end:</strong> With traceable evidence for key
          claims about safety, security, and performance.
        </li>
        <li>
          <strong>Governed by enforceable rules:</strong> Including escalation,
          remediation, and consequences for non-compliance.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>Standards & Artifacts</h2>

      <p>
        GAFAIG’s framework is intended to produce a set of reusable governance
        artifacts that organizations and regulators can adopt:
      </p>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>Risk tiering and scope definitions for high-impact systems</li>
        <li>Audit and evaluation requirements for safety and security</li>
        <li>Model and system disclosure templates</li>
        <li>Incident reporting and response standards</li>
        <li>Public participation mechanisms and comment pathways</li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>Interoperable by Design</h2>

      <p>
        AI governance will not succeed if every jurisdiction creates incompatible
        standards. GAFAIG is built to support interoperability—so that oversight
        can remain consistent while still respecting local law, culture, and
        institutional structure.
      </p>

      <p>
        The objective is a shared governance backbone: a common language for
        evaluating high-impact AI systems and a practical pathway to transparent
        oversight at planetary scale.
      </p>
    </main>
  );
}

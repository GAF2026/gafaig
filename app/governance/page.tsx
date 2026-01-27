import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governance — GAFAIG",
  description:
    "GAFAIG governance is designed to be transparent, globally inclusive, privacy-preserving, and resistant to capture.",
};
export default function GovernancePage() {
  return (
    <main style={{ padding: "4rem", fontFamily: "sans-serif" }}>
      <h1>Governance</h1>
      <p style={{ maxWidth: 900, lineHeight: 1.6 }}>
        GAFAIG governance is designed to be transparent, globally inclusive, and resistant to capture. The goal is to
        enable meaningful human input and oversight for high-impact AI systems, while remaining practical to implement.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Guiding principles</h2>
      <ul style={{ maxWidth: 1000, lineHeight: 1.7 }}>
        <li><b>One-human, one-voice:</b> governance should reflect broad human participation, not only institutions.</li>
        <li><b>Transparency by default:</b> decisions, standards, and audits should be publicly legible.</li>
        <li><b>Accountability:</b> clear responsibility, escalation, and remedies.</li>
        <li><b>Privacy-preserving participation:</b> protect individuals while preventing duplicate voting.</li>
      </ul>

      <h2 style={{ marginTop: "2rem" }}>Structure (proposal)</h2>
      <ol style={{ maxWidth: 1000, lineHeight: 1.7 }}>
        <li>
          <b>Public Registry & Standards</b> — a living set of standards, controls, and documentation.
        </li>
        <li>
          <b>Oversight Council</b> — stewards the process, conflict-of-interest rules, and transparency requirements.
        </li>
        <li>
          <b>Independent Audit Network</b> — qualified auditors evaluate compliance and publish results.
        </li>
        <li>
          <b>Public Comment & Deliberation</b> — formal channels for input, objections, and improvement proposals.
        </li>
      </ol>

      <h2 style={{ marginTop: "2rem" }}>Decision types</h2>
      <ul style={{ maxWidth: 1000, lineHeight: 1.7 }}>
        <li><b>Standards updates:</b> new controls, evaluation methods, disclosure rules.</li>
        <li><b>Classification:</b> what qualifies as high-impact / high-risk.</li>
        <li><b>Audit outcomes:</b> pass/fail, remediation timelines, public reporting.</li>
        <li><b>Incident response:</b> escalation, investigation, and corrective actions.</li>
      </ul>

      <h2 style={{ marginTop: "2rem" }}>Privacy + uniqueness (direction)</h2>
      <p style={{ maxWidth: 1000, lineHeight: 1.6 }}>
        GAFAIG aims to support privacy-preserving mechanisms that ensure one human participates once (e.g., biometric
        uniqueness with privacy protections). Specific implementations should be independently reviewed and aligned with
        human rights principles.
      </p>
    </main>
  );
}

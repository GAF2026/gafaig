import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Framework — GAFAIG",
  description:
    "The GAFAIG framework provides a practical, auditable structure for governing high-impact AI systems across jurisdictions.",
};
export default function FrameworkPage() {
  return (
    <main style={{ padding: "4rem", fontFamily: "sans-serif" }}>
      <h1>Framework</h1>
      <p style={{ maxWidth: 900, lineHeight: 1.6 }}>
        The GAFAIG framework is a practical structure for governing high-impact AI systems. It is designed to be
        transparent, auditable, and adaptable across jurisdictions while preserving local autonomy.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Core pillars</h2>
      <ol style={{ maxWidth: 1000, lineHeight: 1.7 }}>
        <li>
          <b>Scope & Classification</b> — Define which AI systems require enhanced governance based on impact, risk,
          and deployment context.
        </li>
        <li>
          <b>Standards & Controls</b> — Minimum requirements for safety, security, privacy, and reliability (with
          measurable controls).
        </li>
        <li>
          <b>Audit & Assurance</b> — Independent assessment of claims, evaluations, incident reporting, and ongoing
          monitoring.
        </li>
        <li>
          <b>Transparency & Disclosure</b> — Clear public reporting on model purpose, limitations, data practices, and
          governance posture.
        </li>
        <li>
          <b>Accountability & Remedies</b> — Responsibility, escalation, and remedies when systems cause harm or violate
          policy.
        </li>
      </ol>

      <h2 style={{ marginTop: "2rem" }}>Lifecycle governance</h2>
      <ul style={{ maxWidth: 1000, lineHeight: 1.7 }}>
        <li><b>Design:</b> document intended use, risk profile, and safety requirements.</li>
        <li><b>Build:</b> implement controls, logging, and evaluation protocols.</li>
        <li><b>Test:</b> validate performance, robustness, bias, and misuse resistance.</li>
        <li><b>Deploy:</b> apply access controls, monitoring, and user disclosures.</li>
        <li><b>Operate:</b> incident response, updates, and periodic re-audits.</li>
      </ul>

      <h2 style={{ marginTop: "2rem" }}>Outputs</h2>
      <ul style={{ maxWidth: 1000, lineHeight: 1.7 }}>
        <li>Open governance framework documentation</li>
        <li>Audit checklists and reporting templates</li>
        <li>Model/system transparency disclosures</li>
        <li>Incident reporting and escalation pathways</li>
      </ul>
    </main>
  );
}

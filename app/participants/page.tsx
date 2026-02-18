import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registry — GAFAIG",
  description:
    "The GAFAIG Registry lists participating organizations and governments committed to structured, auditable AI governance practices.",
};

export default function ParticipantsPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "4rem 1rem",
        lineHeight: 1.7,
      }}
    >
      <h1>GAFAIG Registry</h1>

      <p style={{ marginTop: "1.5rem", fontSize: "1.05rem", opacity: 0.9 }}>
        The GAFAIG Registry lists participating organizations and governments that have committed
        to structured, auditable AI governance practices.
      </p>

      <h2 style={{ marginTop: "3rem" }}>Participation levels</h2>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>
          <strong>Registered Participant:</strong> Public commitment to GAFAIG governance principles.
        </li>
        <li>
          <strong>Verified Participant:</strong> Evidence submitted and reviewed under defined
          certification criteria.
        </li>
        <li>
          <strong>Advanced Certification:</strong> Demonstrated implementation across high-impact AI
          systems.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>What registry inclusion signals</h2>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>Public alignment with transparent AI governance standards.</li>
        <li>Structured evidence collection and documentation.</li>
        <li>Defined review and reporting procedures.</li>
        <li>Commitment to continuous governance improvement.</li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>Transparency</h2>

      <p>
        Registry status reflects governance process and documentation under GAFAIG standards. It does
        not replace statutory compliance or regulatory oversight.
      </p>

      <h2 style={{ marginTop: "3rem" }}>How participation works</h2>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>Organizations submit evidence mapped to governance requirements.</li>
        <li>Reviewers validate evidence and record decisions with auditable rationale.</li>
        <li>Summary outputs can be generated and stored for reporting and oversight.</li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>Join the Registry</h2>

      <p>
        For the Snowflake challenge demo, the Registry is presented as the public-facing view of
        participation. The “Demo” button in the header opens the reviewer workflow.
      </p>
    </main>
  );
}
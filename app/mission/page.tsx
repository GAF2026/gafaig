import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission — GAFAIG",
  description:
    "GAFAIG’s mission is to establish a global, human-centered framework for AI governance with transparent oversight, participation, and accountability.",
};

export default function MissionPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "4rem 1rem",
        lineHeight: 1.7,
      }}
    >
      <h1>Mission</h1>

      <p style={{ marginTop: "1.5rem", fontSize: "1.05rem", opacity: 0.9 }}>
        GAFAIG exists to advance human-centered AI governance at planetary
        scale—so that powerful AI systems are developed and deployed with
        transparent oversight, meaningful public participation, and clear
        accountability.
      </p>

      <h2 style={{ marginTop: "3rem" }}>Why GAFAIG Exists</h2>

      <p>
        Artificial intelligence is rapidly becoming a foundational force shaping
        economies, societies, and global power structures. Yet governance
        mechanisms have not kept pace with the speed, scale, and impact of AI
        systems.
      </p>

      <p>
        GAFAIG was created to address this gap: to provide a neutral, global
        governance framework that ensures AI development remains aligned with
        human values, rights, and long-term societal well-being.
      </p>

      <h2 style={{ marginTop: "3rem" }}>What We Stand For</h2>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>
          <strong>Transparency:</strong> Governance processes, standards, and
          decisions must be visible, explainable, and auditable.
        </li>
        <li>
          <strong>Participation:</strong> People everywhere should have a voice
          in how AI systems that affect society are governed.
        </li>
        <li>
          <strong>Accountability:</strong> Clear responsibility must exist for
          harms, failures, and misuse of AI systems.
        </li>
        <li>
          <strong>Safety & Rights:</strong> Human rights, dignity, and security
          must be protected as AI capabilities grow.
        </li>
        <li>
          <strong>Practical Governance:</strong> Policies must be implementable,
          measurable, and continuously improvable.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>How We Pursue the Mission</h2>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>Publish open governance frameworks and standards.</li>
        <li>
          Define audit, reporting, and accountability requirements for
          high-impact AI systems.
        </li>
        <li>
          Create pathways for global public input and structured participation.
        </li>
        <li>
          Promote interoperability across jurisdictions, institutions, and
          governance models.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>A Planetary Perspective</h2>

      <p>
        GAFAIG is not a single-country regulator, corporate consortium, or
        advocacy group. It is a planetary-scale governance initiative—designed
        to operate across borders, cultures, and political systems.
      </p>

      <p>
        Our mission is to help humanity collectively steward powerful AI
        technologies with foresight, responsibility, and shared legitimacy.
      </p>
    </main>
  );
}

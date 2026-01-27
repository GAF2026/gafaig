import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Participate — GAFAIG",
  description:
    "How individuals, institutions, and organizations can participate in GAFAIG’s human-centered AI governance framework.",
};

export default function ParticipatePage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "4rem 1rem",
        lineHeight: 1.7,
      }}
    >
      <h1>Participate</h1>

      <p style={{ marginTop: "1.5rem", fontSize: "1.05rem", opacity: 0.9 }}>
        GAFAIG is built on the principle that AI governance must not be limited to
        a small set of actors. Meaningful oversight requires participation from
        people, institutions, and communities affected by AI systems around the
        world.
      </p>

      <h2 style={{ marginTop: "3rem" }}>Who Can Participate</h2>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>
          <strong>Individuals:</strong> Researchers, practitioners, and members
          of the public with relevant expertise or lived experience.
        </li>
        <li>
          <strong>Institutions:</strong> Academic bodies, standards organizations,
          civil society groups, and public institutions.
        </li>
        <li>
          <strong>Organizations:</strong> Developers, deployers, and operators of
          AI systems seeking transparent governance alignment.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>Forms of Participation</h2>

      <p>
        Participation in GAFAIG is designed to be structured, transparent, and
        constructive. Initial participation pathways include:
      </p>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>
          <strong>Public comment:</strong> Review and feedback on proposed
          governance standards and framework updates.
        </li>
        <li>
          <strong>Expert contribution:</strong> Technical, policy, or domain
          expertise provided through working groups and review panels.
        </li>
        <li>
          <strong>Institutional alignment:</strong> Adoption or reference of
          GAFAIG standards within organizational or regulatory contexts.
        </li>
        <li>
          <strong>Issue submission:</strong> Identification of emerging risks,
          governance gaps, or implementation challenges.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>Principles of Participation</h2>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        <li>
          <strong>Transparency:</strong> Participation processes and outcomes
          should be visible and documented.
        </li>
        <li>
          <strong>Equity:</strong> No single region, institution, or interest
          group should dominate governance outcomes.
        </li>
        <li>
          <strong>Accountability:</strong> Contributions are evaluated based on
          merit, evidence, and alignment with GAFAIG’s mission.
        </li>
        <li>
          <strong>Constructiveness:</strong> Participation should aim to improve
          governance quality and real-world outcomes.
        </li>
      </ul>

      <h2 style={{ marginTop: "3rem" }}>How to Get Involved Today</h2>

      <p>
        In the current phase, the primary pathway for participation is through
        direct engagement with the GAFAIG team. This allows for structured intake
        while governance processes are refined and scaled.
      </p>

      <p>
        To express interest, submit feedback, or inquire about participation
        opportunities, please use the{" "}
        <a href="/contact" style={{ textDecoration: "underline" }}>
          contact form
        </a>
        . Relevant inquiries will be reviewed and routed appropriately.
      </p>

      <h2 style={{ marginTop: "3rem" }}>Looking Ahead</h2>

      <p>
        Over time, GAFAIG intends to expand participation mechanisms to support
        broader global input at scale. This includes exploring privacy-preserving
        identity systems, structured deliberation models, and transparent
        aggregation of human input.
      </p>

      <p>
        Participation is not a symbolic gesture—it is a foundational element of
        legitimate AI governance at planetary scale.
      </p>
    </main>
  );
}

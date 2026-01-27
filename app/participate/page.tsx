import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Participate — GAFAIG",
  description:
    "Learn how individuals, researchers, institutions, and partners can participate in shaping global AI governance through GAFAIG.",
};
export default function ParticipatePage() {
  return (
    <main style={{ padding: "4rem", fontFamily: "sans-serif" }}>
      <h1>Participate</h1>
      <p style={{ maxWidth: 900, lineHeight: 1.6 }}>
        GAFAIG is building a global, human-centered approach to AI governance. Participation is open—individuals,
        researchers, practitioners, and institutions can all contribute.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Ways to participate</h2>
      <ul style={{ maxWidth: 1000, lineHeight: 1.7 }}>
        <li><b>Public feedback:</b> comment on standards, proposals, and governance processes.</li>
        <li><b>Research & drafting:</b> contribute to working documents and governance templates.</li>
        <li><b>Audit & assurance:</b> help develop evaluation methods and audit practices.</li>
        <li><b>Partnerships:</b> collaborate with universities, NGOs, and public institutions.</li>
      </ul>

      <h2 style={{ marginTop: "2rem" }}>Current priorities (next 90 days)</h2>
      <ol style={{ maxWidth: 1000, lineHeight: 1.7 }}>
        <li>Publish GAFAIG’s initial framework and glossary.</li>
        <li>Define minimum transparency and incident reporting requirements.</li>
        <li>Draft an audit-ready “high-impact AI” checklist.</li>
        <li>Launch a public participation process with clear moderation rules.</li>
      </ol>

      <h2 style={{ marginTop: "2rem" }}>Get involved</h2>
      <p style={{ maxWidth: 1000, lineHeight: 1.6 }}>
        For now, the simplest way to join is through the Contact page. We’ll add a mailing list and structured public
        feedback portal next.
      </p>
    </main>
  );
}

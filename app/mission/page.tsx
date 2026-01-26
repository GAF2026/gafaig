export default function MissionPage() {
  return (
    <main style={{ padding: "4rem", fontFamily: "sans-serif" }}>
      <h1>Mission</h1>
      <p style={{ maxWidth: 800, lineHeight: 1.6 }}>
        GAFAIG exists to advance human-centered AI governance at planetary scale—so that powerful AI systems
        are developed and deployed with transparent oversight, meaningful public participation, and clear
        accountability.
      </p>

      <h2 style={{ marginTop: "2rem" }}>What we stand for</h2>
      <ul style={{ maxWidth: 900, lineHeight: 1.7 }}>
        <li><b>Transparency:</b> Decisions, standards, and audits should be visible and explainable.</li>
        <li><b>Participation:</b> People everywhere should have a voice in how AI affects society.</li>
        <li><b>Accountability:</b> Clear responsibility for harms, failures, and misuse.</li>
        <li><b>Safety &amp; Rights:</b> Protect human rights, security, and dignity as AI capabilities grow.</li>
        <li><b>Practical governance:</b> Policies that can be implemented, measured, and improved.</li>
      </ul>

      <h2 style={{ marginTop: "2rem" }}>How we pursue the mission</h2>
      <ul style={{ maxWidth: 900, lineHeight: 1.7 }}>
        <li>Publish an open governance framework and standards.</li>
        <li>Define audit and reporting requirements for high-impact AI systems.</li>
        <li>Create pathways for public comment and global input.</li>
        <li>Promote interoperable governance across jurisdictions.</li>
      </ul>
    </main>
  );
}

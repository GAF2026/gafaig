export default function HomePage() {
  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 14,
    padding: "1.25rem",
    background: "white",
    textDecoration: "none",
    color: "inherit",
    display: "block",
  };

  const cardTitle: React.CSSProperties = {
    fontWeight: 800,
    marginBottom: "0.35rem",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  };

  const buttonPrimary: React.CSSProperties = {
    display: "inline-block",
    padding: "0.9rem 1.15rem",
    borderRadius: 12,
    border: "1px solid #000",
    background: "#000",
    color: "#fff",
    fontWeight: 800,
    textDecoration: "none",
  };

  const buttonSecondary: React.CSSProperties = {
    display: "inline-block",
    padding: "0.9rem 1.15rem",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.25)",
    background: "white",
    color: "#000",
    fontWeight: 800,
    textDecoration: "none",
  };

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "2.25rem 1.25rem 4rem" }}>
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0.7,
          marginBottom: "0.75rem",
        }}
      >
        Global Authority for AI Governance
      </div>

      <h1 style={{ fontSize: 44, lineHeight: 1.1, margin: 0, letterSpacing: "-0.02em" }}>
        Structured and auditable oversight of AI systems.
      </h1>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        <a style={buttonPrimary} href="/demo">
          Open the demo
        </a>
        <a style={buttonSecondary} href="/mission">
          Read the mission
        </a>
        <a style={buttonSecondary} href="/framework">
          Explore the framework
        </a>
        <a style={buttonSecondary} href="/participants">
          View the GAFAIG Registry
        </a>
      </div>

      <h2 style={{ marginTop: "3.25rem", fontSize: 22, letterSpacing: "-0.01em" }}>
        Core principles
      </h2>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <div style={cardTitle}>Transparency</div>
          <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88 }}>
            Decisions, standards, and audits should be visible, explainable, and reviewable.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>Participation</div>
          <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88 }}>
            People everywhere should have a voice in how AI affects society and the future.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>Accountability</div>
          <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88 }}>
            Clear responsibility for harms, failures, and misuse—paired with enforceable expectations.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>Safety &amp; rights</div>
          <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88 }}>
            Protect human rights, security, and dignity as high-impact systems evolve.
          </p>
        </div>
      </div>

      <h2 style={{ marginTop: "3.25rem", fontSize: 22, letterSpacing: "-0.01em" }}>
        Get involved
      </h2>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <div style={cardTitle}>For policymakers</div>
          <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88 }}>
            Align oversight across jurisdictions with practical, auditable requirements.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>For researchers</div>
          <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88 }}>
            Collaborate on standards, evaluations, and public-interest governance.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>For builders</div>
          <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88 }}>
            Implement governance-by-design and demonstrate compliance through clear reporting.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>For the public</div>
          <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88 }}>
            Participate in transparent processes that shape how AI is deployed and monitored.
          </p>
        </div>

        <a href="/participants" style={cardStyle}>
          <div style={cardTitle}>For organizations &amp; governments</div>
          <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88 }}>
            Join the GAFAIG Registry with a verified profile and participation level.
          </p>
        </a>
      </div>

      <div
        style={{
          marginTop: "3.5rem",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          fontSize: 12,
          opacity: 0.7,
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >

      </div>
    </main>
  );
}
import Link from "next/link";

export default function DemoQuickstartPage() {
  const pill: React.CSSProperties = {
    display: "inline-block",
    padding: "0.85rem 1.1rem",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "white",
    color: "#000",
    fontWeight: 800,
    textDecoration: "none",
  };

  const primary: React.CSSProperties = {
    ...pill,
    border: "1px solid #000",
    background: "#000",
    color: "#fff",
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding: "1.25rem",
    background: "#fff",
  };

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "3.25rem 1.25rem 4rem",
        lineHeight: 1.7,
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0.7,
          marginBottom: "0.75rem",
        }}
      >
        Demo
      </div>

      <h1 style={{ fontSize: 42, lineHeight: 1.1, margin: 0, letterSpacing: "-0.02em" }}>
        GAFAIG governance workflow demo
      </h1>

      <p style={{ marginTop: "1rem", fontSize: 18, opacity: 0.9, maxWidth: 820 }}>
        This demo shows how GAFAIG converts AI governance into structured,
        auditable data. Evidence is submitted, persisted, exposed through
        APIs, and designed to map directly into Snowflake tables for scalable
        oversight and analytics.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        <Link href="/admin/verification/CASE-0001/evidence" style={primary}>
          Start demo (CASE-0001)
        </Link>
        <Link href="/admin/login" style={pill} title="Admin entry (if needed)">
          Admin login
        </Link>
        <Link href="/" style={pill}>
          Back to home
        </Link>
      </div>

      <div style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
        <div style={card}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>What to do (60 seconds)</div>
          <ol style={{ margin: 0, paddingLeft: "1.25rem", opacity: 0.9 }}>
            <li>
              Open <strong>CASE-0001 → Evidence</strong>.
            </li>
            <li>
              Confirm that evidence records load and display in structured form.
            </li>
            <li>
              Use the search field to filter evidence.
            </li>
            <li>
              Open the evidence API endpoint to view structured JSON data.
            </li>
          </ol>
        </div>

        <div style={card}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>What this proves (Snowflake)</div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", opacity: 0.9 }}>
            <li>
              Governance artifacts are stored as structured, queryable data.
            </li>
            <li>
              Each verification case maps cleanly to relational data entities.
            </li>
            <li>
              The API layer exposes datasets suitable for Snowflake ingestion.
            </li>
            <li>
              This enables scalable auditability, analytics, and certification reporting.
            </li>
          </ul>
        </div>

        <div style={card}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Architecture alignment</div>
          <p style={{ margin: 0, opacity: 0.9 }}>
            GAFAIG’s data model — cases, evidence, findings, and decisions —
            is designed to integrate with Snowflake as the governance data backbone,
            enabling cross-case analytics and long-term oversight at scale.
          </p>
        </div>
      </div>
    </main>
  );
}
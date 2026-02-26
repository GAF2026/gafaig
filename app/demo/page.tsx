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
        GAFAIG governance registry demo
      </h1>

      <p style={{ marginTop: "1rem", fontSize: 18, opacity: 0.9, maxWidth: 820 }}>
        This demo shows GAFAIG as a governance registry platform: governance artifacts are registered under a case,
        persisted as structured data, and exposed via an API designed to map directly into Snowflake tables for
        auditability and analytics at scale.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        <Link href="/admin/verification/CASE-0001/evidence" style={primary}>
          Start demo (CASE-0001)
        </Link>
        <Link href="/mission" style={pill}>
          Mission
        </Link>
        <Link href="/framework" style={pill}>
          Framework
        </Link>
        <Link href="/architecture" style={pill}>
          Architecture
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
              Click <strong>Start demo (CASE-0001)</strong> to open the Evidence registry page.
            </li>
            <li>
              Confirm the case artifact log loads and shows registered governance artifacts.
            </li>
            <li>
              Use the search field to filter artifacts (e.g., “audit”, “model”, “incident”).
            </li>
            <li>
              Click <strong>View JSON endpoint</strong> at the bottom of the Evidence page to see structured data.
            </li>
          </ol>
        </div>

        <div style={card}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>What this proves (Snowflake)</div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", opacity: 0.9 }}>
            <li>Governance artifacts are captured as structured, timestamped records.</li>
            <li>Case-level registry data maps cleanly to relational tables (cases, evidence, findings, decisions).</li>
            <li>The API exposes datasets suitable for Snowflake ingestion and cross-case analytics.</li>
            <li>This enables auditability, reporting, and governance oversight at scale.</li>
          </ul>
        </div>

        <div style={card}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Recommended demo flow (5 minutes)</div>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Home → Mission → Framework → Architecture → Demo → Evidence → JSON endpoint → Close.
          </p>
        </div>
      </div>
    </main>
  );
}
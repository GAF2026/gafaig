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
        This demo shows a practical governance workflow: evidence intake → linkage to findings →
        decision support — with AI summaries generated and stored in an auditable data layer.
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
              Open <strong>CASE-0001 → Evidence</strong> and confirm evidence items load.
            </li>
            <li>
              Click <strong>Regenerate all</strong> to generate and store summaries.
            </li>
            <li>
              Confirm: each item shows <strong>Stored summary found</strong>.
            </li>
            <li>
              Optional: create a link between <strong>Evidence</strong> and a{" "}
              <strong>Finding</strong>.
            </li>
          </ol>
        </div>

        <div style={card}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>What this proves (Snowflake)</div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", opacity: 0.9 }}>
            <li>
              Summaries are generated via <strong>Snowflake Cortex</strong> (model configurable).
            </li>
            <li>
              Outputs are persisted into a table for auditability and repeatable review.
            </li>
            <li>
              The “regenerate” path demonstrates deterministic governance workflows over time.
            </li>
          </ul>
        </div>

        <div style={card}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>If something looks empty</div>
          <p style={{ margin: 0, opacity: 0.9 }}>
            If you land on a page and see “Unauthorized”, make sure your demo cookie is set (as you
            already did). Then refresh and rerun <strong>Regenerate all</strong>.
          </p>
        </div>
      </div>
    </main>
  );
}
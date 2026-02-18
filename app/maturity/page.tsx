import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governance Maturity Model — GAFAIG",
  description:
    "An integrated governance maturity model combining certification status and human–AI oversight levels.",
};

export default function GovernanceMaturityModelPage() {
  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    background: "white",
    padding: "1.25rem",
  };

  const badge: React.CSSProperties = {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "rgba(0,0,0,0.02)",
  };

  const tableWrap: React.CSSProperties = {
    width: "100%",
    overflowX: "auto",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
  };

  const th: React.CSSProperties = {
    textAlign: "left",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    opacity: 0.75,
    padding: "0.9rem 1rem",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    whiteSpace: "nowrap",
  };

  const td: React.CSSProperties = {
    padding: "0.95rem 1rem",
    verticalAlign: "top",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    lineHeight: 1.65,
    minWidth: 220,
  };

  const h1: React.CSSProperties = { fontSize: 34, lineHeight: 1.15, margin: 0 };
  const h2: React.CSSProperties = { fontSize: 18, fontWeight: 900, margin: "0 0 0.75rem" };

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "4rem 1.25rem 4.5rem",
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
        GAFAIG Governance Maturity Model
      </div>

      <h1 style={h1}>Certification status + human–AI oversight levels</h1>

      <p style={{ marginTop: "1rem", fontSize: "1.05rem", opacity: 0.9, maxWidth: 900 }}>
        GAFAIG assigns a governance maturity status based on two dimensions:{" "}
        <strong>evidence-based certification</strong> and the{" "}
        <strong>degree of human oversight in AI operation</strong>. This creates a clear,
        auditable way to describe governance posture without marketing language.
      </p>

      {/* Dimension 1 */}
      <section style={{ marginTop: "2.25rem" }}>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <h2 style={h2}>Dimension 1: Certification status</h2>
            <span style={badge}>Evidence-based</span>
          </div>

          <ul style={{ paddingLeft: "1.25rem", margin: 0, opacity: 0.92 }}>
            <li>
              <strong>Registered Participant</strong> — Public commitment to GAFAIG principles;
              listed in the Registry.
            </li>
            <li>
              <strong>Verified Governance</strong> — Evidence submitted and linked to findings;
              reviewer workflow produces auditable outputs.
            </li>
            <li>
              <strong>Structured Implementation</strong> — Operational controls demonstrated across
              the workflow with repeatable regeneration and an audit trail.
            </li>
            <li>
              <strong>Advanced Certification</strong> — Sustained governance cycle across systems
              with periodic review, updates, and reporting requirements.
            </li>
          </ul>
        </div>
      </section>

      {/* Dimension 2 */}
      <section style={{ marginTop: "1.25rem" }}>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <h2 style={h2}>Dimension 2: Human–AI oversight level</h2>
            <span style={badge}>Oversight classification</span>
          </div>

          <p style={{ marginTop: 0, opacity: 0.9, maxWidth: 920 }}>
            These levels describe how decisions are produced and controlled. GAFAIG uses them to
            scope evidence requirements and reporting expectations.
          </p>

          <ul style={{ paddingLeft: "1.25rem", margin: 0, opacity: 0.92 }}>
            <li>
              <strong>H0 — Human-only control</strong>: AI is not used for decisions; humans produce
              outputs and approvals.
            </li>
            <li>
              <strong>H1 — Human-in-the-loop</strong>: AI proposes; a human must approve each
              material output before it takes effect.
            </li>
            <li>
              <strong>H2 — Human-on-the-loop</strong>: AI acts within constraints; humans monitor,
              can intervene, and review outcomes on a defined cadence.
            </li>
            <li>
              <strong>H3 — AI-autonomous with oversight</strong>: AI executes significant actions
              autonomously with required logging, escalation triggers, and post-hoc review.
            </li>
            <li>
              <strong>H4 — AI-autonomous with audit controls</strong>: autonomy is high; governance
              relies on strict audit controls, continuous monitoring, and evidence-backed
              containment mechanisms.
            </li>
          </ul>
        </div>
      </section>

      {/* Integrated matrix */}
      <section style={{ marginTop: "2.75rem" }}>
        <h2 style={{ ...h2, marginBottom: "0.75rem" }}>Integrated maturity matrix</h2>
        <p style={{ marginTop: 0, opacity: 0.9, maxWidth: 920 }}>
          In practice, GAFAIG records both values and derives a maturity statement that can be
          published in the Registry and used in reporting.
        </p>

        <div style={tableWrap}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Certification status</th>
                <th style={th}>Typical oversight level</th>
                <th style={th}>Required evidence focus</th>
                <th style={th}>Reportable output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>
                  <strong>Registered Participant</strong>
                  <div style={{ opacity: 0.85, marginTop: 6 }}>
                    Public commitment + baseline profile.
                  </div>
                </td>
                <td style={td}>
                  <strong>H0–H1</strong>
                  <div style={{ opacity: 0.85, marginTop: 6 }}>
                    Low autonomy; approval-based controls.
                  </div>
                </td>
                <td style={td}>
                  Principles alignment, scope disclosure, initial control inventory.
                </td>
                <td style={td}>
                  Registry listing + stated commitments.
                </td>
              </tr>

              <tr>
                <td style={td}>
                  <strong>Verified Governance</strong>
                  <div style={{ opacity: 0.85, marginTop: 6 }}>
                    Evidence linked to findings and reviewer actions.
                  </div>
                </td>
                <td style={td}>
                  <strong>H1–H2</strong>
                  <div style={{ opacity: 0.85, marginTop: 6 }}>
                    Human oversight with defined review cadence.
                  </div>
                </td>
                <td style={td}>
                  Evidence completeness, traceability, decision workflow, audit logs.
                </td>
                <td style={td}>
                  Verifiable finding-to-evidence mapping + summary outputs.
                </td>
              </tr>

              <tr>
                <td style={td}>
                  <strong>Structured Implementation</strong>
                  <div style={{ opacity: 0.85, marginTop: 6 }}>
                    Repeatable operations and regeneration workflows.
                  </div>
                </td>
                <td style={td}>
                  <strong>H2–H3</strong>
                  <div style={{ opacity: 0.85, marginTop: 6 }}>
                    Constrained autonomy with intervention mechanisms.
                  </div>
                </td>
                <td style={td}>
                  Control effectiveness, monitoring, incident pathways, regeneration evidence.
                </td>
                <td style={td}>
                  Standardized reporting surfaces + auditable summaries.
                </td>
              </tr>

              <tr>
                <td style={td} style={{ ...td, borderBottom: "none" }}>
                  <strong>Advanced Certification</strong>
                  <div style={{ opacity: 0.85, marginTop: 6 }}>
                    Sustained governance across systems and time.
                  </div>
                </td>
                <td style={td} style={{ ...td, borderBottom: "none" }}>
                  <strong>H3–H4</strong>
                  <div style={{ opacity: 0.85, marginTop: 6 }}>
                    High autonomy with strict audit and containment.
                  </div>
                </td>
                <td style={td} style={{ ...td, borderBottom: "none" }}>
                  Continuous monitoring, containment controls, periodic audits, governance change logs.
                </td>
                <td style={td} style={{ ...td, borderBottom: "none" }}>
                  Public maturity statement + review cadence + auditability claims backed by evidence.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "1rem", fontSize: 12, opacity: 0.75 }}>
          Example maturity statement: <strong>“Verified Governance · H2 (Human-on-the-loop)”</strong>.
        </div>
      </section>

      {/* Footer */}
      <section style={{ marginTop: "2.25rem" }}>
        <div
          style={{
            borderTop: "1px solid rgba(0,0,0,0.1)",
            marginTop: "2.25rem",
            paddingTop: "1.5rem",
            fontSize: 12,
            opacity: 0.7,
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <span>Release: dev</span>
          <span>Governance engine powered by Snowflake Cortex</span>
        </div>
      </section>
    </main>
  );
}
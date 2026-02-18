import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architecture — GAFAIG",
  description:
    "Snowflake-native governance architecture for evidence ingestion, AI analysis, and auditable transparency.",
};

export default function ArchitecturePage() {
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
        GAFAIG Governance Engine
      </div>

      <h1 style={{ fontSize: 34, lineHeight: 1.15, margin: 0 }}>
        Snowflake-native architecture
      </h1>

      <p style={{ marginTop: "1rem", fontSize: "1.05rem", opacity: 0.9, maxWidth: 860 }}>
        A Snowflake-native governance architecture for evidence ingestion, AI analysis, and
        auditable transparency across high-impact AI systems.
      </p>

      <section style={{ marginTop: "2.25rem" }}>
        <div
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 16,
            background: "white",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.85rem 1rem",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontWeight: 800 }}>GAFAIG Governance Engine — Reference Diagram</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>
              View: Institutional · Black/White · Labeled Layers
            </div>
          </div>

          <div style={{ padding: "1rem" }}>
            <img
              src="/images/gafaig-architecture.png"
              alt="GAFAIG Governance Engine — Snowflake-native architecture diagram"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 12,
              }}
            />
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: "0.75rem" }}>
              If the diagram does not appear, confirm the file exists at{" "}
              <code>/public/images/gafaig-architecture.png</code>.
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "2.75rem" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: "0.75rem" }}>
          System properties
        </h2>

        <ul style={{ paddingLeft: "1.25rem", margin: 0, opacity: 0.9, maxWidth: 900 }}>
          <li>
            <strong>Evidence-first workflow:</strong> Evidence is captured, normalized, and linked
            to findings for review.
          </li>
          <li>
            <strong>Cortex summarization:</strong> Summaries are generated on demand and persisted
            for auditability.
          </li>
          <li>
            <strong>Auditable data layer:</strong> Snowflake stores evidence, findings, links, and
            summaries in a consistent schema.
          </li>
          <li>
            <strong>Governance outputs:</strong> Review decisions and disclosures can be rendered
            into transparent reporting surfaces.
          </li>
        </ul>
      </section>

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
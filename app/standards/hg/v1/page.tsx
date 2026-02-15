import Link from "next/link";

export const metadata = {
  title: "GAFAIG Human Governance Standard v1.0",
  description:
    "GAFAIG Human Governance Standard v1.0 — minimum requirements for human governance within AI-impacted organizations.",
};

export default function HumanGovernanceV1Page() {
  const pdfPath = "/standards/hg/GAFAIG-HG-1-v1.0-PUBLIC.pdf";

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <header style={{ marginBottom: 22 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.7,
            marginBottom: 10,
          }}
        >
          GAFAIG Standard
        </div>
        <h1 style={{ fontSize: 42, lineHeight: 1.1, margin: 0, fontWeight: 800 }}>
          Human Governance Standard v1.0
        </h1>
        <p style={{ marginTop: 14, fontSize: 18, lineHeight: 1.7, color: "#374151" }}>
          This standard defines minimum, auditable requirements for Human Governance within AI-impacted
          organizations, establishing expectations for transparency, accountability, and human oversight.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          {/* ✅ Correct link */}
          <a
            href={pdfPath}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "0.9rem 1.15rem",
              borderRadius: 12,
              border: "1px solid #000",
              background: "#000",
              color: "#fff",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Download PDF Version
          </a>

          <Link
            href="/standards"
            style={{
              display: "inline-block",
              padding: "0.9rem 1.15rem",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.18)",
              background: "#fff",
              color: "#000",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Back to standards
          </Link>
        </div>
      </header>

      <section
        style={{
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: 18,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Preview
        </div>

        {/* Inline PDF viewer */}
        <div style={{ width: "100%", height: "78vh" }}>
          <iframe
            title="GAFAIG Human Governance Standard v1.0 PDF"
            src={pdfPath}
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </section>

      <footer style={{ marginTop: 18, fontSize: 14, color: "#6b7280" }}>
        If the preview does not load, use the “Download PDF Version” button above.
      </footer>
    </main>
  );
}
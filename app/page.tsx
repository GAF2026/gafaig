import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GAFAIG — Global Authority for AI Governance",
  description:
    "A global framework for human-centered AI governance, enabling transparent oversight, participation, and accountability at planetary scale.",
};

export default function Home() {
  const release = process.env.NEXT_PUBLIC_RELEASE ?? "dev";

  const container: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "4rem 1.25rem",
  };

  const eyebrow: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    opacity: 0.7,
    marginBottom: "0.75rem",
  };

  const h1: React.CSSProperties = {
    fontSize: 44,
    lineHeight: 1.1,
    margin: 0,
    letterSpacing: "-0.02em",
  };

  const lead: React.CSSProperties = {
    marginTop: "1.25rem",
    fontSize: 18,
    lineHeight: 1.7,
    opacity: 0.9,
    maxWidth: 760,
  };

  const buttonRow: React.CSSProperties = {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginTop: "1.75rem",
  };

  const primaryBtn: React.CSSProperties = {
    display: "inline-block",
    padding: "0.9rem 1.15rem",
    borderRadius: 12,
    border: "1px solid #000",
    background: "#000",
    color: "#fff",
    fontWeight: 800,
    textDecoration: "none",
  };

  const secondaryBtn: React.CSSProperties = {
    display: "inline-block",
    padding: "0.9rem 1.15rem",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.25)",
    background: "white",
    color: "#000",
    fontWeight: 800,
    textDecoration: "none",
  };

  const sectionTitle: React.CSSProperties = {
    marginTop: "3.5rem",
    fontSize: 22,
    letterSpacing: "-0.01em",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 14,
    padding: "1.25rem",
    background: "white",
  };

  const cardTitle: React.CSSProperties = {
    fontWeight: 800,
    marginBottom: "0.35rem",
  };

  const cardText: React.CSSProperties = {
    margin: 0,
    lineHeight: 1.65,
    opacity: 0.88,
  };

  const list: React.CSSProperties = {
    marginTop: "0.75rem",
    paddingLeft: "1.25rem",
    lineHeight: 1.75,
    opacity: 0.9,
    maxWidth: 860,
  };

  const footer: React.CSSProperties = {
    marginTop: "3.5rem",
    paddingTop: "2rem",
    borderTop: "1px solid rgba(0,0,0,0.1)",
    fontSize: 12,
    opacity: 0.7,
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  };

  return (
    <main style={container}>
      <div style={eyebrow}>Global Authority for AI Governance</div>

      <h1 style={h1}>Human-centered AI governance at planetary scale.</h1>

      <p style={lead}>
        GAFAIG is a global framework for human-centered AI governance, enabling
        transparent oversight, meaningful participation, and clear accountability
        as AI capabilities rapidly advance.
      </p>

      <div style={buttonRow}>
        <Link href="/mission" style={primaryBtn}>
          Read the mission
        </Link>
        <Link href="/framework" style={secondaryBtn}>
          Explore the framework
        </Link>
        <Link href="/contact" style={secondaryBtn}>
          Contact GAFAIG
        </Link>
      </div>

      <h2 style={sectionTitle}>Core principles</h2>
      <div style={grid}>
        <div style={card}>
          <div style={cardTitle}>Transparency</div>
          <p style={cardText}>
            Decisions, standards, and audits should be visible, explainable, and
            reviewable.
          </p>
        </div>
        <div style={card}>
          <div style={cardTitle}>Participation</div>
          <p style={cardText}>
            People everywhere should have a voice in how AI affects society and
            the future.
          </p>
        </div>
        <div style={card}>
          <div style={cardTitle}>Accountability</div>
          <p style={cardText}>
            Clear responsibility for harms, failures, and misuse—paired with
            enforceable expectations.
          </p>
        </div>
        <div style={card}>
          <div style={cardTitle}>Safety & rights</div>
          <p style={cardText}>
            Protect human rights, security, and dignity as high-impact systems
            evolve.
          </p>
        </div>
      </div>

      <h2 style={sectionTitle}>What GAFAIG enables</h2>
      <ul style={list}>
        <li>
          A shared governance framework and standards for high-impact AI systems.
        </li>
        <li>Audit and reporting expectations that can be implemented and measured.</li>
        <li>
          Pathways for public comment and structured global input across
          jurisdictions.
        </li>
        <li>
          Interoperable governance that supports coordination without capture by
          any single actor.
        </li>
      </ul>

      <h2 style={sectionTitle}>Get involved</h2>
      <div style={grid}>
        <div style={card}>
          <div style={cardTitle}>For policymakers</div>
          <p style={cardText}>
            Align oversight across jurisdictions with practical, auditable
            requirements.
          </p>
        </div>
        <div style={card}>
          <div style={cardTitle}>For researchers</div>
          <p style={cardText}>
            Collaborate on standards, evaluations, and public-interest governance.
          </p>
        </div>
        <div style={card}>
          <div style={cardTitle}>For builders</div>
          <p style={cardText}>
            Implement governance-by-design and demonstrate compliance through
            clear reporting.
          </p>
        </div>
        <div style={card}>
          <div style={cardTitle}>For the public</div>
          <p style={cardText}>
            Participate in transparent processes that shape how AI is deployed and
            monitored.
          </p>
        </div>
      </div>

      <div style={footer}>
        <span>Release: {release}</span>
        <span>
          <Link href="/contact" style={{ color: "inherit" }}>
            Contact
          </Link>
          {" · "}
          <Link href="/mission" style={{ color: "inherit" }}>
            Mission
          </Link>
          {" · "}
          <Link href="/governance" style={{ color: "inherit" }}>
            Governance
          </Link>
        </span>
      </div>
    </main>
  );
}

// app/standards/hg/v1/page.tsx

import Link from "next/link";
import { GAFAIG_HG_V1 } from "@/lib/standards/hg-v1";

export const metadata = {
  title: "GAFAIG Human Governance Standard v1.0",
  description:
    "Formal standard defining minimum requirements for human-centered governance over AI systems and AI-mediated decision processes.",
};

function Badge({ text }: { text: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: 999,
        padding: "0.25rem 0.6rem",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.02em",
        background: "#fff",
      }}
    >
      {text}
    </span>
  );
}

export default function Page() {
  const s = GAFAIG_HG_V1;

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "2.25rem 1.25rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: 10,
            }}
          >
            GAFAIG Standards
          </div>
          <h1 style={{ fontSize: 44, lineHeight: 1.1, margin: 0, letterSpacing: "-0.02em" }}>
            Human Governance Standard v{s.version}
          </h1>
          <p style={{ marginTop: 14, fontSize: 18, lineHeight: 1.7, opacity: 0.9, maxWidth: 820 }}>
            A formal standard defining the minimum requirements for accountable, human-centered oversight of AI
            systems and AI-mediated decision processes.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <Badge text={s.standardId} />
            <Badge text={`Status: ${s.status}`} />
            <Badge text={`Published: ${s.publishedDateISO}`} />
          </div>
        </div>

        <div style={{ alignSelf: "flex-start" }}>
          <Link
            href="/participants"
            style={{
              display: "inline-block",
              padding: "0.9rem 1.15rem",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.25)",
              background: "white",
              color: "#000",
              fontWeight: 800,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            View Registry →
          </Link>
        </div>
      </div>

      <hr style={{ margin: "2rem 0", border: 0, borderTop: "1px solid rgba(0,0,0,0.12)" }} />

      <section>
        <h2 style={{ margin: "0 0 0.75rem", fontSize: 22, letterSpacing: "-0.01em" }}>Scope</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75, opacity: 0.92 }}>
          {s.scope.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 0.75rem", fontSize: 22, letterSpacing: "-0.01em" }}>Applies to</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75, opacity: 0.92 }}>
          {s.appliesTo.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 0.75rem", fontSize: 22, letterSpacing: "-0.01em" }}>Definitions</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {s.definitions.map((d) => (
            <div
              key={d.term}
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 14,
                padding: "1rem 1.1rem",
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>{d.term}</div>
              <div style={{ opacity: 0.92, lineHeight: 1.7 }}>{d.definition}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 0.75rem", fontSize: 22, letterSpacing: "-0.01em" }}>
          Governance classification
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {s.governanceClassification.map((g) => (
            <div
              key={g.code}
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 14,
                padding: "1rem 1.1rem",
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 900 }}>{g.code}</span>
                <span style={{ fontWeight: 800, opacity: 0.95 }}>{g.name}</span>
              </div>
              <div style={{ opacity: 0.92, lineHeight: 1.7, marginTop: 6 }}>{g.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2 style={{ margin: "0 0 0.75rem", fontSize: 22, letterSpacing: "-0.01em" }}>Standard text</h2>

        <div style={{ display: "grid", gap: 16 }}>
          {s.sections.map((sec) => (
            <article
              key={sec.id}
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 16,
                padding: "1.15rem 1.25rem",
                background: "#fff",
              }}
            >
              <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>
                {sec.id}
              </div>
              <h3 style={{ margin: "0.35rem 0 0.75rem", fontSize: 20, letterSpacing: "-0.01em" }}>
                {sec.title}
              </h3>
              <div style={{ display: "grid", gap: 10, lineHeight: 1.75, opacity: 0.92 }}>
                {sec.body.map((p) => (
                  <p key={p} style={{ margin: 0 }}>
                    {p}
                  </p>
                ))}
              </div>

              {sec.requirements?.length ? (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 900, marginBottom: 10 }}>Requirements</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    {sec.requirements.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          border: "1px solid rgba(0,0,0,0.12)",
                          borderRadius: 14,
                          padding: "0.9rem 1rem",
                          background: "rgba(0,0,0,0.02)",
                        }}
                      >
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                          <Badge text={r.level} />
                          <span style={{ fontWeight: 900 }}>{r.id}</span>
                          <span style={{ fontWeight: 800, opacity: 0.95 }}>{r.title}</span>
                        </div>
                        <div style={{ marginTop: 10, lineHeight: 1.75, opacity: 0.92 }}>
                          <p style={{ margin: 0 }}>
                            <strong>Requirement:</strong> {r.statement}
                          </p>
                          <p style={{ margin: "0.6rem 0 0" }}>
                            <strong>Rationale:</strong> {r.rationale}
                          </p>
                          <p style={{ margin: "0.6rem 0 0" }}>
                            <strong>Minimum evidence:</strong> {r.minimumEvidence.join(", ")}
                          </p>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: 12,
                            marginTop: 12,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 900, marginBottom: 6 }}>Pass criteria</div>
                            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, opacity: 0.92 }}>
                              {r.evaluation.passCriteria.map((x) => (
                                <li key={x}>{x}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div style={{ fontWeight: 900, marginBottom: 6 }}>Fail criteria</div>
                            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, opacity: 0.92 }}>
                              {r.evaluation.failCriteria.map((x) => (
                                <li key={x}>{x}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 28, opacity: 0.7, fontSize: 13, lineHeight: 1.7 }}>
        This document is published as a living standard. Future revisions will be versioned and assessments will
        record the standard version used.
      </div>
    </main>
  );
}
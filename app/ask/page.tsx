"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type AskResponse = {
  ok: true;
  received: true;
  requestId: string;
  question: string;
  answer: {
    summary: string;
    directAnswer: string;
    references: Array<{ label: string; href: string; type: "standard" | "policy" | "page" }>;
    citations: Array<{ source: string; note: string }>;
    escalation: {
      shouldEscalate: boolean;
      reason?: string;
      contactPath?: string;
    };
    policyFlags: {
      legalOrRegulatoryAdvice: boolean;
      safetyCritical: boolean;
      defamationOrAccusation: boolean;
      personalData: boolean;
    };
  };
};

type AskError = {
  ok: false;
  received: false;
  error: string;
  errors?: string[];
};

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<AskResponse | null>(null);
  const [err, setErr] = useState<string>("");

  const canAsk = useMemo(() => question.trim().length >= 3 && !loading, [question, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setResp(null);

    const q = question.trim();
    if (q.length < 3) {
      setErr("Please enter a question (3+ characters).");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context: { page: "/ask", userRole: "public" } })
      });

      const json = await r.json().catch(() => null);

      if (!r.ok || !json) {
        const msg =
          (json as AskError | null)?.error ||
          `Request failed (HTTP ${r.status}).`;
        setErr(msg);
        return;
      }

      if (json.ok !== true) {
        setErr((json as AskError).error || "Unknown error.");
        return;
      }

      setResp(json as AskResponse);
    } catch (e: any) {
      setErr(`Network error: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Ask GAFAIG</h1>
      <p>
        Public-facing guidance tied to GAFAIG standards and policies. For legal advice,
        safety-critical issues, or accusations involving specific entities, GAFAIG may
        recommend escalation to human review.
      </p>

      <div className="callout note">
        <strong>Try these</strong>
        <ul style={{ margin: 0, marginTop: ".5rem" }}>
          <li>What is GAFAIG S-001?</li>
          <li>How do I apply for certification?</li>
          <li>What triggers registry disclosure?</li>
          <li>Why can certification status change?</li>
        </ul>
      </div>

      <form
        onSubmit={onSubmit}
        style={{ marginTop: "1.5rem", display: "grid", gap: ".75rem", maxWidth: 900 }}
      >
        <label>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Your question</div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Example: "What is GAFAIG S-002?"'
            rows={4}
            style={{
              width: "100%",
              padding: "0.9rem",
              border: "1px solid #e5e7eb",
              borderRadius: 12
            }}
          />
          <p className="meta" style={{ marginTop: 6 }}>
            This is an early MVP. Answers include link references and citation placeholders.
          </p>
        </label>

        <button
          type="submit"
          disabled={!canAsk}
          style={{
            padding: "0.95rem 1rem",
            borderRadius: 12,
            border: "1px solid #111827",
            background: "#111827",
            color: "white",
            fontWeight: 900,
            width: "fit-content",
            opacity: canAsk ? 1 : 0.6,
            cursor: canAsk ? "pointer" : "not-allowed"
          }}
        >
          {loading ? "Asking…" : "Ask GAFAIG"}
        </button>

        {err ? <div className="callout warning"><strong>Error</strong><p style={{ margin: 0, marginTop: ".5rem" }}>{err}</p></div> : null}
      </form>

      {resp ? (
        <section style={{ marginTop: "2rem", maxWidth: 900 }}>
          <div className="callout">
            <strong>Answer</strong>
            <p className="meta" style={{ marginTop: ".5rem" }}>
              Request ID: {resp.requestId}
            </p>

            <h2 style={{ marginTop: "1rem" }}>{resp.answer.summary}</h2>
            <p style={{ lineHeight: 1.7, marginTop: ".75rem" }}>
              {resp.answer.directAnswer}
            </p>

            {resp.answer.escalation?.shouldEscalate ? (
              <div className="callout legal" style={{ marginTop: "1rem" }}>
                <strong>Escalation recommended</strong>
                <p style={{ margin: 0, marginTop: ".5rem" }}>
                  {resp.answer.escalation.reason}
                </p>
                <p style={{ margin: 0, marginTop: ".5rem" }}>
                  Use{" "}
                  <Link href={resp.answer.escalation.contactPath || "/contact"} style={{ color: "#111827" }}>
                    Contact
                  </Link>{" "}
                  to submit details for human review.
                </p>
              </div>
            ) : null}

            <div style={{ marginTop: "1.25rem" }}>
              <strong>References</strong>
              <ul style={{ margin: 0, marginTop: ".5rem" }}>
                {resp.answer.references?.map((r, idx) => (
                  <li key={idx}>
                    <Link href={r.href} style={{ color: "#111827" }}>
                      {r.label}
                    </Link>{" "}
                    <span className="meta">({r.type})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: "1.25rem" }}>
              <strong>Citations</strong>
              <ul style={{ margin: 0, marginTop: ".5rem" }}>
                {resp.answer.citations?.map((c, idx) => (
                  <li key={idx}>
                    <span style={{ fontWeight: 700 }}>{c.source}:</span>{" "}
                    <span className="meta">{c.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: "1.25rem" }}>
              <strong>Policy flags</strong>
              <div className="meta" style={{ marginTop: ".5rem" }}>
                legal/regulatory: {String(resp.answer.policyFlags.legalOrRegulatoryAdvice)} •{" "}
                safety-critical: {String(resp.answer.policyFlags.safetyCritical)} •{" "}
                accusation/defamation: {String(resp.answer.policyFlags.defamationOrAccusation)} •{" "}
                personal data: {String(resp.answer.policyFlags.personalData)}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

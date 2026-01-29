"use client";

import { useState } from "react";

type AskResponse = {
  ok: boolean;
  received: boolean;
  answer: string;
  message?: string;
};

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAnswer("");

    const q = question.trim();
    if (!q) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data = (await res.json()) as AskResponse;

      if (!data.ok) {
        throw new Error(data.message || "The API returned ok:false");
      }

      setAnswer(data.answer);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "4rem", maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Ask GAFAIG</h1>
      <p style={{ opacity: 0.85, marginBottom: "2rem" }}>
        Ask a question about GAFAIG standards, certification, registry policy, or governance.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        <label style={{ fontWeight: 600 }} htmlFor="question">
          Your question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={5}
          placeholder='Example: "What is GAFAIG S-001?"'
          style={{
            width: "100%",
            padding: "0.9rem",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.2)",
            fontFamily: "inherit",
            fontSize: "1rem",
          }}
        />

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              background: loading ? "rgba(0,0,0,0.05)" : "white",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {loading ? "Asking..." : "Ask"}
          </button>

          <button
            type="button"
            onClick={() => {
              setQuestion("");
              setAnswer("");
              setError("");
            }}
            disabled={loading}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              background: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Clear
          </button>
        </div>

        {error ? (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.9rem",
              borderRadius: 10,
              border: "1px solid rgba(220, 38, 38, 0.35)",
              background: "rgba(220, 38, 38, 0.06)",
            }}
          >
            <strong style={{ display: "block", marginBottom: 6 }}>Error</strong>
            <span>{error}</span>
          </div>
        ) : null}

        {answer ? (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "1rem",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(0,0,0,0.03)",
            }}
          >
            <strong style={{ display: "block", marginBottom: 8 }}>GAFAIG</strong>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{answer}</div>
          </div>
        ) : null}
      </form>
    </main>
  );
}

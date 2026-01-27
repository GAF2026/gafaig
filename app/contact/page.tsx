import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — GAFAIG",
  description:
    "Contact GAFAIG to inquire about partnerships, governance initiatives, research collaboration, or general questions.",
};

export default function ContactPage() {
  return (
    <main style={{ padding: "4rem", maxWidth: 900, margin: "0 auto" }}>
      <h1>Contact GAFAIG</h1>

      <p style={{ marginTop: "1rem", marginBottom: "2rem", opacity: 0.85 }}>
        Use the form below to reach the Global Authority for AI Governance. We
        welcome inquiries related to governance frameworks, partnerships,
        research collaboration, and general questions.
      </p>

      <form
        action="https://formspree.io/f/xnjdgnoy"
        method="POST"
        style={{
          display: "grid",
          gap: "1.25rem",
          padding: "1.5rem",
          border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: 14,
          background: "#ffffff",
        }}
      >
        {/* Redirect after successful submission */}
        <input
          type="hidden"
          name="_redirect"
          value="https://www.gafaig.com/contact?sent=1"
        />

        <div style={{ display: "grid", gap: "0.4rem" }}>
          <label htmlFor="name" style={{ fontWeight: 600 }}>
            Full name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            style={{
              padding: "0.75rem",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.3)",
              background: "white",
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ display: "grid", gap: "0.4rem" }}>
          <label htmlFor="email" style={{ fontWeight: 600 }}>
            Email address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            style={{
              padding: "0.75rem",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.3)",
              background: "white",
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ display: "grid", gap: "0.4rem" }}>
          <label htmlFor="organization" style={{ fontWeight: 600 }}>
            Organization (optional)
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            placeholder="Company or institution"
            style={{
              padding: "0.75rem",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.3)",
              background: "white",
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ display: "grid", gap: "0.4rem" }}>
          <label htmlFor="reason" style={{ fontWeight: 600 }}>
            Reason for contacting
          </label>
          <select
            id="reason"
            name="reason"
            defaultValue="General inquiry"
            style={{
              padding: "0.75rem",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.3)",
              background: "white",
              fontSize: 14,
            }}
          >
            <option value="General inquiry">General inquiry</option>
            <option value="Partnership">Partnership</option>
            <option value="Research collaboration">Research collaboration</option>
            <option value="Governance input">Governance input</option>
            <option value="Media / speaking">Media / speaking</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: "grid", gap: "0.4rem" }}>
          <label htmlFor="message" style={{ fontWeight: 600 }}>
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            placeholder="How can we help?"
            style={{
              padding: "0.75rem",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.3)",
              background: "white",
              fontSize: 14,
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "0.5rem",
            padding: "0.9rem",
            borderRadius: 12,
            border: "none",
            background: "#000",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Send message
        </button>

        <p style={{ fontSize: 12, opacity: 0.7 }}>
          By submitting this form, you consent to being contacted regarding your
          inquiry.
        </p>
      </form>
    </main>
  );
}

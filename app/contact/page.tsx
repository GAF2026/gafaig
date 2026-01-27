import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — GAFAIG",
  description:
    "Contact GAFAIG to inquire about partnerships, research collaboration, governance initiatives, or general questions.",
};
export default function ContactPage() {
  return (
    <main style={{ padding: "4rem", fontFamily: "sans-serif" }}>
      <h1>Contact</h1>
      <p style={{ maxWidth: 900, lineHeight: 1.6 }}>
        Interested in collaborating, contributing, or learning more about GAFAIG? Send a message and we’ll respond as
        quickly as possible.
      </p>

      <form
        action="YOUR_FORMSPREE_URL"
        method="POST"
        style={{
          marginTop: "2rem",
          maxWidth: 720,
          display: "grid",
          gap: "1rem",
          padding: "1.25rem",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 12,
        }}
      >
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label htmlFor="fullName" style={{ fontWeight: 600 }}>
            Full name *
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            placeholder="Your name"
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label htmlFor="email" style={{ fontWeight: 600 }}>
            Email address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label htmlFor="phone" style={{ fontWeight: 600 }}>
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            placeholder="+1 (555) 555-5555"
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label htmlFor="organization" style={{ fontWeight: 600 }}>
            Organization / Company (optional)
          </label>
          <input
            id="organization"
            name="organization"
            placeholder="Company or institution"
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label htmlFor="role" style={{ fontWeight: 600 }}>
            Role / Title (optional)
          </label>
          <input
            id="role"
            name="role"
            placeholder="Your role"
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label htmlFor="reason" style={{ fontWeight: 600 }}>
            Reason for contacting *
          </label>
          <select
            id="reason"
            name="reason"
            required
            defaultValue=""
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          >
            <option value="" disabled>
              Select one
            </option>
            <option value="partnership">Partnership</option>
            <option value="research">Research / Collaboration</option>
            <option value="press">Press / Media</option>
            <option value="careers">Careers</option>
            <option value="general">General inquiry</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label htmlFor="subject" style={{ fontWeight: 600 }}>
            Subject *
          </label>
          <input
            id="subject"
            name="subject"
            required
            placeholder="What is this about?"
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label htmlFor="message" style={{ fontWeight: 600 }}>
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            placeholder="Tell us what you’re looking for…"
            rows={6}
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          />
        </div>

        <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", lineHeight: 1.4 }}>
          <input type="checkbox" name="consent" required style={{ marginTop: 3 }} />
          <span>
            I acknowledge the privacy policy and consent to be contacted by GAFAIG regarding this inquiry. *
          </span>
        </label>

        {/* Optional: helps Formspree route replies */}
        <input type="hidden" name="_subject" value="GAFAIG Contact Form Submission" />

        <button
          type="submit"
          style={{
            marginTop: "0.5rem",
            padding: "0.85rem 1rem",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.2)",
            background: "black",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Send message
        </button>

        <p style={{ fontSize: 12, opacity: 0.7, marginTop: "0.75rem" }}>
          If you prefer, email us directly at <a href="mailto:info@gafaig.com">info@gafaig.com</a>.
        </p>
      </form>
    </main>
  );
}

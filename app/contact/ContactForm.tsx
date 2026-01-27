"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnjdgnoy";

export default function ContactForm({ initialSent }: { initialSent: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    initialSent ? "success" : "idle"
  );

  const isSubmitting = status === "submitting";

  const inputStyle: React.CSSProperties = useMemo(
    () => ({
      width: "100%",
      padding: "0.75rem",
      borderRadius: 10,
      border: "1px solid rgba(0,0,0,0.25)",
      background: "white",
      fontSize: 16,
    }),
    []
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        router.replace("/contact?sent=1");
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      {status === "success" && (
        <div
          style={{
            padding: "1rem",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "rgba(0,0,0,0.03)",
            marginBottom: "1.25rem",
          }}
        >
          <strong>Message sent.</strong>
          <div style={{ marginTop: 6, opacity: 0.85 }}>
            Thanks — we received your submission.
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          style={{
            padding: "1rem",
            borderRadius: 12,
            border: "1px solid rgba(255,0,0,0.25)",
            background: "rgba(255,0,0,0.04)",
            marginBottom: "1.25rem",
          }}
        >
          <strong>Something went wrong.</strong>
          <div style={{ marginTop: 6, opacity: 0.85 }}>
            Please try again in a moment.
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.25rem" }}>
        <div>
          <label
            htmlFor="name"
            style={{ display: "block", fontWeight: 700, marginBottom: 6 }}
          >
            Full name
          </label>
          <input id="name" name="name" type="text" required style={inputStyle} />
        </div>

        <div>
          <label
            htmlFor="email"
            style={{ display: "block", fontWeight: 700, marginBottom: 6 }}
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="organization"
            style={{ display: "block", fontWeight: 700, marginBottom: 6 }}
          >
            Organization (optional)
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="reason"
            style={{ display: "block", fontWeight: 700, marginBottom: 6 }}
          >
            Reason for contacting
          </label>
          <select id="reason" name="reason" required style={inputStyle}>
            <option value="" disabled defaultValue="">
              Select one
            </option>
            <option value="general">General inquiry</option>
            <option value="partnership">Partnership</option>
            <option value="research">Research collaboration</option>
            <option value="governance">Governance framework</option>
            <option value="media">Media / press</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            style={{ display: "block", fontWeight: 700, marginBottom: 6 }}
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <input
            name="consent"
            type="checkbox"
            required
            style={{ marginTop: 4 }}
          />
          <span style={{ fontSize: 14, opacity: 0.85 }}>
            I consent to being contacted regarding this inquiry and acknowledge the
            privacy policy.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "0.9rem 1.25rem",
            borderRadius: 10,
            border: "none",
            background: "#000",
            color: "#fff",
            fontWeight: 800,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>

        <p style={{ fontSize: 12, opacity: 0.7 }}>
          By submitting this form, you consent to being contacted regarding your inquiry.
        </p>
      </form>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactForm({ initialSent }: { initialSent: boolean }) {
  const router = useRouter();

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >(initialSent ? "success" : "idle");

  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xnjdgnoy", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        let msg = "Submission failed. Please try again.";
        try {
          const data = await res.json();
          if (data?.errors?.length) {
            msg = data.errors.map((x: any) => x.message).join(" ");
          }
        } catch {}
        setStatus("error");
        setErrorMsg(msg);
        return;
      }

      // Success
      setStatus("success");
      form.reset();

      // Keeps user on GAFAIG and shows success on refresh
      router.replace("/contact?sent=1");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <>
      {status === "success" && (
        <div
          role="status"
          aria-live="polite"
          style={{
            background: "#e6fffa",
            border: "1px solid #38b2ac",
            color: "#065f5b",
            padding: "1rem",
            borderRadius: 8,
            marginBottom: "1.5rem",
            fontWeight: 700,
          }}
        >
          ✅ Thank you — your message has been sent successfully.
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          style={{
            background: "#fff5f5",
            border: "1px solid #e53e3e",
            color: "#7b1c1c",
            padding: "1rem",
            borderRadius: 8,
            marginBottom: "1.5rem",
            fontWeight: 700,
          }}
        >
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.25rem" }}>
        <Field label="Full name" htmlFor="name">
          <input id="name" name="name" type="text" required style={inputStyle} />
        </Field>

        <Field label="Email address" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            style={inputStyle}
          />
        </Field>

        <Field label="Organization (optional)" htmlFor="organization">
          <input
            id="organization"
            name="organization"
            type="text"
            style={inputStyle}
          />
        </Field>

        <Field label="Reason for contacting" htmlFor="reason">
          <select
            id="reason"
            name="reason"
            required
            defaultValue=""
            style={inputStyle}
          >
            <option value="" disabled>
              Select one
            </option>
            <option value="general">General inquiry</option>
            <option value="partnership">Partnership</option>
            <option value="research">Research collaboration</option>
            <option value="governance">Governance framework</option>
            <option value="media">Media / press</option>
            <option value="other">Other</option>
          </select>
        </Field>

        <Field label="Message" htmlFor="message">
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <input type="checkbox" required style={{ marginTop: 4 }} />
          <span style={{ fontSize: 14, opacity: 0.85 }}>
            I consent to being contacted regarding this inquiry and acknowledge
            the privacy policy.
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          style={{
            padding: "0.9rem 1.25rem",
            borderRadius: 10,
            border: "none",
            background: "#000",
            color: "#fff",
            fontWeight: 800,
            cursor: status === "submitting" ? "not-allowed" : "pointer",
            opacity: status === "submitting" ? 0.75 : 1,
          }}
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>

        <p style={{ fontSize: 12, opacity: 0.7 }}>
          By submitting this form, you consent to being contacted regarding your
          inquiry.
        </p>
      </form>
    </>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} style={labelStyle}>
        {label}
      </label>
      {children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 700,
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.25)",
  background: "white",
  fontSize: 16,
};

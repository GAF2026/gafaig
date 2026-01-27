import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You — GAFAIG",
  description: "Your message has been sent to GAFAIG.",
};

export default function ThanksPage() {
  return (
    <main style={{ padding: "4rem", maxWidth: 900, margin: "0 auto" }}>
      <h1>Thank you</h1>
      <p style={{ marginTop: "1rem", opacity: 0.85, lineHeight: 1.6 }}>
        Your message has been sent successfully. We’ll review it and respond as soon as possible.
      </p>

      <p style={{ marginTop: "2rem" }}>
        <a href="/contact">Back to Contact</a>
      </p>
    </main>
  );
}

import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — GAFAIG",
  description:
    "Contact GAFAIG to inquire about partnerships, governance initiatives, research collaboration, or general questions.",
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { sent?: string };
}) {
  const initialSent = searchParams?.sent === "1";

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 1rem" }}>
      <h1>Contact GAFAIG</h1>

      <p style={{ marginBottom: "2rem", opacity: 0.85 }}>
        Use the form below to reach the Global Authority for AI Governance. We
        welcome inquiries related to governance frameworks, partnerships,
        research collaboration, and general questions.
      </p>

      <ContactForm initialSent={initialSent} />
    </main>
  );
}

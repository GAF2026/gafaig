export default function ContactPage() {
  return (
    <main style={{ padding: "4rem", fontFamily: "sans-serif" }}>
      <h1>Contact</h1>
      <p style={{ maxWidth: 900, lineHeight: 1.6 }}>
        Interested in collaborating, contributing, or learning more about GAFAIG?
        Reach out and we’ll respond as quickly as possible.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Email</h2>
      <p style={{ fontSize: "1.05rem" }}>
        <a href="mailto:info@gafaig.com">info@gafaig.com</a>
      </p>

      <h2 style={{ marginTop: "2rem" }}>Quick note</h2>
      <p style={{ maxWidth: 900, lineHeight: 1.6 }}>
        A full public participation portal and structured feedback process is coming next. For now, email is the best
        way to connect.
      </p>
    </main>
  );
}

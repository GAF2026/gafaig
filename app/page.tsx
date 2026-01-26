export default function Home() {
  return (
    <main style={{ padding: "4rem", fontFamily: "sans-serif" }}>
      <h1>Global Authority for AI Governance (GAFAIG)</h1>
      <p>
        A global framework for human-centered AI governance, enabling transparent
        oversight, participation, and accountability at planetary scale.
      </p>

      <footer style={{ marginTop: "4rem", textAlign: "center", fontSize: "12px", opacity: 0.6 }}>
        Release: {process.env.NEXT_PUBLIC_RELEASE ?? "dev"}
      </footer>
    </main>
  );
}

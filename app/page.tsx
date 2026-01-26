export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "900px" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          Global Authority for AI Governance (GAFAIG)
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            lineHeight: 1.6,
            color: "#444",
          }}
        >
          A global framework for human-centered AI governance, enabling
          transparent oversight, participation, and accountability at
          planetary scale.
        </p>
      </div>
    </main>
  );
}

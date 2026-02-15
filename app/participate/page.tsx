export default function ParticipatePage() {
  const cards = [
    {
      title: "For Policymakers",
      desc: "Participate in policy alignment, adoption pathways, and governance coordination.",
      href: "/participate/policymakers",
      cta: "Explore policy participation →",
    },
    {
      title: "For Researchers",
      desc: "Contribute research, evaluations, frameworks, and open governance evidence.",
      href: "/participate/researchers",
      cta: "Explore research participation →",
    },
    {
      title: "For Builders",
      desc: "Integrate GAFAIG governance patterns, reporting, and transparency into systems.",
      href: "/participate/builders",
      cta: "Explore builder participation →",
    },
    {
      title: "For the Public",
      desc: "Follow updates, give feedback, and track the governance registry and activity.",
      href: "/participate/public",
      cta: "Explore public participation →",
    },

    // ✅ NEW BOX
    {
      title: "Organizations & Governments",
      desc: "Be listed in the GAFAIG registry with a participation level, verified status, and public profile.",
      href: "/participants",
      cta: "View the registry →",
    },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: 0 }}>Get Involved</h1>
      <p style={{ marginTop: "0.75rem", color: "#555", lineHeight: 1.6 }}>
        GAFAIG participation is structured by audience. Choose a pathway below to
        engage with governance, research, implementation, or public oversight.
      </p>

      <h2 style={{ marginTop: "3rem", fontSize: "1.4rem", fontWeight: 900 }}>
        How to Get Involved Today
      </h2>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {cards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #ddd",
              borderRadius: 14,
              padding: 16,
              display: "block",
              background: "white",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18 }}>{c.title}</div>
            <div style={{ marginTop: 8, color: "#555", lineHeight: 1.5 }}>{c.desc}</div>
            <div style={{ marginTop: 12, fontWeight: 900, color: "#0a58ca" }}>{c.cta}</div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        <a href="/" style={{ textDecoration: "underline" }}>
          ← Back to home
        </a>
      </div>
    </div>
  );
}
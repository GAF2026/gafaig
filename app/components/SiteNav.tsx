import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/standards", label: "Standards" },
  { href: "/certification", label: "Certification" },
  { href: "/registry", label: "Registry" },
  { href: "/ask", label: "Ask GAFAIG" },
];

export default function SiteNav() {
  return (
    <header style={{ borderBottom: "1px solid #e5e7eb" }}>
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 700,
            letterSpacing: "-0.01em",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          GAFAIG
        </Link>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color: "#111827",
                fontSize: 14,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

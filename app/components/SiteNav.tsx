import Link from "next/link";

export default function SiteNav() {
  return (
    <nav
      style={{
        padding: "1.25rem 4rem",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
        <Link
          href="/"
          style={{
            fontWeight: 700,
            fontSize: "1.05rem",
            marginRight: "1rem",
          }}
        >
          GAFAIG
        </Link>

        <Link href="/about">About</Link>
        <Link href="/governance">Governance</Link>
        <Link href="/standards">Standards</Link>
        <Link href="/certification">Certification</Link>
        <Link href="/registry">Registry</Link>
        <Link href="/ask">Ask GAFAIG</Link>
      </div>
    </nav>
  );
}

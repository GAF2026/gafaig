import Link from "next/link";

const policies = [
  { href: "/policy/enforcement-boundary", title: "Certification Enforcement Boundary" },
  { href: "/policy/revocation-suspension", title: "Certification Revocation & Suspension" },
  { href: "/policy/appeals", title: "Appeals & Reconsideration" },
  { href: "/policy/registry-disclosure-thresholds", title: "Public Registry Disclosure Thresholds" },
  { href: "/policy/master-terms", title: "Certification Agreement — Master Terms" },
];

export default function PolicyIndexPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>
        GAFAIG Policies
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 28 }}>
        GAFAIG policies define program procedures, disclosure rules, and integrity safeguards
        that support certification credibility and public trust.
      </p>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
          Published policies
        </h2>

        <ul style={{ paddingLeft: 20, lineHeight: 1.9, color: "#111827" }}>
          {policies.map((p) => (
            <li key={p.href}>
              <Link href={p.href} style={{ textDecoration: "none", color: "#111827" }}>
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

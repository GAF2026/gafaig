import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        marginTop: 56,
        padding: "28px 0",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div style={{ minWidth: 240 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>GAFAIG</div>
            <div style={{ color: "#374151", lineHeight: 1.6, fontSize: 14 }}>
              Global Authority for AI Governance — a global framework for human-centered AI
              governance, enabling transparent oversight, participation, and accountability
              at planetary scale.
            </div>
          </div>

          <div style={{ minWidth: 260 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Policies</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.9 }}>
              <li>
                <Link href="/policy/enforcement-boundary" style={{ textDecoration: "none", color: "#111827", fontSize: 14 }}>
                  Enforcement Boundary
                </Link>
              </li>
              <li>
                <Link href="/policy/revocation-suspension" style={{ textDecoration: "none", color: "#111827", fontSize: 14 }}>
                  Revocation & Suspension
                </Link>
              </li>
              <li>
                <Link href="/policy/appeals" style={{ textDecoration: "none", color: "#111827", fontSize: 14 }}>
                  Appeals
                </Link>
              </li>
              <li>
                <Link href="/policy/registry-disclosure-thresholds" style={{ textDecoration: "none", color: "#111827", fontSize: 14 }}>
                  Registry Disclosures
                </Link>
              </li>
              <li>
                <Link href="/policy/master-terms" style={{ textDecoration: "none", color: "#111827", fontSize: 14 }}>
                  Certification Master Terms
                </Link>
              </li>
            </ul>
          </div>

          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Contact</div>
            <Link href="/contact" style={{ textDecoration: "none", color: "#111827", fontSize: 14 }}>
              Contact GAFAIG
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 18, color: "#6b7280", fontSize: 12 }}>
          © {year} GAFAIG. Standards and policies are living documents and may be updated with versioning and publication notes.
        </div>
      </div>
    </footer>
  );
}

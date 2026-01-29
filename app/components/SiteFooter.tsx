import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ padding: "2.5rem 4rem" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>GAFAIG</div>
          <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
            Global Authority for AI Governance (GAFAIG) is an independent certification
            authority for human-centered AI governance.
          </p>

          <div className="callout legal" style={{ marginTop: "1rem" }}>
            <strong>Boundary Notice</strong>
            <p style={{ margin: 0, marginTop: ".5rem" }}>
              GAFAIG is not a regulator or governmental authority. Certification does not
              constitute legal compliance, regulatory approval, or warranty.
            </p>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Core</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/governance">Governance</Link>
            </li>
            <li>
              <Link href="/standards">Standards</Link>
            </li>
            <li>
              <Link href="/certification">Certification</Link>
            </li>
            <li>
              <Link href="/registry">Registry</Link>
            </li>
            <li>
              <Link href="/ask">Ask GAFAIG</Link>
            </li>
          </ul>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Policy</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
            <li>
              <Link href="/policy">Policy Index</Link>
            </li>
            <li>
              <Link href="/policy/enforcement-boundary">Enforcement Boundary</Link>
            </li>
            <li>
              <Link href="/policy/revocation-suspension">Revocation &amp; Suspension</Link>
            </li>
            <li>
              <Link href="/policy/appeals">Appeals &amp; Reconsideration</Link>
            </li>
            <li>
              <Link href="/policy/registry-disclosure-thresholds">
                Registry Disclosure Thresholds
              </Link>
            </li>
            <li>
              <Link href="/policy/master-terms">Certification Agreement (Master Terms)</Link>
            </li>
            <li>
              <Link href="/policy/charter">Charter</Link>
            </li>
            <li>
              <Link href="/policy/governance-canon">Governance Canon</Link>
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "1.75rem auto 0 auto",
          paddingTop: "1.25rem",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#6b7280",
          fontSize: 13,
        }}
      >
        <div>© {year} GAFAIG. All rights reserved.</div>
        <div>
          Standards &amp; policies are living documents; certification expectations may
          change under published rules.
        </div>
      </div>
    </footer>
  );
}

export default function RegistryPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>
        Public Certification Registry
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 32 }}>
        The GAFAIG Public Certification Registry provides verifiable, up-to-date information
        about certification status, scope, and applicable standards. The registry exists to
        support transparency, reduce ambiguity, and prevent misuse of certification claims.
      </p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          What you can verify here
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>Whether an organization is currently certified</li>
          <li>The certification tier (where applicable)</li>
          <li>The approved scope (products, services, or systems covered)</li>
          <li>Applicable GAFAIG standards (e.g., S-001, S-002)</li>
          <li>Status history (where disclosure thresholds permit)</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Registry disclosure thresholds
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG applies disclosure thresholds to balance transparency with accuracy and
          procedural fairness. Certain items may be withheld or delayed to avoid publishing
          unverified claims, sensitive details, or information under review. Disclosure rules
          are governed by GAFAIG’s published registry disclosure policy.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Current status
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          The interactive registry search and record pages will appear here. In the MVP,
          GAFAIG will publish a minimal, read-only registry view with clear status definitions
          and scope notes.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Misuse prevention
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Organizations may not represent GAFAIG certification outside their approved scope.
          The GAFAIG compliance mark is licensed under controlled rules, and misuse may result
          in corrective action or status changes under published procedures.
        </p>
      </section>
    </main>
  );
}

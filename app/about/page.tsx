export default function AboutPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>
        About GAFAIG
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 32 }}>
        <strong>Global Authority for AI Governance (GAFAIG)</strong> is a global framework
        for human-centered AI governance, enabling transparent oversight, participation,
        and accountability at planetary scale.
      </p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Mandate and scope
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG exists to strengthen public trust and institutional responsibility as AI
          systems grow in capability, reach, and impact. GAFAIG defines governance
          expectations, disclosure norms, and certification requirements that organizations
          can adopt to demonstrate responsible practice.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          What GAFAIG is
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>Human impact disclosure expectations</li>
          <li>AI incident disclosure and reporting requirements</li>
          <li>Certification criteria and evidence requirements</li>
          <li>Public registry integrity and disclosure thresholds</li>
          <li>Procedural, non-punitive enforcement and appeals</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          What GAFAIG is not
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG is not a government regulator, court, or law enforcement body. GAFAIG
          does not adjudicate legal liability, impose criminal penalties, or replace
          statutory compliance obligations. GAFAIG certification is a governance signal
          grounded in published standards, documented evidence, and defined review
          procedures.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Core principles
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>
            <strong>Human-centered governance:</strong> humans remain accountable for
            deployment and outcomes.
          </li>
          <li>
            <strong>Transparency:</strong> meaningful disclosure, not marketing claims.
          </li>
          <li>
            <strong>Participation:</strong> structured channels for input and review.
          </li>
          <li>
            <strong>Accountability:</strong> traceable decisions and evidence-based
            certification.
          </li>
          <li>
            <strong>Procedural fairness:</strong> consistent rules and an appeals pathway.
          </li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Versioning and transparency
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          GAFAIG standards and policies are living documents. Material changes are
          versioned and publicly documented with publication dates and change notes
          where appropriate.
        </p>
      </section>
    </main>
  );
}

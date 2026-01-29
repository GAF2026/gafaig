import Link from "next/link";

export default function RevocationSuspensionPolicyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ marginBottom: 14 }}>
        <Link href="/policy" style={{ textDecoration: "none", color: "#111827" }}>
          ← Back to Policies
        </Link>
      </p>

      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 10 }}>
        Certification Revocation & Suspension Policy
      </h1>

      <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 22 }}>
        This policy defines GAFAIG’s procedural, non-punitive approach to certification status
        changes, including suspension and revocation. The goal is to preserve accuracy and
        public trust while maintaining fair and consistent processes for applicants.
      </p>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>1. Definitions</h2>
        <ul style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            <strong>Suspension:</strong> a temporary status change while facts are verified,
            remediation occurs, or required information is provided.
          </li>
          <li>
            <strong>Revocation:</strong> termination of certification for the certified scope,
            typically following unresolved nonconformity, material misrepresentation, or
            sustained failure to meet program requirements.
          </li>
          <li>
            <strong>Scope modification:</strong> narrowing or clarifying what is covered by
            certification to maintain accuracy.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>2. Grounds for suspension or revocation</h2>
        <ul style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Material misrepresentation or omission in application or renewal submissions</li>
          <li>Failure to maintain required disclosures or evidence for certified scope</li>
          <li>Unresolved high-severity incident(s) within scope without required updates or remediation</li>
          <li>Repeated nonconformity with standards or program terms</li>
          <li>Misuse of the GAFAIG compliance mark, including scope overreach</li>
          <li>Failure to cooperate with reasonable review requests within stated timelines</li>
        </ul>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>3. Procedural steps</h2>
        <ol style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            <strong>Notice:</strong> GAFAIG provides notice of concerns and the basis for review,
            subject to confidentiality and disclosure policies.
          </li>
          <li>
            <strong>Opportunity to respond:</strong> the applicant may provide clarification,
            evidence, and/or remediation plans within a stated timeframe.
          </li>
          <li>
            <strong>Decision:</strong> GAFAIG issues a written status decision (continue, scope modify,
            suspend, revoke) with brief rationale and effective date.
          </li>
          <li>
            <strong>Registry update:</strong> public registry entries are updated consistent with GAFAIG
            disclosure thresholds and program terms.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>4. Emergency suspension</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG may apply an emergency suspension where credible information indicates a significant
          risk of material harm, severe ongoing incident conditions, or substantial integrity concerns.
          Emergency suspension is time-limited and triggers expedited review steps where feasible.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>5. Mark usage during status changes</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          During suspension, use of the GAFAIG compliance mark may be restricted or prohibited depending
          on the circumstances and program terms. Upon revocation, all mark usage must cease for the
          affected scope as specified by GAFAIG mark rules and agreement terms.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>6. Appeals and reconsideration</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Applicants may seek reconsideration or appeal of certain decisions under GAFAIG’s published
          appeals framework. This policy does not guarantee a particular outcome and does not replace
          the controlling terms of the certification agreement.
        </p>
      </section>
    </main>
  );
}

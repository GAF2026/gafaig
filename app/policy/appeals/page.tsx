import Link from "next/link";

export default function AppealsPolicyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ marginBottom: 14 }}>
        <Link href="/policy" style={{ textDecoration: "none", color: "#111827" }}>
          ← Back to Policies
        </Link>
      </p>

      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 10 }}>
        Appeals & Reconsideration Framework
      </h1>

      <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 22 }}>
        This framework provides a structured pathway for applicants to request reconsideration
        or appeal certain GAFAIG certification decisions. The objective is procedural fairness,
        consistency, and accuracy—without converting GAFAIG into a legal adjudicator.
      </p>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>1. Eligible decisions</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Eligible decisions may include denial, scope modification, suspension, revocation,
          or other certification status determinations designated as appealable by GAFAIG.
          Certain administrative or confidentiality decisions may be non-appealable.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>2. Grounds for reconsideration or appeal</h2>
        <ul style={{ color: "#374151", lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Material factual error in the decision record</li>
          <li>New evidence that was not reasonably available at the time of review</li>
          <li>Procedural error that may have materially affected the outcome</li>
          <li>Misapplication of a published standard or program requirement</li>
        </ul>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>3. Reconsideration (first step)</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Applicants should first request reconsideration, providing a concise explanation of
          the grounds and any supporting evidence. GAFAIG may confirm, modify, or reaffirm the
          decision after review.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>4. Appeal (second step)</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          If reconsideration is denied or the applicant disputes the outcome, the applicant may
          file an appeal. Appeals are evaluated against the stated grounds and evidence. GAFAIG
          may request clarification, additional documentation, or interviews where appropriate.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>5. Timelines and documentation</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Requests must be submitted within the time window specified in GAFAIG program terms
          or the decision notice. Submissions should be complete, specific, and supported by
          referenced artifacts where applicable.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>6. Registry and confidentiality</h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          During reconsideration or appeal, registry entries may reflect status changes consistent
          with GAFAIG disclosure thresholds. Confidential materials are handled according to GAFAIG
          policy and program terms. This framework does not create legal rights beyond those stated
          in controlling agreements.
        </p>
      </section>
    </main>
  );
}

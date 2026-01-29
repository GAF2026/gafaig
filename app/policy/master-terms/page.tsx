import Link from "next/link";

export default function MasterTermsPolicyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ marginBottom: 14 }}>
        <Link href="/policy" style={{ textDecoration: "none", color: "#111827" }}>
          ← Back to Policies
        </Link>
      </p>

      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 10 }}>
        Certification Agreement — Master Terms
      </h1>

      <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 22 }}>
        These Master Terms govern participation in GAFAIG certification programs. They define
        the relationship between GAFAIG and applicants, including scope, obligations, mark usage,
        and procedural authority. Specific certification decisions are governed by these terms
        and referenced policies.
      </p>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          1. Certification scope
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Certification applies only to the explicitly defined scope approved by GAFAIG.
          Certification does not extend to other products, services, models, or uses unless
          expressly stated. Scope descriptions are recorded in certification decisions and
          registry entries.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          2. Applicant representations
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Applicants represent that submitted information is accurate, complete, and not
          misleading. Material misrepresentation or omission may result in denial, suspension,
          revocation, or other status action under GAFAIG policies.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          3. Use of the GAFAIG compliance mark
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          Use of the GAFAIG compliance mark is licensed, conditional, and limited to the
          certified scope. Mark usage must comply with GAFAIG mark rules and may be restricted
          or withdrawn based on certification status changes.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          4. Program authority
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG retains authority to interpret standards, evaluate evidence, determine
          certification outcomes, and update program requirements with versioning and
          publication notice. Participation does not create regulatory approval or legal
          immunity.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          5. Confidentiality and disclosures
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          GAFAIG handles confidential information in accordance with published policies and
          program needs. Applicants acknowledge that certain certification status information
          may be published in the public registry consistent with disclosure thresholds.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          6. Governing documents
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>
          These Master Terms are supplemented by GAFAIG standards, policies, mark rules,
          and certification decisions. In the event of conflict, controlling documents are
          identified in the applicable program materials.
        </p>
      </section>
    </main>
  );
}

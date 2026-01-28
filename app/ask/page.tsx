export default function AskPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>
        Ask GAFAIG
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 32 }}>
        Ask GAFAIG provides structured guidance on human-centered AI governance, standards
        interpretation, certification posture, and incident reporting expectations.
        Responses are designed to be informative, cautious, and aligned with GAFAIG’s
        published standards and policies.
      </p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          What you can ask
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>How GAFAIG standards apply to a specific AI use case</li>
          <li>What disclosures are expected under GAFAIG-S-001 or GAFAIG-S-002</li>
          <li>How certification scope is defined and reviewed</li>
          <li>When incident disclosure or updates may be required</li>
          <li>How registry status and certification changes are handled</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          How responses are generated
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Ask GAFAIG responses are generated using AI systems configured to reflect
          GAFAIG’s standards language, interpretation posture, and escalation rules.
          Where uncertainty exists, responses may reference applicable standards or
          recommend formal review rather than providing definitive conclusions.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Safety, refusal, and escalation
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Ask GAFAIG is designed with refusal and escalation safeguards. The system may
          decline to answer questions that exceed its scope, require confidential
          information, or risk misinterpretation. In appropriate cases, inquiries may
          be routed to structured intake or human review processes.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Availability
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          The interactive Ask GAFAIG interface is under active development. Initial
          releases will prioritize clarity, consistency, and alignment with published
          standards. Updates will be announced as features become available.
        </p>
      </section>
    </main>
  );
}

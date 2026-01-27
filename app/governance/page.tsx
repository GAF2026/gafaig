// app/governance/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governance — GAFAIG",
  description:
    "How GAFAIG is governed: transparent processes, global participation, accountability, and safeguards against capture.",
};

export default function GovernancePage() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "4rem 1rem" }}>
      <h1 style={{ marginBottom: "0.75rem" }}>Governance</h1>

      <p style={{ maxWidth: 900, lineHeight: 1.7, opacity: 0.9 }}>
        GAFAIG governance is designed to be <strong>transparent</strong>, enable{" "}
        <strong>meaningful human input</strong>, and establish{" "}
        <strong>clear accountability</strong> for high-impact AI systems. The
        goal is a governance model that is practical to implement, measurable,
        and continuously improved—while remaining neutral and resilient against
        capture.
      </p>

      <section style={{ marginTop: "2.25rem" }}>
        <h2>What GAFAIG is (and is not)</h2>
        <ul style={{ maxWidth: 950, lineHeight: 1.8 }}>
          <li>
            <strong>A neutral governance layer:</strong> A global standard-setting
            and accountability framework that can be used by governments,
            companies, researchers, and civil society.
          </li>
          <li>
            <strong>Not a nation-state regulator:</strong> GAFAIG does not claim
            sovereign enforcement power. Its strength is{" "}
            <strong>legitimacy, transparency, and verifiability</strong>.
          </li>
          <li>
            <strong>Not a corporate program:</strong> Governance is structured to
            prevent control by any single company, sector, or jurisdiction.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: "2.25rem" }}>
        <h2>Authority model: legitimacy + adoption</h2>
        <p style={{ maxWidth: 900, lineHeight: 1.7 }}>
          GAFAIG’s authority comes from <strong>public legitimacy</strong> and{" "}
          <strong>adoption incentives</strong> rather than coercion. In practice,
          this means:
        </p>

        <ul style={{ maxWidth: 950, lineHeight: 1.8 }}>
          <li>
            <strong>Open standards:</strong> Publish clear requirements for
            audits, reporting, and responsible deployment of high-impact AI.
          </li>
          <li>
            <strong>Verifiable compliance:</strong> Make compliance measurable
            and auditable with evidence artifacts and public summaries.
          </li>
          <li>
            <strong>Interoperability:</strong> Support multiple jurisdictions and
            sector rules via compatible controls and shared definitions.
          </li>
          <li>
            <strong>Reputation + procurement:</strong> Enable buyers, partners,
            and institutions to prefer systems aligned with GAFAIG standards.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: "2.25rem" }}>
        <h2>Decision process</h2>
        <p style={{ maxWidth: 900, lineHeight: 1.7 }}>
          GAFAIG decisions should be explainable and traceable. A practical
          process (initial phase) looks like:
        </p>

        <ol style={{ maxWidth: 950, lineHeight: 1.8 }}>
          <li>
            <strong>Proposal:</strong> A policy, standard, or control is proposed
            with a rationale and measurable acceptance criteria.
          </li>
          <li>
            <strong>Public comment:</strong> Structured feedback window with
            published summaries of major viewpoints.
          </li>
          <li>
            <strong>Review & revision:</strong> Technical review, risk analysis,
            and revisions with clear change logs.
          </li>
          <li>
            <strong>Adoption:</strong> Publish the final standard with versioning
            and implementation guidance.
          </li>
          <li>
            <strong>Monitoring:</strong> Track outcomes and iterate using defined
            metrics (incidents, audit findings, compliance rates).
          </li>
        </ol>
      </section>

      <section style={{ marginTop: "2.25rem" }}>
        <h2>Guiding principles</h2>
        <ul style={{ maxWidth: 950, lineHeight: 1.8 }}>
          <li>
            <strong>Transparency:</strong> Decisions, standards, and audits
            should be visible and explainable.
          </li>
          <li>
            <strong>Participation:</strong> People everywhere should have a voice
            in how AI affects society.
          </li>
          <li>
            <strong>Accountability:</strong> Clear responsibility for harms,
            failures, and misuse—no “accountability gaps.”
          </li>
          <li>
            <strong>Safety & rights:</strong> Protect human rights, security, and
            dignity as AI capabilities grow.
          </li>
          <li>
            <strong>Practical governance:</strong> Controls that can be
            implemented, measured, and improved.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: "2.25rem" }}>
        <h2>Safeguards against capture</h2>
        <p style={{ maxWidth: 900, lineHeight: 1.7 }}>
          A credible global authority must resist capture. GAFAIG is structured
          to reduce concentration of control via:
        </p>

        <ul style={{ maxWidth: 950, lineHeight: 1.8 }}>
          <li>
            <strong>Open processes:</strong> Public proposals, public comment,
            and published rationale for major decisions.
          </li>
          <li>
            <strong>Conflict-of-interest rules:</strong> Clear disclosure and
            recusal requirements for contributors and reviewers.
          </li>
          <li>
            <strong>Multi-stakeholder input:</strong> Government, academia,
            industry, civil society, and independent experts—no single bloc.
          </li>
          <li>
            <strong>Audit independence:</strong> Separation between standard
            authorship and compliance evaluation.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: "2.25rem" }}>
        <h2>Relationship to governments and institutions</h2>
        <p style={{ maxWidth: 900, lineHeight: 1.7 }}>
          GAFAIG is designed to complement—rather than replace—existing legal
          systems. Governments and institutions can adopt GAFAIG standards as:
        </p>

        <ul style={{ maxWidth: 950, lineHeight: 1.8 }}>
          <li>
            <strong>Reference controls</strong> for regulation, procurement, and
            certification.
          </li>
          <li>
            <strong>Shared definitions</strong> for risk tiers, audit artifacts,
            and reporting requirements.
          </li>
          <li>
            <strong>Interoperable frameworks</strong> to reduce fragmented and
            inconsistent governance across jurisdictions.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: "2.25rem" }}>
        <h2>Near-term roadmap</h2>
        <ul style={{ maxWidth: 950, lineHeight: 1.8 }}>
          <li>
            Publish an initial governance framework (v1) and a set of baseline
            controls for high-impact AI systems.
          </li>
          <li>
            Define audit and reporting requirements with practical templates and
            examples.
          </li>
          <li>
            Launch structured public participation pathways (comment periods,
            advisory input, and issue tracking).
          </li>
          <li>
            Establish versioning and a measurable improvement cycle.
          </li>
        </ul>
      </section>

      <hr style={{ margin: "3rem 0", opacity: 0.2 }} />

      <p style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.6 }}>
        Governance will evolve as GAFAIG grows. The long-term direction includes
        scalable global participation mechanisms and privacy-preserving
        accountability tooling, while maintaining transparency and legitimacy.
      </p>
    </main>
  );
}

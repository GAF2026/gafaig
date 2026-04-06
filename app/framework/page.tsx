import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";

export const dynamic = "force-static";

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="FRAMEWORK"
        title="How GAFAIG verifies AI governance in practice"
        description="GAFAIG operates a deterministic verification framework for AI governance. It evaluates whether human oversight is functioning across an organization’s AI systems, records structured findings, and produces certification outcomes that can be published to a public registry."
        secondaryDescription="The framework is designed to separate private review from public trust. Evidence, findings, and assessment workflow remain inside a controlled verification environment, while certification results are disclosed through a verifiable public registry."
        actions={
          <>
            <PublicButtonLink href="/apply" variant="primary">
              Apply for Certification
            </PublicButtonLink>

            <PublicButtonLink href="/developers" variant="secondary">
              Explore Integrations
            </PublicButtonLink>

            <PublicButtonLink href="/registry" variant="secondary">
              View the Registry
            </PublicButtonLink>

            <PublicButtonLink href="/mission" variant="secondary">
              Mission &amp; Scope
            </PublicButtonLink>
          </>
        }
      />

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WHAT THE FRAMEWORK IS
        </div>

        <h2 className="mt-4 max-w-[820px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          A deterministic model for producing verifiable certification outcomes
        </h2>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
          GAFAIG is not a self-attestation tool, policy repository, or advisory
          checklist. It is a structured verification framework designed to
          evaluate governance evidence, produce reproducible outcomes, and
          publish certification records that can be independently verified.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <FrameworkCard
            title="Deterministic by design"
            body="The framework is structured so that the same verified inputs lead to the same certification outcome. This supports consistency, repeatability, and institutional trust."
          />

          <FrameworkCard
            title="Evidence-based review"
            body="Certification is not based on declarations alone. Organizations move through a controlled process where governance materials are reviewed and findings are recorded against defined criteria."
          />

          <FrameworkCard
            title="Private verification layer"
            body="Evidence, findings, and internal assessment workflow remain within the controlled verification engine. Sensitive operational materials are not exposed through the public site."
          />

          <FrameworkCard
            title="Public registry layer"
            body="Certification outcomes are published through a registry of record so external parties can review public certification status, linked systems, badge signals, and proof endpoints."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          TWO-LAYER ARCHITECTURE
        </div>

        <h2 className="mt-4 max-w-[820px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Private verification, public trust
        </h2>

        <p className="mt-5 max-w-[960px] text-[16px] leading-[1.9] text-black/75">
          GAFAIG is built on a two-layer model. A controlled verification engine
          handles review workflow privately, while the public registry discloses
          certification outcomes in a form that can be externally relied on.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ArchitectureCard
            eyebrow="Layer 1"
            title="Private Verification Engine"
            body="Organizations move through application intake, evidence review, findings, events, scoring, and certification workflow. This is the operational layer used to produce structured outcomes."
            points={[
              "Controlled reviewer environment",
              "Structured evidence and findings flow",
              "Deterministic certification workflow",
            ]}
          />

          <ArchitectureCard
            eyebrow="Layer 2"
            title="Public Registry"
            body="Certification outcomes are disclosed through a public registry of record. Badge links, proof endpoints, and linked system pages allow external parties to validate public trust signals."
            points={[
              "Canonical certification records",
              "Badge and proof verification layer",
              "Linked public AI systems and explorer surfaces",
            ]}
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          TRUST INFRASTRUCTURE LAYER
        </div>

        <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          The framework does not end at certification. It extends into public trust infrastructure.
        </h2>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
          GAFAIG is designed not only to produce certification outcomes, but to
          make those outcomes independently checkable across the public web.
          This is the layer that turns registry publication into infrastructure:
          signed certification payloads, published verification keys, public
          verification endpoints, embeddable badges, QR-based verification, and
          portable widgets that let third parties validate governance status
          without accessing private evidence.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <FrameworkCard
            title="Signed certification proofs"
            body="Each public certification can be represented as a signed payload, allowing external parties to validate that the public record matches what GAFAIG issued."
          />

          <FrameworkCard
            title="Published verification key"
            body="GAFAIG publishes the verification key needed to validate signed certification records, making external cryptographic checks possible without exposing private signing material."
          />

          <FrameworkCard
            title="Verification API"
            body="Public certification records can be checked programmatically through the GAFAIG verification endpoint, supporting external integrations, audits, and automated trust checks."
          />

          <FrameworkCard
            title="Portable trust surfaces"
            body="Badges, widgets, verify buttons, and QR-linked records allow certification status to travel beyond the registry page itself while still resolving back to a canonical public record."
          />
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
          <div className="text-[18px] font-semibold tracking-tight text-black">
            Why this matters
          </div>
          <ul className="mt-3 space-y-2 text-[15px] text-black/75">
            <li>• Public trust can be checked independently rather than assumed</li>
            <li>• Certification can travel across the web without losing verifiability</li>
            <li>• Third parties can rely on a canonical registry of record</li>
            <li>• Sensitive private evidence stays inside the controlled review layer</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          VERIFICATION PROCESS
        </div>

        <h2 className="mt-4 max-w-[820px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          From review workflow to certification record
        </h2>

        <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
          The framework follows a structured sequence. Governance materials are
          submitted, reviewed, recorded as findings, evaluated through the
          engine, and translated into certification outcomes that can be
          published through the public registry.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <WorkflowCard
            number="1"
            title="Application"
            body="Organizations enter a controlled verification workflow."
          />
          <WorkflowCard
            number="2"
            title="Evidence"
            body="Governance materials and oversight records are submitted and reviewed."
          />
          <WorkflowCard
            number="3"
            title="Findings"
            body="Structured findings are recorded against defined review criteria."
          />
          <WorkflowCard
            number="4"
            title="Certification"
            body="Deterministic evaluation supports a formal certification outcome."
          />
          <WorkflowCard
            number="5"
            title="Registry"
            body="Public certification records are published and can be externally verified."
          />
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 p-5">
          <div className="text-[20px] font-semibold text-black">
            Process summary
          </div>
          <div className="mt-3 text-[15px] leading-[1.8] text-black/75">
            Application → Evidence → Findings → Certification → Registry
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          TRUST PROPERTIES
        </div>

        <h2 className="mt-4 max-w-[820px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Why the framework can be relied on
        </h2>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <TrustCard
            title="Reproducible outcomes"
            body="The framework is designed so the same verified inputs produce the same certification result."
          />
          <TrustCard
            title="Controlled private review"
            body="Internal materials remain within the verification engine rather than being exposed through the public site."
          />
          <TrustCard
            title="Public registry of record"
            body="Certification records are published through a canonical public registry that supports external verification."
          />
          <TrustCard
            title="Portable trust signals"
            body="Badge endpoints, proof payloads, widgets, and linked system records allow certification outcomes to be relied on beyond the registry page itself."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WHAT THE FRAMEWORK PRODUCES
        </div>

        <h2 className="mt-4 max-w-[820px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Certification records that others can verify
        </h2>

        <p className="mt-5 max-w-[960px] text-[16px] leading-[1.9] text-black/75">
          The output of the framework is not simply an internal assessment. It
          is a public certification record that can be viewed through the
          registry, explored across organizations and systems, checked through
          verification and badge endpoints, and embedded as a portable trust
          surface across the web.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <PublicButtonLink href="/apply" variant="primary">
            Apply for Certification
          </PublicButtonLink>
          <PublicButtonLink href="/developers" variant="secondary">
            Explore Integrations
          </PublicButtonLink>
          <PublicButtonLink href="/registry" variant="secondary">
            View public registry
          </PublicButtonLink>
          <PublicButtonLink href="/explorer" variant="secondary">
            Open explorer
          </PublicButtonLink>
        </div>
      </section>
    </main>
  );
}

function FrameworkCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[20px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/75">{body}</p>
    </div>
  );
}

function ArchitectureCard({
  eyebrow,
  title,
  body,
  points,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {eyebrow}
      </div>
      <div className="mt-3 text-[24px] font-semibold leading-[1.25] tracking-tight text-black">
        {title}
      </div>
      <p className="mt-4 text-[15px] leading-[1.8] text-black/72">{body}</p>
      <ul className="mt-5 space-y-3 text-[14px] leading-[1.7] text-black/72">
        {points.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkflowCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-2 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-[1.7] text-black/72">{body}</p>
    </div>
  );
}

function TrustCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}
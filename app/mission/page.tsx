import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="MISSION"
          title="Why GAFAIG exists"
          description="GAFAIG exists because AI governance claims should be visible, accountable, and independently verifiable. As artificial intelligence becomes more powerful, society needs a reliable way to know whether meaningful human oversight exists."
          secondaryDescription="The GAFAIG mission is to transform AI governance from private assertions into deterministic certification outcomes that can remain private or, when publication is elected, become signed public certification surfaces backed by independent verification."
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[30px] font-semibold tracking-tight text-black">
            AI systems should not operate without visible human accountability
          </h2>

          <p className="mt-5 text-[16px] leading-7 text-black/75">
            As artificial intelligence becomes more powerful and more widely
            deployed, society needs a reliable way to understand whether AI
            systems are governed responsibly. Governance claims should not depend
            on blind trust, marketing language, screenshots, or unverifiable
            disclosures.
          </p>

          <p className="mt-4 max-w-[940px] text-[15px] leading-7 text-black/75">
            GAFAIG exists because AI governance must become visible,
            inspectable, independently verifiable, and publicly accountable.
            The mission is not merely to display certification information. The
            mission is to help create human accountability infrastructure for
            artificial intelligence.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The problem GAFAIG solves
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            AI governance is increasingly required, but most systems still rely
            on internal attestations, opaque audits, unverifiable disclosures, or
            trust claims that cannot be independently validated by customers,
            regulators, partners, or the public.
          </p>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/75">
            Without independently verifiable governance infrastructure, external
            stakeholders often cannot determine whether an organization&apos;s
            responsible AI claims reflect real oversight, completed governance
            processes, or publication-controlled certification outcomes.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            A shift from governance claims to verifiable accountability
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Before GAFAIG"
              body="Organizations describe AI governance through policies, frameworks, reports, and disclosures. Oversight may be asserted, but external stakeholders cannot independently verify whether a certified governance outcome exists."
            />
            <StatementCard
              title="With GAFAIG"
              body="Governance outcomes are produced through deterministic private execution. Certified outcomes may then be published as signed public certification surfaces that external systems and the public can independently verify."
            />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            GAFAIG does not replace governance frameworks. It adds deterministic
            public governance trust infrastructure that makes certification
            outcomes independently verifiable while preserving private
            governance data, internal evidence, and workflow confidentiality.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PRIVATE VS PUBLIC GOVERNANCE ARCHITECTURE
          </div>

          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
            Visible accountability without exposing private governance materials
          </h2>

          <p className="mt-4 max-w-[980px] text-[15px] leading-7 text-black/75">
            GAFAIG separates private governance execution from public governance
            trust. Organizations can complete governance review, evidence
            evaluation, findings, remediation, and certification privately.
            Public accountability begins only when certification is achieved and
            publication is explicitly elected.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6">
              <h3 className="text-[20px] font-semibold tracking-tight text-black">
                Private Governance Execution
              </h3>

              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Private governance execution remains non-public. Evidence,
                findings, reviewer materials, scoring inputs, workflows,
                remediation activity, telemetry, and simulations are protected
                inside the private governance environment.
              </p>

              <div className="mt-5 grid gap-3">
                <ArchitectureStageCard>Evidence</ArchitectureStageCard>
                <ArchitectureStageCard>Findings</ArchitectureStageCard>
                <ArchitectureStageCard>Reviewer Materials</ArchitectureStageCard>
                <ArchitectureStageCard>Governance Workflows</ArchitectureStageCard>
                <ArchitectureStageCard>Internal Scoring</ArchitectureStageCard>
                <ArchitectureStageCard>Remediation</ArchitectureStageCard>
                <ArchitectureStageCard>Governance Telemetry</ArchitectureStageCard>
                <ArchitectureStageCard>Simulations</ArchitectureStageCard>
              </div>
            </article>

            <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6">
              <h3 className="text-[20px] font-semibold tracking-tight text-black">
                Explicit Publication Boundary
              </h3>

              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Certification does not automatically create public visibility.
                Publication is explicit and controlled.
              </p>

              <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-[18px] font-semibold tracking-tight text-black">
                Private evaluation remains private. Published accountability
                becomes verifiable.
              </div>
            </article>

            <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6">
              <h3 className="text-[20px] font-semibold tracking-tight text-black">
                Public Governance Trust
              </h3>

              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Only publication-safe governance trust surfaces become public.
                Published certification surfaces can be inspected, referenced,
                distributed, and independently verified.
              </p>

              <div className="mt-5 grid gap-3">
                <ArchitectureStageCard>Certification Surface</ArchitectureStageCard>
                <ArchitectureStageCard>Registry ID</ArchitectureStageCard>
                <ArchitectureStageCard>Lifecycle State</ArchitectureStageCard>
                <ArchitectureStageCard>Signed Proof</ArchitectureStageCard>
                <ArchitectureStageCard>Verification Endpoint</ArchitectureStageCard>
                <ArchitectureStageCard>Public Key</ArchitectureStageCard>
                <ArchitectureStageCard>Badge / Widget / SDK</ArchitectureStageCard>
                <ArchitectureStageCard>Explorer / Registry / Verify</ArchitectureStageCard>
              </div>
            </article>
          </div>

          <div className="mt-6 rounded-3xl border border-black/10 bg-black/[0.02] p-6">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              Public verification rule
            </div>

            <p className="mt-3 text-[15px] leading-7 text-black/75">
              Verification uses the exact proof.messageString returned by the
              verification endpoint. Public verification does not require
              disclosure of private evidence, reviewer materials, scoring
              internals, or governance workflow details.
            </p>
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            This separation allows GAFAIG to make AI governance publicly
            accountable while preserving private governance execution.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Pillar
            title="Make governance visible"
            text="GAFAIG helps transform AI governance from private claims into publication-controlled certification surfaces that can be inspected publicly when organizations elect publication."
          />
          <Pillar
            title="Preserve private evaluation"
            text="Certification workflows remain private. Evidence, findings, internal materials, and governance review details are not exposed through public certification surfaces."
          />
          <Pillar
            title="Verify proof independently"
            text="Published certification surfaces are backed by signed proof.messageString payloads, Ed25519 signatures, public-key validation, and fail-closed verification behavior."
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            What makes GAFAIG different
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Snowflake is the source of truth for certification, publication, lifecycle state, registry snapshots, and proof payload inputs." />
            <BulletCard text="Certification remains private unless the organization explicitly elects publication." />
            <BulletCard text="Public verification uses proof.messageString only, never reconstructed JSON fields or UI-rendered values." />
            <BulletCard text="AI governance intelligence is advisory only and can never certify, publish, mutate registry state, or alter proof state." />
            <BulletCard text="Governance simulations are operational only and cannot modify certification, publication, registry, or proof state." />
            <BulletCard text="Public governance trust surfaces are append-only, publication-controlled, and independently verifiable." />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The GAFAIG mission
          </h2>

          <p className="mt-4 text-[16px] leading-7 text-black/75">
            Our mission is to make AI governance visible, deterministic,
            observable, certifiable, publishable, and independently verifiable.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG gives organizations a structured way to manage governance
            execution privately while giving external stakeholders a reliable way
            to verify published certification outcomes through cryptographic
            proof.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG creates the foundation for portable, machine-verifiable public
            governance trust in AI governance across organizations, AI systems,
            regulators, enterprises, governments, research institutions,
            universities, laboratories, non-profits, technology providers, and
            governance stakeholders.
          </p>
        </section>
      </div>
    </main>
  );
}

function Pillar({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-7 text-black/75">{text}</p>
    </div>
  );
}

function StatementCard({
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
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
    </div>
  );
}

function BulletCard({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
      <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
      <span className="text-[15px] leading-7 text-black/75">{text}</span>
    </div>
  );
}

function ArchitectureStageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] font-semibold tracking-tight text-black">
      {children}
    </div>
  );
}
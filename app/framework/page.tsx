import PublicButtonLink from "../_components/PublicButtonLink";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function Step({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        Step {number}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-4 text-[14px] leading-8 text-black/70">{body}</p>
    </article>
  );
}

function BulletCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/10 bg-white p-5">
      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-black" />
      <div className="text-[15px] leading-8 text-black/75">{children}</div>
    </div>
  );
}

function FlowStageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-[14px] font-semibold tracking-tight text-black">
      {children}
    </div>
  );
}

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="DETERMINISTIC GOVERNANCE INFRASTRUCTURE"
          title="How deterministic GAFAIG governance infrastructure works"
          description="GAFAIG creates deterministic governance infrastructure that allows AI governance outcomes to become independently verifiable without exposing private governance materials."
          secondaryDescription="The system separates private governance execution from public governance trust distribution. Governance is evaluated privately, certification remains private, publication is explicit, and only published certification outcomes are exposed and validated through GAFAIG’s verification infrastructure."
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-black">
            A deterministic governance infrastructure system for AI certification
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            GAFAIG does not rely on self-declared policies, static disclosures,
            or unverifiable trust claims. It introduces a structured deterministic
            governance process that evaluates whether oversight is present,
            functioning, and capable of producing a certification outcome.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            The output is not a marketing claim. It is a deterministic
            certification outcome that may become a signed, independently
            verifiable public governance trust surface if the organization
            explicitly elects publication.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-black">
            Deterministic execution model
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            GAFAIG runs as a deterministic governance engine with Snowflake as
            the system of execution. Governance records are processed privately,
            certification outcomes are produced privately, and certification
            surfaces may be published only if the organization elects
            publication.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            Public certification surfaces are exposed through controlled public
            governance trust infrastructure views, APIs, widgets, SDKs, and
            verification surfaces. These downstream layers do not compute trust.
            They project and distribute Snowflake-originated public governance
            trust surfaces.
          </p>

          <div className="mt-7 grid gap-4 sm:gap-5 md:grid-cols-2">
            <BulletCard>
              All governance scoring and decision outputs execute in Snowflake.
            </BulletCard>
            <BulletCard>
              Certification is private and does not automatically create a public
              certification surface.
            </BulletCard>
            <BulletCard>
              Publication is explicit, optional, append-only, and
              visibility-controlled.
            </BulletCard>
            <BulletCard>
              API, SDK, widget, and UI layers project already-determined public
              outputs.
            </BulletCard>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-black">
            Alignment with AI governance and risk management frameworks
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            GAFAIG does not replace governance frameworks such as the NIST AI
            Risk Management Framework. It provides deterministic governance
            infrastructure that helps evaluate whether governance processes are
            implemented, operational, and capable of producing certifiable
            outcomes.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            Frameworks define how organizations should govern AI systems across
            areas such as govern, map, measure, and manage. GAFAIG creates a
            verification and publication infrastructure architecture for
            certification outcomes without exposing private evidence, findings,
            reviewer notes, or internal workflow materials.
          </p>

          <div className="mt-7 grid gap-4 sm:gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
              <div className="text-[16px] font-semibold text-black">
                Frameworks define
              </div>
              <p className="mt-3 text-[14px] leading-8 text-black/70">
                Organizational policies, governance domains, system inventories,
                evaluation methods, and risk management processes.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
              <div className="text-[16px] font-semibold text-black">
                GAFAIG verifies
              </div>
              <p className="mt-3 text-[14px] leading-8 text-black/70">
                Whether governance outcomes can be certified privately and, if
                the organization elects publication, independently verified
                through signed public governance verification proof.
              </p>
            </article>
          </div>

          <p className="mt-6 text-[15px] leading-8 text-black/75">
            Each certification may be represented as a verifiable public
            certification surface only if the organization elects publication.
            External parties can verify published certification outcomes without
            accessing private internal materials.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-black">
            The deterministic GAFAIG governance pipeline
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            Every organization moves through a consistent, structured process.
            This ensures certification outcomes are repeatable, auditable,
            bounded, and grounded in governance evidence rather than
            self-attestation.
          </p>

          <p className="mt-4 max-w-[900px] text-[15px] leading-8 text-black/75">
            Application → Case → Findings → Evidence → Events → Scoring →
            Decision → Certification → Optional Publication → Registry Snapshot
            → Public Governance Trust View → API → UI → Verification
          </p>

          <div className="mt-9 grid gap-4 sm:gap-5 md:grid-cols-6">
            <Step
              number="1"
              title="Application"
              body="An organization enters the GAFAIG governance process and defines the scope of its AI governance certification request."
            />
            <Step
              number="2"
              title="Evidence"
              body="Governance materials, controls, oversight mechanisms, and supporting records are reviewed privately."
            />
            <Step
              number="3"
              title="Findings"
              body="Structured findings assess governance implementation, oversight strength, and control gaps."
            />
            <Step
              number="4"
              title="Decision"
              body="A deterministic Snowflake process produces a private certification outcome."
            />
            <Step
              number="5"
              title="Publication"
              body="If certification is achieved, the organization may elect publication as a public governance trust surface."
            />
            <Step
              number="6"
              title="Verification"
              body="A signed proof.messageString payload enables independent cryptographic verification."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            DETERMINISTIC GOVERNANCE FLOW
          </div>

          <h2 className="mt-4 text-[24px] sm:text-[26px] font-semibold tracking-tight text-black">
            Private governance execution becomes public verification infrastructure
          </h2>

          <p className="mt-4 max-w-[980px] text-[15px] leading-8 text-black/75">
            GAFAIG separates private governance execution from public governance
            trust distribution. Governance review, evidence, findings, scoring,
            and certification decisions remain inside the deterministic private
            execution layer. Public visibility occurs only after certification is
            achieved and publication is explicitly elected.
          </p>

          <div className="mt-9 grid gap-5 sm:gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 sm:p-7">
              <h3 className="text-[20px] font-semibold tracking-tight text-black">
                Private Governance Execution
              </h3>

              <p className="mt-4 text-[14px] leading-8 text-black/70">
                Applications, evidence, findings, governance events, reviewer
                workflows, remediation activity, and scoring inputs remain
                private and controlled.
              </p>

              <div className="mt-6 grid gap-3.5">
                <FlowStageCard>Application</FlowStageCard>
                <FlowStageCard>Case</FlowStageCard>
                <FlowStageCard>Evidence</FlowStageCard>
                <FlowStageCard>Findings</FlowStageCard>
                <FlowStageCard>Governance Review</FlowStageCard>
                <FlowStageCard>Scoring</FlowStageCard>
                <FlowStageCard>Decision</FlowStageCard>
              </div>
            </article>

            <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 sm:p-7">
              <h3 className="text-[20px] font-semibold tracking-tight text-black">
                Snowflake Deterministic Governance Authority
              </h3>

              <p className="mt-4 text-[14px] leading-8 text-black/70">
                Certification decisions originate only from deterministic
                Snowflake governance execution. API, SDK, widget, and UI layers
                do not certify, score, or compute governance trust.
              </p>

              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-[18px] font-semibold leading-8 tracking-tight text-black">
                Humans approve. Snowflake decides.
              </div>

              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6">
                <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Explicit Publication Gate
                </div>
                <p className="mt-4 text-[14px] leading-8 text-black/70">
                  Certification does not automatically create public visibility.
                  A certification outcome becomes public only when publication is
                  explicitly elected.
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 sm:p-7">
              <h3 className="text-[20px] font-semibold tracking-tight text-black">
                Public Governance Trust Infrastructure
              </h3>

              <p className="mt-4 text-[14px] leading-8 text-black/70">
                Published certification surfaces are projected into public
                registry, verification, explorer, API, widget, badge, and SDK
                surfaces.
              </p>

              <div className="mt-6 grid gap-3.5">
                <FlowStageCard>Registry Snapshot</FlowStageCard>
                <FlowStageCard>Certification Surface</FlowStageCard>
                <FlowStageCard>proof.messageString</FlowStageCard>
                <FlowStageCard>Verification Endpoint</FlowStageCard>
                <FlowStageCard>Public Key</FlowStageCard>
                <FlowStageCard>SDK / Widget / Badge / API</FlowStageCard>
                <FlowStageCard>Explorer / Registry / Verify</FlowStageCard>
              </div>
            </article>
          </div>

          <div className="mt-7 rounded-3xl border border-black/10 bg-black/[0.02] p-6 sm:p-7">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              Canonical verification rule
            </div>

            <p className="mt-4 text-[15px] leading-8 text-black/75">
              Verification MUST use the exact proof.messageString returned by
              the verification endpoint. Do NOT reconstruct signed payloads from
              JSON fields, proof.message, UI-rendered values, or reordered JSON.
            </p>
          </div>

          <p className="mt-6 text-[15px] leading-8 text-black/75">
            The visual flow preserves the GAFAIG authority chain: private
            governance execution → deterministic certification → explicit
            publication → signed proof → independent verification → public
            governance trust distribution.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-black">
            What deterministic certification means
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            Certification is not manually assigned by the UI, API, widget, SDK,
            or AI governance layer. Certification is a private Snowflake-derived
            outcome produced through governed scoring and decision logic.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            Certification alone does not create a public certification surface. A
            certification may become a public governance trust surface only if the
            organization explicitly elects publication.
          </p>

          <div className="mt-7 grid gap-4 sm:gap-5 md:grid-cols-2">
            <BulletCard>
              Certification is not self-attestation or a policy statement.
            </BulletCard>
            <BulletCard>
              Certification reflects a structured, completed governance process.
            </BulletCard>
            <BulletCard>
              Certification remains private unless publication is explicitly
              elected.
            </BulletCard>
            <BulletCard>
              Published certification surfaces can be independently verified
              using signed verification proof.
            </BulletCard>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-black">
            Private governance execution, public governance trust infrastructure
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            GAFAIG separates internal governance execution from public governance
            trust infrastructure distribution. This allows rigorous review
            without exposing private evidence while still producing a clear,
            verifiable public outcome when publication is elected.
          </p>

          <div className="mt-7 grid gap-4 sm:gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Private governance execution
              </div>
              <p className="mt-3 text-[14px] leading-8 text-black/70">
                Applications, evidence, findings, events, scoring, governance
                intelligence, remediation workflows, and decision logic are
                processed in a controlled private environment.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Public governance trust infrastructure layer
              </div>
              <p className="mt-3 text-[14px] leading-8 text-black/70">
                Only certification outcomes that are explicitly published are
                exposed publicly. External parties verify the result without
                accessing internal governance materials.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-black">
            Governance intelligence infrastructure remains advisory
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            GAFAIG includes governance intelligence, observability, simulations,
            remediation orchestration, timeline systems, and continuous
            monitoring. These systems support governance operations, but they do
            not replace deterministic public governance trust.
          </p>

          <div className="mt-7 grid gap-4 sm:gap-5 md:grid-cols-2">
            <BulletCard>
              AI may observe, recommend, simulate, and support governance
              workflows.
            </BulletCard>
            <BulletCard>
              AI may not certify, publish, mutate registry state, or modify proof
              state.
            </BulletCard>
            <BulletCard>
              Simulations are operational only and non-destructive.
            </BulletCard>
            <BulletCard>
              Governance observability systems are read-only projection layers.
            </BulletCard>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-black">
            Certification becomes verifiable public governance trust
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black/75">
            GAFAIG is both deterministic governance infrastructure and a public
            governance trust distribution infrastructure layer. Once
            certification is finalized and publication is elected, the outcome
            becomes a signed, independently verifiable public certification
            surface.
          </p>

          <p className="mt-4 max-w-[900px] text-[15px] leading-8 text-black/75">
            Each published certification surface is backed by a signed
            verification proof payload. External systems validate records using
            the exact proof.messageString and GAFAIG public key.
          </p>

          <div className="mt-7 grid gap-4 sm:gap-5 md:grid-cols-2">
            <BulletCard>
              Registry certification surfaces provide durable public
              certification references.
            </BulletCard>
            <BulletCard>
              The verify endpoint exposes signed proof for independent
              validation.
            </BulletCard>
            <BulletCard>
              Signed verification proof enables cryptographic verification of
              published certification surfaces.
            </BulletCard>
            <BulletCard>
              Public governance trust can be distributed across APIs, widgets,
              badges, and external platforms.
            </BulletCard>
          </div>

          <div className="mt-7 flex flex-wrap gap-3 sm:gap-4">
            <PublicButtonLink href="/registry" variant="primary">
              Open Certification Registry
            </PublicButtonLink>
            <PublicButtonLink href="/verify" variant="secondary">
              Open Verification Surface
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
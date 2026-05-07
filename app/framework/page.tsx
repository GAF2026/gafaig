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
    <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        Step {number}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
    </article>
  );
}

function BulletCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-black" />
      <div className="text-[15px] leading-7 text-black/75">{children}</div>
    </div>
  );
}

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="FRAMEWORK"
          title="How GAFAIG works"
          description="GAFAIG operates as deterministic global AI governance infrastructure. It combines private governance execution, governed scoring, human oversight, publication-controlled certification, append-only registry publication, governance observability, and cryptographic verification."
          secondaryDescription="The system separates a private verification engine from a public trust layer. Governance is evaluated privately, certification remains private, publication is explicit, and only published certification outcomes are exposed and validated through GAFAIG’s verification endpoint."
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            A deterministic system for AI governance certification
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG does not rely on self-declared policies, static disclosures,
            or unverifiable trust claims. It introduces a structured governance
            process that evaluates whether oversight is present, functioning, and
            capable of producing a certification outcome.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            The output is not a marketing claim. It is a deterministic
            certification outcome that may become a signed, independently
            verifiable public trust record if the organization explicitly elects
            publication.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Execution model
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG runs as a deterministic governance engine with Snowflake as
            the system of execution. Governance records are processed privately,
            certification outcomes are produced privately, and records may be
            published only if the organization elects publication.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Public records are exposed through controlled public views, APIs,
            widgets, SDKs, and verification surfaces. These downstream layers do
            not compute trust. They project and distribute Snowflake-originated
            public trust records.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard>
              All governance scoring and decision outputs execute in Snowflake.
            </BulletCard>
            <BulletCard>
              Certification is private and does not automatically create a public
              record.
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

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Alignment with AI risk management frameworks
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG does not replace governance frameworks such as the NIST AI
            Risk Management Framework. It provides deterministic governance
            infrastructure that helps evaluate whether governance processes are
            implemented, operational, and capable of producing certifiable
            outcomes.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Frameworks define how organizations should govern AI systems across
            areas such as govern, map, measure, and manage. GAFAIG creates a
            verification and publication architecture for certification outcomes
            without exposing private evidence, findings, reviewer notes, or
            internal workflow materials.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[16px] font-semibold text-black">
                Frameworks define
              </div>
              <p className="mt-2 text-[14px] leading-7 text-black/70">
                Organizational policies, governance domains, system inventories,
                evaluation methods, and risk management processes.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[16px] font-semibold text-black">
                GAFAIG verifies
              </div>
              <p className="mt-2 text-[14px] leading-7 text-black/70">
                Whether governance outcomes can be certified privately and, if
                the organization elects publication, independently verified
                through signed public proof.
              </p>
            </article>
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            Each certification may be represented as a verifiable public record
            only if the organization elects publication. External parties can
            verify published certification outcomes without accessing private
            internal materials.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The GAFAIG governance pipeline
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Every organization moves through a consistent, structured process.
            This ensures certification outcomes are repeatable, auditable,
            bounded, and grounded in governance evidence rather than
            self-attestation.
          </p>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/70">
            Application → Case → Findings → Evidence → Events → Scoring →
            Decision → Certification → Optional Publication → Registry Snapshot
            → Public View → API → UI → Verification
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-6">
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
              body="If certification is achieved, the organization may elect publication as a public trust record."
            />
            <Step
              number="6"
              title="Verification"
              body="A signed proof.messageString payload enables independent cryptographic verification."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            What certification means
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Certification is not manually assigned by the UI, API, widget, SDK,
            or AI governance layer. Certification is a private Snowflake-derived
            outcome produced through governed scoring and decision logic.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Certification alone does not create a public record. A certification
            may become a public trust record only if the organization explicitly
            elects publication.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
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
              Published certification records can be independently verified using
              signed proof.
            </BulletCard>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Private verification, public trust
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG separates internal governance execution from public trust
            distribution. This allows rigorous review without exposing private
            evidence while still producing a clear, verifiable public outcome
            when publication is elected.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Private verification engine
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Applications, evidence, findings, events, scoring, governance
                intelligence, remediation workflows, and decision logic are
                processed in a controlled private environment.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Public trust layer
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Only certification outcomes that are explicitly published are
                exposed publicly. External parties verify the result without
                accessing internal governance materials.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Governance intelligence remains advisory
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG includes governance intelligence, observability, simulations,
            remediation orchestration, timeline systems, and continuous
            monitoring. These systems support governance operations, but they do
            not replace deterministic trust.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
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

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Certification becomes verifiable trust
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG is both governance infrastructure and a trust distribution
            layer. Once certification is finalized and publication is elected,
            the outcome becomes a signed, independently verifiable public
            certification record.
          </p>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/70">
            Each published certification record is backed by a signed verification
            payload. External systems validate records using the exact
            proof.messageString and GAFAIG public key.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard>
              Registry records provide durable public certification references.
            </BulletCard>
            <BulletCard>
              The verify endpoint exposes signed proof for independent
              validation.
            </BulletCard>
            <BulletCard>
              Signed proof enables cryptographic verification of published
              certification records.
            </BulletCard>
            <BulletCard>
              Trust can be distributed across APIs, widgets, badges, and external
              platforms.
            </BulletCard>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/registry" variant="primary">
              View Public Records
            </PublicButtonLink>
            <PublicButtonLink href="/verify" variant="secondary">
              Verify a Record
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
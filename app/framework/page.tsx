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
          description="GAFAIG operates as a deterministic AI governance certification system. It combines structured evaluation, governed scoring, and cryptographic verification to produce certification outcomes that can be published as publicly verifiable records if the organization elects publication."
          secondaryDescription="The system separates a private verification engine from a public trust layer. Governance is reviewed internally, while only certification outcomes that are explicitly published are exposed and validated through GAFAIG’s verification endpoint."
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            A system for verifying human oversight
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG does not rely on self-declared policies or static disclosures.
            It introduces a structured verification process that evaluates whether
            human oversight is actually present and functioning across AI systems
            and organizational operations.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            The output is not a report or a claim. It is a certified outcome that
            can be independently verified through a signed verification payload.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Execution model
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG runs as a deterministic governance engine with Snowflake as the
            system of execution. Governance records are processed privately,
            certification outcomes are produced and may be snapshotted into the
            registry if the organization elects publication, and only the public
            trust contract is exposed through views, APIs, and verification
            surfaces.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard>
              All governance scoring and decision outputs execute in Snowflake.
            </BulletCard>
            <BulletCard>
              Public records are derived from immutable registry snapshots rather
              than recomputed in downstream layers.
            </BulletCard>
            <BulletCard>
              API and UI layers do not perform governance computation; they project
              and distribute already-determined public outputs.
            </BulletCard>
            <BulletCard>
              Verification results are reproducible from source data, registry
              snapshots, and signed public proof.
            </BulletCard>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Alignment with AI Risk Management Frameworks
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG does not replace governance frameworks such as the NIST AI
            Risk Management Framework. It provides a verification layer that
            confirms whether governance processes are actually functioning in
            practice.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Frameworks define how organizations should govern AI systems across
            functions such as Govern, Map, Measure, and Manage. GAFAIG verifies
            that these processes are implemented, operational, and producing real
            oversight outcomes.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[16px] font-semibold text-black">
                Frameworks define
              </div>
              <p className="mt-2 text-[14px] leading-7 text-black/70">
                Organizational policies, system inventories, evaluation methods,
                and risk management processes.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[16px] font-semibold text-black">
                GAFAIG verifies
              </div>
              <p className="mt-2 text-[14px] leading-7 text-black/70">
                That these governance processes are real, functioning, and
                independently verifiable through certified records and signed
                proof.
              </p>
            </article>
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            Certification is issued when organizations show that oversight in AI
            systems is real, functioning, and independently verifiable. Each
            certification may be represented as a verifiable public record if the
            organization elects publication, allowing external parties to confirm
            governance without accessing private internal materials.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The GAFAIG verification pipeline
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Every organization moves through a consistent, structured process.
            This ensures certification outcomes are repeatable, comparable, and
            grounded in actual oversight evidence rather than self-attestation.
          </p>

          <p className="mt-4 text-[15px] text-black/70 max-w-[720px]">
            GAFAIG enforces a deterministic pipeline: Application → Case → Findings → Evidence → Events → Scoring → Decision → Certification → (Optional) Publication → Registry → Verification.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-6">
            <Step
              number="1"
              title="Application"
              body="An organization enters the GAFAIG verification process and defines the scope of its AI operations."
            />
            <Step
              number="2"
              title="Evidence Review"
              body="Governance materials, controls, and oversight mechanisms are submitted and evaluated."
            />
            <Step
              number="3"
              title="Findings"
              body="Structured findings assess how oversight is implemented and where gaps exist."
            />
            <Step
              number="4"
              title="Scoring & Decision"
              body="A deterministic process produces a governance outcome based on the reviewed record."
            />
            <Step
              number="5"
              title="Publication (Optional)"
              body="If certification is achieved, the organization may elect to publish the outcome as a public trust record without exposing private materials."
            />
            <Step
              number="6"
              title="Verification"
              body="A signed verification payload is generated and exposed through /api/verify, enabling independent validation."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            What certification means
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Certification is not manually assigned. It is derived from a governed scoring system and can be published as a signed, verifiable record if the organization elects publication. This ensures consistency, transparency, and auditability.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard>
              Certification is not self-attestation or a policy statement.
            </BulletCard>
            <BulletCard>
              Certification reflects a structured, completed verification process.
            </BulletCard>
            <BulletCard>
              Certification may result in a public trust record if the organization elects publication.
            </BulletCard>
            <BulletCard>
              Certification can be independently verified using signed proof.
            </BulletCard>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Private verification, public trust
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG separates internal verification from public trust. This allows
            rigorous evaluation without exposing private evidence while still
            producing a clear, verifiable public outcome.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Private verification engine
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Applications, evidence, findings, events, and scoring are
                processed within a controlled environment where oversight is
                evaluated.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Public trust layer
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Only certification outcomes that are explicitly published are
                exposed publicly. External parties can verify the result without
                accessing internal materials.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Certification becomes verifiable trust
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG is both a verification system and a trust distribution layer.
            Once certification is finalized, the outcome may become a signed,
            independently verifiable record if the organization elects publication
            that can be validated outside the platform.
          </p>

          <p className="mt-4 text-[15px] text-black/70 max-w-[720px]">
            Each certified record is backed by a signed verification payload. External systems validate records using the canonical messageString and GAFAIG public key.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard>
              Registry records provide a durable public certification reference.
            </BulletCard>
            <BulletCard>
              The verify endpoint exposes a signed payload for independent
              validation.
            </BulletCard>
            <BulletCard>
              Signed proof enables cryptographic verification of certification.
            </BulletCard>
            <BulletCard>
              Trust can be distributed across APIs, widgets, badges, and
              external platforms.
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
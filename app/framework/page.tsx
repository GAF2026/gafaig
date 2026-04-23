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
          description="GAFAIG transforms AI governance into a structured, verifiable process. It evaluates whether meaningful human oversight exists and publishes certification outcomes as independently verifiable public records."
          secondaryDescription="The platform operates as a two-layer system: a private verification engine that reviews oversight evidence, and a public trust layer that publishes certification results without exposing sensitive internal materials."
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
            The result is not a report or a claim. It is a certification outcome
            that can be independently verified through public trust
            infrastructure.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The GAFAIG verification pipeline
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Every organization moves through a consistent, structured process.
            This allows certification outcomes to be comparable, repeatable, and
            grounded in actual oversight evidence rather than self-attestation.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <Step
              number="1"
              title="Application"
              body="An organization enters the GAFAIG verification process and defines the scope of its AI operations."
            />
            <Step
              number="2"
              title="Evidence Review"
              body="Documentation, controls, governance materials, and oversight mechanisms are submitted and evaluated."
            />
            <Step
              number="3"
              title="Findings"
              body="Structured findings are created to assess how oversight is implemented and where important gaps remain."
            />
            <Step
              number="4"
              title="Scoring & Decision"
              body="A deterministic evaluation path produces a governance outcome based on the reviewed record."
            />
            <Step
              number="5"
              title="Public Certification"
              body="Certification outcomes are finalized and published as independently verifiable public trust records."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            What certification means
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG certification is the public outcome of a completed structured
            verification process. It indicates that the organization’s oversight
            posture was evaluated through GAFAIG and finalized as a verifiable
            trust record.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard>
              Certification is not self-attestation or a policy statement alone.
            </BulletCard>
            <BulletCard>
              Certification means the oversight posture was evaluated through a
              structured framework.
            </BulletCard>
            <BulletCard>
              Certification means the outcome was finalized into a public trust
              record.
            </BulletCard>
            <BulletCard>
              Certification means external parties can independently verify the
              published outcome.
            </BulletCard>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Private verification, public trust
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG separates internal verification workflow from public
            certification exposure. This allows rigorous review without exposing
            private evidence while still publishing a clear, verifiable public
            result.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Private verification engine
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Applications, evidence, findings, events, and scoring are
                reviewed and finalized in the private GAFAIG verification layer.
                This is where meaningful human oversight is assessed through
                controlled workflow.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Public trust layer
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                The public layer exposes only the finalized certification
                outcome. It allows outside parties to verify that certification
                exists without exposing reviewer notes, internal materials, or
                private evidence.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Certification becomes public trust infrastructure
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG is not only a review framework. It is also a public trust
            infrastructure layer. Once certification is finalized, the outcome
            can be surfaced through registry records, verification endpoints,
            signed proof, and public trust interfaces that others can inspect.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Registry records
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Each certified outcome can be published into the GAFAIG public
                registry as a durable public certification record.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Verification endpoints
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                The public verification surface allows external parties to
                confirm a certification outcome by registry identifier.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Signed proof
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                GAFAIG supports signed verification payloads so the public trust
                record can be checked as a cryptographically backed result.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                Public trust surface
              </div>
              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Certification can be distributed through registry pages, verify
                pages, signed JSON, and external trust surfaces without exposing
                internal verification materials.
              </p>
            </article>
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
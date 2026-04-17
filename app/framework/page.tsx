import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

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
              body="Approved outcomes can be finalized and published as independently verifiable public trust records."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Approved vs Certified
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG distinguishes between completion of the evaluation process and
            final public certification. This separation makes it clear when a
            review has been completed and when a record has been finalized as a
            trusted public outcome.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <StatusCard
              title="Approved"
              body="Approved means the organization has completed the GAFAIG evaluation process and received a governance decision. Oversight has been assessed, but the record may still be in transition, finalization, or publication workflow."
            />
            <StatusCard
              title="Certified"
              body="Certified means the evaluation outcome has been finalized and published as a public, independently verifiable trust record. This is the record state intended to function as a portable public trust signal."
            />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            In practice, Approved reflects evaluation completion. Certified
            reflects finalized public trust publication.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Private verification, public trust
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <StatementCard
              title="Private verification engine"
              body="Evidence, findings, and oversight materials are evaluated in a controlled environment. This protects sensitive organizational information while allowing rigorous review."
            />
            <StatementCard
              title="Public trust layer"
              body="Certification outcomes are published as registry records, verification endpoints, signed payloads, and portable trust signals that can be independently validated."
            />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            This two-layer approach allows GAFAIG to provide transparency and
            trust without exposing proprietary, confidential, or sensitive review
            materials.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Public trust infrastructure
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG extends beyond a registry page. It provides public trust
            infrastructure that allows certification outcomes to be verified
            through multiple public surfaces.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Registry records and AI system detail pages" />
            <BulletCard text="Verification endpoints with signed payloads" />
            <BulletCard text="Public key infrastructure for signature validation" />
            <BulletCard text="Embeddable widgets, badges, and external trust surfaces" />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            These components ensure that GAFAIG certification is not confined to
            a single website. Trust can be independently verified wherever the
            record appears.
          </p>
        </section>
      </div>
    </main>
  );
}

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
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-2 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-[1.7] text-black/72">{body}</p>
    </div>
  );
}

function StatusCard({
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
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function BulletCard({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
      <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
      <span className="text-[14px] leading-6 text-black/75">{text}</span>
    </div>
  );
}
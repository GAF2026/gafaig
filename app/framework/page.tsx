import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-10">

        <PublicPageHero
          eyebrow="FRAMEWORK"
          title="How GAFAIG works"
          description="GAFAIG transforms AI governance into a structured, verifiable process. It evaluates whether meaningful human oversight exists and publishes certification outcomes as independently verifiable public records."
          secondaryDescription="The platform operates as a two-layer system: a private verification engine that reviews oversight evidence, and a public trust layer that publishes certification results without exposing sensitive internal materials."
        />

        {/* OVERVIEW */}
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
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
            that can be independently verified through public trust infrastructure.
          </p>
        </section>

        {/* PIPELINE */}
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The GAFAIG verification pipeline
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Every organization moves through a consistent, structured process.
            This ensures that certification outcomes are comparable, repeatable,
            and grounded in actual oversight evidence.
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
              body="Documentation, controls, and oversight mechanisms are submitted and evaluated."
            />
            <Step
              number="3"
              title="Findings"
              body="Structured findings are created to assess how oversight is implemented and where gaps exist."
            />
            <Step
              number="4"
              title="Scoring & Decision"
              body="A deterministic evaluation process produces a governance outcome."
            />
            <Step
              number="5"
              title="Public Certification"
              body="Approved outcomes are published as verifiable public trust records."
            />
          </div>
        </section>

        {/* APPROVED VS CERTIFIED */}
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Approved vs Certified
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG distinguishes between evaluation completion and final public
            certification. This ensures clarity between internal review outcomes
            and fully trusted public records.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <StatusCard
              title="Approved"
              body="The organization has completed the GAFAIG evaluation process and received a governance decision. Oversight has been assessed, but the record may still be in transition or under finalization."
            />
            <StatusCard
              title="Certified"
              body="The evaluation outcome has been finalized and published as a public, verifiable trust record. This represents GAFAIG’s highest level of confirmation that meaningful human oversight is in place."
            />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            Only certified records are intended to function as fully portable
            trust signals across external systems, websites, and third-party
            verification environments.
          </p>
        </section>

        {/* TWO LAYER MODEL */}
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Private verification, public trust
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <StatementCard
              title="Private verification engine"
              body="Evidence, findings, and oversight materials are evaluated in a controlled environment. This protects sensitive organizational data while allowing rigorous review."
            />
            <StatementCard
              title="Public trust layer"
              body="Certification outcomes are published as registry records, verification endpoints, and signed payloads that can be independently validated."
            />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            This separation allows GAFAIG to provide transparency and trust
            without exposing proprietary or sensitive information.
          </p>
        </section>

        {/* TRUST SURFACE */}
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Public trust infrastructure
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG extends beyond a registry. It provides a set of public trust
            surfaces that allow certification to be verified anywhere.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Registry records and system detail pages" />
            <BulletCard text="Verification endpoints with signed payloads" />
            <BulletCard text="Public key infrastructure for validation" />
            <BulletCard text="Embeddable widgets and external trust signals" />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            These components ensure that GAFAIG certification is not confined to
            a single platform. Trust can be independently verified wherever the
            record appears.
          </p>
        </section>

      </div>
    </main>
  );
}

/* COMPONENTS */

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
      <div className="mt-2 text-[16px] font-semibold text-black">
        {title}
      </div>
      <p className="mt-2 text-[14px] leading-6 text-black/70">
        {body}
      </p>
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
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-6">
      <h3 className="text-[18px] font-semibold text-black">{title}</h3>
      <p className="mt-3 text-[14px] leading-6 text-black/70">{body}</p>
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
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
      <div className="text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-6 text-black/70">{body}</p>
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
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-10">
        <PublicPageHero
          eyebrow="MISSION"
          title="Why GAFAIG exists"
          description="GAFAIG exists because AI governance must become independently verifiable. As AI systems move into products, infrastructure, operations, and decision-making, organizations need more than internal policy statements or self-declared controls. They need a structured way to demonstrate that human oversight is actually functioning."
          secondaryDescription="GAFAIG provides a system for verifying whether meaningful human oversight exists and for publishing that outcome as a public, independently verifiable certification record."
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The problem GAFAIG solves
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Today, AI governance is largely based on internal documentation,
            policy statements, and self-attestation. Organizations can claim
            that oversight exists, but there is no consistent, independent way
            to verify whether that oversight is real, functioning, or effective.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            As AI systems influence real-world outcomes, this gap becomes
            critical. Stakeholders — including customers, regulators, and the
            public — need a reliable way to confirm that human oversight is not
            just defined, but actually operating in practice.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            A shift from claims to proof
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <StatementCard
              title="Before GAFAIG"
              body="Organizations describe governance through internal policies, frameworks, or disclosures. Oversight is asserted, but not independently verified."
            />
            <StatementCard
              title="With GAFAIG"
              body="Oversight is evaluated through a structured process and published as a certification record that can be independently verified."
            />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            GAFAIG does not replace governance frameworks. It introduces a
            verification layer that makes those frameworks observable,
            reviewable, and provable.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Pillar
            title="Verify oversight"
            text="GAFAIG evaluates whether meaningful human oversight exists across an organization’s AI operations."
          />
          <Pillar
            title="Standardize evaluation"
            text="Oversight is assessed through a structured process using evidence, findings, and deterministic certification logic."
          />
          <Pillar
            title="Publish proof"
            text="Certification outcomes are published as public records that can be independently verified without exposing private materials."
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            What makes GAFAIG different
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Verification occurs in a controlled environment, separate from public disclosure." />
            <BulletCard text="Certification outcomes are deterministic and consistent across organizations." />
            <BulletCard text="Public records can be independently verified using signed proof." />
            <BulletCard text="Trust signals can be accessed through registry pages, APIs, and embeddable surfaces." />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-black/[0.03] p-8 md:p-10">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The GAFAIG mission
          </h2>

          <p className="mt-4 text-[16px] leading-8 text-black/80">
            Our mission is to make human oversight in AI systems visible,
            measurable, and verifiable.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG establishes a global standard for verifying AI governance. It
            enables organizations to demonstrate oversight in a credible and
            consistent way, and it gives external stakeholders a clear mechanism
            to validate those claims.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            As AI becomes embedded in critical systems, trust must move beyond
            internal assurances. GAFAIG exists to ensure that oversight can be
            proven.
          </p>
        </section>
      </div>
    </main>
  );
}

function Pillar({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <h3 className="text-[18px] font-semibold text-black">{title}</h3>
      <p className="mt-3 text-[14px] leading-6 text-black/70">{text}</p>
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
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="MISSION"
          title="Why GAFAIG exists"
          description="GAFAIG exists because AI governance must become independently verifiable. As AI systems move into products, infrastructure, operations, and decision-making, organizations need more than internal policy statements or self-declared controls. They need a structured way to verify that human oversight is actually functioning."
          secondaryDescription="GAFAIG combines a private verification engine with a public trust layer. Internal governance is reviewed in a controlled environment, while only the certification outcome is published as an independently verifiable public trust record."
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The problem GAFAIG solves
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            Today, AI governance is largely expressed through internal
            documentation, policy statements, and self-attestation. Organizations
            can claim that oversight exists, but there is no consistent,
            independent way to verify whether that oversight is real,
            functioning, or effective.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            As AI systems influence real-world outcomes, this gap becomes
            critical. Customers, regulators, partners, and the public need a
            reliable way to confirm that human oversight is not just defined,
            but actually operating in practice.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            A shift from claims to verification
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Before GAFAIG"
              body="Organizations describe governance through internal policies, frameworks, or disclosures. Oversight is asserted, but cannot be independently verified."
            />
            <StatementCard
              title="With GAFAIG"
              body="Oversight is evaluated through a structured private process and the certified outcome is published as a public trust record that can be independently verified."
            />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            GAFAIG does not replace governance frameworks. It adds a
            verification layer that makes governance outcomes externally
            reviewable and independently verifiable.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Pillar
            title="Verify oversight"
            text="GAFAIG verifies whether meaningful human oversight is functioning across an organization’s AI operations."
          />
          <Pillar
            title="Separate private review from public trust"
            text="Governance evidence, findings, and internal review materials stay in a controlled verification environment while only the certification outcome is made public."
          />
          <Pillar
            title="Publish proof"
            text="Certified outcomes are published as public trust records backed by signed proof and designed for independent verification."
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            What makes GAFAIG different
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Verification occurs in a controlled environment, separate from public disclosure." />
            <BulletCard text="Only the certification outcome is exposed publicly; internal governance materials remain private." />
            <BulletCard text="Public records can be independently verified using signed proof, a verification endpoint, and a public key." />
            <BulletCard text="Trust signals can be distributed across registry pages, APIs, widgets, badges, and external platforms." />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The GAFAIG mission
          </h2>

          <p className="mt-4 text-[16px] leading-7 text-black/75">
            Our mission is to make human oversight in AI systems visible,
            reviewable, and independently verifiable.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG establishes a verification-first model for AI governance. It
            enables organizations to move from internal claims to certified
            public trust records and gives external stakeholders a clear
            mechanism to validate those records independently.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            As AI becomes embedded in critical systems, trust must move beyond
            internal assurances. GAFAIG exists to ensure that meaningful human
            oversight can be verified, published, and trusted across the public
            web without exposing private governance records.
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
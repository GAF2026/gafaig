import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <div>
          <PublicPageHero
            eyebrow="MISSION"
            title="Why GAFAIG exists"
            description="GAFAIG establishes a verifiable standard for AI governance by combining structured evaluation with cryptographic verification. Certification outcomes are published as independently verifiable public records backed by signed proof."
            secondaryDescription="GAFAIG combines a private verification engine with a public trust layer, adding cryptographic verification to AI governance certification. Internal governance is reviewed in a controlled environment, while only the certification outcome is published as an independently verifiable public trust record backed by signed proof. Organizations can prove certified AI governance without exposing internal systems, evidence, or workflows."
          />
        </div>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            The problem GAFAIG solves
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            AI governance is increasingly required, but most systems rely on
            internal attestations, opaque audits, or unverifiable claims. GAFAIG
            introduces a model where certification is computed, recorded, and
            published as a verifiable public record.
          </p>

          <p className="mt-4 text-[15px] text-black/70 max-w-[720px]">
            Every certified record includes a canonical messageString and
            signature, allowing external systems to validate certification
            status, payload integrity, and authenticity.
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
            text="GAFAIG verifies whether meaningful human oversight is implemented, operational, and producing real oversight outcomes across an organization’s AI operations."
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
            <BulletCard text="Public records can be independently verified using a canonical messageString, signed proof, a verification endpoint, and a public key." />
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
            GAFAIG creates a foundation for portable, machine-verifiable trust
            in AI systems. Certification becomes a provable state that can be
            validated across platforms, applications, and jurisdictions.
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
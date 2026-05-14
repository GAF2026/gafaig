import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="MISSION"
          title="Why GAFAIG exists"
          description="GAFAIG exists to create deterministic, independently verifiable public governance trust infrastructure for AI governance at global scale. It enables organizations to certify AI governance outcomes privately and, if they elect publication, publish signed public certification surfaces that anyone can independently verify."
          secondaryDescription="GAFAIG combines private governance execution, publication-controlled certification, append-only registry publication, governance observability, governance simulations, remediation orchestration, and cryptographic proof infrastructure into one deterministic global AI governance architecture."
        />

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
            GAFAIG introduces deterministic global AI governance infrastructure:
            governance is executed privately, certification is controlled inside
            Snowflake, publication is explicit, and public governance trust surfaces are
            backed by cryptographic proof.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            A shift from governance claims to verifiable infrastructure
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Before GAFAIG"
              body="Organizations describe AI governance through policies, frameworks, reports, and disclosures. Oversight may be asserted, but external stakeholders cannot independently verify the certified governance outcome."
            />
            <StatementCard
              title="With GAFAIG"
              body="Governance outcomes are produced through deterministic private execution. Certified outcomes may then be published as signed public certification surfaces that external systems can independently verify."
            />
          </div>

          <p className="mt-6 text-[15px] leading-7 text-black/75">
            GAFAIG does not replace governance frameworks. It adds deterministic
            public governance trust infrastructure that makes certification outcomes
            independently verifiable while preserving private governance data,
            internal evidence, and workflow confidentiality.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Pillar
            title="Execute governance deterministically"
            text="GAFAIG structures AI governance certification through Snowflake-controlled workflows, deterministic scoring, bounded lifecycle states, human oversight, and controlled publication."
          />
          <Pillar
            title="Separate certification from publication"
            text="Certification is private and deterministic. Publication is explicit and optional. Only published certification surfaces become public governance trust surfaces."
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
            Our mission is to make AI governance deterministic, observable,
            certifiable, publishable, and independently verifiable.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG gives organizations a structured way to manage governance
            execution privately while giving external stakeholders a reliable way
            to verify published certification outcomes through cryptographic
            proof.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            GAFAIG creates the foundation for portable, machine-verifiable public governance trust
            in AI governance across organizations, AI systems, regulators,
            enterprises, governments, research institutions, universities,
            laboratories, non-profits, technology providers, and governance
            stakeholders.
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
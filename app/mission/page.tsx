import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-static";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="MISSION"
        title="Why GAFAIG exists"
        description="GAFAIG exists because AI governance must become independently verifiable. As AI systems move into products, infrastructure, operations, and decision-making, organizations need more than internal policy statements or self-declared controls. They need a structured way to demonstrate that human oversight is actually functioning."
        secondaryDescription="GAFAIG provides that infrastructure. It operates a controlled verification framework and a public registry of record where certification outcomes can be published, inspected, and independently verified without exposing private evidence, findings, or internal review workflow."
        actions={
          <>
            <Link
              href="/framework"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              See how it works
            </Link>

            <Link
              href="/registry"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              View the registry
            </Link>
          </>
        }
      />

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          THE PROBLEM
        </div>

        <h2 className="mt-4 max-w-[820px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          AI governance cannot remain a private claim
        </h2>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
          Organizations are increasingly relying on AI across products,
          operations, and decision-making. At the same time, responsibility for
          oversight is often distributed across teams, systems, and processes.
          In that environment, governance can easily become fragmented,
          inconsistently applied, or impossible for others to verify from the
          outside.
        </p>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
          GAFAIG exists to close that gap. It creates a structured way to
          determine whether oversight is operating in practice, produce a formal
          certification outcome, and publish that outcome through a public trust
          surface.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <InfoListCard
          title="Why independent verification matters"
          items={[
            "Organizations need a credible way to demonstrate active oversight",
            "Partners and regulators need more than self-attestation",
            "Governance outcomes must be reproducible and externally reviewable",
            "Certification should become a durable public trust signal",
            "Public confidence depends on verifiable infrastructure, not marketing claims",
          ]}
        />

        <InfoListCard
          title="What GAFAIG provides"
          items={[
            "A controlled verification framework for governance review",
            "Deterministic certification outcomes",
            "A public registry of record for disclosed certifications",
            "Badge and proof surfaces for independent verification",
            "A clear boundary between private review and public trust",
          ]}
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WHAT GAFAIG IS
        </div>

        <h2 className="mt-4 max-w-[820px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Trust infrastructure for AI governance
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <BoundaryCard
            title="Verification system"
            body="GAFAIG is a structured verification system that evaluates whether human oversight is functioning across an organization’s AI environment."
          />

          <BoundaryCard
            title="Certification authority"
            body="GAFAIG produces formal certification outcomes rather than informal governance impressions or self-scored checklists."
          />

          <BoundaryCard
            title="Registry of record"
            body="GAFAIG publishes public certification records that can be inspected and verified without exposing private evidence or reviewer workflow."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          PRIVATE REVIEW, PUBLIC TRUST
        </div>

        <h2 className="mt-4 max-w-[820px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          What is reviewed and what is disclosed
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <BoundaryCard
            title="Private review layer"
            body="Evidence, findings, and internal workflow are reviewed inside a controlled verification environment and are not exposed through the public site."
          />

          <BoundaryCard
            title="Public certification layer"
            body="Only certification outcomes, registry identifiers, validity windows, linked systems, and trust surfaces are disclosed through the public registry."
          />

          <BoundaryCard
            title="Verifiable trust signal"
            body="Each public certification record is designed to be externally relied on through linked registry pages, badge surfaces, and proof endpoints."
          />
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <TextCard
          eyebrow="INDEPENDENCE"
          title="Independent evaluation"
          body="GAFAIG operates independently from the organizations it evaluates. Certification outcomes are produced through structured review methods designed to support consistency, reproducibility, and institutional trust."
        />

        <TextCard
          eyebrow="CONTINUITY"
          title="Ongoing governance, not one-time optics"
          body="The mission is not simply to certify once. It is to support an ongoing model in which organizations demonstrate that oversight remains active over time and that public trust signals continue to reflect real governance conditions."
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          MISSION IN PRACTICE
        </div>

        <h2 className="mt-4 max-w-[820px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          The mission is simple
        </h2>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
          Make AI governance visible, structured, and independently verifiable.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/framework"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Read the framework
          </Link>

          <Link
            href="/registry"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Open the registry
          </Link>

          <Link
            href="/explorer"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Explore the data
          </Link>
        </div>
      </section>
    </main>
  );
}

function InfoListCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <h2 className="text-[24px] font-semibold leading-[1.25] tracking-tight text-black">
        {title}
      </h2>

      <ul className="mt-4 list-disc space-y-3 pl-5 text-[15px] leading-[1.8] text-black/75">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function BoundaryCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[20px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/75">{body}</p>
    </div>
  );
}

function TextCard({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        {eyebrow}
      </div>

      <h2 className="mt-4 text-[28px] font-semibold leading-[1.2] tracking-tight text-black">
        {title}
      </h2>

      <p className="mt-4 text-[16px] leading-[1.85] text-black/75">{body}</p>
    </div>
  );
}
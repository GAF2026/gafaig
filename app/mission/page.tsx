// app/mission/page.tsx
import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-static";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="MISSION"
        title="An independent certification authority for human oversight of AI"
        description="GAFAIG certifies that an organization operates human oversight across its AI infrastructure. Certification is organization-wide and confirms that oversight responsibilities, operational controls, and review activity are functioning in practice."
        actions={
          <>
            <Link
              href="/framework"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Read the Framework
            </Link>
            <Link
              href="/registry"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              View the Registry
            </Link>
          </>
        }
      />

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          PURPOSE
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Why GAFAIG exists
        </h2>

        <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/80">
          Organizations increasingly rely on AI across products, operations, and
          decision support. Oversight responsibilities are often distributed
          across teams, systems, and processes. GAFAIG provides an independent,
          evidence-based certification framework for confirming that human
          oversight operates across an organization’s AI infrastructure.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <InfoListCard
          title="What certification affirms"
          items={[
            "Human responsibility for AI oversight is clearly assigned",
            "Operational controls support responsible AI use and review",
            "Oversight activities are documented and evidenced",
            "Evaluation outcomes are deterministic and reproducible",
            "Certification results are published through the public registry",
          ]}
        />

        <InfoListCard
          title="Public certification model"
          items={[
            "Certification applies at the organization level",
            "Public outputs are limited to controlled disclosures",
            "Internal evidence remains private",
            "Verification outcomes are independently reviewable",
            "Registry publication supports external trust and verification",
          ]}
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          MISSION BOUNDARIES
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Scope, disclosure, and decision basis
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <BoundaryCard
            title="Scope"
            body="Certification is organization-wide. It applies to the people, controls, and oversight activity supporting AI systems operated or deployed by the organization."
          />

          <BoundaryCard
            title="Public disclosure"
            body="The registry publishes certification outcomes through controlled disclosures. Internal evidence, findings, and assessment materials remain private."
          />

          <BoundaryCard
            title="Decision basis"
            body="Certification decisions are based on submitted evidence and deterministic evaluation logic designed to produce auditable and reproducible outcomes."
          />
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <TextCard
          eyebrow="INDEPENDENCE"
          title="Independent evaluation"
          body="GAFAIG operates as an independent certification authority. Certification outcomes are based on evidence submitted for review and evaluated through reproducible scoring methods intended to support consistency, auditability, and public trust."
        />

        <TextCard
          eyebrow="PARTICIPATION"
          title="Annual certification participation"
          body="GAFAIG is offered as an annual certification subscription. Organizations participate to obtain independent assurance that human oversight operates across their AI infrastructure and to publish certification status through the registry."
        />
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

      <ul className="mt-4 list-disc space-y-3 pl-5 text-[15px] leading-[1.8] text-black/80">
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

      <p className="mt-4 text-[16px] leading-[1.85] text-black/80">{body}</p>
    </div>
  );
}
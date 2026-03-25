import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-static";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="MISSION"
        title="Helping organizations demonstrate responsible AI governance"
        description="GAFAIG provides an independent way to verify that human oversight is operating across an organization’s AI systems. It enables organizations to review governance practices, assess oversight, and publish clear certification outcomes."
        secondaryDescription="Reviews take place in a controlled environment, while certification results are made available through a public registry. This allows organizations, partners, and regulators to confirm governance without exposing internal materials."
        actions={
          <>
            <Link
              href="/framework"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              See how it works
            </Link>

            <Link
              href="/registry"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              View certified organizations
            </Link>
          </>
        }
      />

      {/* PURPOSE */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          PURPOSE
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Why GAFAIG exists
        </h2>

        <p className="mt-5 max-w-[960px] text-[16px] leading-[1.9] text-black/75">
          Organizations are increasingly relying on AI across products,
          operations, and decision-making. At the same time, responsibility for
          oversight is often distributed across teams, systems, and processes.
          GAFAIG provides a structured way to confirm that oversight is actually
          functioning in practice.
        </p>
      </section>

      {/* WHAT + MODEL */}
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <InfoListCard
          title="What certification shows"
          items={[
            "Human responsibility for AI oversight is clearly assigned",
            "Operational controls support responsible AI use",
            "Oversight activity is documented and verifiable",
            "Evaluation results are consistent and reproducible",
            "Certification outcomes are published in the registry",
          ]}
        />

        <InfoListCard
          title="How certification is shared"
          items={[
            "Certification applies at the organization level",
            "Only controlled information is made public",
            "Internal evidence remains private",
            "Certification outcomes can be independently verified",
            "Registry publication supports external trust",
          ]}
        />
      </section>

      {/* BOUNDARIES */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          SCOPE AND DISCLOSURE
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          What is reviewed and what is made public
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <BoundaryCard
            title="Scope"
            body="Certification applies across the organization, including the people, controls, and oversight processes supporting AI systems."
          />

          <BoundaryCard
            title="Public disclosure"
            body="The registry publishes certification outcomes only. Evidence, findings, and internal assessment materials are not exposed."
          />

          <BoundaryCard
            title="Decision basis"
            body="Certification decisions are based on submitted evidence and structured evaluation methods designed to produce consistent and auditable outcomes."
          />
        </div>
      </section>

      {/* STRUCTURE */}
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <TextCard
          eyebrow="INDEPENDENCE"
          title="Independent evaluation"
          body="GAFAIG operates independently from the organizations it evaluates. Certification outcomes are based on submitted evidence and structured review methods designed to support consistency and trust."
        />

        <TextCard
          eyebrow="PARTICIPATION"
          title="Ongoing participation"
          body="Organizations participate on an ongoing basis to demonstrate that oversight remains active over time and to maintain their certification status in the registry."
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
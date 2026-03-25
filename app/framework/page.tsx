import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-static";

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="FRAMEWORK"
        title="How GAFAIG verifies AI governance in practice"
        description="GAFAIG follows a structured process to evaluate whether human oversight is operating across an organization’s AI systems. Evidence is reviewed, findings are recorded, and certification outcomes are produced in a consistent and repeatable way."
        secondaryDescription="Reviews take place in a controlled environment, while certification outcomes are published through the public registry. This allows others to verify governance without exposing internal materials."
        actions={
          <>
            <Link
              href="/registry"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              View the Registry
            </Link>

            <Link
              href="/mission"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Mission &amp; Scope
            </Link>
          </>
        }
      />

      {/* MODEL */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          VERIFICATION MODEL
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Structured, evidence-based, and consistent
        </h2>

        <p className="mt-5 max-w-[960px] text-[16px] leading-[1.9] text-black/75">
          GAFAIG evaluates governance at the organization level using a
          structured approach. Evidence is reviewed against defined criteria,
          findings are recorded, and certification outcomes are produced in a
          consistent and auditable way. Internal materials remain private, while
          certification outcomes are made public through the registry.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <FrameworkCard
            title="Defined criteria"
            body="Clear criteria are used to assess whether human oversight is in place and functioning across AI systems."
          />

          <FrameworkCard
            title="Evidence-based review"
            body="Organizations submit evidence that is evaluated as part of a controlled review process. Internal materials are not publicly disclosed."
          />

          <FrameworkCard
            title="Consistent outcomes"
            body="The evaluation process is designed to produce consistent results when the same evidence is reviewed."
          />

          <FrameworkCard
            title="Public certification"
            body="Certification outcomes are published through the registry so they can be viewed and verified externally."
          />
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          VERIFICATION PROCESS
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          From review to certification
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <WorkflowCard
            title="1) Submit evidence"
            body="Organizations provide documentation and records that demonstrate how AI systems are governed."
          />

          <WorkflowCard
            title="2) Review and record findings"
            body="Evidence is evaluated against defined criteria, and findings are recorded as part of the review."
          />

          <WorkflowCard
            title="3) Determine certification"
            body="Evaluation results lead to a certification outcome that can be published through the registry."
          />
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 p-5">
          <div className="text-[20px] font-semibold text-black">
            Process summary
          </div>
          <div className="mt-3 text-[15px] leading-[1.8] text-black/75">
            Evidence → Findings → Evaluation → Certification → Registry
          </div>
        </div>

        <p className="mt-5 max-w-[920px] text-[14px] leading-[1.8] text-black/72">
          The process is designed so that the same inputs lead to the same
          outcomes, supporting consistency and confidence in certification
          results.
        </p>
      </section>

      {/* TRUST */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          TRUST PROPERTIES
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Why the framework can be relied on
        </h2>

        <ul className="mt-6 list-disc space-y-3 pl-5 text-[15px] leading-[1.8] text-black/75">
          <li>Organization-wide evaluation</li>
          <li>Certification based on submitted evidence</li>
          <li>Consistent and repeatable outcomes</li>
          <li>Private review with controlled public disclosure</li>
          <li>Public registry for external verification</li>
        </ul>
      </section>
    </main>
  );
}

function FrameworkCard({
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

function WorkflowCard({
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
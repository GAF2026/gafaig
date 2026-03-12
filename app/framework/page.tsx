// app/framework/page.tsx
import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-static";

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="FRAMEWORK"
        title="How GAFAIG verifies human oversight across AI infrastructure"
        description="GAFAIG applies a repeatable verification model to evaluate whether human oversight operates across an organization’s AI infrastructure. Evidence is reviewed, findings are recorded, scoring is deterministic, and certification outcomes are published through the registry."
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
              Mission &amp; Boundaries
            </Link>

            <Link
              href="/framework"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Read the Framework
            </Link>
          </>
        }
      />

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          VERIFICATION MODEL
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Organization-wide, evidence-based, and auditable
        </h2>

        <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/80">
          GAFAIG verification is organization-wide, evidence-based, and designed
          to produce auditable certification outcomes. Internal evidence remains
          private, while public disclosure is limited to controlled certification
          outputs through the registry.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <FrameworkCard
            title="Program criteria"
            body="GAFAIG applies structured program criteria to evaluate whether human oversight operates across the organization’s AI infrastructure."
          />

          <FrameworkCard
            title="Evidence-based assessment"
            body="Evidence is collected, linked to review criteria, and assessed as part of a controlled verification process. Internal materials are not disclosed publicly."
          />

          <FrameworkCard
            title="Deterministic scoring"
            body="Scoring is deterministic and auditable, implemented as reproducible Snowflake-native SQL logic with consistent outputs for the same evidence inputs."
          />

          <FrameworkCard
            title="Public certification"
            body="Certification outcomes are published through the GAFAIG Registry. Evidence, findings, and internal assessment materials remain private."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          VERIFICATION WORKFLOW
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Evidence to certification, then registry publication
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <WorkflowCard
            title="1) Collect evidence"
            body="Organizations provide governance artifacts, oversight records, and operational documentation supporting review."
          />

          <WorkflowCard
            title="2) Record findings"
            body="Submitted evidence is assessed against program criteria. Findings capture review outcomes and remain linked to the underlying evidence."
          />

          <WorkflowCard
            title="3) Score and certify"
            body="Deterministic scoring produces certification outcomes which are then recorded and published through the public registry."
          />
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 p-5">
          <div className="text-[20px] font-semibold text-black">
            Workflow summary
          </div>
          <div className="mt-3 text-[15px] leading-[1.8] text-black/75">
            Evidence → Findings → Scoring → Decision → Certification → Registry
          </div>
        </div>

        <p className="mt-5 max-w-[920px] text-[14px] leading-[1.8] text-black/72">
          Verification records are auditable and reproducible. Given the same
          evidence inputs, the scoring framework is designed to produce
          consistent outcomes.
        </p>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          ASSURANCE PROPERTIES
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          What gives the framework trust value
        </h2>

        <ul className="mt-6 list-disc space-y-3 pl-5 text-[15px] leading-[1.8] text-black/80">
          <li>Organization-wide scope</li>
          <li>Evidence-linked certification decisions</li>
          <li>Deterministic and auditable scoring</li>
          <li>Private verification layer with controlled public disclosure</li>
          <li>Reproducible outputs supporting independent trust</li>
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
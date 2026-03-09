// app/framework/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
      <section className="pt-2 pb-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          Framework
        </div>

        <h1 className="mt-4 max-w-[980px] text-[40px] font-semibold leading-[1.15] text-black">
          How GAFAIG verifies human oversight across AI infrastructure
        </h1>

        <p className="mt-5 max-w-[900px] text-[18px] leading-[1.75] text-black/80">
          GAFAIG applies a repeatable verification model to evaluate whether
          human oversight operates across an organization’s AI infrastructure.
          Evidence is reviewed, findings are recorded, scoring is deterministic,
          and certification outcomes are published through the registry.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          <Link
            href="/registry"
            className="rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
          >
            View the Registry
          </Link>

          <Link
            href="/mission"
            className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black/[0.04]"
          >
            Mission &amp; Boundaries
          </Link>

          <Link
            href="/framework"
            className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black/[0.04]"
          >
            Read the Framework
          </Link>
        </div>
      </section>

      <section className="border-t border-black/10 pt-8">
        <h2 className="text-[16px] font-semibold text-black">
          Verification model
        </h2>

        <p className="mt-3 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          GAFAIG verification is organization-wide, evidence-based, and designed
          to produce auditable certification outcomes. Internal evidence remains
          private, while public disclosure is limited to controlled certification
          outputs through the registry.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">Program criteria</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              GAFAIG applies structured program criteria to evaluate whether
              human oversight operates across the organization’s AI
              infrastructure.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">
              Evidence-based assessment
            </div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Evidence is collected, linked to review criteria, and assessed as
              part of a controlled verification process. Internal materials are
              not disclosed publicly.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">
              Deterministic scoring
            </div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Scoring is deterministic and auditable, implemented as
              reproducible Snowflake-native SQL logic with consistent outputs
              for the same evidence inputs.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">Public certification</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Certification outcomes are published through the GAFAIG Registry.
              Evidence, findings, and internal assessment materials remain
              private.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 border-t border-black/10 pt-8">
        <h2 className="text-[16px] font-semibold text-black">
          Verification workflow
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">1) Collect evidence</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Organizations provide governance artifacts, oversight records, and
              operational documentation supporting review.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">2) Record findings</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Submitted evidence is assessed against program criteria. Findings
              capture review outcomes and remain linked to the underlying
              evidence.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">
              3) Score and certify
            </div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Deterministic scoring produces certification outcomes which are
              then recorded and published through the public registry.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Workflow summary</div>
          <div className="mt-2 text-[14px] leading-[1.7] text-black/75">
            Evidence → Findings → Scoring → Decision → Certification → Registry
          </div>
        </div>

        <p className="mt-4 max-w-[920px] text-[14px] leading-[1.8] text-black/72">
          Verification records are auditable and reproducible. Given the same
          evidence inputs, the scoring framework is designed to produce
          consistent outcomes.
        </p>
      </section>

      <section className="mt-10 border-t border-black/10 pt-8">
        <h2 className="text-[16px] font-semibold text-black">
          Assurance properties
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-black/80">
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
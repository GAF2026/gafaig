// app/framework/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      {/* Hero */}
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Framework
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          How GAFAIG verifies human oversight for AI systems
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[900px]">
          GAFAIG evaluates evidence of human oversight using a repeatable workflow. Findings are
          recorded, scoring is deterministic, and outcomes produce an organization-level Tier + Status.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/registry"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            View the Registry
          </Link>

          <Link
            href="/mission"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Mission & Boundaries
          </Link>

          <Link
            href="/framework"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Read the Framework
          </Link>
        </div>
      </section>

      {/* Core components */}
      <section className="mt-6 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Core components</h2>

        <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          Verification is evidence-based and organization-wide. Evidence remains private. Only Tier + Status is
          published publicly.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Program criteria</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              GAFAIG applies program criteria consistently to evaluate whether human oversight exists and operates
              across an organization’s AI infrastructure.
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Evidence-based assessment</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Evidence is collected, linked to criteria, and reviewed. Internal materials remain private and are not
              disclosed publicly.
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Deterministic scoring</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Scoring is deterministic and auditable, implemented as reproducible Snowflake logic to produce an
              organization-level Tier.
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Public outcome</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              The registry publishes Tier + Status only. Evidence and any AI inventory remain private.
            </p>
          </div>
        </div>
      </section>

      {/* Verification workflow */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Verification workflow</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">1) Collect evidence</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Organizations provide governance artifacts and operational records that demonstrate oversight operation.
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">2) Record findings</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Evidence is evaluated against program criteria. Findings capture outcomes and are linked back to evidence.
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">3) Score + publish</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Deterministic scoring produces a Tier and a certification Status is recorded. The registry publishes
              Tier + Status only.
            </p>
          </div>
        </div>

        <div className="mt-6 border border-black/10 rounded-2xl p-5">
          <div className="font-semibold text-black">Workflow summary</div>
          <div className="mt-2 text-[14px] leading-[1.7] text-black/75">
            Evidence → Findings → Scoring → Decision → Registry
          </div>
        </div>
      </section>

      {/* Assurance properties */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Assurance properties</h2>
        <ul className="mt-4 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
          <li>Organization-wide scope</li>
          <li>Evidence-linked decisions</li>
          <li>Deterministic, auditable scoring</li>
          <li>Private verification layer; public registry output</li>
          <li>Public disclosure limited to Tier + Status</li>
        </ul>
      </section>
    </main>
  );
}
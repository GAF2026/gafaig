// app/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
      {/* Hero */}
      <section className="pt-2 pb-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          Global Authority for AI Governance
        </div>

        <h1 className="mt-4 max-w-[980px] text-[40px] font-semibold leading-[1.15] text-black">
          Independent Verification of Human Oversight for AI Systems
        </h1>

        <p className="mt-5 max-w-[880px] text-[18px] leading-[1.75] text-black/80">
          GAFAIG certifies that an organization operates human oversight across
          its AI infrastructure.
        </p>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.85] text-black/75">
          GAFAIG is an independent governance assurance authority that verifies
          whether organizations maintain structured human oversight across AI
          systems and publishes certification outcomes through a public
          registry.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          <Link
            href="/registry"
            className="rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
          >
            View the Registry
          </Link>

          <Link
            href="/framework"
            className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black/[0.04]"
          >
            Read the Framework
          </Link>

          <Link
            href="/mission"
            className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black/[0.04]"
          >
            Mission &amp; Boundaries
          </Link>
        </div>
      </section>

      {/* Verification pathway */}
      <section className="border-t border-black/10 pt-8">
        <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
          Verification pathway
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              1
            </div>
            <div className="mt-2 text-[15px] font-semibold text-black">
              Evidence
            </div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/72">
              Organizations submit governance artifacts and oversight records.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              2
            </div>
            <div className="mt-2 text-[15px] font-semibold text-black">
              Findings
            </div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/72">
              Review outcomes are recorded against defined program criteria.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              3
            </div>
            <div className="mt-2 text-[15px] font-semibold text-black">
              Scoring
            </div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/72">
              Deterministic scoring produces auditable governance outcomes.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              4
            </div>
            <div className="mt-2 text-[15px] font-semibold text-black">
              Certification
            </div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/72">
              Governance oversight is confirmed through a formal certification
              decision.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              5
            </div>
            <div className="mt-2 text-[15px] font-semibold text-black">
              Registry
            </div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/72">
              Public records confirm certification outcomes while internal
              materials remain private.
            </p>
          </div>
        </div>
      </section>

      {/* What GAFAIG verifies */}
<section className="mt-10 border-t border-black/10 pt-8">
  <h2 className="text-[16px] font-semibold text-black">
    What GAFAIG verifies
  </h2>

  <p className="mt-3 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
    GAFAIG certification evaluates whether human oversight operates across an
    organization’s AI infrastructure. Verification focuses on accountability,
    operational controls, and documented oversight activity supporting
    responsible AI operation.
  </p>

  <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-black/80">
    <li>Clear human responsibility for AI system oversight</li>
    <li>Operational controls supporting responsible AI deployment</li>
    <li>Documented processes for monitoring and review</li>
    <li>Evidence demonstrating oversight activities occur in practice</li>
    <li>Deterministic and reproducible evaluation outcomes</li>
  </ul>
</section>

      {/* Navigation cards */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Mission</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
            The purpose, scope, and certification boundaries of the GAFAIG
            governance assurance program.
          </p>
          <div className="mt-4">
            <Link href="/mission" className="font-semibold underline">
              Read Mission →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Framework</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
            The verification model: evidence collection, findings,
            deterministic scoring, and certification decisions.
          </p>
          <div className="mt-4">
            <Link href="/framework" className="font-semibold underline">
              Read Framework →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Registry</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
            Public confirmation of certified organizations and governance
            assurance outcomes.
          </p>
          <div className="mt-4">
            <Link href="/registry" className="font-semibold underline">
              View Registry →
            </Link>
          </div>
        </div>
      </section>

      {/* Why GAFAIG exists */}
      <section className="mt-10 border-t border-black/10 pt-8">
        <h2 className="text-[16px] font-semibold text-black">
          Why GAFAIG exists
        </h2>

        <p className="mt-3 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          As AI systems move into products, operations, and decision support,
          governance responsibilities are often distributed across teams,
          policies, and controls. GAFAIG provides an independent,
          evidence-based certification framework for confirming that human
          oversight is defined, operating, and publicly verifiable.
        </p>
      </section>
    </main>
  );
}
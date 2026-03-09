// app/mission/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
      <section className="pt-2 pb-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          Mission
        </div>

        <h1 className="mt-4 max-w-[920px] text-[40px] font-semibold leading-[1.15] text-black">
          An independent certification authority for human oversight of AI
        </h1>

        <p className="mt-5 max-w-[900px] text-[18px] leading-[1.75] text-black/80">
          GAFAIG certifies that an organization operates human oversight across
          its AI infrastructure. Certification is organization-wide and confirms
          that oversight responsibilities, operational controls, and review
          activity are functioning in practice.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          <Link
            href="/framework"
            className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black/[0.04]"
          >
            Read the Framework
          </Link>
          <Link
            href="/registry"
            className="rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
          >
            View the Registry
          </Link>
        </div>
      </section>

      <section className="border-t border-black/10 pt-8">
        <h2 className="text-[16px] font-semibold text-black">Purpose</h2>
        <p className="mt-3 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          Organizations increasingly rely on AI across products, operations, and
          decision support. Oversight responsibilities are often distributed
          across teams, systems, and processes. GAFAIG provides an independent,
          evidence-based certification framework for confirming that human
          oversight operates across an organization’s AI infrastructure.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">What certification affirms</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-black/80">
            <li>Human responsibility for AI oversight is clearly assigned</li>
            <li>Operational controls support responsible AI use and review</li>
            <li>Oversight activities are documented and evidenced</li>
            <li>Evaluation outcomes are deterministic and reproducible</li>
            <li>Certification results are published through the public registry</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Public certification model</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-black/80">
            <li>Certification applies at the organization level</li>
            <li>Public outputs are limited to controlled disclosures</li>
            <li>Internal evidence remains private</li>
            <li>Verification outcomes are independently reviewable</li>
            <li>Registry publication supports external trust and verification</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 border-t border-black/10 pt-8">
        <h2 className="text-[16px] font-semibold text-black">Mission boundaries</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">Scope</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Certification is organization-wide. It applies to the people,
              controls, and oversight activity supporting AI systems operated or
              deployed by the organization.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">Public disclosure</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              The registry publishes certification outcomes through controlled
              disclosures. Internal evidence, findings, and assessment materials
              remain private.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">Decision basis</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Certification decisions are based on submitted evidence and
              deterministic evaluation logic designed to produce auditable and
              reproducible outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 border-t border-black/10 pt-8">
        <h2 className="text-[16px] font-semibold text-black">Independence</h2>
        <p className="mt-3 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          GAFAIG operates as an independent certification authority.
          Certification outcomes are based on evidence submitted for review and
          evaluated through reproducible scoring methods intended to support
          consistency, auditability, and public trust.
        </p>
      </section>

      <section className="mt-10 border-t border-black/10 pt-8">
        <h2 className="text-[16px] font-semibold text-black">Participation</h2>
        <p className="mt-3 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          GAFAIG is offered as an annual certification subscription.
          Organizations participate to obtain independent assurance that human
          oversight operates across their AI infrastructure and to publish
          certification status through the registry.
        </p>
      </section>
    </main>
  );
}
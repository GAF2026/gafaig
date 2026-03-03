// app/mission/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      {/* Hero */}
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Mission
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[900px]">
          A governance assurance program for organizations operating AI
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[880px]">
          GAFAIG certifies that an organization operates human oversight across its AI infrastructure.
          Certification is organization-wide. GAFAIG publishes certification outcomes as Tier + Status only.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/framework"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Read the Framework
          </Link>
          <Link
            href="/registry"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            View the Registry
          </Link>
        </div>
      </section>

      {/* Why GAFAIG */}
      <section className="mt-6 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Why GAFAIG</h2>
        <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          Organizations increasingly rely on AI across products, operations, and decision support.
          Internal governance is often fragmented across teams and tools. GAFAIG provides a consistent,
          evidence-based method to certify that human oversight exists and operates as a defined program.
        </p>
      </section>

      {/* What certification asserts */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="border border-black/10 rounded-2xl p-5">
          <div className="font-semibold text-black">What certification asserts</div>
          <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
            <li>Defined oversight roles and accountability exist</li>
            <li>Governance controls and documentation are maintained</li>
            <li>Oversight activities are evidenced and reviewable</li>
            <li>Outcomes are scored deterministically and reproducibly</li>
            <li>Tier + Status is published to the public registry</li>
          </ul>
        </div>

        <div className="border border-black/10 rounded-2xl p-5">
          <div className="font-semibold text-black">What certification does not require</div>
          <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
            <li>Public disclosure of an AI inventory</li>
            <li>Public disclosure of internal evidence</li>
            <li>Risk-tiering of individual AI systems</li>
            <li>Disclosure of proprietary methods or datasets</li>
            <li>External integration into AI systems (future capability)</li>
          </ul>
        </div>
      </section>

      {/* Boundaries */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Boundaries</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Scope</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Organization-wide certification. Applies to any part of the organization that deploys
              or operates AI infrastructure.
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Public output</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Only Tier + Status is public. Internal evidence and any AI inventory remain private.
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Decision basis</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Evidence is evaluated against defined requirements. Scoring is deterministic and auditable.
            </p>
          </div>
        </div>
      </section>

      {/* Participation */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Participation</h2>
        <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          GAFAIG is offered as an annual certification subscription. Organizations subscribe to obtain
          third-party assurance and publish certification status to the registry.
        </p>
      </section>
    </main>
  );
}
// app/registry/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export default function RegistryPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      {/* Hero */}
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Registry
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          Public certification status for independent verification of human oversight for AI systems
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[880px]">
          The GAFAIG Registry publishes Tier + Status only. Internal evidence and any AI inventory remain private.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/framework"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Read the Framework
          </Link>

          <Link
            href="/mission"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            Mission & Boundaries
          </Link>
        </div>
      </section>

      {/* What is public */}
      <section className="mt-6 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">What the registry publishes</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Public fields</div>
            <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
              <li>Organization name</li>
              <li>Certification Tier</li>
              <li>Certification Status</li>
              <li>Last updated / effective date (if displayed)</li>
            </ul>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Not public</div>
            <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
              <li>Evidence files or internal documentation</li>
              <li>AI inventory or system-level details</li>
              <li>Proprietary methods, datasets, or architecture</li>
              <li>Internal findings and rationales</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to interpret */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">How to interpret Tier + Status</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Tier</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Tier summarizes the certification outcome produced by deterministic scoring across the assessment.
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Status</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Status indicates the certification state (for example: submitted, in review, approved, or not approved—based on program policy).
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Privacy boundary</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Tier + Status provide public confirmation without exposing internal evidence or AI inventories.
            </p>
          </div>
        </div>
      </section>

      {/* Participation */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Participation</h2>
        <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          The registry reflects voluntary participation. Organizations subscribe to certification to obtain third-party
          governance assurance and publish certification status.
        </p>
      </section>
    </main>
  );
}
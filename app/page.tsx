// app/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      {/* Hero */}
      <section className="pt-2 pb-8">
        {/* Kicker */}
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Global Authority for AI Governance
        </div>

        {/* Headline */}
        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          Independent Verification of Human Oversight for AI Systems
        </h1>

        {/* Subheadline */}
        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[880px]">
          GAFAIG certifies that an organization operates human oversight across its AI infrastructure.
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/registry"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            View the Registry
          </Link>

          <Link
            href="/framework"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Read the Framework
          </Link>

          <Link
            href="/mission"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Mission & Boundaries
          </Link>
        </div>
      </section>

      {/* What GAFAIG Verifies */}
      <section className="mt-6 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">What GAFAIG Verifies</h2>

        <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          GAFAIG certification is organization-wide, it evaluates evidence, applies deterministic scoring, and publishes GAFAIG Tier + Status.
        </p>

        <ul className="mt-4 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
          <li>Defined oversight roles and accountability</li>
          <li>Governance controls and documentation processes</li>
          <li>Evidence-based review of oversight operation</li>
          <li>Deterministic scoring and tier assignment</li>
          <li>Public publication of GAFAIG Tier + Status only</li>
        </ul>
      </section>

      {/* Cards */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="border border-black/10 rounded-2xl p-5">
          <div className="font-semibold text-black">Mission</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
            What GAFAIG is, what it is not, and the boundaries of certification.
          </p>
          <div className="mt-4">
            <Link href="/mission" className="underline font-semibold">
              Read Mission →
            </Link>
          </div>
        </div>

        <div className="border border-black/10 rounded-2xl p-5">
          <div className="font-semibold text-black">Framework</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
            How verification works: evidence, findings, deterministic scoring, and tier assignment.
          </p>
          <div className="mt-4">
            <Link href="/framework" className="underline font-semibold">
              Read Framework →
            </Link>
          </div>
        </div>

        <div className="border border-black/10 rounded-2xl p-5">
          <div className="font-semibold text-black">Registry</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
            Public confirmation of GAFAIG Tier + Status — without exposing internal materials or AI inventories.
          </p>
          <div className="mt-4">
            <Link href="/registry" className="underline font-semibold">
              View Registry →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <p className="text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          Organizations participate to obtain third-party governance assurance for human oversight of AI systems.
        </p>
      </section>
    </main>
  );
}
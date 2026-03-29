import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="DEMO"
        title="See how GAFAIG works in practice"
        description="This walkthrough shows how GAFAIG moves from private review to public certification. You’ll see how organizations are evaluated, how decisions are made, and how results appear in the registry and explorer."
        secondaryDescription="The process begins in a controlled reviewer environment and ends with public certification outcomes. Internal materials remain private, while results are published for others to verify."
        actions={
          <>
            <Link
              href="/admin/login"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Start the demo
            </Link>

            <Link
              href="/registry"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              View the registry
            </Link>

            <Link
              href="/explorer"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open the explorer
            </Link>
          </>
        }
      />

      {/* OVERVIEW */}
      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <ValueCard
          label="What this is"
          title="Governance verification"
          body="GAFAIG verifies whether human oversight is working across an organization’s AI systems."
        />
        <ValueCard
          label="Where it happens"
          title="Private review"
          body="All evaluation activity takes place in a controlled environment that is separate from the public site."
        />
        <ValueCard
          label="System of record"
          title="Structured data"
          body="All activity is recorded in a structured system that supports consistency and traceability."
        />
        <ValueCard
          label="What becomes public"
          title="Registry & explorer"
          body="Only certification outcomes are published, allowing others to view and verify results."
        />
      </section>

      {/* WALKTHROUGH */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WALKTHROUGH
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Follow the full process step by step
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-black/70">
          This walkthrough follows the same path every organization goes through,
          from review to certification and public visibility.
        </p>

        <div className="mt-8 grid gap-4">
          <StepRow
            step="Step 1"
            title="Open the reviewer environment"
            body="Access the controlled review layer where evaluation work takes place. This area is not public."
            href="/admin/login"
            cta="Open reviewer access"
          />

          <StepRow
            step="Step 2"
            title="Review applications and evidence"
            body="View how organizations submit information and how governance materials are structured and assessed."
            href="/admin/applications"
            cta="Open applications"
          />

          <StepRow
            step="Step 3"
            title="View certification outcomes"
            body="See how certification results are published in the registry without exposing internal evidence."
            href="/registry"
            cta="Open registry"
          />

          <StepRow
            step="Step 4"
            title="Explore global visibility"
            body="Use the explorer to see organizations, systems, and countries across the GAFAIG network."
            href="/explorer"
            cta="Open explorer"
          />
        </div>
      </section>

      {/* 🔥 LIVE DEMO RECORD (NEW) */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          LIVE DEMO RECORD
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          See a real certification
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-black/70">
          This is a real GAFAIG certification generated through the full verification process.
          You can open the public record, inspect the verification payload, and view the badge.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/registry/GAFAIG-4ce7c7a28d1b4894a5d2c23050875e29"
            className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Registry Record
            </div>
            <div className="mt-2 text-[18px] font-semibold text-black">
              View certification
            </div>
            <p className="mt-2 text-[14px] text-black/70">
              Open the public certification record in the registry.
            </p>
          </Link>

          <Link
            href="/api/verify/GAFAIG-4ce7c7a28d1b4894a5d2c23050875e29"
            className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Verification Proof
            </div>
            <div className="mt-2 text-[18px] font-semibold text-black">
              View signed payload
            </div>
            <p className="mt-2 text-[14px] text-black/70">
              Inspect the cryptographic verification response.
            </p>
          </Link>

          <Link
            href="/badge/GAFAIG-4ce7c7a28d1b4894a5d2c23050875e29"
            className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Certification Badge
            </div>
            <div className="mt-2 text-[18px] font-semibold text-black">
              View badge
            </div>
            <p className="mt-2 text-[14px] text-black/70">
              Open the embeddable certification badge.
            </p>
          </Link>
        </div>
      </section>

      {/* QUICK STORY */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          QUICK OVERVIEW
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          A one-minute walkthrough
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <TalkCard time="0:00–0:15" title="What GAFAIG does" body="GAFAIG provides a structured way to verify that AI systems are governed responsibly." />
          <TalkCard time="0:15–0:30" title="Private review" body="All evaluation work takes place in a controlled environment separate from the public site." />
          <TalkCard time="0:30–0:45" title="Structured evaluation" body="Evidence is reviewed, findings are recorded, and certification decisions are made in a consistent way." />
          <TalkCard time="0:45–1:00" title="Public results" body="Certification outcomes are published in the registry and explorer for others to view and verify." />
        </div>
      </section>
    </main>
  );
}

/* COMPONENTS */

function ValueCard({ label, title, body }: any) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">{label}</div>
      <div className="mt-3 text-[20px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] text-black/70">{body}</p>
    </div>
  );
}

function StepRow({ step, title, body, href, cta }: any) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-5 md:flex-row md:items-center md:justify-between">
      
      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-black/45">
          {step}
        </div>

        <div className="mt-2 text-[18px] font-semibold text-black">
          {title}
        </div>

        <p className="mt-2 text-[14px] text-black/70 max-w-[520px]">
          {body}
        </p>
      </div>

      <Link
        href={href}
        className="
          inline-flex items-center justify-center
          h-[42px] px-5
          rounded-full
          border border-black
          text-sm font-semibold text-black
          whitespace-nowrap
          transition
          hover:bg-black hover:text-white
        "
      >
        {cta}
      </Link>
    </div>
  );
}

function TalkCard({ time, title, body }: any) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[11px] uppercase text-black/45">{time}</div>
      <div className="mt-2 text-[18px] font-semibold">{title}</div>
      <p className="mt-3 text-[14px] text-black/70">{body}</p>
    </div>
  );
}
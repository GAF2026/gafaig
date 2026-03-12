import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function DemoScriptPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="DEMO SCRIPT"
        title="The final 60-second GAFAIG walkthrough"
        description="This is the clean version to use with judges, investors, and technical evaluators. It explains the problem, shows the private reviewer layer, demonstrates the Snowflake-backed verification workflow, and finishes on the public trust layer."
        actions={
          <>
            <Link
              href="/demo"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Back to demo
            </Link>
            <Link
              href="/admin/login"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Start walkthrough
            </Link>
          </>
        }
      />

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          FINAL SCRIPT
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          A simple five-step walkthrough
        </h2>

        <div className="mt-8 space-y-6">
          <ScriptBlock
            number="1"
            page="/demo"
            title="Open on the demo page"
            say="AI is being deployed globally, but there is no infrastructure that verifies whether AI systems actually follow governance standards. GAFAIG solves this by operating as a global governance registry and verification engine for AI systems."
          />

          <ScriptBlock
            number="2"
            page="/admin/login"
            title="Show the private reviewer layer"
            say="First, this is the private reviewer environment. It is controlled, separate from the public registry, and designed for evaluators, auditors, and regulators."
          />

          <ScriptBlock
            number="3"
            page="/admin/applications"
            title="Open the Snowflake-backed workflow"
            say="Here we see the Snowflake-backed verification workflow. Organizations submit application records, reviewers evaluate evidence and governance controls, and the system produces structured certification outcomes."
          />

          <ScriptBlock
            number="4"
            page="/registry"
            title="Move to the public registry"
            say="Once verification is complete, certified outcomes are surfaced in the public registry. This creates a transparent trust layer without exposing private reviewer materials."
          />

          <ScriptBlock
            number="5"
            page="/explorer/map"
            title="Finish on the explorer map"
            say="The explorer shows the global footprint of certified organizations and disclosed AI systems. GAFAIG turns governance verification into visible trust infrastructure."
          />
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <ScoreCard
          title="What judges should understand"
          items={[
            "This is not just a registry page; it is a verification system.",
            "The private reviewer layer is structurally separate from the public layer.",
            "Snowflake is being used as operational trust infrastructure.",
            "Public certification disclosures are controlled and queryable.",
          ]}
        />
        <ScoreCard
          title="What investors should understand"
          items={[
            "GAFAIG solves a real infrastructure gap in AI governance.",
            "The platform supports institutions, regulators, and enterprises.",
            "The registry layer becomes a global trust surface.",
            "The model can scale across countries, organizations, and AI systems.",
          ]}
        />
      </section>
    </main>
  );
}

function ScriptBlock({
  number,
  page,
  title,
  say,
}: {
  number: string;
  page: string;
  title: string;
  say: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
            Step {number}
          </div>
          <div className="mt-2 text-[20px] font-semibold text-black">
            {title}
          </div>
        </div>

        <div className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-black/60">
          {page}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
          Say
        </div>
        <p className="mt-2 text-[15px] leading-[1.85] text-black/80">{say}</p>
      </div>
    </div>
  );
}

function ScoreCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-[20px] font-semibold text-black">{title}</div>
      <ul className="mt-4 space-y-3 text-[14px] leading-[1.8] text-black/70">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
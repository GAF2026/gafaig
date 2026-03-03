// app/demo-script/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export const metadata = {
  title: "GAFAIG — Demo Script",
  description: "60-second Snowflake Challenge demo walkthrough for GAFAIG.",
};

export default function DemoScriptPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      {/* Hero */}
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Demo Script
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          A tight, repeatable walkthrough for the Snowflake Challenge
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[880px]">
          Designed to be read aloud while clicking through the live site. This script focuses on the
          verification workflow and the publishable Tier + Status outcome.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/demo"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            Open Demo
          </Link>

          <Link
            href="/admin/login"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Admin Login
          </Link>

          <Link
            href="/registry"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Registry
          </Link>
        </div>
      </section>

      {/* Setup */}
      <section className="mt-6 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Setup (10 seconds)</h2>

        <div className="mt-4 border border-black/10 rounded-2xl p-5 space-y-2">
          <p className="text-[15px] leading-[1.7] text-black/80">
            1) Open <span className="font-mono text-[14px]">/demo</span> and click{" "}
            <span className="font-semibold">Start Demo (CASE-0001)</span>.
          </p>
          <p className="text-[15px] leading-[1.7] text-black/80">
            2) You’ll land in the reviewer workflow:{" "}
            <span className="font-mono text-[14px]">/admin/verification/CASE-0001/evidence</span>.
          </p>
          <p className="text-[15px] leading-[1.7] text-black/80">
            (If prompted) enable demo access via{" "}
            <span className="font-mono text-[14px]">/admin/login</span>.
          </p>
        </div>
      </section>

      {/* 60-second talk track */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">60-second talk track</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-black/60">
              0:00–0:15
            </div>
            <div className="mt-2 font-semibold text-black">What GAFAIG is</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              “GAFAIG is governance assurance infrastructure for AI. We verify human oversight using a
              deterministic, evidence-based workflow that produces a publishable Tier + Status outcome.”
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-black/60">
              0:15–0:35
            </div>
            <div className="mt-2 font-semibold text-black">Evidence → Findings</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              “Here’s a case. Evidence items are structured records—policies, artifacts, and links—captured
              with metadata. Reviewers map evidence to requirements and record findings with rationale.”
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-black/60">
              0:35–0:50
            </div>
            <div className="mt-2 font-semibold text-black">Deterministic scoring</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              “Snowflake is our system of record. Scoring is reproducible: the same evidence and findings
              produce the same score and Tier. This creates a comparable governance signal.”
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-black/60">
              0:50–1:00
            </div>
            <div className="mt-2 font-semibold text-black">Publish to registry</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              “When approved, we publish a snapshot to the public registry. Tier + Status are public,
              while internal evidence remains private for authorized review.”
            </p>
          </div>
        </div>
      </section>

      {/* Click path */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Click path (exact order)</h2>

        <div className="mt-4 border border-black/10 rounded-2xl p-5">
          <ol className="list-decimal pl-5 space-y-2 text-[15px] leading-[1.7] text-black/80">
            <li>
              <span className="font-mono text-[14px]">/demo</span> →{" "}
              <span className="font-semibold">Start Demo (CASE-0001)</span>
            </li>
            <li>
              <span className="font-mono text-[14px]">/admin/verification/CASE-0001/evidence</span>{" "}
              (show evidence list)
            </li>
            <li>
              <span className="font-mono text-[14px]">/admin/verification/CASE-0001/findings</span>{" "}
              (show findings)
            </li>
            <li>
              <span className="font-mono text-[14px]">/admin/verification/CASE-0001/score</span>{" "}
              (show score/tier/band)
            </li>
            <li>
              <span className="font-mono text-[14px]">/registry</span> (show public view)
            </li>
          </ol>
        </div>
      </section>

      {/* Snowflake bullets */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Snowflake usage (1 slide worth)</h2>

        <ul className="mt-4 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
          <li>
            Snowflake stores the verification record: cases, evidence, findings, decisions, and publish snapshots.
          </li>
          <li>
            Deterministic SQL logic produces consistent scores and Tier outcomes (auditable + reproducible).
          </li>
          <li>
            Role-based access patterns support private verification vs. public registry disclosure.
          </li>
        </ul>
      </section>
    </main>
  );
}
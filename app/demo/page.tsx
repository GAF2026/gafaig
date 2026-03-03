// app/demo/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      {/* Hero */}
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Demo
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          A walkthrough of GAFAIG’s verification workflow
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[880px]">
          This demo shows how evidence, findings, deterministic scoring, and decisions produce a publishable
          Tier + Status outcome—backed by Snowflake as the system of record.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/demo-script"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Open Demo Script
          </Link>

          <Link
            href="/registry"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            View Registry
          </Link>

          <Link
            href="/admin/login"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            Admin Demo Login
          </Link>
        </div>
      </section>

      {/* Public vs. private layers */}
      <section className="mt-6 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Public vs. private layers</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Public Registry</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              The public view of certification outcomes. The registry publishes Tier + Status only.
            </p>
            <div className="mt-4">
              <Link href="/registry" className="underline font-semibold">
                Open the Registry →
              </Link>
            </div>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Private Verification</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Evidence, findings, scoring, and decisions—restricted to authorized reviewers.
            </p>
            <div className="mt-4">
              <Link href="/admin/login" className="underline font-semibold">
                Open the Admin demo login →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviewer workflow */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Reviewer workflow</h2>
        <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          Use the Admin demo cookie to enter the reviewer interface. Then follow the workflow in order:
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">1) Enable demo access</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Visit the Admin login page and click “Enable demo access” to set the short-lived demo cookie.
            </p>
            <div className="mt-4">
              <Link href="/admin/login" className="underline font-semibold">
                /admin/login →
              </Link>
            </div>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">2) Review applications</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Applications load from Snowflake-backed views and support filtering and paging.
            </p>
            <div className="mt-4">
              <Link href="/admin/applications" className="underline font-semibold">
                /admin/applications →
              </Link>
            </div>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">3) Open a verification case</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Evidence, findings, scoring, decisions, and summaries live under a case.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/admin/verification" className="underline font-semibold">
                /admin/verification →
              </Link>
              <Link href="/admin/verification/CASE-0001/evidence" className="underline font-semibold">
                CASE-0001 evidence →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What to look for */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">What to look for</h2>

        <ul className="mt-4 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
          <li>Evidence records captured with structured metadata</li>
          <li>Findings mapped to controls with rationale</li>
          <li>Deterministic scoring and a recorded decision</li>
          <li>Summaries generated for consistent reporting</li>
        </ul>
      </section>
    </main>
  );
}
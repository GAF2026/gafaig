// app/demo/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

const PUBLIC_DEMO_PASSWORD =
  "EfIV8wh3rinU1uO7ZLjbNlsyaUn4Ovr9zkZH6DfdvRfyGNc7WckN1Xrk5UlTHbCn";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      {/* Hero */}
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Demo
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          A guided walkthrough of GAFAIG’s verification workflow
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[920px]">
          This demo shows how GAFAIG separates a private verification layer from a public registry layer.
          Snowflake serves as the system of record for application intake, structured review data, and
          publishable governance outcomes.
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
            Start Admin Demo
          </Link>
        </div>
      </section>

      {/* Public password */}
      <section className="mt-6 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Public evaluator password</h2>

        <div className="mt-4 border border-black/10 rounded-2xl p-5 bg-black/[0.02]">
          <p className="text-[15px] leading-[1.7] text-black/80">
            For the Snowflake Challenge walkthrough, use this public demo password on the admin login page:
          </p>

          <div className="mt-4 break-all font-mono text-[13px] text-black">
            {PUBLIC_DEMO_PASSWORD}
          </div>

          <div className="mt-4 text-[13px] text-black/55">
            Admin login: <span className="font-mono">/admin/login</span>
          </div>
        </div>
      </section>

      {/* What the evaluator should do */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Recommended evaluator path</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">1) Understand the trust model</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Start with the public explanation of how GAFAIG separates private verification from public
              disclosure.
            </p>
            <div className="mt-4">
              <Link href="/demo-script" className="underline font-semibold">
                Open the demo script →
              </Link>
            </div>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">2) View the public outcome</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              The registry shows the public-facing trust signal: verification status, tier, and related
              outcome data.
            </p>
            <div className="mt-4">
              <Link href="/registry" className="underline font-semibold">
                Open the registry →
              </Link>
            </div>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">3) Enter the private reviewer workflow</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Use the public demo password to access the Snowflake-backed admin side of the platform and
              review application records.
            </p>
            <div className="mt-4">
              <Link href="/admin/login" className="underline font-semibold">
                Open admin demo login →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Public vs private */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Public vs. private layers</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Public Registry</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              The public layer publishes controlled disclosures such as verification status and tier-level
              outcomes. Sensitive internal review material is not exposed publicly.
            </p>
            <div className="mt-4">
              <Link href="/registry" className="underline font-semibold">
                Open the registry →
              </Link>
            </div>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Private Verification</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              The private layer supports reviewer access to application intake, evidence, findings, scoring,
              and verification decisions under controlled access.
            </p>
            <div className="mt-4">
              <Link href="/admin/login" className="underline font-semibold">
                Open the admin demo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Working admin flow */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Working demo flow</h2>
        <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          The current demo path is designed to be simple, reliable, and easy for an evaluator to follow.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">1) Admin login</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Use the public demo password and enable access to the private admin area.
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
              Application records load from Snowflake-backed views and demonstrate the private operational
              side of the platform.
            </p>
            <div className="mt-4">
              <Link href="/admin/applications" className="underline font-semibold">
                /admin/applications →
              </Link>
            </div>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">3) Continue into case review</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Deeper reviewer routes can be used to show evidence, findings, scoring, and decisions as the
              demo expands.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/admin/verification" className="underline font-semibold">
                /admin/verification →
              </Link>
              <Link href="/admin/verification/CASE-0001/score" className="underline font-semibold">
                CASE-0001 score →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What the demo proves */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">What this demo proves</h2>

        <ul className="mt-4 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
          <li>GAFAIG supports a controlled reviewer workflow for AI governance verification</li>
          <li>Snowflake is used as the system of record for admin-side verification data</li>
          <li>Public trust signals can be separated from private review data</li>
          <li>Application intake and reviewer operations can be demonstrated through a live web interface</li>
        </ul>
      </section>
    </main>
  );
}
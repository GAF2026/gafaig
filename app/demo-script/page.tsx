// app/demo-script/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export const metadata = {
  title: "GAFAIG — Demo Script",
  description: "Snowflake Challenge walkthrough for GAFAIG.",
};

const PUBLIC_DEMO_PASSWORD =
  "EfIV8wh3rinU1uO7ZLjbNlsyaUn4Ovr9zkZH6DfdvRfyGNc7WckN1Xrk5UlTHbCn";

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

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[920px]">
          This script is designed to be followed by an evaluator or read aloud during a short live demo.
          It keeps the path simple: explain the trust model, enter the private reviewer environment, show
          Snowflake-backed application intake, and return to the public registry outcome.
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

      {/* Public password */}
      <section className="mt-6 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Public evaluator password</h2>

        <div className="mt-4 border border-black/10 rounded-2xl p-5 bg-black/[0.02]">
          <p className="text-[15px] leading-[1.7] text-black/80">
            Use this public demo password at <span className="font-mono text-[14px]">/admin/login</span>:
          </p>

          <div className="mt-4 break-all font-mono text-[13px] text-black">
            {PUBLIC_DEMO_PASSWORD}
          </div>
        </div>
      </section>

      {/* Setup */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Setup</h2>

        <div className="mt-4 border border-black/10 rounded-2xl p-5 space-y-3">
          <p className="text-[15px] leading-[1.7] text-black/80">
            1) Open <span className="font-mono text-[14px]">/demo</span> to frame the platform for the evaluator.
          </p>
          <p className="text-[15px] leading-[1.7] text-black/80">
            2) Open <span className="font-mono text-[14px]">/admin/login</span> and enter the public demo
            password shown above.
          </p>
          <p className="text-[15px] leading-[1.7] text-black/80">
            3) After login, continue to{" "}
            <span className="font-mono text-[14px]">/admin/applications</span> to show Snowflake-backed
            application records.
          </p>
          <p className="text-[15px] leading-[1.7] text-black/80">
            4) Finish on <span className="font-mono text-[14px]">/registry</span> to show the public trust layer.
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
              “GAFAIG is governance assurance infrastructure for AI. It separates a private verification layer
              from a public registry layer, so sensitive review data stays controlled while trust outcomes can
              be disclosed publicly.”
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-black/60">
              0:15–0:30
            </div>
            <div className="mt-2 font-semibold text-black">Reviewer environment</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              “This admin login opens the private reviewer workflow. It is intentionally separate from the
              public site and uses a controlled demo access path for evaluation.”
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-black/60">
              0:30–0:45
            </div>
            <div className="mt-2 font-semibold text-black">Snowflake-backed operations</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              “Here the platform loads application records from Snowflake-backed views. Snowflake is the
              system of record for intake, verification workflow data, and structured governance outcomes.”
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-black/60">
              0:45–1:00
            </div>
            <div className="mt-2 font-semibold text-black">Public trust signal</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              “The public registry is where controlled disclosures appear. That creates a transparent trust
              layer without exposing internal evidence or reviewer-only material.”
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
              <span className="font-mono text-[14px]">/demo</span> — explain the private verification layer
              and public registry layer
            </li>
            <li>
              <span className="font-mono text-[14px]">/admin/login</span> — enter the public demo password and
              enable reviewer access
            </li>
            <li>
              <span className="font-mono text-[14px]">/admin/applications</span> — show Snowflake-backed
              application intake records
            </li>
            <li>
              <span className="font-mono text-[14px]">/admin/verification</span> — optional deeper reviewer
              workflow surface
            </li>
            <li>
              <span className="font-mono text-[14px]">/registry</span> — return to the public trust layer
            </li>
          </ol>
        </div>
      </section>

      {/* What the evaluator should notice */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">What the evaluator should notice</h2>

        <ul className="mt-4 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
          <li>The public site and reviewer workflow are intentionally separated</li>
          <li>Admin-side application records load from Snowflake-backed views</li>
          <li>GAFAIG is structured as trust infrastructure, not just a dashboard</li>
          <li>Public registry disclosures can be shown without exposing private review data</li>
        </ul>
      </section>

      {/* Snowflake bullets */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Snowflake usage</h2>

        <ul className="mt-4 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
          <li>Snowflake serves as the system of record for application intake and verification operations</li>
          <li>Snowflake-backed views drive admin-side data presentation in the reviewer workflow</li>
          <li>Deterministic governance logic can be applied consistently across verification records</li>
          <li>Private operational data can remain controlled while public trust outcomes are disclosed separately</li>
        </ul>
      </section>
    </main>
  );
}
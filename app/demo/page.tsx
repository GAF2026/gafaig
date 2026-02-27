import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Demo</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          This demo shows GAFAIG’s evidence-based verification workflow and how it produces publishable,
          auditable outcomes—backed by Snowflake as the system of record.
        </p>
      </header>

      <section className="mt-12 space-y-10">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Public vs. private layers</h2>
          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Public Registry</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                The public view of participation status and outcomes.
              </p>
              <div className="mt-3">
                <Link className="text-sm underline" href="/registry">
                  Open the Registry →
                </Link>
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">Private Verification</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence, findings, scoring, and decisions—restricted to authorized reviewers.
              </p>
              <div className="mt-3">
                <Link className="text-sm underline" href="/admin/login">
                  Open the Admin demo login →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Reviewer workflow</h2>
          <p className="text-sm text-gray-600">
            Use the Admin demo cookie to enter the reviewer interface. Then follow the workflow in order:
          </p>

          <div className="mt-4 grid gap-4">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">1) Enable demo access</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Visit the Admin login page and click “Enable demo access” to set the short-lived demo cookie.
              </p>
              <div className="mt-3">
                <Link className="text-sm underline" href="/admin/login">
                  /admin/login →
                </Link>
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">2) Review Applications</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Applications load from Snowflake-backed views and support filtering and paging.
              </p>
              <div className="mt-3">
                <Link className="text-sm underline" href="/admin/applications">
                  /admin/applications →
                </Link>
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold">3) Open a verification case</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                Evidence, findings, scoring, decisions, and summaries live under a case.
              </p>
              <div className="mt-3 flex flex-wrap gap-4">
                <Link className="text-sm underline" href="/admin/verification">
                  /admin/verification →
                </Link>
                <Link className="text-sm underline" href="/admin/verification/CASE-0001/evidence">
                  CASE-0001 evidence →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What to look for</h2>
          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Evidence records captured with metadata</li>
            <li>Findings mapped to controls with rationale</li>
            <li>Deterministic scoring and a recorded decision</li>
            <li>Summaries generated for consistent reporting</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
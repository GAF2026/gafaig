// app/demo-script/page.tsx
import Link from "next/link";

export const metadata = {
  title: "GAFAIG — Demo Script",
  description: "60-second Snowflake Challenge demo walkthrough for GAFAIG.",
};

export default function DemoScriptPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Demo Script</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          A tight, repeatable walkthrough for the Snowflake Challenge. This is designed to be read aloud while
          clicking through the live site.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90"
          >
            Open Demo
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2.5 text-sm font-semibold hover:bg-black/[0.04]"
          >
            Admin Login
          </Link>
          <Link
            href="/registry"
            className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2.5 text-sm font-semibold hover:bg-black/[0.04]"
          >
            Registry
          </Link>
        </div>
      </header>

      <section className="mt-12 space-y-10">
        {/* Setup */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Setup (10 seconds)</h2>
          <div className="rounded-xl border p-5 space-y-2">
            <p className="text-sm text-gray-700 leading-relaxed">
              1) Open <span className="font-mono">/demo</span> and click <b>Start Demo (CASE-0001)</b>.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              2) You’ll land in the reviewer workflow: <span className="font-mono">/admin/verification/CASE-0001/evidence</span>.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              (If prompted) enable demo access via <span className="font-mono">/admin/login</span>.
            </p>
          </div>
        </div>

        {/* 60-second talk track */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">60-second talk track</h2>

          <div className="grid gap-4">
            <div className="rounded-xl border p-5">
              <div className="text-xs font-semibold text-gray-600">0:00–0:15</div>
              <h3 className="mt-2 font-semibold">What GAFAIG is</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                “GAFAIG is governance assurance infrastructure for AI. We make Human AI oversight measurable with a
                deterministic, evidence-based verification workflow.”
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="text-xs font-semibold text-gray-600">0:15–0:35</div>
              <h3 className="mt-2 font-semibold">Evidence → Findings</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                “Here’s a case. Evidence items are structured records—links, policies, artifacts—captured with metadata.
                Reviewers map evidence to requirements, producing findings with written rationale.”
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="text-xs font-semibold text-gray-600">0:35–0:50</div>
              <h3 className="mt-2 font-semibold">Deterministic scoring</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                “Snowflake is our system of record. Scoring is reproducible: the same evidence and findings generate the
                same tier/band outcome. This creates a comparable governance signal.”
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="text-xs font-semibold text-gray-600">0:50–1:00</div>
              <h3 className="mt-2 font-semibold">Publish to Registry</h3>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                “When approved, we publish a snapshot to the public registry. The registry is transparent, while sensitive
                evidence remains private for authorized review.”
              </p>
            </div>
          </div>
        </div>

        {/* Click path */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Click path (exact order)</h2>
          <div className="rounded-xl border p-5">
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-mono">/demo</span> → <b>Start Demo (CASE-0001)</b>
              </li>
              <li>
                <span className="font-mono">/admin/verification/CASE-0001/evidence</span> (show evidence list)
              </li>
              <li>
                <span className="font-mono">/admin/verification/CASE-0001/findings</span> (show findings)
              </li>
              <li>
                <span className="font-mono">/admin/verification/CASE-0001/score</span> (show score/tier/band)
              </li>
              <li>
                <span className="font-mono">/registry</span> (show public view)
              </li>
            </ol>
          </div>
        </div>

        {/* Snowflake bullets */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Snowflake usage (1 slide worth)</h2>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-2">
            <li>Snowflake stores the verification record: cases, evidence, findings, decisions, and publish snapshots.</li>
            <li>Deterministic SQL logic produces consistent scores and tier/band outcomes (auditable + reproducible).</li>
            <li>Role-based access patterns support private verification vs. public registry disclosure.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
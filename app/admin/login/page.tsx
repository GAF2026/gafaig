"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoPassword = useMemo(
    () =>
      process.env.NEXT_PUBLIC_DEMO_PASSWORD ??
      "Use the configured public evaluator password",
    []
  );

  async function enableAccess() {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Unable to enable reviewer access");
        return;
      }

      router.push("/admin/applications");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Unexpected client error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8 rounded-3xl border border-black/10 bg-white p-6 md:p-8">
          <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Demo walkthrough
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Reviewer access
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            This step demonstrates that GAFAIG has a controlled reviewer layer
            separate from the public registry. After access is enabled, continue
            into the Snowflake-backed applications workflow.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Back to demo
            </Link>
            <Link
              href="/registry"
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
            >
              Skip to public registry
            </Link>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
            <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Reviewer access
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Enable demo access
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
              Use the evaluator password below, then continue to the
              applications page.
            </p>

            <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Public evaluator password
              </div>
              <div className="mt-3 break-all font-mono text-sm text-black">
                {demoPassword}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setPassword(demoPassword)}
                  className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                >
                  Use this password
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(demoPassword);
                    } catch {}
                  }}
                  className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-white"
                >
                  Copy password
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <StepCard
                step="Step 1"
                title="Use public demo credential"
                body="Paste or auto-fill the evaluator password."
              />
              <StepCard
                step="Step 2"
                title="Enable reviewer access"
                body="This sets the demo access cookie for the walkthrough."
              />
              <StepCard
                step="Step 3"
                title="Open applications"
                body="Continue into the private operational workflow."
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500"
              >
                Demo password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter evaluator password"
                className="mt-3 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-5">
              <button
                type="button"
                onClick={enableAccess}
                disabled={busy}
                className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Enabling access..." : "Continue to applications"}
              </button>
            </div>

            <p className="mt-6 text-sm leading-7 text-neutral-600">
              Successful login sets a short-lived demo cookie for evaluator
              access. This is for the walkthrough only and should be rotated or
              removed after judging is complete.
            </p>
          </section>

          <aside className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
            <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Why this matters
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Private layer proof
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-700">
              This page exists to show that GAFAIG maintains a private reviewer
              environment distinct from the public trust layer.
            </p>

            <div className="mt-6 space-y-3">
              <InfoBox text="Reviewer access is controlled." />
              <InfoBox text="Operational workflow is separate from public certification pages." />
              <InfoBox text="The next step is the Snowflake-backed applications view." />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StepCard({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
        {step}
      </div>
      <div className="mt-3 text-lg font-semibold text-black">{title}</div>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{body}</p>
    </div>
  );
}

function InfoBox({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 px-4 py-4 text-sm leading-6 text-neutral-700">
      {text}
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicPageHero from "../../_components/PublicPageHero";

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
        setError(data?.error || "Unable to enable demo access");
        return;
      }

      router.push("/admin/applications");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  function usePassword() {
    setPassword(demoPassword);
    setError(null);
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(demoPassword);
    } catch {
      // ignore clipboard failures
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="DEMO WALKTHROUGH"
        title="Reviewer access"
        description="This step demonstrates that GAFAIG has a controlled reviewer layer separate from the public registry. After access is enabled, continue into the Snowflake-backed applications workflow."
        actions={
          <>
            <Link
              href="/demo"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Back to demo
            </Link>
            <Link
              href="/registry"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Skip to public registry
            </Link>
          </>
        }
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            REVIEWER ACCESS
          </div>

          <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Enable demo access
          </h2>

          <p className="mt-5 text-[15px] leading-[1.85] text-black/70">
            Use the evaluator password below, then continue to the applications
            page.
          </p>

          <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Public evaluator password
            </div>

            <div className="mt-3 break-all font-mono text-[14px] leading-[1.8] text-black/85">
              {demoPassword}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={usePassword}
                className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
              >
                Use this password
              </button>

              <button
                type="button"
                onClick={copyPassword}
                className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/[0.04]"
              >
                Copy password
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MiniStep
              step="Step 1"
              title="Use public demo credential"
              body="Paste or auto-fill the evaluator password."
            />
            <MiniStep
              step="Step 2"
              title="Enable reviewer access"
              body="This sets the demo access cookie for the walkthrough."
            />
            <MiniStep
              step="Step 3"
              title="Open applications"
              body="Continue into the private operational workflow."
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="password"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45"
            >
              Demo password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter evaluator password"
              className="mt-3 w-full rounded-2xl border border-black/10 px-4 py-4 text-[15px] outline-none transition focus:border-black"
              autoComplete="current-password"
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
              disabled={busy || !password.trim()}
              className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Enabling access..." : "Continue to applications"}
            </button>
          </div>

          <p className="mt-6 text-[14px] leading-[1.8] text-black/60">
            Successful login sets a short-lived demo cookie for evaluator
            access. This is for the walkthrough only and should be rotated or
            removed after judging is complete.
          </p>
        </section>

        <aside className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHY THIS MATTERS
          </div>

          <h2 className="mt-4 max-w-[760px] text-[28px] font-semibold leading-[1.2] tracking-tight text-black">
            Private layer proof
          </h2>

          <p className="mt-5 text-[15px] leading-[1.85] text-black/70">
            This page exists to show that GAFAIG maintains a private reviewer
            environment distinct from the public trust layer.
          </p>

          <div className="mt-6 space-y-4">
            <InfoCard text="Reviewer access is controlled." />
            <InfoCard text="Operational workflow is separate from public certification pages." />
            <InfoCard text="The next step is the Snowflake-backed applications view." />
          </div>
        </aside>
      </div>
    </main>
  );
}

function MiniStep({
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
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {step}
      </div>
      <div className="mt-3 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-[1.8] text-black/65">{body}</p>
    </div>
  );
}

function InfoCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 p-4 text-[15px] leading-[1.8] text-black/65">
      {text}
    </div>
  );
}
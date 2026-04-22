"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";
import PublicButton from "../../_components/PublicButton";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoPassword = useMemo(
    () =>
      process.env.NEXT_PUBLIC_DEMO_PASSWORD ??
      "Use the configured evaluator credential",
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
      // ignore
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="PRIVATE VERIFICATION LAYER"
          title="Controlled reviewer access"
          description="This page demonstrates that GAFAIG maintains a private verification environment separate from the public registry. Reviewer access is required for operational workflow, while certification records remain publicly viewable through the registry."
          secondaryDescription="Use the demo evaluator credential to enter the private review layer, then continue into the Snowflake-backed applications workflow. This access exists only for the demonstration environment and is not part of the public registry experience."
          actions={
            <>
              <PublicButtonLink href="/demo" variant="secondary">
                Back to demo
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="secondary">
                View public registry
              </PublicButtonLink>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              EVALUATOR ACCESS
            </div>

            <h2 className="mt-4 text-[32px] md:text-[38px] font-semibold tracking-tight text-black">
              Enter the private review environment
            </h2>

            <p className="mt-5 text-[15px] leading-7 text-black/70">
              This step is part of the live GAFAIG walkthrough. It shows that the
              verification workflow operates in a controlled reviewer layer that
              is distinct from the public trust surface.
            </p>

            <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Demo evaluator credential
              </div>

              <div className="mt-3 break-all font-mono text-[14px] text-black/85">
                {demoPassword}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <PublicButton onClick={usePassword} variant="secondary" size="sm">
                  Use this credential
                </PublicButton>

                <PublicButton onClick={copyPassword} variant="secondary" size="sm">
                  Copy credential
                </PublicButton>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <MiniStep
                step="Step 1"
                title="Load evaluator credential"
                body="Paste or auto-fill the demo credential used for the walkthrough."
              />
              <MiniStep
                step="Step 2"
                title="Enable reviewer access"
                body="Sets a short-lived demo access cookie for the private layer."
              />
              <MiniStep
                step="Step 3"
                title="Open applications"
                body="Continue into the Snowflake-backed workflow."
              />
            </div>

            <div className="mt-6">
              <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Evaluator credential
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter evaluator credential"
                className="mt-3 w-full rounded-2xl border border-black/10 px-4 py-4 text-[15px] outline-none focus:border-black"
              />
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-5">
              <PublicButton
                onClick={enableAccess}
                disabled={busy || !password.trim()}
                variant="primary"
              >
                {busy ? "Enabling..." : "Continue to applications"}
              </PublicButton>
            </div>

            <p className="mt-6 text-[14px] text-black/60">
              This credential is limited to the demo environment. Public
              certification records remain accessible without reviewer access.
            </p>
          </section>

          <aside className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              WHY THIS MATTERS
            </div>

            <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-black">
              Proof of the private layer
            </h2>

            <p className="mt-5 text-[15px] leading-7 text-black/70">
              GAFAIG operates a two-layer model. Public certification is open,
              but verification workflow is restricted to a controlled
              environment.
            </p>

            <div className="mt-6 space-y-4">
              <InfoCard text="Reviewer access is controlled." />
              <InfoCard text="Workflow is separate from public trust surfaces." />
              <InfoCard text="Next step opens Snowflake-backed applications." />
              <InfoCard text="Registry remains publicly accessible." />
            </div>
          </aside>
        </div>
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
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-black/45">
        {step}
      </div>
      <div className="mt-3 font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] text-black/65">{body}</p>
    </div>
  );
}

function InfoCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[14px] text-black/65">
      {text}
    </div>
  );
}
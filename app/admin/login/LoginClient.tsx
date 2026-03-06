"use client";

import { useEffect, useMemo, useState } from "react";

type ApiResponse =
  | { ok: true; message?: string }
  | { ok: false; error: string; code?: string };

const PUBLIC_DEMO_PASSWORD =
  "EfIV8wh3rinU1uO7ZLjbNlsyaUn4Ovr9zkZH6DfdvRfyGNc7WckN1Xrk5UlTHbCn";

function inputClass() {
  return "w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-[14px] text-black placeholder:text-black/45 focus:outline-none focus:ring-2 focus:ring-black/10";
}

function buttonClass(variant: "primary" | "secondary" = "secondary") {
  if (variant === "primary") {
    return "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold bg-black text-white hover:bg-black/90 disabled:opacity-60";
  }
  return "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold border border-black/15 hover:bg-black/[0.04] disabled:opacity-60";
}

function safeNextPath(raw: string | null | undefined) {
  const v = String(raw || "").trim();
  if (!v) return "/admin/applications";
  if (!v.startsWith("/")) return "/admin/applications";
  if (v.startsWith("//")) return "/admin/applications";
  return v;
}

export default function LoginClient() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const nextPath = useMemo(() => {
    if (typeof window === "undefined") return "/admin/applications";
    const sp = new URLSearchParams(window.location.search);
    return safeNextPath(sp.get("next"));
  }, []);

  const canSubmit = useMemo(() => {
    return password.trim().length > 0 && status !== "submitting";
  }, [password, status]);

  async function enableDemoAccess() {
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok || !data || data.ok !== true) {
        const msg = data && "error" in data ? data.error : `Login failed (HTTP ${res.status})`;
        setStatus("error");
        setError(msg);
        return;
      }

      setStatus("ok");
      setError("");
      window.location.href = nextPath;
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Network error");
    }
  }

  function fillDemoPassword() {
    setPassword(PUBLIC_DEMO_PASSWORD);
    setError("");
  }

  function copyDemoPassword() {
    navigator.clipboard.writeText(PUBLIC_DEMO_PASSWORD).catch(() => {});
  }

  useEffect(() => {
    if (status === "error" && password.trim().length > 0) {
      setError("");
    }
  }, [password, status]);

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Admin
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          Reviewer demo access
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[920px]">
          This login provides evaluator access to GAFAIG’s private reviewer workflow. After access is enabled,
          you will enter the Snowflake-backed admin environment used to review application records and
          verification activity. Public pages never expose private review data.
        </p>
      </section>

      <section className="mt-2 border border-black/10 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="max-w-[760px]">
            <h2 className="text-[16px] font-semibold text-black">Demo login</h2>

            <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
              Enter the public demo password below, then click{" "}
              <span className="font-semibold">Enable demo access</span>. On success, you will be sent directly
              to the working admin destination below.
            </p>

            <div className="mt-4 border border-black/10 rounded-2xl p-4 bg-black/[0.02]">
              <div className="text-[12px] uppercase tracking-[0.12em] text-black/55 font-semibold">
                Public evaluator password
              </div>
              <div className="mt-2 break-all font-mono text-[13px] text-black">
                {PUBLIC_DEMO_PASSWORD}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={fillDemoPassword}
                  className={buttonClass("secondary")}
                >
                  Use this password
                </button>

                <button
                  type="button"
                  onClick={copyDemoPassword}
                  className={buttonClass("secondary")}
                >
                  Copy password
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="border border-black/10 rounded-xl p-3">
                <div className="text-[12px] uppercase tracking-[0.12em] text-black/55 font-semibold">
                  Step 1
                </div>
                <div className="mt-1 text-[14px] text-black/80">Use the public demo password</div>
              </div>

              <div className="border border-black/10 rounded-xl p-3">
                <div className="text-[12px] uppercase tracking-[0.12em] text-black/55 font-semibold">
                  Step 2
                </div>
                <div className="mt-1 text-[14px] text-black/80">Enable reviewer access</div>
              </div>

              <div className="border border-black/10 rounded-xl p-3">
                <div className="text-[12px] uppercase tracking-[0.12em] text-black/55 font-semibold">
                  Step 3
                </div>
                <div className="mt-1 text-[14px] text-black/80">Open Snowflake-backed applications</div>
              </div>
            </div>

            <div className="mt-4 text-[13px] text-black/55">
              Destination: <span className="font-mono">{nextPath}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={enableDemoAccess}
              className={buttonClass("primary")}
              disabled={!canSubmit}
            >
              {status === "submitting" ? "Enabling…" : "Enable demo access"}
            </button>
          </div>
        </div>

        <div className="mt-6 max-w-[640px]">
          <label className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60 mb-2">
            Demo password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter demo password"
            className={inputClass()}
            autoComplete="current-password"
          />

          {error ? <div className="mt-3 text-[14px] text-red-600">{error}</div> : null}

          <div className="mt-4 text-[13px] text-black/55">
            Successful login sets a short-lived <span className="font-mono">HttpOnly</span> cookie used for
            the evaluator walkthrough.
          </div>

          <div className="mt-2 text-[13px] text-black/55">
            This is a public demo credential for the challenge walkthrough only. It should be rotated or
            removed after judging is complete.
          </div>
        </div>
      </section>
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";

type ApiResponse =
  | { ok: true; message?: string }
  | { ok: false; error: string; code?: string };

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
  // Only allow internal paths
  if (!v.startsWith("/")) return "/admin/applications";
  // Prevent protocol-relative or weird redirects
  if (v.startsWith("//")) return "/admin/applications";
  return v;
}

export default function LoginClient() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [error, setError] = useState<string>("");

  const nextPath = useMemo(() => {
    if (typeof window === "undefined") return "/admin/applications";
    const sp = new URLSearchParams(window.location.search);
    return safeNextPath(sp.get("next"));
  }, []);

  const canSubmit = useMemo(
    () => password.trim().length > 0 && status !== "submitting",
    [password, status]
  );

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

      if (!res.ok || !data || (data as any).ok !== true) {
        const msg = data && "error" in data ? data.error : `Login failed (HTTP ${res.status})`;
        setStatus("error");
        setError(msg);
        return;
      }

      setStatus("ok");
      setError("");

      // ✅ Important: after cookie is set, go directly to the intended admin page.
      // (This fixes “it stays on login” and makes /admin/applications load immediately if cookie is valid.)
      window.location.href = nextPath;
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Network error");
    }
  }

  function goToAdmin() {
    window.location.href = nextPath;
  }

  // Optional: clear prior error when typing
  useEffect(() => {
    if (status === "error" && password.trim().length > 0) setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">Admin</div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          Admin access
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[920px]">
          This environment supports a demo-only admin cookie for guided walkthroughs. No private evidence is exposed on
          public pages.
        </p>
      </section>

      <section className="mt-2 border border-black/10 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-[16px] font-semibold text-black">Demo login</h2>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/70 max-w-[860px]">
              Enter the demo admin password (set in Vercel as{" "}
              <span className="font-mono">GAFAIG_ADMIN_PASSWORD</span>), then enable the cookie and open the Admin
              section.
            </p>

            <div className="mt-2 text-[13px] text-black/55">
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

            <button
              type="button"
              onClick={goToAdmin}
              className={buttonClass("secondary")}
              disabled={status !== "ok"} // prevents confusion if they haven't enabled cookie yet
            >
              Go to Admin
            </button>
          </div>
        </div>

        <div className="mt-5 max-w-[560px]">
          <label className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60 mb-2">
            Demo admin password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter GAFAIG_ADMIN_PASSWORD…"
            className={inputClass()}
            autoComplete="current-password"
          />

          {error ? <div className="mt-3 text-[14px] text-red-600">{error}</div> : null}

          <div className="mt-4 text-[13px] text-black/55">
            Note: the admin cookie is <span className="font-mono">HttpOnly</span>, so it won’t appear in{" "}
            <span className="font-mono">document.cookie</span>. That’s expected.
          </div>

          <div className="mt-2 text-[13px] text-black/55">
            If you see “Invalid password”, confirm the Vercel env var value matches exactly what you typed, then redeploy
            after saving env changes.
          </div>
        </div>
      </section>
    </main>
  );
}
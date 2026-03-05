"use client";

import { useEffect, useMemo, useState } from "react";

type ApiResponse =
  | { ok: true; demoEnabled?: boolean; message?: string }
  | { ok: false; error: string };

function buttonClass(variant: "primary" | "secondary" = "secondary") {
  if (variant === "primary") {
    return "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold bg-black text-white hover:bg-black/90";
  }
  return "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold border border-black/15 hover:bg-black/[0.04]";
}

function cardClass() {
  return "border border-black/10 rounded-2xl bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]";
}

async function postEnableDemo(): Promise<ApiResponse> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mode: "demo" }),
      cache: "no-store",
    });

    const json = (await res.json()) as any;
    if (!json || typeof json.ok !== "boolean") {
      return { ok: false, error: `Unexpected response (${res.status})` };
    }
    return json as ApiResponse;
  } catch (e: any) {
    return { ok: false, error: e?.message || "Request failed" };
  }
}

export default function LoginClient() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<
    | { kind: "idle"; text?: string }
    | { kind: "ok"; text: string }
    | { kind: "err"; text: string }
  >({ kind: "idle" });

  const statusUi = useMemo(() => {
    if (status.kind === "ok") return <span className="text-[13px] text-black/70">{status.text}</span>;
    if (status.kind === "err") return <span className="text-[13px] text-red-600">{status.text}</span>;
    return <span className="text-[13px] text-black/45">{status.text ?? "Demo access sets a short-lived admin cookie."}</span>;
  }, [status]);

  // Never block rendering on client checks; just render.
  useEffect(() => {
    // noop - reserved for future "already logged in" checks
  }, []);

  async function onEnableDemo() {
    setBusy(true);
    setStatus({ kind: "idle", text: "Enabling demo access…" });

    const r = await postEnableDemo();

    if (r.ok) {
      setStatus({ kind: "ok", text: "Demo access enabled. You can now open Admin pages." });
    } else {
      setStatus({ kind: "err", text: r.error || "Unable to enable demo access." });
    }

    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">Admin</div>
        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">Admin access</h1>
        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[920px]">
          This environment supports a demo-only admin cookie for guided walkthroughs. No private evidence is exposed on public
          pages.
        </p>
      </section>

      <section className={cardClass() + " p-6"}>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-[16px] font-semibold text-black">Demo login</h2>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/70 max-w-[760px]">
              Click the button to set a temporary admin cookie in your browser. Then open the Admin section.
            </p>
            <div className="mt-3">{statusUi}</div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className={buttonClass("primary")} onClick={onEnableDemo} disabled={busy}>
              {busy ? "Working…" : "Enable demo access"}
            </button>
            <a className={buttonClass("secondary")} href="/admin/applications">
              Go to Admin
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-black/10 pt-4 text-[13px] text-black/60 leading-[1.7]">
          If this page appears blank in production, it usually indicates a client-side error or a stale deployment. Re-deploying
          the latest commit to Vercel resolves it.
        </div>
      </section>
    </main>
  );
}
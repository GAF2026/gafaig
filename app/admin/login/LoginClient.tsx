"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * LoginClient
 * - Uses useSearchParams() safely (client component)
 * - Provides a simple "demo cookie" setter so judges can proceed quickly
 *
 * If your admin auth expects a different cookie name/value,
 * change DEFAULT_COOKIE_NAME / DEFAULT_COOKIE_VALUE below.
 */
const DEFAULT_COOKIE_NAME = "gafaig_admin";
const DEFAULT_COOKIE_VALUE = "demo";

function setCookie(name: string, value: string, days = 1) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export default function LoginClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const nextUrl = useMemo(() => {
    // support either ?next=... or ?redirect=...
    const n = sp.get("next") || sp.get("redirect") || "/admin/applications";
    // prevent open-redirects: only allow same-site paths
    return n.startsWith("/") ? n : "/admin/applications";
  }, [sp]);

  const [cookieName, setCookieName] = useState(DEFAULT_COOKIE_NAME);
  const [cookieValue, setCookieValue] = useState(DEFAULT_COOKIE_VALUE);
  const [msg, setMsg] = useState<string | null>(null);

  function onSetDemoAccess() {
    setCookie(
      cookieName.trim() || DEFAULT_COOKIE_NAME,
      cookieValue.trim() || DEFAULT_COOKIE_VALUE,
      1
    );
    setMsg("Demo access cookie set. Redirecting…");
    // small delay so cookie is written before navigation
    setTimeout(() => router.push(nextUrl), 250);
  }

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      {/* Hero */}
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Admin
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          Admin demo access
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[880px]">
          For the Snowflake demo, access is granted via a short-lived cookie. Enable demo access to
          continue to the reviewer interface.
        </p>
      </section>

      {/* Form */}
      <section className="mt-2 border border-black/10 rounded-2xl p-5 max-w-[900px]">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[13px] font-semibold text-black mb-2">
              Cookie name
            </label>
            <input
              value={cookieName}
              onChange={(e) => setCookieName(e.target.value)}
              placeholder={DEFAULT_COOKIE_NAME}
              className="w-full h-11 rounded-xl border border-black/20 px-4 text-[15px] outline-none focus:border-black/40"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-black mb-2">
              Cookie value
            </label>
            <input
              value={cookieValue}
              onChange={(e) => setCookieValue(e.target.value)}
              placeholder={DEFAULT_COOKIE_VALUE}
              className="w-full h-11 rounded-xl border border-black/20 px-4 text-[15px] outline-none focus:border-black/40"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSetDemoAccess}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            Enable demo access
          </button>

          <div className="text-[14px] text-black/70">
            Next: <code className="text-black/80">{nextUrl}</code>
          </div>
        </div>

        {msg ? (
          <div className="mt-3 text-[14px] font-semibold text-black">{msg}</div>
        ) : null}
      </section>
    </main>
  );
}
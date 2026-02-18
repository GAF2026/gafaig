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
    setCookie(cookieName.trim() || DEFAULT_COOKIE_NAME, cookieValue.trim() || DEFAULT_COOKIE_VALUE, 1);
    setMsg("Demo access cookie set. Redirecting…");
    // small delay so cookie is written before navigation
    setTimeout(() => router.push(nextUrl), 250);
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "4rem 1.25rem 4.5rem",
        lineHeight: 1.7,
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0.7,
          marginBottom: "0.75rem",
        }}
      >
        Admin Demo Access
      </div>

      <h1 style={{ fontSize: 34, lineHeight: 1.15, margin: 0 }}>GAFAIG — Admin Login</h1>

      <p style={{ marginTop: "1rem", fontSize: "1.05rem", opacity: 0.9 }}>
        For the Snowflake demo, access is granted via a short-lived cookie.
        Click below to enable demo access and continue.
      </p>

      <div
        style={{
          marginTop: "1.5rem",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 16,
          background: "white",
          padding: "1.25rem",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 8, color: "#374151" }}>
              Cookie name
            </label>
            <input
              value={cookieName}
              onChange={(e) => setCookieName(e.target.value)}
              placeholder={DEFAULT_COOKIE_NAME}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.18)",
                padding: "10px 14px",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 8, color: "#374151" }}>
              Cookie value
            </label>
            <input
              value={cookieValue}
              onChange={(e) => setCookieValue(e.target.value)}
              placeholder={DEFAULT_COOKIE_VALUE}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.18)",
                padding: "10px 14px",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onSetDemoAccess}
          style={{
            marginTop: 14,
            height: 46,
            padding: "0 16px",
            borderRadius: 12,
            border: "1px solid #000",
            background: "#000",
            color: "#fff",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Enable demo access
        </button>

        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
          Next: <code>{nextUrl}</code>
        </div>

        {msg ? (
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 900 }}>{msg}</div>
        ) : null}
      </div>
    </main>
  );
}
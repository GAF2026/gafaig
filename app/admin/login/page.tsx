"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = useMemo(() => {
    const n = searchParams.get("next");
    return n && n.startsWith("/admin") ? n : "/admin/applications";
  }, [searchParams]);

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setError(data?.error === "invalid_password" ? "Incorrect password." : "Login failed.");
        setBusy(false);
        return;
      }

      router.push(nextPath);
    } catch {
      setError("Login failed.");
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>
        Admin Login
      </h1>

      <p style={{ opacity: 0.75, marginBottom: 18 }}>
        Enter the admin password to access GAFAIG admin pages.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 13, opacity: 0.85 }}>
            Password
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              padding: "12px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              fontSize: 14,
            }}
          />
        </label>

        {error && (
          <div style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,0,0,0.35)" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy || !password}
          style={{
            padding: "12px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "white",
            fontWeight: 900,
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function enableDemo() {
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ demo: true }),
      });

      const text = await r.text();
      let j: any = null;
      try {
        j = JSON.parse(text);
      } catch {
        // ignore
      }

      if (!r.ok || !j?.ok) {
        throw new Error(j?.error || `Login failed (${r.status}): ${text}`);
      }

      router.push("/admin/applications");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to enable demo access.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={enableDemo}
        disabled={loading}
        className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90 disabled:opacity-60"
      >
        {loading ? "Enabling…" : "Enable demo access"}
      </button>

      {err ? <div className="mt-3 text-sm text-red-600">{err}</div> : null}
    </div>
  );
}
"use client";

import { useState } from "react";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";

export const dynamic = "force-dynamic";

export default function VerifyExplainerPage() {
  const [registryId, setRegistryId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerify() {
    if (!registryId) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/verify/${registryId}`);
      const data = await res.json();

      if (!data.ok) {
        throw new Error("Verification failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Error verifying");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="VERIFY"
        title="Verify a GAFAIG certification"
        description="Enter a GAFAIG registry ID to independently verify certification status using the public verification endpoint and signed proof layer."
        secondaryDescription="Verification does not rely on UI or claims. It is based on a deterministic record, signed proof, and public key validation."
        actions={
          <>
            <PublicButtonLink href="/registry" variant="primary">
              Browse Registry
            </PublicButtonLink>

            <PublicButtonLink
              href="/api/.well-known/gafaig-public-key"
              variant="secondary"
            >
              Public Key
            </PublicButtonLink>
          </>
        }
      />

      {/* 🔥 NEW: LIVE VERIFY CONSOLE */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          VERIFY LIVE
        </div>

        <h2 className="mt-4 text-[32px] font-semibold tracking-tight">
          Check a certification in real time
        </h2>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <input
            value={registryId}
            onChange={(e) => setRegistryId(e.target.value.toUpperCase())}
            placeholder="Enter GAFAIG-XXXXXXXX"
            className="flex-1 rounded-full border border-black/20 px-5 py-3 text-sm"
          />

          <button
            onClick={handleVerify}
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600">{error}</div>
        )}

        {result && (
          <div className="mt-6 rounded-2xl border border-black/10 p-6">
            <div className="text-lg font-semibold">
              {result.verified ? "Verified ✅" : "Not Verified ❌"}
            </div>

            <div className="mt-3 text-sm text-black/70">
              Registry ID: {result.registryId}
            </div>

            <pre className="mt-4 overflow-auto rounded-lg bg-black p-4 text-xs text-white">
              {JSON.stringify(result.record, null, 2)}
            </pre>

            <pre className="mt-4 overflow-auto rounded-lg bg-black p-4 text-xs text-white">
              {JSON.stringify(result.proof, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* KEEP YOUR ENTIRE EXISTING PAGE BELOW EXACTLY AS IS */}

      {/* 👇 DO NOT DELETE — your existing sections remain unchanged */}
    </main>
  );
}
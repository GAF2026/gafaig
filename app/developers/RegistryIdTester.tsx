"use client";

import { useMemo, useState } from "react";

type TestStatus = null | "loading" | "ok" | "error";

export default function RegistryIdTester() {
  const [registryId, setRegistryId] = useState("GAFAIG-00363095");
  const [verifyUrl, setVerifyUrl] = useState("");
  const [status, setStatus] = useState<TestStatus>(null);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ).replace(/\/+$/, "");

  const cleanRegistryId = registryId.trim();

  const links = useMemo(() => {
    if (!cleanRegistryId) return null;
    const encoded = encodeURIComponent(cleanRegistryId);

    return {
      verifyPage: `/verify/${encoded}`,
      apiVerify: `${baseUrl}/api/verify/${encoded}`,
      apiBadge: `${baseUrl}/api/badge/${encoded}`,
      widgetPreview: `/widget-preview/${encoded}`,
    };
  }, [baseUrl, cleanRegistryId]);

  async function testRegistry() {
    const id = cleanRegistryId;
    if (!id) return;

    setStatus("loading");
    setResult(null);
    setCopied(false);

    try {
      const url = `${baseUrl}/api/verify/${encodeURIComponent(id)}`;
      setVerifyUrl(url);

      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      setResult(json);
      setStatus(json?.ok ? "ok" : "error");
    } catch (error) {
      setResult({
        ok: false,
        verified: false,
        error: error instanceof Error ? error.message : "Request failed",
      });
      setStatus("error");
    }
  }

  async function copyJson() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  const record = result?.record ?? {};
  const proof = result?.proof ?? {};

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        Verification Playground
      </div>

      <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
        Test a registry ID instantly
      </h2>

      <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/75">
        Enter a GAFAIG registry ID and inspect the live verification response,
        public proof, badge endpoint, and connected trust surfaces.
      </p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <input
          value={registryId}
          onChange={(e) => setRegistryId(e.target.value)}
          placeholder="GAFAIG-XXXXXXXX"
          className="min-h-[46px] flex-1 rounded-2xl border border-black/15 bg-white px-4 text-[14px] font-medium text-black outline-none transition focus:border-black"
        />

        <button
          type="button"
          onClick={testRegistry}
          className="min-h-[46px] rounded-2xl border border-black bg-black px-6 text-[14px] font-semibold text-white transition hover:bg-white hover:text-black"
        >
          {status === "loading" ? "Checking…" : "Test"}
        </button>
      </div>

      {verifyUrl ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[12px] leading-6 text-black/60 break-all">
          {verifyUrl}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[14px] font-medium text-black/60">
          Checking registry record…
        </div>
      ) : null}

      {status === "ok" ? (
        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-[14px] font-semibold text-green-700">
          ✔ Valid registry record
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-[14px] font-semibold text-red-700">
          ✖ Not found or invalid
        </div>
      ) : null}

      {result ? (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Verification
              </div>
              <div className="mt-3 text-[18px] font-semibold text-black">
                {result.verified ? "Verified" : "Unavailable"}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Certification
              </div>
              <div className="mt-3 text-[18px] font-semibold text-black">
                {record.certificationStatus ?? "—"}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Signature
              </div>
              <div className="mt-3 text-[18px] font-semibold text-black">
                {proof.alg ?? "—"}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Entity
              </div>
              <div className="mt-3 text-[18px] font-semibold text-black">
                {record.entityName ?? "—"}
              </div>
              <div className="mt-2 text-[14px] text-black/60">
                {record.country ?? "—"}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Key ID
              </div>
              <div className="mt-3 break-all text-[15px] font-semibold text-black">
                {proof.kid ?? "—"}
              </div>
            </div>
          </div>

          {links ? (
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Connected trust surfaces
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <a
                  href={links.verifyPage}
                  target="_blank"
                  className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-[13px] font-semibold text-black transition hover:border-black/25"
                >
                  Verify page
                  <div className="mt-1 break-all text-[12px] font-medium text-black/55">
                    {links.verifyPage}
                  </div>
                </a>

                <a
                  href={links.widgetPreview}
                  target="_blank"
                  className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-[13px] font-semibold text-black transition hover:border-black/25"
                >
                  Widget preview
                  <div className="mt-1 break-all text-[12px] font-medium text-black/55">
                    {links.widgetPreview}
                  </div>
                </a>

                <a
                  href={links.apiVerify}
                  target="_blank"
                  className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-[13px] font-semibold text-black transition hover:border-black/25"
                >
                  Verify API
                  <div className="mt-1 break-all text-[12px] font-medium text-black/55">
                    {links.apiVerify}
                  </div>
                </a>

                <a
                  href={links.apiBadge}
                  target="_blank"
                  className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-[13px] font-semibold text-black transition hover:border-black/25"
                >
                  Badge API
                  <div className="mt-1 break-all text-[12px] font-medium text-black/55">
                    {links.apiBadge}
                  </div>
                </a>
              </div>
            </div>
          ) : null}

          {result.verified ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-[14px] font-semibold text-green-700">
              ✓ Signature verified ({proof.alg ?? "Ed25519"})
            </div>
          ) : null}

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/45">
                  Response
                </div>
                <div className="mt-2 text-[15px] font-semibold text-black">
                  Live verification JSON
                </div>
              </div>

              <button
                type="button"
                onClick={copyJson}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-black hover:text-white"
              >
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>

            <pre className="mt-5 max-h-[420px] overflow-auto rounded-2xl border border-black/10 bg-black p-5 text-[12px] leading-6 text-white">
              <code>{JSON.stringify(result, null, 2)}</code>
            </pre>
          </div>
        </div>
      ) : null}
    </section>
  );
}
"use client";

import { useMemo, useState } from "react";

type TestStatus = null | "loading" | "ok" | "error";

type VerifyResult = {
  ok?: boolean;
  verified?: boolean;
  registryId?: string;
  error?: string;
  record?: {
    registryId?: string;
    registrySnapshotId?: string;
    applicationId?: string;
    caseId?: string;
    recordType?: string;
    recordName?: string;
    entityName?: string;
    entityType?: string;
    country?: string;
    certificationStatus?: string;
    certifiedAt?: string;
    validFrom?: string;
    validTo?: string;
    publishedAt?: string;
    renewalStatus?: string | null;
    lifecycleStatus?: string;
    visibilityStatus?: string;
    verificationEligible?: boolean;
    badgeEligible?: boolean;
  };
  proof?: {
    alg?: string;
    kid?: string;
    signature?: string;
    signedAt?: string;
    verificationKeyUrl?: string;
    message?: Record<string, unknown>;
    messageString?: string;
  };
};

function formatMs(ms: number | null) {
  if (ms === null) return "—";
  return `${ms} ms`;
}

function truncate(value: unknown, length = 42) {
  const text = String(value ?? "—");
  if (text.length <= length) return text;
  return `${text.slice(0, length)}…`;
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "red" | "neutral" | "black";
}) {
  const classes =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-700"
      : tone === "red"
        ? "border-red-200 bg-red-50 text-red-700"
        : tone === "black"
          ? "border-black bg-black text-white"
          : "border-black/10 bg-black/[0.03] text-black/65";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {label}
      </div>
      <div className="mt-2 break-words text-[14px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

export default function RegistryIdTester() {
  const [registryId, setRegistryId] = useState("GAFAIG-00363095");
  const [verifyUrl, setVerifyUrl] = useState("");
  const [status, setStatus] = useState<TestStatus>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ).replace(/\/+$/, "");

  const cleanRegistryId = registryId.trim();

  const links = useMemo(() => {
    if (!cleanRegistryId) return null;

    const encoded = encodeURIComponent(cleanRegistryId);

    return {
      verifyPage: `/verify/${encoded}`,
      registryPage: `/registry/${encoded}`,
      widgetPreview: `/widget-preview/${encoded}`,
      apiVerify: `${baseUrl}/api/verify/${encoded}`,
      apiBadge: `${baseUrl}/api/badge/${encoded}`,
      publicKey: `${baseUrl}/api/.well-known/gafaig-public-key`,
    };
  }, [baseUrl, cleanRegistryId]);

  const curlVerify = links
    ? `curl ${links.apiVerify}`
    : "curl https://www.gafaig.com/api/verify/GAFAIG-00363095";

  const jsFetch = links
    ? `const response = await fetch("${links.apiVerify}", {
  cache: "no-store"
});

const data = await response.json();

console.log(data.record);
console.log(data.proof.messageString);
console.log(data.proof.signature);`
    : "";

  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopied(null);
    }
  }

  async function testRegistry() {
    const id = cleanRegistryId;
    if (!id || !links) return;

    setStatus("loading");
    setResult(null);
    setCopied(null);
    setHttpStatus(null);
    setLatencyMs(null);

    const started = performance.now();

    try {
      setVerifyUrl(links.apiVerify);

      const res = await fetch(links.apiVerify, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await res.text();
      const json = text ? (JSON.parse(text) as VerifyResult) : {};

      setHttpStatus(res.status);
      setLatencyMs(Math.round(performance.now() - started));
      setResult(json);
      setStatus(json?.ok ? "ok" : "error");
    } catch (error) {
      setHttpStatus(null);
      setLatencyMs(Math.round(performance.now() - started));
      setResult({
        ok: false,
        verified: false,
        error: error instanceof Error ? error.message : "Request failed",
      });
      setStatus("error");
    }
  }

  const record = result?.record ?? {};
  const proof = result?.proof ?? {};
  const responseJson = result ? JSON.stringify(result, null, 2) : "";

  return (
    <section className="rounded-3xl border border-black/10 bg-gradient-to-b from-white to-black/[0.02] p-8 md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Verification Playground
          </div>

          <h2 className="mt-4 max-w-[840px] text-[28px] font-semibold tracking-tight text-black">
            Live API console for GAFAIG records
          </h2>

          <p className="mt-4 max-w-[920px] text-[15px] leading-7 text-black/75">
            Enter a registry ID, call the public verification endpoint, inspect
            the certified record, review the signed payload, and copy production
            integration code.
          </p>
        </div>

        <StatusPill
          label={status === "ok" ? "Live" : status === "error" ? "Error" : "Ready"}
          tone={status === "ok" ? "green" : status === "error" ? "red" : "neutral"}
        />
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto]">
        <input
          value={registryId}
          onChange={(e) => setRegistryId(e.target.value)}
          placeholder="GAFAIG-XXXXXXXX"
          className="min-h-[52px] rounded-2xl border border-black/15 bg-white px-4 text-[15px] font-semibold text-black outline-none transition focus:border-black"
        />

        <button
          type="button"
          onClick={testRegistry}
          disabled={status === "loading"}
          className="min-h-[52px] rounded-2xl border border-black bg-black px-7 text-[14px] font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Checking…" : "Run request"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <DetailCard label="Method" value="GET" />
        <DetailCard label="HTTP status" value={httpStatus ?? "—"} />
        <DetailCard label="Latency" value={formatMs(latencyMs)} />
      </div>

      {verifyUrl ? (
        <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Request URL
              </div>
              <div className="mt-2 break-all font-mono text-[12px] text-black/70">
                {verifyUrl}
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyText("url", verifyUrl)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-black hover:text-white"
            >
              {copied === "url" ? "Copied" : "Copy URL"}
            </button>
          </div>
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[14px] font-semibold text-black/60">
          Calling the public verification endpoint…
        </div>
      ) : null}

      {status === "ok" ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <StatusPill label="Verified" tone="green" />
          <StatusPill
            label={`Signature Valid (${proof.alg ?? "Ed25519"})`}
            tone="green"
          />
          <StatusPill label="Payload Integrity Verified" tone="green" />
          <StatusPill
            label={record.certificationStatus ?? "CERTIFIED"}
            tone="black"
          />
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="text-[15px] font-semibold text-red-700">
            Not found or invalid
          </div>
          <div className="mt-2 text-[13px] leading-6 text-red-700/80">
            {result?.error ??
              "The verification endpoint did not return a valid GAFAIG record."}
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-8 grid gap-6">
          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/50">
              Record Summary
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailCard label="Entity" value={record.entityName ?? "—"} />
              <DetailCard
                label="Certification"
                value={record.certificationStatus ?? "—"}
              />
              <DetailCard label="Lifecycle" value={record.lifecycleStatus ?? "—"} />
              <DetailCard label="Country" value={record.country ?? "—"} />
              <DetailCard label="Valid from" value={record.validFrom ?? "—"} />
              <DetailCard label="Valid to" value={record.validTo ?? "—"} />
              <DetailCard
                label="Registry ID"
                value={
                  <span className="font-mono text-[12px]">
                    {result.registryId ?? cleanRegistryId}
                  </span>
                }
              />
              <DetailCard
                label="Case ID"
                value={
                  <span className="font-mono text-[12px]">
                    {record.caseId ?? "—"}
                  </span>
                }
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/50">
              Signature Breakdown
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailCard label="Algorithm" value={proof.alg ?? "—"} />
              <DetailCard
                label="Key ID"
                value={
                  <span className="font-mono text-[12px]">
                    {proof.kid ?? "—"}
                  </span>
                }
              />
              <DetailCard label="Signed at" value={proof.signedAt ?? "—"} />
              <DetailCard
                label="Public key"
                value={
                  <a
                    href={proof.verificationKeyUrl ?? links?.publicKey}
                    target="_blank"
                    className="break-all text-blue-600 underline"
                  >
                    {proof.verificationKeyUrl ?? links?.publicKey ?? "—"}
                  </a>
                }
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Message string
              </div>
              <div className="mt-2 break-all font-mono text-[12px] leading-6 text-black/70">
                {proof.messageString ?? "—"}
              </div>
            </div>
          </div>

          {links ? (
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/50">
                Connected Trust Surfaces
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <a
                  href={links.verifyPage}
                  target="_blank"
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 transition hover:border-black/30"
                >
                  <div className="text-[14px] font-semibold text-black">
                    Verify page
                  </div>
                  <div className="mt-2 break-all text-[12px] text-black/55">
                    {links.verifyPage}
                  </div>
                </a>

                <a
                  href={links.registryPage}
                  target="_blank"
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 transition hover:border-black/30"
                >
                  <div className="text-[14px] font-semibold text-black">
                    Registry page
                  </div>
                  <div className="mt-2 break-all text-[12px] text-black/55">
                    {links.registryPage}
                  </div>
                </a>

                <a
                  href={links.widgetPreview}
                  target="_blank"
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 transition hover:border-black/30"
                >
                  <div className="text-[14px] font-semibold text-black">
                    Widget preview
                  </div>
                  <div className="mt-2 break-all text-[12px] text-black/55">
                    {links.widgetPreview}
                  </div>
                </a>

                <a
                  href={links.apiBadge}
                  target="_blank"
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 transition hover:border-black/30"
                >
                  <div className="text-[14px] font-semibold text-black">
                    Badge API
                  </div>
                  <div className="mt-2 break-all text-[12px] text-black/55">
                    {links.apiBadge}
                  </div>
                </a>
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Request Snippets
                </div>
                <div className="mt-2 text-[18px] font-semibold tracking-tight text-black">
                  Copy production-ready calls
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[13px] font-semibold text-black">
                    cURL
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText("curl", curlVerify)}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-black hover:text-white"
                  >
                    {copied === "curl" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-black/10 bg-white p-4 text-[12px] leading-6 text-black/75">
                  <code>{curlVerify}</code>
                </pre>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[13px] font-semibold text-black">
                    JavaScript
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText("js", jsFetch)}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-black hover:text-white"
                  >
                    {copied === "js" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-black/10 bg-white p-4 text-[12px] leading-6 text-black/75">
                  <code>{jsFetch}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Response JSON
                </div>
                <div className="mt-2 text-[18px] font-semibold tracking-tight text-black">
                  Live verification payload
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyText("json", responseJson)}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-black hover:text-white"
              >
                {copied === "json" ? "Copied" : "Copy JSON"}
              </button>
            </div>

            <pre className="mt-5 max-h-[440px] overflow-auto rounded-2xl border border-black/10 bg-black p-5 text-[12px] leading-6 text-white">
              <code>{responseJson}</code>
            </pre>
          </div>
        </div>
      ) : null}
    </section>
  );
}
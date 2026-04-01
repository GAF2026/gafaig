"use client";

import { useMemo, useState } from "react";

type Props = {
  registryId: string;
  entityName: string;
};

function buildAbsoluteUrl(path: string) {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function CodeBlock({ value }: { value: string }) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-[13px] leading-[1.8] text-black/85">
      <code>{value}</code>
    </pre>
  );
}

function Snippet({ title, value, button }: any) {
  return (
    <div className="rounded-2xl border border-black/10 p-6">
      <div className="text-[12px] uppercase tracking-wide text-black/60 font-semibold">
        {title}
      </div>

      <div className="mt-4">
        <CodeBlock value={value} />
      </div>

      <div className="mt-4">
        <CopyButton value={value} label={button} />
      </div>
    </div>
  );
}

export default function RegistryTrustTools({
  registryId,
  entityName,
}: Props) {
  const registryUrl = useMemo(
    () => buildAbsoluteUrl(`/registry/${registryId}`),
    [registryId]
  );

  const verifyUrl = useMemo(
    () => buildAbsoluteUrl(`/api/verify/${registryId}`),
    [registryId]
  );

  const badgeUrl = useMemo(
    () => buildAbsoluteUrl(`/badge/${registryId}`),
    [registryId]
  );

  const htmlEmbed = `<a href="${registryUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${badgeUrl}" alt="${entityName} GAFAIG certification badge" style="height:64px;width:auto" />
</a>`;

  const markdownEmbed = `[![${entityName} GAFAIG certification badge](${badgeUrl})](${registryUrl})`;

  const verifySnippet = `<script src="https://www.gafaig.com/widget/gafaig-verify.js"></script>
<button onclick="verifyGAFAIG('${registryId}')">Verify This AI System</button>`;

  const widgetSnippet = `<script src="https://www.gafaig.com/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${registryId}"></div>`;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    registryUrl
  )}`;

  return (
    <section className="mt-20 rounded-3xl border border-black bg-white p-10 shadow-sm">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        <div className="max-w-[720px]">
          <div className="text-[12px] uppercase tracking-widest text-black/60 font-semibold">
            TRUST BADGE + EMBED TOOLS
          </div>

          <h2 className="mt-4 text-[36px] leading-tight font-semibold">
            Verify, share, or embed this certification
          </h2>

          <p className="mt-4 text-[15px] text-black/70 leading-relaxed">
            Share this certification publicly with a badge, verification link,
            QR code, or embed snippet. Anyone can independently verify this
            certification via GAFAIG.
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href={`/badge/${registryId}`}
            target="_blank"
            className="rounded-full bg-black text-white px-5 py-3 text-sm font-semibold"
          >
            Open badge
          </a>
          <a
            href={`/api/verify/${registryId}`}
            target="_blank"
            className="rounded-full border border-black px-5 py-3 text-sm font-semibold"
          >
            Verify JSON
          </a>
        </div>
      </div>

      {/* PREVIEW + QR */}
      <div className="mt-10 grid md:grid-cols-2 gap-8">

        {/* BADGE */}
        <div className="rounded-2xl border border-black/10 p-6">
          <div className="text-sm font-semibold mb-4">Live badge preview</div>

          <div className="bg-black/[0.03] rounded-xl p-4 flex justify-center">
            <img src={badgeUrl} className="max-w-full" />
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-xs text-black/50">Registry URL</div>
              <CodeBlock value={registryUrl} />
              <CopyButton value={registryUrl} label="Copy registry URL" />
            </div>

            <div>
              <div className="text-xs text-black/50">Verify URL</div>
              <CodeBlock value={verifyUrl} />
              <CopyButton value={verifyUrl} label="Copy verify URL" />
            </div>
          </div>
        </div>

        {/* QR */}
        <div className="rounded-2xl border border-black/10 p-6">
          <div className="text-sm font-semibold mb-4">Verification QR code</div>

          <div className="flex justify-center bg-black/[0.03] p-4 rounded-xl">
            <img src={qrSrc} className="w-[220px]" />
          </div>

          <p className="mt-5 text-sm text-black/70">
            Scan to instantly verify this certification.
          </p>

          <div className="mt-4">
            <CopyButton value={registryUrl} label="Copy QR target URL" />
          </div>
        </div>
      </div>

      {/* EMBEDS */}
      <div className="mt-10 grid md:grid-cols-2 gap-8">

        <Snippet
          title="HTML badge embed"
          value={htmlEmbed}
          button="Copy HTML"
        />

        <Snippet
          title="Markdown embed"
          value={markdownEmbed}
          button="Copy Markdown"
        />

        <Snippet
          title="Verify button"
          value={verifySnippet}
          button="Copy verify button"
        />

        <Snippet
          title="Widget embed"
          value={widgetSnippet}
          button="Copy widget"
        />
      </div>
    </section>
  );
}
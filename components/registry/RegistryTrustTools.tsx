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

function CopyButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-full border border-black px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function CodeBlock({
  value,
  compact = false,
}: {
  value: string;
  compact?: boolean;
}) {
  return (
    <pre
      className={[
        "overflow-x-auto rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-black/85",
        compact ? "text-[12px] leading-[1.7]" : "text-[13px] leading-[1.75]",
      ].join(" ")}
    >
      <code>{value}</code>
    </pre>
  );
}

export default function RegistryTrustTools({
  registryId,
  entityName,
}: Props) {
  const registryPath = `/registry/${encodeURIComponent(registryId)}`;
  const verifyPath = `/api/verify/${encodeURIComponent(registryId)}`;
  const badgePath = `/badge/${encodeURIComponent(registryId)}`;

  const registryUrl = useMemo(() => buildAbsoluteUrl(registryPath), [registryPath]);
  const verifyUrl = useMemo(() => buildAbsoluteUrl(verifyPath), [verifyPath]);
  const badgeUrl = useMemo(() => buildAbsoluteUrl(badgePath), [badgePath]);

  const htmlEmbed = `<a href="${registryUrl}" target="_blank" rel="noopener noreferrer">
  <img
    src="${badgeUrl}"
    alt="${entityName} GAFAIG certification badge"
    style="height:64px;width:auto"
  />
</a>`;

  const markdownEmbed = `[![${entityName} GAFAIG certification badge](${badgeUrl})](${registryUrl})`;

  const verifyButtonSnippet = `<script src="https://www.gafaig.com/widget/gafaig-verify.js"></script>
<button onclick="verifyGAFAIG('${registryId}')">Verify This AI System</button>`;

  const widgetSnippet = `<script src="https://www.gafaig.com/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${registryId}"></div>`;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    registryUrl
  )}`;

  return (
    <section className="mt-16 rounded-3xl border border-black bg-white p-10 shadow-sm md:p-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            TRUST BADGE + EMBED TOOLS
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Verify, share, or embed this certification
          </h2>

          <p className="mt-4 max-w-[920px] text-[15px] leading-[1.8] text-black/72">
            Share this certification publicly with a badge, a direct verification
            link, a QR code, or a lightweight embed snippet. These tools let third
            parties verify the public registry record and its signed proof.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={badgePath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Open badge
          </a>
          <a
            href={verifyPath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Open verify JSON
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-black/10 p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Live badge preview
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <a
              href={registryPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src={badgePath}
                alt={`${entityName} GAFAIG certification badge`}
                className="h-auto max-w-full"
              />
            </a>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                Registry URL
              </div>
              <div className="mt-3">
                <CodeBlock value={registryUrl} compact />
              </div>
              <div className="mt-3">
                <CopyButton value={registryUrl} label="Copy registry URL" />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                Verification URL
              </div>
              <div className="mt-3">
                <CodeBlock value={verifyUrl} compact />
              </div>
              <div className="mt-3">
                <CopyButton value={verifyUrl} label="Copy verify URL" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Verification QR code
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <img
              src={qrSrc}
              alt={`QR code for ${entityName} registry record`}
              className="mx-auto h-[220px] w-[220px] rounded-xl border border-black/10 bg-white p-3"
            />
          </div>

          <p className="mt-4 text-[14px] leading-[1.75] text-black/68">
            This QR code links directly to the public GAFAIG registry record for
            this certification, so anyone can scan and verify it.
          </p>

          <div className="mt-4">
            <CopyButton value={registryUrl} label="Copy QR target URL" />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6">
        <section className="rounded-3xl border border-black/10 p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            HTML badge embed
          </div>
          <div className="mt-4">
            <CodeBlock value={htmlEmbed} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton value={htmlEmbed} label="Copy HTML embed" />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Markdown badge embed
          </div>
          <div className="mt-4">
            <CodeBlock value={markdownEmbed} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton value={markdownEmbed} label="Copy Markdown embed" />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Verify button snippet
          </div>
          <div className="mt-4">
            <CodeBlock value={verifyButtonSnippet} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton value={verifyButtonSnippet} label="Copy verify button" />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Widget snippet
          </div>
          <div className="mt-4">
            <CodeBlock value={widgetSnippet} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton value={widgetSnippet} label="Copy widget snippet" />
          </div>
        </section>
      </div>
    </section>
  );
}
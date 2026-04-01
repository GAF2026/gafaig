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
      type="button"
      onClick={handleCopy}
      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-black px-5 py-3 text-sm font-semibold leading-none transition hover:bg-black hover:text-white"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function ActionLink({
  href,
  label,
  filled = false,
}: {
  href: string;
  label: string;
  filled?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "inline-flex min-h-[48px] min-w-[148px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold leading-none transition",
        filled
          ? "border border-black bg-black text-white hover:bg-black/90"
          : "border border-black text-black hover:bg-black/[0.04]",
      ].join(" ")}
    >
      {label}
    </a>
  );
}

function CodeBlock({ value }: { value: string }) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-[13px] leading-[1.8] text-black/85">
      <code>{value}</code>
    </pre>
  );
}

function Snippet({
  title,
  value,
  button,
}: {
  title: string;
  value: string;
  button: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-6">
      <div className="text-[12px] font-semibold uppercase tracking-wide text-black/60">
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
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[720px]">
          <div className="text-[12px] font-semibold uppercase tracking-widest text-black/60">
            TRUST BADGE + EMBED TOOLS
          </div>

          <h2 className="mt-4 text-[36px] font-semibold leading-tight text-black">
            Verify, share, or embed this certification
          </h2>

          <p className="mt-4 text-[15px] leading-relaxed text-black/70">
            Share this certification publicly with a badge, verification link,
            QR code, or embed snippet. Anyone can independently verify this
            certification via GAFAIG.
          </p>

          <p className="mt-2 text-[12px] text-black/50">
            Public verification powered by GAFAIG cryptographic registry
            infrastructure.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <ActionLink
            href={`/badge/${registryId}`}
            label="Open badge"
            filled
          />
          <ActionLink
            href={`/api/verify/${registryId}`}
            label="Open verify JSON"
          />
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 p-6">
          <div className="mb-4 text-sm font-semibold text-black">
            Live badge preview
          </div>

          <div className="flex justify-center rounded-xl bg-black/[0.03] p-4">
            <img src={badgeUrl} alt={`${entityName} badge`} className="max-w-full" />
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-xs text-black/50">Registry URL</div>
              <div className="mt-2">
                <CodeBlock value={registryUrl} />
              </div>
              <div className="mt-3">
                <CopyButton value={registryUrl} label="Copy registry URL" />
              </div>
            </div>

            <div>
              <div className="text-xs text-black/50">Verify URL</div>
              <div className="mt-2">
                <CodeBlock value={verifyUrl} />
              </div>
              <div className="mt-3">
                <CopyButton value={verifyUrl} label="Copy verify URL" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 p-6">
          <div className="mb-4 text-sm font-semibold text-black">
            Verification QR code
          </div>

          <div className="flex justify-center rounded-xl bg-black/[0.03] p-4">
            <img src={qrSrc} alt="Verification QR code" className="w-[220px]" />
          </div>

          <p className="mt-5 text-sm text-black/70">
            Scan to instantly verify this certification.
          </p>

          <div className="mt-4">
            <CopyButton value={registryUrl} label="Copy QR target URL" />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
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
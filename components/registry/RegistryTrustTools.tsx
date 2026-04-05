"use client";

import { useMemo, useState } from "react";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

type Props = {
  registryId: string;
  entityName?: string | null;
  absoluteRegistryUrl: string;
  absoluteVerifyUrl: string;
  absoluteBadgeUrl: string;
};

function CopyButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-[44px] items-center justify-center rounded-full border border-black px-5 text-sm font-semibold transition hover:bg-black/[0.04]"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

export default function RegistryTrustTools({
  registryId,
  entityName,
  absoluteRegistryUrl,
  absoluteVerifyUrl,
  absoluteBadgeUrl,
}: Props) {
  const safeEntityName = entityName?.trim() || "GAFAIG Certified Record";

  const widgetScriptUrl = "https://www.gafaig.com/widget/gafaig-widget.js?v=1";
  const verifyScriptUrl = "https://www.gafaig.com/widget/gafaig-verify.js?v=1";

  const htmlEmbed = useMemo(
    () => `<a href="${absoluteRegistryUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${absoluteBadgeUrl}" alt="${safeEntityName} GAFAIG certification badge" style="height:64px;width:auto" />
</a>`,
    [absoluteBadgeUrl, absoluteRegistryUrl, safeEntityName]
  );

  const markdownEmbed = useMemo(
    () =>
      `[![${safeEntityName} GAFAIG certification badge](${absoluteBadgeUrl})](${absoluteRegistryUrl})`,
    [absoluteBadgeUrl, absoluteRegistryUrl, safeEntityName]
  );

  const verifyButtonSnippet = useMemo(
    () => `<script src="${verifyScriptUrl}"></script>
<button onclick="verifyGAFAIG('${registryId}')">Verify This AI System</button>`,
    [registryId, verifyScriptUrl]
  );

  const widgetSnippet = useMemo(
    () => `<script src="${widgetScriptUrl}"></script>
<div data-gafaig-id="${registryId}"></div>`,
    [registryId, widgetScriptUrl]
  );

  const qrUrl = absoluteRegistryUrl;

  return (
    <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm md:p-12">
      <div className="flex flex-col gap-6 md:flex-row md:justify-between">
        <div className="max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
            Trust badge + embed tools
          </div>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black md:text-6xl">
            Verify, share, or embed this certification
          </h2>

          <p className="mt-5 text-lg leading-8 text-black/65">
            Share this certification publicly with a badge, verification link,
            QR code, or embed snippet.
          </p>

          <div className="mt-4">
            <PublicButtonLink href="/verify" variant="ghost" size="sm">
              Learn how verification works
            </PublicButtonLink>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <PublicButtonLink href={absoluteBadgeUrl} variant="primary">
            Open badge
          </PublicButtonLink>

          <PublicButtonLink href={absoluteVerifyUrl} variant="secondary">
            Verify JSON
          </PublicButtonLink>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-black/10 p-6">
          <img src={absoluteBadgeUrl} className="w-full rounded-xl" />

          <div className="mt-4">
            <CopyButton value={absoluteRegistryUrl} label="Copy registry URL" />
          </div>
        </div>

        <div className="rounded-[28px] border border-black/10 p-6">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
              qrUrl
            )}`}
            className="mx-auto w-[240px]"
          />

          <div className="mt-4">
            <CopyButton value={qrUrl} label="Copy QR URL" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Snippet title="HTML embed" code={htmlEmbed} />
        <Snippet title="Markdown embed" code={markdownEmbed} />
        <Snippet title="Verify button" code={verifyButtonSnippet} />
        <Snippet title="Widget embed" code={widgetSnippet} />
      </div>
    </section>
  );
}

function Snippet({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-[28px] border border-black/10 p-6">
      <div className="text-xs uppercase text-black/50">{title}</div>

      <pre className="mt-4 rounded-xl bg-black/[0.02] p-4 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>

      <div className="mt-4">
        <CopyButton value={code} label={`Copy ${title}`} />
      </div>
    </div>
  );
}
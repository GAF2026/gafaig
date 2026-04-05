"use client";

import { useMemo, useState } from "react";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicButton from "@/app/_components/PublicButton";

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
    <PublicButton
      type="button"
      onClick={handleCopy}
      variant="secondary"
      size="sm"
    >
      {copied ? "Copied" : label}
    </PublicButton>
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
  <img
    src="${absoluteBadgeUrl}"
    alt="${safeEntityName} GAFAIG certification badge"
    style="height:64px;width:auto"
  />
</a>
<!-- Verified via GAFAIG public trust infrastructure -->`,
    [absoluteBadgeUrl, absoluteRegistryUrl, safeEntityName]
  );

  const markdownEmbed = useMemo(
    () =>
      `[![${safeEntityName} GAFAIG certification badge](${absoluteBadgeUrl})](${absoluteRegistryUrl})

<!-- Verified via GAFAIG public trust infrastructure -->`,
    [absoluteBadgeUrl, absoluteRegistryUrl, safeEntityName]
  );

  const verifyButtonSnippet = useMemo(
    () => `<script src="${verifyScriptUrl}"></script>
<button onclick="verifyGAFAIG('${registryId}')">Verify This AI System</button>

<!-- Independently verifiable via GAFAIG -->`,
    [registryId, verifyScriptUrl]
  );

  const widgetSnippet = useMemo(
    () => `<script src="${widgetScriptUrl}"></script>
<div data-gafaig-id="${registryId}"></div>

<!-- Verified via GAFAIG public registry infrastructure -->`,
    [registryId, widgetScriptUrl]
  );

  const qrUrl = absoluteRegistryUrl;

  return (
    <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm md:p-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
            Trust badge + embed tools
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black md:text-6xl">
            Verify, share, or embed this certification
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-black/65">
            Share this certification publicly with a badge, a direct verification
            link, a QR code, or a lightweight embed snippet. Anyone can
            independently verify this certification via GAFAIG.
          </p>

          <div className="mt-4">
            <PublicButtonLink href="/verify" variant="ghost" size="sm">
              Learn how verification works
            </PublicButtonLink>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3">
          <PublicButtonLink href={absoluteBadgeUrl} variant="primary">
            Open badge
          </PublicButtonLink>
          <PublicButtonLink href={absoluteVerifyUrl} variant="secondary">
            Verify JSON
          </PublicButtonLink>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-black/10 bg-white p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Live badge preview
          </div>

          <div className="mt-5 rounded-[24px] border border-black/8 bg-black/[0.02] p-6">
            <img
              src={absoluteBadgeUrl}
              alt={`${safeEntityName} badge preview`}
              className="h-auto w-full rounded-2xl border border-black/5 bg-white shadow-sm"
            />
          </div>

          <div className="mt-4 text-center text-xs text-black/50">
            Independently verifiable via GAFAIG
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                Registry URL
              </div>
              <div className="mt-2 break-all rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4 text-base leading-8 text-black/75">
                {absoluteRegistryUrl}
              </div>
              <div className="mt-4">
                <CopyButton value={absoluteRegistryUrl} label="Copy registry URL" />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                Verify URL
              </div>
              <div className="mt-2 break-all rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4 text-base leading-8 text-black/75">
                {absoluteVerifyUrl}
              </div>
              <div className="mt-4">
                <CopyButton value={absoluteVerifyUrl} label="Copy verify URL" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Verification QR code
          </div>

          <div className="mt-5 rounded-[24px] border border-black/8 bg-black/[0.02] p-6">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
                qrUrl
              )}`}
              alt="Verification QR code"
              className="mx-auto h-auto w-full max-w-[320px] rounded-2xl border border-black/5 bg-white shadow-sm"
            />
          </div>

          <p className="mt-6 text-base leading-8 text-black/65">
            Scan to instantly verify this certification.
          </p>

          <div className="mt-4">
            <CopyButton value={qrUrl} label="Copy QR target URL" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Snippet title="HTML badge embed" code={htmlEmbed} />
        <Snippet title="Markdown badge embed" code={markdownEmbed} />
        <Snippet title="Verify button" code={verifyButtonSnippet} />
        <Snippet title="Widget embed" code={widgetSnippet} />
      </div>
    </section>
  );
}

function Snippet({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
        {title}
      </div>
      <pre className="mt-4 overflow-x-auto rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-sm leading-8 text-black/75">
        <code>{code}</code>
      </pre>
      <div className="mt-4">
        <CopyButton value={code} label={`Copy ${title}`} />
      </div>
    </div>
  );
}
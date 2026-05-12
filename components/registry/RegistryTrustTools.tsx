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
    <PublicButton type="button" onClick={handleCopy} variant="secondary" size="sm">
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
    <section className="rounded-2xl border border-black/10 bg-white p-8 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
            Trust distribution
          </div>

          <h2 className="mt-3 text-2xl font-semibold text-black md:text-3xl">
            Share and verify this certification
          </h2>

          <p className="mt-3 text-[15px] text-black/70 leading-relaxed">
            Publish this certification across websites, documentation, and external systems.
            Every surface is independently verifiable via GAFAIG.
          </p>
        </div>

        <div className="flex gap-3">
          <PublicButtonLink href={absoluteBadgeUrl} variant="primary">
            Open Badge
          </PublicButtonLink>
          <PublicButtonLink href={absoluteVerifyUrl} variant="secondary">
            Proof JSON
          </PublicButtonLink>
        </div>
      </div>

      {/* PREVIEW + QR */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">

        {/* BADGE */}
        <div className="rounded-xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/50">
            Live badge
          </div>

          <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] p-5">
            <img
              src={absoluteBadgeUrl}
              alt="Badge preview"
              className="mx-auto max-w-full rounded-xl"
            />
          </div>

          <div className="mt-4 text-center text-xs text-black/50">
            Public trust surface • independently verifiable
          </div>

          {/* LINKS */}
          <div className="mt-6 space-y-4">
            <InfoRow label="Registry URL" value={absoluteRegistryUrl} />
            <InfoRow label="Verify URL" value={absoluteVerifyUrl} />
          </div>
        </div>

        {/* QR */}
        <div className="rounded-xl border border-black/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/50">
            QR verification
          </div>

          <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] p-5">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(qrUrl)}`}
              alt="QR code"
              className="mx-auto max-w-[260px]"
            />
          </div>

          <p className="mt-4 text-sm text-black/70">
            Scan to verify this certification instantly.
          </p>

          <div className="mt-3">
            <CopyButton value={qrUrl} label="Copy QR URL" />
          </div>
        </div>
      </div>

      {/* SNIPPETS */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Snippet title="HTML Embed" code={htmlEmbed} />
        <Snippet title="Markdown Embed" code={markdownEmbed} />
        <Snippet title="Verify Button" code={verifyButtonSnippet} />
        <Snippet title="Widget Embed" code={widgetSnippet} />
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/50">
        {label}
      </div>
      <div className="mt-2 rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black/75 break-all">
        {value}
      </div>
      <div className="mt-2">
        <CopyButton value={value} label={`Copy ${label}`} />
      </div>
    </div>
  );
}

function Snippet({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/50">
        {title}
      </div>

      <pre className="mt-3 overflow-x-auto rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/75">
        <code>{code}</code>
      </pre>

      <div className="mt-3">
        <CopyButton value={code} label={`Copy ${title}`} />
      </div>
    </div>
  );
}
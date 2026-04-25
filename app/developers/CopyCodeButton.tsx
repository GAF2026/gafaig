"use client";

import { useState } from "react";

export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-black hover:text-white"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
"use client";

import { useState } from "react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed", e);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[11px] font-medium text-black/50 hover:text-black transition"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
"use client";

import * as React from "react";

/**
 * AdminShell
 * - Provides consistent admin page padding + max width.
 * - If `title` is not provided, we DO NOT render the header/divider.
 *   This prevents the “mystery horizontal line” you saw on pages that
 *   accidentally render AdminShell without a title.
 *
 * Demo UX clarity:
 * - Adds a subtle "Demo guide" panel so judges/users know what to do first.
 * - Kept institutional/minimal.
 */
export default function AdminShell({
  title,
  children,
}: {
  title?: string; // optional to avoid stray header UI
  children: React.ReactNode;
}) {
  const safeTitle = (title || "").trim();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Demo guide (subtle, safe for admin pages) */}
        <div className="mb-6 rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Demo guide</div>
              <div className="mt-1 text-sm text-black/70">
                Link evidence → findings → decisions, then generate summaries.
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-black/70 space-y-1">
                <li>
                  Open a case (e.g. <span className="font-mono">CASE-0001</span>) and go
                  to <span className="font-semibold">Evidence</span>.
                </li>
                <li>
                  Click <span className="font-semibold">Regenerate all</span> to produce
                  and store evidence summaries.
                </li>
                <li>
                  Expected: cards show{" "}
                  <span className="font-semibold">Stored summary found</span> and summaries
                  appear under each evidence item.
                </li>
                <li>
                  Data layer: evidence + summaries are stored in Snowflake (Cortex-backed
                  summaries).
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(window.location.href);
                  } catch {
                    // no-op
                  }
                }}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold hover:bg-black/[0.04]"
                title="Copy this demo page URL"
              >
                Copy URL
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold hover:bg-black/[0.04]"
                title="Scroll to top"
              >
                Top
              </button>
            </div>
          </div>
        </div>

        {/* Header (only when we actually have a title) */}
        {safeTitle ? (
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">{safeTitle}</h1>
            <div className="mt-2 h-px bg-gray-200" />
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
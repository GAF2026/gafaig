import * as React from "react";

/**
 * AdminShell
 * - Provides consistent admin page padding + max width.
 * - If `title` is not provided, we DO NOT render the header/divider.
 *   This prevents the “mystery horizontal line” you saw on pages that
 *   accidentally render AdminShell without a title.
 */
export default function AdminShell({
  title,
  children,
}: {
  title?: string; // ✅ now optional to avoid stray header UI
  children: React.ReactNode;
}) {
  const safeTitle = (title || "").trim();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
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
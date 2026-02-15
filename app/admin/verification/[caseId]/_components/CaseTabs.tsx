"use client";

/**
 * Shared tabs for /admin/verification/[caseId] sub-pages.
 * Uses pathname to highlight the active tab.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export default function CaseTabs({ caseId }: { caseId: string }) {
  const pathname = usePathname();
  const base = `/admin/verification/${encodeURIComponent(caseId)}`;

  const tabs = React.useMemo(
    () => [
      { href: base, label: "Overview", match: (p: string) => p === base },
      { href: `${base}/evidence`, label: "Evidence", match: (p: string) => p.endsWith("/evidence") },
      { href: `${base}/findings`, label: "Findings", match: (p: string) => p.endsWith("/findings") },
      { href: `${base}/assignments`, label: "Assignments", match: (p: string) => p.endsWith("/assignments") },
      { href: `${base}/events`, label: "Events", match: (p: string) => p.endsWith("/events") },
      { href: `${base}/decisions`, label: "Decision", match: (p: string) => p.endsWith("/decisions") },
      { href: `${base}/status`, label: "Status", match: (p: string) => p.endsWith("/status") },
    ],
    [base]
  );

  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Verification tabs">
      {tabs.map((t) => {
        const active = t.match(pathname || "");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={[
              "rounded-full border px-3 py-2 text-sm font-semibold",
              active ? "border-gray-400 bg-white shadow-sm" : "border-gray-200 bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
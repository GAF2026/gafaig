"use client";

/**
 * Evidence wrapper for consistent header/tabs layout.
 * Keeps EvidenceClient intact.
 */

import Link from "next/link";
import { useState } from "react";
import CaseTabs from "../_components/CaseTabs";
import EvidenceClient from "./EvidenceClient";

export default function EvidencePageClient({ caseId }: { caseId: string }) {
  const [reloading, setReloading] = useState(false);
  const backHref = `/admin/verification/${encodeURIComponent(caseId)}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Evidence</h1>
          <div className="mt-2 text-sm text-gray-600">
            Case: <span className="font-mono">{caseId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={backHref}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
          >
            ← Back
          </Link>

          <button
            onClick={() => {
              setReloading(true);
              window.location.reload();
            }}
            disabled={reloading}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {reloading ? "Reloading…" : "Refresh"}
          </button>
        </div>
      </div>

      <CaseTabs caseId={caseId} />

      {/* Evidence feature UI */}
      <EvidenceClient caseId={caseId} />
    </div>
  );
}
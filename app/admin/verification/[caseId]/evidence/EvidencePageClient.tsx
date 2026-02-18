// app/admin/verification/[caseId]/evidence/EvidencePageClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import EvidenceClient from "./EvidenceClient";

type EvidenceRow = {
  evidenceId: string;
  caseId: string;
  evidenceType: string; // link | document | policy | ...
  title: string;
  description?: string | null;
  sourceUrl?: string | null;
  storageRef?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  createdAt?: string | null;
};

const BUILD_FINGERPRINT = "EVIDENCE_PAGECLIENT_REAL_2026-02-18_1";

export default function EvidencePageClient({ caseId }: { caseId: string }) {
  const [rows, setRows] = useState<EvidenceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;

    const ac = new AbortController();
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const r = await fetch(`/api/admin/verification/${caseId}/evidence`, {
          credentials: "include",
          cache: "no-store",
          signal: ac.signal,
        });

        const j = await r.json();

        if (!alive) return;

        if (!r.ok || !j?.ok) {
          throw new Error(j?.error || `HTTP ${r.status}`);
        }

        setRows(Array.isArray(j.rows) ? j.rows : []);
      } catch (e: any) {
        // Ignore abort errors during fast refresh / navigation
        if (e?.name === "AbortError") return;
        if (!alive) return;
        setErr(e?.message || "Failed to load evidence");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [caseId]);

  if (loading)
    return (
      <div className="p-6">
        Loading evidence… {BUILD_FINGERPRINT}
      </div>
    );

  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

  return <EvidenceClient caseId={caseId} initialEvidence={rows} />;
}
"use client";

import React, { useMemo, useState } from "react";

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

export default function EvidenceClient({
  caseId,
  initialEvidence,
}: {
  caseId: string;
  initialEvidence: EvidenceRow[];
}) {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const list = Array.isArray(initialEvidence) ? initialEvidence : [];
    const query = q.trim().toLowerCase();
    if (!query) return list;

    return list.filter((r) => {
      const hay = `${r.evidenceType ?? ""} ${r.title ?? ""} ${r.description ?? ""} ${r.sourceUrl ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [initialEvidence, q]);

  return (
    <div className="p-6 space-y-4">
      {/* Registry framing (no instructions here; demo page provides the guide) */}
      <div className="rounded-xl border bg-white p-4">
        <div className="text-xs tracking-wider uppercase text-gray-500">GAFAIG Governance Registry</div>
        <div className="mt-1 text-xl font-semibold">Case Artifact Log</div>
        <div className="mt-1 text-sm text-gray-700">
          This page registers structured governance artifacts associated with this AI system case. Each artifact is
          timestamped and designed for Snowflake-backed auditability.
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-semibold">Case:</span> {caseId}
        </div>
      </div>

      {/* Header + search */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">Registered Evidence</div>
          <div className="text-sm text-gray-600">
            {rows.length} artifact{rows.length === 1 ? "" : "s"} loaded
          </div>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search artifacts…"
          className="w-[360px] max-w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {/* Body */}
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-gray-700">
          <div className="font-medium">No artifacts registered yet</div>
          <div className="text-sm text-gray-600">
            Add a few governance artifacts for the demo (e.g., Model Card, Bias Audit, Safety Red-Team Report). This
            registry view confirms case-level persistence and auditability.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Artifact</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.evidenceId} className="border-t align-top">
                  <td className="px-4 py-3">{r.evidenceType || "—"}</td>

                  <td className="px-4 py-3">
                    <div className="font-medium">{r.title || "Untitled"}</div>
                    {r.description ? <div className="mt-0.5 text-xs text-gray-600">{r.description}</div> : null}
                    <div className="mt-1 text-[11px] text-gray-400">ID: {r.evidenceId}</div>
                  </td>

                  {/* Not clickable (avoids broken demo links) */}
                  <td className="px-4 py-3">
                    {r.sourceUrl ? (
                      <span className="text-gray-700" title={r.sourceUrl}>
                        Registered artifact
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">{r.createdAt ?? r.submittedAt ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Small helper link back to demo */}
      <div className="text-sm">
        <a className="text-blue-600 underline" href="/demo">
          ← Back to Demo Guide
        </a>
        <span className="text-gray-400"> · </span>
        <a
          className="text-blue-600 underline"
          href={`/api/admin/verification/${caseId}/evidence`}
          target="_blank"
          rel="noreferrer"
        >
          View JSON endpoint
        </a>
      </div>
    </div>
  );
}
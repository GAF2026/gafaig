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
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">Evidence</div>
          <div className="text-sm text-gray-600">Case: {caseId}</div>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search evidence…"
          className="w-[320px] max-w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-gray-700">
          <div className="font-medium">No evidence yet</div>
          <div className="text-sm text-gray-600">
            Add evidence via the API (optional for demo). This confirms the evidence registry loads and renders safely.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.evidenceId} className="border-t">
                  <td className="px-4 py-3">{r.evidenceType}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.title}</div>
                    {r.description ? <div className="text-xs text-gray-600">{r.description}</div> : null}
                  </td>
                  <td className="px-4 py-3">
                    {r.sourceUrl ? (
                      <a className="text-blue-600 underline" href={r.sourceUrl} target="_blank" rel="noreferrer">
                        link
                      </a>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{r.createdAt ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
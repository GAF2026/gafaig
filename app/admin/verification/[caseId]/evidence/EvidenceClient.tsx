"use client";

import * as React from "react";
import Link from "next/link";

type Finding = {
  findingId: string;
  caseId: string;
  controlId?: string | null;
  controlTitle?: string | null;
  result?: string | null;
  severity?: string | null;
  rationale?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type Evidence = {
  evidenceId: string;
  caseId: string;
  evidenceType?: string | null;
  title?: string | null;
  description?: string | null;
  sourceUrl?: string | null;
  storageRef?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type LinkRow = {
  findingId: string;
  evidenceId: string;
  caseId?: string | null;
  createdAt?: string | null;
};

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.headers || {}),
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { ok: false, error: `Non-JSON response (${res.status})`, raw: text };
  }
  return { res, data };
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function pillClass(value?: string | null) {
  const v = (value || "").toLowerCase();
  if (v === "approved" || v === "pass") return "bg-green-50 text-green-800 border-green-200";
  if (v === "in_review") return "bg-blue-50 text-blue-800 border-blue-200";
  if (v === "needs_more_info") return "bg-amber-50 text-amber-900 border-amber-200";
  if (v === "suspended" || v === "fail") return "bg-red-50 text-red-900 border-red-200";
  return "bg-gray-50 text-gray-800 border-gray-200";
}

function formatMaybe(dt?: string | null) {
  if (!dt) return "";
  return dt;
}

function shortId(id: string) {
  if (!id) return "";
  if (id.length <= 14) return id;
  return `${id.slice(0, 6)}…${id.slice(-6)}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyButton({
  label,
  value,
  onCopied,
  className,
}: {
  label: string;
  value: string;
  onCopied?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyToClipboard(value);
        if (ok) onCopied?.();
      }}
      className={cx(
        "inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50",
        className
      )}
      title="Copies the full value"
    >
      {label}
    </button>
  );
}

export default function EvidenceClient({ caseId }: { caseId: string }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [findings, setFindings] = React.useState<Finding[]>([]);
  const [evidence, setEvidence] = React.useState<Evidence[]>([]);
  const [links, setLinks] = React.useState<LinkRow[]>([]);

  const [selectedEvidenceId, setSelectedEvidenceId] = React.useState<string>("");
  const [selectedFindingId, setSelectedFindingId] = React.useState<string>("");
  const [linkBusy, setLinkBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  // Add Evidence form (Option A “real workflow”)
  const [addBusy, setAddBusy] = React.useState(false);
  const [newEvidenceType, setNewEvidenceType] = React.useState<string>("link");
  const [newTitle, setNewTitle] = React.useState<string>("");
  const [newDescription, setNewDescription] = React.useState<string>("");
  const [newSourceUrl, setNewSourceUrl] = React.useState<string>("");
  const [newStorageRef, setNewStorageRef] = React.useState<string>("");

  const [showDebug, setShowDebug] = React.useState(false);
  const [debugPayloads, setDebugPayloads] = React.useState<any>(null);

  const linkedFindingIdsByEvidence = React.useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const l of links) {
      if (!map.has(l.evidenceId)) map.set(l.evidenceId, new Set());
      map.get(l.evidenceId)!.add(l.findingId);
    }
    return map;
  }, [links]);

  const findingsById = React.useMemo(() => {
    const m = new Map<string, Finding>();
    for (const f of findings) m.set(f.findingId, f);
    return m;
  }, [findings]);

  function showToast(msg: string) {
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2500);
  }

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const findingsUrl = `/api/admin/verification/${encodeURIComponent(caseId)}/findings`;
      const evidenceUrl = `/api/admin/verification/evidence?caseId=${encodeURIComponent(caseId)}`;
      const linksUrl = `/api/admin/verification/finding-evidence?caseId=${encodeURIComponent(caseId)}`;

      const [f, e, l] = await Promise.all([fetchJson(findingsUrl), fetchJson(evidenceUrl), fetchJson(linksUrl)]);

      if (!f.data?.ok) throw new Error(f.data?.error || "Failed to load findings");

      if (!e.data?.ok) {
        if (e.res.status === 401) {
          throw new Error(
            "Unauthorized loading evidence. Set cookie gafaig_admin=1 (DevTools console: document.cookie='gafaig_admin=1; path=/' ) then refresh."
          );
        }
        throw new Error(e.data?.error || "Failed to load evidence");
      }

      if (!l.data?.ok) throw new Error(l.data?.error || "Failed to load links");

      const fRows = Array.isArray(f.data.rows) ? f.data.rows : [];
      const eRows = Array.isArray(e.data.rows) ? e.data.rows : [];
      const lRows = Array.isArray(l.data.rows) ? l.data.rows : [];

      setFindings(fRows);
      setEvidence(eRows);
      setLinks(lRows);

      setDebugPayloads({ findings: f.data, evidence: e.data, links: l.data });
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  async function createLink() {
    if (!selectedEvidenceId || !selectedFindingId) return;
    setLinkBusy(true);
    setError(null);

    try {
      const payload = {
        caseId,
        findingId: selectedFindingId,
        evidenceId: selectedEvidenceId,
      };

      const r = await fetchJson(`/api/admin/verification/finding-evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.data?.ok) throw new Error(r.data?.error || "Failed to create link");

      showToast(r.data?.alreadyLinked ? "Already linked" : "Link created");
      setSelectedEvidenceId("");
      setSelectedFindingId("");
      await loadAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLinkBusy(false);
    }
  }

  async function removeLink(findingId: string, evidenceId: string) {
    setLinkBusy(true);
    setError(null);

    try {
      const url =
        `/api/admin/verification/finding-evidence?` +
        `caseId=${encodeURIComponent(caseId)}` +
        `&findingId=${encodeURIComponent(findingId)}` +
        `&evidenceId=${encodeURIComponent(evidenceId)}`;

      const r = await fetchJson(url, { method: "DELETE" });
      if (!r.data?.ok) throw new Error(r.data?.error || "Failed to remove link");

      const deletedCount =
        typeof r.data?.deletedCount === "number"
          ? r.data.deletedCount
          : r.data?.deleted
          ? 1
          : 0;

      showToast(deletedCount > 0 ? "Link removed" : "No link to remove");
      await loadAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLinkBusy(false);
    }
  }

  async function addEvidence() {
    setError(null);

    const title = newTitle.trim();
    const description = newDescription.trim();
    const sourceUrl = newSourceUrl.trim();
    const storageRef = newStorageRef.trim();
    const evidenceType = (newEvidenceType || "link").trim();

    if (!title) {
      setError("Add Evidence: title is required");
      return;
    }
    if (!sourceUrl && !storageRef) {
      setError("Add Evidence: provide either Source URL or Storage Ref");
      return;
    }

    setAddBusy(true);
    try {
      const payload = {
        caseId,
        evidenceType,
        title,
        description: description ? description : null,
        sourceUrl: sourceUrl ? sourceUrl : null,
        storageRef: storageRef ? storageRef : null,
        submittedBy: "admin@gafaig.com",
      };

      const r = await fetchJson(`/api/admin/verification/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.data?.ok) throw new Error(r.data?.error || "Failed to add evidence");

      showToast("Evidence added");
      setNewTitle("");
      setNewDescription("");
      setNewSourceUrl("");
      setNewStorageRef("");
      setNewEvidenceType("link");
      await loadAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setAddBusy(false);
    }
  }

  const counts = {
    evidence: evidence.length,
    findings: findings.length,
    links: links.length,
  };

  const selectClass =
    "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm " +
    "focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200";

  const inputClass =
    "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm " +
    "focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Top bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/verification" className="text-sm text-gray-600 hover:text-gray-900 underline">
              Admin
            </Link>
            <span className="text-sm text-gray-400">•</span>
            <Link
              href={`/admin/verification/${encodeURIComponent(caseId)}`}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Verification/{caseId}
            </Link>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-800">Evidence</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadAll()}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
            >
              Refresh
            </button>
            <Link
              href={`/admin/verification/${encodeURIComponent(caseId)}`}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
            >
              Back to Case
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs uppercase tracking-wide text-gray-500">Admin • Verification • {caseId} • Evidence</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Case Evidence</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
            Evidence items, findings, and the links between them.
          </p>
        </div>

        {toast && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 shadow-sm">
            {toast}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm">
            <div className="font-medium">Error</div>
            <div className="mt-1 whitespace-pre-wrap">{error}</div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-gray-500">Evidence items</div>
            <div className="mt-1 text-3xl font-semibold">{counts.evidence}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-gray-500">Findings</div>
            <div className="mt-1 text-3xl font-semibold">{counts.findings}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-gray-500">Links</div>
            <div className="mt-1 text-3xl font-semibold">{counts.links}</div>
          </div>
        </div>

        {/* Add Evidence */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Add evidence</div>
              <div className="mt-1 text-sm text-gray-600">Creates a real evidence row in Snowflake for this case.</div>
            </div>

            <button
              onClick={addEvidence}
              disabled={addBusy}
              className={cx(
                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm",
                addBusy ? "bg-gray-100 text-gray-400" : "bg-gray-900 text-white hover:bg-gray-800"
              )}
            >
              {addBusy ? "Adding…" : "Add evidence"}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-600">Evidence type</label>
              <select value={newEvidenceType} onChange={(e) => setNewEvidenceType(e.target.value)} className={selectClass}>
                <option value="link">link</option>
                <option value="policy">policy</option>
                <option value="report">report</option>
                <option value="log">log</option>
                <option value="screenshot">screenshot</option>
                <option value="attestation">attestation</option>
                <option value="dataset">dataset</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Title (required)</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className={inputClass}
                placeholder="e.g., Human Governance Policy v1.0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-600">Description (optional)</label>
              <input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className={inputClass}
                placeholder="Short note about what this evidence supports…"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Source URL (optional)</label>
              <input value={newSourceUrl} onChange={(e) => setNewSourceUrl(e.target.value)} className={inputClass} placeholder="https://…" />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Storage ref (optional)</label>
              <input
                value={newStorageRef}
                onChange={(e) => setNewStorageRef(e.target.value)}
                className={inputClass}
                placeholder="@STAGE/path/file.pdf or local ref"
              />
            </div>

            <div className="md:col-span-2 text-xs text-gray-500">Note: you must provide at least one of Source URL or Storage ref.</div>
          </div>
        </div>

        {/* Link evidence to finding */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Link evidence to a finding</div>
              <div className="mt-1 text-sm text-gray-600">Select an evidence item and a finding, then create the link.</div>
            </div>

            <button
              onClick={createLink}
              disabled={!selectedEvidenceId || !selectedFindingId || linkBusy}
              className={cx(
                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm",
                !selectedEvidenceId || !selectedFindingId || linkBusy ? "bg-gray-100 text-gray-400" : "bg-gray-900 text-white hover:bg-gray-800"
              )}
            >
              {linkBusy ? "Working…" : "Create link"}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-600">Evidence</label>
              <select value={selectedEvidenceId} onChange={(e) => setSelectedEvidenceId(e.target.value)} className={selectClass}>
                <option value="">Select evidence…</option>
                {evidence.map((ev) => (
                  <option key={ev.evidenceId} value={ev.evidenceId}>
                    {ev.title || "(untitled)"} • {ev.evidenceType || "unknown"} • {shortId(ev.evidenceId)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Finding</label>
              <select value={selectedFindingId} onChange={(e) => setSelectedFindingId(e.target.value)} className={selectClass}>
                <option value="">Select finding…</option>
                {findings.map((f) => (
                  <option key={f.findingId} value={f.findingId}>
                    {(f.controlId || "Control") + " — " + (f.controlTitle || "(no title)")} • {shortId(f.findingId)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Evidence list */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <div className="text-sm font-medium">Evidence items</div>
            <div className="mt-1 text-sm text-gray-600">Each evidence item shows which findings it’s linked to.</div>
          </div>

          {loading ? (
            <div className="px-5 py-8 text-sm text-gray-600">Loading…</div>
          ) : evidence.length === 0 ? (
            <div className="px-5 py-8 text-sm text-gray-600">No evidence found for this case.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {evidence.map((ev) => {
                const linkedIds = linkedFindingIdsByEvidence.get(ev.evidenceId) || new Set<string>();
                const linkedList = Array.from(linkedIds)
                  .map((id) => findingsById.get(id))
                  .filter(Boolean) as Finding[];

                return (
                  <div key={ev.evidenceId} className="px-5 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-semibold text-gray-900">{ev.title || "(untitled evidence)"}</div>
                          <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-xs", pillClass(ev.evidenceType || ""))}>
                            {(ev.evidenceType || "unknown").toLowerCase()}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-700 font-medium" title={ev.evidenceId}>
                            {shortId(ev.evidenceId)}
                          </span>

                          {/* ✅ Copy full ID (always copies the full string) */}
                          <CopyButton
                            label="Copy ID"
                            value={ev.evidenceId}
                            onCopied={() => showToast("Evidence ID copied")}
                            className="ml-2"
                          />
                        </div>

                        {/* ✅ Full ID shown (monospace, wraps, no truncation) */}
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="text-gray-500">Evidence ID:</span>{" "}
                          <span className="font-mono break-all">{ev.evidenceId}</span>
                        </div>

                        {ev.description ? <div className="mt-2 text-sm text-gray-700">{ev.description}</div> : null}

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600">
                          {ev.submittedBy ? (
                            <div>
                              <span className="text-gray-500">Submitted by:</span> {ev.submittedBy}
                            </div>
                          ) : null}
                          {ev.submittedAt ? (
                            <div>
                              <span className="text-gray-500">Submitted:</span> {formatMaybe(ev.submittedAt)}
                            </div>
                          ) : null}
                          {ev.sourceUrl ? (
                            <div className="flex items-center gap-2 max-w-[720px]">
                              <span className="text-gray-500">Source URL:</span>{" "}
                              <a className="underline truncate max-w-[520px]" href={ev.sourceUrl} target="_blank" rel="noreferrer">
                                {ev.sourceUrl}
                              </a>
                              <CopyButton label="Copy URL" value={ev.sourceUrl} onCopied={() => showToast("Source URL copied")} />
                            </div>
                          ) : null}
                          {ev.storageRef ? (
                            <div className="max-w-[720px] truncate">
                              <span className="text-gray-500">Storage:</span> {ev.storageRef}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-xs uppercase tracking-wide text-gray-500">Linked findings</div>
                        <div className="mt-1 text-2xl font-semibold text-gray-900">{linkedList.length}</div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      {linkedList.length === 0 ? (
                        <div className="text-sm text-gray-600">None</div>
                      ) : (
                        <div className="space-y-3">
                          {linkedList.map((f) => (
                            <div key={f.findingId} className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <div className="text-sm font-medium text-gray-900">
                                    {f.controlId || "Control"} — {f.controlTitle || "(no title)"}
                                  </div>
                                  <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-xs", pillClass(f.result || ""))}>
                                    {(f.result || "unknown").toLowerCase()}
                                  </span>
                                  {f.severity ? <span className="text-xs text-gray-600">{(f.severity || "").toLowerCase()}</span> : null}
                                </div>

                                {f.rationale ? <div className="mt-1 text-xs text-gray-600">{f.rationale}</div> : null}
                                <div className="mt-1 text-xs text-gray-500 font-mono break-all">{f.findingId}</div>
                              </div>

                              <button
                                onClick={() => removeLink(f.findingId, ev.evidenceId)}
                                disabled={linkBusy}
                                className={cx(
                                  "inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm",
                                  linkBusy ? "text-gray-400" : "hover:bg-gray-50"
                                )}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-gray-200 px-5 py-4">
            <button onClick={() => setShowDebug((s) => !s)} className="text-sm underline text-gray-700 hover:text-gray-900">
              {showDebug ? "Hide" : "Show"} debug payloads
            </button>

            {showDebug && (
              <pre className="mt-3 max-h-[420px] overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(debugPayloads, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
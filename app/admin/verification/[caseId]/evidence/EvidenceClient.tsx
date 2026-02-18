"use client";

import React, { useEffect, useMemo, useState } from "react";

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

type FindingRow = {
  findingId: string;
  caseId: string;
  title: string;
  decision?: string | null;
  severity?: string | null;
  createdAt?: string | null;
};

type LinkRow = {
  findingId: string;
  evidenceId: string;
  createdAt?: string | null;
};

type SummaryRow = {
  evidenceId: string;
  style: string;
  model: string;
  summary: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: text || `HTTP ${res.status}` };
  }
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function keyFor(evidenceId: string, style: string, model: string) {
  return `${evidenceId}||${style}||${model}`;
}

export default function EvidenceClient(props: any) {
  const caseId: string =
    props.caseId || props.params?.caseId || props?.case?.caseId || "CASE-0001";

  const initialEvidence: EvidenceRow[] =
    (Array.isArray(props.evidence) && props.evidence) ||
    (Array.isArray(props.items) && props.items) ||
    (Array.isArray(props.rows) && props.rows) ||
    (Array.isArray(props.initialEvidence) && props.initialEvidence) ||
    [];

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string>("");

  const [evidence, setEvidence] = useState<EvidenceRow[]>(initialEvidence);
  const [findings, setFindings] = useState<FindingRow[]>([]);
  const [links, setLinks] = useState<LinkRow[]>([]);

  // Add evidence form
  const [evType, setEvType] = useState<string>("link");
  const [evTitle, setEvTitle] = useState<string>("");
  const [evDesc, setEvDesc] = useState<string>("");
  const [evSourceUrl, setEvSourceUrl] = useState<string>("");
  const [evStorageRef, setEvStorageRef] = useState<string>("");

  // Link evidence to finding form
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("");
  const [selectedFindingId, setSelectedFindingId] = useState<string>("");

  // AI Summary defaults + per-item overrides
  const [defaultSummaryStyle, setDefaultSummaryStyle] = useState<string>("bullets");
  const [defaultSummaryModel, setDefaultSummaryModel] = useState<string>("snowflake-arctic");

  const [summaryStyleByEvidenceId, setSummaryStyleByEvidenceId] = useState<Record<string, string>>(
    {}
  );
  const [summaryModelByEvidenceId, setSummaryModelByEvidenceId] = useState<Record<string, string>>(
    {}
  );

  // Summary state
  const [summaryLoadingId, setSummaryLoadingId] = useState<string | null>(null);

  // “Generated in session” summary text (keyed by evidence/style/model)
  const [summaryByKey, setSummaryByKey] = useState<Record<string, string>>({});
  const [summaryErrByEvidenceId, setSummaryErrByEvidenceId] = useState<Record<string, string>>({});

  // “Persisted in Snowflake” summary text (keyed by evidence/style/model)
  const [storedByKey, setStoredByKey] = useState<Record<string, SummaryRow>>({});
  const [storedSummaryLoadErr, setStoredSummaryLoadErr] = useState<string>("");

  // Bulk actions
  const [bulkRunning, setBulkRunning] = useState<null | "missing" | "regen">(null);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number; current?: string }>(
    { done: 0, total: 0 }
  );
  const [bulkErr, setBulkErr] = useState<string>("");

  const counts = useMemo(
    () => ({
      evidence: evidence?.length || 0,
      findings: findings?.length || 0,
      links: links?.length || 0,
    }),
    [evidence, findings, links]
  );

  function linkedFindingIdsForEvidence(evidenceId: string) {
    return links.filter((l) => l.evidenceId === evidenceId).map((l) => l.findingId);
  }

  function findingById(id: string) {
    return findings.find((f) => f.findingId === id);
  }

  function getStyleForEvidence(evidenceId: string) {
    return summaryStyleByEvidenceId[evidenceId] || defaultSummaryStyle;
  }

  function getModelForEvidence(evidenceId: string) {
    return summaryModelByEvidenceId[evidenceId] || defaultSummaryModel;
  }

  function getStored(evidenceId: string, style: string, model: string): SummaryRow | null {
    const k = keyFor(evidenceId, style, model);
    return storedByKey[k] || null;
  }

  async function refreshAll() {
    setLoading(true);
    setLoadError("");
    setBulkErr("");

    try {
      const evRes = await fetch(
        `/api/admin/verification/evidence?caseId=${encodeURIComponent(caseId)}`,
        { credentials: "include" }
      );
      const evJson = await safeJson(evRes);
      if (!evRes.ok || !evJson?.ok) {
        throw new Error(evJson?.error || `Evidence fetch failed (HTTP ${evRes.status})`);
      }
      const evRows: EvidenceRow[] = Array.isArray(evJson.rows) ? evJson.rows : [];
      setEvidence(evRows);

      const fRes = await fetch(`/api/admin/verification/${encodeURIComponent(caseId)}/findings`, {
        credentials: "include",
      });
      const fJson = await safeJson(fRes);
      setFindings(!fRes.ok || !fJson?.ok ? [] : Array.isArray(fJson.rows) ? fJson.rows : []);

      const lRes = await fetch(
        `/api/admin/verification/finding-evidence?caseId=${encodeURIComponent(caseId)}`,
        { credentials: "include" }
      );
      const lJson = await safeJson(lRes);
      setLinks(!lRes.ok || !lJson?.ok ? [] : Array.isArray(lJson.rows) ? lJson.rows : []);

      await loadStoredSummaries(evRows.map((r) => r.evidenceId));
    } catch (e: any) {
      setLoadError(e?.message || "Failed to load case evidence.");
    } finally {
      setLoading(false);
    }
  }

  async function loadStoredSummaries(evidenceIds: string[]) {
    setStoredSummaryLoadErr("");
    if (!evidenceIds || evidenceIds.length === 0) return;

    try {
      const batches = chunk(evidenceIds, 30);
      const next: Record<string, SummaryRow> = {};

      for (const b of batches) {
        const qs =
          `caseId=${encodeURIComponent(caseId)}` +
          `&evidenceIds=${encodeURIComponent(b.join(","))}`;

        const res = await fetch(`/api/admin/verification/evidence/summary?${qs}`, {
          credentials: "include",
        });

        const json = await safeJson(res);
        if (!res.ok || !json?.ok) {
          // If not implemented or unauthorized, don't break the page
          continue;
        }

        const rows: any[] = Array.isArray(json.rows) ? json.rows : [];
        for (const r of rows) {
          const evidenceId = String(r.evidenceId ?? r.EVIDENCE_ID ?? "").trim();
          const style = String(r.style ?? r.STYLE ?? "").trim();
          const model = String(r.model ?? r.MODEL ?? "").trim();
          const summary = String(r.summary ?? r.SUMMARY ?? "").trim();
          if (!evidenceId || !style || !model) continue;

          next[keyFor(evidenceId, style, model)] = {
            evidenceId,
            style,
            model,
            summary,
            createdAt: r.createdAt ?? r.CREATED_AT ?? null,
            updatedAt: r.updatedAt ?? r.UPDATED_AT ?? null,
          };
        }
      }

      setStoredByKey((prev) => ({ ...prev, ...next }));
    } catch (e: any) {
      setStoredSummaryLoadErr(e?.message || "Failed to load stored summaries.");
    }
  }

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  async function addEvidence() {
    setLoadError("");

    if (!evTitle.trim()) {
      setLoadError("Title is required.");
      return;
    }
    if (!evSourceUrl.trim() && !evStorageRef.trim()) {
      setLoadError("Provide at least one of Source URL or Storage ref.");
      return;
    }

    const res = await fetch(`/api/admin/verification/evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        caseId,
        evidenceType: evType,
        title: evTitle.trim(),
        description: evDesc.trim() || null,
        sourceUrl: evSourceUrl.trim() || null,
        storageRef: evStorageRef.trim() || null,
      }),
    });

    const json = await safeJson(res);
    if (!res.ok || !json?.ok) {
      setLoadError(json?.error || `Add evidence failed (HTTP ${res.status})`);
      return;
    }

    setEvTitle("");
    setEvDesc("");
    setEvSourceUrl("");
    setEvStorageRef("");
    await refreshAll();
  }

  async function createLink() {
    setLoadError("");

    if (!selectedEvidenceId || !selectedFindingId) {
      setLoadError("Select both an evidence item and a finding.");
      return;
    }

    const res = await fetch(`/api/admin/verification/finding-evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        caseId,
        evidenceId: selectedEvidenceId,
        findingId: selectedFindingId,
      }),
    });

    const json = await safeJson(res);
    if (!res.ok || !json?.ok) {
      setLoadError(json?.error || `Create link failed (HTTP ${res.status})`);
      return;
    }

    setSelectedEvidenceId("");
    setSelectedFindingId("");
    await refreshAll();
  }

  async function removeLink(findingId: string, evidenceId: string) {
    setLoadError("");

    const url = `/api/admin/verification/finding-evidence?caseId=${encodeURIComponent(
      caseId
    )}&findingId=${encodeURIComponent(findingId)}&evidenceId=${encodeURIComponent(evidenceId)}`;

    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });
    const json = await safeJson(res);
    if (!res.ok || !json?.ok) {
      setLoadError(json?.error || `Remove link failed (HTTP ${res.status})`);
      return;
    }

    await refreshAll();
  }

  async function callSummaryApi(args: {
    evidenceId: string;
    style: string;
    model: string;
    force: boolean;
  }): Promise<string> {
    const res = await fetch(`/api/admin/verification/evidence/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        evidenceId: args.evidenceId,
        caseId,
        style: args.style,
        model: args.model,
        persist: true,
        force: args.force,
      }),
    });

    const json = await safeJson(res);
    if (!res.ok || !json?.ok) {
      throw new Error(json?.error || `HTTP ${res.status}`);
    }
    return String(json.summary || "").trim();
  }

  async function runAiSummary(evidenceId: string, opts?: { force?: boolean }) {
    setSummaryLoadingId(evidenceId);
    setSummaryErrByEvidenceId((prev) => ({ ...prev, [evidenceId]: "" }));

    const style = getStyleForEvidence(evidenceId);
    const model = getModelForEvidence(evidenceId);
    const k = keyFor(evidenceId, style, model);

    try {
      const s = await callSummaryApi({
        evidenceId,
        style,
        model,
        force: !!opts?.force,
      });

      setSummaryByKey((prev) => ({ ...prev, [k]: s }));
      setStoredByKey((prev) => ({
        ...prev,
        [k]: {
          evidenceId,
          style,
          model,
          summary: s,
          updatedAt: new Date().toISOString(),
        },
      }));
    } catch (e: any) {
      setSummaryErrByEvidenceId((prev) => ({
        ...prev,
        [evidenceId]: e?.message || "Summary failed",
      }));
    } finally {
      setSummaryLoadingId(null);
    }
  }

  async function summarizeAllMissing() {
    if (bulkRunning) return;
    setBulkRunning("missing");
    setBulkErr("");

    try {
      const targets = evidence
        .map((e) => {
          const style = getStyleForEvidence(e.evidenceId);
          const model = getModelForEvidence(e.evidenceId);
          const stored = getStored(e.evidenceId, style, model);
          return { evidenceId: e.evidenceId, style, model, hasStored: !!stored };
        })
        .filter((t) => !t.hasStored);

      setBulkProgress({ done: 0, total: targets.length });

      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        setBulkProgress({ done: i, total: targets.length, current: t.evidenceId });

        const k = keyFor(t.evidenceId, t.style, t.model);
        setSummaryErrByEvidenceId((prev) => ({ ...prev, [t.evidenceId]: "" }));

        try {
          const s = await callSummaryApi({
            evidenceId: t.evidenceId,
            style: t.style,
            model: t.model,
            force: false,
          });

          setSummaryByKey((prev) => ({ ...prev, [k]: s }));
          setStoredByKey((prev) => ({
            ...prev,
            [k]: {
              evidenceId: t.evidenceId,
              style: t.style,
              model: t.model,
              summary: s,
              updatedAt: new Date().toISOString(),
            },
          }));
        } catch (e: any) {
          setSummaryErrByEvidenceId((prev) => ({
            ...prev,
            [t.evidenceId]: e?.message || "Summary failed",
          }));
        }
      }

      setBulkProgress((p) => ({ ...p, done: p.total, current: undefined }));
    } catch (e: any) {
      setBulkErr(e?.message || "Bulk summarize failed");
    } finally {
      setBulkRunning(null);
    }
  }

  async function regenerateAll() {
    if (bulkRunning) return;
    setBulkRunning("regen");
    setBulkErr("");

    try {
      const targets = evidence.map((e) => {
        const style = getStyleForEvidence(e.evidenceId);
        const model = getModelForEvidence(e.evidenceId);
        return { evidenceId: e.evidenceId, style, model };
      });

      setBulkProgress({ done: 0, total: targets.length });

      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        setBulkProgress({ done: i, total: targets.length, current: t.evidenceId });

        const k = keyFor(t.evidenceId, t.style, t.model);
        setSummaryErrByEvidenceId((prev) => ({ ...prev, [t.evidenceId]: "" }));

        try {
          const s = await callSummaryApi({
            evidenceId: t.evidenceId,
            style: t.style,
            model: t.model,
            force: true,
          });

          setSummaryByKey((prev) => ({ ...prev, [k]: s }));
          setStoredByKey((prev) => ({
            ...prev,
            [k]: {
              evidenceId: t.evidenceId,
              style: t.style,
              model: t.model,
              summary: s,
              updatedAt: new Date().toISOString(),
            },
          }));
        } catch (e: any) {
          setSummaryErrByEvidenceId((prev) => ({
            ...prev,
            [t.evidenceId]: e?.message || "Summary failed",
          }));
        }
      }

      setBulkProgress((p) => ({ ...p, done: p.total, current: undefined }));
    } catch (e: any) {
      setBulkErr(e?.message || "Bulk regenerate failed");
    } finally {
      setBulkRunning(null);
    }
  }

  const missingCount = useMemo(() => {
    let n = 0;
    for (const e of evidence) {
      const style = getStyleForEvidence(e.evidenceId);
      const model = getModelForEvidence(e.evidenceId);
      if (!getStored(e.evidenceId, style, model)) n++;
    }
    return n;
  }, [evidence, summaryStyleByEvidenceId, summaryModelByEvidenceId, defaultSummaryStyle, defaultSummaryModel, storedByKey]);

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded p-3 text-sm">
          {loadError}
        </div>
      ) : null}

      {storedSummaryLoadErr ? (
        <div className="border border-amber-300 bg-amber-50 text-amber-900 rounded p-3 text-sm">
          {storedSummaryLoadErr}
        </div>
      ) : null}

      {bulkErr ? (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded p-3 text-sm">
          {bulkErr}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
          onClick={refreshAll}
          disabled={loading || !!bulkRunning}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={summarizeAllMissing}
            className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
            disabled={loading || !!bulkRunning || evidence.length === 0 || missingCount === 0}
            title="Generate and persist summaries for items that don’t yet have a stored summary (for their current style/model)"
          >
            {bulkRunning === "missing" ? "Summarizing..." : `Summarize all missing (${missingCount})`}
          </button>

          <button
            onClick={regenerateAll}
            className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
            disabled={loading || !!bulkRunning || evidence.length === 0}
            title="Force regenerate and persist summaries for all evidence items (for their current style/model)"
          >
            {bulkRunning === "regen" ? "Regenerating..." : "Regenerate all"}
          </button>

          {bulkRunning ? (
            <div className="text-xs text-gray-600">
              {bulkProgress.done}/{bulkProgress.total}
              {bulkProgress.current ? ` • ${bulkProgress.current}` : ""}
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex gap-3 text-sm">
          <div className="border rounded px-3 py-2 min-w-[140px]">
            <div className="text-[11px] text-gray-500">EVIDENCE ITEMS</div>
            <div className="text-lg font-semibold">{counts.evidence}</div>
          </div>
          <div className="border rounded px-3 py-2 min-w-[140px]">
            <div className="text-[11px] text-gray-500">FINDINGS</div>
            <div className="text-lg font-semibold">{counts.findings}</div>
          </div>
          <div className="border rounded px-3 py-2 min-w-[140px]">
            <div className="text-[11px] text-gray-500">LINKS</div>
            <div className="text-lg font-semibold">{counts.links}</div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <div className="font-semibold">AI Summary defaults</div>
        <div className="text-xs text-gray-500">
          Used when you click “AI Summary” unless you override style/model per evidence item.
          Summaries are persisted when generated.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Default style</label>
            <select
              className="w-full border rounded px-2 py-2 text-sm"
              value={defaultSummaryStyle}
              onChange={(e) => setDefaultSummaryStyle(e.target.value)}
              disabled={!!bulkRunning}
            >
              <option value="bullets">bullets</option>
              <option value="short">short</option>
              <option value="detailed">detailed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Default model</label>
            <input
              className="w-full border rounded px-2 py-2 text-sm"
              value={defaultSummaryModel}
              onChange={(e) => setDefaultSummaryModel(e.target.value)}
              placeholder="e.g., snowflake-arctic"
              disabled={!!bulkRunning}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Add evidence</div>
            <div className="text-xs text-gray-500">
              Creates a real evidence row in Snowflake for this case.
            </div>
          </div>
          <button
            onClick={addEvidence}
            className="px-3 py-1.5 rounded text-sm bg-black text-white hover:bg-gray-800"
            disabled={!!bulkRunning}
          >
            Add evidence
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Evidence type</label>
            <select
              className="w-full border rounded px-2 py-2 text-sm"
              value={evType}
              onChange={(e) => setEvType(e.target.value)}
              disabled={!!bulkRunning}
            >
              <option value="link">link</option>
              <option value="document">document</option>
              <option value="policy">policy</option>
              <option value="other">other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Title (required)</label>
            <input
              className="w-full border rounded px-2 py-2 text-sm"
              value={evTitle}
              onChange={(e) => setEvTitle(e.target.value)}
              placeholder="e.g., Human Governance Policy v1.0"
              disabled={!!bulkRunning}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Description (optional)</label>
          <input
            className="w-full border rounded px-2 py-2 text-sm"
            value={evDesc}
            onChange={(e) => setEvDesc(e.target.value)}
            placeholder="Short note about what this evidence supports..."
            disabled={!!bulkRunning}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Source URL (optional)</label>
            <input
              className="w-full border rounded px-2 py-2 text-sm"
              value={evSourceUrl}
              onChange={(e) => setEvSourceUrl(e.target.value)}
              placeholder="https://..."
              disabled={!!bulkRunning}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Storage ref (optional)</label>
            <input
              className="w-full border rounded px-2 py-2 text-sm"
              value={evStorageRef}
              onChange={(e) => setEvStorageRef(e.target.value)}
              placeholder="@STAGE/path/file.pdf or local ref"
              disabled={!!bulkRunning}
            />
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Note: you must provide at least one of Source URL or Storage ref.
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Link evidence to a finding</div>
            <div className="text-xs text-gray-500">
              Select an evidence item and a finding, then create the link.
            </div>
          </div>
          <button
            onClick={createLink}
            className="px-3 py-1.5 rounded text-sm border bg-white hover:bg-gray-50"
            disabled={!!bulkRunning}
          >
            Create link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Evidence</label>
            <select
              className="w-full border rounded px-2 py-2 text-sm"
              value={selectedEvidenceId}
              onChange={(e) => setSelectedEvidenceId(e.target.value)}
              disabled={!!bulkRunning}
            >
              <option value="">Select evidence...</option>
              {evidence.map((e) => (
                <option key={e.evidenceId} value={e.evidenceId}>
                  {e.title} ({e.evidenceType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Finding</label>
            <select
              className="w-full border rounded px-2 py-2 text-sm"
              value={selectedFindingId}
              onChange={(e) => setSelectedFindingId(e.target.value)}
              disabled={!!bulkRunning}
            >
              <option value="">Select finding...</option>
              {findings.map((f) => (
                <option key={f.findingId} value={f.findingId}>
                  {f.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="border-b p-3">
          <div className="font-semibold">Evidence items</div>
          <div className="text-xs text-gray-500">
            Each evidence item shows which findings it’s linked to.
          </div>
        </div>

        <div className="p-3 space-y-3">
          {evidence.length === 0 ? (
            <div className="text-sm text-gray-600">No evidence found for this case.</div>
          ) : (
            evidence.map((e) => {
              const linkedIds = linkedFindingIdsForEvidence(e.evidenceId);

              const style = getStyleForEvidence(e.evidenceId);
              const model = getModelForEvidence(e.evidenceId);
              const k = keyFor(e.evidenceId, style, model);

              const stored = getStored(e.evidenceId, style, model);
              const current = summaryByKey[k] || "";
              const displayedSummary = current || stored?.summary || "";

              return (
                <div key={e.evidenceId} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{e.title}</div>
                      <div className="text-xs text-gray-500">Evidence ID: {e.evidenceId}</div>
                      <div className="text-xs text-gray-500">
                        Submitted by: {e.submittedBy || "—"}{" "}
                        {e.submittedAt ? `• Submitted: ${e.submittedAt}` : ""}
                      </div>

                      {e.sourceUrl ? (
                        <div className="text-xs text-gray-500">
                          Source URL:{" "}
                          <a className="underline" href={e.sourceUrl} target="_blank" rel="noreferrer">
                            {e.sourceUrl}
                          </a>
                        </div>
                      ) : null}

                      {e.storageRef ? (
                        <div className="text-xs text-gray-500">Storage: {e.storageRef}</div>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-gray-500">LINKED FINDINGS</div>
                      <div className="text-lg font-semibold">{linkedIds.length}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Style</label>
                      <select
                        className="w-full border rounded px-2 py-2 text-sm"
                        value={style}
                        onChange={(ev) =>
                          setSummaryStyleByEvidenceId((prev) => ({
                            ...prev,
                            [e.evidenceId]: ev.target.value,
                          }))
                        }
                        disabled={!!bulkRunning}
                      >
                        <option value="bullets">bullets</option>
                        <option value="short">short</option>
                        <option value="detailed">detailed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Model</label>
                      <input
                        className="w-full border rounded px-2 py-2 text-sm"
                        value={model}
                        onChange={(ev) =>
                          setSummaryModelByEvidenceId((prev) => ({
                            ...prev,
                            [e.evidenceId]: ev.target.value,
                          }))
                        }
                        placeholder="snowflake-arctic"
                        disabled={!!bulkRunning}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => runAiSummary(e.evidenceId, { force: false })}
                      className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
                      disabled={summaryLoadingId === e.evidenceId || !!bulkRunning}
                    >
                      {summaryLoadingId === e.evidenceId ? "Generating..." : "AI Summary"}
                    </button>

                    <button
                      onClick={() => runAiSummary(e.evidenceId, { force: true })}
                      className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
                      disabled={summaryLoadingId === e.evidenceId || !!bulkRunning}
                      title="Force regenerate and persist"
                    >
                      Regenerate
                    </button>

                    <div className="text-xs text-gray-500">
                      Powered by Snowflake Cortex (fallback available)
                    </div>

                    <div className="text-xs text-gray-500">
                      {stored?.summary ? "• Stored summary found" : "• No stored summary found"}
                    </div>
                  </div>

                  {summaryErrByEvidenceId[e.evidenceId] ? (
                    <div className="border border-red-300 bg-red-50 text-red-700 rounded p-2 text-sm">
                      {summaryErrByEvidenceId[e.evidenceId]}
                    </div>
                  ) : null}

                  <div className="border rounded p-3 bg-gray-50 text-sm whitespace-pre-wrap">
                    {displayedSummary || "None"}
                  </div>

                  <div className="space-y-2">
                    {linkedIds.length === 0 ? (
                      <div className="text-sm text-gray-600">None</div>
                    ) : (
                      linkedIds.map((fid) => {
                        const f = findingById(fid);
                        return (
                          <div
                            key={`${fid}-${e.evidenceId}`}
                            className="flex items-center justify-between gap-2 border rounded p-2"
                          >
                            <div className="text-sm">
                              <span className="font-semibold">{f?.title || fid}</span>{" "}
                              {f?.decision ? (
                                <span
                                  className={clsx(
                                    "ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs",
                                    f.decision === "pass"
                                      ? "bg-green-100 text-green-800"
                                      : f.decision === "fail"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  )}
                                >
                                  {f.decision}
                                </span>
                              ) : null}
                              {f?.severity ? (
                                <span className="ml-2 text-xs text-gray-600">{f.severity}</span>
                              ) : null}
                              <div className="text-xs text-gray-500">{fid}</div>
                            </div>

                            <button
                              className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
                              onClick={() => removeLink(fid, e.evidenceId)}
                              disabled={!!bulkRunning}
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
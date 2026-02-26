"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * EvidencePageClient
 * - Full interactive Evidence workflow:
 *   - governance metrics
 *   - AI summary defaults
 *   - Add evidence form
 *   - Link evidence to finding
 *   - Evidence list w/ summaries + bulk summarize/regenerate
 *
 * Uses existing API routes:
 * - GET/POST   /api/admin/verification/evidence?caseId=...
 * - GET        /api/admin/verification/[caseId]/findings
 * - GET/POST/DELETE /api/admin/verification/finding-evidence
 * - GET/POST   /api/admin/verification/evidence/summary
 */

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

export default function EvidencePageClient(props: { caseId: string }) {
  const caseId = props.caseId;

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string>("");

  const [evidence, setEvidence] = useState<EvidenceRow[]>([]);
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
  const [summaryByKey, setSummaryByKey] = useState<Record<string, string>>({});
  const [summaryErrByEvidenceId, setSummaryErrByEvidenceId] = useState<Record<string, string>>({});

  // Stored in Snowflake (persisted)
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
      evidence: evidence.length,
      findings: findings.length,
      links: links.length,
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

        // NOTE: GET route lives at /api/admin/verification/evidence/summary
        const res = await fetch(`/api/admin/verification/evidence/summary?${qs}`, {
          credentials: "include",
          cache: "no-store",
        });

        const json = await safeJson(res);
        if (!res.ok || !json?.ok) continue;

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

  async function refreshAll() {
    setLoading(true);
    setLoadError("");
    setBulkErr(""); // ✅ fixed: remove duplicate call

    try {
      const evRes = await fetch(
        `/api/admin/verification/evidence?caseId=${encodeURIComponent(caseId)}`,
        { credentials: "include", cache: "no-store" }
      );
      const evJson = await safeJson(evRes);
      if (!evRes.ok || !evJson?.ok) {
        throw new Error(evJson?.error || `Evidence fetch failed (HTTP ${evRes.status})`);
      }
      const evRows: EvidenceRow[] = Array.isArray(evJson.rows) ? evJson.rows : [];
      setEvidence(evRows);

      const fRes = await fetch(`/api/admin/verification/${encodeURIComponent(caseId)}/findings`, {
        credentials: "include",
        cache: "no-store",
      });
      const fJson = await safeJson(fRes);
      setFindings(!fRes.ok || !fJson?.ok ? [] : Array.isArray(fJson.rows) ? fJson.rows : []);

      const lRes = await fetch(
        `/api/admin/verification/finding-evidence?caseId=${encodeURIComponent(caseId)}`,
        { credentials: "include", cache: "no-store" }
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

    const url = `/api/admin/verification/evidence?caseId=${encodeURIComponent(caseId)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
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

  const missingCount = useMemo(() => {
    let n = 0;
    for (const e of evidence) {
      const style = getStyleForEvidence(e.evidenceId);
      const model = getModelForEvidence(e.evidenceId);
      if (!getStored(e.evidenceId, style, model)) n++;
    }
    return n;
  }, [
    evidence,
    summaryStyleByEvidenceId,
    summaryModelByEvidenceId,
    defaultSummaryStyle,
    defaultSummaryModel,
    storedByKey,
  ]);

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

  return (
    <div className="space-y-6">
      {/* 🔎 Deterministic marker: proves THIS component is rendering */}
      <div className="mb-3 rounded border border-fuchsia-300 bg-fuchsia-50 px-3 py-2 text-xs text-fuchsia-900">
        EVIDENCE_PAGE_CLIENT_RENDERED_2026_02_20
      </div>

      {/* Errors */}
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

      {/* Governance metrics header */}
      <div className="border rounded-2xl p-4 bg-white">
        <div className="text-sm font-semibold mb-3">Governance metrics</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <MetricCard label="EVIDENCE ITEMS" value={counts.evidence} />
          <MetricCard label="FINDINGS" value={counts.findings} />
          <MetricCard label="LINKS" value={counts.links} />
          <MetricCard
            label="SUMMARIES STORED"
            value={Object.keys(storedByKey).length || "—"}
            sub="Auto-detected if endpoint exists"
          />
          <MetricCard label="LAST SUMMARY UPDATE" value="—" sub="(computed client-side)" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
          onClick={refreshAll}
          disabled={loading || !!bulkRunning}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>

        <button
          onClick={summarizeAllMissing}
          className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
          disabled={loading || !!bulkRunning || evidence.length === 0 || missingCount === 0}
        >
          {bulkRunning === "missing" ? "Summarizing..." : `Summarize all missing (${missingCount})`}
        </button>

        <button
          onClick={regenerateAll}
          className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
          disabled={loading || !!bulkRunning || evidence.length === 0}
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

      {/* AI defaults */}
      <div className="border rounded-2xl p-4 bg-white space-y-3">
        <div className="font-semibold">AI Summary defaults</div>
        <div className="text-xs text-gray-600">
          Used when you click “AI Summary” unless you override style/model per evidence item. Summaries are persisted
          when generated.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">Default style</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={defaultSummaryStyle}
              onChange={(e) => setDefaultSummaryStyle(e.target.value)}
            >
              <option value="bullets">bullets</option>
              <option value="short">short</option>
              <option value="detailed">detailed</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Default model</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={defaultSummaryModel}
              onChange={(e) => setDefaultSummaryModel(e.target.value)}
              placeholder="snowflake-arctic"
            />
          </div>
        </div>
      </div>

      {/* Add evidence */}
      <div className="border rounded-2xl p-4 bg-white space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Add evidence</div>
            <div className="text-xs text-gray-600">
              Creates a real evidence row in Snowflake for this case.
            </div>
          </div>

          <button
            className="px-3 py-2 rounded bg-black text-white text-sm font-semibold"
            onClick={addEvidence}
            disabled={loading || !!bulkRunning}
          >
            Add evidence
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">Evidence type</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={evType}
              onChange={(e) => setEvType(e.target.value)}
            >
              <option value="link">link</option>
              <option value="document">document</option>
              <option value="policy">policy</option>
              <option value="audit">audit</option>
              <option value="report">report</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Title (required)</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={evTitle}
              onChange={(e) => setEvTitle(e.target.value)}
              placeholder="e.g., Human Governance Policy v1.0"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700">Description (optional)</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2 text-sm"
            value={evDesc}
            onChange={(e) => setEvDesc(e.target.value)}
            placeholder="Short note about what this evidence supports..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">Source URL (optional)</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={evSourceUrl}
              onChange={(e) => setEvSourceUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Storage ref (optional)</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={evStorageRef}
              onChange={(e) => setEvStorageRef(e.target.value)}
              placeholder="@STAGE/path/file.pdf or local ref"
            />
          </div>
        </div>

        <div className="text-[11px] text-gray-500">
          Note: you must provide at least one of Source URL or Storage ref.
        </div>
      </div>

      {/* Link evidence to finding */}
      <div className="border rounded-2xl p-4 bg-white space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Link evidence to a finding</div>
            <div className="text-xs text-gray-600">
              Select an evidence item and a finding, then create the link.
            </div>
          </div>

          <button
            className="px-3 py-2 rounded border text-sm font-semibold bg-white hover:bg-gray-50"
            onClick={createLink}
            disabled={!selectedEvidenceId || !selectedFindingId}
          >
            Create link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">Evidence</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={selectedEvidenceId}
              onChange={(e) => setSelectedEvidenceId(e.target.value)}
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
            <label className="text-xs font-semibold text-gray-700">Finding</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={selectedFindingId}
              onChange={(e) => setSelectedFindingId(e.target.value)}
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

      {/* Evidence list */}
      <div className="border rounded-2xl p-4 bg-white space-y-3">
        <div className="font-semibold">Evidence items</div>
        <div className="text-xs text-gray-600">
          Each evidence item shows which findings it’s linked to.
        </div>

        {evidence.length === 0 ? (
          <div className="text-sm text-gray-600">No evidence found for this case.</div>
        ) : (
          <div className="space-y-3">
            {evidence.map((e) => {
              const style = getStyleForEvidence(e.evidenceId);
              const model = getModelForEvidence(e.evidenceId);
              const k = keyFor(e.evidenceId, style, model);
              const stored = getStored(e.evidenceId, style, model);
              const sessionSummary = summaryByKey[k];
              const err = summaryErrByEvidenceId[e.evidenceId];
              const linked = linkedFindingIdsForEvidence(e.evidenceId);

              return (
                <div key={e.evidenceId} className="border rounded-xl p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500">{e.evidenceType}</div>
                      <div className="font-semibold">{e.title}</div>
                      {e.description ? (
                        <div className="text-sm text-gray-700 mt-1">{e.description}</div>
                      ) : null}
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        ID: {e.evidenceId}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        className="px-3 py-2 rounded bg-black text-white text-xs font-semibold"
                        onClick={() => runAiSummary(e.evidenceId, { force: false })}
                        disabled={summaryLoadingId === e.evidenceId}
                      >
                        {summaryLoadingId === e.evidenceId ? "Summarizing..." : "AI Summary"}
                      </button>

                      <button
                        className="px-3 py-2 rounded border text-xs font-semibold bg-white hover:bg-gray-50"
                        onClick={() => runAiSummary(e.evidenceId, { force: true })}
                        disabled={summaryLoadingId === e.evidenceId}
                      >
                        Force regenerate
                      </button>
                    </div>
                  </div>

                  {/* Per-item overrides */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700">Style</label>
                      <select
                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                        value={summaryStyleByEvidenceId[e.evidenceId] || ""}
                        onChange={(ev) =>
                          setSummaryStyleByEvidenceId((p) => ({
                            ...p,
                            [e.evidenceId]: ev.target.value,
                          }))
                        }
                      >
                        <option value="">(default: {defaultSummaryStyle})</option>
                        <option value="bullets">bullets</option>
                        <option value="short">short</option>
                        <option value="detailed">detailed</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-700">Model</label>
                      <input
                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                        value={summaryModelByEvidenceId[e.evidenceId] || ""}
                        onChange={(ev) =>
                          setSummaryModelByEvidenceId((p) => ({
                            ...p,
                            [e.evidenceId]: ev.target.value,
                          }))
                        }
                        placeholder={`(default: ${defaultSummaryModel})`}
                      />
                    </div>
                  </div>

                  {/* Linked findings */}
                  <div className="mt-3 text-sm">
                    <div className="text-xs font-semibold text-gray-700 mb-1">Linked findings</div>
                    {linked.length === 0 ? (
                      <div className="text-xs text-gray-500">No links for this evidence yet.</div>
                    ) : (
                      <div className="space-y-1">
                        {linked.map((fid) => {
                          const f = findingById(fid);
                          return (
                            <div key={fid} className="flex items-center justify-between gap-3">
                              <div className="text-sm">
                                <span className="font-mono text-xs text-gray-500">{fid}</span>
                                <span className="ml-2">{f?.title || "(missing finding title)"}</span>
                              </div>
                              <button
                                className="text-xs px-2 py-1 border rounded bg-white hover:bg-gray-50"
                                onClick={() => removeLink(fid, e.evidenceId)}
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Stored summary */}
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-gray-700 mb-1">Stored summary</div>

                    {err ? (
                      <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
                        {err}
                      </div>
                    ) : null}

                    {stored?.summary ? (
                      <div className="text-sm whitespace-pre-wrap border rounded p-3 bg-gray-50">
                        {stored.summary}
                      </div>
                    ) : sessionSummary ? (
                      <div className="text-sm whitespace-pre-wrap border rounded p-3 bg-gray-50">
                        {sessionSummary}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        No stored summary yet for this style/model.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-sm">
          <a className="text-blue-600 underline" href="/demo">
            ← Back to Demo Guide
          </a>
          <span className="mx-2 text-gray-400">·</span>
          <a
            className="text-blue-600 underline"
            href={`/api/admin/verification/evidence?caseId=${encodeURIComponent(caseId)}`}
            target="_blank"
            rel="noreferrer"
          >
            View JSON endpoint
          </a>
        </div>
      </div>
    </div>
  );
}

function MetricCard(props: { label: string; value: any; sub?: string }) {
  return (
    <div className="border rounded-xl px-3 py-3">
      <div className="text-[11px] text-gray-500">{props.label}</div>
      <div className="text-lg font-semibold">{props.value}</div>
      {props.sub ? <div className="text-[11px] text-gray-500 mt-1">{props.sub}</div> : null}
    </div>
  );
}
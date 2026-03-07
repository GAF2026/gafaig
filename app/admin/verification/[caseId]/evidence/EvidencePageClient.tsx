"use client";

import React, { useEffect, useMemo, useState } from "react";
import CaseTabs from "../_components/CaseTabs";

/**
 * EvidencePageClient
 * - Full interactive Evidence workflow:
 *   - governance metrics
 *   - AI summary defaults
 *   - Add evidence form
 *   - Link evidence to finding
 *   - Evidence list w/ summaries + bulk summarize/regenerate
 */

type EvidenceRow = {
  evidenceId: string;
  caseId: string;
  evidenceType: string;
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

function tsToNumber(ts?: string | null) {
  if (!ts) return 0;
  const n = Date.parse(ts);
  return Number.isFinite(n) ? n : 0;
}

function prettify(value: string | null | undefined) {
  if (!value) return "—";
  return value.replaceAll("_", " ").replaceAll("-", " ");
}

export default function EvidencePageClient(props: { caseId: string }) {
  const caseId = props.caseId;

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [evidence, setEvidence] = useState<EvidenceRow[]>([]);
  const [findings, setFindings] = useState<FindingRow[]>([]);
  const [links, setLinks] = useState<LinkRow[]>([]);

  const [evType, setEvType] = useState<string>("link");
  const [evTitle, setEvTitle] = useState<string>("");
  const [evDesc, setEvDesc] = useState<string>("");
  const [evSourceUrl, setEvSourceUrl] = useState<string>("");
  const [evStorageRef, setEvStorageRef] = useState<string>("");

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("");
  const [selectedFindingId, setSelectedFindingId] = useState<string>("");

  const [defaultSummaryStyle, setDefaultSummaryStyle] = useState<string>("bullets");
  const [defaultSummaryModel, setDefaultSummaryModel] = useState<string>("snowflake-arctic");
  const [summaryStyleByEvidenceId, setSummaryStyleByEvidenceId] = useState<Record<string, string>>(
    {}
  );
  const [summaryModelByEvidenceId, setSummaryModelByEvidenceId] = useState<Record<string, string>>(
    {}
  );

  const [summaryLoadingId, setSummaryLoadingId] = useState<string | null>(null);
  const [summaryByKey, setSummaryByKey] = useState<Record<string, string>>({});
  const [summaryErrByEvidenceId, setSummaryErrByEvidenceId] = useState<Record<string, string>>({});

  const [storedByKey, setStoredByKey] = useState<Record<string, SummaryRow>>({});
  const [storedSummaryLoadErr, setStoredSummaryLoadErr] = useState<string>("");

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

  const storedEvidenceCount = useMemo(() => {
    const set = new Set<string>();
    for (const k of Object.keys(storedByKey)) {
      const evidenceId = k.split("||")[0] || "";
      if (evidenceId) set.add(evidenceId);
    }
    return set.size;
  }, [storedByKey]);

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

  function getAnyStoredForEvidence(evidenceId: string): SummaryRow | null {
    let best: SummaryRow | null = null;
    let bestTs = -1;

    for (const [k, row] of Object.entries(storedByKey)) {
      if (!k.startsWith(`${evidenceId}||`)) continue;
      const t = Math.max(tsToNumber(row.updatedAt), tsToNumber(row.createdAt));
      if (!best || t > bestTs) {
        best = row;
        bestTs = t;
      }
    }
    return best;
  }

  async function loadStoredSummaries(evidenceIds: string[]) {
    setStoredSummaryLoadErr("");
    if (!evidenceIds || evidenceIds.length === 0) return;

    const allow = new Set(evidenceIds);

    try {
      const res = await fetch(`/api/admin/verification/${encodeURIComponent(caseId)}/summaries`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const json = await safeJson(res);
      if (res.ok && json?.ok && json?.summaries && typeof json.summaries === "object") {
        const next: Record<string, SummaryRow> = {};
        for (const [evidenceId, r] of Object.entries<any>(json.summaries)) {
          const eid = String((r as any)?.evidenceId ?? evidenceId ?? "").trim();
          if (!eid || !allow.has(eid)) continue;

          const style = String((r as any)?.style ?? "bullets").trim() || "bullets";
          const model = String((r as any)?.model ?? "unknown").trim() || "unknown";
          const summary = String((r as any)?.summary ?? "").trim();

          if (!summary) continue;

          next[keyFor(eid, style, model)] = {
            evidenceId: eid,
            style,
            model,
            summary,
            createdAt: (r as any)?.createdAt ?? null,
            updatedAt: (r as any)?.updatedAt ?? null,
          };
        }

        setStoredByKey((prev) => ({ ...prev, ...next }));
        return;
      }
    } catch (e: any) {
      console.warn("loadStoredSummaries: canonical endpoint failed", e?.message || e);
    }

    try {
      const batches = chunk(evidenceIds, 30);
      const next: Record<string, SummaryRow> = {};

      for (const b of batches) {
        const qs =
          `caseId=${encodeURIComponent(caseId)}` +
          `&evidenceIds=${encodeURIComponent(b.join(","))}`;

        const res = await fetch(`/api/admin/verification/evidence/summary?${qs}`, {
          credentials: "include",
          cache: "no-store",
        });

        const json = await safeJson(res);
        if (!res.ok || !json?.ok) continue;

        const rows: any[] = Array.isArray(json.rows) ? json.rows : [];
        for (const r of rows) {
          const evidenceId = String(r.evidenceId ?? r.EVIDENCE_ID ?? "").trim();
          if (!evidenceId || !allow.has(evidenceId)) continue;

          const style = String(r.style ?? r.STYLE ?? "").trim();
          const model = String(r.model ?? r.MODEL ?? "").trim();
          const summary = String(r.summary ?? r.SUMMARY ?? "").trim();
          if (!style || !model || !summary) continue;

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
    setBulkErr("");

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
    <div className="space-y-8">
      <CaseTabs caseId={caseId} />

      {(loadError || storedSummaryLoadErr || bulkErr) ? (
        <div className="space-y-3">
          {loadError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
              {loadError}
            </div>
          ) : null}

          {storedSummaryLoadErr ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] text-amber-900">
              {storedSummaryLoadErr}
            </div>
          ) : null}

          {bulkErr ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
              {bulkErr}
            </div>
          ) : null}
        </div>
      ) : null}

      <section className="rounded-2xl border border-black/10 p-5">
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-semibold text-black">Governance metrics</h2>
            <div className="mt-1 text-[14px] text-black/60">
              Live evidence workflow counts for this case.
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
              onClick={refreshAll}
              disabled={loading || !!bulkRunning}
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>

            <button
              onClick={summarizeAllMissing}
              className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04] disabled:opacity-50"
              disabled={loading || !!bulkRunning || evidence.length === 0 || missingCount === 0}
            >
              {bulkRunning === "missing" ? "Summarizing…" : `Summarize all missing (${missingCount})`}
            </button>

            <button
              onClick={regenerateAll}
              className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04] disabled:opacity-50"
              disabled={loading || !!bulkRunning || evidence.length === 0}
            >
              {bulkRunning === "regen" ? "Regenerating…" : "Regenerate all"}
            </button>
          </div>
        </div>

        {bulkRunning ? (
          <div className="mb-4 text-[13px] text-black/60">
            {bulkProgress.done}/{bulkProgress.total}
            {bulkProgress.current ? ` • ${bulkProgress.current}` : ""}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-5">
          <MetricCard label="Evidence items" value={counts.evidence} />
          <MetricCard label="Findings" value={counts.findings} />
          <MetricCard label="Links" value={counts.links} />
          <MetricCard
            label="Evidence w/ summary"
            value={storedEvidenceCount || "—"}
            sub="Any stored summary for an evidenceId"
          />
          <MetricCard label="Last summary update" value="—" sub="Computed client-side" />
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 p-5">
        <h2 className="text-[16px] font-semibold text-black">AI summary defaults</h2>
        <p className="mt-2 text-[14px] leading-[1.7] text-black/60">
          Used when you click AI Summary unless you override style or model per evidence item.
          Summaries are persisted when generated.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
              Default style
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              value={defaultSummaryStyle}
              onChange={(e) => setDefaultSummaryStyle(e.target.value)}
            >
              <option value="bullets">bullets</option>
              <option value="short">short</option>
              <option value="detailed">detailed</option>
            </select>
          </div>

          <div>
            <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
              Default model
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              value={defaultSummaryModel}
              onChange={(e) => setDefaultSummaryModel(e.target.value)}
              placeholder="snowflake-arctic"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-[16px] font-semibold text-black">Add evidence</h2>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/60">
              Create a real evidence row in Snowflake for this case.
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-[14px] font-semibold text-white hover:bg-black/90"
            onClick={addEvidence}
            disabled={loading || !!bulkRunning}
          >
            Add evidence
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
              Evidence type
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
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
            <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
              Title (required)
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              value={evTitle}
              onChange={(e) => setEvTitle(e.target.value)}
              placeholder="e.g., Human Governance Policy v1.0"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
            Description (optional)
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
            value={evDesc}
            onChange={(e) => setEvDesc(e.target.value)}
            placeholder="Short note about what this evidence supports..."
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
              Source URL (optional)
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              value={evSourceUrl}
              onChange={(e) => setEvSourceUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
              Storage ref (optional)
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              value={evStorageRef}
              onChange={(e) => setEvStorageRef(e.target.value)}
              placeholder="@STAGE/path/file.pdf or local ref"
            />
          </div>
        </div>

        <div className="mt-3 text-[12px] text-black/50">
          You must provide at least one of Source URL or Storage ref.
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-[16px] font-semibold text-black">Link evidence to a finding</h2>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/60">
              Select an evidence item and a finding, then create the link.
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-3 text-[14px] font-semibold hover:bg-black/[0.04] disabled:opacity-50"
            onClick={createLink}
            disabled={!selectedEvidenceId || !selectedFindingId}
          >
            Create link
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
              Evidence
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
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
            <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
              Finding
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
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
      </section>

      <section className="rounded-2xl border border-black/10 p-5">
        <h2 className="text-[16px] font-semibold text-black">Evidence items</h2>
        <p className="mt-2 text-[14px] leading-[1.7] text-black/60">
          Each evidence item shows its linked findings and available stored summaries.
        </p>

        {evidence.length === 0 ? (
          <div className="mt-5 text-[14px] text-black/60">No evidence found for this case.</div>
        ) : (
          <div className="mt-5 space-y-4">
            {evidence.map((e) => {
              const style = getStyleForEvidence(e.evidenceId);
              const model = getModelForEvidence(e.evidenceId);
              const k = keyFor(e.evidenceId, style, model);

              const storedExact = getStored(e.evidenceId, style, model);
              const storedAny = storedExact ? null : getAnyStoredForEvidence(e.evidenceId);

              const sessionSummary = summaryByKey[k];
              const err = summaryErrByEvidenceId[e.evidenceId];
              const linked = linkedFindingIdsForEvidence(e.evidenceId);

              return (
                <div key={e.evidenceId} className="rounded-2xl border border-black/10 p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="max-w-[760px]">
                      <div className="text-[12px] uppercase tracking-[0.12em] text-black/50 font-semibold">
                        {prettify(e.evidenceType)}
                      </div>
                      <div className="mt-2 text-[18px] font-semibold text-black">{e.title}</div>

                      {e.description ? (
                        <div className="mt-2 text-[14px] leading-[1.7] text-black/70">
                          {e.description}
                        </div>
                      ) : null}

                      <div className="mt-2 font-mono text-[12px] text-black/45">
                        ID: {e.evidenceId}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-[13px] font-semibold text-white hover:bg-black/90 disabled:opacity-50"
                        onClick={() => runAiSummary(e.evidenceId, { force: false })}
                        disabled={summaryLoadingId === e.evidenceId}
                      >
                        {summaryLoadingId === e.evidenceId ? "Summarizing…" : "AI Summary"}
                      </button>

                      <button
                        className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[13px] font-semibold hover:bg-black/[0.04] disabled:opacity-50"
                        onClick={() => runAiSummary(e.evidenceId, { force: true })}
                        disabled={summaryLoadingId === e.evidenceId}
                      >
                        Force regenerate
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                        Style
                      </label>
                      <select
                        className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
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
                      <label className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                        Model
                      </label>
                      <input
                        className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
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

                  <div className="mt-5">
                    <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                      Linked findings
                    </div>

                    {linked.length === 0 ? (
                      <div className="text-[13px] text-black/50">No links for this evidence yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {linked.map((fid) => {
                          const f = findingById(fid);
                          return (
                            <div key={fid} className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="text-[14px] text-black/75">
                                <span className="font-mono text-[12px] text-black/45">{fid}</span>
                                <span className="ml-2">{f?.title || "(missing finding title)"}</span>
                              </div>
                              <button
                                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-3 py-1.5 text-[12px] font-semibold hover:bg-black/[0.04]"
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

                  <div className="mt-5">
                    <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                      Stored summary
                    </div>

                    {err ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
                        {err}
                      </div>
                    ) : null}

                    {storedExact?.summary ? (
                      <>
                        <div className="mb-2 text-[12px] text-black/55">
                          Using selected style/model: <span className="font-mono">{style}</span> ·{" "}
                          <span className="font-mono">{model}</span>
                        </div>
                        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-[14px] whitespace-pre-wrap text-black/80">
                          {storedExact.summary}
                        </div>
                      </>
                    ) : storedAny?.summary ? (
                      <>
                        <div className="mb-2 text-[12px] text-amber-800">
                          Latest stored summary found (different style/model):{" "}
                          <span className="font-mono">{storedAny.style}</span> ·{" "}
                          <span className="font-mono">{storedAny.model}</span>
                        </div>
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[14px] whitespace-pre-wrap text-amber-900">
                          {storedAny.summary}
                        </div>
                      </>
                    ) : sessionSummary ? (
                      <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-[14px] whitespace-pre-wrap text-black/80">
                        {sessionSummary}
                      </div>
                    ) : (
                      <div className="text-[13px] text-black/50">No stored summary yet for this evidence.</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-[14px]">
          <a className="underline text-black/75" href="/demo">
            ← Back to Demo Guide
          </a>
          <span className="mx-2 text-black/25">·</span>
          <a
            className="underline text-black/75"
            href={`/api/admin/verification/evidence?caseId=${encodeURIComponent(caseId)}`}
            target="_blank"
            rel="noreferrer"
          >
            View JSON endpoint
          </a>
        </div>
      </section>
    </div>
  );
}

function MetricCard(props: { label: string; value: any; sub?: string }) {
  return (
    <div className="rounded-2xl border border-black/10 px-4 py-4">
      <div className="text-[12px] uppercase tracking-[0.12em] text-black/50 font-semibold">
        {props.label}
      </div>
      <div className="mt-3 text-[32px] leading-none font-semibold text-black">{props.value}</div>
      {props.sub ? <div className="mt-2 text-[12px] text-black/50">{props.sub}</div> : null}
    </div>
  );
}
"use client";

import * as React from "react";
import Link from "next/link";
import AdminShell from "../../../_components/AdminShell";

type FindingRow = {
  findingId: string;
  caseId: string;
  controlId: string;
  controlTitle: string;
  result: string;
  severity: string;
  rationale: string | null;
  createdAt: string;
  updatedAt: string;
};

type EvidenceRow = {
  evidenceId: string;
  caseId: string;
  evidenceType: string;
  title: string;
  description: string | null;
  sourceUrl: string | null;
  storageRef: string | null;
  submittedBy: string | null;
  submittedAt: string;
  linkedAt?: string;
};

type ApiList = { ok: true; rows: FindingRow[] } | { ok: false; error: string };
type ApiEvidence = { ok: true; rows: EvidenceRow[] } | { ok: false; error: string };
type ApiPost = { ok: true; findingId: string } | { ok: false; error: string };

function fmt(v?: string | null) {
  return v ? String(v) : "—";
}

function truncateMiddle(s: string, head = 18, tail = 10) {
  if (!s) return "—";
  if (s.length <= head + tail + 1) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

function splitDateTime(ts?: string | null) {
  const v = (ts || "").trim();
  if (!v) return { d: "—", t: "" };
  const parts = v.split(" ");
  if (parts.length >= 2) return { d: parts[0], t: parts.slice(1).join(" ") };
  return { d: v, t: "" };
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
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

function pillTone(value?: string) {
  const v = (value || "").toLowerCase();
  if (v === "pass" || v === "approved") return "border-green-200 bg-green-50 text-green-800";
  if (v === "partial" || v === "needs_more_info") return "border-amber-200 bg-amber-50 text-amber-900";
  if (v === "fail" || v === "rejected" || v === "suspended") return "border-red-200 bg-red-50 text-red-900";
  return "border-gray-200 bg-gray-50 text-gray-800";
}

export default function FindingsPage({ params }: { params: { caseId: string } }) {
  const caseId = params?.caseId || "";

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const [rows, setRows] = React.useState<FindingRow[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [evidenceByFinding, setEvidenceByFinding] = React.useState<Record<string, EvidenceRow[]>>({});
  const [evidenceLoading, setEvidenceLoading] = React.useState<Record<string, boolean>>({});

  // add finding form
  const [controlId, setControlId] = React.useState("");
  const [controlTitle, setControlTitle] = React.useState("");
  const [result, setResult] = React.useState("pass");
  const [severity, setSeverity] = React.useState("medium");
  const [rationale, setRationale] = React.useState("");

  const backHref = React.useMemo(() => `/admin/verification/${encodeURIComponent(caseId)}`, [caseId]);

  async function load() {
    if (!caseId) return;
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/verification/findings?caseId=${encodeURIComponent(caseId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const text = await res.text();
      let data: ApiList;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response (not JSON). First chars: ${text.slice(0, 80)}`);
      }

      if (!("ok" in data) || data.ok === false) {
        throw new Error((data as any)?.error || "Failed to load findings.");
      }

      setRows(data.rows || []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load findings.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadEvidenceForFinding(findingId: string) {
    if (!findingId) return;
    if (evidenceByFinding[findingId]) return; // cached

    setEvidenceLoading((m) => ({ ...m, [findingId]: true }));
    try {
      const res = await fetch(`/api/admin/verification/finding-evidence?findingId=${encodeURIComponent(findingId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const text = await res.text();
      let data: ApiEvidence;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response (not JSON). First chars: ${text.slice(0, 80)}`);
      }

      if (!("ok" in data) || data.ok === false) {
        throw new Error((data as any)?.error || "Failed to load finding evidence.");
      }

      setEvidenceByFinding((m) => ({ ...m, [findingId]: data.rows || [] }));
    } catch (e: any) {
      setErr(e?.message || "Failed to load finding evidence.");
      setEvidenceByFinding((m) => ({ ...m, [findingId]: [] }));
    } finally {
      setEvidenceLoading((m) => ({ ...m, [findingId]: false }));
    }
  }

  async function onToggle(findingId: string) {
    const next = !expanded[findingId];
    setExpanded((m) => ({ ...m, [findingId]: next }));
    if (next) await loadEvidenceForFinding(findingId);
  }

  async function addFinding() {
    if (!caseId) return;

    const cid = controlId.trim();
    const ctitle = controlTitle.trim();
    if (!cid || !ctitle) {
      setErr("Please enter Control ID and Control Title.");
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      const payload = {
        caseId,
        controlId: cid,
        controlTitle: ctitle,
        result,
        severity,
        rationale: rationale.trim() ? rationale.trim() : null,
      };

      const res = await fetch(`/api/admin/verification/findings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: ApiPost;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response (not JSON). First chars: ${text.slice(0, 80)}`);
      }

      if (!("ok" in data) || data.ok === false) {
        throw new Error((data as any)?.error || "Failed to add finding.");
      }

      setControlId("");
      setControlTitle("");
      setRationale("");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Failed to add finding.");
    } finally {
      setLoading(false);
    }
  }

  async function copyFindingId(findingId: string) {
    await copyText(findingId);
  }

  async function copyEvidenceId(evidenceId: string) {
    await copyText(evidenceId);
  }

  async function copyAllIds(findingId: string) {
    await loadEvidenceForFinding(findingId);
    const evds = (evidenceByFinding[findingId] || []).map((e) => e.evidenceId).filter(Boolean);
    const text = [`findingId: ${findingId}`, ...evds.map((id) => `evidenceId: ${id}`)].join("\n");
    await copyText(text);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  /**
   * POLISH:
   * Widen ACTIONS column a bit and prevent buttons from wrapping/shrinking.
   * This fixes "Copy all IDs" splitting into multiple lines at 100% zoom.
   */
  const gridCols = "grid-cols-[150px_1fr_120px_120px_160px_260px_220px] min-w-[1180px]";
  const cellPad = "px-5 py-4";

  const btnBase =
    "inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold shadow-sm hover:bg-gray-50 whitespace-nowrap shrink-0";

  return (
    <AdminShell title={`Admin • Verification • Findings • ${caseId}`}>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-3xl font-semibold tracking-tight">Findings</div>
          <div className="mt-1 text-sm text-gray-600">
            Case: <span className="font-mono">{caseId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={backHref}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold shadow-sm hover:bg-gray-50"
          >
            ← Back
          </Link>
          <button
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-60"
            onClick={load}
            disabled={loading}
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {err ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm">
          <div className="font-medium">Error</div>
          <div className="mt-1 whitespace-pre-wrap">{err}</div>
        </div>
      ) : null}

      {/* Add finding */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <div className="text-base font-semibold">Add finding</div>
          <div className="mt-1 text-sm text-gray-600">Record an evaluation result for a control (e.g., HG-1.2).</div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <label className="mb-2 block text-sm font-semibold text-gray-800">Control ID</label>
            <input
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base outline-none focus:border-gray-300"
              value={controlId}
              onChange={(e) => setControlId(e.target.value)}
              placeholder="HG-1.2"
            />
          </div>

          <div className="lg:col-span-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">Control title</label>
            <input
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base outline-none focus:border-gray-300"
              value={controlTitle}
              onChange={(e) => setControlTitle(e.target.value)}
              placeholder="Escalation Path Exists"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-800">Result</label>
            <select
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base outline-none focus:border-gray-300"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            >
              <option value="pass">pass</option>
              <option value="partial">partial</option>
              <option value="fail">fail</option>
              <option value="needs_more_info">needs_more_info</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-800">Severity</label>
            <select
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base outline-none focus:border-gray-300"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>

          <div className="lg:col-span-12">
            <label className="mb-2 block text-sm font-semibold text-gray-800">Rationale (optional)</label>
            <input
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base outline-none focus:border-gray-300"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Short explanation / notes for the audit trail"
            />
          </div>

          <div className="lg:col-span-12 flex justify-end">
            <button
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-black px-6 text-base font-semibold text-white shadow-sm disabled:opacity-60"
              onClick={addFinding}
              disabled={loading}
            >
              {loading ? "Saving…" : "Add finding"}
            </button>
          </div>
        </div>
      </section>

      {/* Findings table */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <div className="text-lg font-semibold">Findings ({rows.length})</div>
          <div className="mt-1 text-sm text-gray-600">Click a row to expand and view linked evidence.</div>
        </div>

        <div className="overflow-auto rounded-2xl border border-gray-200">
          {/* Header */}
          <div className={`grid ${gridCols} bg-gray-50 text-xs font-semibold tracking-wider text-gray-600`}>
            <div className={cellPad}>CONTROL ID</div>
            <div className={cellPad}>CONTROL TITLE</div>
            <div className={cellPad}>RESULT</div>
            <div className={cellPad}>SEVERITY</div>
            <div className={cellPad}>UPDATED</div>
            <div className={cellPad}>FINDING ID</div>
            <div className={cellPad}>ACTIONS</div>
          </div>

          {rows.length === 0 ? (
            <div className="px-5 py-6 text-sm text-gray-800">{loading ? "Loading…" : "No findings yet."}</div>
          ) : (
            rows.map((r) => {
              const isOpen = !!expanded[r.findingId];
              const evLoading = !!evidenceLoading[r.findingId];
              const evRows = evidenceByFinding[r.findingId] || [];
              const ts = splitDateTime(r.updatedAt || r.createdAt);

              return (
                <div key={r.findingId} className="border-t border-gray-100">
                  {/* Row */}
                  <button
                    type="button"
                    onClick={() => onToggle(r.findingId)}
                    className={`grid ${gridCols} w-full text-left hover:bg-gray-50`}
                  >
                    <div className={`${cellPad} flex items-center font-mono text-sm text-gray-900`}>{r.controlId}</div>

                    <div className={`${cellPad} flex items-center text-sm text-gray-900`}>
                      <span className="break-words">{r.controlTitle}</span>
                    </div>

                    <div className={`${cellPad} flex items-center`}>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${pillTone(
                          r.result
                        )}`}
                      >
                        {r.result}
                      </span>
                    </div>

                    <div className={`${cellPad} flex items-center text-sm text-gray-900`}>{r.severity}</div>

                    <div className={`${cellPad} flex items-center`}>
                      <div className="leading-tight">
                        <div className="font-mono text-sm text-gray-900">{ts.d}</div>
                        {ts.t ? <div className="font-mono text-xs text-gray-500">{ts.t}</div> : null}
                      </div>
                    </div>

                    <div className={`${cellPad} flex items-center`}>
                      <span className="font-mono text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                        {truncateMiddle(r.findingId, 22, 10)}
                      </span>
                    </div>

                    {/* Actions: NO WRAP + NO SHRINK */}
                    <div className={`${cellPad} flex items-center gap-2 flex-nowrap`}>
                      <button
                        type="button"
                        className={btnBase}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copyFindingId(r.findingId);
                        }}
                        title="Copy Finding ID"
                      >
                        Copy
                      </button>

                      <button
                        type="button"
                        className={btnBase}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copyAllIds(r.findingId);
                        }}
                        title="Copy Finding ID + linked Evidence IDs"
                      >
                        Copy all IDs
                      </button>
                    </div>
                  </button>

                  {/* Expanded evidence */}
                  {isOpen ? (
                    <div className="bg-gray-50 px-5 py-5">
                      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                        <div className="text-sm font-semibold text-gray-900">Linked evidence</div>
                        <div className="text-xs text-gray-600">
                          {evLoading ? "Loading…" : `${evRows.length} item${evRows.length === 1 ? "" : "s"}`}
                        </div>
                      </div>

                      {evLoading ? (
                        <div className="text-sm text-gray-700">Loading evidence…</div>
                      ) : evRows.length === 0 ? (
                        <div className="text-sm text-gray-700">No evidence linked to this finding yet.</div>
                      ) : (
                        <div className="grid gap-3">
                          {evRows.map((e) => (
                            <div
                              key={e.evidenceId}
                              className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4"
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-sm text-gray-900">
                                    {truncateMiddle(e.evidenceId, 22, 10)}
                                  </span>
                                  <button
                                    type="button"
                                    className="inline-flex h-8 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold shadow-sm hover:bg-gray-50 whitespace-nowrap"
                                    onClick={() => copyEvidenceId(e.evidenceId)}
                                    title="Copy Evidence ID"
                                  >
                                    Copy
                                  </button>
                                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-800">
                                    {e.evidenceType}
                                  </span>
                                </div>

                                <div className="mt-2 text-sm font-semibold text-gray-900 break-words">{e.title}</div>

                                <div className="mt-2 text-xs text-gray-600">
                                  Submitted: <span className="font-mono">{fmt(e.submittedAt)}</span>
                                  {e.sourceUrl ? (
                                    <>
                                      {" "}
                                      ·{" "}
                                      <a className="underline" href={e.sourceUrl} target="_blank" rel="noreferrer">
                                        Source
                                      </a>
                                    </>
                                  ) : null}
                                </div>
                              </div>

                              <div className="text-xs font-mono text-gray-500 whitespace-nowrap">
                                {e.linkedAt ? `Linked: ${e.linkedAt}` : ""}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </section>
    </AdminShell>
  );
}
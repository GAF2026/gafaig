"use client";

import * as React from "react";
import Link from "next/link";
import AdminShell from "../../../_components/AdminShell";

type EvidenceRow = {
  evidenceId: string;
  caseId: string;
  evidenceType: string;
  title: string;
  description: string | null;
  sourceUrl: string | null;
  storageRef: string | null;
  submittedBy: string | null;
  submittedAt: string | null;
  createdAt?: string | null;
};

type LinkRow = {
  findingId: string;
  evidenceId: string;
  createdAt?: string | null;
};

type ApiEvidence =
  | { ok: true; rows: any[]; caseId?: string }
  | { ok: false; error: string };

type ApiLinks =
  | { ok: true; rows: any[] }
  | { ok: false; error: string };

function fmt(v?: string | null) {
  return v ? String(v) : "—";
}

function truncateMiddle(s: string, head = 22, tail = 10) {
  if (!s) return "—";
  if (s.length <= head + tail + 1) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

async function safeJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Non-JSON response (status ${res.status}). First chars: ${text.slice(0, 120)}`
    );
  }
}

function normalizeEvidenceRow(x: any): EvidenceRow {
  return {
    evidenceId: x?.evidenceId ?? x?.EVIDENCE_ID ?? "",
    caseId: x?.caseId ?? x?.CASE_ID ?? "",
    evidenceType: x?.evidenceType ?? x?.EVIDENCE_TYPE ?? "",
    title: x?.title ?? x?.TITLE ?? "",
    description: x?.description ?? x?.DESCRIPTION ?? null,
    sourceUrl: x?.sourceUrl ?? x?.SOURCE_URL ?? null,
    storageRef: x?.storageRef ?? x?.STORAGE_REF ?? null,
    submittedBy: x?.submittedBy ?? x?.SUBMITTED_BY ?? null,
    submittedAt: x?.submittedAt ?? x?.SUBMITTED_AT ?? null,
    createdAt: x?.createdAt ?? x?.CREATED_AT ?? null,
  };
}

function normalizeLinkRow(x: any): LinkRow {
  return {
    findingId: x?.findingId ?? x?.FINDING_ID ?? "",
    evidenceId: x?.evidenceId ?? x?.EVIDENCE_ID ?? "",
    createdAt: x?.createdAt ?? x?.CREATED_AT ?? null,
  };
}

export default function EvidencePage({ params }: { params: { caseId: string } }) {
  const caseId = params?.caseId || "";

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const [rows, setRows] = React.useState<EvidenceRow[]>([]);
  const [linksByEvidence, setLinksByEvidence] = React.useState<Record<string, string[]>>({});

  // Debug panel (helps a lot during wiring)
  const [lastEvidenceGet, setLastEvidenceGet] = React.useState<any>(null);
  const [lastLinksGet, setLastLinksGet] = React.useState<any>(null);

  const backHref = React.useMemo(
    () => `/admin/verification/${encodeURIComponent(caseId)}`,
    [caseId]
  );

  async function loadEvidence() {
    if (!caseId) return;
    setLoading(true);
    setErr(null);

    try {
      const url = `/api/admin/verification/${encodeURIComponent(caseId)}/evidence?t=${Date.now()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data = await safeJson<ApiEvidence>(res);
      setLastEvidenceGet({ url, status: res.status, data });

      if (!res.ok) throw new Error((data as any)?.error || `Evidence GET failed (HTTP ${res.status})`);
      if (!("ok" in data) || data.ok === false) throw new Error((data as any)?.error || "Failed to load evidence.");

      const normalized = (data.rows || []).map(normalizeEvidenceRow).filter((r) => r.evidenceId);
      setRows(normalized);
    } catch (e: any) {
      setErr(e?.message || "Failed to load evidence.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  // Optional: try to load evidence↔finding links so we can show “linked” badges
  async function loadLinks() {
    if (!caseId) return;

    try {
      // This assumes your endpoint supports caseId listing:
      // If it doesn't, this will fail silently and the page still works.
      const url = `/api/admin/verification/finding-evidence?caseId=${encodeURIComponent(caseId)}&t=${Date.now()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data = await safeJson<ApiLinks>(res);
      setLastLinksGet({ url, status: res.status, data });

      if (!res.ok) return;
      if (!("ok" in data) || data.ok === false) return;

      const linkRows = (data.rows || []).map(normalizeLinkRow).filter((r) => r.evidenceId && r.findingId);

      const map: Record<string, string[]> = {};
      for (const lr of linkRows) {
        map[lr.evidenceId] = map[lr.evidenceId] || [];
        if (!map[lr.evidenceId].includes(lr.findingId)) map[lr.evidenceId].push(lr.findingId);
      }
      setLinksByEvidence(map);
    } catch {
      // ignore
    }
  }

  React.useEffect(() => {
    loadEvidence();
    loadLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const badge =
    "inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-800";
  const btn =
    "inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-60";

  return (
    <AdminShell title={`Admin • Verification • Evidence • ${caseId}`}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-3xl font-semibold tracking-tight">Evidence</div>
          <div className="mt-1 text-sm text-gray-600">
            Case: <span className="font-mono">{caseId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={backHref} className={btn}>
            ← Back
          </Link>
          <button className={btn} onClick={() => { loadEvidence(); loadLinks(); }} disabled={loading}>
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

      {/* Debug */}
      <details className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
        <summary className="cursor-pointer select-none font-semibold">Debug (last API responses)</summary>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 font-semibold">Last GET /evidence</div>
            <pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(lastEvidenceGet, null, 2)}</pre>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 font-semibold">Last GET /finding-evidence?caseId=… (optional)</div>
            <pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(lastLinksGet, null, 2)}</pre>
          </div>
        </div>
      </details>

      {/* Evidence list */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <div className="text-lg font-semibold">Evidence items ({rows.length})</div>
          <div className="mt-1 text-sm text-gray-600">Each card shows the EVD ID and whether it’s linked.</div>
        </div>

        {rows.length === 0 ? (
          <div className="text-sm text-gray-800">{loading ? "Loading…" : "No evidence yet."}</div>
        ) : (
          <div className="grid gap-3">
            {rows.map((e) => {
              const linkedFindings = linksByEvidence[e.evidenceId] || [];
              const isLinked = linkedFindings.length > 0;

              return (
                <div key={e.evidenceId} className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm text-gray-900">
                          {truncateMiddle(e.evidenceId, 26, 12)}
                        </span>
                        <span className={badge}>{e.evidenceType || "—"}</span>
                        {isLinked ? (
                          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                            Linked ({linkedFindings.length})
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                            Not linked
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-sm font-semibold text-gray-900 break-words">
                        {e.title ? e.title : "—"}
                      </div>

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

                      {e.description ? (
                        <div className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">{e.description}</div>
                      ) : null}

                      {isLinked ? (
                        <div className="mt-2 text-xs text-gray-600">
                          Linked finding IDs:{" "}
                          <span className="font-mono">
                            {linkedFindings.map((id) => truncateMiddle(id, 18, 8)).join(", ")}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
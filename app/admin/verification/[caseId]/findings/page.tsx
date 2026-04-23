"use client";

import * as React from "react";
import Link from "next/link";
import AdminNav from "../../../_components/AdminNav";
import AdminPageHeader from "../../../_components/AdminPageHeader";
import CaseTabs from "../_components/CaseTabs";
import PublicButton from "../../../../_components/PublicButton";
import PublicButtonLink from "../../../../_components/PublicButtonLink";

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

type ApiList = { ok: true; rows: any[] } | { ok: false; error: string };
type ApiEvidence = { ok: true; rows: any[] } | { ok: false; error: string };
type ApiPost = { ok: true; findingId: string } | { ok: false; error: string };

function fmt(v?: string | null) {
  return v ? String(v) : "—";
}

function prettify(v?: string | null) {
  return v ? String(v).replaceAll("_", " ").replaceAll("-", " ") : "—";
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
  if (v === "pass" || v === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }
  if (v === "partial" || v === "needs_more_info") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }
  if (v === "fail" || v === "rejected" || v === "suspended") {
    return "border-red-200 bg-red-50 text-red-900";
  }
  return "border-gray-200 bg-gray-50 text-gray-800";
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

function normalizeFindingRow(raw: any): FindingRow {
  const findingId = String(raw.findingId ?? raw.FINDING_ID ?? raw.finding_id ?? "");
  const caseId = String(raw.caseId ?? raw.CASE_ID ?? raw.case_id ?? "");
  const controlId = String(raw.controlId ?? raw.CONTROL_ID ?? raw.control_id ?? "");
  const controlTitle = String(
    raw.controlTitle ?? raw.CONTROL_TITLE ?? raw.control_title ?? ""
  );
  const result = String(raw.result ?? raw.RESULT ?? "");
  const severity = String(raw.severity ?? raw.SEVERITY ?? "");
  const rationale = (raw.rationale ?? raw.RATIONALE ?? null) as string | null;
  const createdAt = String(raw.createdAt ?? raw.CREATED_AT ?? raw.created_at ?? "");
  const updatedAt = String(
    raw.updatedAt ?? raw.UPDATED_AT ?? raw.updated_at ?? createdAt
  );

  return {
    findingId,
    caseId,
    controlId,
    controlTitle,
    result,
    severity,
    rationale,
    createdAt,
    updatedAt,
  };
}

function normalizeEvidenceRow(raw: any): EvidenceRow {
  const evidenceId = String(raw.evidenceId ?? raw.EVIDENCE_ID ?? raw.evidence_id ?? "");
  const caseId = String(raw.caseId ?? raw.CASE_ID ?? raw.case_id ?? "");
  const evidenceType = String(
    raw.evidenceType ?? raw.EVIDENCE_TYPE ?? raw.evidence_type ?? ""
  );
  const title = String(raw.title ?? raw.TITLE ?? "");
  const description = (raw.description ?? raw.DESCRIPTION ?? null) as string | null;
  const sourceUrl = (raw.sourceUrl ?? raw.SOURCE_URL ?? null) as string | null;
  const storageRef = (raw.storageRef ?? raw.STORAGE_REF ?? null) as string | null;
  const submittedBy = (raw.submittedBy ?? raw.SUBMITTED_BY ?? null) as string | null;
  const submittedAt = String(raw.submittedAt ?? raw.SUBMITTED_AT ?? "");
  const linkedAt = (raw.linkedAt ?? raw.LINKED_AT ?? undefined) as
    | string
    | undefined;

  return {
    evidenceId,
    caseId,
    evidenceType,
    title,
    description,
    sourceUrl,
    storageRef,
    submittedBy,
    submittedAt,
    linkedAt,
  };
}

export default function FindingsPage({ params }: { params: { caseId: string } }) {
  const caseId = params?.caseId || "";

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const [rows, setRows] = React.useState<FindingRow[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [evidenceByFinding, setEvidenceByFinding] = React.useState<
    Record<string, EvidenceRow[]>
  >({});
  const [evidenceLoading, setEvidenceLoading] = React.useState<
    Record<string, boolean>
  >({});

  const [lastGet, setLastGet] = React.useState<any>(null);
  const [lastPost, setLastPost] = React.useState<any>(null);

  const [controlId, setControlId] = React.useState("");
  const [controlTitle, setControlTitle] = React.useState("");
  const [result, setResult] = React.useState("pass");
  const [severity, setSeverity] = React.useState("medium");
  const [rationale, setRationale] = React.useState("");

  const backHref = React.useMemo(
    () => `/admin/verification/${encodeURIComponent(caseId)}`,
    [caseId]
  );
  const evidencePageHref = React.useMemo(
    () => `/admin/verification/${encodeURIComponent(caseId)}/evidence`,
    [caseId]
  );

  async function load() {
    if (!caseId) return;
    setLoading(true);
    setErr(null);

    try {
      const url = `/api/admin/verification/findings?caseId=${encodeURIComponent(
        caseId
      )}&t=${Date.now()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
      });

      const data = await safeJson<ApiList>(res);
      setLastGet({ url, status: res.status, data });

      if (!res.ok) {
        throw new Error((data as any)?.error || `GET failed (HTTP ${res.status})`);
      }
      if (!("ok" in data) || (data as any).ok === false) {
        throw new Error((data as any)?.error || "Failed to load findings.");
      }

      const rawRows = (data as any).rows || [];
      const normalized = rawRows
        .map(normalizeFindingRow)
        .filter((x: FindingRow) => !!x.findingId);
      setRows(normalized);
    } catch (e: any) {
      setErr(e?.message || "Failed to load findings.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadEvidenceForFinding(findingId: string) {
    if (!findingId) return;
    if (evidenceByFinding[findingId]) return;

    setEvidenceLoading((m) => ({ ...m, [findingId]: true }));
    try {
      const url = `/api/admin/verification/finding-evidence?findingId=${encodeURIComponent(
        findingId
      )}&t=${Date.now()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
      });

      const data = await safeJson<ApiEvidence>(res);

      if (!res.ok) {
        throw new Error(
          (data as any)?.error || `Evidence GET failed (HTTP ${res.status})`
        );
      }
      if (!("ok" in data) || (data as any).ok === false) {
        throw new Error((data as any)?.error || "Failed to load finding evidence.");
      }

      const rawRows = (data as any).rows || [];
      const normalized = rawRows
        .map(normalizeEvidenceRow)
        .filter((x: EvidenceRow) => !!x.evidenceId);
      setEvidenceByFinding((m) => ({ ...m, [findingId]: normalized }));
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
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await safeJson<ApiPost>(res);
      setLastPost({ status: res.status, payload, data });

      if (!res.ok) {
        throw new Error((data as any)?.error || `POST failed (HTTP ${res.status})`);
      }
      if (!("ok" in data) || (data as any).ok === false) {
        throw new Error((data as any)?.error || "Failed to add finding.");
      }

      setControlId("");
      setControlTitle("");
      setRationale("");
      setExpanded({});
      setEvidenceByFinding({});
      setEvidenceLoading({});

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
    const evds = (evidenceByFinding[findingId] || [])
      .map((e) => e.evidenceId)
      .filter(Boolean);
    const text = [`findingId: ${findingId}`, ...evds.map((id) => `evidenceId: ${id}`)].join(
      "\n"
    );
    await copyText(text);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const gridCols =
    "grid-cols-[150px_1fr_120px_120px_160px_260px_220px] min-w-[1180px]";
  const cellPad = "px-5 py-4";

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 py-10">
        <AdminPageHeader
          title={`Findings — ${caseId}`}
          description="Record control evaluations, inspect linked evidence, and move the case toward decision."
          meta={loading ? "Loading…" : `${rows.length} finding${rows.length === 1 ? "" : "s"}`}
          actions={
            <div className="flex flex-wrap gap-3">
              <PublicButtonLink href={backHref} variant="secondary" size="sm">
                ← Back
              </PublicButtonLink>

              <PublicButtonLink
                href={evidencePageHref}
                variant="secondary"
                size="sm"
              >
                Evidence →
              </PublicButtonLink>

              <PublicButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={load}
                disabled={loading}
              >
                {loading ? "Loading…" : "Refresh"}
              </PublicButton>
            </div>
          }
        />

        <CaseTabs caseId={caseId} />

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-900">
            <div className="font-semibold">Error</div>
            <div className="mt-1 whitespace-pre-wrap">{err}</div>
          </div>
        ) : null}

        <details className="mt-6 rounded-2xl border border-black/10 bg-white p-4 text-sm">
          <summary className="cursor-pointer select-none font-semibold text-black">
            Debug (last API responses)
          </summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
              <div className="mb-2 font-semibold">Last POST /findings</div>
              <pre className="whitespace-pre-wrap break-words text-xs">
                {JSON.stringify(lastPost, null, 2)}
              </pre>
            </div>
            <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
              <div className="mb-2 font-semibold">
                Last GET /findings?caseId=…
              </div>
              <pre className="whitespace-pre-wrap break-words text-xs">
                {JSON.stringify(lastGet, null, 2)}
              </pre>
            </div>
          </div>
        </details>

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-8">
          <div className="mb-4">
            <div className="text-[26px] font-semibold tracking-tight text-black">Add finding</div>
            <div className="mt-1 text-[14px] text-black/60">
              Record an evaluation result for a control, such as HG-1.2.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Control ID
              </label>
              <input
                className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-[14px] outline-none focus:ring-2 focus:ring-black/10"
                value={controlId}
                onChange={(e) => setControlId(e.target.value)}
                placeholder="HG-1.2"
              />
            </div>

            <div className="lg:col-span-5">
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Control title
              </label>
              <input
                className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-[14px] outline-none focus:ring-2 focus:ring-black/10"
                value={controlTitle}
                onChange={(e) => setControlTitle(e.target.value)}
                placeholder="Escalation Path Exists"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Result
              </label>
              <select
                className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-[14px] outline-none focus:ring-2 focus:ring-black/10"
                value={result}
                onChange={(e) => setResult(e.target.value)}
              >
                <option value="pass">pass</option>
                <option value="partial">partial</option>
                <option value="fail">fail</option>
                <option value="needs_more_info">needs more info</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Severity
              </label>
              <select
                className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-[14px] outline-none focus:ring-2 focus:ring-black/10"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>

            <div className="lg:col-span-12">
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Rationale (optional)
              </label>
              <input
                className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-[14px] outline-none focus:ring-2 focus:ring-black/10"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Short explanation or notes for the audit trail"
              />
            </div>

            <div className="lg:col-span-12 flex justify-end">
              <PublicButton
                type="button"
                variant="primary"
                onClick={addFinding}
                disabled={loading}
              >
                {loading ? "Saving…" : "Add finding"}
              </PublicButton>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-8">
          <div className="mb-4">
            <div className="text-[26px] font-semibold tracking-tight text-black">
              Findings ({rows.length})
            </div>
            <div className="mt-1 text-[14px] text-black/60">
              Click a row to expand and inspect linked evidence.
            </div>
          </div>

          <div className="overflow-auto rounded-2xl border border-black/10">
            <div
              className={`grid ${gridCols} bg-black/[0.03] text-left text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60`}
            >
              <div className={cellPad}>Control ID</div>
              <div className={cellPad}>Control title</div>
              <div className={cellPad}>Result</div>
              <div className={cellPad}>Severity</div>
              <div className={cellPad}>Updated</div>
              <div className={cellPad}>Finding ID</div>
              <div className={cellPad}>Actions</div>
            </div>

            {rows.length === 0 ? (
              <div className="px-5 py-6 text-[14px] text-black/60">
                {loading ? "Loading…" : "No findings yet."}
              </div>
            ) : (
              rows.map((r) => {
                const isOpen = !!expanded[r.findingId];
                const evLoading = !!evidenceLoading[r.findingId];
                const evRows = evidenceByFinding[r.findingId] || [];
                const ts = splitDateTime(r.updatedAt || r.createdAt);

                return (
                  <div key={r.findingId} className="border-t border-black/5">
                    <button
                      type="button"
                      onClick={() => onToggle(r.findingId)}
                      className={`grid ${gridCols} w-full text-left hover:bg-black/[0.02]`}
                    >
                      <div className={`${cellPad} flex items-center font-mono text-[14px] text-black`}>
                        {r.controlId}
                      </div>

                      <div className={`${cellPad} flex items-center text-[14px] text-black`}>
                        <span className="break-words">{r.controlTitle}</span>
                      </div>

                      <div className={`${cellPad} flex items-center`}>
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold ${pillTone(
                            r.result
                          )}`}
                        >
                          {prettify(r.result)}
                        </span>
                      </div>

                      <div className={`${cellPad} flex items-center text-[14px] text-black/80`}>
                        {prettify(r.severity)}
                      </div>

                      <div className={`${cellPad} flex items-center`}>
                        <div className="leading-tight">
                          <div className="font-mono text-[14px] text-black">{ts.d}</div>
                          {ts.t ? (
                            <div className="font-mono text-[12px] text-black/45">
                              {ts.t}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className={`${cellPad} flex items-center`}>
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[13px] text-black">
                          {truncateMiddle(r.findingId, 22, 10)}
                        </span>
                      </div>

                      <div className={`${cellPad} flex items-center gap-2 flex-nowrap`}>
                        <span className="inline-flex">
                          <PublicButton
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              copyFindingId(r.findingId);
                            }}
                          >
                            Copy
                          </PublicButton>
                        </span>

                        <span className="inline-flex">
                          <PublicButton
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              copyAllIds(r.findingId);
                            }}
                          >
                            Copy all IDs
                          </PublicButton>
                        </span>
                      </div>
                    </button>

                    {isOpen ? (
                      <div className="bg-black/[0.02] px-5 py-5">
                        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                          <div className="text-[14px] font-semibold text-black">
                            Linked evidence
                          </div>
                          <div className="text-[12px] text-black/55">
                            {evLoading
                              ? "Loading…"
                              : `${evRows.length} item${evRows.length === 1 ? "" : "s"}`}
                          </div>
                        </div>

                        {evLoading ? (
                          <div className="text-[14px] text-black/60">
                            Loading evidence…
                          </div>
                        ) : evRows.length === 0 ? (
                          <div className="text-[14px] text-black/60">
                            No evidence linked to this finding yet.{" "}
                            <Link className="underline" href={evidencePageHref}>
                              Go to Evidence
                            </Link>{" "}
                            to link items.
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {evRows.map((e) => (
                              <div
                                key={e.evidenceId}
                                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4"
                              >
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-[13px] text-black">
                                      {truncateMiddle(e.evidenceId, 22, 10)}
                                    </span>
                                    <PublicButton
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => copyEvidenceId(e.evidenceId)}
                                    >
                                      Copy
                                    </PublicButton>
                                    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[12px] font-semibold text-black/80">
                                      {prettify(e.evidenceType)}
                                    </span>
                                  </div>

                                  <div className="mt-2 break-words text-[14px] font-semibold text-black">
                                    {e.title}
                                  </div>

                                  <div className="mt-2 text-[12px] text-black/55">
                                    Submitted:{" "}
                                    <span className="font-mono">{fmt(e.submittedAt)}</span>
                                    {e.sourceUrl ? (
                                      <>
                                        {" "}
                                        ·{" "}
                                        <a
                                          className="underline"
                                          href={e.sourceUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Source
                                        </a>
                                      </>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="whitespace-nowrap font-mono text-[12px] text-black/45">
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
      </main>
    </div>
  );
}
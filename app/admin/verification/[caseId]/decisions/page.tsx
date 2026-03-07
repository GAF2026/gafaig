"use client";

/**
 * Decisions page
 * - Standard header + CaseTabs for uniform layout
 * - Reads current decision from GET /api/admin/verification/decisions?caseId=...
 * - Writes decision via POST /api/admin/verification/decisions
 * - Uses current GAFAIG admin auth flow
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../../_components/AdminShell";
import CaseTabs from "../_components/CaseTabs";

type DecisionRow = {
  decisionId?: string | null;
  caseId?: string | null;
  decision?: string | null;
  decidedBy?: string | null;
  decidedAt?: string | null;
  summary?: string | null;
  conditions?: string | null;
};

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
    ...(init || {}),
  });
  const text = await res.text();

  try {
    return { res, data: JSON.parse(text) as any };
  } catch {
    return { res, data: { ok: false, error: `Non-JSON response (${res.status})`, raw: text } };
  }
}

function pillTone(value?: string | null) {
  const v = (value || "").toLowerCase();
  if (v === "approved") return "border-green-200 bg-green-50 text-green-800";
  if (v === "in_review") return "border-blue-200 bg-blue-50 text-blue-800";
  if (v === "suspended") return "border-amber-200 bg-amber-50 text-amber-900";
  if (v === "rejected") return "border-red-200 bg-red-50 text-red-900";
  return "border-gray-200 bg-gray-50 text-gray-800";
}

export default function DecisionsPage({ params }: { params: { caseId: string } }) {
  const caseId = params?.caseId || "";

  const backHref = useMemo(() => `/admin/verification/${encodeURIComponent(caseId)}`, [caseId]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const [current, setCurrent] = useState<DecisionRow | null>(null);

  const [decidedBy, setDecidedBy] = useState("admin@gafaig.com");
  const [summary, setSummary] = useState("");
  const [conditions, setConditions] = useState("");

  async function load() {
    if (!caseId) return;
    setLoading(true);
    setErr(null);
    setSaved(null);

    const { res, data } = await fetchJson(
      `/api/admin/verification/decisions?caseId=${encodeURIComponent(caseId)}`
    );

    if (!data?.ok) {
      if (res.status === 401) {
        setErr(
          "Unauthorized\nTip: go to /admin/login and click “Enable demo access”, then return to this case."
        );
      } else if (res.status === 403) {
        setErr("Forbidden\nYour current reviewer session does not have permission for this action.");
      } else {
        setErr(data?.error || "Failed to load decision.");
      }
      setCurrent(null);
      setLoading(false);
      return;
    }

    setCurrent(data?.row ?? null);

    const row = data?.row as DecisionRow | null;
    if (row?.decidedBy) setDecidedBy(String(row.decidedBy));
    if (row?.summary) setSummary(String(row.summary));
    if (row?.conditions) setConditions(String(row.conditions));

    setLoading(false);
  }

  async function setDecision(next: "approved" | "rejected" | "suspended" | "in_review") {
    if (!caseId) return;
    setSaving(true);
    setErr(null);
    setSaved(null);

    const payload = {
      caseId,
      decision: next,
      decidedBy: decidedBy.trim() || "admin",
      summary: summary.trim() ? summary.trim() : null,
      conditions: conditions.trim() ? conditions.trim() : null,
    };

    const { res, data } = await fetchJson(`/api/admin/verification/decisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!data?.ok) {
      if (res.status === 401) {
        setErr(
          "Unauthorized\nTip: go to /admin/login and click “Enable demo access”, then return to this case."
        );
      } else if (res.status === 403) {
        setErr("Forbidden\nYour current reviewer session does not have permission for this action.");
      } else {
        setErr(data?.error || "Failed to save decision.");
      }
      setSaving(false);
      return;
    }

    setSaved("Saved");
    await load();
    setSaving(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const currentDecision = (current?.decision || "").toLowerCase() || "—";

  return (
    <AdminShell title={`Admin • Verification • Decisions • ${caseId}`}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Decisions</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={[
                  "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold",
                  pillTone(currentDecision),
                ].join(" ")}
              >
                Current: {loading ? "—" : currentDecision}
              </span>

              <div className="text-sm text-gray-600">
                {current?.decidedAt ? (
                  <>
                    Last updated: <span className="font-mono">{current.decidedAt}</span>
                    {current.decidedBy ? (
                      <>
                        {" "}
                        by <span className="font-mono">{current.decidedBy}</span>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    Case: <span className="font-mono">{caseId}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-60"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>

            <Link
              href={backHref}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
            >
              Back to case
            </Link>
          </div>
        </div>

        <CaseTabs caseId={caseId} />

        {err ? (
          <div className="mb-6 whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm">
            <div className="font-semibold">Error</div>
            <div className="mt-1">{err}</div>
          </div>
        ) : null}

        {saved ? (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 shadow-sm">
            <div className="font-semibold">{saved}</div>
            <div className="mt-1">Decision recorded and case status updated.</div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold">Set decision</div>
            <div className="mt-1 text-sm text-gray-600">
              Clicking a decision records it in <span className="font-mono">VERIFICATION_DECISIONS</span>, updates the
              case status, and writes an audit event.
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                disabled={saving}
                onClick={() => setDecision("approved")}
                className="h-12 rounded-2xl border border-black bg-black text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
              >
                Approve
              </button>

              <button
                disabled={saving}
                onClick={() => setDecision("in_review")}
                className="h-12 rounded-2xl border border-gray-200 bg-white text-sm font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-60"
              >
                In review
              </button>

              <button
                disabled={saving}
                onClick={() => setDecision("suspended")}
                className="h-12 rounded-2xl border border-gray-200 bg-white text-sm font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-60"
              >
                Suspend
              </button>

              <button
                disabled={saving}
                onClick={() => setDecision("rejected")}
                className="h-12 rounded-2xl border border-gray-200 bg-white text-sm font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-60"
              >
                Reject
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm font-semibold">How to test</div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700">
                <li>Open this page in the browser.</li>
                <li>Go to <span className="font-mono">/admin/login</span> and click <span className="font-semibold">Enable demo access</span>.</li>
                <li>Return to this page.</li>
                <li>Click Approve / Reject / Suspend / In review.</li>
                <li>You should see a green “Saved” banner and the Current pill updates.</li>
              </ol>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold">Decision details</div>
            <div className="mt-1 text-sm text-gray-600">Optional fields stored with the decision and audit event.</div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700">Decided by</label>
              <input
                value={decidedBy}
                onChange={(e) => setDecidedBy(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base outline-none focus:border-gray-400"
                placeholder="admin@gafaig.com"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700">Summary (optional)</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="mt-2 min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base outline-none focus:border-gray-400"
                placeholder="Short explanation for the decision"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700">Conditions (optional)</label>
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                className="mt-2 min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base outline-none focus:border-gray-400"
                placeholder="Conditions required for approval / reinstatement, etc."
              />
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
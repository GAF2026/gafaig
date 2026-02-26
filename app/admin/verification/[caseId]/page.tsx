"use client";

/**
 * Case Overview (Verification)
 * Goal: make layout uniform by using AdminShell properly (with a title)
 * and removing extra wrapper padding that caused inconsistent spacing.
 */

import * as React from "react";
import Link from "next/link";
import AdminShell from "../../_components/AdminShell";

type DecisionRow = {
  decisionId?: string | null;
  caseId?: string | null;
  decision?: string | null;
  decidedBy?: string | null;
  decidedAt?: string | null;
  summary?: string | null;
  conditions?: string | null;
};

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
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
  if (v === "suspended" || v === "rejected" || v === "fail") return "bg-red-50 text-red-900 border-red-200";
  if (v === "received" || v === "submitted") return "bg-gray-50 text-gray-800 border-gray-200";
  return "bg-gray-50 text-gray-800 border-gray-200";
}

export default function CaseOverviewPage({ params }: { params: { caseId: string } }) {
  const caseId = params?.caseId || "";

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [evidenceCount, setEvidenceCount] = React.useState<number>(0);
  const [findingsCount, setFindingsCount] = React.useState<number>(0);
  const [decision, setDecision] = React.useState<DecisionRow | null>(null);

  async function load() {
    if (!caseId) return;
    setLoading(true);
    setError(null);

    try {
      const evidenceUrl = `/api/admin/verification/${encodeURIComponent(caseId)}/evidence`;
      const findingsUrl = `/api/admin/verification/findings?caseId=${encodeURIComponent(caseId)}`;
      const decisionUrl = `/api/admin/verification/decisions?caseId=${encodeURIComponent(caseId)}`;

      const [e, f, d] = await Promise.all([fetchJson(evidenceUrl), fetchJson(findingsUrl), fetchJson(decisionUrl)]);

      if (!e.data?.ok) throw new Error(e.data?.error || "Failed to load evidence");
      if (!f.data?.ok) throw new Error(f.data?.error || "Failed to load findings");

      // Decisions endpoint is cookie-protected; if unauthorized, keep the page usable.
      if (!d.data?.ok) {
        if (d.res.status === 401) {
          setDecision(null);
        } else {
          throw new Error(d.data?.error || "Failed to load decision");
        }
      } else {
        setDecision(d.data?.row ?? null);
      }

      setEvidenceCount(Array.isArray(e.data.rows) ? e.data.rows.length : 0);
      setFindingsCount(Array.isArray(f.data.rows) ? f.data.rows.length : 0);
    } catch (err: any) {
      setError(err?.message || String(err));
      setEvidenceCount(0);
      setFindingsCount(0);
      setDecision(null);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const status = (decision?.decision || "").toLowerCase();
  const statusLabel = status ? status : "(no decision yet)";

  return (
    <AdminShell title={`Case ${caseId}`}>
      {/* Breadcrumb / actions */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/verification" className="text-sm text-gray-600 hover:text-gray-900 underline">
            Admin
          </Link>
          <span className="text-sm text-gray-400">•</span>
          <Link href="/admin/verification" className="text-sm text-gray-600 hover:text-gray-900 underline">
            Verification
          </Link>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-800">{caseId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
          <Link
            href="/admin/verification"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            Back to list
          </Link>
        </div>
      </div>

      {/* Status row */}
      <div className="mb-10">
        <div className="text-xs uppercase tracking-wide text-gray-500">Admin • Verification • Case</div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={cx(
              "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium",
              pillClass(statusLabel)
            )}
          >
            Status: {statusLabel}
          </span>

          {!decision ? (
            <span className="text-sm text-gray-600">
              If Decisions shows “Unauthorized”, set cookie <span className="font-mono">gafaig_admin=1</span> in the
              browser.
            </span>
          ) : (
            <span className="text-sm text-gray-600">
              Last decision: <span className="font-mono">{decision.decidedAt || "—"}</span>{" "}
              {decision.decidedBy ? (
                <>
                  by <span className="font-mono">{decision.decidedBy}</span>
                </>
              ) : null}
            </span>
          )}
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm">
          <div className="font-medium">Error</div>
          <div className="mt-1 whitespace-pre-wrap">{error}</div>
        </div>
      ) : null}

      {/* Quick nav */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href={`/admin/verification/${encodeURIComponent(caseId)}/evidence`}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50"
        >
          <div className="text-xs uppercase tracking-wide text-gray-500">Evidence</div>
          <div className="mt-1 text-3xl font-semibold">{loading ? "—" : evidenceCount}</div>
          <div className="mt-2 text-sm text-gray-600">Add evidence, link to findings, remove links.</div>
        </Link>

        <Link
          href={`/admin/verification/${encodeURIComponent(caseId)}/findings`}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50"
        >
          <div className="text-xs uppercase tracking-wide text-gray-500">Findings</div>
          <div className="mt-1 text-3xl font-semibold">{loading ? "—" : findingsCount}</div>
          <div className="mt-2 text-sm text-gray-600">Controls evaluated for this case.</div>
        </Link>

        <Link
          href={`/admin/verification/${encodeURIComponent(caseId)}/decisions`}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50"
        >
          <div className="text-xs uppercase tracking-wide text-gray-500">Decision</div>
          <div className="mt-1 text-3xl font-semibold">{decision?.decision ? decision.decision : "—"}</div>
          <div className="mt-2 text-sm text-gray-600">Approve / Reject / Suspend / In review.</div>
        </Link>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-medium">What to do next</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>
            Go to <span className="font-medium">Evidence</span> to add URLs/documents and link them to findings.
          </li>
          <li>
            Go to <span className="font-medium">Findings</span> to add control evaluations (pass/fail/etc.).
          </li>
          <li>
            Go to <span className="font-medium">Decision</span> to set the case status and record the audit event.
          </li>
        </ul>
      </div>
    </AdminShell>
  );
}
"use client";

import * as React from "react";
import Link from "next/link";
import AdminNav from "../../_components/AdminNav";
import AdminPageHeader from "../../_components/AdminPageHeader";

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
  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
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

function prettify(value?: string | null) {
  if (!value) return "—";
  return value.replaceAll("_", " ");
}

function pillClass(value?: string | null) {
  const v = (value || "").toLowerCase();

  if (v === "approved" || v === "pass") {
    return "bg-emerald-50 text-emerald-900 border-emerald-200";
  }
  if (v === "in_review") {
    return "bg-blue-50 text-blue-900 border-blue-200";
  }
  if (v === "needs_more_info") {
    return "bg-amber-50 text-amber-900 border-amber-200";
  }
  if (v === "suspended" || v === "rejected" || v === "fail") {
    return "bg-red-50 text-red-900 border-red-200";
  }
  if (v === "received" || v === "submitted") {
    return "bg-gray-50 text-gray-800 border-gray-200";
  }

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

      const [e, f, d] = await Promise.all([
        fetchJson(evidenceUrl),
        fetchJson(findingsUrl),
        fetchJson(decisionUrl),
      ]);

      if (!e.data?.ok) {
        throw new Error(e.data?.error || "Failed to load evidence");
      }

      if (!f.data?.ok) {
        throw new Error(f.data?.error || "Failed to load findings");
      }

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
  const statusLabel = status ? prettify(status) : "no decision yet";

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
        <AdminPageHeader
          title={`Case ${caseId}`}
          description="Case overview for the private verification workflow. Use this page to move into evidence, findings, and decision actions."
          meta={loading ? "Loading…" : `Status: ${statusLabel}`}
          actions={
            <div className="flex flex-wrap gap-3">
              <button
                onClick={load}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
              >
                {loading ? "Loading…" : "Refresh"}
              </button>

              <Link
                href="/admin/verification"
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
              >
                Back to verification
              </Link>
            </div>
          }
        />

        <section className="mb-8 flex flex-wrap items-center gap-3 text-[14px] text-black/60">
          <Link href="/admin/verification" className="underline">
            Verification
          </Link>
          <span>•</span>
          <span className="text-black/80">{caseId}</span>
        </section>

        <section className="mb-8 rounded-2xl border border-black/10 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cx(
                "inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold",
                pillClass(status)
              )}
            >
              Status: {statusLabel}
            </span>

            {!decision ? (
              <span className="text-[14px] text-black/60">
                No recorded decision yet for this case.
              </span>
            ) : (
              <span className="text-[14px] text-black/60">
                Last decision:{" "}
                <span className="font-mono text-black/75">{decision.decidedAt || "—"}</span>
                {decision.decidedBy ? (
                  <>
                    {" "}
                    by <span className="font-mono text-black/75">{decision.decidedBy}</span>
                  </>
                ) : null}
              </span>
            )}
          </div>
        </section>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 whitespace-pre-wrap text-[14px] text-black/80">{error}</div>
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href={`/admin/verification/${encodeURIComponent(caseId)}/evidence`}
            className="rounded-2xl border border-black/10 p-5 hover:bg-black/[0.02]"
          >
            <div className="text-[12px] uppercase tracking-[0.12em] text-black/55 font-semibold">
              Evidence
            </div>
            <div className="mt-3 text-[44px] leading-none font-semibold text-black">
              {loading ? "—" : evidenceCount}
            </div>
            <div className="mt-3 text-[14px] leading-[1.7] text-black/65">
              Add evidence, manage artifacts, and connect support to the case record.
            </div>
          </Link>

          <Link
            href={`/admin/verification/${encodeURIComponent(caseId)}/findings`}
            className="rounded-2xl border border-black/10 p-5 hover:bg-black/[0.02]"
          >
            <div className="text-[12px] uppercase tracking-[0.12em] text-black/55 font-semibold">
              Findings
            </div>
            <div className="mt-3 text-[44px] leading-none font-semibold text-black">
              {loading ? "—" : findingsCount}
            </div>
            <div className="mt-3 text-[14px] leading-[1.7] text-black/65">
              Review controls, document evaluations, and capture governance conclusions.
            </div>
          </Link>

          <Link
            href={`/admin/verification/${encodeURIComponent(caseId)}/decisions`}
            className="rounded-2xl border border-black/10 p-5 hover:bg-black/[0.02]"
          >
            <div className="text-[12px] uppercase tracking-[0.12em] text-black/55 font-semibold">
              Decision
            </div>
            <div className="mt-3 text-[32px] leading-none font-semibold text-black">
              {decision?.decision ? prettify(decision.decision) : "—"}
            </div>
            <div className="mt-3 text-[14px] leading-[1.7] text-black/65">
              Approve, reject, suspend, or continue review with a recorded decision trail.
            </div>
          </Link>
        </section>

        <section className="mt-10 rounded-2xl border border-black/10 p-5">
          <h2 className="text-[16px] font-semibold text-black">What to do next</h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-[1.7] text-black/70">
            <li>
              Open <span className="font-semibold text-black">Evidence</span> to add documents, URLs, and supporting artifacts.
            </li>
            <li>
              Open <span className="font-semibold text-black">Findings</span> to evaluate controls and document review results.
            </li>
            <li>
              Open <span className="font-semibold text-black">Decision</span> to finalize the case outcome and audit trail.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
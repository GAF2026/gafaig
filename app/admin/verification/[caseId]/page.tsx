"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminNav from "../../_components/AdminNav";
import AdminPageHeader from "../../_components/AdminPageHeader";
import PublicButton from "../../../_components/PublicButton";
import PublicButtonLink from "../../../_components/PublicButtonLink";

type DecisionRow = {
  decisionId?: string | null;
  caseId?: string | null;
  decision?: string | null;
  decidedBy?: string | null;
  decidedAt?: string | null;
  summary?: string | null;
  conditions?: string | null;
};

type ScoreResponse =
  | {
      ok: true;
      caseId: string;
      participantId: string | null;
      standard: { code: string | null; version: string | null };
      caseStatus: string | null;
      renewalStatus?: string | null;
      tier: string;
      band: string;
      score: number;
      subscores: {
        controls: number;
        coverage: number;
        freshness: number;
        summaries: number;
      };
      lastActivityAt: string | null;
      counts: {
        findingsTotal: number;
        findingsScored: number;
        findingsNA: number;
        findingsWithEvidence: number;
        evidenceTotal: number;
        evidenceWithSummary: number;
      };
    }
  | {
      ok: false;
      error: string;
      hint?: string;
      suggestions?: string[];
    };

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
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

export default function CaseOverviewPage() {
  const params = useParams();
  const caseIdParam = params?.caseId;
  const caseId = Array.isArray(caseIdParam)
    ? String(caseIdParam[0] ?? "")
    : String(caseIdParam ?? "");

  const [loading, setLoading] = React.useState(true);
  const [creatingEvidence, setCreatingEvidence] = React.useState(false);
  const [creatingFinding, setCreatingFinding] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [evidenceCount, setEvidenceCount] = React.useState<number>(0);
  const [findingsCount, setFindingsCount] = React.useState<number>(0);
  const [decision, setDecision] = React.useState<DecisionRow | null>(null);
  const [score, setScore] = React.useState<ScoreResponse | null>(null);

  async function load() {
    if (!caseId) return;

    setLoading(true);
    setError(null);

    try {
      const evidenceUrl = `/api/admin/verification/${encodeURIComponent(caseId)}/evidence`;
      const findingsUrl = `/api/admin/verification/${encodeURIComponent(caseId)}/findings`;
      const decisionUrl = `/api/admin/verification/decisions?caseId=${encodeURIComponent(caseId)}`;
      const scoreUrl = `/api/admin/verification/${encodeURIComponent(caseId)}/score`;

      const [e, f, d, s] = await Promise.all([
        fetchJson(evidenceUrl),
        fetchJson(findingsUrl),
        fetchJson(decisionUrl),
        fetchJson(scoreUrl),
      ]);

      if (!e.data?.ok) {
        if (e.res.status === 401) {
          throw new Error("Unauthorized (admin cookie missing)");
        }
        throw new Error(e.data?.error || "Failed to load evidence");
      }

      if (!f.data?.ok) {
        if (f.res.status === 401) {
          throw new Error("Unauthorized (admin cookie missing)");
        }
        throw new Error(f.data?.error || "Failed to load findings");
      }

      if (!d.data?.ok) {
        if (d.res.status === 401 || d.res.status === 404) {
          setDecision(null);
        } else {
          throw new Error(d.data?.error || "Failed to load decision");
        }
      } else {
        setDecision(d.data?.row ?? null);
      }

      setScore(s.data as ScoreResponse);
      setEvidenceCount(Array.isArray(e.data.rows) ? e.data.rows.length : 0);
      setFindingsCount(Array.isArray(f.data.rows) ? f.data.rows.length : 0);
    } catch (err: any) {
      setError(err?.message || String(err));
      setEvidenceCount(0);
      setFindingsCount(0);
      setDecision(null);
      setScore(null);
    } finally {
      setLoading(false);
    }
  }

  async function createTestEvidence() {
    if (!caseId || creatingEvidence) return;

    setCreatingEvidence(true);
    setError(null);
    setSuccess(null);

    try {
      const { res, data } = await fetchJson(
        `/api/admin/verification/${encodeURIComponent(caseId)}/evidence`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Test Evidence",
            evidenceType: "document",
            sourceUrl: "https://example.com",
          }),
        }
      );

      if (!data?.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized (admin cookie missing)");
        }
        throw new Error(data?.error || "Failed to create evidence");
      }

      setSuccess("Test evidence created.");
      await load();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setCreatingEvidence(false);
    }
  }

  async function createTestFinding() {
    if (!caseId || creatingFinding) return;

    setCreatingFinding(true);
    setError(null);
    setSuccess(null);

    try {
      const { res, data } = await fetchJson(
        `/api/admin/verification/${encodeURIComponent(caseId)}/findings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Test Finding",
            severity: "medium",
            status: "open",
            category: "governance",
          }),
        }
      );

      if (!data?.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized (admin cookie missing)");
        }
        throw new Error(data?.error || "Failed to create finding");
      }

      setSuccess(`Test finding created: ${data?.row?.findingId || "created"}.`);
      await load();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setCreatingFinding(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const status =
    (score && score.ok ? score.caseStatus : null) ||
    decision?.decision ||
    "";

  const statusLabel = status ? prettify(status) : "no decision yet";

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 py-10">
        <AdminPageHeader
          title={`Case ${caseId}`}
          description="Case overview for the private verification workflow. Use this page to move into evidence, findings, scoring, decision, and publish actions."
          meta={loading ? "Loading…" : `Status: ${statusLabel}`}
          actions={
            <div className="flex flex-wrap gap-3">
              <PublicButton onClick={load} variant="secondary" size="sm">
                {loading ? "Loading…" : "Refresh"}
              </PublicButton>

              <PublicButtonLink
                href="/admin/verification"
                variant="secondary"
                size="sm"
              >
                Back to verification
              </PublicButtonLink>
            </div>
          }
        />

        <section className="mb-8 flex flex-wrap items-center gap-3 text-[14px] text-black/60">
          <PublicButtonLink href="/admin/verification" variant="ghost" size="sm">
            Verification
          </PublicButtonLink>
          <span>•</span>
          <span className="text-black/80">{caseId}</span>
        </section>

        <section className="mb-8 rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cx(
                "inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold",
                pillClass(status)
              )}
            >
              Status: {statusLabel}
            </span>

            {score && score.ok ? (
              <>
                <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[12px] font-semibold text-black/80">
                  Score: {score.score}
                </span>
                <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[12px] font-semibold text-black/80">
                  {score.tier} • Band {score.band}
                </span>
                {score.renewalStatus ? (
                  <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[12px] font-semibold text-black/80">
                    Renewal: {prettify(score.renewalStatus)}
                  </span>
                ) : null}
              </>
            ) : null}

            {!decision ? (
              <span className="text-[14px] text-black/60">
                No recorded decision yet for this case.
              </span>
            ) : (
              <span className="text-[14px] text-black/60">
                Last decision:{" "}
                <span className="font-mono text-black/75">
                  {decision.decidedAt || "—"}
                </span>
                {decision.decidedBy ? (
                  <>
                    {" "}
                    by{" "}
                    <span className="font-mono text-black/75">
                      {decision.decidedBy}
                    </span>
                  </>
                ) : null}
              </span>
            )}
          </div>
        </section>

        {success ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-emerald-800">
              Success
            </div>
            <div className="mt-1 text-[14px] text-black/80">{success}</div>
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 whitespace-pre-wrap text-[14px] text-black/80">
              {error}
            </div>
          </div>
        ) : null}

        {score && !score.ok ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-amber-800">
              Score unavailable
            </div>
            <div className="mt-1 text-[14px] text-black/80">{score.error}</div>
            {score.hint ? (
              <div className="mt-1 text-[13px] text-black/70">{score.hint}</div>
            ) : null}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <Link
              href={`/admin/verification/${encodeURIComponent(caseId)}/evidence`}
              className="block hover:bg-black/[0.02]"
            >
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
                Evidence
              </div>
              <div className="mt-3 text-[44px] font-semibold leading-none text-black">
                {loading ? "—" : evidenceCount}
              </div>
              <div className="mt-3 text-[14px] leading-7 text-black/65">
                Add evidence, manage artifacts, and connect support to the case record.
              </div>
            </Link>

            <div className="mt-4">
              <button
                type="button"
                onClick={createTestEvidence}
                disabled={creatingEvidence || loading}
                className={cx(
                  "rounded px-3 py-2 text-white",
                  creatingEvidence || loading
                    ? "cursor-not-allowed bg-black/40"
                    : "bg-black hover:bg-black/80"
                )}
              >
                {creatingEvidence ? "Adding…" : "Add Test Evidence"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <Link
              href={`/admin/verification/${encodeURIComponent(caseId)}/findings`}
              className="block hover:bg-black/[0.02]"
            >
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
                Findings
              </div>
              <div className="mt-3 text-[44px] font-semibold leading-none text-black">
                {loading ? "—" : findingsCount}
              </div>
              <div className="mt-3 text-[14px] leading-7 text-black/65">
                Review controls, document evaluations, and capture governance conclusions.
              </div>
            </Link>

            <div className="mt-4">
              <button
                type="button"
                onClick={createTestFinding}
                disabled={creatingFinding || loading}
                className={cx(
                  "rounded px-3 py-2 text-white",
                  creatingFinding || loading
                    ? "cursor-not-allowed bg-black/40"
                    : "bg-black hover:bg-black/80"
                )}
              >
                {creatingFinding ? "Creating…" : "Create Test Finding"}
              </button>
            </div>
          </div>

          <Link
            href={`/admin/verification/${encodeURIComponent(caseId)}/score`}
            className="rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/[0.02]"
          >
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
              Score
            </div>
            <div className="mt-3 text-[32px] font-semibold leading-none text-black">
              {score && score.ok ? score.score : "—"}
            </div>
            <div className="mt-3 text-[14px] leading-7 text-black/65">
              Review canonical enterprise scoring, subscores, and governance output.
            </div>
          </Link>

          <Link
            href={`/admin/verification/${encodeURIComponent(caseId)}/decisions`}
            className="rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/[0.02]"
          >
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
              Decision
            </div>
            <div className="mt-3 text-[32px] font-semibold leading-none text-black">
              {decision?.decision ? prettify(decision.decision) : "—"}
            </div>
            <div className="mt-3 text-[14px] leading-7 text-black/65">
              Approve, reject, suspend, or continue review with a recorded decision trail.
            </div>
          </Link>

          <Link
            href={`/admin/verification/${encodeURIComponent(caseId)}/publish`}
            className="rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/[0.02]"
          >
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
              Publish
            </div>
            <div className="mt-3 text-[32px] font-semibold leading-none text-black">
              {score && score.ok ? score.band : "—"}
            </div>
            <div className="mt-3 text-[14px] leading-7 text-black/65">
              Publish the approved case to the public registry and AI systems surfaces.
            </div>
          </Link>
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            What to do next
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-7 text-black/70">
            <li>
              Open <span className="font-semibold text-black">Evidence</span> to
              add documents, URLs, and supporting artifacts.
            </li>
            <li>
              Open <span className="font-semibold text-black">Findings</span> to
              evaluate controls and document review results.
            </li>
            <li>
              Open <span className="font-semibold text-black">Score</span> to
              confirm canonical enterprise scoring results.
            </li>
            <li>
              Open <span className="font-semibold text-black">Decision</span> to
              finalize the case outcome and audit trail.
            </li>
            <li>
              Open <span className="font-semibold text-black">Publish</span> to
              move an approved case into the public registry pipeline.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
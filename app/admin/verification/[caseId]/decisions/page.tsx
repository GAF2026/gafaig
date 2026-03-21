"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminNav from "../../../_components/AdminNav";
import AdminPageHeader from "../../../_components/AdminPageHeader";
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

type DecisionGetResponse =
  | { ok: true; row: DecisionRow | null }
  | { ok: false; error: string };

type DecisionPostResponse =
  | {
      ok: true;
      caseId: string;
      decision: string;
      proc?: unknown;
    }
  | { ok: false; error: string };

type ScoreResponse =
  | {
      ok: true;
      caseId: string;
      caseStatus: string | null;
      tier: string;
      band: string;
      score: number;
      renewalStatus?: string | null;
    }
  | {
      ok: false;
      error: string;
    };

const DECISION_OPTIONS = [
  { value: "approved", label: "Approve" },
  { value: "rejected", label: "Reject" },
  { value: "suspended", label: "Suspend" },
] as const;

function prettify(value?: string | null) {
  if (!value) return "—";
  return value.replaceAll("_", " ");
}

function pillClass(value?: string | null) {
  const v = (value || "").toLowerCase();

  if (v === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }
  if (v === "in_review") {
    return "border-blue-200 bg-blue-50 text-blue-900";
  }
  if (v === "suspended") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }
  if (v === "rejected") {
    return "border-red-200 bg-red-50 text-red-900";
  }

  return "border-gray-200 bg-gray-50 text-gray-800";
}

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

export default function CaseDecisionsPage() {
  const params = useParams();
  const router = useRouter();

  const caseIdParam = params?.caseId;
  const caseId = Array.isArray(caseIdParam)
    ? String(caseIdParam[0] ?? "")
    : String(caseIdParam ?? "");

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [decisionRow, setDecisionRow] = React.useState<DecisionRow | null>(null);
  const [score, setScore] = React.useState<ScoreResponse | null>(null);

  const [decision, setDecision] = React.useState<"approved" | "rejected" | "suspended">("approved");
  const [summary, setSummary] = React.useState("Approved through admin verification workflow");
  const [conditions, setConditions] = React.useState("");

  async function load() {
    if (!caseId) return;

    setLoading(true);
    setError(null);

    try {
      const [decisionResp, scoreResp] = await Promise.all([
        fetchJson(`/api/admin/verification/decisions?caseId=${encodeURIComponent(caseId)}`),
        fetchJson(`/api/admin/verification/${encodeURIComponent(caseId)}/score`),
      ]);

      if (!decisionResp.data?.ok) {
        throw new Error(decisionResp.data?.error || "Failed to load decision");
      }

      setDecisionRow(decisionResp.data.row ?? null);

      if (scoreResp.data?.ok) {
        setScore(scoreResp.data as ScoreResponse);
      } else {
        setScore(scoreResp.data as ScoreResponse);
      }

      if (decisionResp.data.row?.decision) {
        const current = String(decisionResp.data.row.decision).toLowerCase();
        if (
          current === "approved" ||
          current === "rejected" ||
          current === "suspended"
        ) {
          setDecision(current);
        }
      }

      if (decisionResp.data.row?.summary) {
        setSummary(String(decisionResp.data.row.summary));
      }
      if (decisionResp.data.row?.conditions) {
        setConditions(String(decisionResp.data.row.conditions));
      }
    } catch (err: any) {
      setError(err?.message || String(err));
      setDecisionRow(null);
      setScore(null);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  React.useEffect(() => {
    if (decision === "approved" && !summary.trim()) {
      setSummary("Approved through admin verification workflow");
    }
    if (decision !== "approved" && summary === "Approved through admin verification workflow") {
      setSummary("");
    }
  }, [decision, summary]);

  async function saveDecision() {
    if (!caseId) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/verification/decisions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          caseId,
          decision,
          decidedBy: "admin",
          summary,
          conditions,
        }),
      });

      const data = (await res.json().catch(() => null)) as DecisionPostResponse | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Failed to save decision (HTTP ${res.status})`);
      }

      setSuccess(`Decision saved: ${prettify(data.decision)}`);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to save decision");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminNav />

      <main className="mx-auto max-w-[1100px] space-y-8 px-6 pb-16 pt-14">
        <AdminPageHeader
          title={`Decision — ${caseId}`}
          description="Record the canonical case decision before publish."
          meta={
            loading
              ? "Loading…"
              : decisionRow?.decision
                ? `Current decision: ${prettify(decisionRow.decision)}`
                : "No decision recorded"
          }
          actions={
            <div className="flex flex-wrap gap-3">
              <button
                onClick={load}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
              >
                {loading ? "Loading…" : "Refresh"}
              </button>

              <Link
                href={`/admin/verification/${encodeURIComponent(caseId)}`}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
              >
                Back to case
              </Link>
            </div>
          }
        />

        <CaseTabs caseId={caseId} />

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 text-[14px] text-black/80">{error}</div>
          </div>
        ) : null}

        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-emerald-800">Saved</div>
            <div className="mt-1 text-[14px] text-black/80">{success}</div>
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Case
            </div>
            <div className="mt-3 break-all text-[16px] font-semibold text-black">
              {caseId || "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Score
            </div>
            <div className="mt-3 text-[24px] font-semibold text-black">
              {score && score.ok ? score.score : "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Tier
            </div>
            <div className="mt-3 text-[16px] font-semibold text-black">
              {score && score.ok ? score.tier : "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Band
            </div>
            <div className="mt-3 text-[16px] font-semibold text-black">
              {score && score.ok ? score.band : "—"}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 p-5">
          <h2 className="text-[16px] font-semibold text-black">Latest decision</h2>

          {!decisionRow ? (
            <div className="mt-4 rounded-xl border border-dashed border-black/15 px-4 py-4 text-[14px] text-black/65">
              No decision has been recorded for this case yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold ${pillClass(
                    decisionRow.decision
                  )}`}
                >
                  {prettify(decisionRow.decision)}
                </span>

                <span className="text-[14px] text-black/60">
                  {decisionRow.decidedAt || "—"}
                  {decisionRow.decidedBy ? ` • ${decisionRow.decidedBy}` : ""}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-black/10 p-4">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
                    Summary
                  </div>
                  <div className="mt-2 text-[14px] leading-[1.7] text-black/75">
                    {decisionRow.summary || "—"}
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 p-4">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
                    Conditions
                  </div>
                  <div className="mt-2 text-[14px] leading-[1.7] text-black/75">
                    {decisionRow.conditions || "—"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-black/10 p-5">
          <h2 className="text-[16px] font-semibold text-black">Record decision</h2>
          <p className="mt-2 max-w-[860px] text-[14px] leading-[1.7] text-black/70">
            This writes the canonical decision record for the case and invokes the
            approval lifecycle procedure used by GAFAIG before registry publish.
          </p>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Decision
              </label>
              <div className="flex flex-wrap gap-3">
                {DECISION_OPTIONS.map((option) => {
                  const active = decision === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDecision(option.value)}
                      className={[
                        "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-[14px] font-semibold",
                        active
                          ? "border-black bg-black text-white"
                          : "border-black/15 bg-white hover:bg-black/[0.04]",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Decision summary"
              />
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Conditions
              </label>
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Conditions, limitations, or follow-up requirements"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveDecision}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-[14px] font-semibold text-white hover:bg-black/90 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Decision"}
              </button>

              <button
                type="button"
                onClick={() => router.push(`/admin/verification/${encodeURIComponent(caseId)}/publish`)}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-3 text-[14px] font-semibold hover:bg-black/[0.04]"
              >
                Go to Publish
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
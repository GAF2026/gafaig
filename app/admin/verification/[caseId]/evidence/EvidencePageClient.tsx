"use client";

/**
 * Evidence wrapper for consistent header/tabs layout.
 * Adds a governance metrics panel (counts + last summary update) for demo clarity.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CaseTabs from "../_components/CaseTabs";
import EvidenceClient from "./EvidenceClient";

type Metrics = {
  evidenceItems: number | null;
  findings: number | null;
  links: number | null;
  summariesStored: number | null;
  lastSummaryUpdatedAt: string | null;
};

function formatMaybeTimestamp(ts: string | null) {
  if (!ts) return "—";
  // Don’t risk locale parsing errors; keep it readable as-is if it already looks like a timestamp
  return ts;
}

async function safeJsonFetch(url: string) {
  const r = await fetch(url, { credentials: "include" });
  if (!r.ok) return null;
  try {
    return await r.json();
  } catch {
    return null;
  }
}

/**
 * Tries a few likely summary endpoints (because projects evolve).
 * Returns {count, lastUpdatedAt} when found, otherwise null.
 */
async function fetchSummaryStats(caseId: string): Promise<{ count: number; lastUpdatedAt: string | null } | null> {
  const candidates = [
    `/api/admin/verification/${encodeURIComponent(caseId)}/evidence-summaries`,
    `/api/admin/verification/${encodeURIComponent(caseId)}/summaries`,
    `/api/admin/verification/evidence-summaries?caseId=${encodeURIComponent(caseId)}`,
    `/api/admin/verification/summaries?caseId=${encodeURIComponent(caseId)}`,
  ];

  for (const url of candidates) {
    const data = await safeJsonFetch(url);
    if (!data || data.ok !== true) continue;

    // Common shapes we’ve used across the project:
    // { ok:true, rows:[{updatedAt:...}...], total:n }
    // { ok:true, count:n, lastUpdatedAt:"..." }
    const rows = Array.isArray(data.rows) ? data.rows : null;

    const count =
      typeof data.total === "number"
        ? data.total
        : typeof data.count === "number"
          ? data.count
          : rows
            ? rows.length
            : null;

    let lastUpdatedAt: string | null = null;

    if (typeof data.lastUpdatedAt === "string") lastUpdatedAt = data.lastUpdatedAt;

    if (!lastUpdatedAt && rows && rows.length) {
      // Try to infer the max updatedAt-like field
      const candidatesFields = ["updatedAt", "UPDATED_AT", "updated_at", "createdAt", "CREATED_AT", "created_at"];
      for (const f of candidatesFields) {
        const vals = rows
          .map((x: any) => (typeof x?.[f] === "string" ? x[f] : null))
          .filter(Boolean) as string[];
        if (vals.length) {
          // Lexicographic max works for ISO-ish timestamps and Snowflake default strings
          vals.sort();
          lastUpdatedAt = vals[vals.length - 1];
          break;
        }
      }
    }

    if (typeof count === "number") {
      return { count, lastUpdatedAt };
    }
  }

  return null;
}

export default function EvidencePageClient({ caseId }: { caseId: string }) {
  const [reloading, setReloading] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    evidenceItems: null,
    findings: null,
    links: null,
    summariesStored: null,
    lastSummaryUpdatedAt: null,
  });

  const backHref = useMemo(
    () => `/admin/verification/${encodeURIComponent(caseId)}`,
    [caseId]
  );

  async function loadMetrics() {
    setReloading(true);

    try {
      // Evidence items
      const evidence = await safeJsonFetch(
        `/api/admin/verification/${encodeURIComponent(caseId)}/evidence`
      );

      // Findings (if this endpoint exists)
      const findings = await safeJsonFetch(
        `/api/admin/verification/${encodeURIComponent(caseId)}/findings`
      );

      // Links between findings/evidence (you already used this endpoint via curl)
      const links = await safeJsonFetch(
        `/api/admin/verification/finding-evidence?caseId=${encodeURIComponent(caseId)}`
      );

      // Summaries stats (tries multiple endpoints)
      const summaryStats = await fetchSummaryStats(caseId);

      setMetrics({
        evidenceItems:
          typeof evidence?.total === "number"
            ? evidence.total
            : Array.isArray(evidence?.rows)
              ? evidence.rows.length
              : null,

        findings:
          typeof findings?.total === "number"
            ? findings.total
            : Array.isArray(findings?.rows)
              ? findings.rows.length
              : null,

        links:
          typeof links?.total === "number"
            ? links.total
            : Array.isArray(links?.rows)
              ? links.rows.length
              : null,

        summariesStored: summaryStats ? summaryStats.count : null,
        lastSummaryUpdatedAt: summaryStats ? summaryStats.lastUpdatedAt : null,
      });
    } finally {
      setReloading(false);
    }
  }

  useEffect(() => {
    loadMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const metricCard = (label: string, value: string, sub?: string) => (
    <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-black/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {sub ? <div className="mt-1 text-xs text-black/60">{sub}</div> : null}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Top row: back + refresh */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Evidence</h1>
          <div className="mt-2 text-sm text-black/60">
            Case: <span className="font-mono text-black/80">{caseId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={backHref}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/[0.04]"
          >
            ← Back
          </Link>

          <button
            type="button"
            onClick={loadMetrics}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/[0.04]"
            title="Refresh governance metrics"
            disabled={reloading}
          >
            {reloading ? "Refreshing…" : "Refresh metrics"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <CaseTabs caseId={caseId} active="evidence" />
      </div>

      {/* Governance metrics panel */}
      <div className="mb-8 rounded-2xl border border-black/10 bg-white p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">Governance metrics</div>
          <div className="text-xs text-black/55">
            Snapshot for this case (auditable workflow)
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metricCard(
            "Evidence items",
            metrics.evidenceItems === null ? "—" : String(metrics.evidenceItems)
          )}
          {metricCard(
            "Findings",
            metrics.findings === null ? "—" : String(metrics.findings)
          )}
          {metricCard("Links", metrics.links === null ? "—" : String(metrics.links))}
          {metricCard(
            "Summaries stored",
            metrics.summariesStored === null ? "—" : String(metrics.summariesStored),
            metrics.summariesStored === null
              ? "Auto-detected if endpoint exists"
              : undefined
          )}
          {metricCard(
            "Last summary update",
            formatMaybeTimestamp(metrics.lastSummaryUpdatedAt),
            metrics.lastSummaryUpdatedAt ? "From summaries data" : "—"
          )}
        </div>
      </div>

      {/* Existing Evidence UI (unchanged) */}
      <EvidenceClient caseId={caseId} />
    </div>
  );
}
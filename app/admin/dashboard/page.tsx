"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminNav from "../_components/AdminNav";
import AdminPageHeader from "../_components/AdminPageHeader";

type MetricsResp = {
  ok: boolean;
  metrics?: {
    total: number;
    byStatus: Record<string, number>;
    thisMonth: number;
    verifiedParticipants: number;
  };
  error?: string;
};

type EventRow = {
  eventId: string;
  caseId: string;
  eventType: string;
  actor: string | null;
  details: any;
  createdAt: string;
};

type EventsResp =
  | { ok: true; rows: EventRow[] }
  | { ok: false; error: string };

function fmt(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return "0";
  return n.toLocaleString();
}

function safeStr(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function labelForStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value || "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [data, setData] = useState<MetricsResp | null>(null);
  const metrics = data?.metrics;

  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsErr, setEventsErr] = useState<string | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);

  const statusOrder = useMemo(
    () => ["received", "in_review", "approved", "rejected", "suspended"],
    []
  );

  async function loadMetrics() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/metrics", { cache: "no-store" });
      const json = (await res.json()) as MetricsResp;

      if (!res.ok || !json.ok) {
        throw new Error(json.error || `Failed to load metrics (${res.status})`);
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load metrics");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadRecentActivity() {
    setEventsLoading(true);
    setEventsErr(null);

    try {
      const res = await fetch(`/api/admin/verification/events?limit=8`, {
        cache: "no-store",
      });

      const text = await res.text();
      let json: EventsResp;

      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(
          `Unexpected response (not JSON). First chars: ${text.slice(0, 80)}`
        );
      }

      if (!("ok" in json) || json.ok === false) {
        throw new Error(
          (json as any)?.error || `Failed to load events (${res.status})`
        );
      }

      const rows = Array.isArray(json.rows) ? json.rows : [];
      const sorted = [...rows]
        .sort((a, b) =>
          safeStr(b.createdAt).localeCompare(safeStr(a.createdAt))
        )
        .slice(0, 8);

      setEvents(sorted);
    } catch (e: any) {
      setEventsErr(e?.message ?? "Failed to load recent activity");
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }

  async function refreshAll() {
    await Promise.all([loadMetrics(), loadRecentActivity()]);
  }

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
        <AdminPageHeader
          title="Dashboard"
          description="Operational overview of the verification workflow and public registry."
          actions={
            <button
              type="button"
              onClick={refreshAll}
              disabled={loading || eventsLoading}
              className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04] disabled:opacity-60"
            >
              {loading || eventsLoading ? "Refreshing…" : "Refresh"}
            </button>
          }
        />

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 text-[14px] text-black/80">{error}</div>
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
              Total submissions
            </div>
            <div className="mt-4 text-[52px] font-semibold leading-none text-black">
              {loading ? "…" : fmt(metrics?.total)}
            </div>
            <div className="mt-3 text-[14px] text-black/60">All time</div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
              This month
            </div>
            <div className="mt-4 text-[52px] font-semibold leading-none text-black">
              {loading ? "…" : fmt(metrics?.thisMonth)}
            </div>
            <div className="mt-3 text-[14px] text-black/60">New submissions</div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
              Verified participants
            </div>
            <div className="mt-4 text-[52px] font-semibold leading-none text-black">
              {loading ? "…" : fmt(metrics?.verifiedParticipants)}
            </div>
            <div className="mt-3 text-[14px] text-black/60">Public registry</div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-black/10 p-5">
            <h2 className="text-[16px] font-semibold text-black">
              Submissions by status
            </h2>

            <div className="mt-4 grid gap-3">
              {statusOrder.map((status) => (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3"
                >
                  <div className="text-[15px] font-semibold capitalize text-black/80">
                    {labelForStatus(status)}
                  </div>
                  <div className="text-[20px] font-semibold text-black">
                    {loading ? "…" : fmt(metrics?.byStatus?.[status] ?? 0)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-[13px] text-black/55">
              Counts are computed from Snowflake-backed workflow tables.
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <h2 className="text-[16px] font-semibold text-black">
              Recent activity
            </h2>

            {eventsErr ? (
              <div className="mt-3 text-[14px] font-medium text-red-700">
                {eventsErr}
              </div>
            ) : null}

            <div className="mt-4 grid gap-3" aria-busy={eventsLoading ? "true" : "false"}>
              {eventsLoading ? (
                <div className="text-[14px] text-black/60">Loading…</div>
              ) : events.length === 0 ? (
                <div className="text-[14px] text-black/60">
                  No recent events found.
                </div>
              ) : (
                events.map((e) => (
                  <div
                    key={e.eventId}
                    className="rounded-xl border border-black/10 bg-white px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full border border-black/15 px-3 py-1 text-[12px] font-semibold text-black">
                        {e.eventType}
                      </span>
                      <span className="text-[12px] text-black/55">
                        {formatDateTime(safeStr(e.createdAt))}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-[13px] text-black/65">
                      <span>{e.actor || "—"}</span>
                      <Link
                        href={`/admin/verification/${encodeURIComponent(
                          e.caseId
                        )}/events`}
                        className="font-mono underline underline-offset-2"
                      >
                        {e.caseId}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                href="/admin/verification"
                className="text-[14px] font-semibold text-black/80 underline"
              >
                View verification workflow →
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-6 text-[13px] text-black/55">
          Data source: Snowflake
        </footer>
      </main>
    </div>
  );
}
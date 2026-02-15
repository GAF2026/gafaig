"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "../_components/AdminNav";

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

function pillTextForStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [data, setData] = useState<MetricsResp | null>(null);
  const metrics = data?.metrics;

  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsErr, setEventsErr] = useState<string | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);

  // Demo-friendly: show activity for a known case if present
  const activityCaseId = "CASE-0001";

  const statusOrder = useMemo(() => ["received", "in_review", "approved", "rejected", "suspended"], []);

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
      const res = await fetch(`/api/admin/verification/events?caseId=${encodeURIComponent(activityCaseId)}`, {
        cache: "no-store",
      });

      const text = await res.text();
      let json: EventsResp;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response (not JSON). First chars: ${text.slice(0, 80)}`);
      }

      if (!("ok" in json) || json.ok === false) {
        throw new Error((json as any)?.error || `Failed to load events (${res.status})`);
      }

      const rows = Array.isArray(json.rows) ? json.rows : [];
      // newest first, keep top 8
      const sorted = [...rows].sort((a, b) => safeStr(b.createdAt).localeCompare(safeStr(a.createdAt))).slice(0, 8);
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

      <main className="wrap">
        <header className="top">
          <div className="left">
            <div className="eyebrow">GAFAIG Admin</div>
            <div className="titleRow">
              <h1 className="h1">Dashboard</h1>
              <span className="badge" title="Live data from Snowflake">
                <span className="dot" /> Snowflake (Live)
              </span>
            </div>
            <p className="sub">Operational overview of the verification workflow and public registry.</p>
          </div>

          <div className="right">
            <button className="btn" onClick={refreshAll} disabled={loading || eventsLoading}>
              {loading || eventsLoading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>

        {error ? (
          <div className="errorBox">
            <div className="errorTitle">Error</div>
            <div className="errorMsg">{error}</div>
          </div>
        ) : null}

        <section className="grid">
          <div className="card kpi">
            <div className="kpiLabel">Total submissions</div>
            <div className="kpiValue">{loading ? "…" : fmt(metrics?.total)}</div>
            <div className="kpiSub">All time</div>
          </div>

          <div className="card kpi">
            <div className="kpiLabel">This month</div>
            <div className="kpiValue">{loading ? "…" : fmt(metrics?.thisMonth)}</div>
            <div className="kpiSub">New submissions</div>
          </div>

          <div className="card kpi">
            <div className="kpiLabel">Verified participants</div>
            <div className="kpiValue">{loading ? "…" : fmt(metrics?.verifiedParticipants)}</div>
            <div className="kpiSub">Public registry</div>
          </div>

          <div className="card statusCard">
            <div className="cardTitle">Submissions by status</div>

            <div className="statusGrid">
              {statusOrder.map((s) => (
                <div key={s} className="statusRow">
                  <div className="statusName">{pillTextForStatus(s)}</div>
                  <div className="statusValue">{loading ? "…" : fmt(metrics?.byStatus?.[s] ?? 0)}</div>
                </div>
              ))}
            </div>

            <div className="hint">Counts are computed from Snowflake-backed workflow tables.</div>
          </div>

          <div className="card activityCard">
            <div className="cardTitle">
              Recent activity <span className="muted">(Case: {activityCaseId})</span>
            </div>

            {eventsErr ? <div className="miniError">{eventsErr}</div> : null}

            <div className="activityList" aria-busy={eventsLoading ? "true" : "false"}>
              {eventsLoading ? (
                <div className="activityEmpty">Loading…</div>
              ) : events.length === 0 ? (
                <div className="activityEmpty">No recent events found.</div>
              ) : (
                events.map((e) => (
                  <div key={e.eventId} className="activityItem">
                    <div className="activityTop">
                      <span className="pill">{e.eventType}</span>
                      <span className="time mono">{safeStr(e.createdAt)}</span>
                    </div>
                    <div className="activityBottom">
                      <span className="actor">{e.actor || "—"}</span>
                      <span className="id mono">{e.eventId}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="activityActions">
              <a className="link" href={`/admin/verification/${encodeURIComponent(activityCaseId)}/events`}>
                View all events →
              </a>
            </div>
          </div>
        </section>

        <footer className="foot">Data source: Snowflake</footer>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .wrap {
          max-width: 1160px;
          margin: 0 auto;
          padding: 48px 24px 56px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .eyebrow {
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.55);
          font-weight: 800;
        }

        .titleRow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .h1 {
          margin: 0;
          font-size: 40px;
          line-height: 1.05;
          font-weight: 900;
        }

        .sub {
          margin: 8px 0 0;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.65);
          max-width: 760px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.14);
          background: #fff;
          font-weight: 900;
          font-size: 14px;
          white-space: nowrap;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #16a34a;
          display: inline-block;
        }

        .right {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 18px;
        }

        .btn {
          height: 46px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: #fff;
          font-weight: 900;
          cursor: pointer;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .errorBox {
          margin: 10px 0 18px;
          border: 1px solid rgba(185, 28, 28, 0.35);
          background: rgba(185, 28, 28, 0.06);
          border-radius: 14px;
          padding: 12px 14px;
        }
        .errorTitle {
          font-weight: 900;
          color: #b91c1c;
        }
        .errorMsg {
          margin-top: 6px;
          color: rgba(0, 0, 0, 0.8);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 14px;
          align-items: start;
        }

        .card {
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          border-radius: 18px;
          padding: 16px;
        }

        .kpi {
          grid-column: span 4;
          min-height: 120px;
        }

        .kpiLabel {
          font-weight: 900;
          color: rgba(0, 0, 0, 0.65);
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .kpiValue {
          margin-top: 10px;
          font-size: 44px;
          font-weight: 950;
          line-height: 1;
        }

        .kpiSub {
          margin-top: 8px;
          color: rgba(0, 0, 0, 0.62);
          font-size: 14px;
          font-weight: 700;
        }

        .statusCard {
          grid-column: span 5;
        }

        .activityCard {
          grid-column: span 7;
        }

        .cardTitle {
          font-size: 16px;
          font-weight: 950;
          margin-bottom: 12px;
        }

        .muted {
          color: rgba(0, 0, 0, 0.55);
          font-weight: 800;
          font-size: 13px;
        }

        .statusGrid {
          display: grid;
          gap: 10px;
          margin-top: 6px;
        }

        .statusRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(0, 0, 0, 0.02);
        }

        .statusName {
          font-weight: 900;
          color: rgba(0, 0, 0, 0.72);
          text-transform: capitalize;
        }

        .statusValue {
          font-weight: 950;
          font-size: 18px;
        }

        .hint {
          margin-top: 12px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.58);
          font-weight: 700;
        }

        .miniError {
          margin: 8px 0 10px;
          color: #b91c1c;
          font-weight: 900;
          font-size: 13px;
        }

        .activityList {
          display: grid;
          gap: 10px;
        }

        .activityItem {
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: #fff;
        }

        .activityTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .activityBottom {
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: rgba(0, 0, 0, 0.65);
          font-weight: 700;
          font-size: 13px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.16);
          font-weight: 950;
          font-size: 12px;
          text-transform: lowercase;
          background: #fff;
        }

        .time {
          color: rgba(0, 0, 0, 0.6);
          font-size: 12px;
          font-weight: 800;
        }

        .actor {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 55%;
        }

        .id {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 45%;
          text-align: right;
        }

        .activityEmpty {
          color: rgba(0, 0, 0, 0.62);
          font-weight: 700;
          padding: 6px 2px;
        }

        .activityActions {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
        }

        .link {
          color: #4c1d95;
          font-weight: 950;
          text-decoration: underline;
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
            monospace;
        }

        .foot {
          margin-top: 16px;
          color: rgba(0, 0, 0, 0.55);
          font-weight: 800;
          font-size: 13px;
        }

        @media (max-width: 980px) {
          .kpi {
            grid-column: span 6;
          }
          .statusCard {
            grid-column: span 12;
          }
          .activityCard {
            grid-column: span 12;
          }
          .actor {
            max-width: 60%;
          }
          .id {
            max-width: 40%;
          }
        }

        @media (max-width: 640px) {
          .kpi {
            grid-column: span 12;
          }
          .h1 {
            font-size: 34px;
          }
        }
      `}</style>
    </div>
  );
}
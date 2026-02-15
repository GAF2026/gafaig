"use client";

import { useEffect, useMemo, useState } from "react";

type EventRow = {
  eventId: string;
  caseId: string;
  eventType: string;
  actor: string | null;
  details: any;
  createdAt: string;
};

type ApiGetResponse =
  | { ok: true; rows: EventRow[] }
  | { ok: false; error: string };

type ApiPostResponse =
  | { ok: true; eventId: string }
  | { ok: false; error: string };

function safeJsonParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function prettyDetails(d: any) {
  if (d == null) return "";
  if (typeof d === "string") return d;
  try {
    return JSON.stringify(d, null, 2);
  } catch {
    return String(d);
  }
}

export default function VerificationEventsPage({ params }: { params: { caseId: string } }) {
  const caseId = params.caseId;

  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [eventType, setEventType] = useState("comment");
  const [actor, setActor] = useState("admin@gafaig.com");
  const [note, setNote] = useState("");

  const showingText = useMemo(() => `Showing ${rows.length} event${rows.length === 1 ? "" : "s"}`, [rows.length]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/verification/events?caseId=${encodeURIComponent(caseId)}`, {
        method: "GET",
        cache: "no-store",
      });

      const text = await res.text();
      const data = safeJsonParse(text) as ApiGetResponse | null;
      if (!data) throw new Error(`Unexpected response (not JSON). First chars: ${text.slice(0, 60)}`);
      if (!data.ok) throw new Error(data.error || "Failed to load events.");

      setRows(data.rows || []);
    } catch (e: any) {
      setRows([]);
      setErr(e?.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  async function addEvent() {
    setLoading(true);
    setErr(null);
    try {
      const payload = {
        caseId,
        eventType,
        actor: actor?.trim() || null,
        details: { note: note.trim() },
      };

      const res = await fetch("/api/admin/verification/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const data = safeJsonParse(text) as ApiPostResponse | null;
      if (!data) throw new Error(`Unexpected response (not JSON). First chars: ${text.slice(0, 60)}`);
      if (!data.ok) throw new Error(data.error || "Failed to add event.");

      setNote("");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Failed to add event.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  return (
    <main className="wrap">
      <header className="header">
        <h1 className="title">Admin — Verification Events</h1>
        <p className="subtitle">
          Case: <span className="mono">{caseId}</span>
        </p>
      </header>

      <section className="composer" aria-label="Add event">
        <div className="field">
          <label className="label" htmlFor="etype">
            Event type
          </label>
          <select id="etype" className="control" value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option value="comment">comment</option>
            <option value="submitted">submitted</option>
            <option value="status_changed">status_changed</option>
            <option value="evidence_added">evidence_added</option>
            <option value="decision">decision</option>
          </select>
        </div>

        <div className="field">
          <label className="label" htmlFor="actor">
            Actor
          </label>
          <input
            id="actor"
            className="control"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            placeholder="admin@gafaig.com"
            autoComplete="off"
          />
        </div>

        <div className="field note">
          <label className="label" htmlFor="note">
            Note
          </label>
          <input
            id="note"
            className="control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an event note…"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") addEvent();
            }}
          />
        </div>

        <button className="primary" onClick={addEvent} disabled={loading || note.trim().length === 0}>
          {loading ? "Working…" : "Add event"}
        </button>
      </section>

      <div className="meta">
        <div className="small">{showingText}</div>
        <button className="ghost" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {err ? <div className="error">Error: {err}</div> : null}

      <section className="tableWrap" aria-label="Events table">
        <div className="tableHead">
          <div>Time</div>
          <div>Type</div>
          <div>Actor</div>
          <div>Details</div>
        </div>

        {rows.length === 0 ? (
          <div className="empty">{loading ? "Loading…" : "No events found."}</div>
        ) : (
          rows.map((r) => (
            <div className="row" key={r.eventId}>
              <div className="mono">{r.createdAt}</div>
              <div className="pill">{r.eventType}</div>
              <div>{r.actor || "—"}</div>
              <pre className="details">{prettyDetails(r.details) || "—"}</pre>
            </div>
          ))
        )}
      </section>

      <footer className="footer">
        <nav className="crumbs">
          <a href="/admin/verification" className="crumbLink">
            ← Back to verification
          </a>
        </nav>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .header {
          margin-bottom: 18px;
        }

        .title {
          font-size: 40px;
          line-height: 1.08;
          font-weight: 900;
          margin: 0 0 10px 0;
          letter-spacing: -0.02em;
        }

        .subtitle {
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          color: #374151;
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }

        .composer {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 220px 260px minmax(260px, 1fr) 180px;
          gap: 14px;
          align-items: end;
          padding: 14px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 16px;
          background: #fff;
        }

        @media (max-width: 980px) {
          .composer {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .composer {
            grid-template-columns: 1fr;
          }
        }

        .field {
          min-width: 0;
        }

        .note {
          min-width: 0;
        }

        .label {
          display: block;
          font-size: 14px;
          margin-bottom: 8px;
          color: #374151;
        }

        .control {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          padding: 10px 12px;
          font-size: 16px;
          outline: none;
          background: #fff;
        }

        .primary {
          height: 44px;
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: #000;
          color: #fff;
          font-weight: 900;
          cursor: pointer;
        }

        .primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .meta {
          margin: 14px 0 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .small {
          font-size: 14px;
          color: #374151;
        }

        .ghost {
          height: 40px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: #fff;
          font-weight: 800;
          cursor: pointer;
        }

        .ghost:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          margin-top: 12px;
          color: #b91c1c;
          font-weight: 900;
        }

        .tableWrap {
          margin-top: 16px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
        }

        .tableHead {
          display: grid;
          grid-template-columns: 1.2fr 0.9fr 1fr 2fr;
          gap: 12px;
          padding: 14px 16px;
          font-weight: 900;
          color: #374151;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(0, 0, 0, 0.02);
        }

        .row {
          display: grid;
          grid-template-columns: 1.2fr 0.9fr 1fr 2fr;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          align-items: start;
          font-size: 15px;
        }

        .row:last-child {
          border-bottom: none;
        }

        .empty {
          padding: 18px 16px;
          font-size: 16px;
          color: #111827;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.16);
          font-weight: 800;
          font-size: 13px;
          width: fit-content;
        }

        .details {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 13px;
          line-height: 1.5;
          color: #111827;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.10);
          background: rgba(0, 0, 0, 0.02);
        }

        .footer {
          margin-top: 18px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        .crumbs {
          font-size: 16px;
        }

        .crumbLink {
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";

type ApiGet = {
  ok: true;
  row: {
    caseId: string;
    status: string;
  } | null;
} | {
  ok: false;
  error: string;
};

type ApiPost = {
  ok: true;
  caseId: string;
  from: string;
  to: string;
  eventId: string;
} | {
  ok: false;
  error: string;
  from?: string;
  to?: string;
  allowedNext?: string[];
};

export default function StatusPage({ params }: { params: { caseId: string } }) {
  const caseId = params?.caseId || "";

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [currentStatus, setCurrentStatus] = useState<string>("");

  const [newStatus, setNewStatus] = useState("in_review");
  const [actor, setActor] = useState("admin@gafaig.com");
  const [note, setNote] = useState("");

  const backHref = useMemo(
    () => `/admin/verification/${encodeURIComponent(caseId)}`,
    [caseId]
  );

  async function load() {
    if (!caseId) return;

    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(
        `/api/admin/verification?search=${encodeURIComponent(caseId)}&page=1&pageSize=1`
      );

      const data = await res.json();

      if (!data.ok || !data.rows?.length) {
        throw new Error("Case not found");
      }

      setCurrentStatus(data.rows[0].status);
    } catch (e: any) {
      setErr(e?.message || "Failed to load status.");
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    setLoading(true);
    setErr(null);

    try {
      const payload = {
        caseId,
        status: newStatus,
        actor,
        note: note.trim() || undefined,
      };

      const res = await fetch("/api/admin/verification/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: ApiPost = await res.json();

      if (!data.ok) {
        throw new Error(data.error);
      }

      await load();
    } catch (e: any) {
      setErr(e?.message || "Failed to update status.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [caseId]);

  return (
    <main className="wrap">
      <header className="top">
        <div>
          <h1 className="title">Status</h1>
          <div className="sub">
            Case: <span className="mono">{caseId}</span>
          </div>
        </div>

        <div className="actions">
          <a className="btn" href={backHref}>
            ← Back
          </a>

          <button className="btn" onClick={load} disabled={loading}>
            Refresh
          </button>
        </div>
      </header>

      {err && <div className="error">{err}</div>}

      <section className="card">
        <h2 className="h2">Current status</h2>

        <div className="kv">
          <div className="k">Status</div>
          <div className="v">{currentStatus || "—"}</div>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2 className="h2">Update status</h2>

        <div className="grid">
          <div className="field">
            <label className="label">New status</label>
            <select
              className="control"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="received">received</option>
              <option value="in_review">in_review</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="suspended">suspended</option>
            </select>
          </div>

          <div className="field">
            <label className="label">Actor</label>
            <input
              className="control"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
            />
          </div>

          <div className="field span2">
            <label className="label">Note (optional)</label>
            <input
              className="control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for status change"
            />
          </div>
        </div>

        <div className="bar">
          <button className="primary" onClick={submit} disabled={loading}>
            Update status
          </button>
        </div>
      </section>

      <style jsx>{`
        .wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .title {
          font-size: 44px;
          font-weight: 800;
        }

        .btn {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: white;
          font-weight: 800;
          cursor: pointer;
        }

        .card {
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 18px;
          padding: 18px;
          background: white;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .span2 {
          grid-column: 1 / -1;
        }

        .control {
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
        }

        .primary {
          background: black;
          color: white;
          padding: 10px 16px;
          border-radius: 12px;
          font-weight: 800;
        }

        .error {
          color: red;
          margin-bottom: 12px;
        }
      `}</style>
    </main>
  );
}
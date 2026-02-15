"use client";

import { useEffect, useMemo, useState } from "react";

type AssignmentRow = {
  assignmentId: string;
  caseId: string;
  assignedTo: string;
  role: string;
  assignedAt: string;
};

type ApiGetResponse =
  | { ok: true; rows: AssignmentRow[] }
  | { ok: false; error: string };

type ApiPostResponse =
  | { ok: true; assignmentId: string }
  | { ok: false; error: string };

export default function CaseAssignmentsPage({
  params,
}: {
  params: { caseId: string };
}) {
  const caseId = params.caseId;

  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [assignedTo, setAssignedTo] = useState("");
  const [role, setRole] = useState("reviewer");
  const [saving, setSaving] = useState(false);

  const showingText = useMemo(
    () => `Showing ${rows.length} of ${rows.length}`,
    [rows.length]
  );

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(
        `/api/admin/verification/assignments?caseId=${encodeURIComponent(caseId)}`,
        { cache: "no-store" }
      );

      const text = await res.text();
      let data: ApiGetResponse;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Unexpected response (not JSON). First chars: ${text.slice(0, 80)}`
        );
      }

      if (!data.ok) throw new Error(data.error || "Failed to load assignments.");

      setRows(data.rows || []);
    } catch (e: any) {
      setRows([]);
      setErr(e?.message || "Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  }

  async function addAssignment() {
    setSaving(true);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/verification/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          assignedTo: assignedTo.trim(),
          role,
        }),
      });

      const text = await res.text();
      let data: ApiPostResponse;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Unexpected response (not JSON). First chars: ${text.slice(0, 80)}`
        );
      }

      if (!data.ok) throw new Error(data.error || "Failed to add assignment.");

      setAssignedTo("");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Failed to add assignment.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  return (
    <main className="wrap">
      <header className="head">
        <div>
          <h1 className="title">Admin — Assignments</h1>
          <p className="sub">
            Case: <span className="mono">{caseId}</span>
          </p>
        </div>

        <div className="actions">
          <a className="btn" href={`/admin/verification/${caseId}`}>
            Back to case
          </a>
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </header>

      {err ? <div className="error">Error: {err}</div> : null}

      <section className="card">
        <div className="cardTitle">Add assignment</div>

        <div className="formGrid" aria-label="Add assignment form">
          <div className="field">
            <label className="label" htmlFor="assignedTo">
              Assigned to (email / username)
            </label>
            <input
              id="assignedTo"
              className="control"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="reviewer1@gafaig.com"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="reviewer">reviewer</option>
              <option value="lead">lead</option>
              <option value="auditor">auditor</option>
            </select>
          </div>

          <button
            className="primary"
            onClick={addAssignment}
            disabled={saving || assignedTo.trim().length === 0}
          >
            {saving ? "Saving…" : "Add assignment"}
          </button>
        </div>
      </section>

      <div className="meta">
        <div className="small">{showingText}</div>
      </div>

      <section className="table" aria-label="Assignments table">
        <div className="thead">
          <div>Assigned to</div>
          <div>Role</div>
          <div>Assigned</div>
          <div>Assignment ID</div>
        </div>

        {rows.length === 0 ? (
          <div className="empty">
            {loading ? "Loading…" : "No assignments yet."}
          </div>
        ) : (
          rows.map((r) => (
            <div className="row" key={r.assignmentId}>
              <div>{r.assignedTo}</div>
              <div className="pill">{r.role}</div>
              <div className="mono">{r.assignedAt}</div>
              <div className="mono">{r.assignmentId}</div>
            </div>
          ))
        )}
      </section>

      <footer className="foot">
        <nav className="crumbs">
          <a className="crumbLink" href="/admin/applications">
            Admin
          </a>
          <span className="dot">·</span>
          <a className="crumbLink" href="/admin/verification">
            Verification
          </a>
          <span className="dot">·</span>
          <a className="crumbLink" href={`/admin/verification/${caseId}`}>
            {caseId}
          </a>
          <span className="dot">·</span>
          <span>Assignments</span>
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

        .head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
        }

        .title {
          font-size: 44px;
          line-height: 1.05;
          font-weight: 800;
          margin: 0 0 10px 0;
        }

        .sub {
          margin: 0;
          font-size: 16px;
          color: #374151;
        }

        .actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: #fff;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
        }

        .error {
          margin-top: 16px;
          color: #b91c1c;
          font-weight: 800;
          font-size: 18px;
        }

        .card {
          margin-top: 18px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 18px;
          background: #fff;
          padding: 18px;
        }

        .cardTitle {
          font-weight: 800;
          margin-bottom: 12px;
          color: #111827;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 260px 220px;
          gap: 14px;
          align-items: end;
        }

        @media (max-width: 900px) {
          .formGrid {
            grid-template-columns: 1fr;
          }
        }

        .field {
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
          height: 48px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          padding: 10px 14px;
          font-size: 16px;
          outline: none;
          background: #fff;
        }

        .primary {
          height: 48px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: #000;
          color: #fff;
          font-weight: 900;
          cursor: pointer;
          font-size: 16px;
        }

        .primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .meta {
          margin: 14px 0 0 0;
          display: flex;
          justify-content: flex-end;
        }

        .small {
          font-size: 14px;
          color: #374151;
        }

        .table {
          margin-top: 18px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
        }

        .thead {
          display: grid;
          grid-template-columns: 1.2fr 0.6fr 0.9fr 1.2fr;
          padding: 14px 16px;
          font-weight: 800;
          color: #374151;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 14px;
        }

        .row {
          display: grid;
          grid-template-columns: 1.2fr 0.6fr 0.9fr 1.2fr;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          align-items: center;
          font-size: 15px;
        }

        .row:last-child {
          border-bottom: none;
        }

        .empty {
          padding: 16px;
          font-size: 15px;
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 13px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          font-weight: 800;
          width: max-content;
          font-size: 13px;
        }

        .foot {
          margin-top: 18px;
          display: flex;
          justify-content: flex-end;
        }

        .crumbs {
          font-size: 14px;
          color: #111827;
        }

        .crumbLink {
          text-decoration: underline;
        }

        .dot {
          margin: 0 10px;
          color: #6b7280;
        }
      `}</style>
    </main>
  );
}
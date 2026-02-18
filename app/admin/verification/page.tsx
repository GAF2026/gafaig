"use client";

import { useEffect, useMemo, useState } from "react";

type VerificationCaseRow = {
  caseId: string;
  entityName: string;
  verificationType: string;
  status: string;
  priority: string | null;
  updatedAt: string;
};

type ApiResponse =
  | {
      ok: true;
      rows: VerificationCaseRow[];
      total: number;
      page: number;
      pageSize: number;
      filters?: Record<string, any>;
    }
  | { ok: false; error: string };

function truncateMiddle(s: string, left = 14, right = 6) {
  const v = String(s || "");
  if (v.length <= left + right + 1) return v;
  return `${v.slice(0, left)}…${v.slice(-right)}`;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function statusPill(status: string) {
  const s = String(status || "").toLowerCase();
  if (s === "approved") return "pill approved";
  if (s === "rejected") return "pill rejected";
  if (s === "suspended") return "pill suspended";
  if (s === "in_review") return "pill review";
  if (s === "received") return "pill received";
  if (s === "needs_more_info") return "pill needs";
  return "pill";
}

export default function AdminVerificationPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [verificationType, setVerificationType] = useState("all");

  const [rows, setRows] = useState<VerificationCaseRow[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const showingText = useMemo(
    () => `Showing ${rows.length} of ${total}`,
    [rows.length, total]
  );

  async function load(nextPage?: number) {
    const targetPage = nextPage ?? page;
    setLoading(true);
    setErr(null);

    try {
      const params = new URLSearchParams();
      params.set("search", search);
      params.set("status", status);
      params.set("verificationType", verificationType);
      params.set("page", String(targetPage));
      params.set("pageSize", String(pageSize));

      const res = await fetch(`/api/admin/verification?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const text = await res.text();

      let data: ApiResponse | any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Unexpected response (not JSON). First chars: ${text.slice(0, 80)}`
        );
      }

      if (!("ok" in data) || data.ok === false) {
        throw new Error(data?.error || "Unknown error loading verification cases.");
      }

      setRows(Array.isArray(data.rows) ? data.rows : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch (e: unknown) {
      setRows([]);
      setTotal(0);

      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as any).message)
          : "";

      setErr(msg || "Failed to load verification cases.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function onRefresh() {
    setPage(1);
    load(1);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setPage(1);
      load(1);
    }
  }

  return (
    <main className="wrap">
      <header className="header">
        <h1 className="title">Admin — Verification</h1>
        <p className="subtitle">
          Track verification cases for submissions and registry participants.
        </p>
      </header>

      <section className="filters" aria-label="Filters">
        <div className="field search">
          <label className="label" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            className="control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onSearchKeyDown}
            placeholder="Search entity, case ID…"
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="received">received</option>
            <option value="in_review">in_review</option>
            <option value="needs_more_info">needs_more_info</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="suspended">suspended</option>
          </select>
        </div>

        <div className="field">
          <label className="label" htmlFor="vtype">
            Verification type
          </label>
          <select
            id="vtype"
            className="control"
            value={verificationType}
            onChange={(e) => setVerificationType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="participant">participant</option>
            <option value="submission">submission</option>
            <option value="renewal">renewal</option>
            <option value="incident">incident</option>
          </select>
        </div>

        <button className="refresh" onClick={onRefresh} disabled={loading} type="button">
          {loading ? "Loading…" : "Refresh"}
        </button>
      </section>

      <div className="meta">
        <div className="small">{showingText}</div>
      </div>

      {err ? <div className="error">Error: {err}</div> : null}

      <section className="tableWrap" aria-label="Verification cases table">
        <div className="tableHead">
          <div>Case ID</div>
          <div>Entity</div>
          <div>Type</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Updated</div>
        </div>

        {rows.length === 0 ? (
          <div className="empty">{loading ? "Loading…" : "No verification cases found."}</div>
        ) : (
          rows.map((r) => {
            const href = `/admin/verification/${encodeURIComponent(r.caseId)}`;
            return (
              <div className="row" key={r.caseId}>
                {/* Case ID cell: fixed layout so Copy always aligns */}
                <div className="cell caseCell">
                  <a className="caseLink mono" href={href} title={r.caseId}>
                    {truncateMiddle(r.caseId)}
                  </a>
                  <button
                    className="copyBtn"
                    onClick={() => copyText(r.caseId)}
                    title="Copy Case ID"
                    type="button"
                  >
                    Copy
                  </button>
                </div>

                <div className="cell">{r.entityName}</div>

                <div className="cell">
                  <span className="tag">{r.verificationType}</span>
                </div>

                <div className="cell">
                  <span className={statusPill(r.status)}>{r.status}</span>
                </div>

                <div className="cell">{r.priority || "—"}</div>

                <div className="cell mono">{r.updatedAt}</div>
              </div>
            );
          })
        )}
      </section>

      <footer className="footer">
        <div className="pager">
          <button
            className="pagerBtn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            type="button"
          >
            Prev
          </button>
          <div className="pagerText">Page {page}</div>
          <button
            className="pagerBtn"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading || rows.length < pageSize}
            type="button"
          >
            Next
          </button>
        </div>

        <nav className="crumbs">
          <a href="/" className="crumbLink">
            Home
          </a>
          <span className="dot">·</span>
          <a href="/admin/applications" className="crumbLink">
            Submissions
          </a>
          <span className="dot">·</span>
          <span>Verification</span>
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
          margin-bottom: 14px;
        }

        .title {
          font-size: 28px;
          line-height: 1.15;
          font-weight: 900;
          margin: 0 0 8px 0;
        }

        .subtitle {
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          color: #374151;
        }

        .filters {
          margin-top: 18px;
          display: grid;
          grid-template-columns: minmax(320px, 1fr) 240px 260px 180px;
          gap: 14px;
          align-items: end;
        }

        .field {
          min-width: 0;
        }

        .label {
          display: block;
          font-size: 13px;
          margin-bottom: 8px;
          color: #374151;
          font-weight: 800;
        }

        .control {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          padding: 10px 14px;
          font-size: 15px;
          outline: none;
          background: #fff;
        }

        .refresh {
          height: 44px;
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: #fff;
          font-weight: 900;
          cursor: pointer;
          font-size: 15px;
        }

        .refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 1100px) {
          .filters {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 720px) {
          .filters {
            grid-template-columns: 1fr;
          }
        }

        .meta {
          margin: 12px 0 0 0;
          display: flex;
          justify-content: flex-end;
        }

        .small {
          font-size: 14px;
          color: #374151;
        }

        .error {
          margin-top: 12px;
          color: #b91c1c;
          font-weight: 900;
          font-size: 16px;
        }

        .tableWrap {
          margin-top: 18px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
        }

        .tableHead {
          display: grid;
          grid-template-columns: 1.35fr 1.35fr 0.9fr 0.95fr 0.85fr 1fr;
          padding: 14px 16px;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6b7280;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .row {
          display: grid;
          grid-template-columns: 1.35fr 1.35fr 0.9fr 0.95fr 0.85fr 1fr;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          align-items: center;
          font-size: 14px;
        }

        .row:last-child {
          border-bottom: none;
        }

        .cell {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Key fix: stable layout for Case ID column */
        .caseCell {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .empty {
          padding: 18px 16px;
          font-size: 14px;
          color: #111827;
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 13px;
        }

        .caseLink {
          text-decoration: underline;
          font-weight: 900;
          color: #111827;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .copyBtn {
          height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.16);
          background: #fff;
          font-weight: 900;
          font-size: 12px;
          cursor: pointer;
          flex: 0 0 auto;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.14);
          font-size: 12px;
          font-weight: 900;
          background: #fff;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.16);
          font-size: 12px;
          font-weight: 900;
          background: #fff;
        }

        .pill.approved {
          border-color: rgba(16, 185, 129, 0.5);
        }
        .pill.rejected {
          border-color: rgba(239, 68, 68, 0.5);
        }
        .pill.suspended {
          border-color: rgba(245, 158, 11, 0.6);
        }
        .pill.review {
          border-color: rgba(59, 130, 246, 0.6);
        }
        .pill.received {
          border-color: rgba(107, 114, 128, 0.5);
        }
        .pill.needs {
          border-color: rgba(147, 51, 234, 0.55);
        }

        .footer {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .pager {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pagerBtn {
          height: 40px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: #fff;
          font-weight: 900;
          cursor: pointer;
        }

        .pagerBtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagerText {
          font-size: 14px;
          color: #111827;
          font-weight: 800;
        }

        .crumbs {
          font-size: 14px;
          color: #111827;
          font-weight: 800;
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
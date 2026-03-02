"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "../_components/AdminNav";

type Row = {
  requestId: string;
  org: string;
  email: string;
  status: string;
  source: string;
  updatedAt: string;
};

type ApiResponse =
  | { ok: true; rows: Row[]; total: number; page: number; pageSize: number }
  | { ok: false; error: string };

const STATUS_OPTIONS = ["all", "received", "in_review", "approved", "rejected"] as const;

export default function AdminApplicationsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function load(next?: Partial<{ q: string; status: string; pageSize: number; page: number }>) {
    const qq = next?.q ?? q;
    const ss = next?.status ?? status;
    const ps = next?.pageSize ?? pageSize;
    const pg = next?.page ?? page;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", String(pg));
      params.set("pageSize", String(ps));
      params.set("status", ss);
      if (qq.trim()) params.set("q", qq.trim());

      const res = await fetch(`/api/admin/applications?${params.toString()}`, {
        cache: "no-store",
        credentials: "include",
      });

      const data = (await res.json()) as ApiResponse;

      if (!res.ok || !data.ok) {
        throw new Error((data as any)?.error || `Failed to load (${res.status})`);
      }

      setRows(data.rows ?? []);
      setTotal(Number(data.total ?? 0));
      setPage(Number(data.page ?? pg));
      setPageSize(Number(data.pageSize ?? ps));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load applications");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applySearch() {
    setPage(1);
    load({ page: 1 });
  }

  function clearAll() {
    setQ("");
    setStatus("all");
    setPageSize(10);
    setPage(1);
    load({ q: "", status: "all", pageSize: 10, page: 1 });
  }

  return (
    <div>
      <AdminNav />

      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Admin • Applications</h1>
        <div style={{ marginTop: 6, color: "#555" }}>
          {loading ? "Loading…" : `Showing ${rows.length ? (page - 1) * pageSize + 1 : 0} to ${(page - 1) * pageSize + rows.length} of ${total}`}
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Search</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="requestId, org, email…"
              style={{ width: 300, padding: "10px 12px", border: "1px solid #ccc", borderRadius: 8 }}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Status</div>
            <select
              value={status}
              onChange={(e) => {
                const v = e.target.value as any;
                setStatus(v);
              }}
              style={{ width: 180, padding: "10px 12px", border: "1px solid #ccc", borderRadius: 8 }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Page size</div>
            <select
              value={pageSize}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPageSize(v);
                setPage(1);
                load({ pageSize: v, page: 1 });
              }}
              style={{ width: 120, padding: "10px 12px", border: "1px solid #ccc", borderRadius: 8 }}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={() => load()}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", background: "white", cursor: "pointer" }}
            >
              Refresh
            </button>
            <button
              onClick={clearAll}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", background: "white", cursor: "pointer" }}
            >
              Clear
            </button>
            <button
              onClick={applySearch}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #111", background: "#111", color: "white", cursor: "pointer", fontWeight: 800 }}
            >
              Apply search
            </button>
          </div>
        </div>

        {error ? (
          <div style={{ marginTop: 14, padding: 12, border: "1px solid crimson", borderRadius: 8, color: "crimson" }}>
            {error}
          </div>
        ) : null}

        <div style={{ marginTop: 14, border: "1px solid #ddd", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr style={{ background: "#fafafa", textAlign: "left" }}>
                  <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>REQUEST</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>ORG</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>EMAIL</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>STATUS</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>SOURCE</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>UPDATED</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 16, color: "#666" }}>
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.requestId}>
                      <td style={{ padding: 12, borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap" }}>
                        <a href={`/admin/applications/${encodeURIComponent(r.requestId)}`} style={{ textDecoration: "underline" }}>
                          {r.requestId}
                        </a>
                      </td>
                      <td style={{ padding: 12, borderBottom: "1px solid #f0f0f0" }}>
                        <a href={`/admin/applications/${encodeURIComponent(r.requestId)}`} style={{ textDecoration: "underline" }}>
                          {r.org}
                        </a>
                      </td>
                      <td style={{ padding: 12, borderBottom: "1px solid #f0f0f0" }}>{r.email}</td>
                      <td style={{ padding: 12, borderBottom: "1px solid #f0f0f0" }}>{r.status}</td>
                      <td style={{ padding: 12, borderBottom: "1px solid #f0f0f0" }}>{r.source}</td>
                      <td style={{ padding: 12, borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap" }}>{r.updatedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ padding: 12, display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "center" }}>
            <button
              disabled={page <= 1 || loading}
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                load({ page: next });
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: page <= 1 ? "#f5f5f5" : "white",
                cursor: page <= 1 ? "not-allowed" : "pointer",
              }}
            >
              Prev
            </button>

            <div style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 8 }}>
              Page {page} / {pageCount}
            </div>

            <button
              disabled={page >= pageCount || loading}
              onClick={() => {
                const next = Math.min(pageCount, page + 1);
                setPage(next);
                load({ page: next });
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: page >= pageCount ? "#f5f5f5" : "white",
                cursor: page >= pageCount ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
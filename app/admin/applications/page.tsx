"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  requestId?: string;
  org?: string;
  email?: string;
  status?: string;
  source?: string;
  updatedAt?: string;

  // tolerate other shapes too
  REQUEST_ID?: string;
  ORG_NAME?: string;
  CONTACT_EMAIL?: string;
  STATUS?: string;
  SOURCE_TABLE?: string;
  UPDATED_AT?: string;
};

function normRow(r: Row) {
  return {
    requestId: r.requestId ?? r.REQUEST_ID ?? "",
    org: r.org ?? r.ORG_NAME ?? "",
    email: r.email ?? r.CONTACT_EMAIL ?? "",
    status: r.status ?? r.STATUS ?? "",
    source: r.source ?? r.SOURCE_TABLE ?? "",
    updatedAt: r.updatedAt ?? r.UPDATED_AT ?? "",
  };
}

export default function AdminApplicationsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));
  }, [total, pageSize]);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      params.set("status", status || "all");
      if (q.trim()) params.set("q", q.trim());

      // ✅ Applications page calls /api/admin/applications
      const url = `/api/admin/applications?${params.toString()}`;

      const r = await fetch(url, { credentials: "include" });
      const text = await r.text();

      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Non-JSON response (${r.status}): ${text.slice(0, 200)}`);
      }

      if (!r.ok || !data?.ok) {
        throw new Error(data?.error ?? `Request failed (${r.status})`);
      }

      setRows(Array.isArray(data.rows) ? data.rows : []);
      setTotal(Number(data.total ?? 0));
    } catch (e: any) {
      setRows([]);
      setTotal(0);
      setError(String(e?.message ?? e ?? "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, status]);

  const shownFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const shownTo = Math.min(page * pageSize, total);

  const normalized = rows.map(normRow);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Admin • Applications</h1>
        <div className="mt-2 text-sm text-gray-600">
          {loading ? "Loading…" : `Showing ${shownFrom} to ${shownTo} of ${total}`}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[240px]">
          <div className="text-xs font-medium text-gray-600">Search</div>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="requestId, org, email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="min-w-[160px]">
          <div className="text-xs font-medium text-gray-600">Status</div>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="submitted">submitted</option>
            <option value="in_review">in_review</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>
        </div>

        <div className="min-w-[120px]">
          <div className="text-xs font-medium text-gray-600">Page size</div>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="ml-auto flex gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => load()}
            disabled={loading}
          >
            Refresh
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => {
              setQ("");
              setStatus("all");
              setPageSize(10);
              setPage(1);
            }}
            disabled={loading}
          >
            Clear
          </button>
          <button
            className="rounded-md bg-black px-3 py-2 text-sm text-white"
            onClick={() => {
              setPage(1);
              load();
            }}
            disabled={loading}
          >
            Apply search
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* Allow horizontal scroll so columns don’t get crushed */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-[980px] w-full table-fixed">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
            <tr>
              <th className="w-[160px] px-4 py-3">REQUEST</th>
              <th className="w-[260px] px-4 py-3">ORG</th>
              <th className="w-[300px] px-4 py-3">EMAIL</th>
              <th className="w-[110px] px-4 py-3">STATUS</th>
              <th className="w-[130px] px-4 py-3">SOURCE</th>
              <th className="w-[180px] px-4 py-3">UPDATED</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {normalized.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={6}>
                  {loading ? "Loading…" : "No applications found."}
                </td>
              </tr>
            ) : (
              normalized.map((r, idx) => (
                <tr key={`${r.requestId}-${idx}`} className="border-t">
                  <td className="px-4 py-3 font-mono text-xs align-top whitespace-nowrap">
                    {r.requestId}
                  </td>

                  <td className="px-4 py-3 align-top">
                    <div className="break-words leading-relaxed">{r.org}</div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <div className="break-words leading-relaxed">{r.email}</div>
                  </td>

                  <td className="px-4 py-3 align-top whitespace-nowrap">{r.status}</td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">{r.source}</td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">{r.updatedAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-sm">
        <button
          className="rounded-md border px-3 py-2 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={loading || page <= 1}
        >
          Prev
        </button>
        <div className="rounded-md border px-3 py-2">
          Page {page} / {totalPages}
        </div>
        <button
          className="rounded-md border px-3 py-2 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={loading || page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
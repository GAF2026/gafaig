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

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  const showingFrom = rows.length ? (page - 1) * pageSize + 1 : 0;
  const showingTo = rows.length ? (page - 1) * pageSize + rows.length : 0;

  async function load(
    next?: Partial<{ q: string; status: string; pageSize: number; page: number }>
  ) {
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

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
        {/* Hero */}
        <section className="pt-2 pb-8">
          <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
            Admin
          </div>

          <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
            Applications
          </h1>

          <p className="mt-5 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
            {loading ? "Loading…" : `Showing ${showingFrom} to ${showingTo} of ${total}`}
          </p>
        </section>

        {/* Filters */}
        <section className="mt-6 border-t border-black/10 pt-8">
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <div className="text-xs font-semibold mb-2">Search</div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="requestId, org, email…"
                className="w-[280px] rounded-lg border border-black/20 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <div className="text-xs font-semibold mb-2">Status</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-[180px] rounded-lg border border-black/20 px-3 py-2 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-xs font-semibold mb-2">Page size</div>
              <select
                value={pageSize}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPageSize(v);
                  setPage(1);
                  load({ pageSize: v, page: 1 });
                }}
                className="w-[120px] rounded-lg border border-black/20 px-3 py-2 text-sm"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto flex gap-3">
              <button
                onClick={() => load()}
                className="px-4 py-2 rounded-full border border-black/20 text-sm font-semibold hover:bg-black/[0.04]"
              >
                Refresh
              </button>

              <button
                onClick={clearAll}
                className="px-4 py-2 rounded-full border border-black/20 text-sm font-semibold hover:bg-black/[0.04]"
              >
                Clear
              </button>

              <button
                onClick={applySearch}
                className="px-5 py-2 rounded-full border border-black bg-black text-white text-sm font-semibold hover:bg-black/90"
              >
                Apply
              </button>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mt-8 border border-black/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-black/[0.03] text-left">
                <tr>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-black/60">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.requestId} className="border-t border-black/5">
                      <td className="px-4 py-3 underline whitespace-nowrap">
                        <a href={`/admin/applications/${encodeURIComponent(r.requestId)}`}>
                          {r.requestId}
                        </a>
                      </td>
                      <td className="px-4 py-3">{r.org}</td>
                      <td className="px-4 py-3">{r.email}</td>
                      <td className="px-4 py-3">{r.status}</td>
                      <td className="px-4 py-3">{r.source}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{r.updatedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-3 px-4 py-4 border-t border-black/10">
            <button
              disabled={page <= 1 || loading}
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                load({ page: next });
              }}
              className="px-4 py-2 rounded-full border border-black/20 text-sm font-semibold disabled:opacity-40"
            >
              Prev
            </button>

            <div className="text-sm font-medium">
              Page {page} / {pageCount}
            </div>

            <button
              disabled={page >= pageCount || loading}
              onClick={() => {
                const next = Math.min(pageCount, page + 1);
                setPage(next);
                load({ page: next });
              }}
              className="px-4 py-2 rounded-full border border-black/20 text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
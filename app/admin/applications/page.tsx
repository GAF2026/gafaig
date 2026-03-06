"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "../_components/AdminNav";
import AdminPageHeader from "../_components/AdminPageHeader";

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

function labelForStatus(value: string) {
  return value.replaceAll("_", " ");
}

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

  const showingFrom = rows.length ? (page - 1) * pageSize + 1 : 0;
  const showingTo = rows.length ? (page - 1) * pageSize + rows.length : 0;

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

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
        <AdminPageHeader
          title="Applications"
          description="Review Snowflake-backed application intake records for the private verification workflow."
          meta={loading ? "Loading…" : `Showing ${showingFrom} to ${showingTo} of ${total}`}
        />

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 text-[14px] text-black/80">{error}</div>
          </div>
        ) : null}

        <section className="mt-6 border-t border-black/10 pt-8">
          <div className="flex flex-wrap items-end gap-5">
            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Search
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="requestId, org, email…"
                className="w-[320px] max-w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Status
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-[200px] rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {labelForStatus(s)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Page size
              </div>
              <select
                value={pageSize}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPageSize(v);
                  setPage(1);
                  load({ pageSize: v, page: 1 });
                }}
                className="w-[140px] rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto flex flex-wrap gap-3">
              <button
                onClick={() => load()}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-3 text-[14px] font-semibold hover:bg-black/[0.04]"
              >
                Refresh
              </button>

              <button
                onClick={clearAll}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-3 text-[14px] font-semibold hover:bg-black/[0.04]"
              >
                Clear
              </button>

              <button
                onClick={applySearch}
                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-[14px] font-semibold text-white hover:bg-black/90"
              >
                Apply
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-[14px]">
              <thead className="bg-black/[0.03] text-left text-black">
                <tr>
                  <th className="px-4 py-4 font-semibold">Request</th>
                  <th className="px-4 py-4 font-semibold">Organization</th>
                  <th className="px-4 py-4 font-semibold">Email</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Source</th>
                  <th className="px-4 py-4 font-semibold">Updated</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-black/60">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.requestId} className="border-t border-black/5">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <a
                          href={`/admin/applications/${encodeURIComponent(r.requestId)}`}
                          className="font-semibold underline underline-offset-2"
                        >
                          {r.requestId}
                        </a>
                      </td>

                      <td className="px-4 py-4 text-black/85">{r.org}</td>
                      <td className="px-4 py-4 text-black/75">{r.email}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-[12px] font-semibold text-black/80 bg-black/[0.02]">
                          {labelForStatus(r.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-black/70">{r.source}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-black/65">{r.updatedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-black/10 px-4 py-4">
            <button
              disabled={page <= 1 || loading}
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                load({ page: next });
              }}
              className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold disabled:opacity-40"
            >
              Prev
            </button>

            <div className="text-[14px] font-medium text-black/75">
              Page {page} / {pageCount}
            </div>

            <button
              disabled={page >= pageCount || loading}
              onClick={() => {
                const next = Math.min(pageCount, page + 1);
                setPage(next);
                load({ page: next });
              }}
              className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
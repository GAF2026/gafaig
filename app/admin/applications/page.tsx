"use client";

import React from "react";
import AdminShell from "../_components/AdminShell";

type Row = {
  requestId: string;
  submissionType?: string | null;
  type?: string | null;
  status: string;
  orgName: string;
  contactEmail: string;
  requestedTier?: string | null;
  renewalPeriod?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  sourceTable?: string | null;
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}

export default function ApplicationsPage() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [status, setStatus] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("pageSize", String(pageSize));
      qs.set("status", status);
      if (search.trim()) qs.set("search", search.trim());

      const res = await fetch(`/api/admin/submissions?${qs.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!data?.ok) throw new Error(data?.error || "Failed to load submissions");
      setRows(data.rows || []);
      setTotal(Number(data.total || 0));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, status]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total);

  return (
    <AdminShell title="Admin • Applications">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="w-full md:w-80">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="requestId, org, email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-full md:w-56">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
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
                <option value="needs_more_info">needs_more_info</option>
              </select>
            </div>

            <div className="w-full md:w-40">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Page size
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
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
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                setPage(1);
                load();
              }}
            >
              Refresh
            </button>

            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                setSearch("");
                setStatus("all");
                setPage(1);
                setPageSize(10);
                setTimeout(load, 0);
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Status line */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-700">
            {loading ? (
              <span>Loading…</span>
            ) : (
              <span>
                Showing <span className="font-medium">{showingFrom}</span> to{" "}
                <span className="font-medium">{showingTo}</span> of{" "}
                <span className="font-medium">{total}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <Badge>
              Page {page} / {totalPages}
            </Badge>
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Org</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {error ? (
                  <tr>
                    <td className="px-4 py-6 text-red-600" colSpan={6}>
                      {error}
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td className="px-4 py-6 text-gray-600" colSpan={6}>
                      Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-gray-600" colSpan={6}>
                      No submissions found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={`${r.requestId}-${r.sourceTable ?? ""}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {r.requestId}
                      </td>
                      <td className="px-4 py-3">{r.orgName}</td>
                      <td className="px-4 py-3">{r.contactEmail}</td>
                      <td className="px-4 py-3">
                        <Badge>{r.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge>{r.sourceTable ?? "-"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.updatedAt ?? r.createdAt ?? "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Search Apply */}
        <div className="flex justify-end">
          <button
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
            disabled={loading}
            onClick={() => {
              setPage(1);
              load();
            }}
          >
            Apply search
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
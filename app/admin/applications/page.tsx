"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminNav from "../_components/AdminNav";
import AdminPageHeader from "../_components/AdminPageHeader";

type Row = {
  requestId: string;
  org: string | null;
  email: string | null;
  status: string | null;
  source: string | null;
  updatedAt: string | null;
};

type ApiResponse =
  | {
      ok: true;
      rows: Row[];
      total: number;
      page: number;
      pageSize: number;
      filters?: {
        status?: string;
        q?: string;
      };
    }
  | { ok: false; error: string };

const STATUS_OPTIONS = [
  "all",
  "pending",
  "received",
  "in_review",
  "approved",
  "rejected",
] as const;

function labelForStatus(value: string | null | undefined) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return "unknown";
  return normalized.replaceAll("_", " ");
}

function valueOrDash(value: string | null | undefined) {
  return value && value.trim() ? value : "—";
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
        throw new Error((data as { ok: false; error: string })?.error || `Failed to load (${res.status})`);
      }

      setRows(data.rows ?? []);
      setTotal(Number(data.total ?? 0));
      setPage(Number(data.page ?? pg));
      setPageSize(Number(data.pageSize ?? ps));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load applications");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applySearch() {
    setPage(1);
    load({ page: 1, q, status, pageSize });
  }

  function clearAll() {
    const nextQ = "";
    const nextStatus: (typeof STATUS_OPTIONS)[number] = "all";
    const nextPageSize = 10;
    const nextPage = 1;

    setQ(nextQ);
    setStatus(nextStatus);
    setPageSize(nextPageSize);
    setPage(nextPage);

    load({
      q: nextQ,
      status: nextStatus,
      pageSize: nextPageSize,
      page: nextPage,
    });
  }

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
        <AdminPageHeader
          eyebrow="Reviewer workflow"
          title="Applications"
          description="Review Snowflake-backed application intake records for the private verification workflow."
          meta={
            loading
              ? "Loading…"
              : `Showing ${showingFrom} to ${showingTo} of ${total}`
          }
          actions={
            <Link
              href="/demo"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Back to demo
            </Link>
          }
        />

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 text-[14px] text-black/80">{error}</div>
          </div>
        ) : null}

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            FILTERS
          </div>

          <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Search and refine application intake records
          </h2>

          <p className="mt-5 max-w-[920px] text-[15px] leading-[1.85] text-black/70">
            Search by organization, request ID, or email, and filter by workflow
            status to review private intake records more quickly.
          </p>

          <div className="mt-8 flex flex-wrap items-end gap-5">
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
                onChange={(e) =>
                  setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])
                }
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
                  load({ pageSize: v, page: 1, q, status });
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

        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                APPLICATION RECORDS
              </div>
              <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Snowflake-backed intake workflow
              </h2>
              <p className="mt-4 text-[14px] leading-[1.8] text-black/72">
                Each row represents an application record within the private
                verification workflow.
              </p>
            </div>

            <div className="text-[14px] text-black/65">
              {loading ? "Loading…" : `Page ${page} of ${pageCount}`}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
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
                          <Link
                            href={`/admin/applications/${encodeURIComponent(
                              r.requestId
                            )}`}
                            className="font-semibold underline underline-offset-2"
                          >
                            {r.requestId}
                          </Link>
                        </td>

                        <td className="px-4 py-4 text-black/85">
                          {valueOrDash(r.org)}
                        </td>
                        <td className="px-4 py-4 text-black/75">
                          {valueOrDash(r.email)}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[12px] font-semibold text-black/80">
                            {labelForStatus(r.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-black/70">
                          {valueOrDash(r.source)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-black/65">
                          {valueOrDash(r.updatedAt)}
                        </td>
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
          </div>
        </section>
      </main>
    </div>
  );
}
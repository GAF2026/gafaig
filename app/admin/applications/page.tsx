"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "../_components/AdminNav";
import AdminPageHeader from "../_components/AdminPageHeader";
import PublicButton from "../../_components/PublicButton";
import PublicButtonLink from "../../_components/PublicButtonLink";

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

function statusTone(value: string | null | undefined) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (normalized === "in_review") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (normalized === "pending" || normalized === "received") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (normalized === "rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-black/10 bg-black/[0.03] text-black/75";
}

function formatUpdatedAt(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

  const approvedCount = useMemo(
    () =>
      rows.filter(
        (r) => String(r.status ?? "").trim().toLowerCase() === "approved"
      ).length,
    [rows]
  );

  const reviewCount = useMemo(
    () =>
      rows.filter(
        (r) => String(r.status ?? "").trim().toLowerCase() === "in_review"
      ).length,
    [rows]
  );

  const pendingCount = useMemo(
    () =>
      rows.filter((r) => {
        const v = String(r.status ?? "").trim().toLowerCase();
        return v === "pending" || v === "received";
      }).length,
    [rows]
  );

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
        throw new Error(
          (data as { ok: false; error: string })?.error ||
            `Failed to load (${res.status})`
        );
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

      <main className="mx-auto max-w-[1240px] px-6 py-10">
        <AdminPageHeader
          eyebrow="PRIVATE VERIFICATION WORKFLOW"
          title="Application intake"
          description="Review Snowflake-backed submission records for the private verification layer. This is the operational entry point where organizations begin controlled review before any certification becomes public."
          meta={
            loading
              ? "Loading intake records…"
              : `Showing ${showingFrom} to ${showingTo} of ${total}`
          }
          actions={
            <div className="flex flex-wrap gap-3">
              <PublicButtonLink
                href="/admin/participants"
                variant="secondary"
                size="sm"
              >
                View participants
              </PublicButtonLink>
              <PublicButtonLink href="/demo" variant="secondary" size="sm">
                Back to demo
              </PublicButtonLink>
            </div>
          }
        />

        {error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 text-[14px] text-black/80">{error}</div>
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <MetricCard label="Visible records" value={String(total)} />
          <MetricCard label="Approved" value={String(approvedCount)} />
          <MetricCard label="In review" value={String(reviewCount)} />
          <MetricCard label="Pending / received" value={String(pendingCount)} />
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            FILTERS
          </div>

          <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Search and refine intake workflow records
          </h2>

          <p className="mt-5 max-w-[920px] text-[15px] leading-7 text-black/70">
            Search by organization, request ID, or email, and filter by workflow
            status to review private intake records more efficiently.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_220px_140px_auto] lg:items-end">
            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Search
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="requestId, organization, email…"
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
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
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
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
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <PublicButton
                type="button"
                onClick={() => load()}
                variant="secondary"
                size="sm"
              >
                Refresh
              </PublicButton>

              <PublicButton
                type="button"
                onClick={clearAll}
                variant="secondary"
                size="sm"
              >
                Clear
              </PublicButton>

              <PublicButton
                type="button"
                onClick={applySearch}
                variant="primary"
                size="sm"
              >
                Apply
              </PublicButton>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                APPLICATION RECORDS
              </div>
              <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Snowflake-backed intake workflow
              </h2>
              <p className="mt-4 max-w-[880px] text-[14px] leading-7 text-black/72">
                Each row represents an intake record inside the private
                verification layer. Opening a request leads deeper into the
                controlled reviewer workflow.
              </p>
            </div>

            <div className="text-[14px] text-black/65">
              {loading ? "Loading…" : `Page ${page} of ${pageCount}`}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-[14px]">
                <thead className="bg-black/[0.03] text-left text-black">
                  <tr>
                    <th className="px-4 py-4 font-semibold">Request</th>
                    <th className="px-4 py-4 font-semibold">Organization</th>
                    <th className="px-4 py-4 font-semibold">Email</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                    <th className="px-4 py-4 font-semibold">Source</th>
                    <th className="px-4 py-4 font-semibold">Updated</th>
                    <th className="px-4 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-black/60">
                        No applications found for the current filters.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.requestId} className="border-t border-black/5">
                        <td className="px-4 py-4 whitespace-nowrap font-semibold text-black">
                          {r.requestId}
                        </td>

                        <td className="px-4 py-4 text-black/85">
                          {valueOrDash(r.org)}
                        </td>

                        <td className="px-4 py-4 text-black/75">
                          {valueOrDash(r.email)}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold capitalize ${statusTone(
                              r.status
                            )}`}
                          >
                            {labelForStatus(r.status)}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-black/70">
                          {valueOrDash(r.source)}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-black/65">
                          {formatUpdatedAt(r.updatedAt)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <PublicButtonLink
                            href={`/admin/applications/${encodeURIComponent(
                              r.requestId
                            )}`}
                            variant="secondary"
                            size="sm"
                          >
                            Open
                          </PublicButtonLink>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-black/10 px-4 py-4">
              <PublicButton
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => {
                  const next = Math.max(1, page - 1);
                  setPage(next);
                  load({ page: next });
                }}
                variant="secondary"
                size="sm"
              >
                Prev
              </PublicButton>

              <div className="text-[14px] font-medium text-black/75">
                Page {page} / {pageCount}
              </div>

              <PublicButton
                type="button"
                disabled={page >= pageCount || loading}
                onClick={() => {
                  const next = Math.min(pageCount, page + 1);
                  setPage(next);
                  load({ page: next });
                }}
                variant="secondary"
                size="sm"
              >
                Next
              </PublicButton>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <NoteCard
            title="What this page proves"
            body="GAFAIG maintains a private operational intake layer distinct from the public certification registry."
          />
          <NoteCard
            title="What happens next"
            body="Intake records move into controlled review, findings, evidence handling, and certification workflow."
          />
          <NoteCard
            title="What stays private"
            body="Submission workflow and reviewer activity remain inside the private verification environment."
          />
        </section>
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function NoteCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
    </div>
  );
}
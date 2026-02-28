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

function statusClasses(status: string) {
  const s = String(status || "").toLowerCase();

  // Base pill styling (matches your overall look)
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold";

  // Slightly tinted borders by status
  if (s === "approved") return `${base} border-emerald-300 text-emerald-900`;
  if (s === "rejected") return `${base} border-red-300 text-red-900`;
  if (s === "suspended") return `${base} border-amber-300 text-amber-900`;
  if (s === "in_review") return `${base} border-blue-300 text-blue-900`;
  if (s === "received") return `${base} border-gray-300 text-gray-900`;
  if (s === "needs_more_info") return `${base} border-purple-300 text-purple-900`;

  return `${base} border-black/15 text-gray-900`;
}

function typeTagClasses() {
  return "inline-flex items-center rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-semibold text-gray-900";
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
    <main className="mx-auto max-w-[1100px] px-6 py-14">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Admin — Verification</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Track verification cases for submissions and registry participants.
        </p>
      </header>

      {/* Filters */}
      <section className="mt-8" aria-label="Filters">
        <div className="grid gap-3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <div className="text-xs font-medium text-gray-600">Search</div>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search entity, case ID…"
              autoComplete="off"
            />
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-medium text-gray-600">Status</div>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
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

          <div className="md:col-span-3">
            <div className="text-xs font-medium text-gray-600">Verification type</div>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
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
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={onRefresh}
            disabled={loading}
            type="button"
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        <div className="mt-3 flex justify-end">
          <div className="text-sm text-gray-600">{showingText}</div>
        </div>
      </section>

      {err ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Error: {err}
        </div>
      ) : null}

      {/* Table */}
      <section className="mt-5 overflow-hidden rounded-lg border" aria-label="Verification cases table">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
            <tr>
              <th className="w-[240px] px-4 py-3">CASE ID</th>
              <th className="px-4 py-3">ENTITY</th>
              <th className="w-[150px] px-4 py-3">TYPE</th>
              <th className="w-[160px] px-4 py-3">STATUS</th>
              <th className="w-[130px] px-4 py-3">PRIORITY</th>
              <th className="w-[200px] px-4 py-3">UPDATED</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={6}>
                  {loading ? "Loading…" : "No verification cases found."}
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const href = `/admin/verification/${encodeURIComponent(r.caseId)}`;
                return (
                  <tr key={r.caseId} className="border-t align-middle">
                    <td className="px-4 py-3">
                      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                        <a
                          className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs font-semibold underline"
                          href={href}
                          title={r.caseId}
                        >
                          {truncateMiddle(r.caseId)}
                        </a>
                        <button
                          className="rounded-full border px-3 py-1 text-xs font-semibold hover:bg-black/[0.04]"
                          onClick={() => copyText(r.caseId)}
                          title="Copy Case ID"
                          type="button"
                        >
                          Copy
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="min-w-0 break-words">{r.entityName}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={typeTagClasses()}>{r.verificationType}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={statusClasses(r.status)}>{r.status}</span>
                    </td>

                    <td className="px-4 py-3">{r.priority || "—"}</td>

                    <td className="px-4 py-3 font-mono text-xs">{r.updatedAt}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <button
            className="rounded-md border px-3 py-2 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            type="button"
          >
            Prev
          </button>
          <div className="rounded-md border px-3 py-2">Page {page}</div>
          <button
            className="rounded-md border px-3 py-2 disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading || rows.length < pageSize}
            type="button"
          >
            Next
          </button>
        </div>

        <nav className="text-sm font-semibold">
          <a href="/" className="underline">
            Home
          </a>
          <span className="mx-2 text-gray-400">·</span>
          <a href="/admin/applications" className="underline">
            Submissions
          </a>
          <span className="mx-2 text-gray-400">·</span>
          <span>Verification</span>
        </nav>
      </footer>
    </main>
  );
}
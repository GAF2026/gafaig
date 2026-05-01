"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminNav from "../_components/AdminNav";
import AdminPageHeader from "../_components/AdminPageHeader";
import PublicButton from "../../_components/PublicButton";
import PublicButtonLink from "../../_components/PublicButtonLink";

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

function prettify(value: string | null | undefined) {
  if (!value) return "—";
  return value.replaceAll("_", " ");
}

function statusClasses(status: string) {
  const s = String(status || "").toLowerCase();
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold bg-black/[0.02]";

  if (s === "approved") return `${base} border-emerald-200 text-emerald-900`;
  if (s === "rejected") return `${base} border-red-200 text-red-900`;
  if (s === "suspended") return `${base} border-amber-200 text-amber-900`;
  if (s === "in_review") return `${base} border-blue-200 text-blue-900`;
  if (s === "received") return `${base} border-gray-200 text-gray-900`;
  if (s === "needs_more_info") return `${base} border-purple-200 text-purple-900`;

  return `${base} border-black/10 text-black/80`;
}

function typeTagClasses() {
  return "inline-flex items-center rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[12px] font-semibold text-black/80";
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
        credentials: "include",
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

  function onApply() {
    setPage(1);
    load(1);
  }

  function onClear() {
    setSearch("");
    setStatus("all");
    setVerificationType("all");
    setPage(1);

    setTimeout(() => {
      const params = new URLSearchParams();
      params.set("search", "");
      params.set("status", "all");
      params.set("verificationType", "all");
      params.set("page", "1");
      params.set("pageSize", String(pageSize));

      setLoading(true);
      setErr(null);

      fetch(`/api/admin/verification?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        credentials: "include",
      })
        .then(async (res) => {
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
        })
        .catch((e: any) => {
          setRows([]);
          setTotal(0);
          setErr(e?.message || "Failed to load verification cases.");
        })
        .finally(() => setLoading(false));
    }, 0);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onApply();
    }
  }

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 py-10">
        <AdminPageHeader
          title="Verification"
          description="Track verification cases for submissions and registry participants across the private review workflow."
          meta={loading ? "Loading…" : showingText}
          actions={
            <PublicButton
              type="button"
              onClick={onRefresh}
              disabled={loading}
              variant="secondary"
              size="sm"
            >
              {loading ? "Loading…" : "Refresh"}
            </PublicButton>
          }
        />

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            FILTERS
          </div>

          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
            Filter verification cases
          </h2>

          <p className="mt-4 max-w-[860px] text-[14px] leading-7 text-black/70">
            Narrow the case list by entity, case ID, status, or verification type to
            move through the private review workflow more efficiently.
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-5">
            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Search
              </div>
              <input
                className="w-[320px] max-w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onSearchKeyDown}
                placeholder="Search entity, case ID…"
                autoComplete="off"
              />
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Status
              </div>
              <select
                className="w-[180px] rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="received">received</option>
                <option value="in_review">in review</option>
                <option value="needs_more_info">needs more info</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
                <option value="suspended">suspended</option>
              </select>
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Verification type
              </div>
              <select
                className="w-[190px] rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
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

            <div className="ml-auto flex flex-wrap gap-3">
              <PublicButton type="button" onClick={onClear} variant="secondary">
                Clear
              </PublicButton>

              <PublicButton type="button" onClick={onApply} variant="primary">
                Apply
              </PublicButton>
            </div>
          </div>
        </section>

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 text-[14px] text-black/80">{err}</div>
          </div>
        ) : null}

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-[14px]">
              <thead className="bg-black/[0.03] text-left text-black">
                <tr>
                  <th className="w-[260px] px-4 py-4 font-semibold">Case ID</th>
                  <th className="px-4 py-4 font-semibold">Entity</th>
                  <th className="w-[150px] px-4 py-4 font-semibold">Type</th>
                  <th className="w-[160px] px-4 py-4 font-semibold">Status</th>
                  <th className="w-[130px] px-4 py-4 font-semibold">Priority</th>
                  <th className="w-[200px] px-4 py-4 font-semibold">Updated</th>
                  <th className="w-[120px] px-4 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-black/60">
                      {loading ? "Loading…" : "No verification cases found."}
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const href = `/admin/verification/${encodeURIComponent(r.caseId)}`;

                    return (
                      <tr
                        key={r.caseId}
                        className="border-t border-black/5 hover:bg-black/[0.02]"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12px] font-semibold underline underline-offset-2"
                              href={href}
                              title={`Open ${r.caseId}`}
                            >
                              {truncateMiddle(r.caseId)}
                            </Link>

                            <PublicButton
                              className="px-3 py-1"
                              onClick={() => copyText(r.caseId)}
                              title="Copy Case ID"
                              type="button"
                              variant="secondary"
                              size="sm"
                            >
                              Copy
                            </PublicButton>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-black/85">
                          <Link
                            href={href}
                            className="font-medium text-black underline-offset-2 hover:underline"
                            title={`Open ${r.caseId}`}
                          >
                            {r.entityName || "—"}
                          </Link>
                        </td>

                        <td className="px-4 py-4">
                          <span className={typeTagClasses()}>
                            {prettify(r.verificationType)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={statusClasses(r.status)}>
                            {prettify(r.status)}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-black/70">
                          {r.priority || "—"}
                        </td>

                        <td className="px-4 py-4 font-mono text-[12px] text-black/60">
                          {r.updatedAt}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <PublicButtonLink href={href} variant="secondary" size="sm">
                            Open
                          </PublicButtonLink>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-black/10 px-4 py-4">
            <PublicButton
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              type="button"
              variant="secondary"
              size="sm"
            >
              Prev
            </PublicButton>

            <div className="text-[14px] font-medium text-black/75">Page {page}</div>

            <PublicButton
              onClick={() => setPage((p) => p + 1)}
              disabled={loading || rows.length < pageSize}
              type="button"
              variant="secondary"
              size="sm"
            >
              Next
            </PublicButton>
          </div>
        </section>

        <footer className="mt-6 text-[13px] text-black/55">
          Verification cases connect application intake to deeper evidence, findings,
          scoring, and decision workflow.
        </footer>
      </main>
    </div>
  );
}
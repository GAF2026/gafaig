"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/app/admin/_components/AdminNav";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import PublicButton from "@/app/_components/PublicButton";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

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

      <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
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
              <PublicButtonLink href="/admin/participants" variant="secondary" size="sm">
                View participants
              </PublicButtonLink>
              <PublicButtonLink href="/demo" variant="secondary" size="sm">
                Back to demo
              </PublicButtonLink>
            </div>
          }
        />
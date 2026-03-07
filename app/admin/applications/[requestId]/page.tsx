"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminNav from "../../_components/AdminNav";
import AdminPageHeader from "../../_components/AdminPageHeader";

type Row = {
  requestId: string;
  submissionType: string;
  orgName: string;
  contactEmail: string;
  status: string;
  requestedTier?: string | null;
  renewalPeriod?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const STATUSES = ["received", "in_review", "approved", "rejected"] as const;

function prettify(value: string | null | undefined) {
  if (!value) return "—";
  return value.replaceAll("_", " ");
}

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const requestId = String((params as any)?.requestId ?? "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [row, setRow] = useState<Row | null>(null);
  const [copied, setCopied] = useState(false);

  async function copyRequestId(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        // ignore
      }
    }
  }

  async function load() {
    if (!requestId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/applications/${encodeURIComponent(requestId)}`, {
        cache: "no-store",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Failed to load application (${res.status})`);
      }

      setRow(data.row as Row);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load application");
      setRow(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!requestId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  async function setStatus(nextStatus: (typeof STATUSES)[number]) {
    if (!row) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/applications/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          requestId: row.requestId,
          status: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Failed to update status (${res.status})`);
      }

      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
        <AdminPageHeader
          title="Application"
          description="Review the selected application record and update its workflow status."
          meta={
            loading
              ? "Loading…"
              : row
              ? `Request ${row.requestId}`
              : error
              ? "Unable to load application"
              : "Not found"
          }
          actions={
            row ? (
              <button
                type="button"
                onClick={() => copyRequestId(row.requestId)}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
                title="Copy Request ID"
              >
                {copied ? "Copied" : "Copy Request ID"}
              </button>
            ) : null
          }
        />

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 text-[14px] text-black/80">{error}</div>
          </div>
        ) : null}

        {!loading && !row ? (
          <section className="rounded-2xl border border-black/10 p-5">
            <div className="text-[16px] font-semibold text-black">Application not found</div>
            <div className="mt-2 text-[14px] text-black/65">
              The requested application could not be loaded.
            </div>

            <div className="mt-5">
              <a
                href="/admin/applications"
                className="text-[14px] font-semibold underline text-black/80"
              >
                ← Back to applications
              </a>
            </div>
          </section>
        ) : null}

        {row ? (
          <>
            <section className="rounded-2xl border border-black/10 p-5">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.12em] text-black/55 font-semibold">
                    Current status
                  </div>

                  <div className="mt-3">
                    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[12px] font-semibold text-black/80">
                      {prettify(row.status)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((status) => {
                    const isCurrent = row.status === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatus(status)}
                        disabled={saving || isCurrent}
                        className={[
                          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold border",
                          isCurrent
                            ? "border-black bg-black text-white"
                            : "border-black/15 bg-white hover:bg-black/[0.04]",
                          saving || isCurrent ? "opacity-60" : "",
                        ].join(" ")}
                        title={isCurrent ? "Current status" : `Set status to ${status}`}
                      >
                        {saving && !isCurrent ? "Working…" : prettify(status)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-black/10 p-5">
              <h2 className="text-[16px] font-semibold text-black">Application details</h2>

              <div className="mt-5 grid gap-y-4 gap-x-8 md:grid-cols-[180px_1fr]">
                <div className="text-[14px] font-semibold text-black/70">Request ID</div>
                <div className="text-[15px] text-black">{row.requestId}</div>

                <div className="text-[14px] font-semibold text-black/70">Type</div>
                <div className="text-[15px] text-black">{row.submissionType || "—"}</div>

                <div className="text-[14px] font-semibold text-black/70">Status</div>
                <div className="text-[15px] text-black">{prettify(row.status)}</div>

                <div className="text-[14px] font-semibold text-black/70">Organization</div>
                <div className="text-[15px] text-black">{row.orgName || "—"}</div>

                <div className="text-[14px] font-semibold text-black/70">Email</div>
                <div className="text-[15px] text-black">{row.contactEmail || "—"}</div>

                <div className="text-[14px] font-semibold text-black/70">Requested Tier</div>
                <div className="text-[15px] text-black">{row.requestedTier ?? "—"}</div>

                <div className="text-[14px] font-semibold text-black/70">Renewal Period</div>
                <div className="text-[15px] text-black">{row.renewalPeriod ?? "—"}</div>

                <div className="text-[14px] font-semibold text-black/70">Created</div>
                <div className="text-[15px] text-black/75">{row.createdAt ?? "—"}</div>

                <div className="text-[14px] font-semibold text-black/70">Updated</div>
                <div className="text-[15px] text-black/75">{row.updatedAt ?? "—"}</div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-black/10 p-5">
              <h2 className="text-[16px] font-semibold text-black">Next actions</h2>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/admin/applications"
                  className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
                >
                  ← Back to applications
                </a>

                <a
                  href="/admin/verification"
                  className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
                >
                  Open verification workflow
                </a>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
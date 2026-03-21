"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminNav from "../../_components/AdminNav";
import AdminPageHeader from "../../_components/AdminPageHeader";

type Row = {
  requestId: string;
  submissionType: string | null;
  orgName: string | null;
  contactEmail: string | null;
  status: string | null;
  requestedTier?: string | null;
  renewalPeriod?: string | null;
  sourceTable?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type DetailApiResponse =
  | { ok: true; row: Row }
  | { ok: false; error: string };

type StatusApiResponse =
  | { ok: true }
  | { ok: false; error: string };

type ConvertApiResponse =
  | {
      ok: true;
      caseId: string;
      requestId: string;
      participantId: string;
      alreadyExisted: boolean;
    }
  | { ok: false; error: string };

const STATUSES = ["received", "in_review", "approved", "rejected"] as const;

function prettify(value: string | null | undefined) {
  if (!value) return "—";
  return value.replaceAll("_", " ");
}

function valueOrDash(value: string | null | undefined) {
  return value && value.trim() ? value : "—";
}

function buildParticipantIdFromRequestId(requestId: string) {
  const suffix = requestId.replace(/^REQ-/i, "").trim();
  if (!suffix) return "PART-UNKNOWN";
  return `PART-${suffix.toUpperCase()}`;
}

export default function AdminApplicationDetailPage() {
  const params = useParams();

  const requestIdParam = params?.requestId;
  const requestId = Array.isArray(requestIdParam)
    ? String(requestIdParam[0] ?? "")
    : String(requestIdParam ?? "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [row, setRow] = useState<Row | null>(null);
  const [copied, setCopied] = useState(false);
  const [convertMessage, setConvertMessage] = useState("");
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);
  const [participantIdInput, setParticipantIdInput] = useState("");

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
      const res = await fetch(
        `/api/admin/applications/${encodeURIComponent(requestId)}`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      const data = (await res.json()) as DetailApiResponse;

      if (!res.ok || !data.ok) {
        throw new Error(
          (data as { ok: false; error: string })?.error ||
            `Failed to load application (${res.status})`
        );
      }

      setRow(data.row);
      setParticipantIdInput(buildParticipantIdFromRequestId(data.row.requestId));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load application");
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

      const data = (await res.json()) as StatusApiResponse;

      if (!res.ok || !data.ok) {
        throw new Error(
          (data as { ok: false; error: string })?.error ||
            `Failed to update status (${res.status})`
        );
      }

      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  async function convertToCase() {
    if (!row) return;

    const participantId = participantIdInput.trim().toUpperCase();
    if (!participantId) {
      setError("Participant ID is required before converting to case.");
      return;
    }

    setConverting(true);
    setError("");
    setConvertMessage("");
    setCreatedCaseId(null);

    try {
      const res = await fetch(
        `/api/admin/applications/${encodeURIComponent(row.requestId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            participantId,
            actor: "admin",
          }),
        }
      );

      const data = (await res.json()) as ConvertApiResponse;

      if (!res.ok || !data.ok) {
        throw new Error(
          (data as { ok: false; error: string })?.error ||
            `Failed to convert to case (${res.status})`
        );
      }

      setCreatedCaseId(data.caseId);
      setConvertMessage(
        data.alreadyExisted
          ? `Case already existed: ${data.caseId}`
          : `Created case: ${data.caseId}`
      );
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to convert application to case"
      );
    } finally {
      setConverting(false);
    }
  }

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
        <AdminPageHeader
          title="Application"
          description="Review the selected application record, update its workflow status, and convert it into a canonical verification case."
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
            <div className="text-[16px] font-semibold text-black">
              Application not found
            </div>
            <div className="mt-2 text-[14px] text-black/65">
              The requested application could not be loaded.
            </div>

            <div className="mt-5">
              <Link
                href="/admin/applications"
                className="text-[14px] font-semibold underline text-black/80"
              >
                ← Back to applications
              </Link>
            </div>
          </section>
        ) : null}

        {row ? (
          <>
            <section className="rounded-2xl border border-black/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/55">
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
                          "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-[14px] font-semibold",
                          isCurrent
                            ? "border-black bg-black text-white"
                            : "border-black/15 bg-white hover:bg-black/[0.04]",
                          saving || isCurrent ? "opacity-60" : "",
                        ].join(" ")}
                        title={
                          isCurrent
                            ? "Current status"
                            : `Set status to ${status}`
                        }
                      >
                        {saving && !isCurrent ? "Working…" : prettify(status)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-black/10 p-5">
              <h2 className="text-[16px] font-semibold text-black">
                Application details
              </h2>

              <div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-[180px_1fr]">
                <div className="text-[14px] font-semibold text-black/70">
                  Request ID
                </div>
                <div className="text-[15px] text-black">{row.requestId}</div>

                <div className="text-[14px] font-semibold text-black/70">
                  Type
                </div>
                <div className="text-[15px] text-black">
                  {valueOrDash(row.submissionType)}
                </div>

                <div className="text-[14px] font-semibold text-black/70">
                  Status
                </div>
                <div className="text-[15px] text-black">
                  {prettify(row.status)}
                </div>

                <div className="text-[14px] font-semibold text-black/70">
                  Organization
                </div>
                <div className="text-[15px] text-black">
                  {valueOrDash(row.orgName)}
                </div>

                <div className="text-[14px] font-semibold text-black/70">
                  Email
                </div>
                <div className="text-[15px] text-black">
                  {valueOrDash(row.contactEmail)}
                </div>

                <div className="text-[14px] font-semibold text-black/70">
                  Source Table
                </div>
                <div className="text-[15px] text-black">
                  {valueOrDash(row.sourceTable)}
                </div>

                <div className="text-[14px] font-semibold text-black/70">
                  Requested Tier
                </div>
                <div className="text-[15px] text-black">
                  {valueOrDash(row.requestedTier)}
                </div>

                <div className="text-[14px] font-semibold text-black/70">
                  Renewal Period
                </div>
                <div className="text-[15px] text-black">
                  {valueOrDash(row.renewalPeriod)}
                </div>

                <div className="text-[14px] font-semibold text-black/70">
                  Created
                </div>
                <div className="text-[15px] text-black/75">
                  {valueOrDash(row.createdAt)}
                </div>

                <div className="text-[14px] font-semibold text-black/70">
                  Updated
                </div>
                <div className="text-[15px] text-black/75">
                  {valueOrDash(row.updatedAt)}
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-black/10 p-5">
              <h2 className="text-[16px] font-semibold text-black">
                Convert application to case
              </h2>

              <p className="mt-2 max-w-[900px] text-[14px] leading-[1.8] text-black/70">
                This is the core intake-to-engine bridge. Converting an application
                creates or reuses a canonical verification case so the record can move
                into the case-first governance workflow.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-[220px_1fr] md:items-end">
                <div>
                  <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                    Participant ID
                  </label>
                  <input
                    value={participantIdInput}
                    onChange={(e) => setParticipantIdInput(e.target.value)}
                    className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="PART-..."
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={convertToCase}
                    disabled={converting}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-[14px] font-semibold text-white hover:bg-black/90 disabled:opacity-60"
                  >
                    {converting ? "Converting…" : "Convert to Case"}
                  </button>

                  <Link
                    href="/admin/verification"
                    className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-3 text-[14px] font-semibold hover:bg-black/[0.04]"
                  >
                    Open verification queue
                  </Link>
                </div>
              </div>

              {convertMessage ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="text-[14px] font-semibold text-emerald-800">
                    Conversion complete
                  </div>
                  <div className="mt-1 text-[14px] text-black/80">
                    {convertMessage}
                  </div>

                  {createdCaseId ? (
                    <div className="mt-3">
                      <Link
                        href={`/admin/verification/${encodeURIComponent(createdCaseId)}`}
                        className="text-[14px] font-semibold underline text-black/80"
                      >
                        Open case {createdCaseId}
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>

            <section className="mt-8 rounded-2xl border border-black/10 p-5">
              <h2 className="text-[16px] font-semibold text-black">
                Next actions
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/admin/applications"
                  className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
                >
                  ← Back to applications
                </Link>

                <Link
                  href="/admin/verification"
                  className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
                >
                  Open verification workflow
                </Link>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
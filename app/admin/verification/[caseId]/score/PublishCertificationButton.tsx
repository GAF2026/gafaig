"use client";

import { useMemo, useState } from "react";

type PublishCertificationButtonProps = {
  caseId: string;
  initialRegistryId?: string | null;
  disabled?: boolean;
  className?: string;
};

type PublishResponse = {
  ok: boolean;
  caseId?: string;
  actor?: string;
  registryId?: string | null;
  snapshotId?: string | null;
  published?: boolean;
  status?: string | null;
  message?: string | null;
  tier?: string | null;
  band?: string | null;
  finalScore?: number | null;
  error?: string;
  detail?: string;
};

function normalizeCaseId(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidCaseId(value: string): boolean {
  return /^[A-Z0-9][A-Z0-9._:-]{1,127}$/i.test(value);
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function formatScore(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "Pending";
  }
  return value.toFixed(4).replace(/\.?0+$/, "");
}

export default function PublishCertificationButton({
  caseId,
  initialRegistryId = null,
  disabled = false,
  className,
}: PublishCertificationButtonProps) {
  const safeCaseId = useMemo(() => normalizeCaseId(caseId), [caseId]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [registryId, setRegistryId] = useState<string | null>(initialRegistryId);
  const [snapshotId, setSnapshotId] = useState<string | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [band, setBand] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canPublish = isValidCaseId(safeCaseId) && !disabled && !isPublishing;

  const verificationUrl = registryId
    ? `/api/verify/${encodeURIComponent(registryId)}`
    : null;

  async function handlePublish() {
    if (!canPublish) return;

    setIsPublishing(true);
    setError(null);
    setMessage(null);
    setStatus(null);
    setCopied(false);

    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          caseId: safeCaseId,
          actor: "demo-admin",
        }),
      });

      const data = (await res.json().catch(() => null)) as PublishResponse | null;

      if (!res.ok || !data?.ok) {
        const nextError =
          data?.error ||
          data?.detail ||
          `Publish failed with status ${res.status}`;
        setError(nextError);
        return;
      }

      setRegistryId(data.registryId ?? null);
      setSnapshotId(data.snapshotId ?? null);
      setTier(data.tier ?? null);
      setBand(data.band ?? null);
      setFinalScore(
        typeof data.finalScore === "number" ? data.finalScore : null,
      );
      setStatus(data.status ?? "published");
      setMessage(data.message ?? "Registry publish completed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected publish error");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleCopyRegistryId() {
    if (!registryId) return;
    const ok = await copyText(registryId);
    setCopied(ok);
    if (ok) {
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <section
      className={
        className ??
        "rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-sm"
      }
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Registry publish
          </div>

          <h3 className="text-lg font-semibold text-white">
            Publish certification to the public registry
          </h3>

          <p className="max-w-2xl text-sm leading-6 text-white/70">
            This action creates or returns the deterministic public registry
            record for this case. Private evidence remains in the verification
            engine and is not exposed publicly.
          </p>

          <div className="text-xs text-white/45">
            <span className="font-medium text-white/60">Case ID:</span>{" "}
            {safeCaseId || "Unavailable"}
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={handlePublish}
            disabled={!canPublish}
            className="inline-flex min-w-[180px] items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPublishing ? "Publishing..." : registryId || snapshotId ? "Republish / Refresh" : "Publish to Registry"}
          </button>
        </div>
      </div>

      {!isValidCaseId(safeCaseId) ? (
        <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
          A valid deterministic case ID is required before publishing.
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {message || registryId || snapshotId || status ? (
        <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-100/60">
                Status
              </div>
              <div className="mt-1 text-sm font-medium text-emerald-50">
                {status ?? "published"}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-100/60">
                Registry ID
              </div>
              <div className="mt-1 break-all text-sm font-medium text-emerald-50">
                {registryId ?? "Pending"}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-100/60">
                Public verify endpoint
              </div>
              <div className="mt-1 break-all text-sm font-medium text-emerald-50">
                {verificationUrl ?? "Pending"}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-100/60">
                Snapshot ID
              </div>
              <div className="mt-1 break-all text-sm font-medium text-emerald-50">
                {snapshotId ?? "Pending"}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-100/60">
                Tier / Band
              </div>
              <div className="mt-1 text-sm font-medium text-emerald-50">
                {tier || band ? `${tier ?? "—"} / ${band ?? "—"}` : "Pending"}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-100/60">
                Final score
              </div>
              <div className="mt-1 text-sm font-medium text-emerald-50">
                {formatScore(finalScore)}
              </div>
            </div>
          </div>

          {message ? (
            <div className="mt-3 text-sm text-emerald-50/90">{message}</div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyRegistryId}
              disabled={!registryId}
              className="inline-flex items-center justify-center rounded-xl border border-emerald-100/20 bg-emerald-100/10 px-3 py-2 text-sm font-medium text-emerald-50 transition hover:bg-emerald-100/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied" : "Copy Registry ID"}
            </button>

            {verificationUrl ? (
              <a
                href={verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-100/20 bg-transparent px-3 py-2 text-sm font-medium text-emerald-50 transition hover:bg-emerald-100/10"
              >
                Open Verify Endpoint
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
"use client";

import { useMemo, useState } from "react";

export default function PublishPanel(props: {
  caseId: string;
  band: string;
  tier: string;
  score: number;
  lastActivityAt: string | null;
  snowflakeEnv: any | null;
}) {
  const { caseId } = props;
  const [notes, setNotes] = useState("Initial public registry publish");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const prettyEnv = useMemo(() => {
    if (!props.snowflakeEnv) return null;
    return JSON.stringify(props.snowflakeEnv, null, 2);
  }, [props.snowflakeEnv]);

  async function publish() {
    setBusy(true);
    setMsg(null);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/verification/${encodeURIComponent(caseId)}/publish`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notes }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setErr(data?.error || data?.details || `Publish failed (HTTP ${res.status})`);
      } else {
        setMsg("Published. Registry snapshot should now be visible via public registry views.");
      }
    } catch (e: any) {
      setErr(e?.message || "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-medium">Publish to Public Registry</div>
          <div className="mt-1 text-sm text-neutral-600">
            Writes an approval event + snapshot for this case (used by the registry views).
          </div>
        </div>

        <button
          onClick={publish}
          disabled={busy}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? "Publishing…" : "Publish"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border p-3">
          <div className="text-xs text-neutral-600">Score</div>
          <div className="mt-1 text-sm font-medium">{props.score}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-neutral-600">Tier</div>
          <div className="mt-1 text-sm font-medium">{props.tier}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-neutral-600">Band</div>
          <div className="mt-1 text-sm font-medium">{props.band}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-neutral-600">Publish notes</div>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="e.g., Initial public registry publish"
        />
      </div>

      {msg ? <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm">{msg}</div> : null}
      {err ? <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm">{err}</div> : null}

      {prettyEnv ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-neutral-700">Snowflake environment</summary>
          <pre className="mt-2 overflow-auto rounded-md border bg-neutral-50 p-3 text-xs">{prettyEnv}</pre>
        </details>
      ) : null}
    </div>
  );
}
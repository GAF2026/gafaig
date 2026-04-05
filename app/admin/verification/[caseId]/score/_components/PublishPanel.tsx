"use client";

import { useMemo, useState } from "react";
import PublicButton from "../../../../../_components/PublicButton";
import PublicButtonLink from "../../../../../_components/PublicButtonLink";

type PublishApiSuccess = {
  ok: true;
  status: "published";
  caseId: string;
  registryId: string;
  registrySnapshotId?: string | null;
  verifyEndpoint?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  finalScore?: number | null;
  record?: {
    registryId: string;
    caseId: string | null;
    applicationId: string | null;
    entityName: string | null;
    entityType: string | null;
    country: string | null;
    certifiedTier: string | null;
    certifiedBand: string | null;
    finalScore: number | null;
    decisionStatus: string | null;
    validFrom: string | null;
    validTo: string | null;
    certifiedAt: string | null;
    lastActivityAt: string | null;
  } | null;
  proc?: unknown;
};

type PublishApiError = {
  ok: false;
  error: string;
  caseId?: string;
  proc?: unknown;
};

type PublishApiResponse = PublishApiSuccess | PublishApiError;

export default function PublishPanel(props: {
  caseId: string;
  band: string;
  tier: string;
  score: number;
  lastActivityAt: string | null;
  snowflakeEnv: Record<string, unknown> | null;
}) {
  const { caseId } = props;

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [registryId, setRegistryId] = useState<string | null>(null);
  const [verifyEndpoint, setVerifyEndpoint] = useState<string | null>(null);

  const prettyEnv = useMemo(() => {
    if (!props.snowflakeEnv) return null;
    return JSON.stringify(props.snowflakeEnv, null, 2);
  }, [props.snowflakeEnv]);

  async function publish() {
    setBusy(true);
    setMsg(null);
    setErr(null);
    setRegistryId(null);
    setVerifyEndpoint(null);

    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ caseId }),
      });

      const data = (await res.json().catch(() => null)) as PublishApiResponse | null;

      if (!res.ok || !data?.ok) {
        const errorMessage =
          data && !data.ok && "error" in data
            ? data.error
            : `Publish failed (HTTP ${res.status})`;

        setErr(errorMessage);
      } else {
        setRegistryId(data.registryId ?? null);
        setVerifyEndpoint(data.verifyEndpoint ?? null);
        setMsg(
          "Published. Registry snapshot should now be visible via public registry views."
        );
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-medium text-black">Publish to Public Registry</div>
          <div className="mt-1 text-sm text-neutral-600">
            Approves and publishes this case through the canonical admin publish
            API, then writes the registry snapshot used by the public registry
            views.
          </div>
        </div>

        <PublicButton
          type="button"
          onClick={publish}
          disabled={busy}
          variant="primary"
          size="sm"
        >
          {busy ? "Publishing…" : "Publish"}
        </PublicButton>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-black/10 p-3">
          <div className="text-xs text-neutral-600">Case</div>
          <div className="mt-1 break-all text-sm font-medium text-black">{caseId}</div>
        </div>
        <div className="rounded-xl border border-black/10 p-3">
          <div className="text-xs text-neutral-600">Score</div>
          <div className="mt-1 text-sm font-medium text-black">{props.score}</div>
        </div>
        <div className="rounded-xl border border-black/10 p-3">
          <div className="text-xs text-neutral-600">Tier</div>
          <div className="mt-1 text-sm font-medium text-black">{props.tier}</div>
        </div>
        <div className="rounded-xl border border-black/10 p-3">
          <div className="text-xs text-neutral-600">Band</div>
          <div className="mt-1 text-sm font-medium text-black">{props.band}</div>
        </div>
      </div>

      {props.lastActivityAt ? (
        <div className="mt-4 rounded-xl border border-black/10 p-3">
          <div className="text-xs text-neutral-600">Last activity</div>
          <div className="mt-1 text-sm font-medium text-black">{props.lastActivityAt}</div>
        </div>
      ) : null}

      {msg ? (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-black">
          <div>{msg}</div>

          <div className="mt-3 flex flex-wrap gap-3">
            {registryId ? (
              <PublicButtonLink
                href={`/registry/${encodeURIComponent(registryId)}`}
                variant="secondary"
                size="sm"
              >
                Open Registry Record
              </PublicButtonLink>
            ) : null}

            {verifyEndpoint ? (
              <PublicButtonLink
                href={verifyEndpoint}
                variant="secondary"
                size="sm"
              >
                Open Verify Endpoint
              </PublicButtonLink>
            ) : null}
          </div>

          {registryId ? (
            <div className="mt-3 text-sm text-black/75">Registry ID: {registryId}</div>
          ) : null}
        </div>
      ) : null}

      {err ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-black">
          {err}
        </div>
      ) : null}

      {prettyEnv ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-neutral-700">
            Snowflake environment
          </summary>
          <pre className="mt-2 overflow-auto rounded-xl border border-black/10 bg-neutral-50 p-3 text-xs">
            {prettyEnv}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
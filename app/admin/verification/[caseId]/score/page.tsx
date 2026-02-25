import CaseTabs from "../_components/CaseTabs";
import PublishPanel from "./_components/PublishPanel";

type ScoreResp = {
  ok: boolean;
  error?: string;

  caseId: string;
  participantId: string | null;
  standard: { code: string | null; version: string | null };
  caseStatus: string | null;

  tier: "High Assurance" | "Standard Assurance" | "Conditional" | "Not Verified";
  band: "A" | "B" | "C" | "D";
  score: number;

  subscores: {
    controls: number;
    coverage: number;
    freshness: number;
    summaries: number;
  };

  lastActivityAt: string | null;

  counts: {
    findingsTotal: number;
    findingsScored: number;
    findingsNA: number;
    findingsWithEvidence: number;
    evidenceTotal: number;
    evidenceWithSummary: number;
  };

  snowflakeEnv?: {
    CURRENT_ACCOUNT: string;
    CURRENT_REGION: string;
    CURRENT_DATABASE: string;
    CURRENT_SCHEMA: string;
    CURRENT_ROLE: string;
    CURRENT_WAREHOUSE: string;
  } | null;
};

function pct(n?: number) {
  if (typeof n !== "number") return "—";
  return `${Math.round(n * 10) / 10}%`;
}

function num(n?: number) {
  if (typeof n !== "number") return "—";
  return `${Math.round(n * 100) / 100}`;
}

function badgeClass(band?: string) {
  if (band === "A") return "bg-emerald-600 text-white";
  if (band === "B") return "bg-blue-600 text-white";
  if (band === "C") return "bg-amber-600 text-white";
  if (band === "D") return "bg-red-600 text-white";
  return "bg-neutral-700 text-white";
}

async function getScore(caseId: string): Promise<ScoreResp | null> {
  // Use relative URL so this works in dev + Vercel without extra env vars
  const res = await fetch(`/api/admin/verification/${encodeURIComponent(caseId)}/score`, {
    cache: "no-store",
    credentials: "include",
  });

  // If not logged in as admin, the API will return 401/403
  const data = (await res.json().catch(() => null)) as ScoreResp | null;
  return data;
}

export default async function CaseScorePage({ params }: { params: { caseId: string } }) {
  const caseId = params.caseId;
  const data = await getScore(caseId);

  const ok = !!data?.ok;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Verification Case</h1>
        <p className="text-sm text-neutral-600">{caseId}</p>
      </div>

      <CaseTabs caseId={caseId} />

      {!ok ? (
        <div className="rounded-lg border p-4">
          <div className="font-medium">Score unavailable</div>
          <div className="text-sm text-neutral-600 mt-1">
            {data?.error || "No governance score found for this case (or not authorized)."}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-neutral-600">GAFAIG Governance Score</div>
                  <div className="mt-1 text-3xl font-semibold">{num(data.score)}</div>
                </div>

                <div className={`rounded-full px-3 py-1 text-sm font-medium ${badgeClass(data.band)}`}>
                  {data.band}
                </div>
              </div>

              <div className="mt-3 text-sm">
                <div>
                  <span className="text-neutral-600">Tier:</span>{" "}
                  <span className="font-medium">{data.tier}</span>
                </div>
                <div className="mt-1">
                  <span className="text-neutral-600">Case status:</span>{" "}
                  <span className="font-medium">{data.caseStatus ?? "—"}</span>
                </div>
                <div className="mt-1">
                  <span className="text-neutral-600">Standard:</span>{" "}
                  <span className="font-medium">
                    {(data.standard?.code ?? "—") + " " + (data.standard?.version ?? "")}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-neutral-600">Last activity:</span>{" "}
                  <span className="font-medium">{data.lastActivityAt ?? "—"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">Subscores</div>
                <div className="text-xs text-neutral-500">
                  Participant: <span className="font-mono">{data.participantId ?? "—"}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Subscore label="Controls" value={data.subscores.controls} />
                <Subscore label="Coverage" value={data.subscores.coverage} />
                <Subscore label="Freshness" value={data.subscores.freshness} />
                <Subscore label="Summaries" value={data.subscores.summaries} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Stat label="Findings (total)" value={data.counts.findingsTotal} />
                <Stat label="Findings (scored)" value={data.counts.findingsScored} />
                <Stat label="Findings (N/A)" value={data.counts.findingsNA} />
                <Stat label="Findings w/ evidence" value={data.counts.findingsWithEvidence} />
                <Stat label="Evidence (total)" value={data.counts.evidenceTotal} />
                <Stat label="Evidence w/ summary" value={data.counts.evidenceWithSummary} />
              </div>
            </div>
          </div>

          {/* Publish panel (client component) */}
          <PublishPanel
            caseId={caseId}
            band={data.band}
            tier={data.tier}
            score={data.score}
            lastActivityAt={data.lastActivityAt}
            snowflakeEnv={data.snowflakeEnv ?? null}
          />
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-neutral-600">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function Subscore({ label, value }: { label: string; value?: number }) {
  const v = typeof value === "number" ? Math.max(0, Math.min(100, value)) : 0;

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm text-neutral-700">{pct(value)}</div>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-neutral-100">
        <div className="h-2 rounded-full bg-neutral-900" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
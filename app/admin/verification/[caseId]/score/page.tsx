import { headers } from "next/headers";
import AdminNav from "../../../_components/AdminNav";
import AdminPageHeader from "../../../_components/AdminPageHeader";
import CaseTabs from "../_components/CaseTabs";
import PublishPanel from "./_components/PublishPanel";

export const dynamic = "force-dynamic";

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

async function getBaseUrl() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";

  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  }

  return `${proto}://${host}`;
}

async function getScore(caseId: string): Promise<ScoreResp | null> {
  const baseUrl = await getBaseUrl();
  const cookie = headers().get("cookie") || "";

  const res = await fetch(
    `${baseUrl}/api/admin/verification/${encodeURIComponent(caseId)}/score`,
    {
      cache: "no-store",
      headers: {
        cookie,
      },
    }
  );

  const data = (await res.json().catch(() => null)) as ScoreResp | null;
  return data;
}

export default async function CaseScorePage({
  params,
}: {
  params: { caseId: string };
}) {
  const caseId = params.caseId;
  const data = await getScore(caseId);
  const ok = !!data?.ok;

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16 space-y-8">
        <AdminPageHeader
          title={`Score — ${caseId}`}
          description="GAFAIG governance score generated from the Snowflake scoring engine."
          meta={ok ? `Band ${data!.band} • ${data!.tier}` : undefined}
        />

        <CaseTabs caseId={caseId} />

        {!ok ? (
          <div className="rounded-xl border border-black/10 p-4">
            <div className="font-semibold">Score unavailable</div>
            <div className="mt-1 text-sm text-neutral-600">
              {data?.error || "No governance score found for this case (or not authorized)."}
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-xl border border-black/10 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-neutral-600">GAFAIG Governance Score</div>
                    <div className="mt-2 text-3xl font-semibold">{num(data.score)}</div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeClass(data.band)}`}
                  >
                    {data.band}
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm">
                  <div>
                    <span className="text-neutral-600">Tier:</span>{" "}
                    <span className="font-medium">{data.tier}</span>
                  </div>

                  <div>
                    <span className="text-neutral-600">Case status:</span>{" "}
                    <span className="font-medium">{data.caseStatus ?? "—"}</span>
                  </div>

                  <div>
                    <span className="text-neutral-600">Standard:</span>{" "}
                    <span className="font-medium">
                      {(data.standard?.code ?? "—") + " " + (data.standard?.version ?? "")}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-600">Last activity:</span>{" "}
                    <span className="font-medium">{data.lastActivityAt ?? "—"}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-black/10 p-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Subscores</div>
                  <div className="text-xs text-neutral-500">
                    Participant: <span className="font-mono">{data.participantId ?? "—"}</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Subscore label="Controls" value={data.subscores.controls} />
                  <Subscore label="Coverage" value={data.subscores.coverage} />
                  <Subscore label="Freshness" value={data.subscores.freshness} />
                  <Subscore label="Summaries" value={data.subscores.summaries} />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Stat label="Findings (total)" value={data.counts.findingsTotal} />
                  <Stat label="Findings (scored)" value={data.counts.findingsScored} />
                  <Stat label="Findings (N/A)" value={data.counts.findingsNA} />
                  <Stat label="Findings w/ evidence" value={data.counts.findingsWithEvidence} />
                  <Stat label="Evidence (total)" value={data.counts.evidenceTotal} />
                  <Stat label="Evidence w/ summary" value={data.counts.evidenceWithSummary} />
                </div>
              </div>
            </div>

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
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-black/10 p-3">
      <div className="text-xs text-neutral-600">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function Subscore({ label, value }: { label: string; value?: number }) {
  const v = typeof value === "number" ? Math.max(0, Math.min(100, value)) : 0;

  return (
    <div className="rounded-md border border-black/10 p-3">
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
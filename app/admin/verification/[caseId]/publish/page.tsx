import Link from "next/link";
import AdminNav from "../../../_components/AdminNav";
import AdminPageHeader from "../../../_components/AdminPageHeader";
import CaseTabs from "../_components/CaseTabs";
import PublicButtonLink from "../../../../_components/PublicButtonLink";
import PublishPanel from "../score/_components/PublishPanel";

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
  source?: string;
};

async function getBaseUrl() {
  const mod = await import("next/headers");
  const h = await mod.headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";

  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  }

  return `${proto}://${host}`;
}

async function getScore(caseId: string): Promise<ScoreResp | null> {
  const mod = await import("next/headers");
  const h = await mod.headers();
  const cookie = h.get("cookie") || "";
  const baseUrl = await getBaseUrl();

  const res = await fetch(
    `${baseUrl}/api/admin/verification/${encodeURIComponent(caseId)}/score`,
    {
      cache: "no-store",
      headers: { cookie },
    }
  );

  return (await res.json().catch(() => null)) as ScoreResp | null;
}

export default async function CasePublishPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const data = await getScore(caseId);
  const ok = !!data?.ok;

  const caseStatus = String(data?.caseStatus ?? "").trim().toLowerCase();
  const isApproved = ok && caseStatus === "approved";
  const publishAllowed = ok && isApproved;

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminNav />

      <main className="mx-auto max-w-[1100px] space-y-8 px-6 pb-16 pt-14">
        <AdminPageHeader
          title={`Publish — ${caseId}`}
          description="Approve this verification case and write the public registry snapshot."
          meta={ok ? `${data!.tier} • Band ${data!.band}` : undefined}
          actions={
            <div className="flex flex-wrap gap-3">
              <PublicButtonLink
                href={`/admin/verification/${encodeURIComponent(caseId)}`}
                variant="secondary"
                size="sm"
              >
                ← Back
              </PublicButtonLink>

              <PublicButtonLink
                href={`/admin/verification/${encodeURIComponent(caseId)}/score`}
                variant="secondary"
                size="sm"
              >
                Score
              </PublicButtonLink>

              <PublicButtonLink
                href="/admin/applications"
                variant="secondary"
                size="sm"
              >
                Applications
              </PublicButtonLink>
            </div>
          }
        />

        <CaseTabs caseId={caseId} />

        {!ok ? (
          <section className="rounded-2xl border border-black/10 p-5">
            <div className="text-[16px] font-semibold text-black">
              Publish unavailable
            </div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
              {data?.error || "Unable to load the score required for publish."}
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                  Score
                </div>
                <div className="mt-3 text-[30px] font-semibold leading-none text-black">
                  {data.score}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                  Tier
                </div>
                <div className="mt-3 text-[18px] font-semibold text-black">
                  {data.tier}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                  Band
                </div>
                <div className="mt-3 text-[18px] font-semibold text-black">
                  {data.band}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                  Status
                </div>
                <div className="mt-3 text-[18px] font-semibold text-black">
                  {data.caseStatus ?? "—"}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-black/10 p-5">
              <h2 className="text-[16px] font-semibold text-black">
                Publish workflow
              </h2>
              <p className="mt-2 max-w-[900px] text-[14px] leading-[1.7] text-black/70">
                Publishing writes the canonical public registry snapshot for this
                approved case and exposes the result through the public registry
                views. After publish, verify the result on the public registry
                surfaces.
              </p>

              {!isApproved ? (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] text-amber-800">
                  Case must be approved before publishing to the registry.
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] text-emerald-800">
                  Case is approved and ready for registry publication.
                </div>
              )}

              <section className="mt-5 rounded-2xl border border-black/10 p-5">
                <h3 className="text-[16px] font-semibold text-black">
                  Registry status
                </h3>

                <div className="mt-3 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-black/10 p-4">
                    <div className="text-[12px] uppercase tracking-[0.12em] text-black/60">
                      Published
                    </div>
                    <div className="mt-2 text-[16px] font-semibold text-black">
                      {isApproved ? "Not Published" : "Not Ready"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-black/10 p-4">
                    <div className="text-[12px] uppercase tracking-[0.12em] text-black/60">
                      Registry ID
                    </div>
                    <div className="mt-2 text-[14px] font-mono text-black/75">
                      Will appear after publish
                    </div>
                  </div>

                  <div className="rounded-xl border border-black/10 p-4">
                    <div className="text-[12px] uppercase tracking-[0.12em] text-black/60">
                      Snapshot
                    </div>
                    <div className="mt-2 text-[14px] text-black/75">
                      Not created
                    </div>
                  </div>
                </div>
              </section>

              <div className="mt-5">
                {publishAllowed ? (
                  <PublishPanel
                    caseId={caseId}
                    band={data.band}
                    tier={data.tier}
                    score={data.score}
                    lastActivityAt={data.lastActivityAt}
                    snowflakeEnv={data.snowflakeEnv ?? null}
                  />
                ) : (
                  <div className="rounded-xl border border-black/10 p-4 text-[14px] text-black/60">
                    Publish is locked until the case is approved.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-black/10 p-5">
              <h2 className="text-[16px] font-semibold text-black">
                After publish
              </h2>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <Link
                  href="/registry/ai-systems"
                  className="rounded-2xl border border-black/10 p-4 hover:bg-black/[0.03]"
                >
                  <div className="text-[14px] font-semibold text-black">
                    Open public registry
                  </div>
                  <div className="mt-1 text-[13px] text-black/60">
                    Confirm the published record appears in the registry list.
                  </div>
                </Link>

                <Link
                  href="/registry/ai-systems"
                  className="rounded-2xl border border-black/10 p-4 hover:bg-black/[0.03]"
                >
                  <div className="text-[14px] font-semibold text-black">
                    Search for this entity
                  </div>
                  <div className="mt-1 text-[13px] text-black/60">
                    Use the public registry to verify the final public disclosure.
                  </div>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
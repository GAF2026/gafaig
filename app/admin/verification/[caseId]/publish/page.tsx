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

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[18px] font-semibold text-black">{value}</div>
    </div>
  );
}

function SurfaceCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] uppercase tracking-[0.12em] text-black/60">
        {label}
      </div>
      <div className="mt-3 text-[14px] font-semibold text-black">{value}</div>
    </div>
  );
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
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] space-y-8 px-6 py-10">
        <AdminPageHeader
          title={`Publish — ${caseId}`}
          description="Approve this verification case and write the canonical public registry snapshot."
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
          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[26px] font-semibold tracking-tight text-black">
              Publish unavailable
            </div>
            <p className="mt-2 text-[14px] leading-7 text-black/70">
              {data?.error || "Unable to load the score required for publish."}
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <MetricCard label="Score" value={String(data.score)} />
              <MetricCard label="Tier" value={data.tier} />
              <MetricCard label="Band" value={data.band} />
              <MetricCard label="Status" value={data.caseStatus ?? "—"} />
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8">
              <h2 className="text-[26px] font-semibold tracking-tight text-black">
                Publish workflow
              </h2>
              <p className="mt-3 max-w-[900px] text-[15px] leading-7 text-black/70">
                Publishing writes the canonical public registry snapshot for this
                approved case and exposes the result through the live public
                registry trust surfaces. After publish, verify the result on the
                public registry, verification endpoint, and badge layer.
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

              <section className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                <h3 className="text-[26px] font-semibold tracking-tight text-black">
                  Registry status
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <SurfaceCard
                    label="Published"
                    value={isApproved ? "Not Published" : "Not Ready"}
                  />
                  <SurfaceCard
                    label="Registry ID"
                    value="Will appear after publish"
                  />
                  <SurfaceCard label="Snapshot" value="Not created" />
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
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[14px] text-black/60">
                    Publish is locked until the case is approved.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8">
              <h2 className="text-[26px] font-semibold tracking-tight text-black">
                Next trust surfaces
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-black/70">
                Once publish succeeds, validate the certification across the
                canonical public trust surfaces.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <SurfaceCard label="Public registry list" value="/registry" />
                <SurfaceCard
                  label="Verification endpoint"
                  value="/api/verify/[registryId]"
                />
                <SurfaceCard
                  label="Public record page"
                  value="/registry/[registryId]"
                />
                <SurfaceCard label="Badge endpoint" value="/badge/[registryId]" />
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8">
              <h2 className="text-[26px] font-semibold tracking-tight text-black">
                After publish
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Link
                  href="/registry"
                  className="rounded-2xl border border-black/10 bg-white p-4 hover:bg-black/[0.03]"
                >
                  <div className="text-[14px] font-semibold text-black">
                    Open public registry
                  </div>
                  <div className="mt-1 text-[13px] text-black/60">
                    Confirm the published record appears in the main registry list.
                  </div>
                </Link>

                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                  <div className="text-[14px] font-semibold text-black">
                    Verify the record
                  </div>
                  <div className="mt-1 text-[13px] text-black/60">
                    Open /api/verify/[registryId] after publish to confirm the
                    signed public verification payload resolves correctly.
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                  <div className="text-[14px] font-semibold text-black">
                    Check badge + public record
                  </div>
                  <div className="mt-1 text-[13px] text-black/60">
                    Test /badge/[registryId] and /registry/[registryId] to confirm
                    the trust surfaces match the canonical published record.
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
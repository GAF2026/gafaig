import PublicPageSection from "@/app/_components/PublicPageSection";
import {
  getExplorerGlobalStats,
  getExplorerByCountry,
  getExplorerByStatus,
  getExplorerByTier,
  getExplorerByBand,
  getExplorerByEntityType,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";

type TierName = "Tier 1" | "Tier 2" | "Tier 3" | "Uncertified" | "Unknown";

type ExplorerTierRow = {
  certifiedTier: string;
  totalRecords: number;
  totalEntities: number;
};

type ExplorerStatusRow = {
  certificationStatus: string;
  totalRecords: number;
  totalEntities: number;
};

function normalizeTier(value: string | null | undefined): TierName {
  const v = String(value || "").trim().toLowerCase();
  if (v === "tier 3") return "Tier 3";
  if (v === "tier 2") return "Tier 2";
  if (v === "tier 1") return "Tier 1";
  if (v === "uncertified") return "Uncertified";
  return "Unknown";
}

function tierClasses(tier: string | null | undefined) {
  const normalized = normalizeTier(tier);

  if (normalized === "Tier 3") {
    return {
      card: "border-violet-200 bg-violet-50",
      badge: "border-violet-200 bg-violet-100 text-violet-800",
      bar: "bg-violet-600",
      text: "text-violet-900",
      subtext: "text-violet-700",
      label: "Advanced / High-Assurance",
      threshold: "Score ≥ 80",
    };
  }

  if (normalized === "Tier 2") {
    return {
      card: "border-blue-200 bg-blue-50",
      badge: "border-blue-200 bg-blue-100 text-blue-800",
      bar: "bg-blue-600",
      text: "text-blue-900",
      subtext: "text-blue-700",
      label: "Operational Governance",
      threshold: "Score 40–79",
    };
  }

  if (normalized === "Tier 1") {
    return {
      card: "border-emerald-200 bg-emerald-50",
      badge: "border-emerald-200 bg-emerald-100 text-emerald-800",
      bar: "bg-emerald-600",
      text: "text-emerald-900",
      subtext: "text-emerald-700",
      label: "Foundational Governance",
      threshold: "Score 1–39",
    };
  }

  return {
    card: "border-slate-200 bg-slate-50",
    badge: "border-slate-200 bg-slate-100 text-slate-700",
    bar: "bg-slate-400",
    text: "text-slate-900",
    subtext: "text-slate-600",
    label: "No active certification tier",
    threshold: "",
  };
}

function resolveCertifiedCounts(
  global: Awaited<ReturnType<typeof getExplorerGlobalStats>> | null,
  byStatus: ExplorerStatusRow[]
) {
  const certifiedFromStatus = byStatus.find(
    (row) => String(row.certificationStatus || "").trim().toLowerCase() === "certified"
  )?.totalRecords;

  const notCertifiedFromStatus = byStatus.find(
    (row) =>
      String(row.certificationStatus || "").trim().toLowerCase() === "not certified"
  )?.totalRecords;

  const totalRecords = global?.totalRegistryRecords ?? 0;
  const certified = certifiedFromStatus ?? global?.totalCertified ?? 0;

  const notCertified =
    notCertifiedFromStatus ??
    (typeof totalRecords === "number" ? Math.max(totalRecords - certified, 0) : 0);

  return {
    certified,
    notCertified,
  };
}

export default async function ExplorerPage() {
  const [global, byCountry, byStatusRaw, byTier, byBand, byEntityType] =
    await Promise.all([
      getExplorerGlobalStats(),
      getExplorerByCountry(),
      getExplorerByStatus(),
      getExplorerByTier(),
      getExplorerByBand(),
      getExplorerByEntityType(),
    ]);

  const byStatus = byStatusRaw as ExplorerStatusRow[];

  const certifiedTierRows = byTier.filter((row) => {
    const tier = normalizeTier(row.certifiedTier);
    return tier === "Tier 3" || tier === "Tier 2" || tier === "Tier 1";
  });

  const orderedTierRows = [...certifiedTierRows].sort((a, b) => {
    const order: Record<TierName, number> = {
      "Tier 3": 0,
      "Tier 2": 1,
      "Tier 1": 2,
      Uncertified: 3,
      Unknown: 4,
    };
    return (
      order[normalizeTier(a.certifiedTier)] -
      order[normalizeTier(b.certifiedTier)]
    );
  });

  const featuredTier =
    orderedTierRows.find(
      (row) => normalizeTier(row.certifiedTier) === "Tier 3"
    ) ??
    orderedTierRows.find(
      (row) => normalizeTier(row.certifiedTier) === "Tier 2"
    ) ??
    orderedTierRows.find(
      (row) => normalizeTier(row.certifiedTier) === "Tier 1"
    ) ??
    null;

  const counts = resolveCertifiedCounts(global, byStatus);

  const ggi = computeGGI({
    totalRecords: global?.totalRegistryRecords ?? 0,
    totalCertified: counts.certified,
    totalCountries: global?.totalCountries ?? 0,
    tiers: orderedTierRows,
  });

  return (
    <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-14 md:px-8">
      <div className="space-y-8">
        <PublicPageSection
          eyebrow="Public analytics"
          title="Explorer"
          description="Global analytics derived from the GAFAIG registry. This surface turns certification records into a governance intelligence layer for public transparency, benchmarking, and verification."
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
            <StatCard label="Records" value={global?.totalRegistryRecords} />
            <StatCard label="Entities" value={global?.totalEntities} />
            <StatCard label="Countries" value={global?.totalCountries} />
            <StatCard label="Published" value={global?.totalPublished} />
            <StatCard label="Certified" value={counts.certified} />
            <StatCard label="Not Certified" value={counts.notCertified} />
          </div>
        </PublicPageSection>

        <PublicPageSection>
          <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Global Governance Index
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  GGI {ggi.score}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Composite public signal derived from registry certification
                  coverage, tier depth, and geographic reach.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <IndexChip label={ggi.label} tone={ggi.tone} />
                <IndexChip label={`${ggi.certifiedPct}% certified`} />
                <IndexChip
                  label={`${ggi.tierDepth} active tier${
                    ggi.tierDepth === 1 ? "" : "s"
                  }`}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-4">
              <GGIScoreCard
                title="Index Score"
                value={ggi.score}
                subtitle={ggi.label}
                tone={ggi.tone}
              />
              <GGIScoreCard
                title="Certification Coverage"
                value={`${ggi.certifiedPct}%`}
                subtitle={`${ggi.totalCertified} of ${ggi.totalRecords} records`}
                tone="blue"
              />
              <GGIScoreCard
                title="Tier Depth"
                value={ggi.tierDepth}
                subtitle="Certified tiers represented"
                tone="violet"
              />
              <GGIScoreCard
                title="Geographic Reach"
                value={ggi.totalCountries}
                subtitle="Countries represented"
                tone="emerald"
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              <MetricBar
                label="Coverage Contribution"
                value={ggi.coverageContribution}
                max={60}
                tone="blue"
              />
              <MetricBar
                label="Tier Depth Contribution"
                value={ggi.depthContribution}
                max={25}
                tone="violet"
              />
              <MetricBar
                label="Reach Contribution"
                value={ggi.reachContribution}
                max={15}
                tone="emerald"
              />
            </div>
          </div>
        </PublicPageSection>

        <PublicPageSection>
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <TierLadder rows={orderedTierRows} />
            </div>

            <FeaturedTierCard row={featuredTier} />
          </div>
        </PublicPageSection>

        <PublicPageSection>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            <BarCard
              title="Country Distribution"
              items={byCountry.map((row) => ({
                label: row.country,
                value: row.totalRecords,
                tone: "default",
              }))}
            />

            <BarCard
              title="Certification Status"
              items={[
                {
                  label: "Certified",
                  value: counts.certified,
                  tone: "certified",
                },
                {
                  label: "Not Certified",
                  value: counts.notCertified,
                  tone: "default",
                },
              ]}
            />

            <BarCard
              title="Certified Tier"
              items={orderedTierRows.map((row) => ({
                label: row.certifiedTier,
                value: row.totalRecords,
                tone: normalizeTier(row.certifiedTier),
              }))}
            />

            <BarCard
              title="Certified Band"
              items={byBand.map((row) => ({
                label: row.certifiedBand,
                value: row.totalRecords,
                tone: row.certifiedBand,
              }))}
            />
          </div>
        </PublicPageSection>

        <PublicPageSection>
          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Certification Signal
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Public certification outcomes derived from published registry
                  records.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <SignalChip label="Certified" />
                <SignalChip label="Published" tone="green" />
                <SignalChip label="Registry-backed" />
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <MiniTableCard
                title="Status Breakdown"
                columns={["Status", "Records"]}
                rows={[
                  ["Certified", String(counts.certified)],
                  ["Not Certified", String(counts.notCertified)],
                ]}
              />

              <MiniTableCard
                title="Tier Breakdown"
                columns={["Tier", "Records"]}
                rows={orderedTierRows.map((row) => [
                  row.certifiedTier,
                  String(row.totalRecords),
                ])}
              />

              <MiniTableCard
                title="Band Breakdown"
                columns={["Band", "Records"]}
                rows={byBand.map((row) => [
                  row.certifiedBand,
                  String(row.totalRecords),
                ])}
              />
            </div>
          </div>
        </PublicPageSection>

        <PublicPageSection>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            By Country
          </h2>

          <DataTable
            columns={[
              "Country",
              "Records",
              "Entities",
              "Certified",
              "Not Certified",
            ]}
            rows={byCountry.map((row) => [
              row.country,
              String(row.totalRecords),
              String(row.totalEntities),
              String(row.totalCertified),
              String(row.totalNotCertified),
            ])}
          />
        </PublicPageSection>

        <PublicPageSection>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Certification Status
          </h2>

          <DataTable
            columns={["Status", "Records", "Entities"]}
            rows={[
              ["Certified", String(counts.certified), String(global?.totalEntities ?? 0)],
              ["Not Certified", String(counts.notCertified), "—"],
            ]}
          />
        </PublicPageSection>

        <PublicPageSection>
          <div className="grid gap-6 xl:grid-cols-2">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Certified Tier
              </h2>

              <DataTable
                columns={["Tier", "Records", "Entities"]}
                rows={orderedTierRows.map((row) => [
                  row.certifiedTier,
                  String(row.totalRecords),
                  String(row.totalEntities),
                ])}
              />
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Certified Band
              </h2>

              <DataTable
                columns={["Band", "Records", "Entities"]}
                rows={byBand.map((row) => [
                  row.certifiedBand,
                  String(row.totalRecords),
                  String(row.totalEntities),
                ])}
              />
            </div>
          </div>
        </PublicPageSection>

        <PublicPageSection>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Entity Types
          </h2>

          <DataTable
            columns={[
              "Entity Type",
              "Records",
              "Entities",
              "Certified",
              "Not Certified",
            ]}
            rows={byEntityType.map((row) => [
              row.entityType,
              String(row.totalRecords),
              String(row.totalEntities),
              String(row.totalCertified),
              String(row.totalNotCertified),
            ])}
          />
        </PublicPageSection>
      </div>
    </main>
  );
}

function computeGGI({
  totalRecords,
  totalCertified,
  totalCountries,
  tiers,
}: {
  totalRecords: number;
  totalCertified: number;
  totalCountries: number;
  tiers: ExplorerTierRow[];
}) {
  const certifiedPct =
    totalRecords > 0 ? Math.round((totalCertified / totalRecords) * 100) : 0;

  const tierWeights: Record<string, number> = {
    "Tier 3": 3,
    "Tier 2": 2,
    "Tier 1": 1,
  };

  const representedTiers = tiers.filter((row) => row.totalRecords > 0);
  const tierDepth = representedTiers.length;

  const weightedTierPoints = representedTiers.reduce(
    (sum, row) => sum + (tierWeights[row.certifiedTier] ?? 0),
    0
  );

  const maxTierPoints = 6;
  const coverageContribution = Math.round(certifiedPct * 0.6);
  const depthContribution = Math.round(
    maxTierPoints > 0 ? (weightedTierPoints / maxTierPoints) * 25 : 0
  );
  const reachContribution = Math.min(totalCountries * 3, 15);

  const score = Math.min(
    coverageContribution + depthContribution + reachContribution,
    100
  );

  let label = "Foundational";
  let tone: "slate" | "blue" | "violet" | "emerald" = "slate";

  if (score >= 80) {
    label = "High Maturity";
    tone = "violet";
  } else if (score >= 60) {
    label = "Operational";
    tone = "blue";
  } else if (score >= 40) {
    label = "Emerging";
    tone = "emerald";
  }

  return {
    score,
    label,
    tone,
    certifiedPct,
    totalCertified,
    totalRecords,
    totalCountries,
    tierDepth,
    coverageContribution,
    depthContribution,
    reachContribution,
  };
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | undefined | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-900">
        {value ?? "—"}
      </div>
    </div>
  );
}

function SignalChip({
  label,
  tone = "slate",
}: {
  label: string;
  tone?: "slate" | "green";
}) {
  const cls =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

function IndexChip({
  label,
  tone = "slate",
}: {
  label: string;
  tone?: "slate" | "blue" | "violet" | "emerald";
}) {
  const cls =
    tone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

function GGIScoreCard({
  title,
  value,
  subtitle,
  tone,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  tone: "slate" | "blue" | "violet" | "emerald";
}) {
  const cls =
    tone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-900"
      : tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-900"
      : tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${cls}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-sm text-slate-600">{subtitle}</div>
    </div>
  );
}

function MetricBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "blue" | "violet" | "emerald";
}) {
  const width = `${Math.max(Math.min((value / max) * 100, 100), 6)}%`;
  const barClass =
    tone === "violet"
      ? "bg-violet-600"
      : tone === "emerald"
      ? "bg-emerald-600"
      : "bg-blue-600";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-700">{label}</div>
        <div className="text-sm font-semibold text-slate-900">{value}</div>
      </div>
      <div className="mt-3 h-3 rounded-full bg-slate-100">
        <div className={`h-3 rounded-full ${barClass}`} style={{ width }} />
      </div>
    </div>
  );
}

function TierLadder({ rows }: { rows: ExplorerTierRow[] }) {
  const map = new Map(rows.map((row) => [normalizeTier(row.certifiedTier), row]));
  const ladderOrder: TierName[] = ["Tier 3", "Tier 2", "Tier 1"];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Certification Tier Ladder
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        GAFAIG certification progresses from foundational governance to advanced,
        high-assurance governance. Only certified tiers appear in the active
        ranking.
      </p>

      {rows.length === 1 ? (
        <div className="mt-4 text-sm text-slate-500">
          Only one certification tier is currently represented in the registry.
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {ladderOrder.map((tierName, idx) => {
          const activeRow = map.get(tierName);
          const style = tierClasses(tierName);
          const isActive = !!activeRow;

          return (
            <div
              key={tierName}
              className={`overflow-hidden rounded-2xl border ${
                isActive ? style.card : "border-slate-200 bg-slate-50"
              } ${isActive && idx === 0 ? "shadow-md" : "shadow-sm"}`}
            >
              <div className="flex items-stretch">
                <div className={`w-3 ${isActive ? style.bar : "bg-slate-300"}`} />

                <div className="flex flex-1 items-center justify-between p-5">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {tierName === "Tier 3"
                        ? "Highest assurance"
                        : tierName === "Tier 2"
                        ? "Operational level"
                        : "Foundational level"}
                    </div>

                    <div className="mt-1 flex items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? style.badge
                            : "border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {tierName}
                      </span>

                      <span
                        className={`text-sm ${
                          isActive ? style.subtext : "text-slate-500"
                        }`}
                      >
                        {style.label}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      {style.threshold}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${
                        isActive ? style.text : "text-slate-400"
                      }`}
                    >
                      {activeRow ? activeRow.totalRecords : 0}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Records
                    </div>
                  </div>
                </div>
              </div>

              {isActive ? (
                <div className="border-t border-black/5 bg-white/60 px-5 py-3 text-xs text-slate-600">
                  {activeRow.totalEntities} entit
                  {activeRow.totalEntities === 1 ? "y" : "ies"} currently
                  represented in this tier.
                </div>
              ) : (
                <div className="border-t border-black/5 bg-white/60 px-5 py-3 text-xs text-slate-500">
                  No active public records currently represented at this tier.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedTierCard({ row }: { row: ExplorerTierRow | null }) {
  if (!row) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Highest Certified Tier
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          No certified tier available yet.
        </p>
      </section>
    );
  }

  const tierStyle = tierClasses(row.certifiedTier);

  return (
    <section className={`rounded-3xl border p-6 shadow-sm ${tierStyle.card}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Highest Certified Tier
      </div>

      <div
        className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tierStyle.badge}`}
      >
        {row.certifiedTier}
      </div>

      <div className={`mt-4 text-3xl font-semibold ${tierStyle.text}`}>
        {row.totalRecords}
      </div>
      <div className={`mt-1 text-sm ${tierStyle.subtext}`}>Certified records</div>

      <div className="mt-6 rounded-2xl border border-white/60 bg-white/70 p-4">
        <div className="text-sm font-medium text-slate-700">
          {tierStyle.label}
        </div>
        <div className="mt-2 text-sm text-slate-600">
          {row.totalEntities} entit
          {row.totalEntities === 1 ? "y" : "ies"} currently represented at this
          level in the public registry.
        </div>
      </div>
    </section>
  );
}

function BarCard({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: number; tone?: string }>;
}) {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const max = sorted.length
    ? Math.max(...sorted.map((item) => item.value), 1)
    : 1;
  const total = sorted.reduce((sum, item) => sum + item.value, 0);

  function barClass(tone?: string) {
    const tier = normalizeTier(tone);
    if (tier === "Tier 3") return "bg-violet-600";
    if (tier === "Tier 2") return "bg-blue-600";
    if (tier === "Tier 1") return "bg-emerald-600";

    const v = String(tone || "").toLowerCase();
    if (v === "certified") return "bg-emerald-600";
    if (v === "a") return "bg-violet-600";
    if (v === "b") return "bg-blue-600";
    if (v === "c") return "bg-amber-500";
    if (v === "d") return "bg-slate-500";

    return "bg-slate-900";
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="text-sm text-slate-500">No data.</div>
        ) : (
          sorted.map((item) => {
            const width = `${Math.max((item.value / max) * 100, 8)}%`;
            const percent = total
              ? ((item.value / total) * 100).toFixed(1)
              : "0.0";

            return (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between gap-4">
                  <div className="truncate text-sm text-slate-700">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    {item.value} ({percent}%)
                  </div>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${barClass(item.tone)}`}
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function MiniTableCard({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
        {title}
      </div>

      <table className="w-full text-sm">
        <thead className="bg-white text-left text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${title}-${idx}`} className="border-t border-slate-100">
              {row.map((cell, cellIdx) => (
                <td
                  key={`${title}-${idx}-${cellIdx}`}
                  className="px-4 py-3 text-slate-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-slate-100">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-3 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
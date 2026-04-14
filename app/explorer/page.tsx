import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import {
  getExplorerSummary,
  getRecentRegistryRecords,
} from "@/lib/queries/explorer";

export const revalidate = 300;

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTierBand(tier: string | null, band: string | null) {
  if (!tier && !band) return "—";
  if (tier && band) return `${tier} · ${band}`;
  return tier ?? band ?? "—";
}

function formatStatus(status: string | null) {
  if (!status) return "—";
  return status.toUpperCase();
}

function getTrustState(row: {
  certifiedAt: string | null;
  decisionStatus: string | null;
}) {
  if (row.certifiedAt) {
    return {
      label: "Verified",
      className:
        "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700",
    };
  }

  if (String(row.decisionStatus ?? "").trim().toUpperCase() === "APPROVED") {
    return {
      label: "Approved",
      className:
        "inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700",
    };
  }

  return {
    label: "Pending",
    className:
      "inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600",
  };
}

export default async function ExplorerPage() {
  const [summary, recentRecords] = await Promise.all([
    getExplorerSummary(),
    getRecentRegistryRecords(10),
  ]);

  return (
    <main className="mx-auto max-w-[1320px] px-6 pb-16 pt-14 lg:px-8">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="GLOBAL EXPLORER"
          title="Explore the public GAFAIG trust surface."
          description="Discover public records across organizations, countries, and AI systems using the canonical registry views published from Snowflake."
          secondaryDescription="Explorer is broader than Registry. It may include certified public records and approved public records that do not surface a certification outcome."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="primary">
                View Registry
              </PublicButtonLink>

              <PublicButtonLink
                href="/explorer/organizations"
                variant="secondary"
              >
                Organizations
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/systems" variant="secondary">
                Systems
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Countries
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Registry records"
            value={String(summary.totalRecords ?? 0)}
          />
          <MetricCard
            label="Organizations"
            value={String(summary.totalOrganizations ?? 0)}
          />
          <MetricCard
            label="Countries"
            value={String(summary.totalCountries ?? 0)}
          />
          <MetricCard
            label="AI systems"
            value={String(summary.totalSystems ?? 0)}
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PUBLIC-SAFE TRUST EXPLANATION
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[40px]">
            What Explorer publishes
          </h2>

          <p className="mt-4 max-w-[920px] text-[15px] leading-[1.8] text-black/68">
            Explorer publishes certification outcomes and broader public-safe
            governance record visibility. It does not expose private evidence,
            internal reviewer materials, control-by-control scoring logic, or
            controlled workflow details from the private verification engine.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ExplanationCard
              title="Certified outcomes"
              body="Certified records surface tier, band, certification date, and validity information for public trust review."
            />
            <ExplanationCard
              title="Approved public records"
              body="Explorer may also disclose approved public records that do not surface a certification outcome."
            />
            <ExplanationCard
              title="Protected private engine"
              body="Private evidence, reviewer notes, and detailed scoring operations remain inside the controlled verification environment."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                RECENT PUBLIC RECORDS
              </div>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[40px]">
                Latest public records
              </h2>

              <p className="mt-3 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
                Recently surfaced records from the GAFAIG public trust surface.
              </p>
            </div>

            <div>
              <PublicButtonLink href="/registry" variant="secondary">
                Open Full Registry
              </PublicButtonLink>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-left text-[12px] uppercase tracking-[0.16em] text-black/55">
                  <th className="px-0 py-3">Entity</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Tier / Band</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Certified</th>
                  <th className="px-4 py-3">Trust</th>
                  <th className="px-4 py-3">Record</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((row) => {
                  const trustState = getTrustState(row);

                  return (
                    <tr key={row.registryId} className="border-b border-black/5">
                      <td className="px-0 py-4">
                        <div className="font-semibold text-black">
                          {row.entityName ?? "—"}
                        </div>
                        <div className="mt-1 text-sm text-black/60">
                          {row.registryId}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-black/75">
                        {row.country ?? "—"}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/75">
                        {formatTierBand(row.certifiedTier, row.certifiedBand)}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/75">
                        {formatStatus(row.decisionStatus)}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/75">
                        {formatDate(row.certifiedAt)}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <span className={trustState.className}>
                          {trustState.label}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={`/registry/${row.registryId}`}
                          className="text-sm font-semibold text-black underline underline-offset-4"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {recentRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-0 py-8 text-sm text-black/60">
                      No recent public records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[36px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function ExplanationCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}
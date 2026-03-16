import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";
import { buildRegistryAiSystemHref } from "@/lib/platform-contracts";
import AISystemCard from "@/components/registry/AISystemCard";
import type { RegistryAiSystemRow } from "@/types/registry";
import PublicPageHero from "../../_components/PublicPageHero";

export const dynamic = "force-dynamic";

function safeText(value: unknown, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      values
        .map((v) => String(v ?? "").trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
    )
  );
}

function includesText(value: string | null | undefined, query: string) {
  return String(value ?? "").toLowerCase().includes(query.toLowerCase());
}

export default async function RegistryAiSystemsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) || {};

  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const org = typeof sp.org === "string" ? sp.org.trim() : "";
  const systemType =
    typeof sp.systemType === "string" ? sp.systemType.trim() : "";
  const deploymentStatus =
    typeof sp.deploymentStatus === "string" ? sp.deploymentStatus.trim() : "";

  const res = await sfQueryResult<RegistryAiSystemRow>(
    `
    SELECT
      s.SYSTEM_ID,
      s.REGISTRY_ID,
      s.APPLICATION_ID,
      s.CASE_ID,

      r.ENTITY_NAME,

      s.SYSTEM_NAME,
      s.SYSTEM_TYPE,
      s.INTENDED_USE,
      s.DEPLOYMENT_STATUS,
      s.OVERSIGHT_LEVEL,
      s.RISK_TIER,
      s.DEVELOPER_ORGANIZATION,
      s.TRAINING_DATA_CATEGORY,
      s.OVERSIGHT_MODEL,
      s.HUMAN_REVIEW_REQUIRED,
      s.EVALUATION_PROTOCOL,
      s.AUDIT_FREQUENCY,

      r.DECISION_STATUS,
      r.CERTIFIED_TIER,
      r.CERTIFIED_BAND,

      NULL AS GOVERNANCE_MATURITY_SCORE,
      NULL AS CONTROLS_PCT,
      NULL AS COVERAGE_PCT,
      NULL AS FRESHNESS_PCT,
      NULL AS SUMMARY_PCT,

      r.LAST_ACTIVITY_AT,
      s.PUBLIC_SUMMARY,
      s.DISPLAY_ORDER

    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
    LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
      ON s.REGISTRY_ID = r.REGISTRY_ID

    ORDER BY
      s.REGISTRY_ID ASC,
      s.DISPLAY_ORDER ASC NULLS LAST,
      s.SYSTEM_NAME ASC
    `
  );

  const allRows = res.ok ? res.rows ?? [] : [];

  const organizationOptions = uniqueValues(
    allRows.map((row) => row.ENTITY_NAME)
  );
  const systemTypeOptions = uniqueValues(allRows.map((row) => row.SYSTEM_TYPE));
  const deploymentStatusOptions = uniqueValues(
    allRows.map((row) => row.DEPLOYMENT_STATUS)
  );

  const filteredRows = allRows.filter((row) => {
    const matchesQuery =
      !q ||
      includesText(row.SYSTEM_NAME, q) ||
      includesText(row.ENTITY_NAME, q) ||
      includesText(row.INTENDED_USE, q) ||
      includesText(row.PUBLIC_SUMMARY, q) ||
      includesText(row.SYSTEM_TYPE, q) ||
      includesText(row.OVERSIGHT_LEVEL, q) ||
      includesText(row.OVERSIGHT_MODEL, q) ||
      includesText(row.RISK_TIER, q) ||
      includesText(row.CERTIFIED_TIER, q) ||
      includesText(row.CERTIFIED_BAND, q) ||
      includesText(row.REGISTRY_ID, q);

    const matchesOrganization = !org || String(row.ENTITY_NAME ?? "") === org;

    const matchesSystemType =
      !systemType || String(row.SYSTEM_TYPE ?? "") === systemType;

    const matchesDeploymentStatus =
      !deploymentStatus ||
      String(row.DEPLOYMENT_STATUS ?? "") === deploymentStatus;

    return (
      matchesQuery &&
      matchesOrganization &&
      matchesSystemType &&
      matchesDeploymentStatus
    );
  });

  const hasFilters = Boolean(q || org || systemType || deploymentStatus);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="REGISTRY"
        title="Certified AI Systems"
        description="Public registry of AI systems covered by GAFAIG-certified governance reviews. Oversight structure, deployment context, and certification outcome are surfaced without exposing private evidence."
        actions={
          <>
            <Link
              href="/registry"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Browse registry records
            </Link>
            <Link
              href="/explorer/systems"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open systems explorer
            </Link>
          </>
        }
      />

      {!res.ok ? (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Failed to load certified AI systems.
          <div className="mt-2 break-words text-red-600">
            {safeText(res.error, "Unknown Snowflake error")}
          </div>
        </div>
      ) : (
        <>
          <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              SEARCH DIRECTORY
            </div>

            <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Search public AI system disclosures
            </h2>

            <p className="mt-5 max-w-3xl text-[15px] leading-[1.85] text-black/75">
              Search by AI system name, organization, intended use, summary
              text, registry ID, governance tier, oversight model, or filter by
              organization, system type, and deployment status.
            </p>

            <form
              action="/registry/ai-systems"
              method="get"
              className="mt-6 grid gap-4 md:grid-cols-12"
            >
              <div className="md:col-span-4">
                <label
                  htmlFor="q"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-black/55"
                >
                  Search
                </label>
                <input
                  id="q"
                  name="q"
                  defaultValue={q}
                  placeholder="e.g. tutor, oversight, band A, GAFAIG-00000001"
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
                />
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="org"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-black/55"
                >
                  Organization
                </label>
                <select
                  id="org"
                  name="org"
                  defaultValue={org}
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
                >
                  <option value="">All organizations</option>
                  {organizationOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="systemType"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-black/55"
                >
                  System type
                </label>
                <select
                  id="systemType"
                  name="systemType"
                  defaultValue={systemType}
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
                >
                  <option value="">All system types</option>
                  {systemTypeOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="deploymentStatus"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-black/55"
                >
                  Deployment status
                </label>
                <select
                  id="deploymentStatus"
                  name="deploymentStatus"
                  defaultValue={deploymentStatus}
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
                >
                  <option value="">All deployment statuses</option>
                  {deploymentStatusOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-3 md:col-span-12">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90"
                >
                  Search directory
                </button>

                <Link
                  href="/registry/ai-systems"
                  className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/[0.04]"
                >
                  Clear filters
                </Link>
              </div>
            </form>
          </section>

          {allRows.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
              <h2 className="text-[28px] font-semibold tracking-tight text-black">
                No certified AI systems yet
              </h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-black/70">
                Publish a certified case from the admin workflow to make AI
                system disclosures visible here.
              </p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
              <h2 className="text-[28px] font-semibold tracking-tight text-black">
                No AI systems match those filters
              </h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-black/70">
                Try a broader search term or clear one of the filters.
              </p>
              {hasFilters ? (
                <div className="mt-5">
                  <Link
                    href="/registry/ai-systems"
                    className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                  >
                    View all certified AI systems
                  </Link>
                </div>
              ) : null}
            </div>
          ) : (
            <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                    AI SYSTEMS
                  </div>
                  <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                    Public system disclosures
                  </h2>
                </div>

                <div className="text-[14px] text-black/65">
                  Showing {filteredRows.length} certified AI system
                  {filteredRows.length === 1 ? "" : "s"}
                  {hasFilters ? ` out of ${allRows.length}` : ""}.
                </div>
              </div>

              {org ? (
                <div className="mt-6 rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm text-black/75">
                  Viewing systems operated by{" "}
                  <span className="font-semibold text-black">{org}</span>.
                </div>
              ) : null}

              <div className="mt-8 grid gap-5">
                {filteredRows.map((row) => {
                  const hasRegistryId = String(row.REGISTRY_ID ?? "").trim().length > 0;

                  return (
                    <div key={row.SYSTEM_ID}>
                      <AISystemCard system={row} />
                      {hasRegistryId ? (
                        <div className="mt-3 flex justify-end">
                          <Link
                            href={buildRegistryAiSystemHref(row.REGISTRY_ID)}
                            className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                          >
                            View certificate
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
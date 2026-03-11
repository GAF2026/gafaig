import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";
import AISystemCard from "@/components/registry/AISystemCard";
import type { RegistryAiSystemRow } from "@/types/registry";

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
      r.ENTITY_NAME,
      s.SYSTEM_NAME,
      s.SYSTEM_TYPE,
      s.INTENDED_USE,
      s.DEPLOYMENT_STATUS,
      s.OVERSIGHT_LEVEL,
      s.RISK_TIER,
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

  const organizationOptions = uniqueValues(allRows.map((row) => row.ENTITY_NAME));
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
      includesText(row.RISK_TIER, q) ||
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
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Global AI Governance Registry
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Certified AI Systems
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
              Public registry of AI systems covered by GAFAIG-certified
              governance reviews. Certification status is shown through the
              associated registry record while private evidence remains
              non-public.
            </p>
          </div>

          <div className="pt-1">
            <Link
              href="/registry"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Browse registry records
            </Link>
          </div>
        </div>

        {!res.ok ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load certified AI systems.
            <div className="mt-2 break-words text-red-600">
              {safeText(res.error, "Unknown Snowflake error")}
            </div>
          </div>
        ) : (
          <>
            <section className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Search directory
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-700">
                  Search by AI system name, organization, intended use, summary
                  text, registry ID, or filter by organization, system type, and
                  deployment status.
                </p>
              </div>

              <form
                action="/registry/ai-systems"
                method="get"
                className="grid gap-4 md:grid-cols-12"
              >
                <div className="md:col-span-4">
                  <label
                    htmlFor="q"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500"
                  >
                    Search
                  </label>
                  <input
                    id="q"
                    name="q"
                    defaultValue={q}
                    placeholder="e.g. tutor, OpenAI, education, GAFAIG-00000001"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
                  />
                </div>

                <div className="md:col-span-3">
                  <label
                    htmlFor="org"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500"
                  >
                    Organization
                  </label>
                  <select
                    id="org"
                    name="org"
                    defaultValue={org}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
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
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500"
                  >
                    System type
                  </label>
                  <select
                    id="systemType"
                    name="systemType"
                    defaultValue={systemType}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
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
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500"
                  >
                    Deployment status
                  </label>
                  <select
                    id="deploymentStatus"
                    name="deploymentStatus"
                    defaultValue={deploymentStatus}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
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
                    className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-white"
                  >
                    Clear filters
                  </Link>
                </div>
              </form>
            </section>

            {allRows.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8">
                <h2 className="text-xl font-medium">
                  No certified AI systems yet
                </h2>
                <p className="mt-2 text-neutral-600">
                  Publish a certified case from the admin workflow to make AI
                  system disclosures visible here.
                </p>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8">
                <h2 className="text-xl font-medium">
                  No AI systems match those filters
                </h2>
                <p className="mt-2 text-neutral-600">
                  Try a broader search term or clear one of the filters.
                </p>
                {hasFilters ? (
                  <div className="mt-4">
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
              <>
                <div className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-neutral-700">
                  Showing {filteredRows.length} certified AI system
                  {filteredRows.length === 1 ? "" : "s"}
                  {hasFilters ? ` out of ${allRows.length}` : ""}.
                </div>

                {org ? (
                  <div className="mb-6 rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm text-black/75">
                    Viewing systems operated by{" "}
                    <span className="font-semibold text-black">{org}</span>.
                  </div>
                ) : null}

                <div className="grid gap-5">
                  {filteredRows.map((row) => (
                    <div key={row.SYSTEM_ID}>
                      <AISystemCard system={row} />
                      {row.REGISTRY_ID ? (
                        <div className="mt-3 flex justify-end">
                          <Link
                            href={`/registry/${encodeURIComponent(
                              row.REGISTRY_ID
                            )}`}
                            className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                          >
                            View certification
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
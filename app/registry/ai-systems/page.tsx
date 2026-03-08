import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";

type AiSystemRow = {
  REGISTRY_ID: string | null;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  INTENDED_USE: string | null;
  DEPLOYMENT_STATUS?: string | null;
  OVERSIGHT_LEVEL?: string | null;
  RISK_TIER: string | null;
  PUBLIC_SUMMARY: string | null;
  DISPLAY_ORDER?: number | null;
};

export const dynamic = "force-dynamic";

function safeText(value: unknown, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

export default async function RegistryAiSystemsPage() {
  const res = await sfQueryResult<AiSystemRow>(
    `
    SELECT
      REGISTRY_ID,
      SYSTEM_NAME,
      SYSTEM_TYPE,
      INTENDED_USE,
      DEPLOYMENT_STATUS,
      OVERSIGHT_LEVEL,
      RISK_TIER,
      PUBLIC_SUMMARY,
      DISPLAY_ORDER
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY
      REGISTRY_ID ASC,
      DISPLAY_ORDER ASC NULLS LAST,
      SYSTEM_NAME ASC
    `
  );

  const rows = res.ok ? res.rows ?? [] : [];

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Global AI Governance Registry
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Certified AI Systems
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            Public registry of AI systems covered by GAFAIG-certified governance
            reviews. Certification status is shown through the associated
            registry record while private evidence remains non-public.
          </p>
        </div>

        {!res.ok ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load certified AI systems.
            <div className="mt-2 break-words text-red-600">
              {safeText(res.error, "Unknown Snowflake error")}
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8">
            <h2 className="text-xl font-medium">No certified AI systems yet</h2>
            <p className="mt-2 text-neutral-600">
              Publish a certified case from the admin workflow to make AI system
              disclosures visible here.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-neutral-700">
              Showing {rows.length} certified AI system
              {rows.length === 1 ? "" : "s"}.
            </div>

            <div className="grid gap-5">
              {rows.map((row, index) => {
                const registryId = safeText(row.REGISTRY_ID);
                const systemName = safeText(row.SYSTEM_NAME, "Unnamed AI System");

                return (
                  <article
                    key={`${row.REGISTRY_ID ?? "registry"}-${row.SYSTEM_NAME ?? "system"}-${index}`}
                    className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                          {registryId !== "—" ? registryId : "Registry record"}
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight">
                          {systemName}
                        </h2>

                        <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">
                          {safeText(
                            row.PUBLIC_SUMMARY,
                            "No public summary has been provided for this AI system."
                          )}
                        </p>
                      </div>

                      {row.REGISTRY_ID ? (
                        <div className="shrink-0">
                          <Link
                            href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                            className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                          >
                            View certification
                          </Link>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                      <div className="rounded-2xl border border-neutral-200 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                          System Type
                        </div>
                        <div className="mt-2 text-sm font-medium">
                          {safeText(row.SYSTEM_TYPE)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-neutral-200 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                          Intended Use
                        </div>
                        <div className="mt-2 text-sm font-medium">
                          {safeText(row.INTENDED_USE)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-neutral-200 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                          Risk Tier
                        </div>
                        <div className="mt-2 text-sm font-medium">
                          {safeText(row.RISK_TIER)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-neutral-200 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                          Deployment Status
                        </div>
                        <div className="mt-2 text-sm font-medium">
                          {safeText(row.DEPLOYMENT_STATUS)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-neutral-200 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                          Oversight Level
                        </div>
                        <div className="mt-2 text-sm font-medium">
                          {safeText(row.OVERSIGHT_LEVEL)}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
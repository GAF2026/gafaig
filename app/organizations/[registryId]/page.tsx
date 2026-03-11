import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";
import { isGafaigRegistryId } from "@/lib/ids";
import RegistryNavigationGraph from "@/components/registry/RegistryNavigationGraph";

export const dynamic = "force-dynamic";

type OrganizationRow = {
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  ENTITY_NAME: string;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

type OrganizationSystemRow = {
  SYSTEM_ID: string;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  INTENDED_USE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  PUBLIC_SUMMARY: string | null;
};

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function chipClass() {
  return "inline-flex items-center rounded-full border border-black/15 bg-black/[0.04] px-2.5 py-1 text-[12px] font-semibold leading-none text-black";
}

export default async function OrganizationProfilePage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId || "").trim().toUpperCase();

  if (!isGafaigRegistryId(registryId)) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
        <section className="rounded-2xl border border-black/10 p-6">
          <div className="text-[16px] font-semibold text-black">
            Organization not found
          </div>
          <p className="mt-3 text-[15px] leading-[1.75] text-black/72">
            No public organization profile exists for{" "}
            <span className="font-mono text-black">
              {registryId || "(missing registry ID)"}
            </span>
            .
          </p>
        </section>
      </main>
    );
  }

  const orgRes = await sfQueryResult<OrganizationRow>(
    `
    SELECT
      REGISTRY_ID,
      APPLICATION_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      VALID_FROM,
      VALID_TO,
      CERTIFIED_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    WHERE REGISTRY_ID = ?
    LIMIT 1
    `,
    [registryId]
  );

  const row = orgRes.ok ? orgRes.rows?.[0] ?? null : null;

  const systemsRes = await sfQueryResult<OrganizationSystemRow>(
    `
    SELECT
      SYSTEM_ID,
      SYSTEM_NAME,
      SYSTEM_TYPE,
      INTENDED_USE,
      DEPLOYMENT_STATUS,
      OVERSIGHT_LEVEL,
      RISK_TIER,
      PUBLIC_SUMMARY
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE REGISTRY_ID = ?
    ORDER BY DISPLAY_ORDER ASC NULLS LAST, SYSTEM_NAME ASC
    `,
    [registryId]
  );

  const systems = systemsRes.ok ? systemsRes.rows ?? [] : [];

  if (!row) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
        <section className="rounded-2xl border border-black/10 p-6">
          <div className="text-[16px] font-semibold text-black">
            Organization not found
          </div>
          <p className="mt-3 text-[15px] leading-[1.75] text-black/72">
            No public organization profile exists for{" "}
            <span className="font-mono text-black">{registryId}</span>.
          </p>
        </section>
      </main>
    );
  }

  const navItems = [
    {
      label: "Certification record",
      href: `/registry/${encodeURIComponent(registryId)}`,
      description:
        "Open the public registry record for this certified organization.",
    },
    {
      label: "Verification endpoint",
      href: `/api/verify/${encodeURIComponent(registryId)}`,
      description:
        "Machine-readable verification response with proof metadata.",
    },
    {
      label: "Organization systems directory",
      href: `/registry/ai-systems?org=${encodeURIComponent(row.ENTITY_NAME)}`,
      description:
        "Browse all certified AI systems associated with this organization.",
    },
    {
      label: "Dynamic certification badge",
      href: `/badge/${encodeURIComponent(registryId)}.svg`,
      description: "Live SVG badge that reflects the current certification state.",
    },
  ];

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
      <section className="pb-10 pt-2">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          Organization profile
        </div>

        <h1 className="mt-4 max-w-[980px] text-[40px] font-semibold leading-[1.15] text-black">
          {row.ENTITY_NAME}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={chipClass()}>{registryId}</span>
          <span className={chipClass()}>{row.DECISION_STATUS}</span>
          {row.CERTIFIED_TIER ? (
            <span className={chipClass()}>{row.CERTIFIED_TIER}</span>
          ) : null}
          {row.CERTIFIED_BAND ? (
            <span className={chipClass()}>{row.CERTIFIED_BAND}</span>
          ) : null}
        </div>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          This public organization profile summarizes the certified entity, its
          current GAFAIG registry record, and the AI systems disclosed under the
          associated certification.
        </p>
      </section>

      <section className="border-t border-black/10 pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Entity type
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {row.ENTITY_TYPE ?? "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Country
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {row.COUNTRY ?? "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Certified at
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {formatDate(row.CERTIFIED_AT)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Valid from
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {formatDate(row.VALID_FROM)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Valid to
            </div>
            <div className="mt-2 text-[15px] text-black/85">
              {formatDate(row.VALID_TO)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Application ID
            </div>
            <div className="mt-2 font-mono text-[13px] text-black/85">
              {row.APPLICATION_ID ?? "—"}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 border-t border-black/10 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-black">
              Certified AI systems
            </h2>
            <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
              AI systems currently disclosed under this organization’s GAFAIG
              certification.
            </p>
          </div>

          <Link
            href={`/registry/ai-systems?org=${encodeURIComponent(row.ENTITY_NAME)}`}
            className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            View in systems directory
          </Link>
        </div>

        {systems.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 p-5 text-[14px] text-black/70">
            No AI systems are currently disclosed for this organization.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {systems.map((system) => (
              <div
                key={system.SYSTEM_ID}
                className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.02]"
              >
                <div className="text-[18px] font-semibold text-black">
                  <Link
                    href={`/ai-systems/${encodeURIComponent(system.SYSTEM_ID)}`}
                    className="hover:underline"
                  >
                    {system.SYSTEM_NAME ?? "Unnamed AI system"}
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {system.SYSTEM_TYPE ? (
                    <span className={chipClass()}>{system.SYSTEM_TYPE}</span>
                  ) : null}
                  {system.DEPLOYMENT_STATUS ? (
                    <span className={chipClass()}>
                      {system.DEPLOYMENT_STATUS}
                    </span>
                  ) : null}
                  {system.OVERSIGHT_LEVEL ? (
                    <span className={chipClass()}>{system.OVERSIGHT_LEVEL}</span>
                  ) : null}
                  {system.RISK_TIER ? (
                    <span className={chipClass()}>{system.RISK_TIER}</span>
                  ) : null}
                </div>

                <div className="mt-4 text-[14px] leading-[1.7] text-black/75">
                  {system.PUBLIC_SUMMARY ??
                    system.INTENDED_USE ??
                    "No public summary available."}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <RegistryNavigationGraph items={navItems} />
    </main>
  );
}
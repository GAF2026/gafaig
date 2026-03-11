import Link from "next/link";
import { sfQueryResult } from "@/lib/snowflake";
import RegistryNavigationGraph from "@/components/registry/RegistryNavigationGraph";

export const dynamic = "force-dynamic";

type SystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string | null;
  ENTITY_NAME: string | null;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  INTENDED_USE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  PUBLIC_SUMMARY: string | null;
};

function chipClass() {
  return "inline-flex items-center rounded-full border border-black/15 bg-black/[0.04] px-2.5 py-1 text-[12px] font-semibold leading-none text-black";
}

export default async function AiSystemDetailPage({
  params,
}: {
  params: { systemId: string };
}) {
  const systemId = String(params.systemId || "").trim();

  const res = await sfQueryResult<SystemRow>(
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
      s.PUBLIC_SUMMARY
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
    LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
      ON s.REGISTRY_ID = r.REGISTRY_ID
    WHERE s.SYSTEM_ID = ?
    LIMIT 1
    `,
    [systemId]
  );

  const row = res.ok ? res.rows?.[0] ?? null : null;

  if (!row) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
        <section className="rounded-2xl border border-black/10 p-6">
          <div className="text-[16px] font-semibold text-black">AI system not found</div>
          <p className="mt-3 text-[15px] leading-[1.75] text-black/72">
            No public AI system record exists for{" "}
            <span className="font-mono text-black">{systemId || "(missing system ID)"}</span>.
          </p>
        </section>
      </main>
    );
  }

  const navItems = [
    row.REGISTRY_ID
      ? {
          label: "Certification record",
          href: `/registry/${encodeURIComponent(row.REGISTRY_ID)}`,
          description: "Open the public certification record associated with this AI system.",
        }
      : null,
    row.ENTITY_NAME && row.REGISTRY_ID
      ? {
          label: "Organization profile",
          href: `/organizations/${encodeURIComponent(row.REGISTRY_ID)}`,
          description: "Open the public organization profile for the certified entity.",
        }
      : null,
    row.ENTITY_NAME
      ? {
          label: "Organization systems directory",
          href: `/registry/ai-systems?org=${encodeURIComponent(row.ENTITY_NAME)}`,
          description: "Browse all certified AI systems operated by this organization.",
        }
      : null,
    {
      label: "Global systems directory",
      href: "/registry/ai-systems",
      description: "Browse the full GAFAIG global directory of certified AI systems.",
    },
  ].filter(Boolean) as Array<{ label: string; href: string; description: string }>;

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
      <section className="pt-2 pb-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          AI system profile
        </div>

        <h1 className="mt-4 max-w-[980px] text-[40px] font-semibold leading-[1.15] text-black">
          {row.SYSTEM_NAME ?? "Unnamed AI system"}
        </h1>

        {row.ENTITY_NAME ? (
          <p className="mt-4 text-[18px] leading-[1.75] text-black/80">
            Operated by{" "}
            {row.REGISTRY_ID ? (
              <Link
                href={`/organizations/${encodeURIComponent(row.REGISTRY_ID)}`}
                className="font-semibold underline underline-offset-2"
              >
                {row.ENTITY_NAME}
              </Link>
            ) : (
              <span className="font-semibold">{row.ENTITY_NAME}</span>
            )}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={chipClass()}>{row.SYSTEM_ID}</span>
          {row.SYSTEM_TYPE ? <span className={chipClass()}>{row.SYSTEM_TYPE}</span> : null}
          {row.DEPLOYMENT_STATUS ? <span className={chipClass()}>{row.DEPLOYMENT_STATUS}</span> : null}
          {row.OVERSIGHT_LEVEL ? <span className={chipClass()}>{row.OVERSIGHT_LEVEL}</span> : null}
          {row.RISK_TIER ? <span className={chipClass()}>{row.RISK_TIER}</span> : null}
        </div>
      </section>

      <section className="border-t border-black/10 pt-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Intended use
            </div>
            <div className="mt-3 text-[15px] leading-[1.8] text-black/80">
              {row.INTENDED_USE ?? "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Public summary
            </div>
            <div className="mt-3 text-[15px] leading-[1.8] text-black/80">
              {row.PUBLIC_SUMMARY ?? "—"}
            </div>
          </div>
        </div>
      </section>

      {row.REGISTRY_ID ? (
        <section className="mt-10 border-t border-black/10 pt-8">
          <h2 className="text-[16px] font-semibold text-black">Certification linkage</h2>
          <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
            This AI system is disclosed under a GAFAIG certification record. Open the record
            to review the associated public certification outcome.
          </p>

          <div className="mt-5">
            <Link
              href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              View certification record
            </Link>
          </div>
        </section>
      ) : null}

      <RegistryNavigationGraph items={navItems} />
    </main>
  );
}
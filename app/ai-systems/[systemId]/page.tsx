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

  DEVELOPER_ORGANIZATION: string | null;
  TRAINING_DATA_CATEGORY: string | null;
  OVERSIGHT_MODEL: string | null;
  HUMAN_REVIEW_REQUIRED: boolean | null;
  EVALUATION_PROTOCOL: string | null;
  AUDIT_FREQUENCY: string | null;

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
      s.DEVELOPER_ORGANIZATION,
      s.TRAINING_DATA_CATEGORY,
      s.OVERSIGHT_MODEL,
      s.HUMAN_REVIEW_REQUIRED,
      s.EVALUATION_PROTOCOL,
      s.AUDIT_FREQUENCY,
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
          <div className="text-[16px] font-semibold text-black">
            AI system not found
          </div>
          <p className="mt-3 text-[15px] text-black/70">
            No public AI system record exists for{" "}
            <span className="font-mono">{systemId}</span>.
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
          description:
            "Open the public certification record associated with this AI system.",
        }
      : null,
    row.REGISTRY_ID
      ? {
          label: "Organization profile",
          href: `/organizations/${encodeURIComponent(row.REGISTRY_ID)}`,
          description:
            "View the organization responsible for this certified system.",
        }
      : null,
    {
      label: "Global systems directory",
      href: "/registry/ai-systems",
      description:
        "Browse the GAFAIG global directory of certified AI systems.",
    },
  ].filter(Boolean) as Array<{ label: string; href: string; description: string }>;

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-14">
      <section className="pb-10 pt-2">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          AI system profile
        </div>

        <h1 className="mt-4 text-[40px] font-semibold text-black">
          {row.SYSTEM_NAME ?? "Unnamed AI system"}
        </h1>

        {row.ENTITY_NAME ? (
          <p className="mt-3 text-[18px] text-black/80">
            Operated by{" "}
            <Link
              href={`/organizations/${encodeURIComponent(row.REGISTRY_ID!)}`}
              className="font-semibold underline"
            >
              {row.ENTITY_NAME}
            </Link>
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={chipClass()}>{row.SYSTEM_ID}</span>
          {row.SYSTEM_TYPE && <span className={chipClass()}>{row.SYSTEM_TYPE}</span>}
          {row.DEPLOYMENT_STATUS && (
            <span className={chipClass()}>{row.DEPLOYMENT_STATUS}</span>
          )}
          {row.OVERSIGHT_LEVEL && (
            <span className={chipClass()}>{row.OVERSIGHT_LEVEL}</span>
          )}
          {row.RISK_TIER && <span className={chipClass()}>{row.RISK_TIER}</span>}
        </div>
      </section>

      <section className="border-t border-black/10 pt-8 grid gap-4 md:grid-cols-2">
        <Info label="Intended use" value={row.INTENDED_USE} />
        <Info label="Public summary" value={row.PUBLIC_SUMMARY} />
        <Info label="Developer organization" value={row.DEVELOPER_ORGANIZATION} />
        <Info label="Training data category" value={row.TRAINING_DATA_CATEGORY} />
        <Info label="Oversight model" value={row.OVERSIGHT_MODEL} />
        <Info
          label="Human review required"
          value={
            row.HUMAN_REVIEW_REQUIRED === null
              ? null
              : row.HUMAN_REVIEW_REQUIRED
              ? "Yes"
              : "No"
          }
        />
        <Info label="Evaluation protocol" value={row.EVALUATION_PROTOCOL} />
        <Info label="Audit frequency" value={row.AUDIT_FREQUENCY} />
      </section>

      <RegistryNavigationGraph items={navItems} />
    </main>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[12px] uppercase tracking-[0.16em] text-black/60">
        {label}
      </div>
      <div className="mt-2 text-[15px] text-black/80">{value ?? "—"}</div>
    </div>
  );
}
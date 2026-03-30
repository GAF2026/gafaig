import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

/* ================= TYPES ================= */

type RegistryRecord = {
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

type PublicSystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string;
  CASE_ID: string | null;
  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  DEVELOPER_ORGANIZATION: string | null;
  PUBLIC_SUMMARY: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
};

/* ================= HELPERS ================= */

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${Math.round(value)} / 100`;
}

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

/* ================= PAGE ================= */

export default async function RegistryDetailPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = decodeURIComponent(params.registryId || "").trim();

  if (!registryId) notFound();

  const [records, systems] = await Promise.all([
    sfQuery<RegistryRecord>(
      `
      SELECT *
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE REGISTRY_ID = ?
      LIMIT 1
      `,
      [registryId]
    ),
    sfQuery<PublicSystemRow>(
      `
      SELECT *
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE REGISTRY_ID = ?
      ORDER BY SYSTEM_NAME ASC
      `,
      [registryId]
    ),
  ]);

  const record = records[0];
  if (!record) notFound();

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">

      {/* ================= HEADER ================= */}

      <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] uppercase tracking-[0.22em] text-black/60">
          Registry Record
        </div>

        <h1 className="mt-4 text-[36px] font-semibold">
          {record.ENTITY_NAME || "Unnamed Entity"}
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <InfoSmall label="Registry ID" value={record.REGISTRY_ID} mono />
          <InfoSmall label="Country" value={record.COUNTRY || "—"} />
          <InfoSmall label="Tier / Band" value={tierBandLabel(record.CERTIFIED_TIER, record.CERTIFIED_BAND)} />
          <InfoSmall label="Score" value={formatScore(record.CERTIFIED_SCORE)} />
        </div>
      </section>

      {/* ================= SYSTEMS ================= */}

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] uppercase tracking-[0.22em] text-black/60">
          AI SYSTEMS
        </div>

        <h2 className="mt-4 text-[30px] font-semibold">
          Systems under this certification
        </h2>

        {systems.length === 0 ? (
          <div className="mt-6 text-sm text-black/70">
            No public AI systems available.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {systems.map((system) => (
              <Link
                key={system.SYSTEM_ID}
                href={`/registry/ai-systems/${system.SYSTEM_ID}`}
                className="block rounded-2xl border border-black/10 p-5 hover:bg-black/[0.02]"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="text-xl font-semibold">
                      {system.SYSTEM_NAME}
                    </div>

                    <div className="mt-2 text-sm text-black/60">
                      {system.SYSTEM_TYPE} · {system.DEPLOYMENT_STATUS}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs uppercase text-black/50">
                      Score
                    </div>
                    <div className="text-lg font-semibold">
                      {formatScore(system.CERTIFIED_SCORE)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <InfoSmall label="System ID" value={system.SYSTEM_ID} mono />
                  <InfoSmall label="Risk Tier" value={system.RISK_TIER || "—"} />
                  <InfoSmall
                    label="Tier / Band"
                    value={tierBandLabel(
                      system.CERTIFIED_TIER,
                      system.CERTIFIED_BAND
                    )}
                  />
                  <InfoSmall
                    label="Developer"
                    value={system.DEVELOPER_ORGANIZATION || "—"}
                  />
                </div>

                {system.PUBLIC_SUMMARY && (
                  <p className="mt-4 text-sm text-black/70">
                    {system.PUBLIC_SUMMARY}
                  </p>
                )}

                <div className="mt-4 text-sm font-semibold underline">
                  View system →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ================= COMPONENT ================= */

function InfoSmall({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/10 px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>

      <div
        className={[
          "mt-3 text-[15px] text-black",
          mono ? "font-mono text-[13px] break-all" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}
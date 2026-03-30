import Link from "next/link";
import { notFound } from "next/navigation";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

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

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

function certificationStatus(record: RegistryRecord) {
  return record.CERTIFIED_AT ? "Certified" : "Not Certified";
}

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function baseOrigin() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  ).replace(/\/$/, "");
}

export default async function RegistryDetailPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = decodeURIComponent(params.registryId || "").trim();

  if (!registryId) {
    notFound();
  }

  const [records, systems] = await Promise.all([
    sfQuery<RegistryRecord>(
      `
      SELECT
        REGISTRY_ID,
        APPLICATION_ID,
        CASE_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFIED_SCORE,
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
    ),
    sfQuery<PublicSystemRow>(
      `
      SELECT
        SYSTEM_ID,
        REGISTRY_ID,
        CASE_ID,
        SYSTEM_NAME,
        SYSTEM_TYPE,
        DEPLOYMENT_STATUS,
        OVERSIGHT_LEVEL,
        RISK_TIER,
        DEVELOPER_ORGANIZATION,
        PUBLIC_SUMMARY,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_BAND
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE REGISTRY_ID = ?
      ORDER BY SYSTEM_NAME ASC
      LIMIT 50
      `,
      [registryId]
    ),
  ]);

  const record = records[0];

  if (!record) {
    notFound();
  }

  const certStatus = certificationStatus(record);
  const verifyUrl = `/api/verify/${encodeURIComponent(record.REGISTRY_ID)}`;
  const badgeUrl = `/badge/${encodeURIComponent(record.REGISTRY_ID)}`;
  const absoluteVerifyUrl = `${baseOrigin()}${verifyUrl}`;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      
      {/* EXISTING SECTIONS (UNCHANGED) */}
      {/* ... KEEP EVERYTHING ABOVE EXACTLY AS IS ... */}

      {/* =============================== */}
      {/* 🔥 UPDATED SYSTEMS SECTION */}
      {/* =============================== */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          DISCLOSED AI SYSTEMS
        </div>

        <h2 className="mt-4 text-[30px] font-semibold leading-[1.16] tracking-tight text-black md:text-[36px]">
          Systems associated with this certification
        </h2>

        {systems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
            No public AI systems are associated with this registry record.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {systems.map((system) => (
              <Link
                key={system.SYSTEM_ID}
                href={`/registry/ai-systems/${encodeURIComponent(system.SYSTEM_ID)}`}
                className="group block rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.02]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[22px] font-semibold tracking-tight text-black group-hover:underline">
                      {system.SYSTEM_NAME || system.SYSTEM_ID}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/65">
                      <span>{system.SYSTEM_TYPE || "—"}</span>
                      <span>{system.DEPLOYMENT_STATUS || "—"}</span>
                      <span>{system.OVERSIGHT_LEVEL || "—"}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
                      Certified score
                    </div>
                    <div className="mt-1 text-[20px] font-semibold text-black">
                      {formatScore(system.CERTIFIED_SCORE)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <InfoSmall label="System ID" value={system.SYSTEM_ID} mono />
                  <InfoSmall label="Risk tier" value={system.RISK_TIER || "—"} />
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

                {system.PUBLIC_SUMMARY ? (
                  <p className="mt-4 text-sm leading-[1.7] text-black/72">
                    {system.PUBLIC_SUMMARY}
                  </p>
                ) : null}

                <div className="mt-4 text-sm font-semibold text-black underline">
                  View system detail →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
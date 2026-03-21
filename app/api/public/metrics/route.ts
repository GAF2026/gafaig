import { NextResponse } from "next/server";
import { snowflakeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MetricsRow = {
  CERTIFIED_ORGANIZATIONS: number | string | null;
  DISCLOSED_AI_SYSTEMS: number | string | null;
  COUNTRIES_REPRESENTED: number | string | null;
};

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function GET() {
  try {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC) AS CERTIFIED_ORGANIZATIONS,
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC) AS DISCLOSED_AI_SYSTEMS,
        (
          SELECT COUNT(DISTINCT COUNTRY)
          FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
          WHERE COUNTRY IS NOT NULL
            AND TRIM(COUNTRY) <> ''
        ) AS COUNTRIES_REPRESENTED
    `;

    const rows = await snowflakeQuery<MetricsRow>(sql);
    const row = rows[0];

    return NextResponse.json(
      {
        ok: true,
        metrics: {
          certifiedOrganizations: toNumber(row?.CERTIFIED_ORGANIZATIONS),
          disclosedAiSystems: toNumber(row?.DISCLOSED_AI_SYSTEMS),
          countriesRepresented: toNumber(row?.COUNTRIES_REPRESENTED),
        },
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Metrics query failed",
      },
      { status: 500 }
    );
  }
}
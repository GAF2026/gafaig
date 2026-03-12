import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MetricRow = {
  CERTIFIED_ORGANIZATIONS: number | null;
  DISCLOSED_AI_SYSTEMS: number | null;
  COUNTRIES_REPRESENTED: number | null;
  VERIFIED_PARTICIPANTS: number | null;
};

function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.rows)) return result.rows;
  return [];
}

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET() {
  try {
    const sql = `
      SELECT
        (
          SELECT COUNT(*)
          FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
          WHERE UPPER(COALESCE(DECISION_STATUS, '')) = 'APPROVED'
        ) AS CERTIFIED_ORGANIZATIONS,

        (
          SELECT COUNT(*)
          FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
        ) AS DISCLOSED_AI_SYSTEMS,

        (
          SELECT COUNT(DISTINCT COUNTRY)
          FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
          WHERE TRIM(COALESCE(COUNTRY, '')) <> ''
        ) AS COUNTRIES_REPRESENTED,

        (
          SELECT COUNT(*)
          FROM GAFAIG_DB.CORE.PARTICIPANTS
          WHERE LOWER(COALESCE(VERIFICATION_STATUS, '')) = 'verified'
        ) AS VERIFIED_PARTICIPANTS
    `;

    const result = await executeQuery(sql);
    const rows = normalizeRows<MetricRow>(result);
    const row = rows[0];

    return NextResponse.json({
      ok: true,
      metrics: {
        certifiedOrganizations: toNumber(row?.CERTIFIED_ORGANIZATIONS),
        disclosedAiSystems: toNumber(row?.DISCLOSED_AI_SYSTEMS),
        countriesRepresented: toNumber(row?.COUNTRIES_REPRESENTED),
        verifiedParticipants: toNumber(row?.VERIFIED_PARTICIPANTS),
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || "Failed to load public metrics",
      },
      { status: 500 }
    );
  }
}
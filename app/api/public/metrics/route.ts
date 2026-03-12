import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = {
  CERTIFIED_ORGANIZATIONS: number;
  DISCLOSED_AI_SYSTEMS: number;
  COUNTRIES_REPRESENTED: number;
  VERIFIED_PARTICIPANTS: number;
};

function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.rows)) return result.rows;
  return [];
}

function toNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function GET() {
  try {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC) AS CERTIFIED_ORGANIZATIONS,
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC) AS DISCLOSED_AI_SYSTEMS,
        (SELECT COUNT(DISTINCT COUNTRY) FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC WHERE COUNTRY IS NOT NULL) AS COUNTRIES_REPRESENTED,
        (SELECT COUNT(*) FROM GAFAIG_DB.CORE.PARTICIPANTS WHERE LOWER(VERIFICATION_STATUS) = 'verified') AS VERIFIED_PARTICIPANTS
    `;

    const result = await executeQuery(sql);
    const rows = normalizeRows<Row>(result);
    const r = rows[0];

    return NextResponse.json({
      ok: true,
      metrics: {
        certifiedOrganizations: toNumber(r?.CERTIFIED_ORGANIZATIONS),
        disclosedAiSystems: toNumber(r?.DISCLOSED_AI_SYSTEMS),
        countriesRepresented: toNumber(r?.COUNTRIES_REPRESENTED),
        verifiedParticipants: toNumber(r?.VERIFIED_PARTICIPANTS),
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Metrics query failed" },
      { status: 500 }
    );
  }
}
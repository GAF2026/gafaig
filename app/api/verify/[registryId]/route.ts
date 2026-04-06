import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { registryId: string } }
) {
  const registryId = String(params.registryId || "").trim().toUpperCase();

  try {
    const rows = await sfQuery(
      `
      SELECT *
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE REGISTRY_ID = ?
      LIMIT 1
      `,
      [registryId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        ok: false,
        verified: false,
        error: "Registry record not found",
      });
    }

    const r = rows[0];

    // ✅ NULL SAFE MAPPING
    const certifiedScore =
      r.CERTIFIED_SCORE !== null && r.CERTIFIED_SCORE !== undefined
        ? Number(r.CERTIFIED_SCORE)
        : null;

    const certifiedTier = r.CERTIFIED_TIER || null;
    const certifiedBand = r.CERTIFIED_BAND || null;
    const decisionStatus = r.DECISION_STATUS || null;

    return NextResponse.json({
      ok: true,
      verified: decisionStatus === "APPROVED",

      registryId: r.REGISTRY_ID,
      entityName: r.ENTITY_NAME,

      certification: {
        score: certifiedScore,
        tier: certifiedTier,
        band: certifiedBand,
        status: decisionStatus,
        certifiedAt: r.CERTIFIED_AT || null,
      },

      meta: {
        source: "V_REGISTRY_PUBLIC",
      },
    });
  } catch (err: any) {
    console.error("VERIFY API ERROR:", err);

    return NextResponse.json({
      ok: false,
      verified: false,
      error: "Internal verification error",
      details: String(err?.message || err),
    });
  }
}
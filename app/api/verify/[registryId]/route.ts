import { NextRequest, NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

/**
 * CORS headers — allow ANY site to verify GAFAIG records
 */
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
  };
}

/**
 * Handle preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

/**
 * Main verification endpoint
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { registryId: string } }
) {
  try {
    const registryId = String(params.registryId || "").trim().toUpperCase();

    if (!registryId) {
      return NextResponse.json(
        {
          ok: false,
          verified: false,
          error: "Missing registryId",
        },
        {
          status: 400,
          headers: corsHeaders(),
        }
      );
    }

    /**
     * Pull from canonical public registry view
     * (DO NOT change source of truth)
     */
    const rows = await sfQuery(
      `
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        APPLICATION_ID,
        CASE_ID,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        DECISION_STATUS,
        CERTIFIED_AT,
        VALID_FROM,
        VALID_TO
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE REGISTRY_ID = ?
      LIMIT 1
      `,
      [registryId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          ok: true,
          verified: false,
        },
        {
          headers: corsHeaders(),
        }
      );
    }

    const r = rows[0];

    /**
     * Canonical response contract
     */
    const record = {
      registryId: r.REGISTRY_ID,
      entityName: r.ENTITY_NAME,
      entityType: r.ENTITY_TYPE,
      country: r.COUNTRY,
      applicationId: r.APPLICATION_ID,
      caseId: r.CASE_ID,
      certifiedScore: r.CERTIFIED_SCORE,
      certifiedTier: r.CERTIFIED_TIER,
      certifiedBand: r.CERTIFIED_BAND,
      decisionStatus: r.DECISION_STATUS,
      certifiedAt: r.CERTIFIED_AT,
      validFrom: r.VALID_FROM,
      validTo: r.VALID_TO,
    };

    return NextResponse.json(
      {
        ok: true,
        verified: true,
        record,
      },
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error("VERIFY API ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        verified: false,
        error: "Internal verification error",
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
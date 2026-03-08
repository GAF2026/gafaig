import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

/**
 * GET
 * List AI systems attached to a case
 */
export async function GET(
  req: Request,
  ctx: { params: { caseId: string } }
) {
  try {
    const caseId = ctx.params.caseId;

    const rows = await sfQuery<any>(
      `
      SELECT
        SYSTEM_ID,
        REGISTRY_ID,
        CASE_ID,
        SYSTEM_NAME,
        SYSTEM_TYPE,
        INTENDED_USE,
        DEPLOYMENT_STATUS,
        OVERSIGHT_LEVEL,
        RISK_TIER,
        PUBLIC_SUMMARY,
        IS_PUBLIC,
        DISPLAY_ORDER,
        CREATED_AT,
        UPDATED_AT
      FROM CORE.REGISTRY_AI_SYSTEMS
      WHERE CASE_ID = ?
      ORDER BY DISPLAY_ORDER ASC
      `,
      [caseId]
    );

    return NextResponse.json({
      ok: true,
      rows,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to load AI systems" },
      { status: 500 }
    );
  }
}

/**
 * POST
 * Create a new AI system
 */
export async function POST(
  req: Request,
  ctx: { params: { caseId: string } }
) {
  try {
    const caseId = ctx.params.caseId;
    const body = await req.json();

    const {
      registryId,
      systemName,
      systemType,
      intendedUse,
      deploymentStatus,
      oversightLevel,
      riskTier,
      publicSummary,
    } = body;

    const systemId =
      "SYS-" + Date.now() + "-" + Math.random().toString(16).slice(2, 8);

    await sfQuery(
      `
      INSERT INTO CORE.REGISTRY_AI_SYSTEMS (
        SYSTEM_ID,
        REGISTRY_ID,
        CASE_ID,
        SYSTEM_NAME,
        SYSTEM_TYPE,
        INTENDED_USE,
        DEPLOYMENT_STATUS,
        OVERSIGHT_LEVEL,
        RISK_TIER,
        PUBLIC_SUMMARY,
        IS_PUBLIC,
        DISPLAY_ORDER
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, 100
      )
      `,
      [
        systemId,
        registryId || null,
        caseId,
        systemName,
        systemType,
        intendedUse,
        deploymentStatus,
        oversightLevel,
        riskTier,
        publicSummary,
      ]
    );

    return NextResponse.json({
      ok: true,
      systemId,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to create AI system" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: { registryId: string } }
) {
  try {
    const registryId = (ctx?.params?.registryId || "").trim();

    if (!registryId) {
      return NextResponse.json(
        { ok: false, error: "Missing registryId" },
        { status: 400 }
      );
    }

    const rows = await sfQuery<any>(
      `
      SELECT
        SYSTEM_ID,
        REGISTRY_ID,
        SYSTEM_NAME,
        SYSTEM_TYPE,
        INTENDED_USE,
        DEPLOYMENT_STATUS,
        OVERSIGHT_LEVEL,
        RISK_TIER,
        PUBLIC_SUMMARY,
        DISPLAY_ORDER
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE REGISTRY_ID = ?
      ORDER BY DISPLAY_ORDER ASC, SYSTEM_NAME ASC
      `,
      [registryId]
    );

    return NextResponse.json({
      ok: true,
      rows: Array.isArray(rows) ? rows : [],
      total: Array.isArray(rows) ? rows.length : 0,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to load registry AI systems." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { registryId: string } }
) {
  const registryIdRaw = String(params.registryId || "").trim();

  try {
    const rows = await sfQuery(
      `
      SELECT *
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE UPPER(REGISTRY_ID) = UPPER(?)
      LIMIT 1
      `,
      [registryIdRaw]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        ok: false,
        verified: false,
        error: "Registry record not found",
      });
    }

    const r = rows[0];

    return NextResponse.json({
      ok: true,
      verified: r.DECISION_STATUS === "APPROVED",

      registryId: r.REGISTRY_ID,
      entityName: r.ENTITY_NAME,

      certification: {
        score:
          r.CERTIFIED_SCORE !== null ? Number(r.CERTIFIED_SCORE) : null,
        tier: r.CERTIFIED_TIER || null,
        band: r.CERTIFIED_BAND || null,
        status: r.DECISION_STATUS || null,
        certifiedAt: r.CERTIFIED_AT || null,
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
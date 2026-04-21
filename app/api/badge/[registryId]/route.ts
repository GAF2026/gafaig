import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: Request,
  context: { params: { registryId: string } }
) {
  try {
    const registryId = String(context.params.registryId ?? "").trim();

    if (!registryId) {
      return NextResponse.json(
        { ok: false, error: "Missing registryId" },
        { status: 400 }
      );
    }

    const rows = await sfQuery<any>(`
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        CERTIFICATION_STATUS,
        CERTIFIED_AT
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM('${registryId.replace(/'/g, "''")}'))
      LIMIT 1
    `);

    if (!rows.length) {
      return NextResponse.json(
        { ok: false, error: "Registry record not found" },
        { status: 404 }
      );
    }

    const r = rows[0];

    const isCertified = r.CERTIFICATION_STATUS === "CERTIFIED";

    const badge = {
      status: isCertified ? "CERTIFIED" : "NOT_CERTIFIED",
      label: isCertified ? "GAFAIG Certified" : "Not Certified",
      imageUrl: isCertified
        ? "/badges/gafaig-certified.svg"
        : "/badges/gafaig-not-certified.svg",
    };

    return NextResponse.json({
      ok: true,
      registryId: r.REGISTRY_ID,
      entityName: r.ENTITY_NAME,
      certificationStatus: r.CERTIFICATION_STATUS,
      certifiedAt: r.CERTIFIED_AT,
      badge,
      verifyUrl: `/verify/${r.REGISTRY_ID}`,
      registryUrl: `/registry/${r.REGISTRY_ID}`,
      widgetUrl: `/widget-preview/${r.REGISTRY_ID}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Badge endpoint failed",
      },
      { status: 500 }
    );
  }
}
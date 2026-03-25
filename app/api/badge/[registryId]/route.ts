import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { registryId: string } }
) {
  try {
    const registryId = String(params.registryId || "").trim();

    const rows = await executeQuery<{
      CERTIFIED_TIER: string;
      CERTIFICATION_STATUS: string;
    }>(
      `
      SELECT
        CERTIFIED_TIER,
        CERTIFICATION_STATUS
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE REGISTRY_ID = ?
      LIMIT 1
      `,
      [registryId]
    );

    if (!rows || rows.length === 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    const row = rows[0];

    const tier = (row.CERTIFIED_TIER || "").toLowerCase();
    const status = (row.CERTIFICATION_STATUS || "").toLowerCase();

    if (status !== "certified" || !tier) {
      return new NextResponse("No badge available", { status: 404 });
    }

    let imagePath = "";

    if (tier.includes("tier 1")) {
      imagePath = "/images/gafaig-badge-tier-1.png";
    } else if (tier.includes("tier 2")) {
      imagePath = "/images/gafaig-badge-tier-2.png";
    } else if (tier.includes("tier 3")) {
      imagePath = "/images/gafaig-badge-tier-3.png";
    } else {
      return new NextResponse("Invalid tier", { status: 400 });
    }

    return NextResponse.redirect(new URL(imagePath, req.url));
  } catch (err) {
    console.error("Badge route error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
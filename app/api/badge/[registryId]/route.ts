import { NextResponse } from "next/server";
import { getRegistryByRegistryId } from "@/lib/queries/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBadgeTier(tier: string | null) {
  if (!tier) return "default";
  if (tier.toLowerCase().includes("certified")) return "certified";
  return "default";
}

export async function GET(
  _req: Request,
  { params }: { params: { registryId: string } }
) {
  try {
    const record = await getRegistryByRegistryId(params.registryId);

    if (!record) {
      return NextResponse.json(
        { ok: false, error: "Registry not found" },
        { status: 404 }
      );
    }

    const tier = getBadgeTier(record.certifiedTier);

    return NextResponse.json({
      ok: true,

      // identity
      registryId: record.registryId,
      entityName: record.entityName,

      // certification
      certifiedTier: record.certifiedTier,
      certifiedBand: record.certifiedBand,
      certifiedAt: record.certifiedAt,

      // trust signal
      badge: {
        tier,
        label: `${record.certifiedTier ?? "Unverified"} ${
          record.certifiedBand ? `· Band ${record.certifiedBand}` : ""
        }`,
        imageUrl:
          tier === "certified"
            ? "/images/gafaig-badge-tier-1.png"
            : "/images/gafaig-badge-default.png",
      },

      // verification link
      verifyUrl: `/verify/${record.registryId}`,
      registryUrl: `/registry/${record.registryId}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Badge endpoint failed.",
      },
      { status: 500 }
    );
  }
}
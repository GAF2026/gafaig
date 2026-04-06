import { NextResponse } from "next/server";
import { getRegistryByRegistryId } from "@/lib/queries/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function pickBadgePath(params: {
  certifiedTier: string | null;
  certifiedBand: string | null;
}) {
  const tier = (params.certifiedTier || "").toLowerCase();

  if (tier.includes("certified")) {
    return "/images/gafaig-badge-tier-1.png";
  }

  return "/images/gafaig-badge-default.png";
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

    const badgePath = pickBadgePath({
      certifiedTier: record.certifiedTier,
      certifiedBand: record.certifiedBand,
    });

    return NextResponse.json({
      ok: true,
      registryId: record.registryId,
      badgeImageUrl: badgePath,
      certifiedTier: record.certifiedTier,
      certifiedBand: record.certifiedBand,
      certifiedAt: record.certifiedAt,
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
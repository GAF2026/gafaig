import { NextResponse } from "next/server";
import { getRegistryByRegistryId } from "@/lib/queries/registry";
import type { BadgeApiResponse } from "@/types/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getBadgeTier(tier: string | null) {
  if (!tier) return "default";
  if (tier.toLowerCase().includes("certified")) return "certified";
  return "default";
}

function absoluteUrl(path: string) {
  return `https://www.gafaig.com${path}`;
}

export async function GET(
  _req: Request,
  { params }: { params: { registryId: string } }
) {
  try {
    const record = await getRegistryByRegistryId(params.registryId);

    if (!record) {
      const response: BadgeApiResponse = {
        ok: false,
        error: "Registry not found",
      };

      return NextResponse.json(response, { status: 404 });
    }

    const tier = getBadgeTier(record.certifiedTier);

    const imageUrl =
      tier === "certified"
        ? "/images/gafaig-badge-tier-1.png"
        : "/images/gafaig-badge-default.png";

    const verifyUrl = `/verify/${record.registryId}`;
    const registryUrl = `/registry/${record.registryId}`;
    const widgetUrl = `/widget-preview/${record.registryId}`;

    const linkedImageHtml = `<a href="${absoluteUrl(
      verifyUrl
    )}" target="_blank" rel="noopener noreferrer"><img src="${absoluteUrl(
      imageUrl
    )}" alt="GAFAIG certification badge for ${record.entityName ?? record.registryId}" style="height:64px;width:auto" /></a>`;

    const imageHtml = `<img src="${absoluteUrl(
      imageUrl
    )}" alt="GAFAIG certification badge for ${
      record.entityName ?? record.registryId
    }" style="height:64px;width:auto" />`;

    const iframeHtml = `<iframe src="${absoluteUrl(
      widgetUrl
    )}" title="GAFAIG trust widget for ${
      record.entityName ?? record.registryId
    }" width="420" height="220" style="border:0;border-radius:16px;overflow:hidden" loading="lazy"></iframe>`;

    const response: BadgeApiResponse = {
      ok: true,

      registryId: record.registryId,
      entityName: record.entityName,

      certifiedTier: record.certifiedTier,
      certifiedBand: record.certifiedBand,
      certifiedAt: record.certifiedAt,

      badge: {
        tier,
        label: `${record.certifiedTier ?? "Unverified"}${
          record.certifiedBand ? ` · Band ${record.certifiedBand}` : ""
        }`,
        imageUrl,
      },

      verifyUrl,
      registryUrl,
      widgetUrl,

      embed: {
        imageHtml,
        linkedImageHtml,
        iframeHtml,
      },
    };

    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const response: BadgeApiResponse = {
      ok: false,
      error: error instanceof Error ? error.message : "Badge endpoint failed.",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
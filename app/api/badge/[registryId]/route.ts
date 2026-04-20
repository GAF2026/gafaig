import { NextResponse } from "next/server";
import { getRegistryByRegistryId } from "@/lib/queries/registry";
import type { BadgeApiResponse } from "@/types/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  };
}

function absoluteUrl(path: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() || "https://www.gafaig.com";
  return `${baseUrl.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

function getBadgeTier(certifiedTier: string | null) {
  const value = String(certifiedTier ?? "").trim().toLowerCase();
  if (!value) return "default";
  if (value.includes("enterprise")) return "certified";
  if (value.includes("certified")) return "certified";
  return "default";
}

function getBadgeImagePath(tier: string) {
  return tier === "certified"
    ? "/images/gafaig-badge-tier-1.png"
    : "/images/gafaig-badge-default.png";
}

function getBadgeLabel(
  certifiedTier: string | null,
  certifiedBand: string | null,
  certificationStatus: string | null
) {
  const tier = String(certifiedTier ?? "").trim();
  const band = String(certifiedBand ?? "").trim();
  const status = String(certificationStatus ?? "").trim();

  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  if (status) return status;
  return "Certified";
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function GET(
  _req: Request,
  { params }: { params: { registryId: string } }
) {
  try {
    const registryId = String(params.registryId ?? "").trim();

    if (!registryId) {
      const response: BadgeApiResponse = {
        ok: false,
        error: "Missing registryId",
      };

      return NextResponse.json(response, {
        status: 400,
        headers: getCorsHeaders(),
      });
    }

    const record = await getRegistryByRegistryId(registryId);

    if (!record) {
      const response: BadgeApiResponse = {
        ok: false,
        error: "Registry not found",
      };

      return NextResponse.json(response, {
        status: 404,
        headers: getCorsHeaders(),
      });
    }

    const certificationStatus = String(record.certificationStatus ?? "").trim();
    if (certificationStatus.toLowerCase() !== "certified") {
      const response: BadgeApiResponse = {
        ok: false,
        error: "Badge is available only for certified public trust records",
      };

      return NextResponse.json(response, {
        status: 409,
        headers: getCorsHeaders(),
      });
    }

    const tier = getBadgeTier(record.certifiedTier);
    const imageUrl = getBadgeImagePath(tier);

    const verifyUrl = `/api/verify/${record.registryId}`;
    const registryUrl = `/registry/${record.registryId}`;
    const widgetUrl = `/widget-preview/${record.registryId}`;

    const altText = `GAFAIG certification badge for ${record.entityName ?? record.registryId}`;

    const linkedImageHtml = `<a href="${absoluteUrl(
      registryUrl
    )}" target="_blank" rel="noopener noreferrer"><img src="${absoluteUrl(
      imageUrl
    )}" alt="${altText}" style="height:64px;width:auto" /></a>`;

    const imageHtml = `<img src="${absoluteUrl(
      imageUrl
    )}" alt="${altText}" style="height:64px;width:auto" />`;

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
        label: getBadgeLabel(
          record.certifiedTier,
          record.certifiedBand,
          record.certificationStatus ?? null
        ),
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
      status: 200,
      headers: getCorsHeaders(),
    });
  } catch (error) {
    const response: BadgeApiResponse = {
      ok: false,
      error: error instanceof Error ? error.message : "Badge endpoint failed.",
    };

    return NextResponse.json(response, {
      status: 500,
      headers: getCorsHeaders(),
    });
  }
}
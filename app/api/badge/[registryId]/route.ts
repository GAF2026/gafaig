import { NextResponse } from "next/server";
import { getRegistryByRegistryId } from "@/lib/queries/registry";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalize(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function pickBadgePath(input: {
  certifiedAt?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
}) {
  const isCertified = Boolean(String(input.certifiedAt || "").trim());
  const certifiedTier = normalize(input.certifiedTier);
  const certifiedBand = normalize(input.certifiedBand);

  if (!isCertified) {
    return "/images/gafaig-badge-tier-3.png";
  }

  if (
    certifiedTier === "tier 1" ||
    certifiedTier === "1" ||
    certifiedTier === "tier-1"
  ) {
    return "/images/gafaig-badge-tier-1.png";
  }

  if (
    certifiedTier === "tier 2" ||
    certifiedTier === "2" ||
    certifiedTier === "tier-2"
  ) {
    return "/images/gafaig-badge-tier-2.png";
  }

  if (
    certifiedTier === "tier 3" ||
    certifiedTier === "3" ||
    certifiedTier === "tier-3"
  ) {
    return "/images/gafaig-badge-tier-3.png";
  }

  if (certifiedBand === "a") return "/images/gafaig-badge-tier-1.png";
  if (certifiedBand === "b") return "/images/gafaig-badge-tier-2.png";
  if (certifiedBand === "c" || certifiedBand === "d") {
    return "/images/gafaig-badge-tier-3.png";
  }

  return "/images/gafaig-badge-tier-3.png";
}

export async function GET(
  request: Request,
  context: { params: Promise<{ registryId: string }> | { registryId: string } }
) {
  const params = await Promise.resolve(context.params);
  const registryId = decodeURIComponent(String(params.registryId || "")).trim();

  if (!registryId) {
    return new NextResponse("Missing registryId", { status: 400 });
  }

  const row = await getRegistryByRegistryId(registryId);

  if (!row) {
    return new NextResponse("Registry record not found", { status: 404 });
  }

  const badgePath =
    row.badgeImageUrl && row.badgeImageUrl.trim() !== ""
      ? row.badgeImageUrl.trim()
      : pickBadgePath({
          certifiedAt: row.certifiedAt,
          certifiedTier: row.certifiedTier,
          certifiedBand: row.certifiedBand,
        });

  return NextResponse.redirect(new URL(badgePath, request.url), 307);
}
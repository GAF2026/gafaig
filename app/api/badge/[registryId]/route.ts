import { NextResponse } from "next/server";
import { getRegistryByRegistryId } from "@/lib/queries/registry";

function normalize(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function pickBadgePath(input: {
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  certifiedScore?: number | null;
  certificationStatus?: string | null;
}) {
  const certificationStatus = normalize(input.certificationStatus);
  const certifiedTier = normalize(input.certifiedTier);
  const certifiedBand = normalize(input.certifiedBand);
  const score =
    typeof input.certifiedScore === "number" ? input.certifiedScore : null;

  if (!certificationStatus.includes("certified")) {
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

  if (score !== null) {
    if (score >= 90) return "/images/gafaig-badge-tier-1.png";
    if (score >= 80) return "/images/gafaig-badge-tier-2.png";
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
          certifiedTier: row.certifiedTier ?? row.tier,
          certifiedBand: row.certifiedBand ?? row.band,
          certifiedScore: row.certifiedScore ?? row.score,
          certificationStatus: row.certificationStatus ?? row.decisionStatus,
        });

  return NextResponse.redirect(new URL(badgePath, request.url), 307);
}
// app/badge/[registryId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type VerifyApiResponse =
  | {
      ok: true;
      registryId: string;
      verified: boolean;
      record?: {
        registryId: string;
        entityName: string;
        certifiedTier: string | null;
        certifiedBand: string | null;
        decisionStatus: string;
        validTo: string | null;
      };
    }
  | {
      ok: false;
      error: string;
    };

function escapeXml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizeRegistryId(raw: string) {
  return String(raw || "")
    .trim()
    .replace(/\.svg$/i, "")
    .toUpperCase();
}

function badgeSvg(params: {
  registryId: string;
  label: string;
  status: string;
  tier: string;
  band: string;
}) {
  const registryId = escapeXml(params.registryId);
  const label = escapeXml(params.label);
  const status = escapeXml(params.status);
  const tier = escapeXml(params.tier);
  const band = escapeXml(params.band);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="520" height="120" viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GAFAIG certification badge">
  <rect x="1" y="1" width="518" height="118" rx="18" fill="white" stroke="rgba(0,0,0,0.12)" stroke-width="2"/>
  <rect x="20" y="20" width="112" height="80" rx="14" fill="#0B57D0"/>
  <text x="76" y="48" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="white">GAFAIG</text>
  <text x="76" y="72" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" fill="white">VERIFIED</text>
  <circle cx="108" cy="38" r="8" fill="#8BE28B"/>
  <path d="M104 38.5L107 41.5L112.5 35.5" stroke="#114411" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

  <text x="152" y="36" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.8" fill="rgba(0,0,0,0.55)">CERTIFICATION STATUS</text>
  <text x="152" y="58" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" fill="#111111">${status}</text>

  <text x="152" y="82" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="rgba(0,0,0,0.72)">${label}</text>
  <text x="152" y="102" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="500" fill="rgba(0,0,0,0.6)">Registry ID ${registryId}</text>

  <rect x="406" y="22" width="92" height="30" rx="15" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)"/>
  <text x="452" y="41" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="700" fill="#111111">${tier}</text>

  <rect x="406" y="64" width="92" height="30" rx="15" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)"/>
  <text x="452" y="83" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="700" fill="#111111">${band}</text>
</svg>`;
}

function invalidBadgeSvg(registryId: string) {
  const id = escapeXml(registryId);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="520" height="120" viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GAFAIG badge unavailable">
  <rect x="1" y="1" width="518" height="118" rx="18" fill="white" stroke="rgba(0,0,0,0.12)" stroke-width="2"/>
  <rect x="20" y="20" width="112" height="80" rx="14" fill="#555555"/>
  <text x="76" y="48" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="white">GAFAIG</text>
  <text x="76" y="72" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" fill="white">UNAVAILABLE</text>

  <text x="152" y="36" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.8" fill="rgba(0,0,0,0.55)">CERTIFICATION STATUS</text>
  <text x="152" y="58" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" fill="#111111">Unavailable</text>
  <text x="152" y="82" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="rgba(0,0,0,0.72)">Unable to confirm certification</text>
  <text x="152" y="102" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="500" fill="rgba(0,0,0,0.6)">Registry ID ${id}</text>
</svg>`;
}

export async function GET(
  req: NextRequest,
  ctx: { params: { registryId: string } }
) {
  const registryId = normalizeRegistryId(ctx?.params?.registryId || "");
  const origin = new URL(req.url).origin;

  const headers = {
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control":
      "public, max-age=300, s-maxage=900, stale-while-revalidate=3600",
  };

  if (!registryId) {
    return new NextResponse(invalidBadgeSvg("UNKNOWN"), {
      status: 200,
      headers,
    });
  }

  try {
    const verifyUrl = `${origin}/api/verify/${encodeURIComponent(registryId)}`;
    const res = await fetch(verifyUrl, { cache: "no-store" });
    const data = (await res.json()) as VerifyApiResponse;

    if (!data.ok || !("verified" in data) || !data.verified || !data.record) {
      return new NextResponse(invalidBadgeSvg(registryId), {
        status: 200,
        headers,
      });
    }

    const svg = badgeSvg({
      registryId,
      label: data.record.entityName || "Certified organization",
      status: "Verified",
      tier: data.record.certifiedTier || "Tier —",
      band: data.record.certifiedBand || "Band —",
    });

    return new NextResponse(svg, {
      status: 200,
      headers,
    });
  } catch {
    return new NextResponse(invalidBadgeSvg(registryId), {
      status: 200,
      headers,
    });
  }
}
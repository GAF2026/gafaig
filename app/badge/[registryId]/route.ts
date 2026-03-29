import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BadgeRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  COUNTRY: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

function escapeXml(value: string | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function baseOrigin() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  ).replace(/\/$/, "");
}

/**
 * Badge asset mapping.
 *
 * Adjust only these paths if your actual PNG filenames differ.
 * Current default assumes assets live in:
 * public/images/gafaig-badge-tier-1.png
 * public/images/gafaig-badge-tier-2.png
 * public/images/gafaig-badge-tier-3.png
 */
function resolveBadgeImageUrl(row: BadgeRow) {
  const origin = baseOrigin();

  if (!row.CERTIFIED_AT) return null;

  const tier = String(row.CERTIFIED_TIER || "").trim().toLowerCase();
  const band = String(row.CERTIFIED_BAND || "").trim().toUpperCase();

  if (tier.includes("tier 1") || tier.includes("tier-1") || band === "A") {
    return `${origin}/images/gafaig-badge-tier-1.png`;
  }

  if (tier.includes("tier 2") || tier.includes("tier-2") || band === "B") {
    return `${origin}/images/gafaig-badge-tier-2.png`;
  }

  if (tier.includes("tier 3") || tier.includes("tier-3") || band === "C") {
    return `${origin}/images/gafaig-badge-tier-3.png`;
  }

  // Safe default for certified records.
  return `${origin}/images/gafaig-badge-tier-1.png`;
}

function buildSvgWithPngAsset({
  registryId,
  entityName,
  status,
  subtitle,
  badgeImageUrl,
}: {
  registryId: string;
  entityName: string;
  status: string;
  subtitle: string;
  badgeImageUrl: string;
}) {
  const safeRegistryId = escapeXml(registryId);
  const safeEntityName = escapeXml(entityName);
  const safeStatus = escapeXml(status);
  const safeSubtitle = escapeXml(subtitle);
  const safeBadgeImageUrl = escapeXml(badgeImageUrl);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg">

  <!-- Background -->
  <rect width="1200" height="320" rx="26" fill="#F7F7F8"/>
  <rect x="2" y="2" width="1196" height="316" rx="24" stroke="#D9D9DE" stroke-width="2"/>

  <!-- LEFT BADGE (FIXED SIZE — NO MORE SHRINK) -->
  <image 
    x="40" 
    y="96" 
    width="240" 
    height="128" 
    href="${safeBadgeImageUrl}" 
    preserveAspectRatio="xMidYMid meet" 
  />

  <!-- RIGHT CONTENT -->
  <text x="320" y="80" font-family="Arial" font-size="22" font-weight="700" fill="#7A7A84" letter-spacing="2">
    CERTIFICATION STATUS
  </text>

  <text x="320" y="140" font-family="Arial" font-size="60" font-weight="700" fill="#111111">
    ${safeStatus}
  </text>

  <text x="320" y="190" font-family="Arial" font-size="30" font-weight="700" fill="#2E2E33">
    ${safeEntityName}
  </text>

  <text x="320" y="230" font-family="Arial" font-size="24" fill="#4A4A52">
    ${safeSubtitle}
  </text>

  <text x="320" y="270" font-family="Arial" font-size="22" fill="#6C6C75">
    Registry ID ${safeRegistryId}
  </text>

</svg>`;
}

function buildFallbackSvg({
  registryId,
  entityName,
  status,
  subtitle,
}: {
  registryId: string;
  entityName: string;
  status: string;
  subtitle: string;
}) {
  const safeRegistryId = escapeXml(registryId);
  const safeEntityName = escapeXml(entityName);
  const safeStatus = escapeXml(status);
  const safeSubtitle = escapeXml(subtitle);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GAFAIG certification badge unavailable">
  <rect width="1200" height="320" rx="26" fill="#F7F7F8"/>
  <rect x="2" y="2" width="1196" height="316" rx="24" stroke="#D9D9DE" stroke-width="2"/>

  <rect x="28" y="52" width="248" height="216" rx="28" fill="#5B5B61"/>
  <text x="152" y="122" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#FFFFFF">GAFAIG</text>
  <text x="152" y="176" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF">${safeStatus}</text>

  <text x="326" y="82" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="#7A7A84">CERTIFICATION STATUS</text>
  <text x="326" y="140" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" fill="#111111">${safeStatus}</text>
  <text x="326" y="196" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#2E2E33">${safeEntityName}</text>
  <text x="326" y="236" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="500" fill="#4A4A52">${safeSubtitle}</text>
  <text x="326" y="278" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="500" fill="#6C6C75">Registry ID ${safeRegistryId}</text>
</svg>`;
}

export async function GET(
  _req: Request,
  { params }: { params: { registryId: string } }
) {
  const registryId = decodeURIComponent(String(params.registryId || "").trim());

  if (!registryId) {
    const svg = buildFallbackSvg({
      registryId: "Unknown",
      entityName: "Missing registry identifier",
      status: "Unavailable",
      subtitle: "Unable to confirm certification",
    });

    return new Response(svg, {
      status: 400,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  const rows = await sfQuery<BadgeRow>(
    `
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      COUNTRY,
      CERTIFIED_SCORE,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      VALID_TO,
      CERTIFIED_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    WHERE REGISTRY_ID = ?
    LIMIT 1
    `,
    [registryId]
  );

  const row = rows[0];

  if (!row) {
    const svg = buildFallbackSvg({
      registryId,
      entityName: "Registry record not found",
      status: "Unavailable",
      subtitle: "Unable to confirm certification",
    });

    return new Response(svg, {
      status: 404,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  const certified = !!row.CERTIFIED_AT;
  const status = certified ? "Certified" : "Unavailable";

  const entityName = row.ENTITY_NAME || "GAFAIG Public Record";

  const tierBand =
    row.CERTIFIED_TIER && row.CERTIFIED_BAND
      ? `${row.CERTIFIED_TIER} · Band ${row.CERTIFIED_BAND}`
      : row.CERTIFIED_TIER || row.CERTIFIED_BAND || "Public record";

  const score =
    row.CERTIFIED_SCORE === null || row.CERTIFIED_SCORE === undefined
      ? "—"
      : `${Math.round(Number(row.CERTIFIED_SCORE))}/100`;

  const subtitle = certified
    ? `${tierBand} • Score ${score} • Valid to ${formatDate(row.VALID_TO)}`
    : "Unable to confirm certification";

  const badgeImageUrl = resolveBadgeImageUrl(row);

  const svg =
    certified && badgeImageUrl
      ? buildSvgWithPngAsset({
          registryId: row.REGISTRY_ID,
          entityName,
          status,
          subtitle,
          badgeImageUrl,
        })
      : buildFallbackSvg({
          registryId: row.REGISTRY_ID,
          entityName,
          status,
          subtitle,
        });

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
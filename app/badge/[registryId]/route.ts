import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BadgeRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  COUNTRY: string | null;
  CERTIFICATION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

function esc(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clean(value: string | null | undefined, fallback = "—") {
  const v = String(value ?? "").trim();
  return v.length ? v : fallback;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function statusColors(status: string | null | undefined) {
  const normalized = String(status ?? "").trim().toLowerCase();

  if (normalized === "certified") {
    return {
      pillBg: "#ECFDF3",
      pillBorder: "#ABEFC6",
      pillText: "#067647",
      accent: "#079455",
      accentSoft: "#D1FADF",
    };
  }

  return {
    pillBg: "#F9FAFB",
    pillBorder: "#D0D5DD",
    pillText: "#344054",
    accent: "#667085",
    accentSoft: "#EAECF0",
  };
}

function buildSvg(row: BadgeRow, baseUrl: string) {
  const width = 1600;
  const height = 900;

  const entityName = clean(row.ENTITY_NAME, row.REGISTRY_ID);
  const status = clean(row.CERTIFICATION_STATUS, row.CERTIFIED_AT ? "Certified" : "Published");
  const decision = clean(row.DECISION_STATUS);
  const tierBand = tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND);
  const validTo = formatDate(row.VALID_TO);
  const issuedAt = formatDate(row.CERTIFIED_AT);
  const verificationUrl = `${baseUrl}/api/verify/${encodeURIComponent(row.REGISTRY_ID)}`;
  const colors = statusColors(status);

  const entityNameFont = entityName.length > 34 ? 42 : entityName.length > 22 ? 52 : 60;
  const registryFont = row.REGISTRY_ID.length > 28 ? 20 : 22;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GAFAIG certification badge for ${esc(entityName)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1600" y2="900" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="55%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F3F4F6"/>
    </linearGradient>
    <linearGradient id="panel" x1="160" y1="120" x2="1440" y2="780" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FCFCFD"/>
    </linearGradient>
    <filter id="shadow" x="100" y="70" width="1400" height="760" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="14" stdDeviation="28" flood-color="#101828" flood-opacity="0.10"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <g filter="url(#shadow)">
    <rect x="140" y="100" width="1320" height="700" rx="32" fill="url(#panel)" stroke="#E4E7EC" stroke-width="2"/>
  </g>

  <rect x="140" y="100" width="1320" height="10" rx="5" fill="${colors.accent}"/>

  <text x="220" y="182" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="4">GAFAIG CERTIFICATION BADGE</text>

  <rect x="220" y="212" width="148" height="42" rx="21" fill="${colors.pillBg}" stroke="${colors.pillBorder}" stroke-width="2"/>
  <text x="294" y="239" text-anchor="middle" fill="${colors.pillText}" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1">${esc(status.toUpperCase())}</text>

  <rect x="382" y="212" width="154" height="42" rx="21" fill="#F8FAFC" stroke="#D0D5DD" stroke-width="2"/>
  <text x="459" y="239" text-anchor="middle" fill="#344054" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1">${esc(decision.toUpperCase())}</text>

  <text x="220" y="334" fill="#101828" font-family="Inter, Arial, sans-serif" font-size="${entityNameFont}" font-weight="800">${esc(entityName)}</text>

  <text x="220" y="390" fill="#475467" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="500">Public certification record issued through the GAFAIG registry of record.</text>

  <g>
    <rect x="220" y="454" width="470" height="116" rx="20" fill="#FFFFFF" stroke="#EAECF0" stroke-width="2"/>
    <text x="250" y="490" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1.5">REGISTRY ID</text>
    <text x="250" y="534" fill="#101828" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="${registryFont}" font-weight="700">${esc(row.REGISTRY_ID)}</text>
  </g>

  <g>
    <rect x="720" y="454" width="240" height="116" rx="20" fill="#FFFFFF" stroke="#EAECF0" stroke-width="2"/>
    <text x="750" y="490" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1.5">COUNTRY</text>
    <text x="750" y="534" fill="#101828" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">${esc(clean(row.COUNTRY))}</text>
  </g>

  <g>
    <rect x="980" y="454" width="240" height="116" rx="20" fill="#FFFFFF" stroke="#EAECF0" stroke-width="2"/>
    <text x="1010" y="490" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1.5">TIER / BAND</text>
    <text x="1010" y="534" fill="#101828" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">${esc(tierBand)}</text>
  </g>

  <g>
    <rect x="1240" y="454" width="170" height="116" rx="20" fill="${colors.accentSoft}" stroke="${colors.pillBorder}" stroke-width="2"/>
    <text x="1270" y="490" fill="#067647" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1.5">VALID TO</text>
    <text x="1270" y="534" fill="#065F46" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800">${esc(validTo)}</text>
  </g>

  <rect x="220" y="612" width="1190" height="118" rx="22" fill="#0F172A"/>
  <text x="250" y="650" fill="#98A2B3" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1.5">VERIFICATION ENDPOINT</text>
  <text x="250" y="696" fill="#FFFFFF" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="20" font-weight="600">${esc(verificationUrl)}</text>

  <text x="250" y="768" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600">Issued ${esc(issuedAt)} • Public trust surface only • Private review materials not disclosed</text>

  <g transform="translate(1240 170)">
    <circle cx="72" cy="72" r="72" fill="${colors.accentSoft}" stroke="${colors.pillBorder}" stroke-width="4"/>
    <circle cx="72" cy="72" r="50" fill="${colors.accent}" opacity="0.16"/>
    <path d="M49 74L64 89L97 56" stroke="${colors.accent}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
}

export async function GET(
  req: Request,
  { params }: { params: { registryId: string } }
) {
  const registryId = String(params.registryId || "").trim();

  if (!registryId) {
    return new NextResponse("Missing registryId", { status: 400 });
  }

  const rows = await sfQuery<BadgeRow>(
    `
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      COUNTRY,
      CERTIFICATION_STATUS,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      VALID_TO,
      CERTIFIED_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    WHERE UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM(?))
    LIMIT 1
    `,
    [registryId]
  );

  const row = rows[0];

  if (!row) {
    return new NextResponse("Registry record not found", { status: 404 });
  }

  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const svg = buildSvg(row, baseUrl);

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "Content-Disposition": `inline; filename="${row.REGISTRY_ID}.svg"`,
    },
  });
}
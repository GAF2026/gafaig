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
  const width = 1440;
  const height = 760;

  const entityName = clean(row.ENTITY_NAME, row.REGISTRY_ID);
  const status = clean(row.CERTIFICATION_STATUS, row.CERTIFIED_AT ? "Certified" : "Published");
  const decision = clean(row.DECISION_STATUS);
  const tierBand = tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND);
  const validTo = formatDate(row.VALID_TO);
  const issuedAt = formatDate(row.CERTIFIED_AT);
  const verificationUrl = `${baseUrl}/api/verify/${encodeURIComponent(row.REGISTRY_ID)}`;
  const colors = statusColors(status);

  const entityNameFont =
    entityName.length > 34 ? 40 : entityName.length > 24 ? 50 : 58;

  const registryFont =
    row.REGISTRY_ID.length > 30 ? 18 : row.REGISTRY_ID.length > 24 ? 20 : 22;

  const countryFont =
    clean(row.COUNTRY).length > 14 ? 22 : 28;

  const tierBandFont =
    tierBand.length > 22 ? 20 : tierBand.length > 16 ? 24 : 28;

  const validToFont =
    validTo.length > 14 ? 18 : validTo.length > 10 ? 22 : 24;

  const verificationFont =
    verificationUrl.length > 90 ? 16 : 18;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GAFAIG certification badge for ${esc(entityName)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="55%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F3F4F6"/>
    </linearGradient>
    <linearGradient id="panel" x1="100" y1="70" x2="1340" y2="690" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FCFCFD"/>
    </linearGradient>
    <filter id="shadow" x="60" y="40" width="1320" height="680" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="12" stdDeviation="22" flood-color="#101828" flood-opacity="0.10"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <g filter="url(#shadow)">
    <rect x="80" y="60" width="1280" height="620" rx="28" fill="url(#panel)" stroke="#E4E7EC" stroke-width="2"/>
  </g>

  <rect x="80" y="60" width="1280" height="10" rx="5" fill="${colors.accent}"/>

  <text x="160" y="138" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="4">GAFAIG CERTIFICATION BADGE</text>

  <rect x="160" y="172" width="150" height="40" rx="20" fill="${colors.pillBg}" stroke="${colors.pillBorder}" stroke-width="2"/>
  <text x="235" y="198" text-anchor="middle" fill="${colors.pillText}" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="800" letter-spacing="1">${esc(status.toUpperCase())}</text>

  <rect x="324" y="172" width="152" height="40" rx="20" fill="#F8FAFC" stroke="#D0D5DD" stroke-width="2"/>
  <text x="400" y="198" text-anchor="middle" fill="#344054" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="800" letter-spacing="1">${esc(decision.toUpperCase())}</text>

  <text x="160" y="298" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="${entityNameFont}" font-weight="800">${esc(entityName)}</text>

  <text x="160" y="352" fill="#475467" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="500">Public certification record issued through the GAFAIG registry of record.</text>

  <g>
    <rect x="160" y="420" width="470" height="110" rx="18" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="2"/>
    <text x="190" y="455" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5">REGISTRY ID</text>
    <text x="190" y="502" fill="#101828" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="${registryFont}" font-weight="700">${esc(row.REGISTRY_ID)}</text>
  </g>

  <g>
    <rect x="660" y="420" width="250" height="110" rx="18" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="2"/>
    <text x="690" y="455" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5">COUNTRY</text>
    <text x="690" y="505" fill="#101828" font-family="Inter, Arial, sans-serif" font-size="${countryFont}" font-weight="700">${esc(clean(row.COUNTRY))}</text>
  </g>

  <g>
    <rect x="930" y="420" width="250" height="110" rx="18" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="2"/>
    <text x="960" y="455" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5">TIER / BAND</text>
    <text x="960" y="505" fill="#101828" font-family="Inter, Arial, sans-serif" font-size="${tierBandFont}" font-weight="700">${esc(tierBand)}</text>
  </g>

  <g>
    <rect x="1200" y="420" width="160" height="110" rx="18" fill="${colors.accentSoft}" stroke="${colors.pillBorder}" stroke-width="2"/>
    <text x="1226" y="455" fill="#067647" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5">VALID TO</text>
    <text x="1226" y="505" fill="#065F46" font-family="Inter, Arial, sans-serif" font-size="${validToFont}" font-weight="800">${esc(validTo)}</text>
  </g>

  <rect x="160" y="568" width="1200" height="104" rx="20" fill="#0B1736"/>
  <text x="190" y="606" fill="#98A2B3" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5">VERIFICATION ENDPOINT</text>
  <text x="190" y="649" fill="#FFFFFF" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="${verificationFont}" font-weight="600">${esc(verificationUrl)}</text>

  <g transform="translate(1130 150)">
    <circle cx="95" cy="95" r="78" fill="${colors.accentSoft}" stroke="${colors.pillBorder}" stroke-width="4"/>
    <circle cx="95" cy="95" r="52" fill="${colors.accent}" opacity="0.16"/>
    <path d="M67 98L86 117L124 79" stroke="${colors.accent}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <text x="160" y="708" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="600">Issued ${esc(issuedAt)} • Public trust surface only • Private review materials not disclosed</text>
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
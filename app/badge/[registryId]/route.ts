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

function fitFontSize(value: string, base: number, min: number, threshold: number, step = 2) {
  const len = value.length;
  if (len <= threshold) return base;
  const reduced = base - Math.ceil((len - threshold) / 3) * step;
  return Math.max(min, reduced);
}

function buildSvg(row: BadgeRow, baseUrl: string) {
  const width = 1360;
  const height = 700;

  const entityName = clean(row.ENTITY_NAME, row.REGISTRY_ID);
  const status = clean(
    row.CERTIFICATION_STATUS,
    row.CERTIFIED_AT ? "Certified" : "Published"
  );
  const decision = clean(row.DECISION_STATUS);
  const country = clean(row.COUNTRY);
  const tierBand = tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND);
  const validTo = formatDate(row.VALID_TO);
  const issuedAt = formatDate(row.CERTIFIED_AT);
  const verificationUrl = `${baseUrl}/api/verify/${encodeURIComponent(row.REGISTRY_ID)}`;
  const colors = statusColors(status);

  const entityNameFont =
    entityName.length > 34 ? 38 : entityName.length > 24 ? 46 : 54;

  const registryFont =
    row.REGISTRY_ID.length > 30 ? 17 : row.REGISTRY_ID.length > 24 ? 19 : 21;

  const countryFont = fitFontSize(country, 26, 18, 14, 2);
  const tierBandFont = fitFontSize(tierBand, 26, 18, 16, 2);
  const validToFont = fitFontSize(validTo, 22, 16, 10, 2);
  const verificationFont = verificationUrl.length > 90 ? 15 : 17;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GAFAIG certification badge for ${esc(entityName)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="55%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F3F4F6"/>
    </linearGradient>
    <linearGradient id="panel" x1="90" y1="56" x2="1270" y2="634" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FCFCFD"/>
    </linearGradient>
    <filter id="shadow" x="50" y="26" width="1260" height="648" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#101828" flood-opacity="0.10"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <g filter="url(#shadow)">
    <rect x="70" y="46" width="1220" height="608" rx="26" fill="url(#panel)" stroke="#E4E7EC" stroke-width="2"/>
  </g>

  <rect x="70" y="46" width="1220" height="10" rx="5" fill="${colors.accent}"/>

  <text x="150" y="126" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="4">GAFAIG CERTIFICATION BADGE</text>

  <rect x="150" y="160" width="148" height="38" rx="19" fill="${colors.pillBg}" stroke="${colors.pillBorder}" stroke-width="2"/>
  <text x="224" y="185" text-anchor="middle" fill="${colors.pillText}" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="1">${esc(status.toUpperCase())}</text>

  <rect x="310" y="160" width="148" height="38" rx="19" fill="#F8FAFC" stroke="#D0D5DD" stroke-width="2"/>
  <text x="384" y="185" text-anchor="middle" fill="#344054" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="1">${esc(decision.toUpperCase())}</text>

  <text x="150" y="286" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="${entityNameFont}" font-weight="800">${esc(entityName)}</text>

  <text x="150" y="338" fill="#475467" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="500">Public certification record issued through the GAFAIG registry of record.</text>

  <g transform="translate(1060 136)">
    <circle cx="86" cy="86" r="72" fill="${colors.accentSoft}" stroke="${colors.pillBorder}" stroke-width="4"/>
    <circle cx="86" cy="86" r="48" fill="${colors.accent}" opacity="0.16"/>
    <path d="M60 89L77 106L111 72" stroke="${colors.accent}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <g>
    <rect x="150" y="410" width="450" height="106" rx="18" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="2"/>
    <text x="180" y="444" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">REGISTRY ID</text>
    <text x="180" y="488" fill="#101828" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="${registryFont}" font-weight="700">${esc(row.REGISTRY_ID)}</text>
  </g>

  <g>
    <rect x="620" y="410" width="250" height="106" rx="18" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="2"/>
    <text x="650" y="444" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">COUNTRY</text>
    <text x="650" y="488" fill="#101828" font-family="Inter, Arial, sans-serif" font-size="${countryFont}" font-weight="700" textLength="190" lengthAdjust="spacingAndGlyphs">${esc(country)}</text>
  </g>

  <g>
    <rect x="890" y="410" width="220" height="106" rx="18" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="2"/>
    <text x="920" y="444" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">TIER / BAND</text>
    <text x="920" y="488" fill="#101828" font-family="Inter, Arial, sans-serif" font-size="${tierBandFont}" font-weight="700" textLength="160" lengthAdjust="spacingAndGlyphs">${esc(tierBand)}</text>
  </g>

  <g>
    <rect x="1130" y="410" width="160" height="106" rx="18" fill="${colors.accentSoft}" stroke="${colors.pillBorder}" stroke-width="2"/>
    <text x="1156" y="444" fill="#067647" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">VALID TO</text>
    <text x="1156" y="488" fill="#065F46" font-family="Inter, Arial, sans-serif" font-size="${validToFont}" font-weight="800" textLength="108" lengthAdjust="spacingAndGlyphs">${esc(validTo)}</text>
  </g>

  <rect x="150" y="554" width="1140" height="96" rx="20" fill="#0B1736"/>
  <text x="180" y="590" fill="#98A2B3" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">VERIFICATION ENDPOINT</text>
  <text x="180" y="632" fill="#FFFFFF" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="${verificationFont}" font-weight="600">${esc(verificationUrl)}</text>

  <text x="150" y="688" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="600">Issued ${esc(issuedAt)} • Public trust surface only • Private review materials not disclosed</text>
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
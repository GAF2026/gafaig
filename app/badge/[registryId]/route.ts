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

function fitFontSize(
  value: string,
  base: number,
  min: number,
  threshold: number,
  step = 2
) {
  const len = value.length;
  if (len <= threshold) return base;
  const reduced = base - Math.ceil((len - threshold) / 3) * step;
  return Math.max(min, reduced);
}

function buildSvg(row: BadgeRow, baseUrl: string) {
  const width = 1280;
  const height = 700;

  const panelX = 60;
  const panelY = 46;
  const panelW = 1160;
  const panelH = 608;

  const contentLeft = 140;
  const contentTop = 126;

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
  const verificationUrl = `${baseUrl}/api/verify/${encodeURIComponent(
    row.REGISTRY_ID
  )}`;
  const colors = statusColors(status);

  const entityNameFont =
    entityName.length > 34 ? 38 : entityName.length > 24 ? 46 : 54;

  const registryFont =
    row.REGISTRY_ID.length > 30 ? 17 : row.REGISTRY_ID.length > 24 ? 19 : 21;

  const countryFont = fitFontSize(country, 26, 18, 14, 2);
  const tierBandFont = fitFontSize(tierBand, 26, 18, 16, 2);
  const validToFont = fitFontSize(validTo, 22, 16, 10, 2);
  const verificationFont = verificationUrl.length > 82 ? 15 : 17;

  const pillY = 410;
  const gap = 24;
  const pillStartX = 150;
  const w1 = 390;
  const w2 = 220;
  const w3 = 200;
  const w4 = 128;

  const p1 = pillStartX;
  const p2 = p1 + w1 + gap;
  const p3 = p2 + w2 + gap;
  const p4 = p3 + w3 + gap;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GAFAIG certification badge for ${esc(entityName)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="55%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F3F4F6"/>
    </linearGradient>
    <linearGradient id="panel" x1="${panelX}" y1="${panelY}" x2="${panelX + panelW}" y2="${panelY + panelH}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FCFCFD"/>
    </linearGradient>
    <filter id="shadow" x="20" y="20" width="${panelW + 80}" height="${panelH + 80}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#101828" flood-opacity="0.10"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <g filter="url(#shadow)">
    <rect x="${panelX}" y="${panelY}" width="${panelW}" height="${panelH}" rx="26" fill="url(#panel)" stroke="#E4E7EC" stroke-width="2"/>
  </g>

  <rect x="${panelX}" y="${panelY}" width="${panelW}" height="10" rx="5" fill="${colors.accent}"/>

  <text x="${contentLeft}" y="${contentTop}" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="4">GAFAIG CERTIFICATION BADGE</text>

  <rect x="${contentLeft}" y="160" width="148" height="38" rx="19" fill="${colors.pillBg}" stroke="${colors.pillBorder}" stroke-width="2"/>
  <text x="${contentLeft + 74}" y="185" text-anchor="middle" fill="${colors.pillText}" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="1">${esc(status.toUpperCase())}</text>

  <rect x="${contentLeft + 160}" y="160" width="148" height="38" rx="19" fill="#F8FAFC" stroke="#D0D5DD" stroke-width="2"/>
  <text x="${contentLeft + 234}" y="185" text-anchor="middle" fill="#344054" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="1">${esc(decision.toUpperCase())}</text>

  <text x="${contentLeft}" y="286" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="${entityNameFont}" font-weight="800">${esc(entityName)}</text>

  <text x="${contentLeft}" y="338" fill="#475467" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="500">Public certification record issued through the GAFAIG registry of record.</text>

  <g transform="translate(1000 146)">
    <circle cx="82" cy="82" r="68" fill="${colors.accentSoft}" stroke="${colors.pillBorder}" stroke-width="4"/>
    <circle cx="82" cy="82" r="45" fill="${colors.accent}" opacity="0.16"/>
    <path d="M58 84L74 100L106 68" stroke="${colors.accent}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <g>
    <rect x="${p1}" y="${pillY}" width="${w1}" height="106" rx="18" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="2"/>
    <text x="${p1 + 26}" y="${pillY + 34}" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">REGISTRY ID</text>
    <text x="${p1 + 26}" y="${pillY + 78}" fill="#101828" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="${registryFont}" font-weight="700">${esc(row.REGISTRY_ID)}</text>
  </g>

  <g>
    <rect x="${p2}" y="${pillY}" width="${w2}" height="106" rx="18" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="2"/>
    <text x="${p2 + 26}" y="${pillY + 34}" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">COUNTRY</text>
    <text x="${p2 + 26}" y="${pillY + 78}" fill="#101828" font-family="Inter, Arial, sans-serif" font-size="${countryFont}" font-weight="700" textLength="${w2 - 52}" lengthAdjust="spacingAndGlyphs">${esc(country)}</text>
  </g>

  <g>
    <rect x="${p3}" y="${pillY}" width="${w3}" height="106" rx="18" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="2"/>
    <text x="${p3 + 26}" y="${pillY + 34}" fill="#667085" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">TIER / BAND</text>
    <text x="${p3 + 26}" y="${pillY + 78}" fill="#101828" font-family="Inter, Arial, sans-serif" font-size="${tierBandFont}" font-weight="700" textLength="${w3 - 52}" lengthAdjust="spacingAndGlyphs">${esc(tierBand)}</text>
  </g>

  <g>
    <rect x="${p4}" y="${pillY}" width="${w4}" height="106" rx="18" fill="${colors.accentSoft}" stroke="${colors.pillBorder}" stroke-width="2"/>
    <text x="${p4 + 22}" y="${pillY + 34}" fill="#067647" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">VALID TO</text>
    <text x="${p4 + 22}" y="${pillY + 78}" fill="#065F46" font-family="Inter, Arial, sans-serif" font-size="${validToFont}" font-weight="800" textLength="${w4 - 44}" lengthAdjust="spacingAndGlyphs">${esc(validTo)}</text>
  </g>

  <rect x="150" y="554" width="1080" height="96" rx="20" fill="#0B1736"/>
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
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BadgeRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  COUNTRY: string | null;
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

function resolveBadgeImageUrl(row: BadgeRow) {
  const origin = baseOrigin();

  if (!row.CERTIFIED_AT) return null;

  const tier = String(row.CERTIFIED_TIER || "").toLowerCase();
  const band = String(row.CERTIFIED_BAND || "").toUpperCase();

  if (tier.includes("tier 1") || band === "A") {
    return `${origin}/images/gafaig-badge-tier-1.png`;
  }

  if (tier.includes("tier 2") || band === "B") {
    return `${origin}/images/gafaig-badge-tier-2.png`;
  }

  if (tier.includes("tier 3") || band === "C") {
    return `${origin}/images/gafaig-badge-tier-3.png`;
  }

  return `${origin}/images/gafaig-badge-tier-1.png`;
}

function buildSvg({
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
  badgeImageUrl: string | null;
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1400" height="360" viewBox="0 0 1400 360" xmlns="http://www.w3.org/2000/svg">
  <rect width="1400" height="360" rx="28" fill="#F7F7F8"/>
  <rect x="2" y="2" width="1396" height="356" rx="26" stroke="#D9D9DE" stroke-width="2"/>

  ${
    badgeImageUrl
      ? `<image x="52" y="104" width="304" height="152" href="${badgeImageUrl}" />`
      : ""
  }

  <text x="420" y="96" font-size="26" fill="#7A7A84">CERTIFICATION STATUS</text>

  <text x="420" y="170" font-size="74" font-weight="700">${status}</text>

  <text x="420" y="238" font-size="30">${entityName}</text>

  <text x="420" y="286" font-size="24">${subtitle}</text>

  <text x="420" y="332" font-size="22">Registry ID ${registryId}</text>
</svg>`;
}

export async function GET(
  _req: Request,
  { params }: { params: { registryId: string } }
) {
  const registryId = decodeURIComponent(String(params.registryId || "").trim());

  const rows = await sfQuery<BadgeRow>(
    `
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      COUNTRY,
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
    return new Response("Not found", { status: 404 });
  }

  const certified = !!row.CERTIFIED_AT;

  const subtitle = certified
    ? `${row.CERTIFIED_TIER} · Band ${row.CERTIFIED_BAND} • Valid to ${formatDate(
        row.VALID_TO
      )}`
    : "Unable to confirm certification";

  const svg = buildSvg({
    registryId: row.REGISTRY_ID,
    entityName: row.ENTITY_NAME || "GAFAIG Record",
    status: certified ? "Certified" : "Unavailable",
    subtitle,
    badgeImageUrl: resolveBadgeImageUrl(row),
  });

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
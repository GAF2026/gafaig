import { NextResponse } from "next/server";
import { getRegistryRecordById } from "@/lib/queries/registry";

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

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  ).replace(/\/+$/, "");
}

function toIsoString(value: unknown): string | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSvgBadge(label: string, entityName: string, status: string): string {
  const safeLabel = esc(label);
  const safeEntity = esc(entityName || "GAFAIG Record");
  const safeStatus = esc(status);

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="118" viewBox="0 0 420 118" role="img" aria-label="${safeLabel}">
  <rect width="420" height="118" rx="22" fill="#ffffff"/>
  <rect x="0.5" y="0.5" width="419" height="117" rx="21.5" fill="none" stroke="#d1d5db"/>
  <rect x="18" y="18" width="82" height="82" rx="41" fill="#e9f8ef" stroke="#9fe0bb"/>
  <path d="M42 60.5l11.5 11.5L78 46" fill="none" stroke="#138a52" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="118" y="35" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="2" fill="#2563eb">GAFAIG</text>
  <text x="118" y="59" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800" fill="#111827">${safeLabel}</text>
  <text x="118" y="82" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="#4b5563">${safeEntity}</text>
  <text x="118" y="99" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="700" fill="#138a52">Status: ${safeStatus}</text>
</svg>`.trim();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function GET(
  req: Request,
  context: { params: { registryId: string } }
) {
  try {
    const registryId = String(context.params.registryId ?? "").trim();

    if (!registryId) {
      return NextResponse.json(
        { ok: false, error: "Missing registryId" },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    const record = await getRegistryRecordById(registryId);

    if (!record) {
      return NextResponse.json(
        { ok: false, registryId, error: "Registry record not found" },
        { status: 404, headers: getCorsHeaders() }
      );
    }

    const baseUrl = getBaseUrl();
    const url = new URL(req.url);

    const wantsSvg =
      url.searchParams.get("format") === "svg" ||
      req.headers.get("accept")?.includes("image/svg+xml");

    const certificationStatus = String(record.certificationStatus ?? "")
      .trim()
      .toLowerCase();

    const badgeStatus =
      certificationStatus === "certified" ? "certified" : "unavailable";

    const badgeLabel =
      badgeStatus === "certified"
        ? "GAFAIG Certified"
        : "GAFAIG Verification Unavailable";

    if (wantsSvg) {
      return new NextResponse(
        renderSvgBadge(
          badgeLabel,
          record.entityName ?? record.registryId ?? "GAFAIG Record",
          badgeStatus
        ),
        {
          status: 200,
          headers: {
            ...getCorsHeaders(),
            "Content-Type": "image/svg+xml; charset=utf-8",
          },
        }
      );
    }

    const encodedRegistryId = encodeURIComponent(record.registryId ?? registryId);

    return NextResponse.json(
      {
        ok: true,
        registryId: record.registryId ?? registryId,
        registrySnapshotId: record.registrySnapshotId,
        applicationId: record.applicationId,
        caseId: record.caseId,
        entityName: record.entityName,
        entityType: record.entityType,
        country: record.country,
        certificationStatus: record.certificationStatus,
        certifiedAt: toIsoString(record.certifiedAt),
        validFrom: toIsoString(record.validFrom),
        validTo: toIsoString(record.validTo),
        renewalStatus: record.renewalStatus,
        publishedAt: toIsoString(record.publishedAt),
        badge: {
          status: badgeStatus,
          label: badgeLabel,
          imageUrl: `${baseUrl}/api/badge/${encodedRegistryId}?format=svg`,
        },
        verifyUrl: `${baseUrl}/verify/${encodedRegistryId}`,
        registryUrl: `${baseUrl}/registry/${encodedRegistryId}`,
        widgetUrl: `${baseUrl}/widget-preview/${encodedRegistryId}`,
      },
      {
        status: 200,
        headers: getCorsHeaders(),
      }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Badge endpoint failed" },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}
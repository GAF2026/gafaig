import { NextResponse } from "next/server";
import { getRegistryRecordById } from "@/lib/queries/registry";
import type { BadgeApiResponse } from "@/types/registry";

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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function GET(
  _req: Request,
  context: { params: { registryId: string } }
) {
  try {
    const registryId = String(context.params.registryId ?? "").trim();

    if (!registryId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing registryId",
        } satisfies BadgeApiResponse,
        {
          status: 400,
          headers: getCorsHeaders(),
        }
      );
    }

    const record = await getRegistryRecordById(registryId);

    if (!record) {
      return NextResponse.json(
        {
          ok: false,
          registryId,
          error: "Registry record not found",
        } satisfies BadgeApiResponse,
        {
          status: 404,
          headers: getCorsHeaders(),
        }
      );
    }

    const baseUrl = getBaseUrl();

    const certificationStatus = String(record.certificationStatus ?? "")
      .trim()
      .toLowerCase();

    const lifecycleStatus = String(record.lifecycleStatus ?? "")
      .trim()
      .toLowerCase();

    const badgeEligible =
      certificationStatus === "certified" && lifecycleStatus === "active";

    const badgeStatus =
      badgeEligible
        ? "certified"
        : lifecycleStatus === "revoked"
          ? "revoked"
          : lifecycleStatus === "expired"
            ? "expired"
            : "unavailable";

    const badgeLabel =
      badgeStatus === "certified"
        ? "GAFAIG Certified"
        : badgeStatus === "revoked"
          ? "GAFAIG Certification Revoked"
          : badgeStatus === "expired"
            ? "GAFAIG Certification Expired"
            : "GAFAIG Verification Unavailable";

    const response: BadgeApiResponse = {
      ok: true,
      registryId: record.registryId,
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
      lifecycleStatus: record.lifecycleStatus,
      badgeEligible,
      renewalStatus: record.renewalStatus,
      publishedAt: toIsoString(record.publishedAt),
      badge: {
        status: badgeStatus,
        label: badgeLabel,
        imageUrl: "",
      },
      verifyUrl: `${baseUrl}/verify/${encodeURIComponent(record.registryId)}`,
      registryUrl: `${baseUrl}/registry/${encodeURIComponent(record.registryId)}`,
      widgetUrl: `${baseUrl}/widget-preview/${encodeURIComponent(record.registryId)}`,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: getCorsHeaders(),
    });
  } catch (_error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Badge endpoint failed",
      } satisfies BadgeApiResponse,
      {
        status: 500,
        headers: getCorsHeaders(),
      }
    );
  }
}
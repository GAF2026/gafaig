import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";
import {
  signVerificationPayload,
  getSigningKeyId,
  GAFAIG_VERIFY_ALG,
} from "@/lib/crypto/verify-signing";
import type { VerifyApiResponse } from "@/types/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type CanonicalJson =
  | string
  | number
  | boolean
  | null
  | CanonicalJson[]
  | { [key: string]: CanonicalJson };

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

function escapeSqlString(value: string): string {
  return String(value).replace(/'/g, "''");
}

function toIsoString(value: unknown): string | null {
  if (!value) return null;

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isTrue(value: unknown): boolean {
  if (value === true) return true;

  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function canonicalize(value: unknown): CanonicalJson {
  if (value === null || value === undefined) return null;

  if (typeof value === "string") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean") return value;

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value.map((item) => canonicalize(item));
  }

  if (typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, CanonicalJson> = {};

    for (const key of Object.keys(input).sort()) {
      output[key] = canonicalize(input[key]);
    }

    return output;
  }

  return String(value);
}

function failClosed(
  registryId: string | null,
  error: string,
  status: number
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      verified: false,
      ...(registryId ? { registryId } : {}),
      error,
    } satisfies VerifyApiResponse,
    {
      status,
      headers: getCorsHeaders(),
    }
  );
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
      return failClosed(null, "Missing registryId", 400);
    }

    const rows = await sfQuery<any>(`
      SELECT
        REGISTRY_SNAPSHOT_ID,
        REGISTRY_ID,
        APPLICATION_ID,
        CASE_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFICATION_STATUS,
        CERTIFIED_AT,
        VALID_FROM,
        VALID_TO,
        PUBLISHED_AT,
        RENEWAL_STATUS,
        LIFECYCLE_STATUS,
        VISIBILITY_STATUS,
        VERIFICATION_ELIGIBLE,
        BADGE_ELIGIBLE
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM('${escapeSqlString(registryId)}'))
      ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
      LIMIT 1
    `);

    if (!rows.length) {
      return failClosed(registryId, "Registry record not found", 404);
    }

    const r = rows[0];

    const record = {
      registryId: r.REGISTRY_ID,
      registrySnapshotId: r.REGISTRY_SNAPSHOT_ID ?? null,
      applicationId: r.APPLICATION_ID ?? null,
      caseId: r.CASE_ID ?? null,
      entityName: r.ENTITY_NAME ?? null,
      entityType: r.ENTITY_TYPE ?? null,
      country: r.COUNTRY ?? null,
      certificationStatus: r.CERTIFICATION_STATUS ?? null,
      certifiedAt: toIsoString(r.CERTIFIED_AT),
      validFrom: toIsoString(r.VALID_FROM),
      validTo: toIsoString(r.VALID_TO),
      publishedAt: toIsoString(r.PUBLISHED_AT),
      renewalStatus: r.RENEWAL_STATUS ?? null,
      lifecycleStatus: r.LIFECYCLE_STATUS ?? null,
      visibilityStatus: r.VISIBILITY_STATUS ?? null,
      verificationEligible: isTrue(r.VERIFICATION_ELIGIBLE),
      badgeEligible: isTrue(r.BADGE_ELIGIBLE),
    };

    if (!record.verificationEligible) {
      return failClosed(
        registryId,
        "Registry record is not verification eligible",
        403
      );
    }

    const message = canonicalize({
      registryId: record.registryId,
      registrySnapshotId: record.registrySnapshotId,
      applicationId: record.applicationId,
      caseId: record.caseId,
      entityName: record.entityName,
      entityType: record.entityType,
      country: record.country,
      certificationStatus: record.certificationStatus,
      certifiedAt: record.certifiedAt,
      validFrom: record.validFrom,
      validTo: record.validTo,
      publishedAt: record.publishedAt,
      renewalStatus: record.renewalStatus,
      lifecycleStatus: record.lifecycleStatus,
      visibilityStatus: record.visibilityStatus,
      verificationEligible: record.verificationEligible,
      badgeEligible: record.badgeEligible,
    }) as Record<string, unknown>;

    const messageString = JSON.stringify(message);

    if (typeof messageString !== "string" || !messageString.trim()) {
      return failClosed(
        registryId,
        "Canonical messageString generation failed",
        500
      );
    }

    const signature = signVerificationPayload(messageString);
    const kid = getSigningKeyId();
    const baseUrl = getBaseUrl();
    const verificationKeyUrl = `${baseUrl}/api/.well-known/gafaig-public-key`;
    const signedAt = new Date().toISOString();

    if (typeof signature !== "string" || !signature.trim()) {
      return failClosed(
        registryId,
        "Verification signature generation failed",
        500
      );
    }

    if (typeof kid !== "string" || !kid.trim()) {
      return failClosed(registryId, "Verification key id unavailable", 500);
    }

    if (typeof GAFAIG_VERIFY_ALG !== "string" || !GAFAIG_VERIFY_ALG.trim()) {
      return failClosed(registryId, "Verification algorithm unavailable", 500);
    }

    const response: VerifyApiResponse = {
      ok: true,
      verified: true,
      registryId: record.registryId,
      record,
      proof: {
        alg: GAFAIG_VERIFY_ALG,
        kid,
        signature,
        signedAt,
        verificationKeyUrl,
        message,
        messageString,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: getCorsHeaders(),
    });
  } catch (_error) {
    return failClosed(null, "Verification endpoint failed", 500);
  }
}
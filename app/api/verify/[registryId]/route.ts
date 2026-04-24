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
          verified: false,
          error: "Missing registryId",
        } satisfies VerifyApiResponse,
        {
          status: 400,
          headers: getCorsHeaders(),
        }
      );
    }

    const rows = await sfQuery<any>(`
      SELECT
        REGISTRY_SNAPSHOT_ID,
        REGISTRY_ID,
        APPLICATION_ID,
        CASE_ID,
        RECORD_TYPE,
        RECORD_NAME,
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
      return NextResponse.json(
        {
          ok: false,
          verified: false,
          registryId,
          error: "Registry record not found",
        } satisfies VerifyApiResponse,
        {
          status: 404,
          headers: getCorsHeaders(),
        }
      );
    }

    const r = rows[0];

    const record = {
      registryId: r.REGISTRY_ID,
      registrySnapshotId: r.REGISTRY_SNAPSHOT_ID ?? null,
      applicationId: r.APPLICATION_ID ?? null,
      caseId: r.CASE_ID ?? null,
      recordType: r.RECORD_TYPE ?? null,
      recordName: r.RECORD_NAME ?? null,
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
      verificationEligible: r.VERIFICATION_ELIGIBLE ?? null,
      badgeEligible: r.BADGE_ELIGIBLE ?? null,
    };

    const message = {
      registryId: record.registryId,
      entityName: record.entityName,
      certificationStatus: record.certificationStatus,
      certifiedAt: record.certifiedAt,
      validFrom: record.validFrom,
      validTo: record.validTo,
    };

    const messageString = JSON.stringify(message);
    const signature = signVerificationPayload(messageString);
    const baseUrl = getBaseUrl();

    const response: VerifyApiResponse = {
      ok: true,
      verified: true,
      registryId: record.registryId,
      record,
      proof: {
        alg: GAFAIG_VERIFY_ALG,
        kid: getSigningKeyId(),
        signature,
        signedAt: new Date().toISOString(),
        verificationKeyUrl: `${baseUrl}/api/.well-known/gafaig-public-key`,
        message,
        messageString,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: getCorsHeaders(),
    });
  } catch (_error) {
    return NextResponse.json(
      {
        ok: false,
        verified: false,
        error: "Verification endpoint failed",
      } satisfies VerifyApiResponse,
      {
        status: 500,
        headers: getCorsHeaders(),
      }
    );
  }
}
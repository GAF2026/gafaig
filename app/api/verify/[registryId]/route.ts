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
        REGISTRY_ID,
        REGISTRY_SNAPSHOT_ID,
        APPLICATION_ID,
        CASE_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFICATION_STATUS,
        CERTIFIED_AT,
        VALID_FROM,
        VALID_TO,
        LIFECYCLE_STATUS,
        RENEWAL_STATUS,
        PUBLISHED_AT
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM('${escapeSqlString(registryId)}'))
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
      entityName: r.ENTITY_NAME ?? null,
      entityType: r.ENTITY_TYPE ?? null,
      country: r.COUNTRY ?? null,
      certificationStatus: r.CERTIFICATION_STATUS ?? null,
      certifiedAt: toIsoString(r.CERTIFIED_AT),
      validFrom: toIsoString(r.VALID_FROM),
      validTo: toIsoString(r.VALID_TO),
      lifecycleStatus: r.LIFECYCLE_STATUS ?? null,
      renewalStatus: r.RENEWAL_STATUS ?? null,
      publishedAt: toIsoString(r.PUBLISHED_AT),
    };

    const message = {
      registryId: record.registryId,
      entityName: record.entityName,
      entityType: record.entityType,
      country: record.country,
      certificationStatus: record.certificationStatus,
      certifiedAt: record.certifiedAt,
      validFrom: record.validFrom,
      validTo: record.validTo,
      lifecycleStatus: record.lifecycleStatus,
      renewalStatus: record.renewalStatus,
      publishedAt: record.publishedAt,
    };

    const messageString = JSON.stringify(message);
    const signature = signVerificationPayload(messageString);

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
        verificationKeyUrl: "/api/.well-known/gafaig-public-key",
        message,
        messageString,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: getCorsHeaders(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        verified: false,
        error:
          error instanceof Error
            ? error.message
            : "Verification endpoint failed",
      } satisfies VerifyApiResponse,
      {
        status: 500,
        headers: getCorsHeaders(),
      }
    );
  }
}
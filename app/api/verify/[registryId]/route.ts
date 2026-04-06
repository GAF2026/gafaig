import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";
import {
  GAFAIG_VERIFY_ALG,
  getSigningKeyId,
  signMessage,
} from "@/lib/crypto/verify-signing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type VerifyRow = {
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_SCORE: number | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Cache-Control": "no-store",
  };
}

function jsonUtc(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

function buildMeta(baseUrl: string, registryId: string) {
  return {
    surface: "GAFAIG Public Verification API",
    description:
      "This endpoint returns the public verification record and signed proof for a GAFAIG registry certification.",
    issuer: "GAFAIG",
    version: "v1",
    links: {
      registryRecord: `${baseUrl}/registry/${encodeURIComponent(registryId)}`,
      badge: `${baseUrl}/badge/${encodeURIComponent(registryId)}`,
      widgetPreview: `${baseUrl}/widget-preview/${encodeURIComponent(registryId)}`,
      verificationKey: `${baseUrl}/api/.well-known/gafaig-public-key`,
    },
  };
}

function buildCanonicalRecord(row: VerifyRow) {
  return {
    registryId: row.REGISTRY_ID,
    entityName: row.ENTITY_NAME,
    entityType: row.ENTITY_TYPE,
    country: row.COUNTRY,
    applicationId: row.APPLICATION_ID,
    caseId: row.CASE_ID,
    certificationStatus: row.CERTIFIED_AT ? "Certified" : "Not Certified",
    certifiedScore: row.CERTIFIED_SCORE,
    certifiedTier: row.CERTIFIED_TIER,
    certifiedBand: row.CERTIFIED_BAND,
    decisionStatus: row.DECISION_STATUS,
    certifiedAt: jsonUtc(row.CERTIFIED_AT),
    validFrom: jsonUtc(row.VALID_FROM),
    validTo: jsonUtc(row.VALID_TO),
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function GET(
  req: Request,
  { params }: { params: { registryId: string } }
) {
  const registryId = String(params.registryId || "").trim();
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const meta = buildMeta(baseUrl, registryId || "unknown");

  if (!registryId) {
    return NextResponse.json(
      {
        ok: false,
        verified: false,
        error: "Missing registryId",
        meta,
      },
      {
        status: 400,
        headers: corsHeaders(),
      }
    );
  }

  try {
    const rows = await sfQuery<VerifyRow>(
      `
      SELECT
        REGISTRY_ID,
        APPLICATION_ID,
        CASE_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        DECISION_STATUS,
        VALID_FROM,
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
      return NextResponse.json(
        {
          ok: false,
          verified: false,
          registryId,
          error: "Registry record not found",
          meta: buildMeta(baseUrl, registryId),
        },
        {
          status: 404,
          headers: corsHeaders(),
        }
      );
    }

    const record = buildCanonicalRecord(row);
    const verified = record.certifiedAt !== null;

    const messageObject = {
      issuer: "GAFAIG",
      registryId: record.registryId,
      entityName: record.entityName,
      entityType: record.entityType,
      country: record.country,
      applicationId: record.applicationId,
      caseId: record.caseId,
      certificationStatus: record.certificationStatus,
      certifiedScore: record.certifiedScore,
      certifiedTier: record.certifiedTier,
      certifiedBand: record.certifiedBand,
      decisionStatus: record.decisionStatus,
      certifiedAt: record.certifiedAt,
      validFrom: record.validFrom,
      validTo: record.validTo,
    };

    const messageString = JSON.stringify(messageObject);
    const signature = signMessage(messageString);
    const signedAt = new Date().toISOString();

    return NextResponse.json(
      {
        ok: true,
        verified,
        registryId: row.REGISTRY_ID,
        meta: buildMeta(baseUrl, row.REGISTRY_ID),
        proof: {
          alg: GAFAIG_VERIFY_ALG,
          kid: getSigningKeyId(),
          signature,
          signedAt,
          verificationKeyUrl: `${baseUrl}/api/.well-known/gafaig-public-key`,
          message: messageObject,
          messageString,
        },
        record,
      },
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error("VERIFY API ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        verified: false,
        error: "Internal verification error",
        meta,
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
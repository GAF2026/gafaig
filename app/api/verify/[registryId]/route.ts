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
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

function jsonUtc(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

export async function GET(
  req: Request,
  { params }: { params: { registryId: string } }
) {
  const registryId = String(params.registryId || "").trim();

  if (!registryId) {
    return NextResponse.json(
      {
        ok: false,
        verified: false,
        error: "Missing registryId",
      },
      { status: 400 }
    );
  }

  const rows = await sfQuery<VerifyRow>(
    `
    SELECT
      REGISTRY_ID,
      APPLICATION_ID,
      CASE_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
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
      },
      { status: 404 }
    );
  }

  const certificationStatus = row.CERTIFIED_AT ? "Certified" : "Not Certified";
  const signedAt = new Date().toISOString();
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const record = {
    registryId: row.REGISTRY_ID,
    entityName: row.ENTITY_NAME,
    entityType: row.ENTITY_TYPE,
    country: row.COUNTRY,
    applicationId: row.APPLICATION_ID,
    caseId: row.CASE_ID,
    certificationStatus,
    certifiedTier: row.CERTIFIED_TIER,
    certifiedBand: row.CERTIFIED_BAND,
    decisionStatus: row.DECISION_STATUS,
    certifiedAt: jsonUtc(row.CERTIFIED_AT),
    validFrom: jsonUtc(row.VALID_FROM),
    validTo: jsonUtc(row.VALID_TO),
  };

  const messageObject = {
    issuer: "GAFAIG",
    registryId: record.registryId,
    entityName: record.entityName,
    entityType: record.entityType,
    country: record.country,
    applicationId: record.applicationId,
    caseId: record.caseId,
    certificationStatus: record.certificationStatus,
    certifiedTier: record.certifiedTier,
    certifiedBand: record.certifiedBand,
    decisionStatus: record.decisionStatus,
    certifiedAt: record.certifiedAt,
    validFrom: record.validFrom,
    validTo: record.validTo,
    signedAt,
  };

  const message = JSON.stringify(messageObject);
  const signature = signMessage(message);

  return NextResponse.json({
    ok: true,
    verified: certificationStatus === "Certified",
    registryId: row.REGISTRY_ID,
    proof: {
      alg: GAFAIG_VERIFY_ALG,
      kid: getSigningKeyId(),
      signature,
      signedAt,
      verificationKeyUrl: `${baseUrl}/api/.well-known/gafaig-public-key`,
      message: messageObject,
    },
    record,
  });
}
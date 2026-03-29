import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

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

function jsonUtc(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

function signPayload(message: string) {
  const secret =
    process.env.GAFAIG_VERIFY_SIGNING_SECRET ||
    process.env.GAFAIG_REGISTRY_SIGNATURE_SECRET ||
    process.env.GAFAIG_SESSION_SECRET ||
    "gafaig-dev-signing-secret";

  return createHmac("sha256", secret).update(message).digest("hex");
}

export async function GET(
  _req: Request,
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
      },
      { status: 404 }
    );
  }

  const certificationStatus = row.CERTIFIED_AT ? "Certified" : "Not Certified";
  const verified = certificationStatus === "Certified";

  const record = {
    registryId: row.REGISTRY_ID,
    entityName: row.ENTITY_NAME,
    entityType: row.ENTITY_TYPE,
    country: row.COUNTRY,
    applicationId: row.APPLICATION_ID,
    caseId: row.CASE_ID,
    certificationStatus,
    certifiedScore:
      row.CERTIFIED_SCORE === null || row.CERTIFIED_SCORE === undefined
        ? null
        : Number(row.CERTIFIED_SCORE),
    certifiedTier: row.CERTIFIED_TIER,
    certifiedBand: row.CERTIFIED_BAND,
    decisionStatus: row.DECISION_STATUS,
    certifiedAt: jsonUtc(row.CERTIFIED_AT),
    validFrom: jsonUtc(row.VALID_FROM),
    validTo: jsonUtc(row.VALID_TO),
  };

  const signedAt = new Date().toISOString();

  const messageObject = {
    ...record,
    signedAt,
  };

  const message = JSON.stringify(messageObject);
  const signature = signPayload(message);

  return NextResponse.json({
    ok: true,
    verified,
    registryId: row.REGISTRY_ID,
    proof: {
      alg: "HS256",
      signature,
      signedAt,
      message: messageObject,
    },
    record,
  });
}
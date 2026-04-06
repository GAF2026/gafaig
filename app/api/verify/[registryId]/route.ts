import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
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

function asIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString();
}

export async function GET(
  _req: Request,
  { params }: { params: { registryId: string } }
) {
  const registryIdRaw = String(params.registryId || "").trim();

  if (!registryIdRaw) {
    return NextResponse.json(
      {
        ok: false,
        verified: false,
        error: "Missing registryId",
      },
      { status: 400, headers: { "Cache-Control": "no-store" } }
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
      FROM V_REGISTRY_PUBLIC
      WHERE UPPER(REGEXP_REPLACE(REGISTRY_ID, '[^A-Za-z0-9]', '')) =
            UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
      LIMIT 1
      `,
      [registryIdRaw]
    );

    const row = rows[0];

    if (!row) {
      return NextResponse.json(
        {
          ok: false,
          verified: false,
          error: "Registry record not found",
        },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    const certifiedAt = asIso(row.CERTIFIED_AT);
    const validFrom = asIso(row.VALID_FROM);
    const validTo = asIso(row.VALID_TO);
    const decisionStatus = row.DECISION_STATUS ?? null;
    const verified = String(decisionStatus || "").toUpperCase() === "APPROVED";

    const record = {
      registryId: row.REGISTRY_ID,
      entityName: row.ENTITY_NAME,
      entityType: row.ENTITY_TYPE,
      country: row.COUNTRY,
      applicationId: row.APPLICATION_ID,
      caseId: row.CASE_ID,
      certificationStatus: certifiedAt ? "Certified" : "Not Certified",
      certifiedScore:
        row.CERTIFIED_SCORE !== null && row.CERTIFIED_SCORE !== undefined
          ? Number(row.CERTIFIED_SCORE)
          : null,
      certifiedTier: row.CERTIFIED_TIER,
      certifiedBand: row.CERTIFIED_BAND,
      decisionStatus,
      certifiedAt,
      validFrom,
      validTo,
    };

    const proofMessage = {
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

    return NextResponse.json(
      {
        ok: true,
        verified,
        registryId: row.REGISTRY_ID,
        proof: {
          alg: "Ed25519",
          kid: "gafaig-public-key",
          signature: "",
          signedAt: certifiedAt,
          verificationKeyUrl: "/api/.well-known/gafaig-public-key",
          message: proofMessage,
          messageString: JSON.stringify(proofMessage),
        },
        record,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        verified: false,
        error:
          error instanceof Error ? error.message : "Internal verification error",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
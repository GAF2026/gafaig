import { createPrivateKey, sign as cryptoSign } from "crypto";
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

type ProofMessage = {
  registryId: string;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  applicationId: string | null;
  caseId: string | null;
  certificationStatus: string;
  certifiedScore: number | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
};

function asIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString();
}

function base64Url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`);

  return `{${entries.join(",")}}`;
}

function getPrivateKeyPem(): string {
  const raw = process.env.GAFAIG_VERIFY_PRIVATE_KEY?.trim();

  if (!raw) {
    throw new Error("GAFAIG_VERIFY_PRIVATE_KEY is not configured.");
  }

  return raw.replace(/\\n/g, "\n");
}

function signProofMessage(messageString: string): string {
  const privateKey = createPrivateKey({
    key: getPrivateKeyPem(),
    format: "pem",
  });

  const signature = cryptoSign(
    null,
    Buffer.from(messageString, "utf8"),
    privateKey
  );

  return base64Url(signature);
}

function getCorsHeaders(origin?: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin?.trim() || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    "Cache-Control": "no-store",
  };
}

function jsonWithCors(
  body: unknown,
  init: { status?: number; origin?: string | null } = {}
) {
  return NextResponse.json(body, {
    status: init.status ?? 200,
    headers: getCorsHeaders(init.origin),
  });
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(
  req: Request,
  { params }: { params: { registryId: string } }
) {
  const origin = req.headers.get("origin");
  const registryIdRaw = String(params.registryId || "").trim();

  if (!registryIdRaw) {
    return jsonWithCors(
      {
        ok: false,
        verified: false,
        error: "Missing registryId",
      },
      { status: 400, origin }
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
      return jsonWithCors(
        {
          ok: false,
          verified: false,
          error: "Registry record not found",
        },
        { status: 404, origin }
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

    const proofMessage: ProofMessage = {
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

    const messageString = stableStringify(proofMessage);
    const signature = signProofMessage(messageString);
    const signedAt = new Date().toISOString();
    const kid = process.env.GAFAIG_VERIFY_KEY_ID?.trim() || "gafaig-public-key";
    const siteUrl =
      String(process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "") ||
      "http://localhost:3000";

    return jsonWithCors(
      {
        ok: true,
        verified,
        registryId: row.REGISTRY_ID,
        proof: {
          alg: "Ed25519",
          kid,
          signature,
          signedAt,
          verificationKeyUrl: `${siteUrl}/api/.well-known/gafaig-public-key`,
          message: proofMessage,
          messageString,
        },
        record,
      },
      { origin }
    );
  } catch (error) {
    return jsonWithCors(
      {
        ok: false,
        verified: false,
        error:
          error instanceof Error ? error.message : "Internal verification error",
      },
      { status: 500, origin }
    );
  }
}
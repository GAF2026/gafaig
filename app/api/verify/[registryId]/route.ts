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
  decisionStatus: string | null;
  certifiedScore: number | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  signedAt: string;
};

function asIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString();
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
  const raw = process.env.GAFAIG_SIGNING_PRIVATE_KEY_PEM;

  if (!raw) {
    throw new Error("Missing GAFAIG_SIGNING_PRIVATE_KEY_PEM");
  }

  return raw.replace(/\\n/g, "\n").trim();
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

  return signature.toString("base64");
}

function getCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
  };
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: getCorsHeaders(),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function GET(
  req: Request,
  { params }: { params: { registryId: string } }
) {
  const registryIdRaw = String(params.registryId || "").trim();

  if (!registryIdRaw) {
    return json({ ok: false, error: "Missing registryId" }, 400);
  }

  try {
    const rows = await sfQuery<VerifyRow>(
      `
      SELECT *
      FROM V_REGISTRY_PUBLIC
      WHERE UPPER(REGISTRY_ID) = UPPER(?)
      LIMIT 1
      `,
      [registryIdRaw]
    );

    const row = rows[0];

    if (!row) {
      return json({ ok: false, error: "Registry record not found" }, 404);
    }

    const certifiedAt = asIso(row.CERTIFIED_AT);
    const validFrom = asIso(row.VALID_FROM);
    const validTo = asIso(row.VALID_TO);
    const decisionStatus = row.DECISION_STATUS ?? null;

    // ✅ Canonical trust state
    const certificationStatus = certifiedAt
      ? "Certified"
      : decisionStatus === "APPROVED"
      ? "Approved"
      : "Pending";

    const signedAt = new Date().toISOString();

    const proofMessage: ProofMessage = {
      registryId: row.REGISTRY_ID,
      entityName: row.ENTITY_NAME,
      entityType: row.ENTITY_TYPE,
      country: row.COUNTRY,
      applicationId: row.APPLICATION_ID,
      caseId: row.CASE_ID,
      decisionStatus,
      certifiedScore: row.CERTIFIED_SCORE,
      certifiedTier: row.CERTIFIED_TIER,
      certifiedBand: row.CERTIFIED_BAND,
      certifiedAt,
      validFrom,
      validTo,
      signedAt,
    };

    const messageString = stableStringify(proofMessage);
    const signature = signProofMessage(messageString);

    const kid =
      process.env.GAFAIG_SIGNING_KEY_ID || "gafaig-ed25519-2026-01";

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.gafaig.com";

    return json({
      ok: true,
      verified: true, // ✅ cryptographic layer always returns signed truth
      registryId: row.REGISTRY_ID,
      record: {
        registryId: row.REGISTRY_ID,
        entityName: row.ENTITY_NAME,
        entityType: row.ENTITY_TYPE,
        country: row.COUNTRY,
        applicationId: row.APPLICATION_ID,
        caseId: row.CASE_ID,
        certificationStatus,
        certifiedScore: row.CERTIFIED_SCORE,
        certifiedTier: row.CERTIFIED_TIER,
        certifiedBand: row.CERTIFIED_BAND,
        decisionStatus,
        certifiedAt,
        validFrom,
        validTo,
      },
      proof: {
        alg: "Ed25519",
        kid,
        signature,
        signedAt,
        verificationKeyUrl: `${baseUrl}/api/.well-known/gafaig-public-key`,
        message: proofMessage,
        messageString,
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Verification error",
      },
      500
    );
  }
}
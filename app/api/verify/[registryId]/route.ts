import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getRegistryVerificationByRegistryId } from "@/lib/queries/registry";
import type { VerifyApiResponse } from "@/types/registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function toBase64Url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function normalizeRegistryId(value: string) {
  return String(value || "").trim().toUpperCase();
}

function isCanonicalRegistryId(value: string) {
  return /^GAFAIG-[A-F0-9]+$/.test(normalizeRegistryId(value));
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function isCurrentlyValidRecord(
  row: {
    decisionStatus: string | null;
    validFrom: string | null;
    validTo: string | null;
    renewalStatus: string | null;
  },
  now = new Date()
) {
  const decisionStatus = String(row.decisionStatus || "").trim().toLowerCase();

  // Registry rows are publicly valid when they are already published.
  // Keep approved as valid too for compatibility.
  if (decisionStatus !== "published" && decisionStatus !== "approved") {
    return false;
  }

  const renewalStatus = String(row.renewalStatus || "").trim().toLowerCase();
  if (renewalStatus === "not_certified") {
    return false;
  }

  const validFrom = parseDate(row.validFrom);
  const validTo = parseDate(row.validTo);

  if (validFrom && now < validFrom) return false;
  if (validTo && now >= validTo) return false;

  return true;
}

function canonicalPayload(row: {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certifiedScore: number | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
  lastActivityAt: string | null;
  snapshotId: string | null;
  modelVersion: string | null;
  renewalStatus: string | null;
  scoredAt: string | null;
}) {
  const payload = {
    applicationId: row.applicationId ?? "",
    caseId: row.caseId ?? "",
    certifiedAt: row.certifiedAt ?? "",
    certifiedBand: row.certifiedBand ?? "",
    certifiedScore:
      row.certifiedScore === null || row.certifiedScore === undefined
        ? ""
        : String(row.certifiedScore),
    certifiedTier: row.certifiedTier ?? "",
    country: row.country ?? "",
    decisionStatus: row.decisionStatus ?? "",
    entityName: row.entityName ?? "",
    entityType: row.entityType ?? "",
    lastActivityAt: row.lastActivityAt ?? "",
    modelVersion: row.modelVersion ?? "",
    registryId: row.registryId,
    renewalStatus: row.renewalStatus ?? "",
    scoredAt: row.scoredAt ?? "",
    snapshotId: row.snapshotId ?? "",
    validFrom: row.validFrom ?? "",
    validTo: row.validTo ?? "",
  };

  const keys = Object.keys(payload).sort();
  const stable: Record<string, string> = {};

  for (const key of keys) {
    stable[key] = String(payload[key as keyof typeof payload] ?? "");
  }

  return stable;
}

function signPayload(payload: Record<string, string>, secret: string) {
  const message = JSON.stringify(payload);
  const mac = crypto
    .createHmac("sha256", secret)
    .update(message, "utf8")
    .digest();

  return {
    alg: "HS256",
    signature: toBase64Url(mac),
    message,
  };
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function cacheHeaders(verified: boolean) {
  if (verified) {
    return {
      "Cache-Control":
        "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
    };
  }

  return {
    "Cache-Control":
      "public, max-age=30, s-maxage=60, stale-while-revalidate=600",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(),
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ registryId: string }> }
) {
  const { registryId: rawRegistryId } = await ctx.params;
  const registryId = normalizeRegistryId(rawRegistryId ?? "");

  if (!registryId) {
    const response: VerifyApiResponse = {
      ok: false,
      error: "Missing registryId",
      verified: false,
      registryId,
    };

    return NextResponse.json(response, {
      status: 400,
      headers: { ...corsHeaders(), ...cacheHeaders(false) },
    });
  }

  if (!isCanonicalRegistryId(registryId)) {
    const response: VerifyApiResponse = {
      ok: false,
      error: "Invalid registryId format",
      verified: false,
      registryId,
    };

    return NextResponse.json(response, {
      status: 400,
      headers: { ...corsHeaders(), ...cacheHeaders(false) },
    });
  }

  const secret = process.env.GAFAIG_VERIFY_SIGNING_SECRET;
  if (!secret || secret.trim().length < 32) {
    const response: VerifyApiResponse = {
      ok: false,
      error:
        "Server misconfigured: missing GAFAIG_VERIFY_SIGNING_SECRET (min 32 chars).",
      verified: false,
      registryId,
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { ...corsHeaders(), ...cacheHeaders(false) },
    });
  }

  try {
    const now = new Date();
    const row = await getRegistryVerificationByRegistryId(registryId);

    if (!row) {
      const response: VerifyApiResponse = {
        ok: true,
        registryId,
        verified: false,
        reason: "not_found",
        now: now.toISOString(),
      };

      return NextResponse.json(response, {
        status: 200,
        headers: { ...corsHeaders(), ...cacheHeaders(false) },
      });
    }

    const verified = isCurrentlyValidRecord(row, now);
    const payload = canonicalPayload(row);
    const signed = signPayload(payload, secret);

    const response: VerifyApiResponse = {
      ok: true,
      registryId,
      verified,
      record: {
        registryId: row.registryId,
        applicationId: row.applicationId,
        caseId: row.caseId,
        entityName: row.entityName,
        entityType: row.entityType,
        country: row.country,
        certifiedScore: row.certifiedScore,
        certifiedTier: row.certifiedTier,
        certifiedBand: row.certifiedBand,
        decisionStatus: row.decisionStatus,
        validFrom: row.validFrom,
        validTo: row.validTo,
        certifiedAt: row.certifiedAt,
        lastActivityAt: row.lastActivityAt,
        snapshotId: row.snapshotId,
        modelVersion: row.modelVersion,
        renewalStatus: row.renewalStatus,
        scoredAt: row.scoredAt,
        isCurrentlyValid: verified,
      },
      proof: {
        alg: signed.alg,
        signature: signed.signature,
        message: signed.message,
        signedAt: now.toISOString(),
      },
      now: now.toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        ...corsHeaders(),
        ...cacheHeaders(verified),
      },
    });
  } catch (error) {
    const response: VerifyApiResponse = {
      ok: false,
      error:
        error instanceof Error ? error.message : "Verification query failed.",
      verified: false,
      registryId,
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { ...corsHeaders(), ...cacheHeaders(false) },
    });
  }
}
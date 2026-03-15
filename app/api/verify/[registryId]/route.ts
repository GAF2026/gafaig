import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { isGafaigRegistryId } from "@/lib/ids";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RegistryRow = {
  registryId: string;
  applicationId: string;
  entityName: string;
  entityType: string | null;
  country: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string;
  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
  lastActivityAt: string | null;
};

type RegistryApiResponse =
  | {
      ok: true;
      rows: RegistryRow[];
      total: number;
      limit: number;
      filters?: {
        q: string;
        country: string;
        registryId: string;
      };
    }
  | { ok: false; error: string };

function toBase64Url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function safeUpper(value: string) {
  return String(value || "").trim().toUpperCase();
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function isCurrentlyValidRecord(row: RegistryRow, now = new Date()) {
  if (String(row.decisionStatus || "").toLowerCase() !== "approved") {
    return false;
  }

  const validFrom = parseDate(row.validFrom);
  const validTo = parseDate(row.validTo);

  if (validFrom && now < validFrom) return false;
  if (validTo && now >= validTo) return false;

  return true;
}

function canonicalPayload(row: RegistryRow) {
  const payload = {
    registryId: row.registryId,
    applicationId: row.applicationId,
    entityName: row.entityName,
    entityType: row.entityType ?? "",
    country: row.country ?? "",
    decisionStatus: row.decisionStatus,
    certifiedTier: row.certifiedTier ?? "",
    certifiedBand: row.certifiedBand ?? "",
    validFrom: row.validFrom ?? "",
    validTo: row.validTo ?? "",
    certifiedAt: row.certifiedAt ?? "",
    lastActivityAt: row.lastActivityAt ?? "",
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
  req: NextRequest,
  ctx: { params: Promise<{ registryId: string }> },
) {
  const { registryId: rawRegistryId } = await ctx.params;
  const registryId = safeUpper(rawRegistryId ?? "");

  if (!registryId) {
    return NextResponse.json(
      { ok: false, error: "Missing registryId" },
      { status: 400, headers: { ...corsHeaders(), ...cacheHeaders(false) } },
    );
  }

  if (!isGafaigRegistryId(registryId)) {
    return NextResponse.json(
      { ok: false, error: "Invalid registryId format" },
      { status: 400, headers: { ...corsHeaders(), ...cacheHeaders(false) } },
    );
  }

  const secret = process.env.GAFAIG_VERIFY_SIGNING_SECRET;
  if (!secret || secret.trim().length < 32) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server misconfigured: missing GAFAIG_VERIFY_SIGNING_SECRET (min 32 chars).",
      },
      { status: 500, headers: { ...corsHeaders(), ...cacheHeaders(false) } },
    );
  }

  const now = new Date();
  const origin = new URL(req.url).origin;
  const url = new URL("/api/registry", origin);

  url.searchParams.set("limit", "1");
  url.searchParams.set("registryId", registryId);

  let reg: RegistryApiResponse;

  try {
    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    reg = (await res.json()) as RegistryApiResponse;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to query registry.",
      },
      { status: 500, headers: { ...corsHeaders(), ...cacheHeaders(false) } },
    );
  }

  if (!reg.ok) {
    return NextResponse.json(
      { ok: false, error: reg.error || "Registry query failed." },
      { status: 500, headers: { ...corsHeaders(), ...cacheHeaders(false) } },
    );
  }

  const row = reg.rows?.[0];

  if (!row) {
    return NextResponse.json(
      {
        ok: true,
        registryId,
        verified: false,
        reason: "not_found",
        now: now.toISOString(),
      },
      { status: 200, headers: { ...corsHeaders(), ...cacheHeaders(false) } },
    );
  }

  const verified = isCurrentlyValidRecord(row, now);
  const payload = canonicalPayload(row);
  const signed = signPayload(payload, secret);

  return NextResponse.json(
    {
      ok: true,
      registryId,
      verified,
      record: {
        ...row,
        isCurrentlyValid: verified,
      },
      proof: {
        alg: signed.alg,
        signature: signed.signature,
        message: signed.message,
        signedAt: now.toISOString(),
      },
      now: now.toISOString(),
    },
    {
      status: 200,
      headers: {
        ...corsHeaders(),
        ...cacheHeaders(verified),
      },
    },
  );
}
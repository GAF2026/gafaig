import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isGafaigRegistryId } from "@/lib/ids";

export const dynamic = "force-dynamic";

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
      filters?: { q: string; country: string; registryId: string };
    }
  | { ok: false; error: string };

function toBase64Url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function safeUpper(v: string) {
  return String(v || "").trim().toUpperCase();
}

function parseDate(v: string | null | undefined) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function isCurrentlyValidRecord(row: RegistryRow, now = new Date()) {
  if (String(row.decisionStatus || "").toLowerCase() !== "approved") return false;

  const vf = parseDate(row.validFrom);
  const vt = parseDate(row.validTo);

  if (vf && now < vf) return false;
  if (vt && now >= vt) return false;

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
  };

  const keys = Object.keys(payload).sort();
  const stableObj: Record<string, any> = {};
  for (const k of keys) stableObj[k] = (payload as any)[k];

  return stableObj;
}

function signPayload(payload: Record<string, any>, secret: string) {
  const msg = JSON.stringify(payload);
  const mac = crypto.createHmac("sha256", secret).update(msg, "utf8").digest();
  return {
    alg: "HS256",
    signature: toBase64Url(mac),
    message: msg,
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
  ctx: { params: { registryId: string } }
) {
  const registryIdRaw = ctx?.params?.registryId ?? "";
  const registryId = safeUpper(registryIdRaw);

  if (!registryId) {
    return NextResponse.json(
      { ok: false, error: "Missing registryId" },
      { status: 400, headers: { ...corsHeaders(), ...cacheHeaders(false) } }
    );
  }

  if (!isGafaigRegistryId(registryId)) {
    return NextResponse.json(
      { ok: false, error: "Invalid registryId format" },
      { status: 400, headers: { ...corsHeaders(), ...cacheHeaders(false) } }
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
      { status: 500, headers: { ...corsHeaders(), ...cacheHeaders(false) } }
    );
  }

  const now = new Date();
  const origin = new URL(req.url).origin;

  const url = new URL(`${origin}/api/registry`);
  url.searchParams.set("limit", "1");
  url.searchParams.set("registryId", registryId);

  let reg: RegistryApiResponse;
  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    reg = (await res.json()) as RegistryApiResponse;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to query registry." },
      { status: 500, headers: { ...corsHeaders(), ...cacheHeaders(false) } }
    );
  }

  if (!reg.ok) {
    return NextResponse.json(
      { ok: false, error: reg.error || "Registry query failed." },
      { status: 500, headers: { ...corsHeaders(), ...cacheHeaders(false) } }
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
      { status: 200, headers: { ...corsHeaders(), ...cacheHeaders(false) } }
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
    }
  );
}
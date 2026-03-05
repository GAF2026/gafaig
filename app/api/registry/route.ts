// app/api/registry/route.ts
import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
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

  // normalized helpers for UI search
  entityNameNorm: string;
  countryNorm: string | null;
  q: string;
};

type Ok = {
  ok: true;
  rows: RegistryRow[];
  total: number;
  limit: number;
  filters: { q: string; country: string; registryId: string };
};
type Err = { ok: false; error: string };

function s(v: any): string | null {
  if (v === null || v === undefined) return null;
  const out = String(v);
  return out.length ? out : null;
}

function cleanLike(v: string) {
  // keep substring search simple + safe (parameterized)
  return v.trim();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const limitRaw = url.searchParams.get("limit");
    const limit = Math.min(Math.max(Number(limitRaw ?? "50") || 50, 1), 200);

    const q = cleanLike(url.searchParams.get("q") || "");
    const country = cleanLike(url.searchParams.get("country") || "");
    const registryId = cleanLike(url.searchParams.get("registryId") || "");

    // We query the normalized search view (already approved + currently valid by design of V_REGISTRY_PUBLIC)
    // and apply simple optional filters.
    const sql = `
      SELECT
        registry_id,
        application_id,
        entity_name,
        entity_type,
        country,
        certified_tier,
        certified_band,
        decision_status,
        valid_from,
        valid_to,
        certified_at,
        last_activity_at,
        entity_name_norm,
        country_norm,
        q
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC_SEARCH
      WHERE 1=1
        AND ( ? = '' OR q ILIKE '%' || ? || '%' )
        AND ( ? = '' OR country_norm = UPPER(?) )
        AND ( ? = '' OR registry_id = ? )
      ORDER BY certified_at DESC NULLS LAST, last_activity_at DESC NULLS LAST
      LIMIT ?
    `;

    const params = [q, q, country, country, registryId, registryId, limit];

    const raw = await sfQuery<any>(sql, params);

    const rows: RegistryRow[] = raw.map((r: any) => ({
      registryId: String(r.REGISTRY_ID),
      applicationId: String(r.APPLICATION_ID),

      entityName: String(r.ENTITY_NAME ?? "Unknown"),
      entityType: s(r.ENTITY_TYPE),
      country: s(r.COUNTRY),

      certifiedTier: s(r.CERTIFIED_TIER),
      certifiedBand: s(r.CERTIFIED_BAND),
      decisionStatus: String(r.DECISION_STATUS ?? "unknown"),

      validFrom: s(r.VALID_FROM),
      validTo: s(r.VALID_TO),

      certifiedAt: s(r.CERTIFIED_AT),
      lastActivityAt: s(r.LAST_ACTIVITY_AT),

      entityNameNorm: String(r.ENTITY_NAME_NORM ?? ""),
      countryNorm: s(r.COUNTRY_NORM),
      q: String(r.Q ?? ""),
    }));

    return NextResponse.json(
      {
        ok: true,
        rows,
        total: rows.length,
        limit,
        filters: { q, country, registryId },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Registry endpoint failed." } as Err,
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
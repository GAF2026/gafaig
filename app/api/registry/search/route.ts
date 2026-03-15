import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegistrySearchRow = {
  registryId: string;
  caseId: string | null;
  applicationId: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;

  validFrom: string | null;
  validTo: string | null;

  certifiedAt: string | null;
  lastActivityAt: string | null;

  registryIdNorm: string | null;
  entityNameNorm: string | null;
  countryNorm: string | null;
  q: string | null;
};

type OkResponse = {
  ok: true;
  rows: RegistrySearchRow[];
  total: number;
  limit: number;
  filters: {
    q: string;
    country: string;
    registryId: string;
    caseId: string;
    applicationId: string;
  };
};

type ErrorResponse = {
  ok: false;
  error: string;
};

function s(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const out = String(value).trim();
  return out.length ? out : null;
}

function clean(value: string | null): string {
  return String(value ?? "").trim();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const limitRaw = Number(url.searchParams.get("limit") || "50");
    const limit = Math.min(Math.max(limitRaw || 50, 1), 200);

    const q = clean(url.searchParams.get("q"));
    const country = clean(url.searchParams.get("country"));
    const registryId = clean(url.searchParams.get("registryId")).toUpperCase();
    const caseId = clean(url.searchParams.get("caseId")).toUpperCase();
    const applicationId = clean(url.searchParams.get("applicationId")).toUpperCase();

    const sql = `
      SELECT
        REGISTRY_ID,
        CASE_ID,
        APPLICATION_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        DECISION_STATUS,
        VALID_FROM,
        VALID_TO,
        CERTIFIED_AT,
        LAST_ACTIVITY_AT,
        REGISTRY_ID_NORM,
        ENTITY_NAME_NORM,
        COUNTRY_NORM,
        Q
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC_SEARCH
      WHERE 1 = 1
        AND (? = '' OR Q ILIKE '%' || ? || '%')
        AND (? = '' OR COUNTRY_NORM = UPPER(?))
        AND (? = '' OR REGISTRY_ID_NORM = ?)
        AND (? = '' OR UPPER(COALESCE(CASE_ID, '')) = ?)
        AND (? = '' OR UPPER(COALESCE(APPLICATION_ID, '')) = ?)
      ORDER BY CERTIFIED_AT DESC NULLS LAST, LAST_ACTIVITY_AT DESC NULLS LAST
      LIMIT ?
    `;

    const params = [
      q,
      q,
      country,
      country,
      registryId,
      registryId,
      caseId,
      caseId,
      applicationId,
      applicationId,
      limit,
    ];

    const raw = await sfQuery<Record<string, unknown>>(sql, params);

    const rows: RegistrySearchRow[] = raw.map((row) => ({
      registryId: String(row.REGISTRY_ID ?? ""),
      caseId: s(row.CASE_ID),
      applicationId: s(row.APPLICATION_ID),

      entityName: s(row.ENTITY_NAME),
      entityType: s(row.ENTITY_TYPE),
      country: s(row.COUNTRY),

      certifiedTier: s(row.CERTIFIED_TIER),
      certifiedBand: s(row.CERTIFIED_BAND),
      decisionStatus: s(row.DECISION_STATUS),

      validFrom: s(row.VALID_FROM),
      validTo: s(row.VALID_TO),

      certifiedAt: s(row.CERTIFIED_AT),
      lastActivityAt: s(row.LAST_ACTIVITY_AT),

      registryIdNorm: s(row.REGISTRY_ID_NORM),
      entityNameNorm: s(row.ENTITY_NAME_NORM),
      countryNorm: s(row.COUNTRY_NORM),
      q: s(row.Q),
    }));

    const response: OkResponse = {
      ok: true,
      rows,
      total: rows.length,
      limit,
      filters: {
        q,
        country,
        registryId,
        caseId,
        applicationId,
      },
    };

    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const response: ErrorResponse = {
      ok: false,
      error: error instanceof Error ? error.message : "Registry search failed.",
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
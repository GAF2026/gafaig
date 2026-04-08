import { NextResponse } from "next/server";
import type { RegistryApiResponse, RegistryRow } from "@/types/registry";
import { getRegistryRecords, searchRegistryRecords } from "@/lib/queries/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function clean(value: string | null): string {
  return String(value ?? "").trim();
}

function toRegistryRow(row: {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
}): RegistryRow {
  return {
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
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const limitRaw = Number(url.searchParams.get("limit") || "50");
    const limit = Math.min(Math.max(limitRaw || 50, 1), 200);

    const q = clean(url.searchParams.get("q"));
    const country = clean(url.searchParams.get("country"));
    const registryId = clean(url.searchParams.get("registryId"));
    const caseId = clean(url.searchParams.get("caseId"));
    const applicationId = clean(url.searchParams.get("applicationId"));

    const hasFilters =
      q.length > 0 ||
      country.length > 0 ||
      registryId.length > 0 ||
      caseId.length > 0 ||
      applicationId.length > 0;

    const rows = hasFilters
      ? await searchRegistryRecords({
          q,
          country,
          registryId,
          caseId,
          applicationId,
          limit,
        })
      : await getRegistryRecords(limit);

    const response: RegistryApiResponse = {
      ok: true,
      rows: rows.map(toRegistryRow),
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
    const response: RegistryApiResponse = {
      ok: false,
      error: error instanceof Error ? error.message : "Registry endpoint failed.",
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
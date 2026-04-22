import { NextResponse } from "next/server";
import { searchRegistryRecords } from "@/lib/queries/registry";
import type { RegistryApiResponse, RegistryRow } from "@/types/registry";

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
  certificationStatus?: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  lifecycleStatus?: string | null;
  renewalStatus?: string | null;
  publishedAt?: string | null;
  certifiedScore?: string | number | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
}): RegistryRow {
  return {
    registryId: row.registryId,
    applicationId: row.applicationId,
    caseId: row.caseId,
    entityName: row.entityName,
    entityType: row.entityType,
    country: row.country,
    certifiedScore:
      row.certifiedScore === null ||
      row.certifiedScore === undefined ||
      row.certifiedScore === ""
        ? null
        : Number(row.certifiedScore),
    certifiedTier: row.certifiedTier ?? null,
    certifiedBand: row.certifiedBand ?? null,
    decisionStatus: row.decisionStatus ?? row.certificationStatus ?? null,
    validFrom: row.validFrom,
    validTo: row.validTo,
    certifiedAt: row.certifiedAt,
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const limitRaw = Number(url.searchParams.get("limit") || "50");
    const limit = Math.min(Math.max(limitRaw || 50, 1), 500);

    const q = clean(url.searchParams.get("q"));
    const country = clean(url.searchParams.get("country"));
    const registryId = clean(url.searchParams.get("registryId"));
    const caseId = clean(url.searchParams.get("caseId"));
    const applicationId = clean(url.searchParams.get("applicationId"));

    const rows = await searchRegistryRecords({
      q,
      country,
      registryId,
      caseId,
      applicationId,
      limit,
    });

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
      error:
        error instanceof Error
          ? error.message
          : "Registry endpoint failed.",
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
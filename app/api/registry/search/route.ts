import { NextResponse } from "next/server";
import { searchRegistryRecords } from "@/lib/queries/registry";
import type { RegistryApiResponse, RegistryRow } from "@/types/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function clean(value: string | null): string {
  return String(value ?? "").trim();
}

function toRegistryRow(row: any): RegistryRow {
  return {
    registryId: row.registryId,
    applicationId: row.applicationId ?? null,
    caseId: row.caseId ?? null,
    entityName: row.entityName ?? null,
    entityType: row.entityType ?? null,
    country: row.country ?? null,
    certifiedScore:
      row.certifiedScore === null ||
      row.certifiedScore === undefined ||
      row.certifiedScore === ""
        ? null
        : Number(row.certifiedScore),
    certifiedTier: row.certifiedTier ?? null,
    certifiedBand: row.certifiedBand ?? null,
    decisionStatus:
      row.decisionStatus ?? row.certificationStatus ?? null,
    validFrom: row.validFrom ?? null,
    validTo: row.validTo ?? null,
    certifiedAt: row.certifiedAt ?? null,
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
      rows: rows.map((row) => toRegistryRow(row)),
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
          : "Registry search endpoint failed.",
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
import { NextResponse } from "next/server";
import { searchRegistryRecords } from "@/lib/queries/registry";
import type { RegistryApiResponse, RegistryRow } from "@/types/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function clean(value: string | null): string {
  return String(value ?? "").trim();
}

function toRegistryRow(row: RegistryRow): RegistryRow {
  return {
    registrySnapshotId: row.registrySnapshotId ?? null,
    registryId: row.registryId,
    applicationId: row.applicationId ?? null,
    caseId: row.caseId ?? null,
    entityName: row.entityName ?? null,
    entityType: row.entityType ?? null,
    country: row.country ?? null,
    certificationStatus: row.certificationStatus ?? null,
    validFrom: row.validFrom ?? null,
    validTo: row.validTo ?? null,
    certifiedAt: row.certifiedAt ?? null,
    lifecycleStatus: row.lifecycleStatus ?? null,
    visibilityStatus: row.visibilityStatus ?? null,
    verificationEligible: row.verificationEligible ?? null,
    badgeEligible: row.badgeEligible ?? null,
    renewalStatus: row.renewalStatus ?? null,
    publishedAt: row.publishedAt ?? null,
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
      rows: rows.map((row) => toRegistryRow(row as RegistryRow)),
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
  } catch (_error) {
    const response: RegistryApiResponse = {
      ok: false,
      error: "Registry search endpoint failed.",
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
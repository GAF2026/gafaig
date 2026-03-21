import { NextResponse } from "next/server";
import { searchRegistryRecords } from "@/lib/queries/registry";

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
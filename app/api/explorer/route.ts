import { NextResponse } from "next/server";
import {
  getExplorerSummary,
  getRecentRegistryRecords,
  getExplorerOrganizations,
  getExplorerCountries,
  getExplorerSystems,
} from "@/lib/queries/explorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [summary, recent, organizations, countries, systems] =
      await Promise.all([
        getExplorerSummary(),
        getRecentRegistryRecords(10),
        getExplorerOrganizations(50),
        getExplorerCountries(50),
        getExplorerSystems(50),
      ]);

    return NextResponse.json(
      {
        ok: true,
        summary,
        recent,
        organizations,
        countries,
        systems,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Explorer API failed",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
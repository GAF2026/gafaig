import { NextResponse } from "next/server";
import {
  getExplorerStats,
  getLatestExplorerRecords,
  getExplorerOrganizations,
  getExplorerCountries,
} from "@/lib/queries/explorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [stats, records, organizations, countries] = await Promise.all([
      getExplorerStats(),
      getLatestExplorerRecords(8),
      getExplorerOrganizations(8),
      getExplorerCountries(8),
    ]);

    return NextResponse.json({
      ok: true,
      stats,
      records,
      organizations,
      countries,
    });
  } catch (error) {
    console.error("Explorer API error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Explorer API failed",
      },
      { status: 500 }
    );
  }
}
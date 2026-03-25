import { NextResponse } from "next/server";
import {
  getExplorerGlobalStats,
  getExplorerByCountry,
  getExplorerByStatus,
  getExplorerByTier,
  getExplorerByBand,
  getExplorerByEntityType,
} from "@/lib/queries/explorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      global,
      byCountry,
      byStatus,
      byTier,
      byBand,
      byEntityType,
    ] = await Promise.all([
      getExplorerGlobalStats(),
      getExplorerByCountry(),
      getExplorerByStatus(),
      getExplorerByTier(),
      getExplorerByBand(),
      getExplorerByEntityType(),
    ]);

    return NextResponse.json({
      ok: true,
      global,
      byCountry,
      byStatus,
      byTier,
      byBand,
      byEntityType,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Explorer query failed";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
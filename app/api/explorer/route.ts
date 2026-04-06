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
export const revalidate = 0;

export async function GET() {
  try {
    const [
      global,
      countries,
      status,
      tier,
      band,
      entityType,
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
      data: {
        global,
        countries,
        status,
        tier,
        band,
        entityType,
      },
    });
  } catch (error) {
    console.error("EXPLORER API ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Explorer API failed",
      },
      { status: 500 }
    );
  }
}
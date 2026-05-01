// app/api/explorer/route.ts

import { NextResponse } from "next/server";
import { getExplorerData } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getExplorerData();

    return NextResponse.json({
      ok: true,
      ...data,
    });
  } catch (err) {
    console.error("Explorer API error:", err);

    return NextResponse.json(
      {
        ok: false,
        stats: {
          totalRecords: 0,
          totalCountries: 0,
          totalEntities: 0,
        },
        records: [],
      },
      { status: 500 }
    );
  }
}
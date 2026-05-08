import { NextResponse } from "next/server";
import { getLifecycleRecords } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await getLifecycleRecords(200);

    return NextResponse.json({
      ok: true,
      records,
    });
  } catch (err) {
    console.error("Explorer lifecycle API error:", err);

    return NextResponse.json(
      {
        ok: false,
        records: [],
      },
      { status: 500 }
    );
  }
}
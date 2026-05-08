import { NextResponse } from "next/server";
import { getRenewalRecords } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await getRenewalRecords(200);

    return NextResponse.json({
      ok: true,
      records,
    });
  } catch (err) {
    console.error("Explorer renewals API error:", err);

    return NextResponse.json(
      {
        ok: false,
        records: [],
      },
      { status: 500 }
    );
  }
}
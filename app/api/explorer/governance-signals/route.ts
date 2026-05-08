import { NextResponse } from "next/server";
import { getGovernanceSignals } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const signals = await getGovernanceSignals();

    return NextResponse.json({
      ok: true,
      signals,
    });
  } catch (err) {
    console.error("Explorer governance signals API error:", err);

    return NextResponse.json(
      {
        ok: false,
        signals: [],
      },
      { status: 500 }
    );
  }
}
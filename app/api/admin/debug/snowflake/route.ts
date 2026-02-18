import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Small helper to normalize SnowflakeQueryResult<T> | T[]
 * into a simple array so we can safely access [0]
 */
function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.rows)) return result.rows;
  return [];
}

export async function GET() {
  try {
    // Basic context check
    const ctxResult = await executeQuery(
      `SELECT CURRENT_USER() AS USER, CURRENT_ROLE() AS ROLE, CURRENT_DATABASE() AS DB, CURRENT_SCHEMA() AS SCHEMA`
    );

    const ctxRows = normalizeRows(ctxResult);

    // Example visibility check (adjust if your view name differs)
    const visResult = await executeQuery(
      `SELECT * FROM CORE.V_VERIFICATION_EVIDENCE_UI_VISIBLE LIMIT 10`
    );

    const visRows = normalizeRows(visResult);

    return NextResponse.json({
      ok: true,
      context: ctxRows[0] ?? null,
      vEvidenceUiVisibleRows: visRows,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Snowflake debug failed" },
      { status: 500 }
    );
  }
}
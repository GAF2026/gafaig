import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";

export async function GET() {
  try {
    const ctxRows = await executeQuery(`
      SELECT
        CURRENT_ACCOUNT()  AS ACCOUNT,
        CURRENT_USER()     AS "USER",
        CURRENT_ROLE()     AS ROLE,
        CURRENT_DATABASE() AS DB,
        CURRENT_SCHEMA()   AS SCHEMA
    `);

    const visRows = await executeQuery(`
      SELECT table_catalog, table_schema, table_name
      FROM GAFAIG_DB.INFORMATION_SCHEMA.VIEWS
      WHERE table_schema = 'CORE'
        AND table_name = 'V_EVIDENCE_UI'
    `);

    return NextResponse.json({
      ok: true,
      context: ctxRows?.[0] ?? null,
      vEvidenceUiVisibleRows: visRows ?? [],
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Debug query failed" },
      { status: 500 }
    );
  }
}
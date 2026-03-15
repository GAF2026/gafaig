import { NextResponse } from "next/server";
import { snowflakeQuery } from "@/lib/snowflake";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const limit = Number(searchParams.get("limit") || 50);

    const rows = await snowflakeQuery(`
      SELECT
        registry_id,
        application_id,
        case_id,
        entity_name,
        entity_type,
        country,
        certified_tier,
        certified_band,
        certified_at
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC_SEARCH
      WHERE (:q = '' OR q ILIKE '%' || :q || '%')
      ORDER BY certified_at DESC
      LIMIT :limit
    `, { q, limit });

    return NextResponse.json({
      ok: true,
      rows
    });

  } catch (err:any) {

    return NextResponse.json({
      ok: false,
      error: err.message
    });
  }
}
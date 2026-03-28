// app/api/debug/sf/route.ts
import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await sfQuery(
    `
    SELECT
      CURRENT_ACCOUNT() AS account,
      CURRENT_USER() AS user,
      CURRENT_ROLE() AS role,
      CURRENT_WAREHOUSE() AS warehouse
    `
  );

  return NextResponse.json(rows);
}
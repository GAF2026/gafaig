// app/api/debug/sf/route.ts
import { NextResponse } from "next/server";
import { sfQueryResult } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

export async function GET() {
  const r = await sfQueryResult(
    "SELECT CURRENT_ACCOUNT() AS account, CURRENT_USER() AS user, CURRENT_ROLE() AS role, CURRENT_WAREHOUSE() AS warehouse, CURRENT_DATABASE() AS db, CURRENT_SCHEMA() AS schema"
  );
  return NextResponse.json(r);
}
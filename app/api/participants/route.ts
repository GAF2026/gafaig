import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function requireEnv(name: string): string {
  const env = (process.env as unknown) as Record<string, string | undefined>;
  const v = env[name];
  if (!v || !v.trim()) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export async function GET(_req: NextRequest) {
  // If you use this endpoint to read participants from Snowflake,
  // ensure required vars exist (example: endpoint-based configs).
  // You can remove this list if you don't need it.
  // const queryEndpoint = requireEnv("SNOWFLAKE_QUERY_ENDPOINT");

  // Minimal example: return participants from Snowflake (adjust SQL to your schema/view)
  const rows = await sfQuery<any>(
    `
    SELECT *
    FROM CORE.PARTICIPANTS
    ORDER BY CREATED_AT DESC
    LIMIT 200
    `
  );

  return NextResponse.json({ ok: true, rows });
}
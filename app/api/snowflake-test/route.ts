import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function present(name: string) {
  const env = (process.env as unknown) as Record<string, string | undefined>;
  const v = env[name];
  return !!(v && v.trim().length > 0);
}

export async function GET(_req: NextRequest) {
  // Minimal Snowflake connectivity smoke test
  const who = await sfQuery<any>(`SELECT CURRENT_USER() AS U, CURRENT_ROLE() AS R`);
  return NextResponse.json({
    ok: true,
    env: {
      SNOWFLAKE_ACCOUNT: present("SNOWFLAKE_ACCOUNT"),
      SNOWFLAKE_USERNAME: present("SNOWFLAKE_USERNAME"),
      SNOWFLAKE_PRIVATE_KEY: present("SNOWFLAKE_PRIVATE_KEY"),
      SNOWFLAKE_PASSWORD: present("SNOWFLAKE_PASSWORD"),
      SNOWFLAKE_WAREHOUSE: present("SNOWFLAKE_WAREHOUSE"),
      SNOWFLAKE_DATABASE: present("SNOWFLAKE_DATABASE"),
      SNOWFLAKE_SCHEMA: present("SNOWFLAKE_SCHEMA"),
      SNOWFLAKE_ROLE: present("SNOWFLAKE_ROLE"),
    },
    snowflake: {
      user: who?.[0]?.U ?? null,
      role: who?.[0]?.R ?? null,
    },
  });
}
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

function present(name: string) {
  const v = process.env[name];
  return !!(v && String(v).trim().length > 0);
}

export async function GET() {
  const envPresence = {
    SNOWFLAKE_ACCOUNT: present("SNOWFLAKE_ACCOUNT"),
    SNOWFLAKE_USER: present("SNOWFLAKE_USER"),
    SNOWFLAKE_PASS: present("SNOWFLAKE_PASS"),
    SNOWFLAKE_WAREHOUSE: present("SNOWFLAKE_WAREHOUSE"),
    SNOWFLAKE_DATABASE: present("SNOWFLAKE_DATABASE"),
    SNOWFLAKE_SCHEMA: present("SNOWFLAKE_SCHEMA"),
  };

  const missing = Object.entries(envPresence)
    .filter(([, ok]) => !ok)
    .map(([k]) => k);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Snowflake environment variables",
        missing,
        envPresence,
      },
      { status: 500 }
    );
  }

  try {
    const result = await executeQuery("SELECT CURRENT_TIMESTAMP() AS NOW");
    return NextResponse.json({ ok: true, result, envPresence });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Snowflake query failed", envPresence },
      { status: 500 }
    );
  }
}
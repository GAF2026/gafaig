// lib/snowflake.ts
// Server-only helper. Safe for Vercel build because it only exports functions.
// Make sure you only call these from server routes / server components.

export type SnowflakeQueryResult<Row = any> = {
  ok: boolean;
  rows: Row[];
  error?: string;
};

// If you already have another function name in your project,
// keep this as the canonical export used everywhere.
export async function sfQuery<Row = any>(
  sql: string,
  binds: any[] = []
): Promise<SnowflakeQueryResult<Row>> {
  try {
    // IMPORTANT:
    // This file assumes you’re calling a Snowflake HTTP endpoint you already built,
    // OR you’re using a server-side connector somewhere else.
    //
    // If you have an existing implementation, paste it here.
    //
    // For now, this version expects you to provide a server route that actually runs SQL.
    // If you DO already run Snowflake directly in Node, replace this body with your existing logic.

    // Example pattern: call your existing internal API route that runs SQL
    // (Update the endpoint if yours differs.)
    const r = await fetch(process.env.SNOWFLAKE_QUERY_ENDPOINT || "", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sql, binds }),
      cache: "no-store",
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return { ok: false, rows: [], error: `Snowflake query failed (${r.status}): ${text}` };
    }

    const data = (await r.json()) as any;
    return { ok: true, rows: (data.rows || []) as Row[] };
  } catch (e: any) {
    return { ok: false, rows: [], error: e?.message || "Unknown Snowflake error" };
  }
}

/**
 * Back-compat aliases (in case older code imports different names).
 * Keep these if you’ve referenced other names in prior commits.
 */
export const query = sfQuery;
export const snowflakeQuery = sfQuery;
// lib/snowflake.ts
// Server-only helper. Returns ARRAYS for compatibility with existing routes.

import "server-only";

export type SnowflakeQueryResult<Row = any> = {
  ok: boolean;
  rows: Row[];
  error?: string;
};

/**
 * Low-level helper that returns { ok, rows, error }.
 */
export async function sfQueryResult<Row = any>(
  sql: string,
  binds: any[] = []
): Promise<SnowflakeQueryResult<Row>> {
  try {
    const endpoint = process.env.SNOWFLAKE_QUERY_ENDPOINT;

    // Build must still succeed even if Snowflake isn't configured.
    if (!endpoint) {
      return {
        ok: false,
        rows: [],
        error:
          "SNOWFLAKE_QUERY_ENDPOINT is not set (Snowflake not configured).",
      };
    }

    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sql, binds }),
      cache: "no-store",
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return {
        ok: false,
        rows: [],
        error: `Snowflake query failed (${r.status}): ${text}`,
      };
    }

    const data = (await r.json()) as any;
    const rows = (data?.rows ?? []) as Row[];

    return { ok: true, rows };
  } catch (e: any) {
    return {
      ok: false,
      rows: [],
      error: e?.message || "Unknown Snowflake error",
    };
  }
}

/**
 * Primary helper used by most routes:
 * ✅ returns Row[] so routes can do rows[0], rows.length, etc.
 */
export async function sfQuery<Row = any>(
  sql: string,
  binds: any[] = []
): Promise<Row[]> {
  const result = await sfQueryResult<Row>(sql, binds);
  return Array.isArray(result?.rows) ? result.rows : [];
}

/**
 * Backwards-compatible exports used throughout your API routes.
 * ✅ These return Promise<Row[]> (arrays) — never SnowflakeQueryResult.
 * ✅ Properly generic so TypeScript does not lose the Row type.
 */

export const executeQuery = async <Row = any>(
  sql: string,
  binds: any[] = []
): Promise<Row[]> => {
  return sfQuery<Row>(sql, binds);
};

export const querySnowflake = async <Row = any>(
  sql: string,
  binds: any[] = []
): Promise<Row[]> => {
  return sfQuery<Row>(sql, binds);
};

// Optional aliases (safe)
export const query = executeQuery;
export const snowflakeQuery = executeQuery;
// lib/snowflake.ts
import snowflake from "snowflake-sdk";

// IMPORTANT: Next.js App Router API routes run on Node runtime for snowflake-sdk.
// This file must only be used from Node runtime route handlers.

type SfEnv = {
  account: string;
  username: string;
  password: string;
  warehouse?: string;
  database?: string;
  schema?: string;
  role?: string;
};

function getEnv(name: string, required = true): string | undefined {
  const v = process.env[name];
  if (required && (!v || !v.trim())) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v?.trim();
}

function getSnowflakeEnv(): SfEnv {
  return {
    account: getEnv("SNOWFLAKE_ACCOUNT")!,
    username: getEnv("SNOWFLAKE_USERNAME")!,
    password: getEnv("SNOWFLAKE_PASSWORD")!,
    warehouse: getEnv("SNOWFLAKE_WAREHOUSE", false),
    database: getEnv("SNOWFLAKE_DATABASE", false),
    schema: getEnv("SNOWFLAKE_SCHEMA", false),
    role: getEnv("SNOWFLAKE_ROLE", false),
  };
}

type QueryResult<T = any> = {
  rows: T[];
  statement?: any;
};

declare global {
  // eslint-disable-next-line no-var
  var __gafaig_sf_conn_ready__: Promise<snowflake.Connection> | undefined;
}

/**
 * Creates (and reuses) a single Snowflake connection across hot reloads.
 */
async function connectOnce(): Promise<snowflake.Connection> {
  if (global.__gafaig_sf_conn_ready__) return global.__gafaig_sf_conn_ready__;

  global.__gafaig_sf_conn_ready__ = new Promise((resolve, reject) => {
    try {
      const env = getSnowflakeEnv();

      const conn = snowflake.createConnection({
        account: env.account,
        username: env.username,
        password: env.password,
        warehouse: env.warehouse,
        database: env.database,
        schema: env.schema,
        role: env.role,
      });

      conn.connect((err) => {
        if (err) return reject(err);
        resolve(conn);
      });
    } catch (e) {
      reject(e);
    }
  });

  return global.__gafaig_sf_conn_ready__;
}

/**
 * The canonical query helper used everywhere:
 *   import { sfQuery } from "@/lib/snowflake";
 */
export async function sfQuery<T = any>(
  sqlText: string,
  binds: any[] = []
): Promise<QueryResult<T>> {
  const conn = await connectOnce();

  return await new Promise<QueryResult<T>>((resolve, reject) => {
    conn.execute({
      sqlText,
      binds,
      complete: (err, stmt, rows) => {
        if (err) return reject(err);
        resolve({ rows: (rows ?? []) as T[], statement: stmt });
      },
    });
  });
}

/**
 * Back-compat aliases to stop import errors in older routes.
 * (Safe to keep even if you later migrate everything to sfQuery.)
 */
export const executeQuery = sfQuery;

/**
 * Small helper that returns the current Snowflake session context.
 */
export async function snowflakeCtx(): Promise<{ u: string; r: string }> {
  const { rows } = await sfQuery<{ U: string; R: string }>(
    `SELECT CURRENT_USER() AS U, CURRENT_ROLE() AS R`
  );
  const first = rows?.[0];
  return {
    u: first?.U ?? "UNKNOWN_USER",
    r: first?.R ?? "UNKNOWN_ROLE",
  };
}
import snowflake from "snowflake-sdk";

export type SnowflakeRow = Record<string, unknown>;
export type sfQueryResult<T = any> = T[];

let connection: snowflake.Connection | null = null;
let connected = false;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return String(value).trim();
}

function getPrivateKey(): string {
  const inlineKey = process.env.SNOWFLAKE_PRIVATE_KEY;
  if (inlineKey && inlineKey.trim()) {
    return inlineKey.replace(/\\n/g, "\n");
  }

  throw new Error(
    "Missing required environment variable: SNOWFLAKE_PRIVATE_KEY"
  );
}

function getConnection(): snowflake.Connection {
  if (connection) return connection;

  connection = snowflake.createConnection({
    account: getRequiredEnv("SNOWFLAKE_ACCOUNT"),
    username:
      process.env.SNOWFLAKE_USERNAME?.trim() ||
      process.env.SNOWFLAKE_USER?.trim() ||
      getRequiredEnv("SNOWFLAKE_USER"),
    authenticator: "SNOWFLAKE_JWT",
    privateKey: getPrivateKey(),
    warehouse: getRequiredEnv("SNOWFLAKE_WAREHOUSE"),
    database: getRequiredEnv("SNOWFLAKE_DATABASE"),
    schema: getRequiredEnv("SNOWFLAKE_SCHEMA"),
    role: getRequiredEnv("SNOWFLAKE_ROLE"),
  });

  return connection;
}

async function connectIfNeeded(): Promise<snowflake.Connection> {
  const conn = getConnection();

  if (connected) return conn;

  await new Promise<void>((resolve, reject) => {
    conn.connect((err) => {
      if (err) return reject(err);
      connected = true;
      resolve();
    });
  });

  return conn;
}

/**
 * Canonical query helper
 */
export async function sfQuery<T = any>(
  sql: string,
  binds: any[] = []
): Promise<T[]> {
  const conn = await connectIfNeeded();

  return await new Promise<T[]>((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) return reject(err);
        resolve(((rows ?? []) as T[]) || []);
      },
    });
  });
}

/**
 * Compatibility export for older code paths still importing executeQuery
 */
export const executeQuery = sfQuery;

/**
 * Compatibility export for older code paths still importing snowflakeQuery
 */
export const snowflakeQuery = sfQuery;

/**
 * Compatibility export for older code paths incorrectly importing sfQueryResult
 * as a function/value instead of using sfQuery.
 */
export const sfQueryResult = sfQuery;

/**
 * Compatibility helper for routes that expect current Snowflake execution context.
 */
export async function snowflakeCtx(): Promise<{
  ACCOUNT: string | null;
  REGION: string | null;
  ROLE: string | null;
  WAREHOUSE: string | null;
  DATABASE: string | null;
  SCHEMA: string | null;
}> {
  const rows = await sfQuery<{
    ACCOUNT: string | null;
    REGION: string | null;
    ROLE: string | null;
    WAREHOUSE: string | null;
    DATABASE: string | null;
    SCHEMA: string | null;
  }>(
    `
    SELECT
      CURRENT_ACCOUNT()   AS ACCOUNT,
      CURRENT_REGION()    AS REGION,
      CURRENT_ROLE()      AS ROLE,
      CURRENT_WAREHOUSE() AS WAREHOUSE,
      CURRENT_DATABASE()  AS DATABASE,
      CURRENT_SCHEMA()    AS SCHEMA
    `
  );

  return (
    rows[0] ?? {
      ACCOUNT: null,
      REGION: null,
      ROLE: null,
      WAREHOUSE: null,
      DATABASE: null,
      SCHEMA: null,
    }
  );
}
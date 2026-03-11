// lib/snowflake.ts
// GAFAIG Snowflake server-only helper layer
// Supports legacy and modern route handlers.

import fs from "fs";
import path from "path";
import snowflake from "snowflake-sdk";

type Bind = string | number | boolean | null;
type Binds = Bind[] | Record<string, Bind>;

export type SfQueryOk<T = any> = {
  ok: true;
  rows: T[];
  rowCount: number;
};

export type SfQueryErr = {
  ok: false;
  error: string;
};

export type SfQueryResponse<T = any> = SfQueryOk<T> | SfQueryErr;

export type SnowflakeCtx = {
  account?: string;
  database?: string;
  schema?: string;
  role?: string;
  warehouse?: string;
};

function normalizePem(raw: string): string {
  return raw.replace(/\\n/g, "\n").trim();
}

/**
 * Read private key from env value or file path.
 * Priority:
 * 1. SNOWFLAKE_PRIVATE_KEY
 * 2. SNOWFLAKE_PRIVATE_KEY_PATH
 */
function readPrivateKey(): string | undefined {
  const raw = process.env.SNOWFLAKE_PRIVATE_KEY;
  if (raw) {
    if (raw.includes("BEGIN PRIVATE KEY")) {
      return normalizePem(raw);
    }

    try {
      const decoded = Buffer.from(raw, "base64").toString("utf8");
      if (decoded.includes("BEGIN PRIVATE KEY")) {
        return normalizePem(decoded);
      }
    } catch {
      // ignore
    }

    return normalizePem(raw);
  }

  const keyPath = process.env.SNOWFLAKE_PRIVATE_KEY_PATH;
  if (!keyPath) return undefined;

  const resolvedPath = path.isAbsolute(keyPath)
    ? keyPath
    : path.resolve(process.cwd(), keyPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Snowflake private key file not found: ${resolvedPath}`);
  }

  const fileContents = fs.readFileSync(resolvedPath, "utf8");
  return normalizePem(fileContents);
}

function getConfig() {
  const account = process.env.SNOWFLAKE_ACCOUNT;
  const username =
    process.env.SNOWFLAKE_USER || process.env.SNOWFLAKE_USERNAME;
  const warehouse = process.env.SNOWFLAKE_WAREHOUSE;
  const database = process.env.SNOWFLAKE_DATABASE;
  const schema = process.env.SNOWFLAKE_SCHEMA;
  const role = process.env.SNOWFLAKE_ROLE;

  if (!account) throw new Error("Missing env: SNOWFLAKE_ACCOUNT");
  if (!username) {
    throw new Error("Missing env: SNOWFLAKE_USER or SNOWFLAKE_USERNAME");
  }

  const privateKey = readPrivateKey();
  const password = process.env.SNOWFLAKE_PASSWORD;

  if (privateKey) {
    return {
      account,
      username,
      warehouse,
      database,
      schema,
      role,
      authenticator: "SNOWFLAKE_JWT" as const,
      privateKey,
    };
  }

  if (!password) {
    throw new Error(
      "Missing Snowflake credentials. Provide SNOWFLAKE_PRIVATE_KEY, SNOWFLAKE_PRIVATE_KEY_PATH, or SNOWFLAKE_PASSWORD."
    );
  }

  return {
    account,
    username,
    password,
    warehouse,
    database,
    schema,
    role,
  };
}

// Store the connection on globalThis so it survives hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __gafaig_sf_conn: snowflake.Connection | undefined;
}

async function execRaw<T = any>(
  conn: snowflake.Connection,
  sqlText: string,
  binds?: Binds
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    conn.execute({
      sqlText,
      binds: binds as any,
      complete: (err, _stmt, rows) => {
        if (err) return reject(err);
        resolve((rows ?? []) as T[]);
      },
    });
  });
}

async function initializeSession(conn: snowflake.Connection): Promise<void> {
  const cfg = getConfig();

  if (cfg.role) {
    await execRaw(conn, `USE ROLE IDENTIFIER(?)`, [cfg.role]);
  }
  if (cfg.warehouse) {
    await execRaw(conn, `USE WAREHOUSE IDENTIFIER(?)`, [cfg.warehouse]);
  }
  if (cfg.database) {
    await execRaw(conn, `USE DATABASE IDENTIFIER(?)`, [cfg.database]);
  }
  if (cfg.schema) {
    await execRaw(conn, `USE SCHEMA IDENTIFIER(?)`, [cfg.schema]);
  }
}

async function getConnection(): Promise<snowflake.Connection> {
  const g = globalThis as unknown as {
    __gafaig_sf_conn?: snowflake.Connection;
  };

  if (g.__gafaig_sf_conn) {
    try {
      await execRaw(g.__gafaig_sf_conn, "SELECT 1");
      return g.__gafaig_sf_conn;
    } catch {
      try {
        g.__gafaig_sf_conn.destroy((err) => {
          if (err) {
            console.warn("Snowflake cached connection destroy warning:", err);
          }
        });
      } catch {
        // ignore destroy errors
      }
      g.__gafaig_sf_conn = undefined;
    }
  }

  const cfg = getConfig();

  const conn = snowflake.createConnection({
    account: cfg.account,
    username: cfg.username,
    password: "password" in cfg ? cfg.password : undefined,
    authenticator: "authenticator" in cfg ? cfg.authenticator : undefined,
    privateKey: "privateKey" in cfg ? cfg.privateKey : undefined,
    warehouse: cfg.warehouse,
    database: cfg.database,
    schema: cfg.schema,
    role: cfg.role,
    clientSessionKeepAlive: true,
  });

  await new Promise<void>((resolve, reject) => {
    conn.connect((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  await initializeSession(conn);

  g.__gafaig_sf_conn = conn;
  return conn;
}

/**
 * Canonical rows-only query helper.
 */
export async function sfQuery<T = any>(
  sqlText: string,
  binds?: Binds
): Promise<T[]> {
  const result = await sfQueryResult<T>(sqlText, binds);
  if (!result.ok) throw new Error(result.error);
  return result.rows;
}

/**
 * Canonical structured query helper.
 */
export async function sfQueryResult<T = any>(
  sqlText: string,
  binds?: Binds
): Promise<SfQueryResponse<T>> {
  try {
    const conn = await getConnection();
    const rows = await execRaw<T>(conn, sqlText, binds);
    return { ok: true, rows, rowCount: rows.length };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? String(e) };
  }
}

/**
 * Backward compatibility alias.
 */
export async function querySnowflake<T = any>(
  sqlText: string,
  binds?: Binds
): Promise<SfQueryResponse<T>> {
  return sfQueryResult<T>(sqlText, binds);
}

/**
 * Backward compatibility for older routes expecting rows only.
 */
export async function executeQuery<T = any>(
  sqlText: string,
  binds?: Binds
): Promise<T[]> {
  return sfQuery<T>(sqlText, binds);
}

/**
 * Diagnostics context helper.
 */
export function snowflakeCtx(): SnowflakeCtx {
  return {
    account: process.env.SNOWFLAKE_ACCOUNT,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    role: process.env.SNOWFLAKE_ROLE,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  };
}
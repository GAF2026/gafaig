import snowflake, {
  Connection,
  ConnectionOptions,
  RowStatement,
} from "snowflake-sdk";

type SnowflakePrimitive = string | number | boolean | null;
type SnowflakeBind = SnowflakePrimitive;

export type SnowflakeCtx = {
  account: string;
  username: string;
  warehouse: string;
  database: string;
  schema: string;
  role?: string;
};

export type SfQueryResult<T = Record<string, unknown>> = T[];

let connection: Connection | null = null;
let connectionPromise: Promise<Connection> | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function getPrivateKey(): string {
  const inlineKey = process.env.SNOWFLAKE_PRIVATE_KEY?.trim();
  if (inlineKey) {
    return normalizePrivateKey(inlineKey);
  }

  throw new Error("Missing required environment variable: SNOWFLAKE_PRIVATE_KEY");
}

function normalizePrivateKey(value: string): string {
  let normalized = value.trim();

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }

  normalized = normalized.replace(/\\n/g, "\n");

  return normalized;
}

function getConnectionOptions(): ConnectionOptions {
  const account = getRequiredEnv("SNOWFLAKE_ACCOUNT");
  const username =
    process.env.SNOWFLAKE_USER?.trim() ||
    process.env.SNOWFLAKE_USERNAME?.trim() ||
    getRequiredEnv("SNOWFLAKE_USER");

  const warehouse = getRequiredEnv("SNOWFLAKE_WAREHOUSE");
  const database = getRequiredEnv("SNOWFLAKE_DATABASE");
  const schema = getRequiredEnv("SNOWFLAKE_SCHEMA");
  const role = process.env.SNOWFLAKE_ROLE?.trim();

  return {
    account,
    username,
    warehouse,
    database,
    schema,
    role,
    authenticator: "SNOWFLAKE_JWT",
    privateKey: getPrivateKey(),
  };
}

function createSnowflakeConnection(): Connection {
  return snowflake.createConnection(getConnectionOptions());
}

async function connectIfNeeded(): Promise<Connection> {
  if (connection && connection.isUp()) {
    return connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = new Promise<Connection>((resolve, reject) => {
    const conn = createSnowflakeConnection();

    conn.connect((err, connectedConn) => {
      if (err) {
        connection = null;
        connectionPromise = null;
        reject(err);
        return;
      }

      connection = connectedConn;
      connectionPromise = null;
      resolve(connectedConn);
    });
  });

  return connectionPromise;
}

function normalizeBind(value: unknown): SnowflakeBind {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return String(value);
}

function normalizeBinds(binds: unknown[] = []): SnowflakeBind[] {
  return binds.map(normalizeBind);
}

function executeStatement<T>(
  conn: Connection,
  sqlText: string,
  binds: unknown[] = []
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    conn.execute({
      sqlText,
      binds: normalizeBinds(binds),
      complete: (err, _stmt: RowStatement, rows: T[] | undefined) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows ?? []);
      },
    });
  });
}

export async function sfQuery<T = Record<string, unknown>>(
  sqlText: string,
  binds: unknown[] = []
): Promise<T[]> {
  const conn = await connectIfNeeded();
  return executeStatement<T>(conn, sqlText, binds);
}

/**
 * Temporary compatibility export.
 * Keep during stabilization only.
 */
export async function executeQuery<T = Record<string, unknown>>(
  sqlText: string,
  binds: unknown[] = []
): Promise<T[]> {
  return sfQuery<T>(sqlText, binds);
}

/**
 * Temporary compatibility export.
 * Keep during stabilization only.
 */
export async function snowflakeQuery<T = Record<string, unknown>>(
  sqlText: string,
  binds: unknown[] = []
): Promise<T[]> {
  return sfQuery<T>(sqlText, binds);
}

/**
 * Historical code expects a symbol named sfQueryResult.
 * In the current system, queries return rows directly.
 */
export type sfQueryResult<T = Record<string, unknown>> = T[];

export const snowflakeCtx: SnowflakeCtx = {
  account: process.env.SNOWFLAKE_ACCOUNT?.trim() || "",
  username:
    process.env.SNOWFLAKE_USER?.trim() ||
    process.env.SNOWFLAKE_USERNAME?.trim() ||
    "",
  warehouse: process.env.SNOWFLAKE_WAREHOUSE?.trim() || "",
  database: process.env.SNOWFLAKE_DATABASE?.trim() || "",
  schema: process.env.SNOWFLAKE_SCHEMA?.trim() || "",
  role: process.env.SNOWFLAKE_ROLE?.trim(),
};
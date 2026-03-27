import fs from "fs";
import path from "path";
import snowflake from "snowflake-sdk";

type BindValue =
  | string
  | number
  | boolean
  | null
  | Date
  | Uint8Array;

let connectionPromise: Promise<snowflake.Connection> | null = null;

function getEnv(name: string): string | null {
  const value = process.env[name];
  if (!value || !value.trim()) return null;
  return value.trim();
}

function requireEnv(name: string): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function loadPrivateKey(): string {
  const privateKeyPath = requireEnv("SNOWFLAKE_PRIVATE_KEY_PATH");
  const resolvedPath = path.resolve(process.cwd(), privateKeyPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Snowflake private key file not found: ${resolvedPath}`);
  }

  return fs.readFileSync(resolvedPath, "utf8");
}

async function getConnection(): Promise<snowflake.Connection> {
  if (connectionPromise) return connectionPromise;

  connectionPromise = new Promise((resolve, reject) => {
    const account = requireEnv("SNOWFLAKE_ACCOUNT");
    const username =
      getEnv("SNOWFLAKE_USER") ??
      getEnv("SNOWFLAKE_USERNAME") ??
      requireEnv("SNOWFLAKE_USER");

    const warehouse = getEnv("SNOWFLAKE_WAREHOUSE") ?? "GAFAIG_WH";
    const database = getEnv("SNOWFLAKE_DATABASE") ?? "GAFAIG_DB";
    const schema = getEnv("SNOWFLAKE_SCHEMA") ?? "CORE";
    const role = getEnv("SNOWFLAKE_ROLE") ?? "GAFAIG_APP_ROLE";

    const password = getEnv("SNOWFLAKE_PASSWORD");
    const privateKeyPath = getEnv("SNOWFLAKE_PRIVATE_KEY_PATH");

    const config: Record<string, unknown> = {
      account,
      username,
      warehouse,
      database,
      schema,
      role,
      clientSessionKeepAlive: true,
    };

    if (password) {
      config.password = password;
    } else if (privateKeyPath) {
      config.authenticator = "SNOWFLAKE_JWT";
      config.privateKey = loadPrivateKey();
    } else {
      connectionPromise = null;
      reject(
        new Error(
          "Missing Snowflake auth. Provide SNOWFLAKE_PASSWORD or SNOWFLAKE_PRIVATE_KEY_PATH."
        )
      );
      return;
    }

    const connection = snowflake.createConnection(
      config as snowflake.ConnectionOptions
    );

    connection.connect((err) => {
      if (err) {
        connectionPromise = null;
        reject(err);
        return;
      }
      resolve(connection);
    });
  });

  return connectionPromise;
}

function splitStatements(sqlText: string): string[] {
  return sqlText
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

function executeStatement<T = Record<string, unknown>>(
  connection: snowflake.Connection,
  sqlText: string,
  binds: BindValue[] = []
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve((rows ?? []) as T[]);
      },
    });
  });
}

async function ensureCanonicalContext(
  connection: snowflake.Connection
): Promise<void> {
  const database = getEnv("SNOWFLAKE_DATABASE") ?? "GAFAIG_DB";
  const schema = getEnv("SNOWFLAKE_SCHEMA") ?? "CORE";
  const warehouse = getEnv("SNOWFLAKE_WAREHOUSE") ?? "GAFAIG_WH";
  const role = getEnv("SNOWFLAKE_ROLE") ?? "GAFAIG_APP_ROLE";

  await executeStatement(connection, `USE ROLE ${role}`);
  await executeStatement(connection, `USE WAREHOUSE ${warehouse}`);
  await executeStatement(connection, `USE DATABASE ${database}`);
  await executeStatement(connection, `USE SCHEMA ${schema}`);
}

export async function sfQuery<T = Record<string, unknown>>(
  sqlText: string,
  binds: BindValue[] = []
): Promise<T[]> {
  const connection = await getConnection();
  await ensureCanonicalContext(connection);

  const statements = splitStatements(sqlText);

  if (statements.length === 0) return [];

  if (statements.length === 1) {
    return executeStatement<T>(connection, statements[0], binds);
  }

  let lastRows: T[] = [];
  for (let i = 0; i < statements.length; i += 1) {
    const statementBinds = i === statements.length - 1 ? binds : [];
    lastRows = await executeStatement<T>(connection, statements[i], statementBinds);
  }
  return lastRows;
}

export async function sfExec(
  sqlText: string,
  binds: BindValue[] = []
): Promise<void> {
  await sfQuery(sqlText, binds);
}

export async function sfContext(): Promise<Record<string, unknown> | null> {
  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      CURRENT_ACCOUNT() AS ACCOUNT,
      CURRENT_ROLE() AS ROLE,
      CURRENT_WAREHOUSE() AS WAREHOUSE,
      CURRENT_DATABASE() AS DATABASE,
      CURRENT_SCHEMA() AS SCHEMA
    `
  );
  return rows[0] ?? null;
}
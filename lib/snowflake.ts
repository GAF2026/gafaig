import snowflake from "snowflake-sdk";

type QueryError = {
  ok: false;
  rows: [];
  error: string;
};

type QuerySuccess<T> = {
  ok: true;
  rows: T[];
};

export type SfQueryResult<T> = QuerySuccess<T> | QueryError;

declare global {
  // eslint-disable-next-line no-var
  var __gafaigSnowflakeConnection: snowflake.Connection | undefined;
  // eslint-disable-next-line no-var
  var __gafaigSnowflakeConnecting: Promise<snowflake.Connection> | undefined;
}

function env(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

const account = env("SNOWFLAKE_ACCOUNT");
const username = env("SNOWFLAKE_USER") ?? env("SNOWFLAKE_USERNAME");
const warehouse = env("SNOWFLAKE_WAREHOUSE");
const database = env("SNOWFLAKE_DATABASE");
const schema = env("SNOWFLAKE_SCHEMA");
const role = env("SNOWFLAKE_ROLE");

const password = env("SNOWFLAKE_PASSWORD");
const privateKey = env("SNOWFLAKE_PRIVATE_KEY");
const privateKeyPath = env("SNOWFLAKE_PRIVATE_KEY_PATH");
const privateKeyPass = env("SNOWFLAKE_PRIVATE_KEY_PASSPHRASE");

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildConnectionConfig(): snowflake.ConnectionOptions {
  const cfg: snowflake.ConnectionOptions = {
    account: requireEnv(account, "SNOWFLAKE_ACCOUNT"),
    username: requireEnv(username, "SNOWFLAKE_USER or SNOWFLAKE_USERNAME"),
    warehouse: requireEnv(warehouse, "SNOWFLAKE_WAREHOUSE"),
    database: requireEnv(database, "SNOWFLAKE_DATABASE"),
    schema: requireEnv(schema, "SNOWFLAKE_SCHEMA"),
    role,
    clientSessionKeepAlive: true,
  };

  if (password) {
    cfg.password = password;
    return cfg;
  }

  if (privateKey) {
    cfg.authenticator = "SNOWFLAKE_JWT";
    cfg.privateKey = privateKey;
    if (privateKeyPass) cfg.privateKeyPass = privateKeyPass;
    return cfg;
  }

  if (privateKeyPath) {
    cfg.authenticator = "SNOWFLAKE_JWT";
    cfg.privateKeyPath = privateKeyPath;
    if (privateKeyPass) cfg.privateKeyPass = privateKeyPass;
    return cfg;
  }

  throw new Error(
    "Missing Snowflake auth configuration. Provide SNOWFLAKE_PASSWORD or SNOWFLAKE_PRIVATE_KEY or SNOWFLAKE_PRIVATE_KEY_PATH."
  );
}

export function createConnection(): snowflake.Connection {
  return snowflake.createConnection(buildConnectionConfig());
}

async function connectNewConnection(): Promise<snowflake.Connection> {
  const connection = createConnection();

  return new Promise<snowflake.Connection>((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(connection);
    });
  });
}

async function getSharedConnection(): Promise<snowflake.Connection> {
  if (global.__gafaigSnowflakeConnection) {
    return global.__gafaigSnowflakeConnection;
  }

  if (!global.__gafaigSnowflakeConnecting) {
    global.__gafaigSnowflakeConnecting = connectNewConnection()
      .then((connection) => {
        global.__gafaigSnowflakeConnection = connection;
        return connection;
      })
      .finally(() => {
        global.__gafaigSnowflakeConnecting = undefined;
      });
  }

  return global.__gafaigSnowflakeConnecting;
}

async function executeOnConnection<T = any>(
  connection: snowflake.Connection,
  sqlText: string,
  binds: any[] = []
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    connection.execute({
      sqlText,
      binds,
      complete: (execErr, _stmt, rows) => {
        if (execErr) {
          reject(execErr);
          return;
        }

        resolve((rows ?? []) as T[]);
      },
    });
  });
}

async function runQuery<T = any>(sqlText: string, binds: any[] = []): Promise<T[]> {
  let connection = await getSharedConnection();

  try {
    return await executeOnConnection<T>(connection, sqlText, binds);
  } catch (error: any) {
    const message = String(error?.message || "");

    const looksLikeDeadConnection =
      message.includes("Unable to perform operation using terminated connection") ||
      message.includes("Connection is closed") ||
      message.includes("disconnected") ||
      message.includes("connection was already destroyed") ||
      message.includes("not connected");

    if (!looksLikeDeadConnection) {
      throw error;
    }

    global.__gafaigSnowflakeConnection = undefined;
    connection = await getSharedConnection();
    return executeOnConnection<T>(connection, sqlText, binds);
  }
}

export async function sfQuery<T = any>(
  sqlText: string,
  binds: any[] = []
): Promise<T[]> {
  return runQuery<T>(sqlText, binds);
}

export async function snowflakeQuery<T = any>(
  sqlText: string,
  binds: any[] = []
): Promise<T[]> {
  return runQuery<T>(sqlText, binds);
}

export async function executeQuery<T = any>(
  sqlText: string,
  binds: any[] = []
): Promise<T[]> {
  return runQuery<T>(sqlText, binds);
}

export async function sfQueryResult<T = any>(
  sqlText: string,
  binds: any[] = []
): Promise<SfQueryResult<T>> {
  try {
    const rows = await runQuery<T>(sqlText, binds);
    return {
      ok: true,
      rows,
    };
  } catch (error: any) {
    return {
      ok: false,
      rows: [],
      error: error?.message || "Snowflake query failed.",
    };
  }
}

export function snowflakeCtx() {
  return {
    account: account ?? null,
    username: username ?? null,
    warehouse: warehouse ?? null,
    database: database ?? null,
    schema: schema ?? null,
    role: role ?? null,
    authMode: password
      ? "password"
      : privateKey
      ? "privateKey"
      : privateKeyPath
      ? "privateKeyPath"
      : "missing",
  };
}
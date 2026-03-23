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

function env(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSnowflakeEnv() {
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

  return {
    account,
    username,
    warehouse,
    database,
    schema,
    role,
    password,
    privateKey,
    privateKeyPath,
    privateKeyPass,
  };
}

function normalizePem(raw: string): string {
  return raw.replace(/\r\n/g, "\n").trim();
}

function buildConnectionConfig(): snowflake.ConnectionOptions {
  const {
    account,
    username,
    warehouse,
    database,
    schema,
    role,
    password,
    privateKey,
    privateKeyPath,
    privateKeyPass,
  } = getSnowflakeEnv();

  const cfg: snowflake.ConnectionOptions = {
    account: requireEnv(account, "SNOWFLAKE_ACCOUNT"),
    username: requireEnv(username, "SNOWFLAKE_USER or SNOWFLAKE_USERNAME"),
    warehouse: requireEnv(warehouse, "SNOWFLAKE_WAREHOUSE"),
    database: requireEnv(database, "SNOWFLAKE_DATABASE"),
    schema: requireEnv(schema, "SNOWFLAKE_SCHEMA"),
    clientSessionKeepAlive: false,
  };

  if (role) {
    cfg.role = role;
  }

  if (password) {
    cfg.password = password;
    return cfg;
  }

  if (privateKey) {
    cfg.authenticator = "SNOWFLAKE_JWT";
    cfg.privateKey = normalizePem(privateKey);
    if (privateKeyPass) {
      cfg.privateKeyPass = privateKeyPass;
    }
    return cfg;
  }

  if (privateKeyPath) {
    cfg.authenticator = "SNOWFLAKE_JWT";
    cfg.privateKeyPath = privateKeyPath;
    if (privateKeyPass) {
      cfg.privateKeyPass = privateKeyPass;
    }
    return cfg;
  }

  throw new Error(
    "Missing Snowflake auth configuration. Provide SNOWFLAKE_PASSWORD or SNOWFLAKE_PRIVATE_KEY or SNOWFLAKE_PRIVATE_KEY_PATH.",
  );
}

export function createConnection(): snowflake.Connection {
  return snowflake.createConnection(buildConnectionConfig());
}

async function connectNewConnection(): Promise<snowflake.Connection> {
  const connection = createConnection();

  await new Promise<void>((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

  return connection;
}

async function executeOnConnection<T = any>(
  connection: snowflake.Connection,
  sqlText: string,
  binds: any[] = [],
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

async function destroyConnectionQuietly(connection: snowflake.Connection) {
  await new Promise<void>((resolve) => {
    try {
      connection.destroy((_err, _conn) => resolve());
    } catch {
      resolve();
    }
  });
}

async function runQuery<T = any>(sqlText: string, binds: any[] = []): Promise<T[]> {
  const connection = await connectNewConnection();

  try {
    await executeOnConnection(connection, "ALTER SESSION SET AUTOCOMMIT = TRUE");

    const rows = await executeOnConnection<T>(connection, sqlText, binds);

    try {
      await executeOnConnection(connection, "COMMIT");
    } catch {
      // harmless when no transaction is open
    }

    return rows;
  } catch (error) {
    try {
      await executeOnConnection(connection, "ROLLBACK");
    } catch {
      // ignore rollback failures
    }
    throw error;
  } finally {
    await destroyConnectionQuietly(connection);
  }
}

export async function sfQuery<T = any>(
  sqlText: string,
  binds: any[] = [],
): Promise<T[]> {
  return runQuery<T>(sqlText, binds);
}

export async function snowflakeQuery<T = any>(
  sqlText: string,
  binds: any[] = [],
): Promise<T[]> {
  return runQuery<T>(sqlText, binds);
}

export async function executeQuery<T = any>(
  sqlText: string,
  binds: any[] = [],
): Promise<T[]> {
  return runQuery<T>(sqlText, binds);
}

export async function sfQueryResult<T = any>(
  sqlText: string,
  binds: any[] = [],
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
  const {
    account,
    username,
    warehouse,
    database,
    schema,
    role,
    password,
    privateKey,
    privateKeyPath,
  } = getSnowflakeEnv();

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
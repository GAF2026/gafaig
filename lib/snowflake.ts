import snowflake from "snowflake-sdk";

type BindScalar = string | number | boolean | Date | Uint8Array | null;
type QueryRow = Record<string, unknown>;

const {
  SNOWFLAKE_ACCOUNT,
  SNOWFLAKE_USERNAME,
  SNOWFLAKE_PASSWORD,
  SNOWFLAKE_WAREHOUSE,
  SNOWFLAKE_DATABASE,
  SNOWFLAKE_SCHEMA,
  SNOWFLAKE_ROLE,
} = process.env;

function requireEnv(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required Snowflake env var: ${name}`);
  }
  return value.trim();
}

function getConfig() {
  return {
    account: requireEnv("SNOWFLAKE_ACCOUNT", SNOWFLAKE_ACCOUNT),
    username: requireEnv("SNOWFLAKE_USERNAME", SNOWFLAKE_USERNAME),
    password: requireEnv("SNOWFLAKE_PASSWORD", SNOWFLAKE_PASSWORD),
    warehouse: requireEnv("SNOWFLAKE_WAREHOUSE", SNOWFLAKE_WAREHOUSE),
    database: requireEnv("SNOWFLAKE_DATABASE", SNOWFLAKE_DATABASE),
    schema: requireEnv("SNOWFLAKE_SCHEMA", SNOWFLAKE_SCHEMA),
    role: requireEnv("SNOWFLAKE_ROLE", SNOWFLAKE_ROLE),
  };
}

async function connectSnowflake(): Promise<snowflake.Connection> {
  const config = getConfig();

  const connection = snowflake.createConnection({
    account: config.account,
    username: config.username,
    password: config.password,
  });

  await new Promise<void>((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(
          new Error(`Snowflake connection failed: ${err.message || String(err)}`)
        );
        return;
      }
      resolve();
    });
  });

  try {
    await executeRaw(connection, `USE ROLE ${config.role}`);
    await executeRaw(connection, `USE WAREHOUSE ${config.warehouse}`);
    await executeRaw(connection, `USE DATABASE ${config.database}`);
    await executeRaw(connection, `USE SCHEMA ${config.schema}`);
  } catch (error) {
    await new Promise<void>((resolve) => {
      connection.destroy(() => resolve());
    });
    throw error;
  }

  return connection;
}

function executeRaw(
  connection: snowflake.Connection,
  sqlText: string,
  binds: BindScalar[] = []
): Promise<QueryRow[]> {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      binds: binds as unknown as snowflake.Binds,
      complete: (err, _stmt, rows) => {
        if (err) {
          reject(
            new Error(
              `Snowflake query failed: ${err.message || String(err)} | SQL: ${sqlText}`
            )
          );
          return;
        }

        resolve((rows as QueryRow[]) || []);
      },
    });
  });
}

export async function sfQuery<T extends QueryRow = QueryRow>(
  sqlText: string,
  binds: BindScalar[] = []
): Promise<T[]> {
  const connection = await connectSnowflake();

  try {
    const rows = await executeRaw(connection, sqlText, binds);
    return rows as T[];
  } finally {
    await new Promise<void>((resolve) => {
      connection.destroy((err) => {
        if (err) {
          console.error("Snowflake connection destroy failed:", err);
        }
        resolve();
      });
    });
  }
}

export async function executeQuery<T extends QueryRow = QueryRow>(
  sqlText: string,
  binds: BindScalar[] = []
): Promise<T[]> {
  return sfQuery<T>(sqlText, binds);
}

export async function snowflakeQuery<T extends QueryRow = QueryRow>(
  sqlText: string,
  binds: BindScalar[] = []
): Promise<T[]> {
  return sfQuery<T>(sqlText, binds);
}

export const sfQueryResult = sfQuery;
export const snowflakeCtx = {};
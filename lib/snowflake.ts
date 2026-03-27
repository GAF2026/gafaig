import snowflake from "snowflake-sdk";

let connection: snowflake.Connection | null = null;

function getConnection() {
  if (connection) return connection;

  connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USER,
    authenticator: "SNOWFLAKE_JWT",
    privateKey: process.env.SNOWFLAKE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    role: process.env.SNOWFLAKE_ROLE,
  });

  return connection;
}

async function connectIfNeeded() {
  const conn = getConnection();

  return new Promise<void>((resolve, reject) => {
    conn.connect((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Canonical query function
 */
export async function sfQuery<T = any>(
  sql: string,
  binds: any[] = []
): Promise<T[]> {
  const conn = getConnection();
  await connectIfNeeded();

  return new Promise<T[]>((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) return reject(err);
        resolve((rows as T[]) || []);
      },
    });
  });
}

/**
 * TYPE EXPORT (fixes Vercel build)
 */
export type sfQueryResult<T = any> = T[];

/**
 * TEMP COMPATIBILITY EXPORTS
 */
export const executeQuery = sfQuery;
export const snowflakeQuery = sfQuery;
import snowflake from "snowflake-sdk";

type Bind = string | number | boolean | null;

function getEnv(name: string) {
  return (process.env[name] || "").trim();
}

function requiredEnv(name: string) {
  const v = getEnv(name);
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

let connPromise: Promise<snowflake.Connection> | null = null;

async function getConnection(): Promise<snowflake.Connection> {
  if (connPromise) return connPromise;

  connPromise = new Promise((resolve, reject) => {
    try {
      const account = requiredEnv("SNOWFLAKE_ACCOUNT");
      const username = requiredEnv("SNOWFLAKE_USER");
      const password = requiredEnv("SNOWFLAKE_PASS");
      const warehouse = requiredEnv("SNOWFLAKE_WAREHOUSE");
      const database = requiredEnv("SNOWFLAKE_DATABASE");
      const schema = requiredEnv("SNOWFLAKE_SCHEMA");
      const role = requiredEnv("SNOWFLAKE_ROLE"); // ✅ REQUIRED

      const connection = snowflake.createConnection({
        account,
        username,
        password,
        warehouse,
        database,
        schema,
        role, // ✅ THIS is what activates GAFAIG_APP_ROLE
      });

      connection.connect((err) => {
        if (err) {
          connPromise = null;
          reject(err);
          return;
        }
        resolve(connection);
      });
    } catch (e) {
      connPromise = null;
      reject(e);
    }
  });

  return connPromise;
}

/**
 * Primary executor used by API routes and pages.
 * Returns rows as plain JS objects.
 */
export async function executeQuery(sqlText: string, binds: Bind[] = []) {
  const conn = await getConnection();

  return await new Promise<any[]>((resolve, reject) => {
    conn.execute({
      sqlText,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) return reject(err);
        resolve((rows || []) as any[]);
      },
    });
  });
}

/**
 * Backwards-compatible alias.
 */
export async function querySnowflake(sqlText: string, binds: Bind[] = []) {
  return executeQuery(sqlText, binds);
}
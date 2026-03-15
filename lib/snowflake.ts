import snowflake from "snowflake-sdk";

function env(name: string): string | undefined {
  const v = process.env[name];
  if (!v || v.trim() === "") return undefined;
  return v;
}

const account = env("SNOWFLAKE_ACCOUNT");
const username = env("SNOWFLAKE_USER") || env("SNOWFLAKE_USERNAME");
const warehouse = env("SNOWFLAKE_WAREHOUSE");
const database = env("SNOWFLAKE_DATABASE");
const schema = env("SNOWFLAKE_SCHEMA");
const role = env("SNOWFLAKE_ROLE");

const privateKey = env("SNOWFLAKE_PRIVATE_KEY");

if (!account) throw new Error("Missing SNOWFLAKE_ACCOUNT");
if (!username) throw new Error("Missing SNOWFLAKE_USER / SNOWFLAKE_USERNAME");
if (!warehouse) throw new Error("Missing SNOWFLAKE_WAREHOUSE");
if (!database) throw new Error("Missing SNOWFLAKE_DATABASE");
if (!schema) throw new Error("Missing SNOWFLAKE_SCHEMA");
if (!role) throw new Error("Missing SNOWFLAKE_ROLE");

export function createConnection() {
  return snowflake.createConnection({
    account,
    username,
    warehouse,
    database,
    schema,
    role,
    privateKey,
  });
}

export async function sfQuery<T = any>(
  sql: string,
  binds: any[] = []
): Promise<T[]> {
  const connection = createConnection();

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      connection.execute({
        sqlText: sql,
        binds,
        complete: (err, _stmt, rows) => {
          connection.destroy();

          if (err) {
            reject(err);
          } else {
            resolve((rows || []) as T[]);
          }
        },
      });
    });
  });
}
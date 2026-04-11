import fs from "fs";
import path from "path";
import crypto from "crypto";
import snowflake from "snowflake-sdk";

type BindScalar = string | number | boolean | Date | Uint8Array | null;
type QueryRow = Record<string, unknown>;

const {
  SNOWFLAKE_ACCOUNT,
  SNOWFLAKE_USERNAME,
  SNOWFLAKE_USER,
  SNOWFLAKE_PASSWORD,
  SNOWFLAKE_WAREHOUSE,
  SNOWFLAKE_DATABASE,
  SNOWFLAKE_SCHEMA,
  SNOWFLAKE_ROLE,
  SNOWFLAKE_PRIVATE_KEY,
  SNOWFLAKE_PRIVATE_KEY_PATH,
  SNOWFLAKE_PRIVATE_KEY_PASSPHRASE,
} = process.env;

function requireEnv(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required Snowflake env var: ${name}`);
  }
  return value.trim();
}

function getUsername(): string {
  return requireEnv(
    "SNOWFLAKE_USERNAME",
    SNOWFLAKE_USERNAME || SNOWFLAKE_USER
  );
}

function normalizePem(raw: string): string {
  return raw.replace(/\\n/g, "\n").trim();
}

function loadPrivateKey(): string {
  if (SNOWFLAKE_PRIVATE_KEY && SNOWFLAKE_PRIVATE_KEY.trim()) {
    const pem = normalizePem(SNOWFLAKE_PRIVATE_KEY);

    const keyObject = crypto.createPrivateKey({
      key: pem,
      format: "pem",
      passphrase: SNOWFLAKE_PRIVATE_KEY_PASSPHRASE || undefined,
    });

    return keyObject.export({
      format: "pem",
      type: "pkcs8",
    }).toString();
  }

  if (SNOWFLAKE_PRIVATE_KEY_PATH && SNOWFLAKE_PRIVATE_KEY_PATH.trim()) {
    const absolutePath = path.isAbsolute(SNOWFLAKE_PRIVATE_KEY_PATH)
      ? SNOWFLAKE_PRIVATE_KEY_PATH
      : path.resolve(process.cwd(), SNOWFLAKE_PRIVATE_KEY_PATH);

    const pemFromFile = fs.readFileSync(absolutePath, "utf8");

    const keyObject = crypto.createPrivateKey({
      key: pemFromFile,
      format: "pem",
      passphrase: SNOWFLAKE_PRIVATE_KEY_PASSPHRASE || undefined,
    });

    return keyObject.export({
      format: "pem",
      type: "pkcs8",
    }).toString();
  }

  throw new Error(
    "Missing Snowflake private key configuration. Set SNOWFLAKE_PRIVATE_KEY or SNOWFLAKE_PRIVATE_KEY_PATH."
  );
}

function getConfig() {
  return {
    account: requireEnv("SNOWFLAKE_ACCOUNT", SNOWFLAKE_ACCOUNT),
    username: getUsername(),
    warehouse: requireEnv("SNOWFLAKE_WAREHOUSE", SNOWFLAKE_WAREHOUSE),
    database: requireEnv("SNOWFLAKE_DATABASE", SNOWFLAKE_DATABASE),
    schema: requireEnv("SNOWFLAKE_SCHEMA", SNOWFLAKE_SCHEMA),
    role: requireEnv("SNOWFLAKE_ROLE", SNOWFLAKE_ROLE),
    privateKey: loadPrivateKey(),
  };
}

async function connectSnowflake(): Promise<snowflake.Connection> {
  const config = getConfig();

  const connection = snowflake.createConnection({
    account: config.account,
    username: config.username,
    authenticator: "SNOWFLAKE_JWT",
    privateKey: config.privateKey,
    warehouse: config.warehouse,
    database: config.database,
    schema: config.schema,
    role: config.role,
    clientSessionKeepAlive: false,
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
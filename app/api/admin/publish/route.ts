// app/api/admin/publish/route.ts

import { NextRequest, NextResponse } from "next/server";
import snowflake from "snowflake-sdk";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PublishBody = {
  caseId?: string;
  actor?: string;
};

type SnowflakeRow = Record<string, unknown>;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return String(value).trim();
}

function optionalEnv(name: string): string | null {
  const value = process.env[name];
  if (!value) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
}

function parseCaseId(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const value = input.trim();
  if (!value) return null;
  if (!/^[A-Z0-9][A-Z0-9._:-]{1,127}$/i.test(value)) return null;
  return value;
}

function parseActor(input: unknown): string {
  if (typeof input !== "string") return "demo-admin";
  const value = input.trim();
  if (!value) return "demo-admin";
  return value.slice(0, 255);
}

function getCandidateValues(
  row: Record<string, unknown> | undefined,
  keys: string[],
): unknown[] {
  if (!row) return [];
  const values: unknown[] = [];

  for (const key of keys) {
    values.push(row[key], row[key.toUpperCase()], row[key.toLowerCase()]);
  }

  return values;
}

function getFirstDefinedString(
  row: Record<string, unknown> | undefined,
  keys: string[],
): string | null {
  for (const value of getCandidateValues(row, keys)) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function getFirstDefinedNumber(
  row: Record<string, unknown> | undefined,
  keys: string[],
): number | null {
  for (const value of getCandidateValues(row, keys)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function getBooleanLike(
  row: Record<string, unknown> | undefined,
  keys: string[],
): boolean | null {
  for (const value of getCandidateValues(row, keys)) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "t", "yes", "y", "1"].includes(normalized)) return true;
      if (["false", "f", "no", "n", "0"].includes(normalized)) return false;
    }
  }
  return null;
}

function tryParseJsonObject(value: unknown): Record<string, unknown> | null {
  if (!value) return null;

  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }

  return null;
}

function extractProcedurePayload(row: SnowflakeRow | undefined): Record<string, unknown> {
  if (!row) return {};

  const directObject = tryParseJsonObject(row);
  if (!directObject) return {};

  const nestedKeys = [
    "SP_PUBLISH_CASE_TO_REGISTRY_V3",
    "sp_publish_case_to_registry_v3",
  ];

  for (const key of nestedKeys) {
    const nested = tryParseJsonObject(directObject[key]);
    if (nested) return nested;
  }

  const firstValue = Object.values(directObject)[0];
  const nestedFirst = tryParseJsonObject(firstValue);
  if (nestedFirst) return nestedFirst;

  return directObject;
}

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const validCookieNames = [
    "gafaig_admin_demo",
    "gafaig_admin_access",
    "admin_demo_access",
    "admin_access",
  ];

  for (const name of validCookieNames) {
    const value = request.cookies.get(name)?.value?.trim().toLowerCase();
    if (value && ["1", "true", "yes", "enabled", "active"].includes(value)) {
      return true;
    }
  }

  const expectedToken = optionalEnv("ADMIN_API_TOKEN");
  const providedToken =
    request.headers.get("x-admin-token")?.trim() ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();

  return Boolean(expectedToken && providedToken && expectedToken === providedToken);
}

function resolvePrivateKeyPath(rawPath: string): string {
  if (path.isAbsolute(rawPath)) return rawPath;
  return path.join(process.cwd(), rawPath);
}

function connectSnowflake(): Promise<snowflake.Connection> {
  const account = readEnv("SNOWFLAKE_ACCOUNT");
  const username =
    optionalEnv("SNOWFLAKE_USER") ??
    optionalEnv("SNOWFLAKE_USERNAME") ??
    (() => {
      throw new Error(
        "Missing required environment variable: SNOWFLAKE_USER or SNOWFLAKE_USERNAME",
      );
    })();

  const warehouse = readEnv("SNOWFLAKE_WAREHOUSE");
  const database = optionalEnv("SNOWFLAKE_DATABASE") ?? "GAFAIG_DB";
  const schema = optionalEnv("SNOWFLAKE_SCHEMA") ?? "CORE";
  const role = optionalEnv("SNOWFLAKE_ROLE") ?? undefined;

  const password = optionalEnv("SNOWFLAKE_PASSWORD");
  const privateKeyPathEnv = optionalEnv("SNOWFLAKE_PRIVATE_KEY_PATH");
  const privateKeyPass = optionalEnv("SNOWFLAKE_PRIVATE_KEY_PASSPHRASE");

  const usingPasswordAuth = Boolean(password);
  const usingKeyPairAuth = Boolean(!password && privateKeyPathEnv);

  if (!usingPasswordAuth && !usingKeyPairAuth) {
    throw new Error(
      "Snowflake auth is not configured. Set SNOWFLAKE_PASSWORD or SNOWFLAKE_PRIVATE_KEY_PATH.",
    );
  }

  const connection = snowflake.createConnection({
    account,
    username,
    warehouse,
    database,
    schema,
    role,
    clientSessionKeepAlive: false,
    ...(usingPasswordAuth
      ? {
          password,
        }
      : {
          authenticator: "SNOWFLAKE_JWT",
          privateKeyPath: resolvePrivateKeyPath(readEnv("SNOWFLAKE_PRIVATE_KEY_PATH")),
          ...(privateKeyPass ? { privateKeyPass } : {}),
        }),
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(connection);
    });
  });
}

function executeStatement<T extends SnowflakeRow = SnowflakeRow>(
  connection: snowflake.Connection,
  sqlText: string,
  binds: unknown[] = [],
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

function destroyConnection(connection: snowflake.Connection): Promise<void> {
  return new Promise((resolve) => {
    connection.destroy(() => resolve());
  });
}

function normalizePublishResult(
  caseId: string,
  actor: string,
  publishRows: SnowflakeRow[],
  registryRows: SnowflakeRow[],
) {
  const rawRow = publishRows[0];
  const payload = extractProcedurePayload(rawRow);
  const registryRow = registryRows[0];

  const snapshotId =
    getFirstDefinedString(payload, [
      "snapshotId",
      "SNAPSHOTID",
      "SNAPSHOT_ID",
      "snapshot_id",
    ]) ?? getFirstDefinedString(registryRow, ["SNAPSHOT_ID", "snapshot_id"]);

  const tier =
    getFirstDefinedString(payload, ["tier", "TIER"]) ??
    getFirstDefinedString(registryRow, ["CERTIFIED_TIER", "certified_tier"]);

  const band =
    getFirstDefinedString(payload, ["band", "BAND"]) ??
    getFirstDefinedString(registryRow, ["CERTIFIED_BAND", "certified_band"]);

  const finalScore =
    getFirstDefinedNumber(payload, [
      "finalScore",
      "FINALSCORE",
      "FINAL_SCORE",
      "final_score",
      "score",
      "SCORE",
    ]) ?? getFirstDefinedNumber(registryRow, ["CERTIFIED_SCORE", "certified_score"]);

  const registryId =
    getFirstDefinedString(registryRow, [
      "REGISTRY_ID",
      "registry_id",
      "REGISTRY_RECORD_ID",
      "registry_record_id",
    ]) ?? null;

  const applicationId =
    getFirstDefinedString(registryRow, [
      "APPLICATION_ID",
      "application_id",
    ]) ?? null;

  const entityName =
    getFirstDefinedString(registryRow, [
      "ENTITY_NAME",
      "entity_name",
    ]) ?? null;

  const certifiedAt =
    getFirstDefinedString(registryRow, [
      "CERTIFIED_AT",
      "certified_at",
    ]) ?? null;

  const published =
    getBooleanLike(payload, ["ok", "OK", "published", "PUBLISHED", "success", "SUCCESS"]) ??
    true;

  const status = published ? "published" : "failed";
  const message = published
    ? "Registry publish completed."
    : "Registry publish did not complete.";

  return {
    ok: true,
    caseId,
    actor,
    registryId,
    applicationId,
    entityName,
    snapshotId,
    published,
    status,
    message,
    tier,
    band,
    finalScore,
    certifiedAt,
    row: rawRow ?? null,
    payload,
    registryRecord: registryRow ?? null,
  };
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: PublishBody;

  try {
    body = (await request.json()) as PublishBody;
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const caseId = parseCaseId(body.caseId);
  const actor = parseActor(body.actor);

  if (!caseId) {
    return json({ ok: false, error: "A valid caseId is required" }, 400);
  }

  let connection: snowflake.Connection | null = null;

  try {
    connection = await connectSnowflake();

    const publishRows = await executeStatement(
      connection,
      "CALL GAFAIG_DB.CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(?, ?)",
      [caseId, actor],
    );

    const payload = extractProcedurePayload(publishRows[0]);
    const snapshotId =
      getFirstDefinedString(payload, [
        "snapshotId",
        "SNAPSHOTID",
        "SNAPSHOT_ID",
        "snapshot_id",
      ]) ?? null;

    let registryRows: SnowflakeRow[] = [];

    if (snapshotId) {
      registryRows = await executeStatement(
        connection,
        `
        SELECT
          REGISTRY_ID,
          APPLICATION_ID,
          CASE_ID,
          ENTITY_NAME,
          ENTITY_TYPE,
          COUNTRY,
          CERTIFIED_TIER,
          CERTIFIED_BAND,
          CERTIFIED_SCORE,
          CERTIFIED_AT,
          DECISION_STATUS,
          VALID_FROM,
          VALID_TO,
          LAST_ACTIVITY_AT,
          SNAPSHOT_ID
        FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
        WHERE SNAPSHOT_ID = ?
        ORDER BY CERTIFIED_AT DESC NULLS LAST, LAST_ACTIVITY_AT DESC NULLS LAST
        LIMIT 1
        `,
        [snapshotId],
      );
    }

    if (!registryRows.length) {
      registryRows = await executeStatement(
        connection,
        `
        SELECT
          REGISTRY_ID,
          APPLICATION_ID,
          CASE_ID,
          ENTITY_NAME,
          ENTITY_TYPE,
          COUNTRY,
          CERTIFIED_TIER,
          CERTIFIED_BAND,
          CERTIFIED_SCORE,
          CERTIFIED_AT,
          DECISION_STATUS,
          VALID_FROM,
          VALID_TO,
          LAST_ACTIVITY_AT,
          SNAPSHOT_ID
        FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
        WHERE CASE_ID = ?
        ORDER BY CERTIFIED_AT DESC NULLS LAST, LAST_ACTIVITY_AT DESC NULLS LAST
        LIMIT 1
        `,
        [caseId],
      );
    }

    return json(normalizePublishResult(caseId, actor, publishRows, registryRows), 200);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown publish error";

    return json(
      {
        ok: false,
        caseId,
        actor,
        error: "Failed to publish registry record",
        detail,
      },
      500,
    );
  } finally {
    if (connection) {
      await destroyConnection(connection);
    }
  }
}

export async function GET() {
  return json({ ok: false, error: "Method not allowed" }, 405);
}
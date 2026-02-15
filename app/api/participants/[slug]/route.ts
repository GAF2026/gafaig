import * as snowflake from "snowflake-sdk";

export const runtime = "nodejs";

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

function getEnv(name) {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : "";
}

async function connectSnowflake() {
  const account = getEnv("SNOWFLAKE_ACCOUNT");
  const username = getEnv("SNOWFLAKE_USERNAME") || getEnv("SNOWFLAKE_USER");
  const password = getEnv("SNOWFLAKE_PASSWORD");

  const warehouse = getEnv("SNOWFLAKE_WAREHOUSE");
  const database = getEnv("SNOWFLAKE_DATABASE") || "GAFAIG_DB";
  const schema = getEnv("SNOWFLAKE_SCHEMA") || "CORE";
  const role = getEnv("SNOWFLAKE_ROLE");

  if (!account || !username || !password) {
    throw new Error(
      "Missing Snowflake env vars. Need SNOWFLAKE_ACCOUNT + SNOWFLAKE_USERNAME (or SNOWFLAKE_USER) + SNOWFLAKE_PASSWORD."
    );
  }

  const conn = snowflake.createConnection({
    account,
    username,
    password,
    warehouse: warehouse || undefined,
    database: database || undefined,
    schema: schema || undefined,
    role: role || undefined,
  });

  await new Promise((resolve, reject) => {
    conn.connect((err) => {
      if (err) reject(err);
      else resolve(null);
    });
  });

  return conn;
}

function exec(conn, sqlText, binds) {
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText,
      binds: binds || [],
      complete: (err, _stmt, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      },
    });
  });
}

export async function GET(_req, ctx) {
  const slug = String(ctx?.params?.slug || "").trim();

  if (!slug) {
    return json({ ok: false, error: "Missing slug." }, { status: 400 });
  }

  let conn = null;

  try {
    conn = await connectSnowflake();

    const rows = await exec(
      conn,
      `
      SELECT *
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      WHERE LOWER(PROFILE_SLUG) = LOWER(?)
      LIMIT 1
      `,
      [slug]
    );

    const row = rows?.[0] || null;

    if (!row) {
      return json({ ok: false, error: "Not found" }, { status: 404 });
    }

    const out = {
      participantId: row.PARTICIPANT_ID ?? row.participant_id ?? null,
      name: row.NAME ?? row.name ?? null,
      profileSlug: row.PROFILE_SLUG ?? row.profile_slug ?? slug,
      country: row.COUNTRY ?? row.country ?? null,
      website: row.WEBSITE ?? row.website ?? null,
      participantType: row.PARTICIPANT_TYPE ?? row.participant_type ?? null,
      jurisdictionLevel: row.JURISDICTION_LEVEL ?? row.jurisdiction_level ?? null,
      status: row.STATUS ?? row.status ?? null,
      designation: row.DESIGNATION ?? row.designation ?? null,
      standardCode: row.STANDARD_CODE ?? row.standard_code ?? null,
      standardVersion: row.STANDARD_VERSION ?? row.standard_version ?? null,
      description: row.DESCRIPTION ?? row.description ?? null,
      updatedAt: row.UPDATED_AT ?? row.updated_at ?? null,
      createdAt: row.CREATED_AT ?? row.created_at ?? null,
      source: "snowflake",
    };

    return json({ ok: true, row: out });
  } catch (e) {
    // Always JSON, so the browser fetch() can show it
    return json(
      {
        ok: false,
        error: e?.message || "Failed to load participant profile.",
      },
      { status: 500 }
    );
  } finally {
    try {
      if (conn) conn.destroy(() => {});
    } catch {}
  }
}
import { NextResponse } from "next/server";
import snowflake from "snowflake-sdk";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

function getSnowflakeConfig() {
  const account = requireEnv("SNOWFLAKE_ACCOUNT");

  const username =
    process.env.SNOWFLAKE_USERNAME || process.env.SNOWFLAKE_USER;
  if (!username) throw new Error("Missing environment variable: SNOWFLAKE_USER");

  const password =
    process.env.SNOWFLAKE_PASSWORD || process.env.SNOWFLAKE_PASS;
  if (!password) throw new Error("Missing environment variable: SNOWFLAKE_PASS");

  const role = process.env.SNOWFLAKE_ROLE || "PUBLIC";
  const warehouse = process.env.SNOWFLAKE_WAREHOUSE || "GAFAIG_WH";
  const database = process.env.SNOWFLAKE_DATABASE || "GAFAIG_DB";
  const schema = process.env.SNOWFLAKE_SCHEMA || "CORE";

  return { account, username, password, role, warehouse, database, schema };
}

function connectSnowflake(): Promise<any> {
  const cfg = getSnowflakeConfig();

  const connection = snowflake.createConnection({
    account: cfg.account,
    username: cfg.username,
    password: cfg.password,
    role: cfg.role,
    warehouse: cfg.warehouse,
    database: cfg.database,
    schema: cfg.schema,
  });

  return new Promise((resolve, reject) => {
    connection.connect((err, conn) => {
      if (err) reject(err);
      else resolve(conn);
    });
  });
}

function execute(conn: any, sqlText: string, binds: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText,
      binds,
      complete: (err: any, _stmt: any, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows || []);
      },
    });
  });
}

function close(conn: any) {
  try {
    conn.destroy();
  } catch {}
}

function toInt(v: any, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function normalizeFilter(v: any): string {
  if (!v) return "all";
  const s = String(v).trim().toLowerCase();
  return s === "" ? "all" : s;
}

function mapRow(r: any) {
  return {
    participantId: r.PARTICIPANT_ID ?? null,
    name: r.NAME ?? null,
    profileSlug: r.PROFILE_SLUG ?? null,
    country: r.COUNTRY ?? null,
    website: r.WEBSITE ?? null,
    participantType: r.PARTICIPANT_TYPE ?? null,
    jurisdictionLevel: r.JURISDICTION_LEVEL ?? null,
    status: r.STATUS ?? null,
    // Not present in your table (yet) — keep null so UI stays stable:
    designation: null,
    standardCode: null,
    standardVersion: null,
    description: null,
    updatedAt: r.UPDATED_AT ?? null,
    createdAt: r.CREATED_AT ?? null,
    source: "snowflake",
  };
}

export async function GET(req: Request) {
  let conn: any;

  try {
    const url = new URL(req.url);

    const page = toInt(url.searchParams.get("page"), 1);
    const pageSize = Math.min(toInt(url.searchParams.get("pageSize"), 10), 100);

    const search = (url.searchParams.get("search") || "").trim();
    const participantType = normalizeFilter(url.searchParams.get("participantType"));
    const country = normalizeFilter(url.searchParams.get("country"));

    const statusParamRaw =
      url.searchParams.get("status") ||
      url.searchParams.get("verification") ||
      "all";
    const status = normalizeFilter(statusParamRaw);

    const where: string[] = [];
    const binds: any[] = [];

    if (search) {
      where.push(
        `(NAME ILIKE ? OR PROFILE_SLUG ILIKE ? OR COUNTRY ILIKE ? OR PARTICIPANT_TYPE ILIKE ?)`
      );
      const s = `%${search}%`;
      binds.push(s, s, s, s);
    }

    if (participantType !== "all") {
      where.push(`PARTICIPANT_TYPE = ?`);
      binds.push(participantType);
    }

    if (country !== "all") {
      where.push(`COUNTRY = ?`);
      binds.push(country);
    }

    if (status !== "all") {
      where.push(`STATUS = ?`);
      binds.push(status);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const offset = (page - 1) * pageSize;

    // ✅ Only columns that exist in CORE.PARTICIPANTS
    const listSql = `
      SELECT
        PARTICIPANT_ID,
        PARTICIPANT_TYPE,
        JURISDICTION_LEVEL,
        NAME,
        COUNTRY,
        WEBSITE,
        PROFILE_SLUG,
        STATUS,
        UPDATED_AT,
        CREATED_AT
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      ${whereSql}
      ORDER BY CREATED_AT DESC
      LIMIT ?
      OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(*) AS TOTAL
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      ${whereSql}
    `;

    conn = await connectSnowflake();

    const totalRows = await execute(conn, countSql, binds);
    const total = Number(totalRows?.[0]?.TOTAL ?? 0);

    const rows = await execute(conn, listSql, [...binds, pageSize, offset]);

    return NextResponse.json(
      {
        ok: true,
        rows: rows.map(mapRow),
        total,
        page,
        pageSize,
        filters: { search, participantType, country, status },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to load participants" },
      { status: 500 }
    );
  } finally {
    if (conn) close(conn);
  }
}
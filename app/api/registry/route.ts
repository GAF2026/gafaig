// app/api/registry/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegistryRow = {
  verificationId: string;
  organizationName: string;
  status: string;
  tier: string | null;
  band: string | null;
  standardCode: string | null;
  standardVersion: string | null;
  scoringModelVersion: string | null;
  verifiedAt: string | null;
  updatedAt: string | null;
};

type Ok = { ok: true; rows: RegistryRow[]; total: number };
type Err = { ok: false; error: string };

function json(data: Ok | Err, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}

/**
 * We intentionally avoid hard-coding a single helper signature because repo versions vary.
 * This adapter tries common patterns exported from /lib/snowflake.ts.
 */
async function snowflakeQuery<T = any>(sqlText: string, binds: any[] = []): Promise<T[]> {
  const snow = await import("@/lib/snowflake");
  const anySnow: any = snow as any;

  const fn =
    anySnow.query ??
    anySnow.execute ??
    anySnow.executeQuery ??
    anySnow.runQuery ??
    anySnow.snowflakeQuery ??
    anySnow.sfQuery;

  if (typeof fn !== "function") {
    throw new Error(
      "Snowflake helper not found. Expected one of: query / execute / executeQuery / runQuery / snowflakeQuery / sfQuery in lib/snowflake.ts"
    );
  }

  const result = await fn(sqlText, binds);

  // Normalize common return shapes:
  // - rows[]
  // - { rows: rows[] }
  // - { data: rows[] }
  if (Array.isArray(result)) return result;
  if (result?.rows && Array.isArray(result.rows)) return result.rows;
  if (result?.data && Array.isArray(result.data)) return result.data;

  throw new Error("Unexpected Snowflake query return shape.");
}

function coerceString(v: any): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v);
  return s.length ? s : null;
}

function mapRow(r: any): RegistryRow {
  return {
    verificationId: String(r.VERIFICATION_ID ?? r.verification_id ?? r.VERIFICATIONID ?? r.verificationId),
    organizationName: String(
      r.ORGANIZATION_NAME ??
        r.organization_name ??
        r.ENTITY_NAME ??
        r.entity_name ??
        r.ORG_NAME ??
        r.org_name ??
        "Unknown"
    ),
    status: String(r.STATUS ?? r.status ?? "unknown"),
    tier: coerceString(r.TIER ?? r.tier),
    band: coerceString(r.BAND ?? r.band),
    standardCode: coerceString(r.STANDARD_CODE ?? r.standard_code),
    standardVersion: coerceString(r.STANDARD_VERSION ?? r.standard_version),
    scoringModelVersion: coerceString(r.SCORING_MODEL_VERSION ?? r.scoring_model_version),
    verifiedAt: coerceString(r.VERIFIED_AT ?? r.verified_at),
    updatedAt: coerceString(r.UPDATED_AT ?? r.updated_at),
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limitRaw = url.searchParams.get("limit");
    const limit = Math.min(Math.max(Number(limitRaw ?? "50") || 50, 1), 200);

    // 1) Preferred: REGISTRY_SNAPSHOTS (controlled disclosures)
    // This assumes the table is the authoritative public feed once "publish" is wired.
    const primarySql = `
      SELECT
        /* Use stored verification id if present, else derive a deterministic one from CASE_ID */
        COALESCE(
          VERIFICATION_ID,
          CONCAT('GV-', TO_CHAR(COALESCE(VERIFIED_AT, UPDATED_AT, CURRENT_TIMESTAMP())::DATE, 'YYYY'), '-', SUBSTR(MD5(CASE_ID), 1, 12))
        ) AS VERIFICATION_ID,
        COALESCE(ORGANIZATION_NAME, ENTITY_NAME, ORG_NAME) AS ORGANIZATION_NAME,
        STATUS,
        TIER,
        BAND,
        STANDARD_CODE,
        STANDARD_VERSION,
        SCORING_MODEL_VERSION,
        TO_VARCHAR(VERIFIED_AT) AS VERIFIED_AT,
        TO_VARCHAR(UPDATED_AT)  AS UPDATED_AT
      FROM GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS
      ORDER BY COALESCE(VERIFIED_AT, UPDATED_AT) DESC
      LIMIT ?
    `;

    try {
      const primary = await snowflakeQuery<any>(primarySql, [limit]);
      const rows = primary.map(mapRow);
      return json({ ok: true, rows, total: rows.length });
    } catch (ePrimary: any) {
      // If REGISTRY_SNAPSHOTS doesn't exist yet or schema differs, fall back.
    }

    // 2) Fallback: derive from VERIFICATION_CASES + latest CASE_SCORE_SNAPSHOTS_V2
    // We still only emit controlled fields (no findings, no evidence, no internal notes).
    const fallbackSql = `
      WITH latest_score AS (
        SELECT
          CASE_ID,
          SCORE,
          TIER,
          BAND,
          STANDARD_CODE,
          STANDARD_VERSION,
          SCORING_MODEL_VERSION,
          UPDATED_AT,
          ROW_NUMBER() OVER (PARTITION BY CASE_ID ORDER BY UPDATED_AT DESC) AS RN
        FROM GAFAIG_DB.CORE.CASE_SCORE_SNAPSHOTS_V2
      )
      SELECT
        CONCAT(
          'GV-',
          TO_CHAR(COALESCE(vc.UPDATED_AT, ls.UPDATED_AT, CURRENT_TIMESTAMP())::DATE, 'YYYY'),
          '-',
          SUBSTR(MD5(vc.CASE_ID), 1, 12)
        ) AS VERIFICATION_ID,
        COALESCE(vc.ENTITY_NAME, vc.ORG_NAME, vc.ORGANIZATION_NAME) AS ORGANIZATION_NAME,
        vc.STATUS,
        COALESCE(vc.TIER, ls.TIER) AS TIER,
        COALESCE(vc.BAND, ls.BAND) AS BAND,
        ls.STANDARD_CODE,
        ls.STANDARD_VERSION,
        ls.SCORING_MODEL_VERSION,
        NULL AS VERIFIED_AT,
        TO_VARCHAR(COALESCE(vc.UPDATED_AT, ls.UPDATED_AT)) AS UPDATED_AT
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES vc
      LEFT JOIN latest_score ls
        ON ls.CASE_ID = vc.CASE_ID
       AND ls.RN = 1
      ORDER BY COALESCE(vc.UPDATED_AT, ls.UPDATED_AT) DESC
      LIMIT ?
    `;

    const fallback = await snowflakeQuery<any>(fallbackSql, [limit]);
    const rows = fallback
      .map(mapRow)
      // Avoid publishing obviously empty org names
      .filter((r) => r.organizationName && r.organizationName !== "Unknown");

    return json({ ok: true, rows, total: rows.length });
  } catch (e: any) {
    return json({ ok: false, error: e?.message || "Registry endpoint failed." }, 500);
  }
}
import { sfQuery } from "@/lib/snowflake";

export type RegistryQueryRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  country: string | null;
  entityType: string | null;
  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
};

type RegistrySourceRow = Record<string, unknown>;

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function normalizeId(value: string): string {
  return String(value || "")
    .normalize("NFKD")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

function normalizeRegistryRow(row: RegistrySourceRow): RegistryQueryRow {
  return {
    registryId: asString(row.REGISTRY_ID) ?? "",
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    entityName: asString(row.ENTITY_NAME),
    country: asString(row.COUNTRY),
    entityType: asString(row.ENTITY_TYPE),
    certifiedScore: asString(row.CERTIFIED_SCORE),
    certifiedTier: asString(row.CERTIFIED_TIER),
    certifiedBand: asString(row.CERTIFIED_BAND),
    decisionStatus: asString(row.DECISION_STATUS),
    validFrom: asString(row.VALID_FROM),
    validTo: asString(row.VALID_TO),
    certifiedAt: asString(row.CERTIFIED_AT),
  };
}

const REGISTRY_SOURCE = "GAFAIG_DB.CORE.V_REGISTRY_PUBLIC";

const REGISTRY_SELECT = `
  SELECT
    REGISTRY_ID,
    APPLICATION_ID,
    CASE_ID,
    ENTITY_NAME,
    ENTITY_TYPE,
    COUNTRY,
    CERTIFIED_SCORE,
    CERTIFIED_TIER,
    CERTIFIED_BAND,
    DECISION_STATUS,
    VALID_FROM,
    VALID_TO,
    CERTIFIED_AT
  FROM ${REGISTRY_SOURCE}
`;

function buildRegistryWhereClause(params: {
  q?: string;
  country?: string;
  registryId?: string;
  caseId?: string;
  applicationId?: string;
}) {
  const where: string[] = [];
  const binds: Array<string | number> = [];

  const q = String(params.q ?? "").trim();
  const country = String(params.country ?? "").trim();
  const registryId = String(params.registryId ?? "").trim();
  const caseId = String(params.caseId ?? "").trim();
  const applicationId = String(params.applicationId ?? "").trim();

  if (country) {
    where.push(`UPPER(TRIM(COUNTRY)) = UPPER(TRIM(?))`);
    binds.push(country);
  }

  if (registryId) {
    where.push(`
      UPPER(REGEXP_REPLACE(REGISTRY_ID, '[^A-Za-z0-9]', '')) =
      UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    `);
    binds.push(registryId);
  }

  if (caseId) {
    where.push(`
      UPPER(REGEXP_REPLACE(CASE_ID, '[^A-Za-z0-9]', '')) =
      UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    `);
    binds.push(caseId);
  }

  if (applicationId) {
    where.push(`
      UPPER(REGEXP_REPLACE(APPLICATION_ID, '[^A-Za-z0-9]', '')) =
      UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    `);
    binds.push(applicationId);
  }

  if (q) {
    const like = `%${escapeLike(q)}%`;

    where.push(`
      (
        COALESCE(ENTITY_NAME, '') ILIKE ? ESCAPE '\\'
        OR COALESCE(ENTITY_TYPE, '') ILIKE ? ESCAPE '\\'
        OR COALESCE(COUNTRY, '') ILIKE ? ESCAPE '\\'
        OR COALESCE(REGISTRY_ID, '') ILIKE ? ESCAPE '\\'
        OR COALESCE(CASE_ID, '') ILIKE ? ESCAPE '\\'
        OR COALESCE(APPLICATION_ID, '') ILIKE ? ESCAPE '\\'
        OR COALESCE(CERTIFIED_TIER, '') ILIKE ? ESCAPE '\\'
        OR COALESCE(CERTIFIED_BAND, '') ILIKE ? ESCAPE '\\'
        OR COALESCE(DECISION_STATUS, '') ILIKE ? ESCAPE '\\'
      )
    `);

    binds.push(like, like, like, like, like, like, like, like, like);
  }

  return {
    whereSql: where.length > 0 ? `WHERE ${where.join("\n      AND ")}` : "",
    binds,
  };
}

export async function getRegistryRecords(
  limit = 100
): Promise<RegistryQueryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<RegistrySourceRow>(
    `
    ${REGISTRY_SELECT}
    ORDER BY ENTITY_NAME ASC, REGISTRY_ID ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map(normalizeRegistryRow).filter((row) => row.registryId);
}

export async function getRegistryCountries(): Promise<string[]> {
  const rows = await sfQuery<RegistrySourceRow>(
    `
    SELECT DISTINCT COUNTRY
    FROM ${REGISTRY_SOURCE}
    WHERE COUNTRY IS NOT NULL
      AND TRIM(COUNTRY) <> ''
    ORDER BY COUNTRY ASC
    `
  );

  return rows
    .map((row) => asString(row.COUNTRY))
    .filter((value): value is string => Boolean(value));
}

export async function searchRegistryRecords(params: {
  q?: string;
  country?: string;
  registryId?: string;
  caseId?: string;
  applicationId?: string;
  limit?: number;
}): Promise<RegistryQueryRow[]> {
  const safeLimit = Math.max(1, Math.min(params.limit ?? 500, 1000));
  const { whereSql, binds } = buildRegistryWhereClause(params);

  const rows = await sfQuery<RegistrySourceRow>(
    `
    ${REGISTRY_SELECT}
    ${whereSql}
    ORDER BY ENTITY_NAME ASC, REGISTRY_ID ASC
    LIMIT ?
    `,
    [...binds, safeLimit]
  );

  return rows.map(normalizeRegistryRow).filter((row) => row.registryId);
}

export async function getRegistryRecordByRegistryId(
  registryId: string
): Promise<RegistryQueryRow | null> {
  const id = String(registryId || "").trim();
  if (!id) return null;

  const rows = await sfQuery<RegistrySourceRow>(
    `
    ${REGISTRY_SELECT}
    WHERE UPPER(REGEXP_REPLACE(REGISTRY_ID, '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    LIMIT 1
    `,
    [id]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  return normalizeRegistryRow(rows[0]);
}

export const getRegistryByRegistryId = getRegistryRecordByRegistryId;
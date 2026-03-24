import { snowflakeQuery } from "@/lib/snowflake";

export type RegistryRecordRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certifiedScore: number | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;

  validFrom: string | null;
  validTo: string | null;

  certifiedAt: string | null;
  lastActivityAt: string | null;

  snapshotId: string | null;

  modelVersion: string | null;
  renewalStatus: string | null;
  scoredAt: string | null;
};

export type RegistrySearchRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certifiedScore: number | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;

  validFrom: string | null;
  validTo: string | null;

  certifiedAt: string | null;
  lastActivityAt: string | null;

  snapshotId: string | null;

  modelVersion: string | null;
  renewalStatus: string | null;
  scoredAt: string | null;
};

export type RegistryVerificationRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certifiedScore: number | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;

  validFrom: string | null;
  validTo: string | null;

  certifiedAt: string | null;
  lastActivityAt: string | null;

  snapshotId: string | null;

  modelVersion: string | null;
  renewalStatus: string | null;
  scoredAt: string | null;
};

type RegistrySearchFilters = {
  q?: string;
  country?: string;
  registryId?: string;
  caseId?: string;
  applicationId?: string;
  limit?: number;
};

function firstString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function firstNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toIsoString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return value.toISOString();

  const s = String(value).trim();
  if (!s) return null;

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toISOString();
}

function normalizeRegistryRow(row: Record<string, unknown>): RegistryRecordRow {
  return {
    registryId: firstString(row.REGISTRY_ID) ?? "",
    applicationId: firstString(row.APPLICATION_ID),
    caseId: firstString(row.CASE_ID),

    entityName: firstString(row.ENTITY_NAME),
    entityType: firstString(row.ENTITY_TYPE),
    country: firstString(row.COUNTRY),

    certifiedScore: firstNumber(row.CERTIFIED_SCORE),
    certifiedTier: firstString(row.CERTIFIED_TIER),
    certifiedBand: firstString(row.CERTIFIED_BAND),
    decisionStatus: firstString(row.DECISION_STATUS),

    validFrom: toIsoString(row.VALID_FROM),
    validTo: toIsoString(row.VALID_TO),

    certifiedAt: toIsoString(row.CERTIFIED_AT),
    lastActivityAt: toIsoString(row.LAST_ACTIVITY_AT),

    snapshotId: firstString(row.SNAPSHOT_ID),

    modelVersion: firstString(row.MODEL_VERSION),
    renewalStatus: firstString(row.RENEWAL_STATUS),
    scoredAt: toIsoString(row.SCORED_AT),
  };
}

function normalizeRegistrySearchRow(
  row: Record<string, unknown>
): RegistrySearchRow {
  return {
    registryId: firstString(row.REGISTRY_ID) ?? "",
    applicationId: firstString(row.APPLICATION_ID),
    caseId: firstString(row.CASE_ID),

    entityName: firstString(row.ENTITY_NAME),
    entityType: firstString(row.ENTITY_TYPE),
    country: firstString(row.COUNTRY),

    certifiedScore: firstNumber(row.CERTIFIED_SCORE),
    certifiedTier: firstString(row.CERTIFIED_TIER),
    certifiedBand: firstString(row.CERTIFIED_BAND),
    decisionStatus: firstString(row.DECISION_STATUS),

    validFrom: toIsoString(row.VALID_FROM),
    validTo: toIsoString(row.VALID_TO),

    certifiedAt: toIsoString(row.CERTIFIED_AT),
    lastActivityAt: toIsoString(row.LAST_ACTIVITY_AT),

    snapshotId: firstString(row.SNAPSHOT_ID),

    modelVersion: firstString(row.MODEL_VERSION),
    renewalStatus: firstString(row.RENEWAL_STATUS),
    scoredAt: toIsoString(row.SCORED_AT),
  };
}

function normalizeRegistryVerificationRow(
  row: Record<string, unknown>
): RegistryVerificationRow {
  return {
    registryId: firstString(row.REGISTRY_ID) ?? "",
    applicationId: firstString(row.APPLICATION_ID),
    caseId: firstString(row.CASE_ID),

    entityName: firstString(row.ENTITY_NAME),
    entityType: firstString(row.ENTITY_TYPE),
    country: firstString(row.COUNTRY),

    certifiedScore: firstNumber(row.CERTIFIED_SCORE),
    certifiedTier: firstString(row.CERTIFIED_TIER),
    certifiedBand: firstString(row.CERTIFIED_BAND),
    decisionStatus: firstString(row.DECISION_STATUS),

    validFrom: toIsoString(row.VALID_FROM),
    validTo: toIsoString(row.VALID_TO),

    certifiedAt: toIsoString(row.CERTIFIED_AT),
    lastActivityAt: toIsoString(row.LAST_ACTIVITY_AT),

    snapshotId: firstString(row.SNAPSHOT_ID),

    modelVersion: firstString(row.MODEL_VERSION),
    renewalStatus: firstString(row.RENEWAL_STATUS),
    scoredAt: toIsoString(row.SCORED_AT),
  };
}

const BASE_SELECT = `
  SELECT
    REGISTRY_ID,
    APPLICATION_ID,
    CASE_ID,
    ENTITY_NAME,
    CAST(NULL AS VARCHAR)        AS ENTITY_TYPE,
    COUNTRY,
    CERTIFIED_SCORE,
    CERTIFIED_TIER,
    CERTIFIED_BAND,
    DECISION_STATUS,
    APPROVED_AT                  AS VALID_FROM,
    CAST(NULL AS TIMESTAMP_NTZ)  AS VALID_TO,
    CERTIFIED_AT,
    PUBLISHED_AT                 AS LAST_ACTIVITY_AT,
    CAST(NULL AS VARCHAR)        AS SNAPSHOT_ID,
    MODEL_VERSION,
    RENEWAL_STATUS,
    APPROVED_AT                  AS SCORED_AT
  FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
`;

function buildWhere(filters: RegistrySearchFilters) {
  const clauses: string[] = [];
  const binds: unknown[] = [];

  if (filters.registryId?.trim()) {
    clauses.push(`TRIM(UPPER(REGISTRY_ID)) = TRIM(UPPER(?))`);
    binds.push(filters.registryId.trim());
  }

  if (filters.caseId?.trim()) {
    clauses.push(`TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))`);
    binds.push(filters.caseId.trim());
  }

  if (filters.applicationId?.trim()) {
    clauses.push(`TRIM(UPPER(APPLICATION_ID)) = TRIM(UPPER(?))`);
    binds.push(filters.applicationId.trim());
  }

  if (filters.country?.trim()) {
    clauses.push(`TRIM(UPPER(COUNTRY)) = TRIM(UPPER(?))`);
    binds.push(filters.country.trim());
  }

  if (filters.q?.trim()) {
    const q = `%${filters.q.trim()}%`;
    clauses.push(`
      (
        REGISTRY_ID ILIKE ?
        OR CASE_ID ILIKE ?
        OR APPLICATION_ID ILIKE ?
        OR ENTITY_NAME ILIKE ?
        OR MODEL_VERSION ILIKE ?
        OR CERTIFIED_TIER ILIKE ?
        OR CERTIFIED_BAND ILIKE ?
        OR DECISION_STATUS ILIKE ?
      )
    `);
    binds.push(q, q, q, q, q, q, q, q);
  }

  const where = clauses.length ? ` WHERE ${clauses.join(" AND ")}` : "";
  return { where, binds };
}

export async function getRegistryRecords(limit = 50): Promise<RegistryRecordRow[]> {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);

  const sql = `
    ${BASE_SELECT}
    ORDER BY CERTIFIED_AT DESC NULLS LAST, REGISTRY_ID ASC
    LIMIT ?
  `;

  const rows = await snowflakeQuery(sql, [safeLimit]);
  return rows.map((row) => normalizeRegistryRow(row as Record<string, unknown>));
}

export async function getRegistryByRegistryId(
  registryId: string
): Promise<RegistryRecordRow | null> {
  const sql = `
    ${BASE_SELECT}
    WHERE TRIM(UPPER(REGISTRY_ID)) = TRIM(UPPER(?))
    LIMIT 1
  `;

  const rows = await snowflakeQuery(sql, [registryId]);
  return rows[0]
    ? normalizeRegistryRow(rows[0] as Record<string, unknown>)
    : null;
}

export async function searchRegistryRecords(
  filters: RegistrySearchFilters
): Promise<RegistrySearchRow[]> {
  const safeLimit = Math.min(Math.max(Number(filters.limit) || 50, 1), 200);
  const { where, binds } = buildWhere(filters);

  const sql = `
    ${BASE_SELECT}
    ${where}
    ORDER BY CERTIFIED_AT DESC NULLS LAST, REGISTRY_ID ASC
    LIMIT ?
  `;

  const rows = await snowflakeQuery(sql, [...binds, safeLimit]);
  return rows.map((row) =>
    normalizeRegistrySearchRow(row as Record<string, unknown>)
  );
}

export async function getRegistryVerificationByRegistryId(
  registryId: string
): Promise<RegistryVerificationRow | null> {
  const sql = `
    ${BASE_SELECT}
    WHERE TRIM(UPPER(REGISTRY_ID)) = TRIM(UPPER(?))
    LIMIT 1
  `;

  const rows = await snowflakeQuery(sql, [registryId]);
  return rows[0]
    ? normalizeRegistryVerificationRow(rows[0] as Record<string, unknown>)
    : null;
}
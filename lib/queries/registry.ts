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
};

export type RegistrySearchRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;

  validFrom: string | null;
  validTo: string | null;

  certifiedAt: string | null;
  lastActivityAt: string | null;
};

export type RegistrySearchFilters = {
  q?: string;
  country?: string;
  registryId?: string;
  caseId?: string;
  applicationId?: string;
  limit?: number;
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

function firstString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function firstNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
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

    validFrom: firstString(row.VALID_FROM),
    validTo: firstString(row.VALID_TO),

    certifiedAt: firstString(row.CERTIFIED_AT),
    lastActivityAt: firstString(row.LAST_ACTIVITY_AT),
    snapshotId: firstString(row.SNAPSHOT_ID),
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

    certifiedTier: firstString(row.CERTIFIED_TIER),
    certifiedBand: firstString(row.CERTIFIED_BAND),
    decisionStatus: firstString(row.DECISION_STATUS),

    validFrom: firstString(row.VALID_FROM),
    validTo: firstString(row.VALID_TO),

    certifiedAt: firstString(row.CERTIFIED_AT),
    lastActivityAt: firstString(row.LAST_ACTIVITY_AT),
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

    validFrom: firstString(row.VALID_FROM),
    validTo: firstString(row.VALID_TO),

    certifiedAt: firstString(row.CERTIFIED_AT),
    lastActivityAt: firstString(row.LAST_ACTIVITY_AT),
    snapshotId: firstString(row.SNAPSHOT_ID),

    modelVersion: firstString(row.MODEL_VERSION),
    renewalStatus: firstString(row.RENEWAL_STATUS),
    scoredAt: firstString(row.SCORED_AT),
  };
}

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
    CERTIFIED_AT,
    LAST_ACTIVITY_AT,
    SNAPSHOT_ID
  FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
`;

const REGISTRY_SEARCH_SELECT = `
  SELECT
    REGISTRY_ID,
    APPLICATION_ID,
    CASE_ID,
    ENTITY_NAME,
    ENTITY_TYPE,
    COUNTRY,
    CERTIFIED_TIER,
    CERTIFIED_BAND,
    DECISION_STATUS,
    VALID_FROM,
    VALID_TO,
    CERTIFIED_AT,
    LAST_ACTIVITY_AT
  FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC_SEARCH
`;

const REGISTRY_VERIFY_SELECT = `
  SELECT
    rp.REGISTRY_ID,
    rp.APPLICATION_ID,
    rp.CASE_ID,
    rp.ENTITY_NAME,
    rp.ENTITY_TYPE,
    rp.COUNTRY,
    rp.CERTIFIED_SCORE,
    rp.CERTIFIED_TIER,
    rp.CERTIFIED_BAND,
    rp.DECISION_STATUS,
    rp.VALID_FROM,
    rp.VALID_TO,
    rp.CERTIFIED_AT,
    rp.LAST_ACTIVITY_AT,
    rp.SNAPSHOT_ID,
    os.MODEL_VERSION,
    os.RENEWAL_STATUS,
    os.SCORED_AT
  FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC rp
  LEFT JOIN GAFAIG_DB.CORE.V_PUBLIC_OVERSIGHT_SIGNAL os
    ON TRIM(UPPER(os.CASE_ID)) = TRIM(UPPER(rp.CASE_ID))
`;

export async function getRegistryRecords(
  limit = 50
): Promise<RegistryRecordRow[]> {
  const boundedLimit = Math.min(Math.max(limit, 1), 200);

  const sql = `
    ${REGISTRY_SELECT}
    ORDER BY CERTIFIED_AT DESC NULLS LAST, LAST_ACTIVITY_AT DESC NULLS LAST
    LIMIT ?
  `;

  const rows = await snowflakeQuery<Record<string, unknown>>(sql, [boundedLimit]);
  return rows.map(normalizeRegistryRow);
}

export async function getRegistryByRegistryId(
  registryId: string
): Promise<RegistryRecordRow | null> {
  const sql = `
    ${REGISTRY_SELECT}
    WHERE TRIM(UPPER(REGISTRY_ID)) = TRIM(UPPER(?))
    LIMIT 1
  `;

  const rows = await snowflakeQuery<Record<string, unknown>>(sql, [registryId]);
  return rows[0] ? normalizeRegistryRow(rows[0]) : null;
}

export async function searchRegistryRecords(
  filters: RegistrySearchFilters
): Promise<RegistrySearchRow[]> {
  const limit = Math.min(Math.max(filters.limit ?? 50, 1), 200);
  const q = String(filters.q ?? "").trim();
  const country = String(filters.country ?? "").trim();
  const registryId = String(filters.registryId ?? "").trim();
  const caseId = String(filters.caseId ?? "").trim();
  const applicationId = String(filters.applicationId ?? "").trim();

  const sql = `
    ${REGISTRY_SEARCH_SELECT}
    WHERE 1 = 1
      AND (? = '' OR Q ILIKE '%' || ? || '%')
      AND (? = '' OR COUNTRY_NORM = TRIM(UPPER(?)))
      AND (? = '' OR REGISTRY_ID_NORM = TRIM(UPPER(?)))
      AND (? = '' OR TRIM(UPPER(COALESCE(CASE_ID, ''))) = TRIM(UPPER(?)))
      AND (? = '' OR TRIM(UPPER(COALESCE(APPLICATION_ID, ''))) = TRIM(UPPER(?)))
    ORDER BY CERTIFIED_AT DESC NULLS LAST, LAST_ACTIVITY_AT DESC NULLS LAST
    LIMIT ?
  `;

  const params = [
    q,
    q,
    country,
    country,
    registryId,
    registryId,
    caseId,
    caseId,
    applicationId,
    applicationId,
    limit,
  ];

  const rows = await snowflakeQuery<Record<string, unknown>>(sql, params);
  return rows.map(normalizeRegistrySearchRow);
}

export async function getRegistryVerificationByRegistryId(
  registryId: string
): Promise<RegistryVerificationRow | null> {
  const sql = `
    ${REGISTRY_VERIFY_SELECT}
    WHERE TRIM(UPPER(rp.REGISTRY_ID)) = TRIM(UPPER(?))
    LIMIT 1
  `;

  const rows = await snowflakeQuery<Record<string, unknown>>(sql, [registryId]);
  return rows[0] ? normalizeRegistryVerificationRow(rows[0]) : null;
}
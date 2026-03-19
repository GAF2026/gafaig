import { snowflakeQuery } from "@/lib/snowflake";

export type RegistryAiSystemRow = {
  systemId: string;
  registryId: string | null;
  applicationId: string | null;
  caseId: string | null;

  systemName: string;
  systemType: string | null;
  intendedUse: string | null;

  deploymentStatus: string | null;
  oversightLevel: string | null;
  riskTier: string | null;
  developerOrganization: string | null;
  trainingDataCategory: string | null;
  oversightModel: string | null;
  humanReviewRequired: boolean | null;
  evaluationProtocol: string | null;
  auditFrequency: string | null;
  publicSummary: string | null;
  isPublic: boolean | null;
  displayOrder: number | null;
  createdAt: string | null;
  updatedAt: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedScore: number | null;
  certifiedAt: string | null;
  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  lastActivityAt: string | null;
};

export type RegistryAiSystemsSortBy = "name" | "score" | "tier" | "country";
export type RegistryAiSystemsSortOrder = "asc" | "desc";

export type GetRegistryAiSystemsParams = {
  search?: string;
  country?: string;
  tier?: string;
  band?: string;
  sortBy?: RegistryAiSystemsSortBy;
  sortOrder?: RegistryAiSystemsSortOrder;
  page?: number;
  pageSize?: number;
};

export type PaginatedRegistryAiSystemsResult = {
  rows: RegistryAiSystemRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type RegistryAiSystemsFilterOptions = {
  countries: string[];
  tiers: string[];
  bands: string[];
};

export type RegistryAiSystemsSummaryStats = {
  totalSystems: number;
  linkedEntities: number;
  countries: number;
};

function normalizeRow(row: Record<string, any>): RegistryAiSystemRow {
  return {
    systemId: row.SYSTEM_ID,
    registryId: row.REGISTRY_ID ?? null,
    applicationId: row.APPLICATION_ID ?? null,
    caseId: row.CASE_ID ?? null,

    systemName: row.SYSTEM_NAME,
    systemType: row.SYSTEM_TYPE ?? null,
    intendedUse: row.INTENDED_USE ?? null,

    deploymentStatus: row.DEPLOYMENT_STATUS ?? null,
    oversightLevel: row.OVERSIGHT_LEVEL ?? null,
    riskTier: row.RISK_TIER ?? null,
    developerOrganization: row.DEVELOPER_ORGANIZATION ?? null,
    trainingDataCategory: row.TRAINING_DATA_CATEGORY ?? null,
    oversightModel: row.OVERSIGHT_MODEL ?? null,
    humanReviewRequired: row.HUMAN_REVIEW_REQUIRED ?? null,
    evaluationProtocol: row.EVALUATION_PROTOCOL ?? null,
    auditFrequency: row.AUDIT_FREQUENCY ?? null,
    publicSummary: row.PUBLIC_SUMMARY ?? null,
    isPublic: row.IS_PUBLIC ?? null,
    displayOrder: row.DISPLAY_ORDER ?? null,
    createdAt: row.CREATED_AT ?? null,
    updatedAt: row.UPDATED_AT ?? null,

    entityName: row.ENTITY_NAME ?? null,
    entityType: row.ENTITY_TYPE ?? null,
    country: row.COUNTRY ?? null,

    certifiedTier: row.CERTIFIED_TIER ?? null,
    certifiedBand: row.CERTIFIED_BAND ?? null,
    certifiedScore: row.CERTIFIED_SCORE ?? null,
    certifiedAt: row.CERTIFIED_AT ?? null,
    decisionStatus: row.DECISION_STATUS ?? null,
    validFrom: row.VALID_FROM ?? null,
    validTo: row.VALID_TO ?? null,
    lastActivityAt: row.LAST_ACTIVITY_AT ?? null,
  };
}

const baseSelect = `
  SELECT
    SYSTEM_ID,
    REGISTRY_ID,
    APPLICATION_ID,
    CASE_ID,
    SYSTEM_NAME,
    SYSTEM_TYPE,
    INTENDED_USE,
    DEPLOYMENT_STATUS,
    OVERSIGHT_LEVEL,
    RISK_TIER,
    DEVELOPER_ORGANIZATION,
    TRAINING_DATA_CATEGORY,
    OVERSIGHT_MODEL,
    HUMAN_REVIEW_REQUIRED,
    EVALUATION_PROTOCOL,
    AUDIT_FREQUENCY,
    PUBLIC_SUMMARY,
    IS_PUBLIC,
    DISPLAY_ORDER,
    CREATED_AT,
    UPDATED_AT,
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
    LAST_ACTIVITY_AT
  FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
`;

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function toPositiveInteger(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value) || !value || value < 1) return fallback;
  return Math.floor(value);
}

function clampPageSize(value: number | undefined, fallback = 25, max = 100): number {
  const size = toPositiveInteger(value, fallback);
  return Math.min(size, max);
}

function getOrderByClause(
  sortBy: RegistryAiSystemsSortBy = "name",
  sortOrder: RegistryAiSystemsSortOrder = "asc"
): string {
  const direction = sortOrder === "desc" ? "DESC" : "ASC";

  switch (sortBy) {
    case "score":
      return `
        ORDER BY
          CERTIFIED_SCORE ${direction} NULLS LAST,
          COALESCE(DISPLAY_ORDER, 999999) ASC,
          SYSTEM_NAME ASC
      `;
    case "tier":
      return `
        ORDER BY
          CERTIFIED_TIER ${direction} NULLS LAST,
          COALESCE(DISPLAY_ORDER, 999999) ASC,
          SYSTEM_NAME ASC
      `;
    case "country":
      return `
        ORDER BY
          COUNTRY ${direction} NULLS LAST,
          COALESCE(DISPLAY_ORDER, 999999) ASC,
          SYSTEM_NAME ASC
      `;
    case "name":
    default:
      return `
        ORDER BY
          COALESCE(DISPLAY_ORDER, 999999) ASC,
          SYSTEM_NAME ${direction}
      `;
  }
}

function buildWhereClause(params: GetRegistryAiSystemsParams): string {
  const conditions: string[] = [];

  if (params.search?.trim()) {
    const safeSearch = escapeSqlString(params.search.trim());
    conditions.push(`
      (
        UPPER(TRIM(COALESCE(SYSTEM_ID, ''))) LIKE UPPER('%${safeSearch}%')
        OR UPPER(TRIM(COALESCE(REGISTRY_ID, ''))) LIKE UPPER('%${safeSearch}%')
        OR UPPER(TRIM(COALESCE(SYSTEM_NAME, ''))) LIKE UPPER('%${safeSearch}%')
        OR UPPER(TRIM(COALESCE(ENTITY_NAME, ''))) LIKE UPPER('%${safeSearch}%')
        OR UPPER(TRIM(COALESCE(DEVELOPER_ORGANIZATION, ''))) LIKE UPPER('%${safeSearch}%')
      )
    `);
  }

  if (params.country?.trim()) {
    const safeCountry = escapeSqlString(params.country.trim());
    conditions.push(`
      TRIM(UPPER(COALESCE(COUNTRY, ''))) = TRIM(UPPER('${safeCountry}'))
    `);
  }

  if (params.tier?.trim()) {
    const safeTier = escapeSqlString(params.tier.trim());
    conditions.push(`
      TRIM(UPPER(COALESCE(CERTIFIED_TIER, ''))) = TRIM(UPPER('${safeTier}'))
    `);
  }

  if (params.band?.trim()) {
    const safeBand = escapeSqlString(params.band.trim());
    conditions.push(`
      TRIM(UPPER(COALESCE(CERTIFIED_BAND, ''))) = TRIM(UPPER('${safeBand}'))
    `);
  }

  if (!conditions.length) return "";

  return `WHERE ${conditions.join("\nAND ")}`;
}

export async function getRegistryAiSystems(): Promise<RegistryAiSystemRow[]> {
  const sql = `
    ${baseSelect}
    ORDER BY
      COALESCE(DISPLAY_ORDER, 999999) ASC,
      SYSTEM_NAME ASC
  `;

  const rows = await snowflakeQuery<Record<string, any>>(sql);
  return rows.map(normalizeRow);
}

export async function getRegistryAiSystemsPaginated(
  params: GetRegistryAiSystemsParams = {}
): Promise<PaginatedRegistryAiSystemsResult> {
  const requestedPage = toPositiveInteger(params.page, 1);
  const pageSize = clampPageSize(params.pageSize, 25, 100);

  const whereClause = buildWhereClause(params);
  const orderByClause = getOrderByClause(params.sortBy, params.sortOrder);

  const countSql = `
    SELECT COUNT(*) AS TOTAL
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ${whereClause}
  `;

  const countRows = await snowflakeQuery<Record<string, any>>(countSql);
  const total = Number(countRows[0]?.TOTAL ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = total === 0 ? 1 : Math.min(requestedPage, totalPages);
  const offset = (page - 1) * pageSize;

  const dataSql = `
    ${baseSelect}
    ${whereClause}
    ${orderByClause}
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  const dataRows = await snowflakeQuery<Record<string, any>>(dataSql);

  return {
    rows: dataRows.map(normalizeRow),
    total,
    page,
    pageSize,
  };
}

export async function getRegistryAiSystemsFilterOptions(): Promise<RegistryAiSystemsFilterOptions> {
  const [countryRows, tierRows, bandRows] = await Promise.all([
    snowflakeQuery<Record<string, any>>(`
      SELECT DISTINCT COUNTRY
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE TRIM(COALESCE(COUNTRY, '')) <> ''
      ORDER BY COUNTRY ASC
    `),
    snowflakeQuery<Record<string, any>>(`
      SELECT DISTINCT CERTIFIED_TIER
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE TRIM(COALESCE(CERTIFIED_TIER, '')) <> ''
      ORDER BY CERTIFIED_TIER ASC
    `),
    snowflakeQuery<Record<string, any>>(`
      SELECT DISTINCT CERTIFIED_BAND
      FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE TRIM(COALESCE(CERTIFIED_BAND, '')) <> ''
      ORDER BY CERTIFIED_BAND ASC
    `),
  ]);

  return {
    countries: countryRows
      .map((row) => row.COUNTRY)
      .filter((value): value is string => Boolean(value)),
    tiers: tierRows
      .map((row) => row.CERTIFIED_TIER)
      .filter((value): value is string => Boolean(value)),
    bands: bandRows
      .map((row) => row.CERTIFIED_BAND)
      .filter((value): value is string => Boolean(value)),
  };
}

export async function getRegistryAiSystemsSummaryStats(): Promise<RegistryAiSystemsSummaryStats> {
  const sql = `
    SELECT
      COUNT(*) AS TOTAL_SYSTEMS,
      COUNT(DISTINCT NULLIF(TRIM(ENTITY_NAME), '')) AS LINKED_ENTITIES,
      COUNT(DISTINCT NULLIF(TRIM(COUNTRY), '')) AS COUNTRIES
    FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
  `;

  const rows = await snowflakeQuery<Record<string, any>>(sql);
  const row = rows[0] ?? {};

  return {
    totalSystems: Number(row.TOTAL_SYSTEMS ?? 0),
    linkedEntities: Number(row.LINKED_ENTITIES ?? 0),
    countries: Number(row.COUNTRIES ?? 0),
  };
}

export async function getRegistryAiSystemBySystemId(
  systemId: string
): Promise<RegistryAiSystemRow | null> {
  const safeId = escapeSqlString(systemId);

  const sql = `
    ${baseSelect}
    WHERE TRIM(UPPER(SYSTEM_ID)) = TRIM(UPPER('${safeId}'))
    LIMIT 1
  `;

  const rows = await snowflakeQuery<Record<string, any>>(sql);
  if (!rows.length) return null;
  return normalizeRow(rows[0]);
}

export async function getRegistryAiSystemByRegistryId(
  registryId: string
): Promise<RegistryAiSystemRow | null> {
  const safeId = escapeSqlString(registryId);

  const sql = `
    ${baseSelect}
    WHERE TRIM(UPPER(REGISTRY_ID)) = TRIM(UPPER('${safeId}'))
    LIMIT 1
  `;

  const rows = await snowflakeQuery<Record<string, any>>(sql);
  if (!rows.length) return null;
  return normalizeRow(rows[0]);
}
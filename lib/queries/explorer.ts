import { sfQuery } from "@/lib/snowflake";
import {
  getRegistryAiSystemCount,
  getRegistryAiSystems,
  getRegistryAiSystemsPaginated,
  type RegistryAiSystemRow,
} from "@/lib/queries/registry-ai-systems";

type RawRow = Record<string, unknown>;

export type ExplorerSummary = {
  totalRecords: number;
  totalOrganizations: number;
  totalCountries: number;
  totalSystems: number;
  recordCount: number;
  organizationCount: number;
  countryCount: number;
  systemCount: number;
};

export type ExplorerRecordRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
};

export type ExplorerOrganizationRow = {
  entityName: string;
  entityType: string | null;
  country: string | null;
  registryCount: number;
  recordCount: number;
  lastCertifiedAt: string | null;
  decisionStatus: string | null;
};

export type ExplorerCountryRow = {
  country: string;
  recordCount: number;
  registryCount: number;
  organizationCount: number;
  lastCertifiedAt: string | null;
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function asNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeRecord(row: RawRow): ExplorerRecordRow {
  return {
    registryId: asString(row.REGISTRY_ID) ?? "",
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    entityName: asString(row.ENTITY_NAME),
    entityType: asString(row.ENTITY_TYPE),
    country: asString(row.COUNTRY),
    certifiedScore: asString(row.CERTIFIED_SCORE),
    certifiedTier: asString(row.CERTIFIED_TIER),
    certifiedBand: asString(row.CERTIFIED_BAND),
    decisionStatus: asString(row.DECISION_STATUS),
    validFrom: asString(row.VALID_FROM),
    validTo: asString(row.VALID_TO),
    certifiedAt: asString(row.CERTIFIED_AT),
  };
}

export async function getExplorerSummary(): Promise<ExplorerSummary> {
  const [recordRows, organizationRows, countryRows, systemCount] = await Promise.all([
    sfQuery<RawRow>(
      `
      SELECT COUNT(*) AS TOTAL
      FROM CORE.V_REGISTRY_PUBLIC
      `
    ),
    sfQuery<RawRow>(
      `
      SELECT COUNT(DISTINCT ENTITY_NAME) AS TOTAL
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE ENTITY_NAME IS NOT NULL
      `
    ),
    sfQuery<RawRow>(
      `
      SELECT COUNT(DISTINCT COUNTRY) AS TOTAL
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE COUNTRY IS NOT NULL
        AND TRIM(COUNTRY) <> ''
      `
    ),
    getRegistryAiSystemCount(),
  ]);

  const totalRecords = asNumber(recordRows[0]?.TOTAL);
  const totalOrganizations = asNumber(organizationRows[0]?.TOTAL);
  const totalCountries = asNumber(countryRows[0]?.TOTAL);
  const totalSystems = systemCount;

  return {
    totalRecords,
    totalOrganizations,
    totalCountries,
    totalSystems,
    recordCount: totalRecords,
    organizationCount: totalOrganizations,
    countryCount: totalCountries,
    systemCount: totalSystems,
  };
}

export async function getLatestRegistryRecords(limit = 20): Promise<ExplorerRecordRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 200));

  const rows = await sfQuery<RawRow>(
    `
    SELECT
      REGISTRY_ID,
      APPLICATION_ID,
      CASE_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      TO_VARCHAR(CERTIFIED_SCORE) AS CERTIFIED_SCORE,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      TO_VARCHAR(VALID_FROM) AS VALID_FROM,
      TO_VARCHAR(VALID_TO) AS VALID_TO,
      TO_VARCHAR(CERTIFIED_AT) AS CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY COALESCE(CERTIFIED_AT, VALID_TO, VALID_FROM) DESC, ENTITY_NAME ASC, REGISTRY_ID ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map(normalizeRecord);
}

export async function getRecentRegistryRecords(limit = 20): Promise<ExplorerRecordRow[]> {
  return getLatestRegistryRecords(limit);
}

export async function getExplorerOrganizations(limit = 200): Promise<ExplorerOrganizationRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<RawRow>(
    `
    SELECT
      ENTITY_NAME,
      MAX(ENTITY_TYPE) AS ENTITY_TYPE,
      MAX(COUNTRY) AS COUNTRY,
      COUNT(*) AS REGISTRY_COUNT,
      COUNT(*) AS RECORD_COUNT,
      TO_VARCHAR(MAX(CERTIFIED_AT)) AS LAST_CERTIFIED_AT,
      MAX(DECISION_STATUS) AS DECISION_STATUS
    FROM CORE.V_REGISTRY_PUBLIC
    WHERE ENTITY_NAME IS NOT NULL
    GROUP BY ENTITY_NAME
    ORDER BY REGISTRY_COUNT DESC, ENTITY_NAME ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map((row) => ({
    entityName: asString(row.ENTITY_NAME) ?? "Unknown",
    entityType: asString(row.ENTITY_TYPE),
    country: asString(row.COUNTRY),
    registryCount: asNumber(row.REGISTRY_COUNT),
    recordCount: asNumber(row.RECORD_COUNT),
    lastCertifiedAt: asString(row.LAST_CERTIFIED_AT),
    decisionStatus: asString(row.DECISION_STATUS),
  }));
}

export async function getExplorerCountries(limit = 250): Promise<ExplorerCountryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<RawRow>(
    `
    SELECT
      COUNTRY,
      COUNT(*) AS RECORD_COUNT,
      COUNT(*) AS REGISTRY_COUNT,
      COUNT(DISTINCT ENTITY_NAME) AS ORGANIZATION_COUNT,
      TO_VARCHAR(MAX(CERTIFIED_AT)) AS LAST_CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC
    WHERE COUNTRY IS NOT NULL
      AND TRIM(COUNTRY) <> ''
    GROUP BY COUNTRY
    ORDER BY RECORD_COUNT DESC, COUNTRY ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map((row) => ({
    country: asString(row.COUNTRY) ?? "Unknown",
    recordCount: asNumber(row.RECORD_COUNT),
    registryCount: asNumber(row.REGISTRY_COUNT),
    organizationCount: asNumber(row.ORGANIZATION_COUNT),
    lastCertifiedAt: asString(row.LAST_CERTIFIED_AT),
  }));
}

export async function getExplorerSystems(limit = 250): Promise<RegistryAiSystemRow[]> {
  return getRegistryAiSystems(limit);
}

export async function getExplorerSystemsPaginated(params?: {
  page?: number;
  pageSize?: number;
}): Promise<{
  rows: RegistryAiSystemRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  return getRegistryAiSystemsPaginated(params);
}

export const getExplorerOverview = getExplorerSummary;
export const getLatestRegistryActivity = getLatestRegistryRecords;
export const getLatestPublicRecords = getLatestRegistryRecords;
export const getExplorerOrganizationStats = getExplorerOrganizations;
export const getExplorerCountryStats = getExplorerCountries;
export const getExplorerSystemStats = getExplorerSystems;
import { sfQuery } from "@/lib/snowflake";

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

export type ExplorerSummary = {
  totalRecords: number;
  totalOrganizations: number;
  totalCountries: number;
  totalSystems: number;
};

export type ExplorerRegistryRecord = {
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
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
};

export type ExplorerOrganizationRow = {
  entityName: string;
  entityType: string | null;
  country: string | null;
  registryCount: number;
  lastCertifiedAt: string | null;
  decisionStatus: string | null;
};

export type ExplorerCountryRow = {
  country: string;
  organizationCount: number;
  registryCount: number;
  lastCertifiedAt: string | null;
};

export type ExplorerSystemRow = {
  systemId: string;
  systemName: string;
  systemType: string | null;
  developerOrganization: string | null;
  deploymentStatus: string | null;
  oversightLevel: string | null;
  riskTier: string | null;
  registryId: string | null;
  caseId: string | null;
  applicationId: string | null;
};

function normalizeRegistryRecord(
  row: Record<string, unknown>
): ExplorerRegistryRecord {
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
    certifiedAt: asString(row.CERTIFIED_AT),
    validFrom: asString(row.VALID_FROM),
    validTo: asString(row.VALID_TO),
  };
}

export async function getExplorerSummary(): Promise<ExplorerSummary> {
  const [recordsRow] = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      COUNT(*) AS TOTAL_RECORDS,
      COUNT(DISTINCT ENTITY_NAME) AS TOTAL_ORGANIZATIONS,
      COUNT(DISTINCT COUNTRY) AS TOTAL_COUNTRIES
    FROM CORE.V_REGISTRY_PUBLIC
    `
  );

  const [systemsRow] = await sfQuery<Record<string, unknown>>(
    `
    SELECT COUNT(*) AS TOTAL_SYSTEMS
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    `
  );

  return {
    totalRecords: asNumber(recordsRow?.TOTAL_RECORDS),
    totalOrganizations: asNumber(recordsRow?.TOTAL_ORGANIZATIONS),
    totalCountries: asNumber(recordsRow?.TOTAL_COUNTRIES),
    totalSystems: asNumber(systemsRow?.TOTAL_SYSTEMS),
  };
}

export async function getRecentRegistryRecords(
  limit = 12
): Promise<ExplorerRegistryRecord[]> {
  const safeLimit = Math.max(1, Math.min(limit, 100));

  const rows = await sfQuery<Record<string, unknown>>(
    `
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
      CERTIFIED_AT,
      VALID_FROM,
      VALID_TO
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY COALESCE(CERTIFIED_AT, VALID_TO, VALID_FROM) DESC, REGISTRY_ID ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows
    .map(normalizeRegistryRecord)
    .filter((row) => row.registryId);
}

export async function getExplorerOrganizations(
  limit = 100
): Promise<ExplorerOrganizationRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 500));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      ENTITY_NAME,
      MAX(ENTITY_TYPE) AS ENTITY_TYPE,
      MAX(COUNTRY) AS COUNTRY,
      COUNT(*) AS REGISTRY_COUNT,
      MAX(CERTIFIED_AT) AS LAST_CERTIFIED_AT,
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
    entityName: asString(row.ENTITY_NAME) ?? "—",
    entityType: asString(row.ENTITY_TYPE),
    country: asString(row.COUNTRY),
    registryCount: asNumber(row.REGISTRY_COUNT),
    lastCertifiedAt: asString(row.LAST_CERTIFIED_AT),
    decisionStatus: asString(row.DECISION_STATUS),
  }));
}

export async function getExplorerCountries(
  limit = 100
): Promise<ExplorerCountryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 250));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      COUNTRY,
      COUNT(DISTINCT ENTITY_NAME) AS ORGANIZATION_COUNT,
      COUNT(*) AS REGISTRY_COUNT,
      MAX(CERTIFIED_AT) AS LAST_CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC
    WHERE COUNTRY IS NOT NULL
      AND TRIM(COUNTRY) <> ''
    GROUP BY COUNTRY
    ORDER BY REGISTRY_COUNT DESC, COUNTRY ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map((row) => ({
    country: asString(row.COUNTRY) ?? "—",
    organizationCount: asNumber(row.ORGANIZATION_COUNT),
    registryCount: asNumber(row.REGISTRY_COUNT),
    lastCertifiedAt: asString(row.LAST_CERTIFIED_AT),
  }));
}

export async function getExplorerSystems(
  limit = 100
): Promise<ExplorerSystemRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 250));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      SYSTEM_ID,
      SYSTEM_NAME,
      SYSTEM_TYPE,
      DEVELOPER_ORGANIZATION,
      DEPLOYMENT_STATUS,
      OVERSIGHT_LEVEL,
      RISK_TIER,
      REGISTRY_ID,
      CASE_ID,
      APPLICATION_ID
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY SYSTEM_NAME ASC, REGISTRY_ID ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map((row) => ({
    systemId: asString(row.SYSTEM_ID) ?? "",
    systemName: asString(row.SYSTEM_NAME) ?? "—",
    systemType: asString(row.SYSTEM_TYPE),
    developerOrganization: asString(row.DEVELOPER_ORGANIZATION),
    deploymentStatus: asString(row.DEPLOYMENT_STATUS),
    oversightLevel: asString(row.OVERSIGHT_LEVEL),
    riskTier: asString(row.RISK_TIER),
    registryId: asString(row.REGISTRY_ID),
    caseId: asString(row.CASE_ID),
    applicationId: asString(row.APPLICATION_ID),
  }));
}
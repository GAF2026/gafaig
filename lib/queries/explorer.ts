import { sfQuery } from "@/lib/snowflake";

type Row = Record<string, unknown>;

function s(v: unknown): string | null {
  if (v == null) return null;
  const x = String(v).trim();
  return x === "" ? null : x;
}

function n(v: unknown): number {
  return Number(v ?? 0);
}

export type ExplorerSummary = {
  totalRecords: number;
  totalOrganizations: number;
  totalCountries: number;
  totalSystems: number;
};

export type ExplorerRegistryRecord = {
  registryId: string | null;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  country: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  certifiedAt: string | null;
};

export type ExplorerOrganizationRow = {
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  registryCount: number;
  systemCount: number;
  decisionStatus: string | null;
  lastCertifiedAt: string | null;
};

export type ExplorerCountryRow = {
  country: string | null;
  organizationCount: number;
  registryCount: number;
  lastCertifiedAt: string | null;
};

export type ExplorerSystemRow = {
  systemId: string | null;
  registryId: string | null;
  applicationId: string | null;
  caseId: string | null;
  systemName: string | null;
  systemType: string | null;
  intendedUse: string | null;
  deploymentStatus: string | null;
  riskTier: string | null;
  displayOrder: number;
  entityName: string | null;
  developerOrganization: string | null;
  verificationType: string | null;
  modelVersion: string | null;
  score: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedAt: string | null;
  renewalStatus: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  registryStatus: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export async function getExplorerSummary(): Promise<ExplorerSummary> {
  const rows = await sfQuery<Row>(`
    SELECT
      COUNT(*) AS TOTAL_RECORDS,
      COUNT(DISTINCT ENTITY_NAME) AS TOTAL_ORGANIZATIONS,
      COUNT(DISTINCT COUNTRY) AS TOTAL_COUNTRIES
    FROM CORE.V_REGISTRY_PUBLIC
  `);

  const systemRows = await sfQuery<Row>(`
    SELECT COUNT(*) AS TOTAL_SYSTEMS
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
  `);

  return {
    totalRecords: n(rows?.[0]?.TOTAL_RECORDS),
    totalOrganizations: n(rows?.[0]?.TOTAL_ORGANIZATIONS),
    totalCountries: n(rows?.[0]?.TOTAL_COUNTRIES),
    totalSystems: n(systemRows?.[0]?.TOTAL_SYSTEMS),
  };
}

export async function getLatestRegistryRecords(
  limit = 10
): Promise<ExplorerRegistryRecord[]> {
  const safeLimit = Math.max(1, Math.min(limit, 100));

  const rows = await sfQuery<Row>(
    `
    SELECT
      REGISTRY_ID,
      APPLICATION_ID,
      CASE_ID,
      ENTITY_NAME,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY PUBLISHED_AT DESC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map((r) => ({
    registryId: s(r.REGISTRY_ID),
    applicationId: s(r.APPLICATION_ID),
    caseId: s(r.CASE_ID),
    entityName: s(r.ENTITY_NAME),
    country: s(r.COUNTRY),
    certifiedTier: s(r.CERTIFIED_TIER),
    certifiedBand: s(r.CERTIFIED_BAND),
    decisionStatus: s(r.DECISION_STATUS),
    certifiedAt: s(r.CERTIFIED_AT),
  }));
}

export const getRecentRegistryRecords = getLatestRegistryRecords;

export async function getExplorerOrganizations(
  limit = 50
): Promise<ExplorerOrganizationRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 500));

  const rows = await sfQuery<Row>(
    `
    SELECT
      rp.ENTITY_NAME,
      NULL AS ENTITY_TYPE,
      rp.COUNTRY,
      COUNT(*) AS REGISTRY_COUNT,
      0 AS SYSTEM_COUNT,
      MAX(rp.DECISION_STATUS) AS DECISION_STATUS,
      NULL AS LAST_CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC rp
    GROUP BY rp.ENTITY_NAME, rp.COUNTRY
    ORDER BY rp.ENTITY_NAME ASC, rp.COUNTRY ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map((r) => ({
    entityName: s(r.ENTITY_NAME),
    entityType: s(r.ENTITY_TYPE),
    country: s(r.COUNTRY),
    registryCount: n(r.REGISTRY_COUNT),
    systemCount: n(r.SYSTEM_COUNT),
    decisionStatus: s(r.DECISION_STATUS),
    lastCertifiedAt: s(r.LAST_CERTIFIED_AT),
  }));
}

export async function getExplorerCountries(
  limit = 50
): Promise<ExplorerCountryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 500));

  const rows = await sfQuery<Row>(
    `
    SELECT
      COUNTRY,
      COUNT(DISTINCT ENTITY_NAME) AS ORGANIZATION_COUNT,
      COUNT(*) AS REGISTRY_COUNT,
      NULL AS LAST_CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC
    GROUP BY COUNTRY
    ORDER BY COUNTRY ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map((r) => ({
    country: s(r.COUNTRY),
    organizationCount: n(r.ORGANIZATION_COUNT),
    registryCount: n(r.REGISTRY_COUNT),
    lastCertifiedAt: s(r.LAST_CERTIFIED_AT),
  }));
}

export async function getExplorerSystems(
  limit = 50
): Promise<ExplorerSystemRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<Row>(
    `
    SELECT
      SYSTEM_ID,
      REGISTRY_ID,
      APPLICATION_ID,
      CASE_ID,
      SYSTEM_NAME,
      SYSTEM_TYPE,
      INTENDED_USE,
      NULL AS DEPLOYMENT_STATUS,
      NULL AS RISK_TIER,
      DISPLAY_ORDER,
      ENTITY_NAME,
      ENTITY_NAME AS DEVELOPER_ORGANIZATION,
      VERIFICATION_TYPE,
      MODEL_VERSION,
      SCORE,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      NULL AS CERTIFIED_AT,
      RENEWAL_STATUS,
      APPROVED_AT,
      PUBLISHED_AT,
      REGISTRY_STATUS,
      CREATED_AT,
      UPDATED_AT
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY REGISTRY_ID ASC, DISPLAY_ORDER ASC, SYSTEM_ID ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map((r) => ({
    systemId: s(r.SYSTEM_ID),
    registryId: s(r.REGISTRY_ID),
    applicationId: s(r.APPLICATION_ID),
    caseId: s(r.CASE_ID),
    systemName: s(r.SYSTEM_NAME),
    systemType: s(r.SYSTEM_TYPE),
    intendedUse: s(r.INTENDED_USE),
    deploymentStatus: s(r.DEPLOYMENT_STATUS),
    riskTier: s(r.RISK_TIER),
    displayOrder: n(r.DISPLAY_ORDER),
    entityName: s(r.ENTITY_NAME),
    developerOrganization: s(r.DEVELOPER_ORGANIZATION),
    verificationType: s(r.VERIFICATION_TYPE),
    modelVersion: s(r.MODEL_VERSION),
    score: s(r.SCORE),
    certifiedTier: s(r.CERTIFIED_TIER),
    certifiedBand: s(r.CERTIFIED_BAND),
    certifiedAt: s(r.CERTIFIED_AT),
    renewalStatus: s(r.RENEWAL_STATUS),
    approvedAt: s(r.APPROVED_AT),
    publishedAt: s(r.PUBLISHED_AT),
    registryStatus: s(r.REGISTRY_STATUS),
    createdAt: s(r.CREATED_AT),
    updatedAt: s(r.UPDATED_AT),
  }));
}
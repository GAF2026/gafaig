import { sfQuery } from "@/lib/snowflake";

/* ============================================================
   TYPES
============================================================ */

export type ExplorerSummary = {
  totalSystems: number;
  totalOrganizations: number;
  totalCountries: number;
  certifiedCount: number;
  approvedCount: number;
};

export type ExplorerOrganizationRow = {
  organization: string;
  entityName: string;
  entityType: string;
  country: string | null;
  organizationCount: number;
  registryCount: number;
  systemCount: number;
  totalSystems: number;
  certifiedCount: number;
  approvedCount: number;
};

export type ExplorerCountryRow = {
  country: string;
  organizationCount: number;
  registryCount: number;
  systemCount: number;
  certifiedCount: number;
  approvedCount: number;
};

export type ExplorerSystemRow = {
  systemId: string;
  systemName: string;
  systemType: string;
  intendedUse: string;

  deploymentStatus: string | null;
  oversightLevel: string | null;
  riskTier: string | null;

  developerOrganization: string | null;

  registryId: string;
  entityName: string;
  country: string;

  certificationStatus: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  lifecycleStatus: string | null;
};

/* ============================================================
   HELPERS
============================================================ */

function safePositiveInt(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) && Number(value) > 0 ? Math.floor(Number(value)) : fallback;
}

/* ============================================================
   SUMMARY
============================================================ */

export async function getExplorerSummary(): Promise<ExplorerSummary> {
  const rows = await sfQuery<any>(`
    SELECT
      COUNT(*) AS TOTAL_SYSTEMS,
      COUNT(DISTINCT COALESCE(DEVELOPER_ORGANIZATION, ENTITY_NAME, REGISTRY_ID)) AS TOTAL_ORGANIZATIONS,
      COUNT(DISTINCT COUNTRY) AS TOTAL_COUNTRIES,
      COUNT_IF(UPPER(COALESCE(CERTIFICATION_STATUS, '')) = 'CERTIFIED') AS CERTIFIED_COUNT,
      COUNT_IF(
        UPPER(COALESCE(DECISION_STATUS, '')) = 'APPROVED'
        AND UPPER(COALESCE(CERTIFICATION_STATUS, '')) <> 'CERTIFIED'
      ) AS APPROVED_COUNT
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE COALESCE(IS_PUBLIC, TRUE) = TRUE
  `);

  const r = rows[0] || {};

  return {
    totalSystems: Number(r.TOTAL_SYSTEMS ?? 0),
    totalOrganizations: Number(r.TOTAL_ORGANIZATIONS ?? 0),
    totalCountries: Number(r.TOTAL_COUNTRIES ?? 0),
    certifiedCount: Number(r.CERTIFIED_COUNT ?? 0),
    approvedCount: Number(r.APPROVED_COUNT ?? 0),
  };
}

/* ============================================================
   ORGANIZATIONS (FIXED)
============================================================ */

export async function getExplorerOrganizations(limit = 50): Promise<ExplorerOrganizationRow[]> {
  const safeLimit = safePositiveInt(limit, 50);

  const rows = await sfQuery<any>(`
    SELECT
      COALESCE(DEVELOPER_ORGANIZATION, ENTITY_NAME, REGISTRY_ID) AS ORGANIZATION,
      MAX(ENTITY_NAME) AS ENTITY_NAME,
      MAX(COUNTRY) AS COUNTRY,

      COUNT(DISTINCT COALESCE(DEVELOPER_ORGANIZATION, ENTITY_NAME, REGISTRY_ID)) AS ORGANIZATION_COUNT,
      COUNT(DISTINCT REGISTRY_ID) AS REGISTRY_COUNT,
      COUNT(*) AS SYSTEM_COUNT,
      COUNT(*) AS TOTAL_SYSTEMS,

      COUNT_IF(UPPER(COALESCE(CERTIFICATION_STATUS, '')) = 'CERTIFIED') AS CERTIFIED_COUNT,
      COUNT_IF(
        UPPER(COALESCE(DECISION_STATUS, '')) = 'APPROVED'
        AND UPPER(COALESCE(CERTIFICATION_STATUS, '')) <> 'CERTIFIED'
      ) AS APPROVED_COUNT

    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE COALESCE(IS_PUBLIC, TRUE) = TRUE
    GROUP BY COALESCE(DEVELOPER_ORGANIZATION, ENTITY_NAME, REGISTRY_ID)
    ORDER BY SYSTEM_COUNT DESC, ORGANIZATION ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((r: any) => ({
    organization: r.ORGANIZATION,
    entityName: r.ENTITY_NAME ?? r.ORGANIZATION,
    entityType: "Organization",
    country: r.COUNTRY ?? null,
    organizationCount: Number(r.ORGANIZATION_COUNT ?? 1),
    registryCount: Number(r.REGISTRY_COUNT ?? 0),
    systemCount: Number(r.SYSTEM_COUNT ?? 0),
    totalSystems: Number(r.TOTAL_SYSTEMS ?? r.SYSTEM_COUNT ?? 0),
    certifiedCount: Number(r.CERTIFIED_COUNT ?? 0),
    approvedCount: Number(r.APPROVED_COUNT ?? 0),
  }));
}

/* ============================================================
   COUNTRIES
============================================================ */

export async function getExplorerCountries(limit = 50): Promise<ExplorerCountryRow[]> {
  const safeLimit = safePositiveInt(limit, 50);

  const rows = await sfQuery<any>(`
    SELECT
      COUNTRY,
      COUNT(DISTINCT COALESCE(DEVELOPER_ORGANIZATION, ENTITY_NAME, REGISTRY_ID)) AS ORGANIZATION_COUNT,
      COUNT(DISTINCT REGISTRY_ID) AS REGISTRY_COUNT,
      COUNT(*) AS SYSTEM_COUNT,
      COUNT_IF(UPPER(COALESCE(CERTIFICATION_STATUS, '')) = 'CERTIFIED') AS CERTIFIED_COUNT,
      COUNT_IF(
        UPPER(COALESCE(DECISION_STATUS, '')) = 'APPROVED'
        AND UPPER(COALESCE(CERTIFICATION_STATUS, '')) <> 'CERTIFIED'
      ) AS APPROVED_COUNT
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE COALESCE(IS_PUBLIC, TRUE) = TRUE
      AND COUNTRY IS NOT NULL
    GROUP BY COUNTRY
    ORDER BY SYSTEM_COUNT DESC
    LIMIT ${safeLimit}
  `);

  return rows.map((r: any) => ({
    country: r.COUNTRY,
    organizationCount: Number(r.ORGANIZATION_COUNT ?? 0),
    registryCount: Number(r.REGISTRY_COUNT ?? 0),
    systemCount: Number(r.SYSTEM_COUNT ?? 0),
    certifiedCount: Number(r.CERTIFIED_COUNT ?? 0),
    approvedCount: Number(r.APPROVED_COUNT ?? 0),
  }));
}

/* ============================================================
   SYSTEMS
============================================================ */

export async function getExplorerSystems(limit = 50): Promise<ExplorerSystemRow[]> {
  const safeLimit = safePositiveInt(limit, 50);

  const rows = await sfQuery<any>(`
    SELECT
      SYSTEM_ID,
      SYSTEM_NAME,
      SYSTEM_TYPE,
      INTENDED_USE,

      DEPLOYMENT_STATUS,
      OVERSIGHT_LEVEL,
      RISK_TIER,

      DEVELOPER_ORGANIZATION,

      REGISTRY_ID,
      ENTITY_NAME,
      COUNTRY,

      CERTIFICATION_STATUS,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      LIFECYCLE_STATUS

    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE COALESCE(IS_PUBLIC, TRUE) = TRUE
    ORDER BY CREATED_AT DESC, SYSTEM_ID ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((r: any) => ({
    systemId: r.SYSTEM_ID,
    systemName: r.SYSTEM_NAME,
    systemType: r.SYSTEM_TYPE,
    intendedUse: r.INTENDED_USE,

    deploymentStatus: r.DEPLOYMENT_STATUS,
    oversightLevel: r.OVERSIGHT_LEVEL,
    riskTier: r.RISK_TIER,

    developerOrganization: r.DEVELOPER_ORGANIZATION,

    registryId: r.REGISTRY_ID,
    entityName: r.ENTITY_NAME,
    country: r.COUNTRY,

    certificationStatus: r.CERTIFICATION_STATUS,
    certifiedTier: r.CERTIFIED_TIER,
    certifiedBand: r.CERTIFIED_BAND,
    decisionStatus: r.DECISION_STATUS,
    lifecycleStatus: r.LIFECYCLE_STATUS,
  }));
}

/* ============================================================
   RECENT REGISTRY RECORDS
============================================================ */

export async function getRecentRegistryRecords(limit = 10) {
  const safeLimit = safePositiveInt(limit, 10);

  const rows = await sfQuery<any>(`
    SELECT *
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY CERTIFIED_AT DESC NULLS LAST
    LIMIT ${safeLimit}
  `);

  return rows;
}
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
  return Number.isFinite(value) && Number(value) > 0
    ? Math.floor(Number(value))
    : fallback;
}

/* ============================================================
   SUMMARY
   Public explorer reflects certified/published records only.
============================================================ */

export async function getExplorerSummary(): Promise<ExplorerSummary> {
  const [statsRows, systemRows] = await Promise.all([
    sfQuery<any>(`
      SELECT
        TOTAL_ENTITIES,
        TOTAL_COUNTRIES,
        TOTAL_CERTIFIED
      FROM CORE.V_REGISTRY_STATS_GLOBAL
    `),
    sfQuery<any>(`
      SELECT
        COUNT(*) AS TOTAL_SYSTEMS
      FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE COALESCE(IS_PUBLIC, TRUE) = TRUE
    `),
  ]);

  const stats = statsRows[0] || {};
  const systems = systemRows[0] || {};

  return {
    totalSystems: Number(systems.TOTAL_SYSTEMS ?? 0),
    totalOrganizations: Number(stats.TOTAL_ENTITIES ?? 0),
    totalCountries: Number(stats.TOTAL_COUNTRIES ?? 0),
    certifiedCount: Number(stats.TOTAL_CERTIFIED ?? 0),
    approvedCount: 0,
  };
}

/* ============================================================
   ORGANIZATIONS
   Public explorer reflects certified/published systems only.
============================================================ */

export async function getExplorerOrganizations(
  limit = 50
): Promise<ExplorerOrganizationRow[]> {
  const safeLimit = safePositiveInt(limit, 50);

  const rows = await sfQuery<any>(`
    SELECT
      COALESCE(DEVELOPER_ORGANIZATION, ENTITY_NAME, REGISTRY_ID) AS ORGANIZATION,
      MAX(ENTITY_NAME) AS ENTITY_NAME,
      MAX(COUNTRY) AS COUNTRY,
      COUNT(DISTINCT REGISTRY_ID) AS REGISTRY_COUNT,
      COUNT(*) AS SYSTEM_COUNT,
      COUNT(*) AS TOTAL_SYSTEMS,
      COUNT_IF(UPPER(COALESCE(CERTIFICATION_STATUS, '')) = 'CERTIFIED') AS CERTIFIED_COUNT
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
    organizationCount: 1,
    registryCount: Number(r.REGISTRY_COUNT ?? 0),
    systemCount: Number(r.SYSTEM_COUNT ?? 0),
    totalSystems: Number(r.TOTAL_SYSTEMS ?? r.SYSTEM_COUNT ?? 0),
    certifiedCount: Number(r.CERTIFIED_COUNT ?? 0),
    approvedCount: 0,
  }));
}

/* ============================================================
   COUNTRIES
   Public explorer reflects certified/published systems only.
============================================================ */

export async function getExplorerCountries(
  limit = 50
): Promise<ExplorerCountryRow[]> {
  const safeLimit = safePositiveInt(limit, 50);

  const rows = await sfQuery<any>(`
    SELECT
      COUNTRY,
      COUNT(DISTINCT COALESCE(DEVELOPER_ORGANIZATION, ENTITY_NAME, REGISTRY_ID)) AS ORGANIZATION_COUNT,
      COUNT(DISTINCT REGISTRY_ID) AS REGISTRY_COUNT,
      COUNT(*) AS SYSTEM_COUNT,
      COUNT_IF(UPPER(COALESCE(CERTIFICATION_STATUS, '')) = 'CERTIFIED') AS CERTIFIED_COUNT
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE COALESCE(IS_PUBLIC, TRUE) = TRUE
      AND COUNTRY IS NOT NULL
      AND TRIM(COUNTRY) <> ''
    GROUP BY COUNTRY
    ORDER BY SYSTEM_COUNT DESC, COUNTRY ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((r: any) => ({
    country: r.COUNTRY,
    organizationCount: Number(r.ORGANIZATION_COUNT ?? 0),
    registryCount: Number(r.REGISTRY_COUNT ?? 0),
    systemCount: Number(r.SYSTEM_COUNT ?? 0),
    certifiedCount: Number(r.CERTIFIED_COUNT ?? 0),
    approvedCount: 0,
  }));
}

/* ============================================================
   SYSTEMS
============================================================ */

export async function getExplorerSystems(
  limit = 50
): Promise<ExplorerSystemRow[]> {
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
    ORDER BY SYSTEM_ID ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((r: any) => ({
    systemId: r.SYSTEM_ID,
    systemName: r.SYSTEM_NAME,
    systemType: r.SYSTEM_TYPE,
    intendedUse: r.INTENDED_USE,
    deploymentStatus: r.DEPLOYMENT_STATUS ?? null,
    oversightLevel: r.OVERSIGHT_LEVEL ?? null,
    riskTier: r.RISK_TIER ?? null,
    developerOrganization: r.DEVELOPER_ORGANIZATION ?? null,
    registryId: r.REGISTRY_ID,
    entityName: r.ENTITY_NAME,
    country: r.COUNTRY,
    certificationStatus: r.CERTIFICATION_STATUS ?? null,
    certifiedTier: r.CERTIFIED_TIER ?? null,
    certifiedBand: r.CERTIFIED_BAND ?? null,
    decisionStatus: r.DECISION_STATUS ?? null,
    lifecycleStatus: r.LIFECYCLE_STATUS ?? null,
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
    ORDER BY CERTIFIED_AT DESC NULLS LAST, REGISTRY_ID ASC
    LIMIT ${safeLimit}
  `);

  return rows;
}
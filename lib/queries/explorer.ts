import { sfQuery } from "@/lib/snowflake";

export type ExplorerStats = {
  publicRecords: number;
  certified: number;
  certifiedRecords: number;
  organizations: number;
  countries: number;
  systems: number;
};

export type ExplorerRecord = {
  registryId: string;
  registrySnapshotId: string | null;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certificationStatus: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  publishedAt: string | null;
  renewalStatus: string | null;
  lifecycleStatus: string | null;
  visibilityStatus: string | null;
  verificationEligible: boolean | null;
  badgeEligible: boolean | null;
};

export type ExplorerOrganization = {
  entityName: string;
  organization: string;
  organizationName: string;
  entityType: string | null;
  country: string | null;
  recordCount: number;
  publicRecords: number;
  systems: number;
  latestPublishedAt: string | null;
};

export type ExplorerCountry = {
  country: string;
  recordCount: number;
  publicRecords: number;
  organizationCount: number;
  organizations: number;
  systems: number;
  latestPublishedAt: string | null;
};

export type ExplorerSystem = {
  registryId: string;
  caseId: string | null;
  entityName: string | null;
  systemName: string | null;
  entityType: string | null;
  country: string | null;
  certificationStatus: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  publishedAt: string | null;
  lifecycleStatus: string | null;
};

export type ExplorerSystemRow = ExplorerSystem;

function toLimit(value?: number): number {
  const n = Number(value ?? 25);
  if (!Number.isFinite(n)) return 25;
  return Math.min(Math.max(Math.trunc(n), 1), 500);
}

function toNumber(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export async function getLatestCertifiedRecord(): Promise<ExplorerRecord | null> {
  const rows = await sfQuery<ExplorerRecord>(`
    SELECT
      REGISTRY_ID AS "registryId",
      REGISTRY_SNAPSHOT_ID AS "registrySnapshotId",
      APPLICATION_ID AS "applicationId",
      CASE_ID AS "caseId",
      ENTITY_NAME AS "entityName",
      ENTITY_TYPE AS "entityType",
      COUNTRY AS "country",
      CERTIFICATION_STATUS AS "certificationStatus",
      CERTIFIED_AT AS "certifiedAt",
      VALID_FROM AS "validFrom",
      VALID_TO AS "validTo",
      PUBLISHED_AT AS "publishedAt",
      RENEWAL_STATUS AS "renewalStatus",
      LIFECYCLE_STATUS AS "lifecycleStatus",
      VISIBILITY_STATUS AS "visibilityStatus",
      VERIFICATION_ELIGIBLE AS "verificationEligible",
      BADGE_ELIGIBLE AS "badgeEligible"
    FROM CORE.V_REGISTRY_PUBLIC
    WHERE UPPER(TRIM(COALESCE(CERTIFICATION_STATUS, ''))) = 'CERTIFIED'
    ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
    LIMIT 1
  `);

  return rows?.[0] ?? null;
}

export async function getExplorerStats(): Promise<ExplorerStats> {
  const rows = await sfQuery<{
    publicRecords: number;
    certifiedRecords: number;
    organizations: number;
    countries: number;
    systems: number;
  }>(`
    SELECT
      COUNT(*) AS "publicRecords",
      COUNT_IF(UPPER(TRIM(COALESCE(CERTIFICATION_STATUS, ''))) = 'CERTIFIED') AS "certifiedRecords",
      COUNT(DISTINCT NULLIF(TRIM(ENTITY_NAME), '')) AS "organizations",
      COUNT(DISTINCT NULLIF(TRIM(COUNTRY), '')) AS "countries",
      (
        SELECT COUNT(*)
        FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      ) AS "systems"
    FROM CORE.V_REGISTRY_PUBLIC
  `);

  const row = rows?.[0];
  const certifiedRecords = toNumber(row?.certifiedRecords);

  return {
    publicRecords: toNumber(row?.publicRecords),
    certified: certifiedRecords,
    certifiedRecords,
    organizations: toNumber(row?.organizations),
    countries: toNumber(row?.countries),
    systems: toNumber(row?.systems),
  };
}

export async function getLatestExplorerRecords(
  limit = 25
): Promise<ExplorerRecord[]> {
  const safeLimit = toLimit(limit);

  return sfQuery<ExplorerRecord>(`
    SELECT
      REGISTRY_ID AS "registryId",
      REGISTRY_SNAPSHOT_ID AS "registrySnapshotId",
      APPLICATION_ID AS "applicationId",
      CASE_ID AS "caseId",
      ENTITY_NAME AS "entityName",
      ENTITY_TYPE AS "entityType",
      COUNTRY AS "country",
      CERTIFICATION_STATUS AS "certificationStatus",
      CERTIFIED_AT AS "certifiedAt",
      VALID_FROM AS "validFrom",
      VALID_TO AS "validTo",
      PUBLISHED_AT AS "publishedAt",
      RENEWAL_STATUS AS "renewalStatus",
      LIFECYCLE_STATUS AS "lifecycleStatus",
      VISIBILITY_STATUS AS "visibilityStatus",
      VERIFICATION_ELIGIBLE AS "verificationEligible",
      BADGE_ELIGIBLE AS "badgeEligible"
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
    LIMIT ${safeLimit}
  `);
}

export async function getExplorerData(): Promise<{
  stats: ExplorerStats;
  records: ExplorerRecord[];
}> {
  const [stats, records] = await Promise.all([
    getExplorerStats(),
    getLatestExplorerRecords(25),
  ]);

  return { stats, records };
}

export async function getExplorerOrganizations(
  limit = 100
): Promise<ExplorerOrganization[]> {
  const safeLimit = toLimit(limit);

  return sfQuery<ExplorerOrganization>(`
    SELECT
      ENTITY_NAME AS "entityName",
      ENTITY_NAME AS "organization",
      ENTITY_NAME AS "organizationName",
      MIN(ENTITY_TYPE) AS "entityType",
      MIN(COUNTRY) AS "country",
      COUNT(*) AS "recordCount",
      COUNT(*) AS "publicRecords",
      COUNT(DISTINCT REGISTRY_ID) AS "systems",
      MAX(PUBLISHED_AT) AS "latestPublishedAt"
    FROM CORE.V_REGISTRY_PUBLIC
    WHERE ENTITY_NAME IS NOT NULL
      AND TRIM(ENTITY_NAME) <> ''
    GROUP BY ENTITY_NAME
    ORDER BY "recordCount" DESC, ENTITY_NAME ASC
    LIMIT ${safeLimit}
  `);
}

export async function getExplorerCountries(
  limit = 100
): Promise<ExplorerCountry[]> {
  const safeLimit = toLimit(limit);

  return sfQuery<ExplorerCountry>(`
    SELECT
      COUNTRY AS "country",
      COUNT(*) AS "recordCount",
      COUNT(*) AS "publicRecords",
      COUNT(DISTINCT NULLIF(TRIM(ENTITY_NAME), '')) AS "organizationCount",
      COUNT(DISTINCT NULLIF(TRIM(ENTITY_NAME), '')) AS "organizations",
      COUNT(DISTINCT REGISTRY_ID) AS "systems",
      MAX(PUBLISHED_AT) AS "latestPublishedAt"
    FROM CORE.V_REGISTRY_PUBLIC
    WHERE COUNTRY IS NOT NULL
      AND TRIM(COUNTRY) <> ''
    GROUP BY COUNTRY
    ORDER BY "recordCount" DESC, COUNTRY ASC
    LIMIT ${safeLimit}
  `);
}

export async function getExplorerSystems(
  limit = 100
): Promise<ExplorerSystem[]> {
  const safeLimit = toLimit(limit);

  return sfQuery<ExplorerSystem>(`
    SELECT
      REGISTRY_ID AS "registryId",
      CASE_ID AS "caseId",
      ENTITY_NAME AS "entityName",
      ENTITY_NAME AS "systemName",
      ENTITY_TYPE AS "entityType",
      COUNTRY AS "country",
      CERTIFICATION_STATUS AS "certificationStatus",
      NULL AS "certifiedTier",
      NULL AS "certifiedBand",
      PUBLISHED_AT AS "publishedAt",
      LIFECYCLE_STATUS AS "lifecycleStatus"
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
    LIMIT ${safeLimit}
  `);
}
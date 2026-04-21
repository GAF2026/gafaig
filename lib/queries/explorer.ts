import { sfQuery } from "@/lib/snowflake";

export type ExplorerStats = {
  publicRecords: number;
  certifiedRecords: number;
  organizations: number;
  countries: number;
  systems: number;
};

export type ExplorerRecordRow = {
  registryId: string;
  caseId: string | null;
  applicationId: string | null;
  entityName: string;
  country: string | null;
  decisionStatus: string | null;
  certificationStatus: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
};

export type ExplorerCountryRow = {
  country: string;
  publicRecords: number;
  organizations: number;
  systems: number;
};

export type ExplorerOrganizationRow = {
  entityName: string;
  country: string | null;
  publicRecords: number;
  systems: number;
  latestCertifiedAt: string | null;
};

export type ExplorerSystemRow = {
  systemId: string;
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  systemName: string;
  systemType: string | null;
  intendedUse: string | null;
  deploymentStatus: string | null;
  oversightLevel: string | null;
  developerOrganization: string | null;
};

function asString(value: unknown): string {
  return String(value ?? "").trim();
}

function asNullableString(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function asNumber(value: unknown): number {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

export async function getExplorerStats(): Promise<ExplorerStats> {
  const statRows = await sfQuery<{
    PUBLIC_RECORDS: unknown;
    CERTIFIED_RECORDS: unknown;
    ORGANIZATIONS: unknown;
    COUNTRIES: unknown;
  }>(`
    SELECT
      PUBLIC_RECORDS,
      CERTIFIED_RECORDS,
      ORGANIZATIONS,
      COUNTRIES
    FROM CORE.V_EXPLORER_STATS
  `);

  const systemRows = await sfQuery<{
    SYSTEMS: unknown;
  }>(`
    SELECT COUNT(*) AS SYSTEMS
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
  `);

  const statRow = statRows[0];
  const systemRow = systemRows[0];

  return {
    publicRecords: asNumber(statRow?.PUBLIC_RECORDS),
    certifiedRecords: asNumber(statRow?.CERTIFIED_RECORDS),
    organizations: asNumber(statRow?.ORGANIZATIONS),
    countries: asNumber(statRow?.COUNTRIES),
    systems: asNumber(systemRow?.SYSTEMS),
  };
}

export async function getLatestExplorerRecords(limit = 8): Promise<ExplorerRecordRow[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const rows = await sfQuery<{
    REGISTRY_ID: unknown;
    CASE_ID: unknown;
    APPLICATION_ID: unknown;
    ENTITY_NAME: unknown;
    COUNTRY: unknown;
    DECISION_STATUS: unknown;
    CERTIFICATION_STATUS: unknown;
    CERTIFIED_TIER: unknown;
    CERTIFIED_BAND: unknown;
    CERTIFIED_AT: unknown;
    VALID_FROM: unknown;
    VALID_TO: unknown;
  }>(`
    SELECT
      REGISTRY_ID,
      CASE_ID,
      APPLICATION_ID,
      ENTITY_NAME,
      COUNTRY,
      DECISION_STATUS,
      CERTIFICATION_STATUS,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFIED_AT,
      VALID_FROM,
      VALID_TO
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY CERTIFIED_AT DESC NULLS LAST, ENTITY_NAME ASC, REGISTRY_ID ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((row) => ({
    registryId: asString(row.REGISTRY_ID),
    caseId: asNullableString(row.CASE_ID),
    applicationId: asNullableString(row.APPLICATION_ID),
    entityName: asString(row.ENTITY_NAME),
    country: asNullableString(row.COUNTRY),
    decisionStatus: asNullableString(row.DECISION_STATUS),
    certificationStatus: asNullableString(row.CERTIFICATION_STATUS),
    certifiedTier: asNullableString(row.CERTIFIED_TIER),
    certifiedBand: asNullableString(row.CERTIFIED_BAND),
    certifiedAt: asNullableString(row.CERTIFIED_AT),
    validFrom: asNullableString(row.VALID_FROM),
    validTo: asNullableString(row.VALID_TO),
  }));
}

export async function getExplorerCountries(limit = 50): Promise<ExplorerCountryRow[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 250);

  const rows = await sfQuery<{
    COUNTRY: unknown;
    PUBLIC_RECORDS: unknown;
    ORGANIZATIONS: unknown;
    SYSTEMS: unknown;
  }>(`
    WITH SYSTEM_COUNTS AS (
      SELECT
        UPPER(TRIM(COALESCE(CASE_ID, ''))) AS CASE_ID_NORM,
        COUNT(*) AS SYSTEMS
      FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE TRIM(COALESCE(CASE_ID, '')) <> ''
      GROUP BY UPPER(TRIM(COALESCE(CASE_ID, '')))
    )
    SELECT
      rp.COUNTRY AS COUNTRY,
      COUNT(*) AS PUBLIC_RECORDS,
      COUNT(DISTINCT UPPER(TRIM(COALESCE(rp.ENTITY_NAME, '')))) AS ORGANIZATIONS,
      COALESCE(SUM(sc.SYSTEMS), 0) AS SYSTEMS
    FROM CORE.V_REGISTRY_PUBLIC rp
    LEFT JOIN SYSTEM_COUNTS sc
      ON UPPER(TRIM(COALESCE(rp.CASE_ID, ''))) = sc.CASE_ID_NORM
    WHERE TRIM(COALESCE(rp.COUNTRY, '')) <> ''
    GROUP BY rp.COUNTRY
    ORDER BY PUBLIC_RECORDS DESC, COUNTRY ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((row) => ({
    country: asString(row.COUNTRY),
    publicRecords: asNumber(row.PUBLIC_RECORDS),
    organizations: asNumber(row.ORGANIZATIONS),
    systems: asNumber(row.SYSTEMS),
  }));
}

export async function getExplorerOrganizations(limit = 50): Promise<ExplorerOrganizationRow[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 250);

  const rows = await sfQuery<{
    ENTITY_NAME: unknown;
    COUNTRY: unknown;
    PUBLIC_RECORDS: unknown;
    SYSTEMS: unknown;
    LATEST_CERTIFIED_AT: unknown;
  }>(`
    WITH SYSTEM_COUNTS AS (
      SELECT
        UPPER(TRIM(COALESCE(CASE_ID, ''))) AS CASE_ID_NORM,
        COUNT(*) AS SYSTEMS
      FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      WHERE TRIM(COALESCE(CASE_ID, '')) <> ''
      GROUP BY UPPER(TRIM(COALESCE(CASE_ID, '')))
    )
    SELECT
      rp.ENTITY_NAME AS ENTITY_NAME,
      MIN(rp.COUNTRY) AS COUNTRY,
      COUNT(*) AS PUBLIC_RECORDS,
      COALESCE(SUM(sc.SYSTEMS), 0) AS SYSTEMS,
      MAX(rp.CERTIFIED_AT) AS LATEST_CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC rp
    LEFT JOIN SYSTEM_COUNTS sc
      ON UPPER(TRIM(COALESCE(rp.CASE_ID, ''))) = sc.CASE_ID_NORM
    WHERE TRIM(COALESCE(rp.ENTITY_NAME, '')) <> ''
    GROUP BY rp.ENTITY_NAME
    ORDER BY PUBLIC_RECORDS DESC, ENTITY_NAME ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((row) => ({
    entityName: asString(row.ENTITY_NAME),
    country: asNullableString(row.COUNTRY),
    publicRecords: asNumber(row.PUBLIC_RECORDS),
    systems: asNumber(row.SYSTEMS),
    latestCertifiedAt: asNullableString(row.LATEST_CERTIFIED_AT),
  }));
}

export async function getExplorerSystems(limit = 50): Promise<ExplorerSystemRow[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 250);

  const rows = await sfQuery<{
    SYSTEM_ID: unknown;
    REGISTRY_ID: unknown;
    APPLICATION_ID: unknown;
    CASE_ID: unknown;
    SYSTEM_NAME: unknown;
    SYSTEM_TYPE: unknown;
    INTENDED_USE: unknown;
    DEPLOYMENT_STATUS: unknown;
    OVERSIGHT_LEVEL: unknown;
    DEVELOPER_ORGANIZATION: unknown;
  }>(`
    SELECT
      s.SYSTEM_ID,
      s.REGISTRY_ID,
      s.APPLICATION_ID,
      s.CASE_ID,
      s.SYSTEM_NAME,
      s.SYSTEM_TYPE,
      s.INTENDED_USE,
      s.DEPLOYMENT_STATUS,
      s.OVERSIGHT_LEVEL,
      rp.ENTITY_NAME AS DEVELOPER_ORGANIZATION
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
    LEFT JOIN CORE.V_REGISTRY_PUBLIC rp
      ON UPPER(TRIM(COALESCE(s.CASE_ID, ''))) = UPPER(TRIM(COALESCE(rp.CASE_ID, '')))
    ORDER BY s.SYSTEM_NAME ASC, s.SYSTEM_ID ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((row) => ({
    systemId: asString(row.SYSTEM_ID),
    registryId: asString(row.REGISTRY_ID),
    applicationId: asNullableString(row.APPLICATION_ID),
    caseId: asNullableString(row.CASE_ID),
    systemName: asString(row.SYSTEM_NAME),
    systemType: asNullableString(row.SYSTEM_TYPE),
    intendedUse: asNullableString(row.INTENDED_USE),
    deploymentStatus: asNullableString(row.DEPLOYMENT_STATUS),
    oversightLevel: asNullableString(row.OVERSIGHT_LEVEL),
    developerOrganization: asNullableString(row.DEVELOPER_ORGANIZATION),
  }));
}
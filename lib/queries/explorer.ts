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

  certificationStatus: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedAt: string | null;
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

/* =========================================================
   STATS
========================================================= */

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

  const systemRows = await sfQuery<{ SYSTEMS: unknown }>(`
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

/* =========================================================
   RECORDS
========================================================= */

export async function getLatestExplorerRecords(limit = 8): Promise<ExplorerRecordRow[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const rows = await sfQuery<any>(`
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

/* =========================================================
   SYSTEMS (FIXED — CANONICAL)
========================================================= */

export async function getExplorerSystems(limit = 50): Promise<ExplorerSystemRow[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 250);

  const rows = await sfQuery<any>(`
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

      DEVELOPER_ORGANIZATION,

      CERTIFICATION_STATUS,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFIED_AT

    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY SYSTEM_NAME ASC, SYSTEM_ID ASC
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

    certificationStatus: asNullableString(row.CERTIFICATION_STATUS),
    certifiedTier: asNullableString(row.CERTIFIED_TIER),
    certifiedBand: asNullableString(row.CERTIFIED_BAND),
    certifiedAt: asNullableString(row.CERTIFIED_AT),
  }));
}
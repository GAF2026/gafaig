import { sfQuery } from "@/lib/snowflake";

type SnowflakeRow = Record<string, unknown>;

function toStringValue(value: unknown, fallback = "—"): string {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text.length > 0 ? text : fallback;
}

function toNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function toNumberValue(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toBooleanText(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  const text = String(value).trim().toLowerCase();
  if (!text) return "—";
  if (["true", "yes", "y", "1"].includes(text)) return "Yes";
  if (["false", "no", "n", "0"].includes(text)) return "No";

  return String(value);
}

function clampLimit(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.floor(value)));
}

function formatDateValue(value: unknown): string | null {
  if (!value) return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString();
}

export type ExplorerStats = {
  publicRecords: number;
  certified: number;
  organizations: number;
  countries: number;
  systems: number;
};

export type ExplorerRecordRow = {
  registryId: string;
  applicationId: string;
  caseId: string;
  entityName: string;
  entityType: string;
  country: string;
  certificationStatus: string;
  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  lifecycleStatus: string | null;
  renewalStatus: string | null;
  publishedAt: string | null;
};

export type ExplorerCountryRow = {
  country: string;
  organizations: number;
  publicRecords: number;
  systems: number;
};

export type ExplorerOrganizationRow = {
  organization: string;
  country: string;
  publicRecords: number;
  systems: number;
};

export type ExplorerSystemRow = {
  systemId: string;
  registryId: string;
  applicationId: string;
  caseId: string;
  entityName: string;
  country: string;
  systemName: string;
  systemType: string;
  intendedUse: string;
  deploymentStatus: string;
  oversightLevel: string;
  riskTier: string;
  developerOrganization: string;
  trainingDataCategory: string;
  oversightModel: string;
  humanReviewRequired: string;
  evaluationProtocol: string;
  auditFrequency: string;
  publicSummary: string;
  certificationStatus: string;
  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  publishedAt: string | null;
};

export async function getExplorerStats(): Promise<ExplorerStats> {
  const [registryRows, systemRows] = await Promise.all([
    sfQuery<SnowflakeRow>(`
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        COUNTRY,
        CERTIFICATION_STATUS
      FROM CORE.V_REGISTRY_PUBLIC
    `),
    sfQuery<SnowflakeRow>(`
      SELECT COUNT(*) AS SYSTEMS
      FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    `),
  ]);

  const organizationSet = new Set<string>();
  const countrySet = new Set<string>();
  let certified = 0;

  for (const row of registryRows) {
    const entityName = toNullableString(row.ENTITY_NAME);
    const country = toNullableString(row.COUNTRY);
    const certificationStatus = toStringValue(row.CERTIFICATION_STATUS, "");

    if (entityName) organizationSet.add(entityName);
    if (country) countrySet.add(country);
    if (certificationStatus.toUpperCase() === "CERTIFIED") certified += 1;
  }

  return {
    publicRecords: registryRows.length,
    certified,
    organizations: organizationSet.size,
    countries: countrySet.size,
    systems: toNumberValue(systemRows[0]?.SYSTEMS),
  };
}

export async function getLatestExplorerRecords(
  limit = 8,
): Promise<ExplorerRecordRow[]> {
  const safeLimit = clampLimit(limit, 1, 100);

  const rows = await sfQuery<SnowflakeRow>(`
    SELECT
      reg.REGISTRY_ID,
      reg.APPLICATION_ID,
      reg.CASE_ID,
      reg.ENTITY_NAME,
      reg.ENTITY_TYPE,
      reg.COUNTRY,
      reg.CERTIFICATION_STATUS,
      score.TIER AS CERTIFIED_TIER,
      score.BAND AS CERTIFIED_BAND,
      reg.CERTIFIED_AT,
      reg.VALID_FROM,
      reg.VALID_TO,
      reg.LIFECYCLE_STATUS,
      reg.RENEWAL_STATUS,
      reg.PUBLISHED_AT
    FROM CORE.V_REGISTRY_PUBLIC reg
    LEFT JOIN CORE.V_GOVERNANCE_SCORE_CASE score
      ON score.CASE_ID = reg.CASE_ID
    ORDER BY reg.CERTIFIED_AT DESC NULLS LAST, reg.ENTITY_NAME ASC, reg.REGISTRY_ID ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((row) => ({
    registryId: toStringValue(row.REGISTRY_ID),
    applicationId: toStringValue(row.APPLICATION_ID),
    caseId: toStringValue(row.CASE_ID),
    entityName: toStringValue(row.ENTITY_NAME),
    entityType: toStringValue(row.ENTITY_TYPE),
    country: toStringValue(row.COUNTRY),
    certificationStatus: toStringValue(row.CERTIFICATION_STATUS),
    certifiedTier: toNullableString(row.CERTIFIED_TIER),
    certifiedBand: toNullableString(row.CERTIFIED_BAND),
    certifiedAt: formatDateValue(row.CERTIFIED_AT),
    validFrom: formatDateValue(row.VALID_FROM),
    validTo: formatDateValue(row.VALID_TO),
    lifecycleStatus: toNullableString(row.LIFECYCLE_STATUS),
    renewalStatus: toNullableString(row.RENEWAL_STATUS),
    publishedAt: formatDateValue(row.PUBLISHED_AT),
  }));
}

export async function getExplorerCountries(
  limit = 250,
): Promise<ExplorerCountryRow[]> {
  const safeLimit = clampLimit(limit, 1, 500);

  const rows = await sfQuery<SnowflakeRow>(`
    WITH registry_base AS (
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        COUNTRY
      FROM CORE.V_REGISTRY_PUBLIC
    ),
    system_base AS (
      SELECT DISTINCT
        REGISTRY_ID,
        SYSTEM_ID
      FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    )
    SELECT
      rb.COUNTRY,
      COUNT(DISTINCT rb.ENTITY_NAME) AS ORGANIZATIONS,
      COUNT(DISTINCT rb.REGISTRY_ID) AS PUBLIC_RECORDS,
      COUNT(DISTINCT sb.SYSTEM_ID) AS SYSTEMS
    FROM registry_base rb
    LEFT JOIN system_base sb
      ON sb.REGISTRY_ID = rb.REGISTRY_ID
    WHERE rb.COUNTRY IS NOT NULL
      AND TRIM(rb.COUNTRY) <> ''
    GROUP BY rb.COUNTRY
    ORDER BY PUBLIC_RECORDS DESC, ORGANIZATIONS DESC, rb.COUNTRY ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((row) => ({
    country: toStringValue(row.COUNTRY),
    organizations: toNumberValue(row.ORGANIZATIONS),
    publicRecords: toNumberValue(row.PUBLIC_RECORDS),
    systems: toNumberValue(row.SYSTEMS),
  }));
}

export async function getExplorerOrganizations(
  limit = 250,
): Promise<ExplorerOrganizationRow[]> {
  const safeLimit = clampLimit(limit, 1, 500);

  const rows = await sfQuery<SnowflakeRow>(`
    WITH registry_base AS (
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        COUNTRY
      FROM CORE.V_REGISTRY_PUBLIC
    ),
    system_base AS (
      SELECT DISTINCT
        REGISTRY_ID,
        SYSTEM_ID
      FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    )
    SELECT
      rb.ENTITY_NAME AS ORGANIZATION,
      rb.COUNTRY,
      COUNT(DISTINCT rb.REGISTRY_ID) AS PUBLIC_RECORDS,
      COUNT(DISTINCT sb.SYSTEM_ID) AS SYSTEMS
    FROM registry_base rb
    LEFT JOIN system_base sb
      ON sb.REGISTRY_ID = rb.REGISTRY_ID
    WHERE rb.ENTITY_NAME IS NOT NULL
      AND TRIM(rb.ENTITY_NAME) <> ''
    GROUP BY rb.ENTITY_NAME, rb.COUNTRY
    ORDER BY PUBLIC_RECORDS DESC, rb.ENTITY_NAME ASC
    LIMIT ${safeLimit}
  `);

  return rows.map((row) => ({
    organization: toStringValue(row.ORGANIZATION),
    country: toStringValue(row.COUNTRY),
    publicRecords: toNumberValue(row.PUBLIC_RECORDS),
    systems: toNumberValue(row.SYSTEMS),
  }));
}

export async function getExplorerSystems(
  limit = 200,
  offset = 0,
): Promise<ExplorerSystemRow[]> {
  const safeLimit = clampLimit(limit, 1, 500);
  const safeOffset = Math.max(0, Math.floor(offset));

  const rows = await sfQuery<SnowflakeRow>(`
    SELECT
      sys.SYSTEM_ID,
      sys.REGISTRY_ID,
      sys.APPLICATION_ID,
      sys.CASE_ID,

      reg.ENTITY_NAME,
      reg.COUNTRY,
      reg.CERTIFICATION_STATUS,
      score.TIER AS CERTIFIED_TIER,
      score.BAND AS CERTIFIED_BAND,
      reg.CERTIFIED_AT,
      reg.VALID_FROM,
      reg.VALID_TO,
      reg.PUBLISHED_AT,

      sys.SYSTEM_NAME,
      sys.SYSTEM_TYPE,
      sys.INTENDED_USE,
      sys.DEPLOYMENT_STATUS,
      sys.OVERSIGHT_LEVEL,
      sys.RISK_TIER,
      sys.DEVELOPER_ORGANIZATION,
      sys.TRAINING_DATA_CATEGORY,
      sys.OVERSIGHT_MODEL,
      sys.HUMAN_REVIEW_REQUIRED,
      sys.EVALUATION_PROTOCOL,
      sys.AUDIT_FREQUENCY,
      sys.PUBLIC_SUMMARY
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC sys
    INNER JOIN CORE.V_REGISTRY_PUBLIC reg
      ON reg.REGISTRY_ID = sys.REGISTRY_ID
    LEFT JOIN CORE.V_GOVERNANCE_SCORE_CASE score
      ON score.CASE_ID = sys.CASE_ID
    ORDER BY reg.CERTIFIED_AT DESC NULLS LAST, reg.ENTITY_NAME ASC, sys.SYSTEM_ID ASC
    LIMIT ${safeLimit}
    OFFSET ${safeOffset}
  `);

  return rows.map((row) => ({
    systemId: toStringValue(row.SYSTEM_ID),
    registryId: toStringValue(row.REGISTRY_ID),
    applicationId: toStringValue(row.APPLICATION_ID),
    caseId: toStringValue(row.CASE_ID),
    entityName: toStringValue(row.ENTITY_NAME),
    country: toStringValue(row.COUNTRY),
    systemName: toStringValue(row.SYSTEM_NAME),
    systemType: toStringValue(row.SYSTEM_TYPE),
    intendedUse: toStringValue(row.INTENDED_USE),
    deploymentStatus: toStringValue(row.DEPLOYMENT_STATUS),
    oversightLevel: toStringValue(row.OVERSIGHT_LEVEL),
    riskTier: toStringValue(row.RISK_TIER),
    developerOrganization: toStringValue(row.DEVELOPER_ORGANIZATION),
    trainingDataCategory: toStringValue(row.TRAINING_DATA_CATEGORY),
    oversightModel: toStringValue(row.OVERSIGHT_MODEL),
    humanReviewRequired: toBooleanText(row.HUMAN_REVIEW_REQUIRED),
    evaluationProtocol: toStringValue(row.EVALUATION_PROTOCOL),
    auditFrequency: toStringValue(row.AUDIT_FREQUENCY),
    publicSummary: toStringValue(row.PUBLIC_SUMMARY),
    certificationStatus: toStringValue(row.CERTIFICATION_STATUS),
    certifiedTier: toNullableString(row.CERTIFIED_TIER),
    certifiedBand: toNullableString(row.CERTIFIED_BAND),
    certifiedAt: formatDateValue(row.CERTIFIED_AT),
    validFrom: formatDateValue(row.VALID_FROM),
    validTo: formatDateValue(row.VALID_TO),
    publishedAt: formatDateValue(row.PUBLISHED_AT),
  }));
}
import { sfQuery } from "@/lib/snowflake";

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function asBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value;

  const v = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(v)) return true;
  if (["false", "0", "no", "n"].includes(v)) return false;

  return null;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export type ExplorerRegistryRow = {
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
  systemCount: number;
};

export type ExplorerCountryRow = {
  country: string;
  registryCount: number;
  organizationCount: number;
  systemCount: number;
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
  oversightLevel: string | null;
  riskTier: string | null;
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
  decisionStatus: string | null;
  certificationStatus: string | null;
  publicSummary: string | null;
  trainingDataCategory: string | null;
  oversightModel: string | null;
  humanReviewRequired: boolean | null;
  evaluationProtocol: string | null;
  auditFrequency: string | null;
  entityName: string | null;
  country: string | null;
  displayOrder: number | null;
  validFrom: string | null;
  validTo: string | null;
};

export type ExplorerSummary = {
  totalRecords: number;
  totalOrganizations: number;
  totalCountries: number;
  totalSystems: number;
};

function normalizeRegistryRow(row: Record<string, unknown>): ExplorerRegistryRow {
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

function normalizeOrganizationRow(
  row: Record<string, unknown>
): ExplorerOrganizationRow {
  return {
    entityName: asString(row.ENTITY_NAME) ?? "Unknown",
    entityType: asString(row.ENTITY_TYPE),
    country: asString(row.COUNTRY),
    registryCount: asNumber(row.REGISTRY_COUNT) ?? 0,
    systemCount: asNumber(row.SYSTEM_COUNT) ?? 0,
  };
}

function normalizeCountryRow(row: Record<string, unknown>): ExplorerCountryRow {
  return {
    country: asString(row.COUNTRY) ?? "Unknown",
    registryCount: asNumber(row.REGISTRY_COUNT) ?? 0,
    organizationCount: asNumber(row.ORGANIZATION_COUNT) ?? 0,
    systemCount: asNumber(row.SYSTEM_COUNT) ?? 0,
  };
}

function normalizeSystemRow(row: Record<string, unknown>): ExplorerSystemRow {
  return {
    systemId: asString(row.SYSTEM_ID),
    registryId: asString(row.REGISTRY_ID),
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    systemName: asString(row.SYSTEM_NAME),
    systemType: asString(row.SYSTEM_TYPE),
    intendedUse: asString(row.INTENDED_USE),
    deploymentStatus: asString(row.DEPLOYMENT_STATUS),
    oversightLevel: asString(row.OVERSIGHT_LEVEL),
    riskTier: asString(row.RISK_TIER),
    developerOrganization: asString(row.DEVELOPER_ORGANIZATION),
    verificationType: asString(row.VERIFICATION_TYPE),
    modelVersion: asString(row.MODEL_VERSION),
    score: asString(row.SCORE),
    certifiedTier: asString(row.CERTIFIED_TIER),
    certifiedBand: asString(row.CERTIFIED_BAND),
    certifiedAt: asString(row.CERTIFIED_AT),
    renewalStatus: asString(row.RENEWAL_STATUS),
    approvedAt: asString(row.APPROVED_AT),
    publishedAt: asString(row.PUBLISHED_AT),
    registryStatus: asString(row.REGISTRY_STATUS),
    decisionStatus: asString(row.DECISION_STATUS),
    certificationStatus: asString(row.CERTIFICATION_STATUS),
    publicSummary: asString(row.PUBLIC_SUMMARY),
    trainingDataCategory: asString(row.TRAINING_DATA_CATEGORY),
    oversightModel: asString(row.OVERSIGHT_MODEL),
    humanReviewRequired: asBoolean(row.HUMAN_REVIEW_REQUIRED),
    evaluationProtocol: asString(row.EVALUATION_PROTOCOL),
    auditFrequency: asString(row.AUDIT_FREQUENCY),
    entityName: asString(row.ENTITY_NAME),
    country: asString(row.COUNTRY),
    displayOrder: asNumber(row.DISPLAY_ORDER),
    validFrom: asString(row.VALID_FROM),
    validTo: asString(row.VALID_TO),
  };
}

export async function getExplorerRegistry(limit = 50): Promise<ExplorerRegistryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 500));

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
      TO_VARCHAR(VALID_FROM) AS VALID_FROM,
      TO_VARCHAR(VALID_TO) AS VALID_TO,
      TO_VARCHAR(CERTIFIED_AT) AS CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY
      COALESCE(CERTIFIED_AT, VALID_FROM) DESC,
      ENTITY_NAME ASC,
      REGISTRY_ID ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map(normalizeRegistryRow);
}

export async function getRecentRegistryRecords(
  limit = 10
): Promise<ExplorerRegistryRow[]> {
  return getExplorerRegistry(limit);
}

export async function getExplorerOrganizations(
  limit = 200
): Promise<ExplorerOrganizationRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      rp.ENTITY_NAME,
      rp.ENTITY_TYPE,
      rp.COUNTRY,
      COUNT(DISTINCT rp.REGISTRY_ID) AS REGISTRY_COUNT,
      COUNT(DISTINCT s.SYSTEM_ID) AS SYSTEM_COUNT
    FROM CORE.V_REGISTRY_PUBLIC rp
    LEFT JOIN CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
      ON UPPER(TRIM(rp.CASE_ID)) = UPPER(TRIM(s.CASE_ID))
    GROUP BY
      rp.ENTITY_NAME,
      rp.ENTITY_TYPE,
      rp.COUNTRY
    ORDER BY
      REGISTRY_COUNT DESC,
      rp.ENTITY_NAME ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map(normalizeOrganizationRow);
}

export async function getExplorerCountries(
  limit = 200
): Promise<ExplorerCountryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 500));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      rp.COUNTRY,
      COUNT(DISTINCT rp.REGISTRY_ID) AS REGISTRY_COUNT,
      COUNT(DISTINCT rp.ENTITY_NAME) AS ORGANIZATION_COUNT,
      COUNT(DISTINCT s.SYSTEM_ID) AS SYSTEM_COUNT
    FROM CORE.V_REGISTRY_PUBLIC rp
    LEFT JOIN CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
      ON UPPER(TRIM(rp.CASE_ID)) = UPPER(TRIM(s.CASE_ID))
    GROUP BY
      rp.COUNTRY
    ORDER BY
      REGISTRY_COUNT DESC,
      rp.COUNTRY ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map(normalizeCountryRow);
}

export async function getExplorerSystems(limit = 200): Promise<ExplorerSystemRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<Record<string, unknown>>(
    `
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
      s.RISK_TIER,
      s.DEVELOPER_ORGANIZATION,
      s.VERIFICATION_TYPE,
      s.MODEL_VERSION,
      CAST(rp.CERTIFIED_SCORE AS STRING) AS SCORE,
      rp.CERTIFIED_TIER,
      rp.CERTIFIED_BAND,
      TO_VARCHAR(rp.CERTIFIED_AT) AS CERTIFIED_AT,
      CAST(NULL AS STRING) AS RENEWAL_STATUS,
      CAST(NULL AS STRING) AS APPROVED_AT,
      CAST(NULL AS STRING) AS PUBLISHED_AT,
      CAST(NULL AS STRING) AS REGISTRY_STATUS,
      rp.DECISION_STATUS,
      CASE
        WHEN LOWER(COALESCE(rp.DECISION_STATUS, '')) = 'approved' THEN 'Certified'
        WHEN rp.CERTIFIED_TIER IS NOT NULL OR rp.CERTIFIED_BAND IS NOT NULL THEN 'Certified'
        ELSE 'Pending'
      END AS CERTIFICATION_STATUS,
      s.PUBLIC_SUMMARY,
      s.TRAINING_DATA_CATEGORY,
      s.OVERSIGHT_MODEL,
      s.HUMAN_REVIEW_REQUIRED,
      s.EVALUATION_PROTOCOL,
      s.AUDIT_FREQUENCY,
      rp.ENTITY_NAME,
      rp.COUNTRY,
      s.DISPLAY_ORDER,
      TO_VARCHAR(rp.VALID_FROM) AS VALID_FROM,
      TO_VARCHAR(rp.VALID_TO) AS VALID_TO
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
    LEFT JOIN CORE.V_REGISTRY_PUBLIC rp
      ON UPPER(TRIM(rp.CASE_ID)) = UPPER(TRIM(s.CASE_ID))
    ORDER BY
      COALESCE(s.DISPLAY_ORDER, 999999) ASC,
      s.SYSTEM_NAME ASC,
      s.SYSTEM_ID ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map(normalizeSystemRow);
}

export async function getExplorerSummary(): Promise<ExplorerSummary> {
  const [registryRows, organizationRows, countryRows, systemRows] =
    await Promise.all([
      sfQuery<Record<string, unknown>>(
        `
        SELECT COUNT(DISTINCT REGISTRY_ID) AS TOTAL_RECORDS
        FROM CORE.V_REGISTRY_PUBLIC
        `
      ),
      sfQuery<Record<string, unknown>>(
        `
        SELECT COUNT(DISTINCT ENTITY_NAME) AS TOTAL_ORGANIZATIONS
        FROM CORE.V_REGISTRY_PUBLIC
        `
      ),
      sfQuery<Record<string, unknown>>(
        `
        SELECT COUNT(DISTINCT COUNTRY) AS TOTAL_COUNTRIES
        FROM CORE.V_REGISTRY_PUBLIC
        `
      ),
      sfQuery<Record<string, unknown>>(
        `
        SELECT COUNT(DISTINCT SYSTEM_ID) AS TOTAL_SYSTEMS
        FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
        `
      ),
    ]);

  return {
    totalRecords: asNumber(registryRows[0]?.TOTAL_RECORDS) ?? 0,
    totalOrganizations: asNumber(organizationRows[0]?.TOTAL_ORGANIZATIONS) ?? 0,
    totalCountries: asNumber(countryRows[0]?.TOTAL_COUNTRIES) ?? 0,
    totalSystems: asNumber(systemRows[0]?.TOTAL_SYSTEMS) ?? 0,
  };
}
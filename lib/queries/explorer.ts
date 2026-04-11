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

function b(v: unknown): boolean | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;

  const x = String(v).trim().toLowerCase();
  if (["true", "t", "yes", "y", "1"].includes(x)) return true;
  if (["false", "f", "no", "n", "0"].includes(x)) return false;
  return null;
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
  oversightLevel: string | null;
  riskTier: string | null;
  displayOrder: number;
  entityName: string | null;
  country: string | null;
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
      COUNTRY
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY ENTITY_NAME ASC, REGISTRY_ID ASC
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
    certifiedTier: null,
    certifiedBand: null,
    decisionStatus: null,
    certifiedAt: null,
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
      COUNT(DISTINCT rp.REGISTRY_ID) AS REGISTRY_COUNT,
      COUNT(DISTINCT s.SYSTEM_ID) AS SYSTEM_COUNT,
      MAX(s.DECISION_STATUS) AS DECISION_STATUS,
      MAX(TO_VARCHAR(COALESCE(s.PUBLISHED_AT, s.APPROVED_AT))) AS LAST_CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC rp
    LEFT JOIN CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
      ON UPPER(TRIM(s.CASE_ID)) = UPPER(TRIM(rp.CASE_ID))
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
      rp.COUNTRY,
      COUNT(DISTINCT rp.ENTITY_NAME) AS ORGANIZATION_COUNT,
      COUNT(DISTINCT rp.REGISTRY_ID) AS REGISTRY_COUNT,
      MAX(TO_VARCHAR(COALESCE(s.PUBLISHED_AT, s.APPROVED_AT))) AS LAST_CERTIFIED_AT
    FROM CORE.V_REGISTRY_PUBLIC rp
    LEFT JOIN CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
      ON UPPER(TRIM(s.CASE_ID)) = UPPER(TRIM(rp.CASE_ID))
    GROUP BY rp.COUNTRY
    ORDER BY rp.COUNTRY ASC
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
      s.DISPLAY_ORDER,
      s.ENTITY_NAME,
      rp.COUNTRY,
      s.DEVELOPER_ORGANIZATION,
      s.VERIFICATION_TYPE,
      s.MODEL_VERSION,
      CAST(s.SCORE AS STRING) AS SCORE,
      s.CERTIFIED_TIER,
      s.CERTIFIED_BAND,
      TO_VARCHAR(COALESCE(s.PUBLISHED_AT, s.APPROVED_AT)) AS CERTIFIED_AT,
      s.RENEWAL_STATUS,
      TO_VARCHAR(s.APPROVED_AT) AS APPROVED_AT,
      TO_VARCHAR(s.PUBLISHED_AT) AS PUBLISHED_AT,
      s.REGISTRY_STATUS,
      s.DECISION_STATUS,
      s.CERTIFICATION_STATUS,
      s.PUBLIC_SUMMARY,
      s.TRAINING_DATA_CATEGORY,
      s.OVERSIGHT_MODEL,
      s.HUMAN_REVIEW_REQUIRED,
      s.EVALUATION_PROTOCOL,
      s.AUDIT_FREQUENCY,
      TO_VARCHAR(s.CREATED_AT) AS CREATED_AT,
      TO_VARCHAR(s.UPDATED_AT) AS UPDATED_AT
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

  return rows.map((r) => ({
    systemId: s(r.SYSTEM_ID),
    registryId: s(r.REGISTRY_ID),
    applicationId: s(r.APPLICATION_ID),
    caseId: s(r.CASE_ID),
    systemName: s(r.SYSTEM_NAME),
    systemType: s(r.SYSTEM_TYPE),
    intendedUse: s(r.INTENDED_USE),
    deploymentStatus: s(r.DEPLOYMENT_STATUS),
    oversightLevel: s(r.OVERSIGHT_LEVEL),
    riskTier: s(r.RISK_TIER),
    displayOrder: n(r.DISPLAY_ORDER),
    entityName: s(r.ENTITY_NAME),
    country: s(r.COUNTRY),
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
    decisionStatus: s(r.DECISION_STATUS),
    certificationStatus: s(r.CERTIFICATION_STATUS),
    publicSummary: s(r.PUBLIC_SUMMARY),
    trainingDataCategory: s(r.TRAINING_DATA_CATEGORY),
    oversightModel: s(r.OVERSIGHT_MODEL),
    humanReviewRequired: b(r.HUMAN_REVIEW_REQUIRED),
    evaluationProtocol: s(r.EVALUATION_PROTOCOL),
    auditFrequency: s(r.AUDIT_FREQUENCY),
    createdAt: s(r.CREATED_AT),
    updatedAt: s(r.UPDATED_AT),
  }));
}
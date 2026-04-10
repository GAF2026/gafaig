import { sfQuery } from "@/lib/snowflake";

type RawRow = Record<string, unknown>;

export type RegistryAiSystemRow = {
  registryId: string | null;
  systemId: string | null;
  applicationId: string | null;
  caseId: string | null;
  systemName: string | null;
  systemType: string | null;
  intendedUse: string | null;
  displayOrder: number | null;

  entityName: string | null;
  verificationType: string | null;
  modelVersion: string | null;

  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedAt: string | null;
  renewalStatus: string | null;

  approvedAt: string | null;
  publishedAt: string | null;
  registryStatus: string | null;
  createdAt: string | null;
  updatedAt: string | null;

  country: string | null;
  decisionStatus: string | null;
  developerOrganization: string | null;

  deploymentStatus: string | null;
  oversightLevel: string | null;
  riskTier: string | null;
  trainingDataCategory: string | null;
  oversightModel: string | null;
  humanReviewRequired: boolean | null;
  evaluationProtocol: string | null;
  auditFrequency: string | null;
  publicSummary: string | null;
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const s = String(value).trim().toLowerCase();
  if (["true", "t", "yes", "y", "1"].includes(s)) return true;
  if (["false", "f", "no", "n", "0"].includes(s)) return false;
  return null;
}

function normalizeSystemRow(row: RawRow): RegistryAiSystemRow {
  return {
    registryId: asString(row.REGISTRY_ID),
    systemId: asString(row.SYSTEM_ID),
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    systemName: asString(row.SYSTEM_NAME),
    systemType: asString(row.SYSTEM_TYPE),
    intendedUse: asString(row.INTENDED_USE),
    displayOrder: asNumber(row.DISPLAY_ORDER),

    entityName: asString(row.ENTITY_NAME),
    verificationType: asString(row.VERIFICATION_TYPE),
    modelVersion: asString(row.MODEL_VERSION),

    certifiedScore: asString(row.CERTIFIED_SCORE),
    certifiedTier: asString(row.CERTIFIED_TIER),
    certifiedBand: asString(row.CERTIFIED_BAND),
    certifiedAt: asString(row.CERTIFIED_AT),
    renewalStatus: asString(row.RENEWAL_STATUS),

    approvedAt: asString(row.APPROVED_AT),
    publishedAt: asString(row.PUBLISHED_AT),
    registryStatus: asString(row.REGISTRY_STATUS),
    createdAt: asString(row.CREATED_AT),
    updatedAt: asString(row.UPDATED_AT),

    country: asString(row.COUNTRY),
    decisionStatus: asString(row.DECISION_STATUS),
    developerOrganization: asString(row.DEVELOPER_ORGANIZATION),

    deploymentStatus: asString(row.DEPLOYMENT_STATUS),
    oversightLevel: asString(row.OVERSIGHT_LEVEL),
    riskTier: asString(row.RISK_TIER),
    trainingDataCategory: asString(row.TRAINING_DATA_CATEGORY),
    oversightModel: asString(row.OVERSIGHT_MODEL),
    humanReviewRequired: asBoolean(row.HUMAN_REVIEW_REQUIRED),
    evaluationProtocol: asString(row.EVALUATION_PROTOCOL),
    auditFrequency: asString(row.AUDIT_FREQUENCY),
    publicSummary: asString(row.PUBLIC_SUMMARY),
  };
}

const SYSTEMS_SELECT = `
  SELECT
    REGISTRY_ID,
    SYSTEM_ID,
    APPLICATION_ID,
    CASE_ID,
    SYSTEM_NAME,
    SYSTEM_TYPE,
    INTENDED_USE,
    DISPLAY_ORDER,
    ENTITY_NAME,
    VERIFICATION_TYPE,
    MODEL_VERSION,
    CAST(NULL AS STRING) AS CERTIFIED_SCORE,
    CERTIFIED_TIER,
    CERTIFIED_BAND,
    TO_VARCHAR(PUBLISHED_AT) AS CERTIFIED_AT,
    RENEWAL_STATUS,
    TO_VARCHAR(APPROVED_AT) AS APPROVED_AT,
    TO_VARCHAR(PUBLISHED_AT) AS PUBLISHED_AT,
    REGISTRY_STATUS,
    TO_VARCHAR(CREATED_AT) AS CREATED_AT,
    TO_VARCHAR(UPDATED_AT) AS UPDATED_AT,
    CAST(NULL AS STRING) AS COUNTRY,
    CAST(NULL AS STRING) AS DECISION_STATUS,
    CAST(NULL AS STRING) AS DEVELOPER_ORGANIZATION,
    CAST(NULL AS STRING) AS DEPLOYMENT_STATUS,
    CAST(NULL AS STRING) AS OVERSIGHT_LEVEL,
    CAST(NULL AS STRING) AS RISK_TIER,
    CAST(NULL AS STRING) AS TRAINING_DATA_CATEGORY,
    CAST(NULL AS STRING) AS OVERSIGHT_MODEL,
    CAST(NULL AS BOOLEAN) AS HUMAN_REVIEW_REQUIRED,
    CAST(NULL AS STRING) AS EVALUATION_PROTOCOL,
    CAST(NULL AS STRING) AS AUDIT_FREQUENCY,
    CAST(NULL AS STRING) AS PUBLIC_SUMMARY
  FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
`;

export async function getRegistryAiSystems(limit = 250): Promise<RegistryAiSystemRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<RawRow>(
    `
    ${SYSTEMS_SELECT}
    ORDER BY
      COALESCE(DISPLAY_ORDER, 999999) ASC,
      SYSTEM_NAME ASC,
      SYSTEM_ID ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map(normalizeSystemRow);
}

export async function getRegistryAiSystemsPaginated(params?: {
  page?: number;
  pageSize?: number;
}): Promise<{
  rows: RegistryAiSystemRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const page = Math.max(1, Number(params?.page ?? 1));
  const pageSize = Math.max(1, Math.min(Number(params?.pageSize ?? 25), 200));
  const offset = (page - 1) * pageSize;

  const [rows, totalRows] = await Promise.all([
    sfQuery<RawRow>(
      `
      ${SYSTEMS_SELECT}
      ORDER BY
        COALESCE(DISPLAY_ORDER, 999999) ASC,
        SYSTEM_NAME ASC,
        SYSTEM_ID ASC
      LIMIT ? OFFSET ?
      `,
      [pageSize, offset]
    ),
    sfQuery<RawRow>(
      `
      SELECT COUNT(*) AS TOTAL
      FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
      `
    ),
  ]);

  const total = asNumber(totalRows[0]?.TOTAL) ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    rows: rows.map(normalizeSystemRow),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getRegistryAiSystemsByRegistryId(
  registryId: string,
  limit = 100
): Promise<RegistryAiSystemRow[]> {
  const id = String(registryId || "").trim();
  if (!id) return [];

  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<RawRow>(
    `
    ${SYSTEMS_SELECT}
    WHERE UPPER(REGEXP_REPLACE(COALESCE(REGISTRY_ID, ''), '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    ORDER BY
      COALESCE(DISPLAY_ORDER, 999999) ASC,
      SYSTEM_NAME ASC,
      SYSTEM_ID ASC
    LIMIT ?
    `,
    [registryId, safeLimit]
  );

  return rows.map(normalizeSystemRow);
}

export async function getRegistryAiSystemsByCaseId(
  caseId: string,
  limit = 100
): Promise<RegistryAiSystemRow[]> {
  const id = String(caseId || "").trim();
  if (!id) return [];

  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<RawRow>(
    `
    ${SYSTEMS_SELECT}
    WHERE UPPER(REGEXP_REPLACE(COALESCE(CASE_ID, ''), '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    ORDER BY
      COALESCE(DISPLAY_ORDER, 999999) ASC,
      SYSTEM_NAME ASC,
      SYSTEM_ID ASC
    LIMIT ?
    `,
    [caseId, safeLimit]
  );

  return rows.map(normalizeSystemRow);
}

export async function getRegistryAiSystemCount(): Promise<number> {
  const rows = await sfQuery<RawRow>(
    `
    SELECT COUNT(*) AS TOTAL
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    `
  );

  return asNumber(rows[0]?.TOTAL) ?? 0;
}

export const getRegistryAISystems = getRegistryAiSystems;
export const getRegistryAISystemsPaginated = getRegistryAiSystemsPaginated;
export const getRegistryAISystemsByRegistryId = getRegistryAiSystemsByRegistryId;
export const getRegistryAISystemsByCaseId = getRegistryAiSystemsByCaseId;
export const getRegistryAISystemCount = getRegistryAiSystemCount;
import { sfQuery } from "@/lib/snowflake";
import type { RegistryAiSystemRow } from "@/types/registry";

type RawRow = Record<string, unknown>;

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
    entityName: asString(row.ENTITY_NAME),
    country: asString(row.COUNTRY),

    systemName: asString(row.SYSTEM_NAME),
    systemType: asString(row.SYSTEM_TYPE),
    intendedUse: asString(row.INTENDED_USE),

    deploymentStatus: asString(row.DEPLOYMENT_STATUS),
    oversightLevel: asString(row.OVERSIGHT_LEVEL),
    riskTier: asString(row.RISK_TIER),

    developerOrganization: asString(row.DEVELOPER_ORGANIZATION),
    trainingDataCategory: asString(row.TRAINING_DATA_CATEGORY),
    oversightModel: asString(row.OVERSIGHT_MODEL),
    humanReviewRequired: asBoolean(row.HUMAN_REVIEW_REQUIRED),
    evaluationProtocol: asString(row.EVALUATION_PROTOCOL),
    auditFrequency: asString(row.AUDIT_FREQUENCY),

    decisionStatus: asString(row.DECISION_STATUS),
    certificationStatus: asString(row.CERTIFICATION_STATUS),
    certifiedScore: asString(row.CERTIFIED_SCORE),
    certifiedTier: asString(row.CERTIFIED_TIER),
    certifiedBand: asString(row.CERTIFIED_BAND),
    certifiedAt: asString(row.CERTIFIED_AT),
    validFrom: asString(row.VALID_FROM),
    validTo: asString(row.VALID_TO),
    renewalStatus: asString(row.RENEWAL_STATUS),

    verificationType: asString(row.VERIFICATION_TYPE),
    modelVersion: asString(row.MODEL_VERSION),
    score: asString(row.SCORE),
    approvedAt: asString(row.APPROVED_AT),
    publishedAt: asString(row.PUBLISHED_AT),
    registryStatus: asString(row.REGISTRY_STATUS),
    publicSummary: asString(row.PUBLIC_SUMMARY),
    displayOrder: asNumber(row.DISPLAY_ORDER),
    createdAt: asString(row.CREATED_AT),
    updatedAt: asString(row.UPDATED_AT),
  };
}

const SYSTEMS_SELECT = `
  SELECT
    s.REGISTRY_ID,
    s.SYSTEM_ID,
    s.APPLICATION_ID,
    s.CASE_ID,
    s.ENTITY_NAME,
    rp.COUNTRY,

    s.SYSTEM_NAME,
    s.SYSTEM_TYPE,
    s.INTENDED_USE,

    s.DEPLOYMENT_STATUS,
    s.OVERSIGHT_LEVEL,
    s.RISK_TIER,

    s.DEVELOPER_ORGANIZATION,
    s.TRAINING_DATA_CATEGORY,
    s.OVERSIGHT_MODEL,
    s.HUMAN_REVIEW_REQUIRED,
    s.EVALUATION_PROTOCOL,
    s.AUDIT_FREQUENCY,

    s.DECISION_STATUS,
    s.CERTIFICATION_STATUS,
    CAST(NULL AS STRING) AS CERTIFIED_SCORE,
    s.CERTIFIED_TIER,
    s.CERTIFIED_BAND,
    TO_VARCHAR(COALESCE(s.PUBLISHED_AT, s.APPROVED_AT)) AS CERTIFIED_AT,
    TO_VARCHAR(s.VALID_FROM) AS VALID_FROM,
    TO_VARCHAR(s.VALID_TO) AS VALID_TO,
    s.RENEWAL_STATUS,

    s.VERIFICATION_TYPE,
    s.MODEL_VERSION,
    CAST(s.SCORE AS STRING) AS SCORE,
    TO_VARCHAR(s.APPROVED_AT) AS APPROVED_AT,
    TO_VARCHAR(s.PUBLISHED_AT) AS PUBLISHED_AT,
    s.REGISTRY_STATUS,
    s.PUBLIC_SUMMARY,
    s.DISPLAY_ORDER,
    TO_VARCHAR(s.CREATED_AT) AS CREATED_AT,
    TO_VARCHAR(s.UPDATED_AT) AS UPDATED_AT
  FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
  LEFT JOIN CORE.V_REGISTRY_PUBLIC rp
    ON UPPER(TRIM(rp.CASE_ID)) = UPPER(TRIM(s.CASE_ID))
`;

export async function getRegistryAiSystems(
  limit = 250
): Promise<RegistryAiSystemRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<RawRow>(
    `
    ${SYSTEMS_SELECT}
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
        COALESCE(s.DISPLAY_ORDER, 999999) ASC,
        s.SYSTEM_NAME ASC,
        s.SYSTEM_ID ASC
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
    WHERE UPPER(REGEXP_REPLACE(COALESCE(s.REGISTRY_ID, ''), '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    ORDER BY
      COALESCE(s.DISPLAY_ORDER, 999999) ASC,
      s.SYSTEM_NAME ASC,
      s.SYSTEM_ID ASC
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
    WHERE UPPER(REGEXP_REPLACE(COALESCE(s.CASE_ID, ''), '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    ORDER BY
      COALESCE(s.DISPLAY_ORDER, 999999) ASC,
      s.SYSTEM_NAME ASC,
      s.SYSTEM_ID ASC
    LIMIT ?
    `,
    [caseId, safeLimit]
  );

  return rows.map(normalizeSystemRow);
}

export async function getRegistryAiSystemBySystemId(
  systemId: string
): Promise<RegistryAiSystemRow | null> {
  const id = String(systemId || "").trim();
  if (!id) return null;

  const rows = await sfQuery<RawRow>(
    `
    ${SYSTEMS_SELECT}
    WHERE UPPER(REGEXP_REPLACE(COALESCE(s.SYSTEM_ID, ''), '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    ORDER BY
      COALESCE(s.DISPLAY_ORDER, 999999) ASC,
      s.SYSTEM_NAME ASC,
      s.SYSTEM_ID ASC
    LIMIT 1
    `,
    [systemId]
  );

  if (!rows.length) return null;
  return normalizeSystemRow(rows[0]);
}

export async function getRelatedRegistryAiSystems(params: {
  registryId?: string | null;
  excludeSystemId?: string | null;
  limit?: number;
}): Promise<RegistryAiSystemRow[]> {
  const registryId = String(params.registryId || "").trim();
  const excludeSystemId = String(params.excludeSystemId || "").trim();
  const limit = Math.max(1, Math.min(Number(params.limit ?? 6), 24));

  if (!registryId) return [];

  const rows = await sfQuery<RawRow>(
    `
    ${SYSTEMS_SELECT}
    WHERE UPPER(REGEXP_REPLACE(COALESCE(s.REGISTRY_ID, ''), '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
      AND (
        ? = ''
        OR UPPER(REGEXP_REPLACE(COALESCE(s.SYSTEM_ID, ''), '[^A-Za-z0-9]', '')) <>
           UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
      )
    ORDER BY
      COALESCE(s.DISPLAY_ORDER, 999999) ASC,
      s.SYSTEM_NAME ASC,
      s.SYSTEM_ID ASC
    LIMIT ?
    `,
    [registryId, excludeSystemId, excludeSystemId, limit]
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
export const getRegistryAISystemsByRegistryId =
  getRegistryAiSystemsByRegistryId;
export const getRegistryAISystemsByCaseId = getRegistryAiSystemsByCaseId;
export const getRegistryAISystemBySystemId = getRegistryAiSystemBySystemId;
export const getRegistryAISystemCount = getRegistryAiSystemCount;
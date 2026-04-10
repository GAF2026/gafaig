import { sfQuery } from "@/lib/snowflake";

export type RegistryAiSystem = {
  systemId: string;
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
  trainingDataCategory: string | null;
  oversightModel: string | null;
  humanReviewRequired: boolean | null;
  evaluationProtocol: string | null;
  auditFrequency: string | null;

  publicSummary: string | null;

  entityName: string | null;
  country: string | null;

  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedScore: number | null;
  certifiedAt: string | null;
  decisionStatus: string | null;
};

type RegistryAiSystemsPaginatedParams = {
  page?: number;
  pageSize?: number;
};

function toNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str.length > 0 ? str : null;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toNullableBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const normalized = String(value).trim().toLowerCase();
  if (["true", "t", "yes", "y", "1"].includes(normalized)) return true;
  if (["false", "f", "no", "n", "0"].includes(normalized)) return false;

  return null;
}

function toNullableIsoString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(String(value));
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return String(value);
}

function mapRegistryAiSystemRow(
  r: Record<string, unknown>
): RegistryAiSystem {
  return {
    systemId: String(r.SYSTEM_ID ?? ""),
    registryId: toNullableString(r.REGISTRY_ID),
    applicationId: toNullableString(r.APPLICATION_ID),
    caseId: toNullableString(r.CASE_ID),

    systemName: toNullableString(r.SYSTEM_NAME),
    systemType: toNullableString(r.SYSTEM_TYPE),
    intendedUse: toNullableString(r.INTENDED_USE),

    deploymentStatus: toNullableString(r.DEPLOYMENT_STATUS),
    oversightLevel: toNullableString(r.OVERSIGHT_LEVEL),
    riskTier: toNullableString(r.RISK_TIER),

    developerOrganization: toNullableString(r.DEVELOPER_ORGANIZATION),
    trainingDataCategory: toNullableString(r.TRAINING_DATA_CATEGORY),
    oversightModel: toNullableString(r.OVERSIGHT_MODEL),
    humanReviewRequired: toNullableBoolean(r.HUMAN_REVIEW_REQUIRED),
    evaluationProtocol: toNullableString(r.EVALUATION_PROTOCOL),
    auditFrequency: toNullableString(r.AUDIT_FREQUENCY),

    publicSummary: toNullableString(r.PUBLIC_SUMMARY),

    entityName: toNullableString(r.ENTITY_NAME),
    country: null,

    certifiedTier: toNullableString(r.CERTIFIED_TIER),
    certifiedBand: toNullableString(r.CERTIFIED_BAND),
    certifiedScore: toNullableNumber(r.SCORE),
    certifiedAt: toNullableIsoString(r.PUBLISHED_AT),
    decisionStatus: toNullableString(r.REGISTRY_STATUS),
  };
}

const AI_SYSTEMS_SELECT = `
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
    RISK_TIER,
    DEVELOPER_ORGANIZATION,
    TRAINING_DATA_CATEGORY,
    OVERSIGHT_MODEL,
    HUMAN_REVIEW_REQUIRED,
    EVALUATION_PROTOCOL,
    AUDIT_FREQUENCY,
    PUBLIC_SUMMARY,
    ENTITY_NAME,
    CERTIFIED_TIER,
    CERTIFIED_BAND,
    SCORE,
    PUBLISHED_AT,
    REGISTRY_STATUS
  FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
`;

export async function getRegistryAiSystemBySystemId(systemId: string) {
  const id = String(systemId || "").trim();
  if (!id) return null;

  const rows = await sfQuery<Record<string, unknown>>(
    `
    ${AI_SYSTEMS_SELECT}
    WHERE SYSTEM_ID = ?
    LIMIT 1
    `,
    [id]
  );

  const row = rows?.[0];
  if (!row) return null;

  return mapRegistryAiSystemRow(row);
}

export async function getRegistryAiSystemsByRegistryId(registryId: string) {
  const id = String(registryId || "").trim();
  if (!id) return [];

  const rows = await sfQuery<Record<string, unknown>>(
    `
    ${AI_SYSTEMS_SELECT}
    WHERE REGISTRY_ID = ?
    ORDER BY
      COALESCE(ENTITY_NAME, ''),
      COALESCE(SYSTEM_NAME, ''),
      COALESCE(SYSTEM_ID, '')
    `,
    [id]
  );

  return rows.map(mapRegistryAiSystemRow);
}

export async function getRegistryAiSystemsPaginated(
  params: RegistryAiSystemsPaginatedParams = {}
) {
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = Math.max(1, Number(params.pageSize ?? 50));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    ${AI_SYSTEMS_SELECT}
    ORDER BY
      COALESCE(ENTITY_NAME, ''),
      COALESCE(SYSTEM_NAME, ''),
      COALESCE(REGISTRY_ID, '')
    `
  );

  const mapped = rows.map(mapRegistryAiSystemRow);
  const total = mapped.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    rows: mapped.slice(start, end),
    total,
    page,
    pageSize,
  };
}

export async function getRegistryAiSystemsFilterOptions() {
  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT DISTINCT
      CERTIFIED_TIER,
      CERTIFIED_BAND
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY
      CERTIFIED_TIER,
      CERTIFIED_BAND
    `
  );

  return {
    countries: [] as string[],
    tiers: Array.from(
      new Set(
        rows
          .map((r) => toNullableString(r.CERTIFIED_TIER))
          .filter((value): value is string => Boolean(value))
      )
    ),
    bands: Array.from(
      new Set(
        rows
          .map((r) => toNullableString(r.CERTIFIED_BAND))
          .filter((value): value is string => Boolean(value))
      )
    ),
  };
}

export async function getRegistryAiSystemsSummaryStats() {
  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      COUNT(*) AS TOTAL_SYSTEMS,
      COUNT(DISTINCT ENTITY_NAME) AS LINKED_ENTITIES
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    `
  );

  const r = rows?.[0] ?? {};

  return {
    totalSystems: Number(r.TOTAL_SYSTEMS ?? 0),
    linkedEntities: Number(r.LINKED_ENTITIES ?? 0),
    countries: 0,
  };
}
import { executeQuery } from "@/lib/snowflake";

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

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function mapRegistryAiSystemRow(r: any): RegistryAiSystem {
  return {
    systemId: String(r.SYSTEM_ID),
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
    country: toNullableString(r.COUNTRY),

    certifiedTier: toNullableString(r.CERTIFIED_TIER),
    certifiedBand: toNullableString(r.CERTIFIED_BAND),
    certifiedScore: toNullableNumber(r.CERTIFIED_SCORE),
    certifiedAt: toNullableIsoString(r.CERTIFIED_AT),
    decisionStatus: toNullableString(r.DECISION_STATUS),
  };
}

export async function getRegistryAiSystemBySystemId(systemId: string) {
  const safeSystemId = escapeSqlString(systemId);

  const rows = await executeQuery(`
    SELECT *
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE SYSTEM_ID = '${safeSystemId}'
    LIMIT 1
  `);

  const row = rows?.[0];
  if (!row) return null;

  return mapRegistryAiSystemRow(row);
}

export async function getRegistryAiSystemsByRegistryId(registryId: string) {
  const safeRegistryId = escapeSqlString(registryId);

  const rows = await executeQuery(`
    SELECT *
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    WHERE REGISTRY_ID = '${safeRegistryId}'
    ORDER BY
      COALESCE(ENTITY_NAME, ''),
      COALESCE(SYSTEM_NAME, ''),
      COALESCE(SYSTEM_ID, '')
  `);

  return rows.map(mapRegistryAiSystemRow);
}

export async function getRegistryAiSystemsPaginated(
  params: RegistryAiSystemsPaginatedParams = {},
) {
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = Math.max(1, Number(params.pageSize ?? 50));

  const rows = await executeQuery(`
    SELECT *
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY
      COALESCE(ENTITY_NAME, ''),
      COALESCE(SYSTEM_NAME, ''),
      COALESCE(REGISTRY_ID, '')
  `);

  const mapped: RegistryAiSystem[] = rows.map(mapRegistryAiSystemRow);

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
  const rows = await executeQuery(`
    SELECT DISTINCT
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ORDER BY
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND
  `);

  return {
    countries: Array.from(
      new Set(
        rows
          .map((r: any) => toNullableString(r.COUNTRY))
          .filter((value): value is string => Boolean(value)),
      ),
    ),
    tiers: Array.from(
      new Set(
        rows
          .map((r: any) => toNullableString(r.CERTIFIED_TIER))
          .filter((value): value is string => Boolean(value)),
      ),
    ),
    bands: Array.from(
      new Set(
        rows
          .map((r: any) => toNullableString(r.CERTIFIED_BAND))
          .filter((value): value is string => Boolean(value)),
      ),
    ),
  };
}

export async function getRegistryAiSystemsSummaryStats() {
  const rows = await executeQuery(`
    SELECT
      COUNT(*) AS TOTAL_SYSTEMS,
      COUNT(DISTINCT ENTITY_NAME) AS LINKED_ENTITIES,
      COUNT(DISTINCT COUNTRY) AS COUNTRIES
    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
  `);

  const r = rows?.[0] ?? {};

  return {
    totalSystems: Number(r.TOTAL_SYSTEMS ?? 0),
    linkedEntities: Number(r.LINKED_ENTITIES ?? 0),
    countries: Number(r.COUNTRIES ?? 0),
  };
}
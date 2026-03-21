import { snowflakeQuery } from "@/lib/snowflake";

export type RegistryAiSystemRow = {
  systemId: string;
  registryId: string | null;
  applicationId: string | null;
  caseId: string | null;

  systemName: string;
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
  isPublic: boolean | null;
  displayOrder: number | null;
  createdAt: string | null;
  updatedAt: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedScore: number | null;
  certifiedAt: string | null;
  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  lastActivityAt: string | null;
};

export type RegistryAiSystemsSortBy = "name" | "score" | "tier" | "country";
export type RegistryAiSystemsSortOrder = "asc" | "desc";

export type GetRegistryAiSystemsParams = {
  search?: string;
  country?: string;
  tier?: string;
  band?: string;
  sortBy?: RegistryAiSystemsSortBy;
  sortOrder?: RegistryAiSystemsSortOrder;
  page?: number;
  pageSize?: number;
};

export type PaginatedRegistryAiSystemsResult = {
  rows: RegistryAiSystemRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type RegistryAiSystemsFilterOptions = {
  countries: string[];
  tiers: string[];
  bands: string[];
};

export type RegistryAiSystemsSummaryStats = {
  totalSystems: number;
  linkedEntities: number;
  countries: number;
};

function firstString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function firstNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function firstBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return value;

  const s = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(s)) return true;
  if (["false", "0", "no", "n"].includes(s)) return false;

  return null;
}

function normalizeText(value: string | null | undefined): string {
  return String(value ?? "").trim().toUpperCase();
}

function toPositiveInteger(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value) || !value || value < 1) return fallback;
  return Math.floor(value);
}

function clampPageSize(value: number | undefined, fallback = 25, max = 100): number {
  const size = toPositiveInteger(value, fallback);
  return Math.min(size, max);
}

function compareNullableStrings(
  a: string | null,
  b: string | null,
  direction: "asc" | "desc"
): number {
  const av = normalizeText(a);
  const bv = normalizeText(b);

  if (!av && !bv) return 0;
  if (!av) return 1;
  if (!bv) return -1;

  const cmp = av.localeCompare(bv);
  return direction === "desc" ? -cmp : cmp;
}

function compareNullableNumbers(
  a: number | null,
  b: number | null,
  direction: "asc" | "desc"
): number {
  const av = a ?? Number.POSITIVE_INFINITY;
  const bv = b ?? Number.POSITIVE_INFINITY;

  if (av === bv) return 0;
  return direction === "desc" ? bv - av : av - bv;
}

function normalizeRow(row: Record<string, unknown>): RegistryAiSystemRow {
  return {
    systemId: firstString(row.SYSTEM_ID) ?? "",
    registryId: firstString(row.REGISTRY_ID),
    applicationId: firstString(row.APPLICATION_ID),
    caseId: firstString(row.CASE_ID),

    systemName: firstString(row.SYSTEM_NAME) ?? "",
    systemType: firstString(row.SYSTEM_TYPE),
    intendedUse: firstString(row.INTENDED_USE),

    deploymentStatus: firstString(row.DEPLOYMENT_STATUS),
    oversightLevel: firstString(row.OVERSIGHT_LEVEL),
    riskTier: firstString(row.RISK_TIER),
    developerOrganization: firstString(row.DEVELOPER_ORGANIZATION),
    trainingDataCategory: firstString(row.TRAINING_DATA_CATEGORY),
    oversightModel: firstString(row.OVERSIGHT_MODEL),
    humanReviewRequired: firstBoolean(row.HUMAN_REVIEW_REQUIRED),
    evaluationProtocol: firstString(row.EVALUATION_PROTOCOL),
    auditFrequency: firstString(row.AUDIT_FREQUENCY),
    publicSummary: firstString(row.PUBLIC_SUMMARY),
    isPublic: firstBoolean(row.IS_PUBLIC),
    displayOrder: firstNumber(row.DISPLAY_ORDER),
    createdAt: firstString(row.CREATED_AT),
    updatedAt: firstString(row.UPDATED_AT),

    entityName: firstString(row.ENTITY_NAME),
    entityType: firstString(row.ENTITY_TYPE),
    country: firstString(row.COUNTRY),

    certifiedTier: firstString(row.CERTIFIED_TIER),
    certifiedBand: firstString(row.CERTIFIED_BAND),
    certifiedScore: firstNumber(row.CERTIFIED_SCORE),
    certifiedAt: firstString(row.CERTIFIED_AT),
    decisionStatus: firstString(row.DECISION_STATUS),
    validFrom: firstString(row.VALID_FROM),
    validTo: firstString(row.VALID_TO),
    lastActivityAt: firstString(row.LAST_ACTIVITY_AT),
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
    IS_PUBLIC,
    DISPLAY_ORDER,
    CREATED_AT,
    UPDATED_AT,
    ENTITY_NAME,
    ENTITY_TYPE,
    COUNTRY,
    CERTIFIED_TIER,
    CERTIFIED_BAND,
    CERTIFIED_SCORE,
    CERTIFIED_AT,
    DECISION_STATUS,
    VALID_FROM,
    VALID_TO,
    LAST_ACTIVITY_AT
  FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
`;

function applyFilters(
  rows: RegistryAiSystemRow[],
  params: GetRegistryAiSystemsParams
): RegistryAiSystemRow[] {
  return rows.filter((row) => {
    if (params.search?.trim()) {
      const search = normalizeText(params.search);
      const haystack = [
        row.systemId,
        row.registryId,
        row.systemName,
        row.entityName,
        row.developerOrganization,
        row.caseId,
        row.applicationId,
      ]
        .map((v) => normalizeText(v))
        .join(" ");

      if (!haystack.includes(search)) return false;
    }

    if (params.country?.trim()) {
      if (normalizeText(row.country) !== normalizeText(params.country)) return false;
    }

    if (params.tier?.trim()) {
      if (normalizeText(row.certifiedTier) !== normalizeText(params.tier)) return false;
    }

    if (params.band?.trim()) {
      if (normalizeText(row.certifiedBand) !== normalizeText(params.band)) return false;
    }

    return true;
  });
}

function applySort(
  rows: RegistryAiSystemRow[],
  sortBy: RegistryAiSystemsSortBy = "name",
  sortOrder: RegistryAiSystemsSortOrder = "asc"
): RegistryAiSystemRow[] {
  const cloned = [...rows];

  cloned.sort((a, b) => {
    switch (sortBy) {
      case "score": {
        const cmp = compareNullableNumbers(a.certifiedScore, b.certifiedScore, sortOrder);
        if (cmp !== 0) return cmp;
        break;
      }
      case "tier": {
        const cmp = compareNullableStrings(a.certifiedTier, b.certifiedTier, sortOrder);
        if (cmp !== 0) return cmp;
        break;
      }
      case "country": {
        const cmp = compareNullableStrings(a.country, b.country, sortOrder);
        if (cmp !== 0) return cmp;
        break;
      }
      case "name":
      default: {
        const cmp = compareNullableStrings(a.systemName, b.systemName, sortOrder);
        if (cmp !== 0) return cmp;
        break;
      }
    }

    const displayA = a.displayOrder ?? 999999;
    const displayB = b.displayOrder ?? 999999;
    if (displayA !== displayB) return displayA - displayB;

    return compareNullableStrings(a.systemName, b.systemName, "asc");
  });

  return cloned;
}

export async function getRegistryAiSystems(): Promise<RegistryAiSystemRow[]> {
  const sql = `
    ${AI_SYSTEMS_SELECT}
    ORDER BY DISPLAY_ORDER ASC NULLS LAST, SYSTEM_NAME ASC, SYSTEM_ID ASC
  `;

  const rows = await snowflakeQuery<Record<string, unknown>>(sql);
  return rows.map(normalizeRow);
}

export async function getRegistryAiSystemsPaginated(
  params: GetRegistryAiSystemsParams = {}
): Promise<PaginatedRegistryAiSystemsResult> {
  const requestedPage = toPositiveInteger(params.page, 1);
  const pageSize = clampPageSize(params.pageSize, 25, 100);

  const allRows = await getRegistryAiSystems();
  const filteredRows = applyFilters(allRows, params);
  const sortedRows = applySort(filteredRows, params.sortBy, params.sortOrder);

  const total = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = total === 0 ? 1 : Math.min(requestedPage, totalPages);
  const offset = (page - 1) * pageSize;

  return {
    rows: sortedRows.slice(offset, offset + pageSize),
    total,
    page,
    pageSize,
  };
}

export async function getRegistryAiSystemsFilterOptions(): Promise<RegistryAiSystemsFilterOptions> {
  const rows = await getRegistryAiSystems();

  const countries = Array.from(
    new Set(rows.map((row) => row.country).filter((v): v is string => Boolean(v?.trim())))
  ).sort((a, b) => a.localeCompare(b));

  const tiers = Array.from(
    new Set(rows.map((row) => row.certifiedTier).filter((v): v is string => Boolean(v?.trim())))
  ).sort((a, b) => a.localeCompare(b));

  const bands = Array.from(
    new Set(rows.map((row) => row.certifiedBand).filter((v): v is string => Boolean(v?.trim())))
  ).sort((a, b) => a.localeCompare(b));

  return {
    countries,
    tiers,
    bands,
  };
}

export async function getRegistryAiSystemsSummaryStats(): Promise<RegistryAiSystemsSummaryStats> {
  const rows = await getRegistryAiSystems();

  const linkedEntities = new Set(
    rows.map((row) => row.entityName).filter((v): v is string => Boolean(v?.trim()))
  ).size;

  const countries = new Set(
    rows.map((row) => row.country).filter((v): v is string => Boolean(v?.trim()))
  ).size;

  return {
    totalSystems: rows.length,
    linkedEntities,
    countries,
  };
}

export async function getRegistryAiSystemBySystemId(
  systemId: string
): Promise<RegistryAiSystemRow | null> {
  const sql = `
    ${AI_SYSTEMS_SELECT}
    WHERE TRIM(UPPER(SYSTEM_ID)) = TRIM(UPPER(?))
    LIMIT 1
  `;

  const rows = await snowflakeQuery<Record<string, unknown>>(sql, [systemId]);
  return rows[0] ? normalizeRow(rows[0]) : null;
}

export async function getRegistryAiSystemByRegistryId(
  registryId: string
): Promise<RegistryAiSystemRow | null> {
  const sql = `
    ${AI_SYSTEMS_SELECT}
    WHERE TRIM(UPPER(REGISTRY_ID)) = TRIM(UPPER(?))
    ORDER BY DISPLAY_ORDER ASC NULLS LAST, SYSTEM_NAME ASC, SYSTEM_ID ASC
    LIMIT 1
  `;

  const rows = await snowflakeQuery<Record<string, unknown>>(sql, [registryId]);
  return rows[0] ? normalizeRow(rows[0]) : null;
}
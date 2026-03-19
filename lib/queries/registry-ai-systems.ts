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

function firstString(...values: any[]): string | null {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return null;
}

function firstNumber(...values: any[]): number | null {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function firstBoolean(...values: any[]): boolean | null {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    if (typeof value === "boolean") return value;
    const s = String(value).trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(s)) return true;
    if (["false", "0", "no", "n"].includes(s)) return false;
  }
  return null;
}

function compareNullableStrings(
  a: string | null,
  b: string | null,
  direction: "asc" | "desc"
): number {
  const av = (a ?? "").toUpperCase();
  const bv = (b ?? "").toUpperCase();

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

function normalizeRow(row: Record<string, any>): RegistryAiSystemRow {
  return {
    systemId: firstString(row.SYSTEM_ID) ?? "",
    registryId: firstString(row.REGISTRY_ID),
    applicationId: firstString(row.APPLICATION_ID),
    caseId: firstString(row.CASE_ID),

    systemName: firstString(row.SYSTEM_NAME) ?? "",
    systemType: firstString(row.SYSTEM_TYPE),
    intendedUse: firstString(row.INTENDED_USE),

    deploymentStatus: firstString(
      row.DEPLOYMENT_STATUS,
      row.DEPLOYMENT_SCOPE,
      row.SYSTEM_STATUS,
      row.STATUS
    ),
    oversightLevel: firstString(row.OVERSIGHT_LEVEL, row.OVERSIGHT_MODEL),
    riskTier: firstString(row.RISK_TIER, row.RISK_LEVEL),
    developerOrganization: firstString(
      row.DEVELOPER_ORGANIZATION,
      row.DEVELOPER_ORG
    ),
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

    certifiedTier: firstString(row.CERTIFIED_TIER, row.TIER),
    certifiedBand: firstString(row.CERTIFIED_BAND, row.BAND),
    certifiedScore: firstNumber(row.CERTIFIED_SCORE, row.SCORE, row.FINAL_SCORE),
    certifiedAt: firstString(row.CERTIFIED_AT, row.APPROVED_AT, row.PUBLISHED_AT),
    decisionStatus: firstString(row.DECISION_STATUS, row.REGISTRY_STATUS, row.STATUS),
    validFrom: firstString(row.VALID_FROM, row.APPROVED_AT),
    validTo: firstString(row.VALID_TO),
    lastActivityAt: firstString(row.LAST_ACTIVITY_AT, row.PUBLISHED_AT, row.CREATED_AT),
  };
}

const baseSelect = `
  SELECT *
  FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
`;

function toPositiveInteger(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value) || !value || value < 1) return fallback;
  return Math.floor(value);
}

function clampPageSize(value: number | undefined, fallback = 25, max = 100): number {
  const size = toPositiveInteger(value, fallback);
  return Math.min(size, max);
}

function normalizeText(value: string | null | undefined): string {
  return String(value ?? "").trim().toUpperCase();
}

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
        const cmp = compareNullableNumbers(
          a.certifiedScore,
          b.certifiedScore,
          sortOrder
        );
        if (cmp !== 0) return cmp;
        break;
      }
      case "tier": {
        const cmp = compareNullableStrings(
          a.certifiedTier,
          b.certifiedTier,
          sortOrder
        );
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
    ${baseSelect}
  `;

  const rows = await snowflakeQuery<Record<string, any>>(sql);
  const normalized = rows.map(normalizeRow);

  return applySort(normalized, "name", "asc");
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
  const rows = await getRegistryAiSystems();
  const match = rows.find(
    (row) => normalizeText(row.systemId) === normalizeText(systemId)
  );
  return match ?? null;
}

export async function getRegistryAiSystemByRegistryId(
  registryId: string
): Promise<RegistryAiSystemRow | null> {
  const rows = await getRegistryAiSystems();
  const match = rows.find(
    (row) => normalizeText(row.registryId) === normalizeText(registryId)
  );
  return match ?? null;
}
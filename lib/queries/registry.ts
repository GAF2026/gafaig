import { sfQuery } from "@/lib/snowflake";

export type RegistryDecisionStatus =
  | "APPROVED"
  | "REJECTED"
  | "REVOKED"
  | "EXPIRED"
  | "PENDING"
  | string;

export interface RegistryRecord {
  registrySnapshotId: string | null;
  registryId: string;
  orgId: string | null;
  caseId: string | null;
  applicationId: string | null;
  entityName: string;
  entityType: string | null;
  country: string | null;
  verificationType: string | null;
  modelVersion: string | null;
  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedAt: string | null;
  certificationStatus: string | null;
  decisionStatus: RegistryDecisionStatus | null;
  validFrom: string | null;
  validTo: string | null;
  publishedAt: string | null;
  approvedAt: string | null;
  lifecycleStatus: string | null;
  renewalStatus: string | null;
  isCertified: boolean;
  isApprovedOnly: boolean;
  trustLabel: "Verified" | "Approved";
  recordKind: "registry_certified" | "explorer_approved";
}

export interface RegistryListFilters {
  q?: string;
  country?: string;
  registryId?: string;
  caseId?: string;
  applicationId?: string;
  entityName?: string;
  limit?: number;
  offset?: number;
  certifiedOnly?: boolean;
}

export interface RegistrySummary {
  totalRegistryRecords: number;
  certifiedCount: number;
  approvedCount: number;
  countryCount: number;
}

type SnowflakeRow = Record<string, unknown>;

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function asUpper(value: unknown): string | null {
  const text = asString(value);
  return text ? text.toUpperCase() : null;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function asScoreString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function normalizeDecisionStatus(
  row: SnowflakeRow
): RegistryDecisionStatus | null {
  return asUpper(row.DECISION_STATUS) ?? asUpper(row.decision_status) ?? null;
}

function normalizeCertificationStatus(row: SnowflakeRow): string | null {
  return (
    asString(row.CERTIFICATION_STATUS) ??
    asString(row.certification_status) ??
    null
  );
}

function normalizeRecord(row: SnowflakeRow): RegistryRecord {
  const registryId =
    asString(row.REGISTRY_ID) ?? asString(row.registry_id) ?? "";

  const certifiedAt =
    asString(row.CERTIFIED_AT) ?? asString(row.certified_at) ?? null;
  const certifiedScore =
    asScoreString(row.CERTIFIED_SCORE) ??
    asScoreString(row.certified_score) ??
    null;
  const certifiedTier =
    asString(row.CERTIFIED_TIER) ?? asString(row.certified_tier) ?? null;
  const certifiedBand =
    asString(row.CERTIFIED_BAND) ?? asString(row.certified_band) ?? null;

  const certificationStatus = normalizeCertificationStatus(row);
  const decisionStatus = normalizeDecisionStatus(row);

  const isCertified =
    certifiedAt !== null ||
    certifiedScore !== null ||
    certifiedTier !== null ||
    certifiedBand !== null ||
    (certificationStatus ?? "").toLowerCase() === "certified";

  return {
    registrySnapshotId:
      asString(row.REGISTRY_SNAPSHOT_ID) ??
      asString(row.registry_snapshot_id) ??
      null,
    registryId,
    orgId: asString(row.ORG_ID) ?? asString(row.org_id) ?? null,
    caseId: asString(row.CASE_ID) ?? asString(row.case_id) ?? null,
    applicationId:
      asString(row.APPLICATION_ID) ?? asString(row.application_id) ?? null,
    entityName:
      asString(row.ENTITY_NAME) ??
      asString(row.entity_name) ??
      "Unknown Entity",
    entityType: asString(row.ENTITY_TYPE) ?? asString(row.entity_type) ?? null,
    country: asString(row.COUNTRY) ?? asString(row.country) ?? null,
    verificationType:
      asString(row.VERIFICATION_TYPE) ??
      asString(row.verification_type) ??
      null,
    modelVersion: asString(row.MODEL_VERSION) ?? asString(row.model_version) ?? null,
    certifiedScore: isCertified ? certifiedScore : null,
    certifiedTier: isCertified ? certifiedTier : null,
    certifiedBand: isCertified ? certifiedBand : null,
    certifiedAt: isCertified ? certifiedAt : null,
    certificationStatus: isCertified ? "Certified" : "Not Certified",
    decisionStatus,
    validFrom: asString(row.VALID_FROM) ?? asString(row.valid_from) ?? null,
    validTo: asString(row.VALID_TO) ?? asString(row.valid_to) ?? null,
    publishedAt: asString(row.PUBLISHED_AT) ?? asString(row.published_at) ?? null,
    approvedAt: asString(row.APPROVED_AT) ?? asString(row.approved_at) ?? null,
    lifecycleStatus:
      asString(row.LIFECYCLE_STATUS) ?? asString(row.lifecycle_status) ?? null,
    renewalStatus:
      asString(row.RENEWAL_STATUS) ?? asString(row.renewal_status) ?? null,
    isCertified,
    isApprovedOnly: !isCertified && decisionStatus === "APPROVED",
    trustLabel: isCertified ? "Verified" : "Approved",
    recordKind: isCertified ? "registry_certified" : "explorer_approved",
  };
}

function buildRegistryFilters(filters: RegistryListFilters) {
  const where: string[] = [];
  const binds: Array<string | number> = [];

  if (filters.certifiedOnly) {
    where.push(
      "(CERTIFIED_AT IS NOT NULL OR UPPER(COALESCE(CERTIFICATION_STATUS, '')) = 'CERTIFIED')"
    );
  }

  if (filters.country && filters.country.trim()) {
    where.push("UPPER(COALESCE(COUNTRY, '')) = UPPER(?)");
    binds.push(filters.country.trim());
  }

  if (filters.registryId && filters.registryId.trim()) {
    where.push("UPPER(COALESCE(REGISTRY_ID, '')) = UPPER(?)");
    binds.push(filters.registryId.trim());
  }

  if (filters.caseId && filters.caseId.trim()) {
    where.push("UPPER(COALESCE(CASE_ID, '')) = UPPER(?)");
    binds.push(filters.caseId.trim());
  }

  if (filters.applicationId && filters.applicationId.trim()) {
    where.push("UPPER(COALESCE(APPLICATION_ID, '')) = UPPER(?)");
    binds.push(filters.applicationId.trim());
  }

  if (filters.entityName && filters.entityName.trim()) {
    where.push("COALESCE(ENTITY_NAME, '') ILIKE ?");
    binds.push(`%${filters.entityName.trim()}%`);
  }

  if (filters.q && filters.q.trim()) {
    const q = `%${filters.q.trim()}%`;
    where.push(`
      (
        COALESCE(ENTITY_NAME, '') ILIKE ? OR
        COALESCE(REGISTRY_ID, '') ILIKE ? OR
        COALESCE(APPLICATION_ID, '') ILIKE ? OR
        COALESCE(CASE_ID, '') ILIKE ?
      )
    `);
    binds.push(q, q, q, q);
  }

  const limit =
    Number.isFinite(filters.limit) && filters.limit !== undefined
      ? Math.max(1, Math.min(Number(filters.limit), 500))
      : 100;

  const offset =
    Number.isFinite(filters.offset) && filters.offset !== undefined
      ? Math.max(0, Number(filters.offset))
      : 0;

  return {
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
    binds,
    limit,
    offset,
  };
}

function normalizeListArgs(
  input?: RegistryListFilters | number
): RegistryListFilters {
  if (typeof input === "number") {
    return { limit: input };
  }

  if (!input || typeof input !== "object") {
    return {};
  }

  return input;
}

export async function getRegistryRecords(
  input: RegistryListFilters | number = {}
): Promise<RegistryRecord[]> {
  const filters = normalizeListArgs(input);
  const { whereSql, binds, limit, offset } = buildRegistryFilters(filters);

  const rows = await sfQuery<SnowflakeRow>(
    `
      SELECT *
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ${whereSql}
      ORDER BY COALESCE(CERTIFIED_AT, PUBLISHED_AT, APPROVED_AT) DESC, REGISTRY_ID ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `,
    binds
  );

  return rows.map(normalizeRecord);
}

export async function searchRegistryRecords(
  filters: RegistryListFilters = {}
): Promise<RegistryRecord[]> {
  return getRegistryRecords(filters);
}

export async function getRegistryRecordById(
  registryId: string
): Promise<RegistryRecord | null> {
  const value = registryId.trim();
  if (!value) return null;

  const rows = await sfQuery<SnowflakeRow>(
    `
      SELECT *
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM(?))
      QUALIFY ROW_NUMBER() OVER (
        PARTITION BY UPPER(TRIM(REGISTRY_ID))
        ORDER BY COALESCE(CERTIFIED_AT, PUBLISHED_AT, APPROVED_AT) DESC
      ) = 1
    `,
    [value]
  );

  if (!rows.length) return null;
  return normalizeRecord(rows[0]);
}

export async function getRegistryByRegistryId(
  registryId: string
): Promise<RegistryRecord | null> {
  return getRegistryRecordById(registryId);
}

export async function getRegistryRecord(
  registryId: string
): Promise<RegistryRecord | null> {
  return getRegistryRecordById(registryId);
}

export async function getRegistrySummary(): Promise<RegistrySummary> {
  const rows = await sfQuery<SnowflakeRow>(
    `
      SELECT
        COUNT(*) AS TOTAL_REGISTRY_RECORDS,
        COUNT_IF(
          CERTIFIED_AT IS NOT NULL OR UPPER(COALESCE(CERTIFICATION_STATUS, '')) = 'CERTIFIED'
        ) AS CERTIFIED_COUNT,
        COUNT_IF(
          CERTIFIED_AT IS NULL AND UPPER(COALESCE(DECISION_STATUS, '')) = 'APPROVED'
        ) AS APPROVED_COUNT,
        COUNT(DISTINCT NULLIF(TRIM(COUNTRY), '')) AS COUNTRY_COUNT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    `
  );

  const row = rows[0] ?? {};
  return {
    totalRegistryRecords:
      asNumber(row.TOTAL_REGISTRY_RECORDS) ??
      asNumber(row.total_registry_records) ??
      0,
    certifiedCount:
      asNumber(row.CERTIFIED_COUNT) ?? asNumber(row.certified_count) ?? 0,
    approvedCount:
      asNumber(row.APPROVED_COUNT) ?? asNumber(row.approved_count) ?? 0,
    countryCount:
      asNumber(row.COUNTRY_COUNT) ?? asNumber(row.country_count) ?? 0,
  };
}

export async function getRegistryCountries(): Promise<string[]> {
  const rows = await sfQuery<SnowflakeRow>(
    `
      SELECT DISTINCT COUNTRY
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      WHERE COUNTRY IS NOT NULL AND TRIM(COUNTRY) <> ''
      ORDER BY COUNTRY ASC
    `
  );

  return rows
    .map((row) => asString(row.COUNTRY) ?? asString(row.country))
    .filter((value): value is string => Boolean(value));
}
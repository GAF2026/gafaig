import { sfQuery } from "@/lib/snowflake";

export type RegistryRecord = {
  registrySnapshotId: string | null;
  registryId: string | null;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certificationStatus: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  lifecycleStatus: string | null;
  visibilityStatus: string | null;
  verificationEligible: boolean | string | null;
  badgeEligible: boolean | string | null;
  renewalStatus: string | null;
  publishedAt: string | null;
};

export type RegistryFilterOptions = {
  countries: string[];
  organizations: string[];
  entityTypes: string[];
  statuses: string[];
  lifecycleStatuses: string[];
  visibilityStatuses: string[];
};

type SearchRegistryParams = {
  q?: string;
  country?: string;
  registryId?: string;
  limit?: number;
};

function esc(value: string): string {
  return String(value).replace(/'/g, "''");
}

function toLimit(value?: number): number {
  const n = Number(value ?? 50);
  if (!Number.isFinite(n)) return 50;
  return Math.min(Math.max(Math.trunc(n), 1), 500);
}

/**
 * 🔁 UPDATED SAFE SELECT FIELDS (per instruction)
 */
const SELECT_FIELDS = `
  REGISTRY_ID,
  ENTITY_NAME,
  COUNTRY,
  CERTIFICATION_STATUS,
  CERTIFIED_AT,
  VALID_FROM,
  VALID_TO,
  PUBLISHED_AT
`;

/**
 * 🔁 ADDED: Row mapper (per instruction)
 */
function toRegistryRow(row: any): RegistryRecord {
  return {
    registrySnapshotId: row.REGISTRY_SNAPSHOT_ID ?? null,
    registryId: row.REGISTRY_ID ?? null,
    applicationId: row.APPLICATION_ID ?? null,
    caseId: row.CASE_ID ?? null,
    entityName: row.ENTITY_NAME ?? null,
    entityType: row.ENTITY_TYPE ?? null,
    country: row.COUNTRY ?? null,
    certificationStatus: row.CERTIFICATION_STATUS ?? null,
    validFrom: row.VALID_FROM ?? null,
    validTo: row.VALID_TO ?? null,
    certifiedAt: row.CERTIFIED_AT ?? null,
    lifecycleStatus: row.LIFECYCLE_STATUS ?? null,
    visibilityStatus: row.VISIBILITY_STATUS ?? null,
    verificationEligible: row.VERIFICATION_ELIGIBLE ?? null,
    badgeEligible: row.BADGE_ELIGIBLE ?? null,
    renewalStatus: row.RENEWAL_STATUS ?? null,
    publishedAt: row.PUBLISHED_AT ?? null,
  };
}

/**
 * 🔥 CRITICAL: LIMIT FIRST (performance fix)
 */
function baseLimitedSubquery(limit: number) {
  return `
    SELECT ${SELECT_FIELDS}
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY PUBLISHED_AT DESC
    LIMIT ${limit}
  `;
}

export async function getRegistryRecords(limit = 50): Promise<RegistryRecord[]> {
  const safeLimit = toLimit(limit);

  const rows = await sfQuery<any>(`
    SELECT ${SELECT_FIELDS}
    FROM (${baseLimitedSubquery(safeLimit)}) t
    ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
  `);

  return rows.map(toRegistryRow);
}

export async function searchRegistryRecords(
  params: SearchRegistryParams = {}
): Promise<RegistryRecord[]> {
  const safeLimit = toLimit(params.limit ?? 50);

  const where: string[] = [];

  if (params.registryId?.trim()) {
    where.push(`UPPER(REGISTRY_ID) = UPPER('${esc(params.registryId.trim())}')`);
  }

  if (params.country?.trim()) {
    where.push(`UPPER(COUNTRY) = UPPER('${esc(params.country.trim())}')`);
  }

  if (params.q?.trim()) {
    const q = esc(params.q.trim());
    where.push(`
      (
        UPPER(COALESCE(REGISTRY_ID, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(ENTITY_NAME, '')) LIKE UPPER('%${q}%')
      )
    `);
  }

  const whereSql = where.length ? `WHERE ${where.join("\n AND ")}` : "";

  const rows = await sfQuery<any>(`
    SELECT ${SELECT_FIELDS}
    FROM (${baseLimitedSubquery(500)}) t
    ${whereSql}
    ORDER BY PUBLISHED_AT DESC
    LIMIT ${safeLimit}
  `);

  return rows.map(toRegistryRow);
}

export async function getRegistryRecordById(
  registryId: string
): Promise<RegistryRecord | null> {
  const value = registryId.trim();
  if (!value) return null;

  const rows = await sfQuery<any>(`
    SELECT ${SELECT_FIELDS}
    FROM CORE.V_REGISTRY_PUBLIC
    WHERE REGISTRY_ID = '${esc(value)}'
    LIMIT 1
  `);

  return rows[0] ? toRegistryRow(rows[0]) : null;
}

/**
 * 🔥 PERFORMANCE FIX: remove full DISTINCT scan
 */
export async function getRegistryFilterOptions(): Promise<RegistryFilterOptions> {
  const rows = await sfQuery<{
    country: string | null;
    organization: string | null;
    entityType: string | null;
    certificationStatus: string | null;
    lifecycleStatus: string | null;
    visibilityStatus: string | null;
  }>(`
    SELECT
      COUNTRY              AS "country",
      ENTITY_NAME          AS "organization",
      NULL                 AS "entityType",
      CERTIFICATION_STATUS AS "certificationStatus",
      NULL                 AS "lifecycleStatus",
      NULL                 AS "visibilityStatus"
    FROM (${baseLimitedSubquery(500)})
  `);

  const countries = new Set<string>();
  const organizations = new Set<string>();
  const entityTypes = new Set<string>();
  const statuses = new Set<string>();
  const lifecycleStatuses = new Set<string>();
  const visibilityStatuses = new Set<string>();

  for (const row of rows) {
    if (row.country) countries.add(row.country);
    if (row.organization) organizations.add(row.organization);
    if (row.entityType) entityTypes.add(row.entityType);
    if (row.certificationStatus) statuses.add(row.certificationStatus);
    if (row.lifecycleStatus) lifecycleStatuses.add(row.lifecycleStatus);
    if (row.visibilityStatus) visibilityStatuses.add(row.visibilityStatus);
  }

  return {
    countries: Array.from(countries).sort(),
    organizations: Array.from(organizations).sort(),
    entityTypes: Array.from(entityTypes).sort(),
    statuses: Array.from(statuses).sort(),
    lifecycleStatuses: Array.from(lifecycleStatuses).sort(),
    visibilityStatuses: Array.from(visibilityStatuses).sort(),
  };
}
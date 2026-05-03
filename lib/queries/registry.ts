import { sfQuery } from "@/lib/snowflake";

export type RegistryRecord = {
  registrySnapshotId: string | null;
  registryId: string;
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
  caseId?: string;
  applicationId?: string;
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

const SELECT_FIELDS = `
  REGISTRY_SNAPSHOT_ID   AS "registrySnapshotId",
  REGISTRY_ID            AS "registryId",
  APPLICATION_ID         AS "applicationId",
  CASE_ID                AS "caseId",
  ENTITY_NAME            AS "entityName",
  ENTITY_TYPE            AS "entityType",
  COUNTRY                AS "country",
  CERTIFICATION_STATUS   AS "certificationStatus",
  CERTIFIED_AT           AS "certifiedAt",
  VALID_FROM             AS "validFrom",
  VALID_TO               AS "validTo",
  LIFECYCLE_STATUS       AS "lifecycleStatus",
  VISIBILITY_STATUS      AS "visibilityStatus",
  VERIFICATION_ELIGIBLE  AS "verificationEligible",
  BADGE_ELIGIBLE         AS "badgeEligible",
  RENEWAL_STATUS         AS "renewalStatus",
  PUBLISHED_AT           AS "publishedAt"
`;

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

  return sfQuery<RegistryRecord>(`
    SELECT ${SELECT_FIELDS}
    FROM (${baseLimitedSubquery(safeLimit)}) t
    ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
  `);
}

export async function searchRegistryRecords(
  params: SearchRegistryParams = {}
): Promise<RegistryRecord[]> {
  const safeLimit = toLimit(params.limit ?? 50);

  const where: string[] = [];

  if (params.registryId?.trim()) {
    where.push(`UPPER(REGISTRY_ID) = UPPER('${esc(params.registryId.trim())}')`);
  }

  if (params.caseId?.trim()) {
    where.push(`UPPER(CASE_ID) = UPPER('${esc(params.caseId.trim())}')`);
  }

  if (params.applicationId?.trim()) {
    where.push(
      `UPPER(APPLICATION_ID) = UPPER('${esc(params.applicationId.trim())}')`
    );
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

  return sfQuery<RegistryRecord>(`
    SELECT ${SELECT_FIELDS}
    FROM (${baseLimitedSubquery(500)}) t
    ${whereSql}
    ORDER BY PUBLISHED_AT DESC
    LIMIT ${safeLimit}
  `);
}

export async function getRegistryRecordById(
  registryId: string
): Promise<RegistryRecord | null> {
  const value = registryId.trim();
  if (!value) return null;

  const rows = await sfQuery<RegistryRecord>(`
    SELECT ${SELECT_FIELDS}
    FROM CORE.V_REGISTRY_PUBLIC
    WHERE REGISTRY_ID = '${esc(value)}'
    LIMIT 1
  `);

  return rows[0] ?? null;
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
      ENTITY_TYPE          AS "entityType",
      CERTIFICATION_STATUS AS "certificationStatus",
      LIFECYCLE_STATUS     AS "lifecycleStatus",
      VISIBILITY_STATUS    AS "visibilityStatus"
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